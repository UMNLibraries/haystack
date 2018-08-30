const { fileReader } = require('../file_reader');
var path = require('path');
global.appRoot = path.resolve(__dirname);

test('opens and reads a gzipped JSONL file and emits batches of rows', done => {
  const response = fileReader(appRoot + '/app/jsonl_file.json.gz', 50)
  const completed  =  jest.fn();
  const errored  =  jest.fn();

  response.subscribe(
    function(resp)  {
      if (resp.rowCount == 39521) {
        expect(resp.rows.length).toBe(520)
      } else {
        expect(resp.rows.length).toBe(1000)
      }
    },
    function() { errored() },
    function() { done() }
  );
});
