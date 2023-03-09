class TypeScriptWriter {
  leadingLines () {
    return [
      'export default ({ factory }: { factory: import(\'rdf-js\').DataFactory }): import(\'rdf-js\').Quad[] => {'
    ]
  }

  blankNodesLines (number) {
    return [
      '  const blankNodes: import(\'rdf-js\').BlankNode[] = []',
      `  for (let i = 0; i < ${number}; i++) {`,
      '    blankNodes.push(f.blankNode())',
      '  }',
      ''
    ].join('\n')
  }
}

export default TypeScriptWriter
