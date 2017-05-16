
const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

function loadBuffer(url) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.open('GET', url, true)
    request.responseType = 'arraybuffer'

    request.onload = () => {
      audioCtx.decodeAudioData(request.response, (buffer) => {
        if (!buffer) reject("Error decoding file data: " + url)
        else resolve(buffer)
      },
        error => reject("decodeAudioData error: " + error)
      )
    }
    request.onerror = () => reject("BufferLoader: XHR error")
    request.send()
  })
}


class AudioManager {

  constructor() {
    this.sourceNodesFactories = {}
  }

  load(namedSoundUrls) {
    return Promise.all(
      Object.keys(namedSoundUrls).map(soundName =>
        loadBuffer(namedSoundUrls[soundName])
          .then(buffer => this.sourceNodesFactories[soundName] = this.createAudioBufferSourceNode.bind(this, buffer))
      )
    )
  }

  createAudioBufferSourceNode(buffer) {
    const source = audioCtx.createBufferSource()
    source.buffer = buffer
    source.connect(audioCtx.destination)
    return source
  }

  get(name) { return this.sourceNodesFactories[name]() }

}

export default AudioManager