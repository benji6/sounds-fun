# sounds-fun

###### Web Audio Library for Brighton Digital Festival

Caution! Setting some values too high may cause horrible and very loud sounds, experiment with low values first

# Installation

sounds-fun has zero dependencies and should run in any ES5 environment that supports the Web Audio API and Promises. It also has a `jsnext:main` field for [rollup](https://github.com/rollup/rollup/wiki/jsnext:main) users

```bash
npm i -S github:benji6/sounds-fun.git
```

# Instructions

## Getting started

```javascript
import soundsFun from 'sounds-fun'

const audioContext = new AudioContext

const loadSample = soundsFun(audioContext)
const playMySample = loadSample('samples/my-sample.wav')
playMySample({
  echo: {feedback: 0.5, time: 0.3},
  filter: {frequency: 1500, resonance: 10},
  gain: 1,
  pan: 1,
  playbackRate: 0.75,
  reverse: true,
}).catch(err => {
  // handle error
})
```

## API

sounds-fun exports a single curried function that takes 3 arguments:
  1. an `AudioContext` instance (it is best practice to only instantiate the `AudioContext` once per app)
  2. a url string for the sample to be loaded
  3. an options object specifying what effects are to be applied (or pass no arguments if you want the default options)

Here is the specification for the options object:

- `echo` - `Object | undefined` - optional property - defaults to `{feedback: 0.5, time: 0.3}` if set to an object then the sound will be played with an echo effect. The echo's `time` property is configurable by setting a `time` property on the `echo` object in seconds. The echo's `feedback` property is configurable by setting a `feedback` property on the `echo` object which is clamped between 0 and 1
- `filter` - `Object | undefined` - optional property - defaults to `{frequency: 1500, resonance: 10}` - if set to an object then the sound will be played with a lowpass filter effect. The filter's `frequency` property is configurable by setting a `frequency` property on the `filter` object in Hertz. The filter's `resonance` property is configurable by setting a `resonance` property on the `filter` object
- `gain` - `Number | undefined` - optional property - defaults to `1` - this determines how loud the sound will be
- `pan` - `Number | undefined` - optional property - defaults to `0` - this determines where the sound will come from on stereo systems - a value of -1 means it will come from the left, 0 from the center and 1 from the right
- `playbackRate` - `Number | undefined` - deaults to `0` - optional property - this determines how quickly the sound will be played back with 1 being the original speed. If you give a number between 0 and 1 the sound will take longer to play and be lower pitched and a value greater than 1 will make the sound quicer and higher pitched
- `reverse` - `Boolean | undefined` - optional property - defaults to `false` - if set to `true` the sound will play backwards
