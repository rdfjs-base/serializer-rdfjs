const PlainSerializer = require('./lib/PlainSerializer')
const SerializerStream = require('./lib/SerializerStream')
const Sink = require('@rdfjs/sink')

class Serializer extends Sink {
  constructor (options) {
    super(SerializerStream, options)
  }

  transform (quads) {
    return (new PlainSerializer(this.options)).transform(quads)
  }
}

module.exports = Serializer
