const { fileSaver } = require('./file_saver');
const { fileReader } = require('./file_reader');
const { search } = require('./search');
const { s3Push } = require('./s3_push');
const { remoteRegexes } = require('./remote_regexes');
const { logger } = require('./logger');
const { jsonFile } = require('./json_file')


module.exports.app = ({regexURL = false,
                       inputFile = false,
                       bucket = false,
                       batchDir = './batches',
                       logDir = './logs'}) => {

  return remoteRegexes(regexURL)
    .mergeMap(regexes => fileReader(inputFile, regexes))
    .mergeMap(file => logger(`${logDir}/batches.log`, file.rowCount, file))
    .mergeMap(file =>  search(file.rows, file.regexes))
    .filter(matches => matches.length > 0 )
    .mergeMap(matches  => (matches.length > 0) ? logger(`${logDir}/matches.log`, matches.length, matches) : matches)
    .mergeMap(matches  => (matches.length > 0) ? jsonFile(matches) : false)
    .mergeMap(jsonFile => (jsonFile) ? logger(`${logDir}/keys.log`, jsonFile.name, jsonFile) : false)
    .mergeMap(jsonFile => s3Push(jsonFile, bucket))
    .mergeMap(jsonFile => fileSaver(jsonFile, batchDir));
}