const fs = require('fs');
const { app } = require('../app');
const path = require('path');
const dirPath = path.resolve(__dirname);
const appPath = `${dirPath}/app`


test('matches ans saves records', done => {

    app({regexURL: 'http://hub-client.lib.umn.edu/lookups/34.json',
         inputFile: `${appPath}/jsonl_file.json.gz`,
         batchDir: `${appPath}/batches`,
         logDir: `${appPath}/logs`
    })
    .subscribe(
      () => { },
      (err) => { console.log(err) },
      () => {
        try {
          expect(fs.readFileSync(`${appPath}/logs/keys.log`, 'utf8').split("\n")).toEqual(
            ["aa40f8bd3cea959335e62d1f5983405d34736b14.json", "d591516b01e0f58eee04bd076d946c6e3faf6284.json", ""]
          );

          expect(fs.readFileSync(`${appPath}/logs/matches.log`, 'utf8').split("\n")).toEqual(["1", "1", ""]);
          expect(fs.readFileSync(`${appPath}/logs/batches.log`, 'utf8').split("\n")).toEqual(
            [ '1000',
            '2000',
            '3000',
            '4000',
            '5000',
            '6000',
            '7000',
            '8000',
            '9000',
            '10000',
            '11000',
            '12000',
            '13000',
            '14000',
            '15000',
            '16000',
            '17000',
            '18000',
            '19000',
            '20000',
            '21000',
            '22000',
            '23000',
            '24000',
            '25000',
            '26000',
            '27000',
            '28000',
            '29000',
            '30000',
            '31000',
            '32000',
            '33000',
            '34000',
            '35000',
            '36000',
            '37000',
            '38000',
            '39000',
            '39521',
            '' ]
          );
          expect(fs.readdirSync(`${appPath}/batches`)).toEqual(["aa40f8bd3cea959335e62d1f5983405d34736b14.json", "d591516b01e0f58eee04bd076d946c6e3faf6284.json"]);
          expect(JSON.parse(fs.readFileSync(`${appPath}/batches/aa40f8bd3cea959335e62d1f5983405d34736b14.json`, 'utf8'))).toEqual(
            [{"matches": ["African AmeriCan"], "name": "African AmeriCan", "wins": [["three of a kind", "5♣"]]}]
          )
          expect(JSON.parse(fs.readFileSync(`${appPath}/batches/d591516b01e0f58eee04bd076d946c6e3faf6284.json`, 'utf8'))).toEqual(
            [{"matches": ["Civil War"], "name": "Civil War", "wins": [["straight", "7♣"], ["one pair", "10♥"]]}]
          )
        } catch(err) {
          console.log(err)
        }
        done();
      }
    );
});