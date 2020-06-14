const getStream = require('get-stream')
const { Readable } = require('readable-stream')
const PlainSerializer = require('./PlainSerializer')

class SerializerStream extends Readable {
  constructor (input) {
    super({
      objectMode: true,
      read: () => {}
    })

    getStream.array(input).then(quads => {
      this.push((new PlainSerializer()).transform(quads))
      this.push(null)
    }).catch(err => {
      this.destroy(err)
    })
  }
}

module.exports = SerializerStream
