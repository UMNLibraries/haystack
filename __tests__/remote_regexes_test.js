const { remoteRegexes } = require('../remote_regexes');
const { of } = require('rxjs');

test('returns a set of regular expressions', done => {
  const regex = remoteRegexes('https://lib-metl-prd-01.oit.umn.edu/lookups/35.json')
  regex.subscribe(
    (regexp) => {
      //Without try/catch, errors for Observables that return an promise are swallowed by Jest/Jasmine
      //See: https://github.com/facebook/jest/issues/1873#issuecomment-258857165
      try {
          expect(regexp.exclude[0]).toEqual(
            {allMustMatch: true, patterns: [new RegExp('Bears', 'i')], flags: 'i' })
          expect(regexp.include[0]).toEqual(
            {allMustMatch: false, patterns: [new RegExp('Affirmative action', 'i')] })

      } catch (error) {
        done.fail(error);
      }
    },
    (err) => console.log(err),
    () => done()
  );
});
