const { localKeys } = require('./local_keys');
const fs = require('fs');
const AWS = require('aws-sdk');

const S3 = new AWS.S3({
  signatureVersion: 'v4'
});

async function push() {
  fs.writeFile(`./matches/keys.json`, JSON.stringify(localKeys()), (err) => { console.log(err) });
  localKeys().forEach(function(key) {
    console.log(`matches/${key}`)
    fs.readFile(`./matches/${key}`, "utf8", function read(err, data) {
      if (err) {
          throw err;
      }
      to_s3(data, key)
    });
  });
  to_s3(JSON.stringify(localKeys()), 'keys.json');
}

function to_s3(data, key) {
  S3.putObject({
    Body: data,
    Bucket: 'ul-haystacker-umbra',
    ContentType: 'application/json',
    Key: key
  }, function(err, s3Data) {
    if (err) throw err;
  });
}

push();

