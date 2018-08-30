const Rx = require('rx')
const crypto = require('crypto');

module.exports.jsonFile = (data) => {
  return Rx.Observable.create(observer => {
    const json = JSON.stringify(data)
    observer.onNext({
      name: `${crypto.createHash('sha1').update(json).digest('hex')}.json`,
      json: json,
      data: data
    })
    observer.onCompleted();
  });
}