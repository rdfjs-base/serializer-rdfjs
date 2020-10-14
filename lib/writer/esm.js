const { CommonjsWriter } = require('./commonjs')
const factoryParams = require('./factoryParams')

class ECMAScriptModuleWriter extends CommonjsWriter {
  leadingLines (stats) {
    return [`export default ({ ${factoryParams(stats)} }) => {`]
  }
}

module.exports = { ECMAScriptModuleWriter }
