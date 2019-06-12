const AWS = require('aws-sdk');
const fs = require('fs');
const { app } = require('./app');
const { wipeLocalData } = require('./wipe_data');
const rimraf = require('rimraf');

const S3 = new AWS.S3({
  signatureVersion: 'v4'
});


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
      batchDir: 'matches'
  }).subscribe(
    () => {},
    (err) => { console.log(err) },
    () => {
      console.log(`Completed Matcher for ${inputFile}`);
    }
  );
}

async function runLocal() {
  await wipeLocalData();
  fs.readdir('./dpla_data', (err, files) => {
    files.forEach(file => {
      console.log(`Matching file ${file}`)
      runMatcher(`./dpla_data/${file}`)
    });
  });
}

runLocal();