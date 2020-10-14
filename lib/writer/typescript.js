class TypescriptWriter {
  get leadingLines () {
    return [
      "import { BlankNode, DataFactory, Quad } from 'rdf-js'",
      '',
      'export default ({ blankNode, literal, namedNode, quad }: DataFactory): Quad[] => {'
    ]
  }

  blankNodesLines (number) {
    return [
      '  const blankNodes: BlankNode[] = []',
      `  for (let i = 0; i < ${number}; i++) {`,
      '    blankNodes.push(blankNode())',
      '  }',
      ''
    ].join('\n')
  }
}

module.exports = { TypescriptWriter }
