const { regexFilter } = require('./regex_filter');
const Rx = require('rx');

module.exports.search = (rows, regexes) => {
  return Rx.Observable.create(observer => {
    const matches = regexFilter(rows, regexes.include)
    observer.onNext(
      (regexes.exclude) ? regexFilter(matches, regexes.exclude, true) : matches
    );
    observer.onCompleted();
  });
}