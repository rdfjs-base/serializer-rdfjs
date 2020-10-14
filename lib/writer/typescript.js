const factoryParams = require('./factoryParams')

class TypescriptWriter {
  leadingLines (stats) {
    return [
      "import RDF from 'rdf-js'",
      '',
      `export default ({ ${factoryParams(stats)} }: RDF.DataFactory): RDF.Quad[] => {`
    ]
  }

  blankNodesLines (number) {
    return [
      '  const blankNodes: RDF.BlankNode[] = []',
      `  for (let i = 0; i < ${number}; i++) {`,
      '    blankNodes.push(blankNode())',
      '  }',
      ''
    ].join('\n')
  }
}

module.exports = { TypescriptWriter }
