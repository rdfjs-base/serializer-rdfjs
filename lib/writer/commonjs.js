class CommonjsWriter {
  get leadingLines () {
    return ['module.exports = ({ blankNode, literal, namedNode, quad }) => {']
  }

  blankNodesLines (number) {
    return [
      '  const blankNodes = []',
      `  for (let i = 0; i < ${number}; i++) {`,
      '    blankNodes.push(blankNode())',
      '  }',
      ''
    ].join('\n')
  }
}

module.exports = { CommonjsWriter }
