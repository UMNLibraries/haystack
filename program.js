const program = require('commander')

program
  .version('0.1.0')
  .option('-i, --inputFile <filename>', 'Gzipped file to search')
  .option('-r, --regexURL [URL]', 'A URL to a JSON array of regex patterns (example: https://lib-metl-prd-01.oit.umn.edu/lookups/34)')
  .option('-d, --batchDir <batch directory>', 'Directory to store matches', 'matches')
  .option('-b, --bucket [S3 Bucket]', 'AWS S3 bucket (optional)', false)
  .parse(process.argv);

module.exports.program = program;