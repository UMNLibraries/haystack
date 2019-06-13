const { program } = require('./program');
const AWS = require('aws-sdk');
const fs = require('fs');
const { app } = require('./app');
const { wipeLocalData } = require('./wipe_data');

const S3 = new AWS.S3({
  signatureVersion: 'v4'
});

// Config
var logDir = './logs'
var dplaBucket = 'dpla-provider-export';
var dplaDataDir = './dpla_data';
var batchDir = (program.batchDir ? program.batchDir : './matches');
var regexURL = (program.regexURL ? program.regexURL : 'https://lib-metl-prd-01.oit.umn.edu/lookups/34.json');
// Config

init();

// Create log files and directories
function init() {

  var dirs = [logDir, batchDir, dplaDataDir];
  var logFiles = ['logs/batches.log', 'logs/matches.log', 'logs/keys.log'];
  dirs.map(dir => { mkDir(dir); console.log(`mkdir ${dir}`) });
  logFiles.map(path => { touch(path); console.log(`touch ${path}`) });

  function touch(path) {
    fs.closeSync(fs.openSync(path, 'w'));
  }

  function mkDir(dir) {
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
  }
}


function getLatestDplaAndMatch() {
  var today = new Date();
  var month = ('0' + (today.getMonth()+1)).slice(-2)
  prefix = `${today.getFullYear()}/${month}/all.jsonl/`
  return S3.listObjects({Bucket: dplaBucket, Prefix: prefix}, function(err, data) {
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
      Bucket: dplaBucket,
      Key: key
     };

     fs.writeFile(`${dplaDataDir}/${filename}`, '', (err) => { console.log(err) });
     var jsonFile = require('fs').createWriteStream(`./dpla_data/${filename}`);
     S3.getObject(params).createReadStream().pipe(jsonFile);

     jsonFile.on('close', function(){
      runMatcher(jsonFile.path)
    });
  }
}

function runMatcher(inputFile) {
  console.log(`Running Matcher On: ${inputFile}`);
  app({ regexURL: regexURL,
      inputFile: inputFile,
      bucket: false,
      batchDir: batchDir
  }).subscribe(
    () => {},
    (err) => { console.log(err) },
    () => {
      console.log(`Completed Matcher for ${inputFile}`);
    }
  );
}

async function run() {
  wipeLocalData();
  await getLatestDplaAndMatch();
}

run();