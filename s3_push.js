const AWS = require('aws-sdk');
const Rx = require('rx');

const S3 = new AWS.S3({
  signatureVersion: 'v4'
});

module.exports.s3Push = (jsonFile, bucket = false, key = false) => {
  return Rx.Observable.create(observer => {
    if (!jsonFile) {
      observer.onNext(jsonFile)
      return;
    }
    if (!bucket) {
      observer.onNext(jsonFile);
      observer.onCompleted();
      return;
    }
    if (!key) key = jsonFile.name
    S3.putObject({
      Body: jsonFile.json,
      Bucket: bucket,
      ContentType: 'application/json',
      Key: key
    }, function(err, s3Data) {
      if (err) throw err;
      observer.onNext(jsonFile)
      observer.onCompleted();
    });
  });
}