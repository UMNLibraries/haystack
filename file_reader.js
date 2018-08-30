var Rx = require('rx');
const fs = require('fs');
const zlib = require('zlib');
const readline = require('readline');

function openFileStream(fileName) {
  return readline.createInterface({
    input: fs.createReadStream(fileName).pipe(zlib.createGunzip())
  });
}

module.exports.fileReader = (fileName, regexes) => {
  return Rx.Observable.create(observer => {
    const lineReader = openFileStream(fileName);
    let rowNum = 1;
    let lines = [];
    lineReader.on('line', (line) => {
      lines.push(JSON.parse(line));
      if (lines.length == 1000) {
        observer.onNext({rows: lines, rowCount: rowNum, regexes: regexes})
        lines = []
      }
      rowNum += 1;
    });

    lineReader.on('close', function () {
      if (lines.length > 0) observer.onNext({rows: lines, rowCount: rowNum, regexes: regexes})
      observer.onCompleted();
    });
  });
}