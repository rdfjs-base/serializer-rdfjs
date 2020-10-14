const { CommonjsWriter } = require('./commonjs')

class ECMAScriptModuleWriter extends CommonjsWriter {
  get leadingLines () {
    return ['export default ({ blankNode, literal, namedNode, quad }) => {']
  }
}

module.exports = { ECMAScriptModuleWriter }
