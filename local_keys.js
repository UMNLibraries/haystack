const fs = require('fs');

module.exports.localKeys = () => {
  return fs.readFileSync('./logs/keys.log').toString().split("\n").filter(k => k != '').sort()
}