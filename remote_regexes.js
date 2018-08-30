const Rx = require('rx')
const fetch = require('node-fetch');

module.exports.remoteRegexes = (url, fetcher = fetch) => {
  return Rx.Observable.create(observer => {
    fetcher(url)
      .then(response => response.json())
      .then(data => {
        observer.onNext(data);
        observer.onCompleted();
      })
      .catch(err => observer.onError(err));
    })
    .map(configs => {
      try {
      return {
              include: toIncludeRegexes(configs.include),
              exclude: toRegexes(configs.exclude)
             }
      } catch (err) {
        console.log(err);
      }
    })
}

const toIncludeRegexes = (config) => {
  const regexp = new RegExp(config.patterns.join('|'), config.flags)
  return [{allMustMatch: false, patterns: [regexp]}];
}

const toRegexes = (configs) => {
  if (!configs) return [];
  return configs.map(config => {
    const patterns = config.patterns.map(pattern => new RegExp(pattern, config.flags));
    return Object.assign(config, {patterns: patterns});
  })
}