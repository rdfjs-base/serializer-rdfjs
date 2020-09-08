const { shrink, prefixes } = require('@zazuko/rdf-vocabularies')

const prefixRegex = /^(\w+):(\w+)?$/
const namespaceRegex = /((?:.*)(?:[/#]))([^/#]*)$/

function getKnownPrefix (namedNode) {
  const shrunk = shrink(namedNode.value)
  if (shrunk) {
    const matches = shrunk.match(prefixRegex)
    const prefix = matches[1]
    const term = matches[2] || ''
    const namespace = prefixes[prefix]

    return { namespace, prefix, term }
  }

  return null
}

function getLocalPrefix (namedNode) {
  const matches = namedNode.value.match(namespaceRegex)
  if (!matches.length) {
    return null
  }

  const namespace = matches[1]
  const term = matches[2]

  return { namespace, term }
}

module.exports = {
  getKnownPrefix,
  getLocalPrefix
}
