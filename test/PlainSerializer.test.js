const { strictEqual, ok } = require('assert')
const { describe, it } = require('mocha')
const toCanonical = require('rdf-dataset-ext/toCanonical')
const rdf = require('@rdfjs/data-model')
const PlainSerializer = require('../lib/PlainSerializer')
const ns = require('@tpluscode/rdf-ns-builders')
const { CommonjsWriter } = require('../lib/writer')

describe('PlainSerializer', () => {
  it('should be a constructor', () => {
    strictEqual(typeof PlainSerializer, 'function')
  })

  describe('transform', () => {
    it('should be a method', () => {
      const serializer = new PlainSerializer()

      strictEqual(typeof serializer.transform, 'function')
    })

    it('should generate valid JavaScript code', () => {
      const serializer = new PlainSerializer()

      const code = serializer.transform([])

      eval(code) /* eslint-disable-line no-eval */
    })

    it('should generate code that uses the given factory', () => {
      const quad = rdf.quad(
        rdf.blankNode(),
        rdf.namedNode('http://example.org/predicate'),
        rdf.literal('object')
      )
      const called = {}
      const factory = {
        blankNode: () => {
          called.blankNode = true
        },
        literal: () => {
          called.literal = true
        },
        namedNode: () => {
          called.namedNode = true
        },
        quad: () => {
          called.quad = true
        }
      }
      const serializer = new PlainSerializer()

      const code = serializer.transform([quad])

      eval(code)(factory) /* eslint-disable-line no-eval */

      strictEqual(called.blankNode, true)
      strictEqual(called.literal, true)
      strictEqual(called.namedNode, true)
      strictEqual(called.quad, true)
    })

    it('should generate code that returns quads which are canonical equal to the given quads', () => {
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
      const serializer = new PlainSerializer()
      const code = serializer.transform(quads)
      const result = eval(code)(rdf) /* eslint-disable-line no-eval */

      strictEqual(toCanonical(result), toCanonical(quads))
    })

    it('should not use reserved words for prefixes', () => {
      const quads = [
        rdf.quad(
          rdf.blankNode(),
          ns.rdf.type,
          ns._void.Dataset
        )
      ]
      const serializer = new PlainSerializer()
      const code = serializer.transform(quads)
      const result = eval(code)(rdf) /* eslint-disable-line no-eval */

      strictEqual(toCanonical(result), toCanonical(quads))
    })

    it('should generate prefixes for all named nodes', () => {
      const quads = [
        rdf.quad(
          rdf.namedNode('http://example.com/Foo'),
          rdf.namedNode('http://example.org/Bar'),
          rdf.namedNode('http://example.com/Baz')
        )
      ]
      const serializer = new PlainSerializer()
      const code = serializer.transform(quads)
      const result = eval(code)(rdf) /* eslint-disable-line no-eval */

      strictEqual(toCanonical(result), toCanonical(quads))
    })

    it('should write commonjs by default', () => {
      const serializer = new PlainSerializer()

      ok(serializer.writer instanceof CommonjsWriter)
    })
  })
})
