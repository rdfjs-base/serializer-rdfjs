class CommonjsWriter {
  get leadingLines() {
    return ['module.exports = ({ blankNode, literal, namedNode, quad }) => {']
  }
}

module.exports = { CommonjsWriter }
