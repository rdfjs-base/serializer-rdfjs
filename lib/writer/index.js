const { ECMAScriptModuleWriter } = require('./esm')
const { TypescriptWriter } = require('./typescript')
const { CommonjsWriter } = require('./commonjs')

module.exports = {
  CommonjsWriter,
  ECMAScriptModuleWriter,
  TypescriptWriter
}
