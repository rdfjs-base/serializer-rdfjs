# @rdfjs/serializer-rdfjs

[![Build Status](https://travis-ci.org/rdfjs-base/serializer-rdfjs.svg?branch=master)](https://travis-ci.org/rdfjs-base/serializer-rdfjs)

[![npm version](https://img.shields.io/npm/v/@rdfjs/serializer-rdfjs.svg)](https://www.npmjs.com/package/@rdfjs/serializer-rdfjs)

RDFJS JavaScript code serializer that implements the [RDFJS Sink interface](http://rdf.js.org/).

It serializes a dataset as a JavaScript module which exports a single `(factory: DataFactory) => Quad[]` function. The function will re-create the original dataset's quads using RDF/JS interface.

```js
module.exports = factory => {
  return [
    factory.quad(
      factory.blankNode('foo'),
      factory.namedNode('http://example.com/bar'),
      factory.literal('baz')
    )
  ]
}
```

## Usage

The package exports the serializer as a class, so an instance must be created before it can be used.
The `.import` method, as defined in the [RDFJS specification](http://rdf.js.org/#sink-interface), must be called to do the actual serialization.
It expects a quad stream as argument.
The method will return a stream which emits the JavaScript code as a string.

### Example

This example shows how to create a serializer instance and how to feed it with a stream of quads.
The code emitted by the serializer will be written to the console.

```javascript
const rdf = require('@rdfjs/data-model')
const { Readable } = require('stream')
const Serializer = require('@rdfjs/serializer-rdfjs')

const serializer = new Serializer()
const input = new Readable({
  objectMode: true,
  read: () => {
    input.push(rdf.quad(
      rdf.namedNode('http://example.org/sheldon-cooper'),
      rdf.namedNode('http://schema.org/givenName'),
      rdf.literal('Sheldon')))
    input.push(rdf.quad(
      rdf.namedNode('http://example.org/sheldon-cooper'),
      rdf.namedNode('http://schema.org/familyName'),
      rdf.literal('Cooper')))
    input.push(rdf.quad(
      rdf.namedNode('http://example.org/sheldon-cooper'),
      rdf.namedNode('http://schema.org/knows'),
      rdf.namedNode('http://example.org/amy-farrah-fowler')))
    input.push(null)
  }
})
const output = serializer.import(input)

output.on('data', code => {
  console.log(code)
})
```

### transform(quads)

The actual serializer code runs sync and the RDFJS Sink interface is just a wrapper. 
If your use case is very specific, with a low change to use other formats, it can be used directly.
The `.transform` method accepts quads provided as an object that implements the `Symbol.iterator` method.
It returns the generated JavaScript code as a string.

#### Example

This example shows how to create a serializer instance and how to feed it with quads.
The returned code will be written to the console.

```javascript
const rdf = require('@rdfjs/data-model')
const Serializer = require('@rdfjs/serializer-rdfjs')

const serializer = new Serializer()
const code = serializer.transform([
  rdf.quad(
    rdf.namedNode('http://example.org/sheldon-cooper'),
    rdf.namedNode('http://schema.org/givenName'),
    rdf.literal('Sheldon')),
  rdf.quad(
    rdf.namedNode('http://example.org/sheldon-cooper'),
    rdf.namedNode('http://schema.org/familyName'),
    rdf.literal('Cooper')),
  rdf.quad(
    rdf.namedNode('http://example.org/sheldon-cooper'),
    rdf.namedNode('http://schema.org/knows'),
    rdf.namedNode('http://example.org/amy-farrah-fowler'))
])

console.log(code)
```  
