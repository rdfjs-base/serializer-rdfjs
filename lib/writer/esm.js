class ECMAScriptModuleWriter {
  get leadingLines () {
    return ['export default ({ blankNode, literal, namedNode, quad }) => {']
  }
}

module.exports = { ECMAScriptModuleWriter }
