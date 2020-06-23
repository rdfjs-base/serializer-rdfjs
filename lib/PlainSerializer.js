class PlainSerializer {
  transform (quads) {
    const blankNodes = new Map()

    const quadsString = [...quads].map(quad => this.serializeQuad(quad, blankNodes)).join(',\n')

    const blankNodesString = [
      '  const blankNodes = []',
      `  for (let i = 0; i < ${blankNodes.size}; i++) {`,
      '    blankNodes.push(blankNode())',
      '  }',
      ''
    ].join('\n')

    return [
      '/* This file was automatically generated. Do not edit by hand. */',
      '',
      'module.exports = ({ blankNode, literal, namedNode, quad }) => {',
      blankNodes.size !== 0 ? blankNodesString : null,
      quadsString ? `  return [\n${quadsString}\n  ]` : '  return []',
      '}',
      ''
    ].filter(part => part !== null).join('\n')
  }

  serializerTerm (term, blankNodes) {
    if (term.termType === 'BlankNode') {
      if (!blankNodes.has(term.value)) {
        blankNodes.set(term.value, blankNodes.size)
      }

      return `blankNodes['${blankNodes.get(term.value)}']`
    }

    if (term.termType === 'Literal') {
      if (term.language) {
        return `literal(\`${term.value}\`, '${term.language}')`
      }

      if (term.datatype.value === 'http://www.w3.org/2001/XMLSchema#string') {
        return `literal(\`${term.value}\`)`
      }

      return `literal(\`${term.value}\`, namedNode('${term.datatype.value}'))`
    }

    if (term.termType === 'NamedNode') {
      return `namedNode('${term.value}')`
    }

    throw new Error(`unknown term type: ${term.termType}`)
  }

  serializeQuad (quad, blankNodes) {
    const parts = [quad.subject, quad.predicate, quad.object, quad.graph]
      .filter(part => part.termType !== 'DefaultGraph')
      .map(part => `      ${this.serializerTerm(part, blankNodes)}`)
      .join(',\n')

    return `    quad(\n${parts}\n    )`
  }
}

module.exports = PlainSerializer
