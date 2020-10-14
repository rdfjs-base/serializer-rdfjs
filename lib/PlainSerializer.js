const { getKnownPrefix, getLocalPrefix } = require('./namespaces')
const safe = require('safe-identifier')
const writer = require('./writer')

class PlainSerializer {
  constructor ({ module } = {}) {
    switch (module) {
      case 'esm':
        this.writer = new writer.ECMAScriptModuleWriter()
        break
      case 'ts':
        this.writer = new writer.TypescriptWriter()
        break
      default:
        this.writer = new writer.CommonjsWriter()
        break
    }
  }

  transform (quads) {
    const blankNodes = new Map()
    const namespaces = new Map()

    const quadsString = [...quads].map(quad => this.serializeQuad(quad, blankNodes, namespaces)).join(',\n')

    const prefixesMapString = [
      'const {',
      [...namespaces.values()].map(prefix => `  ${safe.identifier(prefix)}`).join(',\n'),
      '} = {',
      [...namespaces.entries()].map(([namespace, prefix]) => `  '${safe.identifier(prefix)}': '${namespace}'`).join(',\n'),
      '}'
    ].join('\n')

    return [
      '/* This file was automatically generated. Do not edit by hand. */',
      '',
      namespaces.size !== 0 ? prefixesMapString : null,
      '',
      ...this.writer.leadingLines,
      blankNodes.size !== 0 ? this.writer.blankNodesLines(blankNodes.size) : null,
      quadsString ? `  return [\n${quadsString}\n  ]` : '  return []',
      '}',
      ''
    ].filter(part => part !== null).join('\n')
  }

  serializerTerm (term, blankNodes, namespaces) {
    if (term.termType === 'BlankNode') {
      if (!blankNodes.has(term.value)) {
        blankNodes.set(term.value, blankNodes.size)
      }

      return `blankNodes[${blankNodes.get(term.value)}]`
    }

    if (term.termType === 'Literal') {
      const value = term.value
        .replace(/\${/g, '\\${')
        .replace(/`/g, '\\`')

      if (term.language) {
        return `literal(\`${value}\`, '${term.language}')`
      }

      if (term.datatype.value === 'http://www.w3.org/2001/XMLSchema#string') {
        return `literal(\`${value}\`)`
      }

      return `literal(\`${value}\`, namedNode(${this.serializeNamedNode(term.datatype, namespaces)}))`
    }

    if (term.termType === 'NamedNode') {
      return `namedNode(${this.serializeNamedNode(term, namespaces)})`
    }

    throw new Error(`unknown term type: ${term.termType}`)
  }

  serializeNamedNode (namedNode, namespaces) {
    const result = getKnownPrefix(namedNode) || getLocalPrefix(namedNode)
    if (!result) {
      return `'${namedNode.value}'`
    }

    let { prefix, namespace, term } = result
    if (!prefix) {
      prefix = namespaces.get(namespace) || `ns${namespaces.size + 1}`
    }

    namespaces.set(namespace, prefix)

    if (!term) {
      return safe.identifier(prefix)
    }

    return '`${' + safe.identifier(prefix) + '}' + term + '`'
  }

  serializeQuad (quad, blankNodes, namespaces) {
    const parts = [quad.subject, quad.predicate, quad.object, quad.graph]
      .filter(part => part.termType !== 'DefaultGraph')
      .map(part => `      ${this.serializerTerm(part, blankNodes, namespaces)}`)
      .join(',\n')

    return `    quad(\n${parts}\n    )`
  }
}

module.exports = PlainSerializer
