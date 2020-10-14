const factoryParams = require('./factoryParams')

class CommonjsWriter {
  leadingLines (stats) {
    return [`module.exports = ({ ${factoryParams(stats)} }) => {`]
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
