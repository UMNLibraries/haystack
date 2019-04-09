const fs = require('fs');
const rimraf = require('rimraf');


function wipeLocalData() {
  truncate(`logs/batches.log`, 'Cleared Batches Log');
  truncate(`logs/matches.log`, 'Cleared Matches Log');
  truncate(`logs/keys.log`, 'Cleared Batch Log');
  rimraf.sync(`./matches/*`)
  console.log('Cleared Batches Directory')
}

function truncate(filePath, message) {
  fs.truncate(fs.openSync(filePath, 'r+'), 0, () => console.log(message) );
}

module.exports.wipeLocalData = wipeLocalData;
