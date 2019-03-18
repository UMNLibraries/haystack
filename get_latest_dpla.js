const AWS = require('aws-sdk');
const fs = require('fs');

const { fileSaver } = require('./file_saver');

const S3 = new AWS.S3({
  signatureVersion: 'v4'
});

var bucket = 'dpla-provider-export';

function getLatestDpla() {
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
  }
}

getLatestDpla();