const fs = require('fs');
var Rx = require('rx');

module.exports.logger = (filePath, logData, allData) => {
  return Rx.Observable.create(observer => {
    fs.appendFile(filePath, `${logData}\n`, (err) => {
      if (err) throw err;
      observer.onNext(allData)
      observer.onCompleted();
    });
  });
}

