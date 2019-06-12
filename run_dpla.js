const AWS = require('aws-sdk');
const fs = require('fs');
const { app } = require('./app');
// const { localKeys } = require('./local_keys');
const { s3Push } = require('./s3_push');
const { wipeLocalData } = require('./wipe_data');

const S3 = new AWS.S3({
  signatureVersion: 'v4'
});

var bucket = 'dpla-provider-export';
var MATCH_BUCKET = 'ul-haystacker-umbra'

function getLatestDplaAndMatch() {
  var today = new Date();
  var month = ('0' + (today.getMonth()+1)).slice(-2)
  prefix = `${today.getFullYear()}/${month}/all.jsonl/`
  return S3.listObjects({Bucket: bucket, Prefix: prefix}, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
      let items = data.Contents
      if (items.length > 0 ) {
        items.map((item) => saveExport(item.Key))
      } else {
        console.log(`No New DPLA Dump Available For Download for ${prefix}`)
      }
    }
  });
}

function saveExport(key) {
  filename = key.split('/')[key.split('/').length -1]
  if (filename.match(/^part/i)) {
    console.log(`Downloading Fresh DPLA Dump: ${key}`)
    var params = {
      Bucket: bucket,
      Key: key
     };

     fs.writeFile(`./dpla_data/${filename}`, '', (err) => { console.log(err) });
     var jsonFile = require('fs').createWriteStream(`./dpla_data/${filename}`);
     S3.getObject(params).createReadStream().pipe(jsonFile);

     jsonFile.on('close', function(){
      runMatcher(jsonFile.path)
    });
  }
}

function runMatcher(inputFile) {
  console.log(`Running Matcher On: ${inputFile}`);
  app({ regexURL: 'https://lib-metl-prd-01.oit.umn.edu/lookups/34.json',
      inputFile: inputFile,
      bucket: MATCH_BUCKET,
      batchDir: 'matches'
  }).subscribe(
    () => {},
    (err) => { console.log(err) },
    () => {
      console.log(`Completed Matcher for ${inputFile}`);
    }
  );
}

async function haystackBuketItems() {
  let isTruncated = true;
  let marker;
  let items = []
  while(isTruncated) {
    let params = { Bucket: MATCH_BUCKET };
    if (marker) params.Marker = marker;
    try {
      const response = await S3.listObjects(params).promise();
      items = items.concat(response.Contents)
      isTruncated = response.IsTruncated;
      if (isTruncated) {
        marker = response.Contents.slice(-1)[0].Key;
      }
  } catch(error) {
      throw error;
    }
  }
  return items;
}

async function s3delete(item) {
  await S3.deleteObject({ Bucket: MATCH_BUCKET, Key: item.Key }, function(err, data) {
    if (err) console.log(err, err.stack);  // error
    else     console.log(`${item.Key} Deleted`);                 // deleted
  });
}

async function run() {
  wipeLocalData();
  let items =  await haystackBuketItems();
  items.map( (item) => {
    s3delete(item)
  })
  await getLatestDplaAndMatch();
}

run();