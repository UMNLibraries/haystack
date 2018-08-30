const fs = require('fs');
const Rx = require('rx');

module.exports.fileSaver = (jsonFile, dir) => {
  return Rx.Observable.create(observer => {
    if (!dir || !jsonFile) {
      observer.onNext(jsonFile);
      observer.onCompleted();
      return;
    }
    fs.writeFile(`${dir}/${jsonFile.name}`, jsonFile.json, (err) => {
      if (err) throw err;
      observer.onNext(jsonFile)
      observer.onCompleted();
    });
  });
}
