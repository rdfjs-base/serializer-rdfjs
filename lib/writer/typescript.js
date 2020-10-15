const factoryParams = require('./factoryParams')

class TypescriptWriter {
  leadingLines (stats) {
    return [
      `export default ({ ${factoryParams(stats)} }: import('rdf-js').DataFactory): import('rdf-js').Quad[] => {`
    ]
  }

  blankNodesLines (number) {
    return [
      `  const blankNodes: import('rdf-js').BlankNode[] = []`,
      `  for (let i = 0; i < ${number}; i++) {`,
      '    blankNodes.push(blankNode())',
      '  }',
      ''
    ].join('\n')
  }
}

module.exports = { TypescriptWriter }
