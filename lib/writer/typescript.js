class TypescriptWriter {
  get leadingLines() {
    return [
      "import { DataFactory, Quad } from 'rdf-js'",
      '',
      'export default ({ blankNode, literal, namedNode, quad }: DataFactory): Quad[] => {'
    ]
  }
}

module.exports = { TypescriptWriter }
