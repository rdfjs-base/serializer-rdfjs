import getStream from 'get-stream'
import { Readable } from 'readable-stream'
import PlainSerializer from './PlainSerializer.js'

class SerializerStream extends Readable {
  constructor (input, options) {
    super({
      objectMode: true,
      read: () => {}
    })

    getStream.array(input).then(quads => {
      this.push((new PlainSerializer(options)).transform(quads))
      this.push(null)
    }).catch(err => {
      this.destroy(err)
    })
  }
}

export default SerializerStream
