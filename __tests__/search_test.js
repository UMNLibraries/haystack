const { search } = require('../search');

describe('when given both include and exclude regex patterns', () => {
  test('matches provided terms and then filters the provide exclude terms', done => {
    const rows = [
      {title: "\"Black Twitter\" provides insights into popular discourse"},
      {title: "Edouardo Jordan, winner of two James Beard Awards, at the 2018 ceremony."},
      {title: "Michael Twitty and Osayi Endolyn won medals for their work;"}
    ]
    regexes = {
      include: [
        {patterns: [new RegExp('Black TwiTter', 'i')], allMustMatch: true},
        {patterns: [new RegExp('Michael twitty', 'i')], allMustMatch: true}
      ],
      exclude:[
        {patterns: [new RegExp('Black TwiTter', 'i')], allMustMatch: true}
      ]
    }

    search(rows, regexes).subscribe(
      (rows) => {
        try {
        expect(rows).toEqual(
          [{"matches": ["Michael Twitty"], "title": "Michael Twitty and Osayi Endolyn won medals for their work;"}]
        )
        } catch (error) {
          done.fail(error);
        }
      },
      (err) => console.log(err),
      () => done()
    )
  });
});

describe('when given no exclude patterns are given', () => {
  test('returns matching records', done => {
    const rows = [
      {title: "\"Black Twitter\" provides insights into popular discourse"},
      {title: "Edouardo Jordan, winner of two James Beard Awards, at the 2018 ceremony."},
      {title: "Michael Twitty and Osayi Endolyn won medals for their work;"}
    ]
    regexes = {
      include: [
        {patterns: [new RegExp('Black TwiTter', 'i')], allMustMatch: true},
        {patterns: [new RegExp('Michael twitty', 'i')], allMustMatch: true}
      ]
    }

    search(rows, regexes).subscribe(
      (rows) => {
        expect(rows).toEqual(
          [{"matches": ["Black Twitter"], "title": "\"Black Twitter\" provides insights into popular discourse"}, {"matches": ["Michael Twitty"], "title": "Michael Twitty and Osayi Endolyn won medals for their work;"}]
        )
      try {
        } catch (error) {
          done.fail(error);
        }
      },
      (err) => console.log(err),
      () => done()
    )
  });
});


