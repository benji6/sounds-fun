import soundsFun from '../src/index'

const audioContext = new window.AudioContext()

// test sample taken from http://sampleswap.org
soundsFun(audioContext)('samples/lion-roar.wav')({
  echo: {feedback: 0.5, time: 0.3},
  filter: {frequency: 1500, resonance: 10},
  gain: 1,
  pan: 1,
  playbackRate: 0.75,
  reverse: true
}).catch(console.error.bind(console))
