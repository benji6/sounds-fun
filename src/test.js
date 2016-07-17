const audioContext = new window.AudioContext()

const playSound = window.funSounds(audioContext)

setTimeout(() => playSound({
  gain: 1,
  name: 'lion-roar',
  pan: 1,
  playbackRate: 1
}), 500)

setTimeout(() => playSound({
  gain: 1,
  name: 'lion-roar',
  pan: -1,
  playbackRate: 1
}), 1500)
