const { match }  = require('../match');

describe('when given an array of patterns that should all match', () => {
  test('all patterns match', () => {
    const patterns = [new RegExp('Black TwiTter', 'i'), new RegExp('discourse', 'i')]
    regex = {patterns: patterns, allMustMatch: true}
    const data = "\"Black Twitter\" provides insights into popular discourse in the African American community."
    expect(match(regex, data).matched).toBe(true)
    expect(match(regex, data).matches).toEqual(["Black Twitter", "discourse"])
  });
});


describe('when given an array of patterns that should partially match', () => {
  test('some patterns match', () => {
    const patterns = [new RegExp('Black TwiTter', 'i'), new RegExp('blahz', 'i')]
    regex = {patterns: patterns, allMustMatch: false}
    const data = "\"Black Twitter\" provides insights into popular discourse in the African American community."
    expect(match(regex, data).matched).toBe(true)
    expect(match(regex, data).matches).toEqual(["Black Twitter"])
  });
});
