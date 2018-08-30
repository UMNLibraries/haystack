const { match } = require('./match');
const { logger } = require('./logger')

module.exports.regexFilter = (rows, regexes, excludeMatches = false) => {
  return rows.map(row => {
    return {
      value: row,
      matcher: regexes.map(regex => match(regex, JSON.stringify(row)))
    }
  })
  .map(row => {
    return row;
  })
  .filter(row => (excludeMatches) ? !hasMatch(row) : hasMatch(row))
  .map(row => Object.assign(row.value, {matches: matchStrings(row.value, row)}))
}

const hasMatch = (row) => {
  return row.matcher.filter(match => match.matched).length > 0
}

// When excludeMatches is set to true, we have a set of records that have already
// been positively matched for inclusion and seek to filter out false positives
// with a second pass of "negative" matches, excluding records that match a given
// pattern. For this reason, we preserve row.matches from the original match,
// since if the record makes it past the filter, we want to remember why we orignally
// matched the term
const matchStrings = (orignialRow, row) => {
  return (orignialRow.matches) ? orignialRow.matches : [].concat(...row.matcher.map(match => match.matches))
}