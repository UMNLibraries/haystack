const AWS = require('aws-sdk');
const fs = require('fs');

const { fileSaver } = require('./file_saver');

const S3 = new AWS.S3({
  signatureVersion: 'v4'
});

var bucket = 'dpla-provider-export';

function getLatestDpla() {
  var today = new Date();
  prefix = `${today.getFullYear()}/${today.getMonth() + 1}/all`
  return S3.listObjects({Bucket: bucket, Prefix: prefix}, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
      let items = data.Contents
      if (items.length > 0 ) {
        saveExport(items[items.length -1].Key)
      } else {
        console.log(`No New DPLA Dump Available For Download for ${prefix}`)
      }
    }
  });
}

function saveExport(key) {
  console.log(`Downloading Fresh DPLA Dump: ${key}`)
  var params = {
    Bucket: bucket,
    Key: key
   };
   var jsonFile = require('fs').createWriteStream('./dpla.json.gz');
   S3.getObject(params).createReadStream().pipe(jsonFile);
}

getLatestDpla();