const { jsonFile } = require('../json_file');

test('takes a JS object and turns a JSON file config', done => {
  jsonFile({foo: 'bar'}).subscribe(
    (file) => { expect(file).toEqual(

      {"data": {"foo": "bar"}, "json": "{\"foo\":\"bar\"}", "name": "a5e744d0164540d33b1d7ea616c28f2fa97e754a.json"}


    ) },
    function() { errored() },
    function() { done() }
  );
});
