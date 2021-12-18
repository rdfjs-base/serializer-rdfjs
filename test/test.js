import { doesNotReject, strictEqual } from 'assert'
import sinkTest from '@rdfjs/sink/test/index.js'
import getStream from 'get-stream'
import { describe, it } from 'mocha'
import toCanonical from 'rdf-dataset-ext/toCanonical.js'
import Serializer from '../index.js'
import * as example from './support/example.js'
import run from './support/run.js'

describe('Serializer', () => {
  sinkTest(Serializer, { readable: true })

  it('should be a constructor', () => {
    strictEqual(typeof Serializer, 'function')
  })

  it('should serialize an empty list of quads to a executable JavaScript code', async () => {
    const { stream } = await example.empty()
    const serializer = new Serializer()
    const code = await getStream(serializer.import(stream))

    await doesNotReject(async () => {
      await run(code)
    })
  })

  it('should serialize an empty list of quads to a RDF/JS builder function', async () => {
    const { quads, stream } = await example.empty()
    const serializer = new Serializer()
    const code = await getStream(serializer.import(stream))
    const result = await run(code)

    strictEqual(toCanonical(result), toCanonical(quads))
  })

  it('should serialize an empty list of quads to a ESM RDF/JS builder module', async () => {
    const { codeEsm, stream } = await example.empty()
    const serializer = new Serializer()
    const code = await getStream(serializer.import(stream))

    strictEqual(code, codeEsm)
  })

  it('should serialize an empty list of quads to a CommonJS RDF/JS builder module if module is commonjs', async () => {
    const { codeCommonJs, stream } = await example.empty()
    const serializer = new Serializer({ module: 'commonjs' })
    const code = await getStream(serializer.import(stream))

    strictEqual(code, codeCommonJs)
  })

  it('should serialize an empty list of quads to a TypeScript RDF/JS builder module if module is ts', async () => {
    const { codeTs, stream } = await example.empty()
    const serializer = new Serializer({ module: 'ts' })
    const code = await getStream(serializer.import(stream))

    strictEqual(code, codeTs)
  })

  it('should serialize the given quads to a executable JavaScript code', async () => {
    const { stream } = await example.simple()
    const serializer = new Serializer()
    const code = await getStream(serializer.import(stream))

    await doesNotReject(async () => {
      await run(code)
    })
  })

  it('should serialize the given quads to a RDF/JS builder function', async () => {
    const { quads, stream } = await example.simple()
    const serializer = new Serializer()
    const code = await getStream(serializer.import(stream))
    const result = await run(code)

    strictEqual(toCanonical(result), toCanonical(quads))
  })

  it('should serialize the given quads to a ESM RDF/JS builder module', async () => {
    const { codeEsm, stream } = await example.simple()
    const serializer = new Serializer()
    const code = await getStream(serializer.import(stream))

    strictEqual(code, codeEsm)
  })

  it('should serialize the given quads to a CommonJS RDF/JS builder module if module is commonjs', async () => {
    const { codeCommonJs, stream } = await example.simple()
    const serializer = new Serializer({ module: 'commonjs' })
    const code = await getStream(serializer.import(stream))

    strictEqual(code, codeCommonJs)
  })

  it('should serialize the given quads to a TypeScript RDF/JS builder module if module is ts', async () => {
    const { codeTs, stream } = await example.simple()
    const serializer = new Serializer({ module: 'ts' })
    const code = await getStream(serializer.import(stream))

    strictEqual(code, codeTs)
  })

  describe('transform', () => {
    it('should be a method', () => {
      const serializer = new Serializer()

      strictEqual(typeof serializer.transform, 'function')
    })

    it('should serialize the given quads to a executable JavaScript code', async () => {
      const { quads } = await example.simple()
      const serializer = new Serializer()
      const code = serializer.transform(quads)

      await doesNotReject(async () => {
        await run(code)
      })
    })

    it('should serialize the given quads to a RDF/JS builder function', async () => {
      const { quads } = await example.simple()
      const serializer = new Serializer()
      const code = serializer.transform(quads)
      const result = await run(code)

      strictEqual(toCanonical(result), toCanonical(quads))
    })

    it('should serialize the given quads to a ESM RDF/JS builder module', async () => {
      const { codeEsm, quads } = await example.simple()
      const serializer = new Serializer()
      const code = serializer.transform(quads)

      strictEqual(code, codeEsm)
    })

    it('should serialize the given quads to a CommonJS RDF/JS builder module if module is commonjs', async () => {
      const { codeCommonJs, quads } = await example.simple()
      const serializer = new Serializer({ module: 'commonjs' })
      const code = serializer.transform(quads)

      strictEqual(code, codeCommonJs)
    })

    it('should serialize the given quads to a TypeScript RDF/JS builder module if module is ts', async () => {
      const { codeTs, quads } = await example.simple()
      const serializer = new Serializer({ module: 'ts' })
      const code = serializer.transform(quads)

      strictEqual(code, codeTs)
    })
  })
})
