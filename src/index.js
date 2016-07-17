const sampleNames = [
  'lion-roar'
]

const sampleNamesString = JSON.stringify(sampleNames)

const playSample = ({
  audioContext,
  buffer,
  gain,
  pan,
  playbackRate
}) => {
  const source = audioContext.createBufferSource()
  const gainNode = audioContext.createGain()
  const panNode = audioContext.createStereoPanner()
  const duration = buffer.duration / playbackRate + 0.1
  const stopTime = audioContext.currentTime + duration

  gainNode.gain.value = gain
  panNode.pan.value = pan

  source.buffer = buffer
  source.playbackRate.value = playbackRate

  source.connect(gainNode).connect(panNode).connect(audioContext.destination)
  source.start()
  source.stop(stopTime)

  window.setTimeout(
    () => source.disconnect(),
    duration * 1000
  )
}

window.funSounds = audioContext => {
  const buffers = {}

  sampleNames.forEach(
    filename => window.fetch(`samples/${filename}.wav`)
      .then(response => response.arrayBuffer())
      .then(data => audioContext.decodeAudioData(data))
      .then(buffer => buffers[filename] = buffer)
  )

  return ({
    gain = 1,
    name,
    pan = 0,
    playbackRate = 1
  }) => {
    if (name === undefined) {
      throw new Error(`please provide an object with a name property that is one of the following strings: ${sampleNamesString}`)
    }

    const buffer = buffers[name]

    if (!buffer) {
      throw new Error(`"${name}" is not a recognised sample name, please use one of the following: ${sampleNamesString}`)
    }

    playSample({
      audioContext,
      buffer,
      gain,
      pan,
      playbackRate
    })
  }
}
