const fetch = require('node-fetch');

const fetcher = async (url) => {
  return Rx.Observable.create(observer => {
    try {
      return observer.onNext(fetch(url)
    } catch (err) {
      return {buffer: () => '', status: 500, message: `${err}`, error: true}
    }
  });
  }

module.exports.Fetcher = fetcher