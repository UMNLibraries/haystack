const fs = require('fs');
const { logger }  = require('../logger');
const path = require('path');
const appRoot = path.resolve(__dirname);

test('logs data', done => {
  fs.truncate(fs.openSync(appRoot + '/logs/fake.log', 'r+'), 0, () => {} );
  logger(appRoot + '/logs/fake.log', '123123', []).subscribe(
    () => {
      try {
        const data = fs.readFileSync(appRoot + '/logs/fake.log');
        expect(String(data)).toEqual("123123\n");
      } catch (error) {
        done.fail(error);
      }
    },
    (err) => console.log(err),
    () => done()
  )
}, 100);
