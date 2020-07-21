const rdf = require('@rdfjs/data-model')

const singleQuad = [
  rdf.quad(
    rdf.blankNode(),
    rdf.namedNode('http://example.org/predicate1'),
    rdf.literal('object')
  )
]

module.exports = {
  singleQuad
}
