const { of } = require('rxjs');
const fs = require('fs');
const { fileSaver } = require('../file_saver');
var path = require('path');
const appRoot = path.resolve(__dirname);

const jsonFile = {
  name: '55f2e0e05f65eeae362d4b144ccbd75c4412f74c.json',
  json: JSON.stringify({"foo": "bar"})
}

const filePath = `${appRoot}/batches/${jsonFile.name}`;

beforeEach(() => {
  fs.unlink(filePath, (err) => {
    if (err) console.log(err);
  });
});
test('saves a file', done => {
  fileSaver(jsonFile, `${appRoot}/batches`).subscribe(
    function()  {
      var text = JSON.parse(fs.readFileSync(filePath))
      expect(text).toEqual({"foo": "bar"})
    },
    function() { },
    function() { done() }
  );
});