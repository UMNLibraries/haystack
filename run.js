const { program } = require('./program');
const { app } = require('./app');
const { localKeys } = require('./local_keys');
const { s3Push } = require('./s3_push');

app({ regexURL: program.regexURL,
     inputFile: program.inputFile,
     bucket: program.bucket,
     batchDir: program.batchDir
})
.subscribe(
  () => {},
  (err) => { console.log(err) },
  () => {
    if (program.bucket) {
      s3Push(program.bucket, JSON.stringify(localKeys()), 'keys.json').subscribe();
    }
    console.log('--- done --- ');
  }
);