const { strictEqual, match } = require('assert')
const getStream = require('get-stream')
const intoStream = require('into-stream')
const { describe, it } = require('mocha')
const { expect } = require('chai')
const toCanonical = require('rdf-dataset-ext/toCanonical')
const rdf = require('@rdfjs/data-model')
const sinkTest = require('@rdfjs/sink/test')
const Serializer = require('..')
const { singleQuad } = require('./support/examples')

describe('Serializer', () => {
  sinkTest(Serializer, { readable: true })

  it('should be a constructor', () => {
    strictEqual(typeof Serializer, 'function')
  })

  it('should serialize the given quad stream to a RDFJS code stream', async () => {
    const blankNode0 = rdf.blankNode()
    const blankNode1 = rdf.blankNode()
    const quads = [
      rdf.quad(
        blankNode0,
        rdf.namedNode('http://example.org/predicate1'),
        rdf.literal('object')
      ),
      rdf.quad(
        blankNode0,
        rdf.namedNode('http://example.org/predicate2'),
        rdf.literal('text', 'en')
      ),
      rdf.quad(
        blankNode1,
        rdf.namedNode('http://example.org/predicate3'),
        rdf.literal('123.0', rdf.namedNode('http://www.w3.org/2001/XMLSchema#double')),
        rdf.namedNode('http://example.org/graph')
      )
    ]
    const input = intoStream.object(quads)
    const serializer = new Serializer()

    const code = await getStream(serializer.import(input))

    const result = eval(code)(rdf) /* eslint-disable-line no-eval */

    strictEqual(toCanonical(result), toCanonical(quads))
  })

  describe('transform', () => {
    it('should be a method', () => {
      const serializer = new Serializer()

      strictEqual(typeof serializer.transform, 'function')
    })

    it('should serialize the given quads to RDFJS code', () => {
      const blankNode0 = rdf.blankNode()
      const blankNode1 = rdf.blankNode()
      const quads = [
        rdf.quad(
          blankNode0,
          rdf.namedNode('http://example.org/predicate1'),
          rdf.literal('object')
        ),
        rdf.quad(
          blankNode0,
          rdf.namedNode('http://example.org/predicate2'),
          rdf.literal('text', 'en')
        ),
        rdf.quad(
          blankNode1,
          rdf.namedNode('http://example.org/predicate3'),
          rdf.literal('123.0', rdf.namedNode('http://www.w3.org/2001/XMLSchema#double')),
          rdf.namedNode('http://example.org/graph')
        )
      ]
      const serializer = new Serializer()
      const code = serializer.transform(quads)
      const result = eval(code)(rdf) /* eslint-disable-line no-eval */

      strictEqual(toCanonical(result), toCanonical(quads))
    })

    it('should use module exports syntax', () => {
      const quads = singleQuad

      const serializer = new Serializer()
      const code = serializer.transform(quads)

      match(code, /module.exports = /g)
    })

    describe('writing ES module', () => {
      it('should use module exports syntax', () => {
        const quads = singleQuad

        const serializer = new Serializer({ module: 'esm' })
        const code = serializer.transform(quads)

        match(code, /export default \(/g)
      })
    })

    describe('writing TypeScript', () => {
      it('should export annotated module', () => {
        const quads = singleQuad

        const serializer = new Serializer({ module: 'ts' })
        const code = serializer.transform(quads)

        match(code, /export default (.+): Quad\[] => {/g)
      })
    })
  })
})
