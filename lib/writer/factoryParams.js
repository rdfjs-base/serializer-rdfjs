module.exports = function (stats) {
  if (stats.total === 0) {
    return ''
  }

  let params = 'quad'
  if (stats.namedNodes) {
    params = 'namedNode, ' + params
  }
  if (stats.literals) {
    params = 'literal, ' + params
  }
  if (stats.blankNodes) {
    params = 'blankNode, ' + params
  }

  return params
}
