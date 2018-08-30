
module.exports.match = (regex, line) => {
  const patterns = regex.patterns
  const matches = patterns.map(pattern => line.match(pattern))
                          .filter(match => match) //remove nulls
  const matched = (regex.allMustMatch) ? matches.length == patterns.length : matches.length > 0
  return { matched: matched, matches: [].concat(...matches) }
}