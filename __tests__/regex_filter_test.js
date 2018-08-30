const { regexFilter }  = require('../regex_filter');

describe('configured to include matches', () => {
  describe('and when given a terms that are found in the provided text', () => {
    test('matches provided terms in a case insensitive manner', () => {
      const rows = [
        {title: "\"Black Twitter\" provides insights into popular discourse"},
        {title: "Edouardo Jordan, winner of two James Beard Awards, at the 2018 ceremony."},
        {title: "Michael Twitty and Osayi Endolyn won medals for their work; Twitty was the first Black author to ever win the foundation’s Book of the Year award)."}
      ]
      regexes = [
        {patterns: [new RegExp('Black TwiTter', 'i')], allMustMatch: true},
        {patterns: [new RegExp('Michael twitty', 'i')], allMustMatch: true}
      ]
      const matches = regexFilter(rows, regexes)
      expect(matches).toEqual(
        [{"matches": ["Black Twitter"], "title": "\"Black Twitter\" provides insights into popular discourse"}, {"matches": ["Michael Twitty"], "title": "Michael Twitty and Osayi Endolyn won medals for their work; Twitty was the first Black author to ever win the foundation’s Book of the Year award)."}]
      )
    });
  });
});

describe('configured to exclude matches', () => {
  describe('and when given a terms that are found in the provided text', () => {
    test('matches provided terms in a case insensitive manner', () => {
      const secondaryRows = [
        {title: "\"Black Twitter\" provides insights into popular discourse", matches: ['Black Twitter']},
        {title: "Edouardo Jordan, winner of two James Beard Awards, at the 2018 ceremony."},
        {title: "Michael Twitty and Osayi Endolyn won medals for their work;", matches: ["Michael twitty"]}
      ]
      regexes = [
        {patterns: [new RegExp('Edouardo Jordan', 'i')], allMustMatch: true},
        {patterns: [new RegExp('Michael twitty', 'i')], allMustMatch: true}
      ]
      const matches = regexFilter(secondaryRows, regexes, true, ['Black Twitter', 'Michael twitty'])
      expect(matches).toEqual(
        [{"matches": ["Black Twitter"], "title": "\"Black Twitter\" provides insights into popular discourse"}]
      )
    });
  });
});
