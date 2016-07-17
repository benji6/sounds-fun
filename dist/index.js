'use strict';

var index = audioContext => {
  if (!(audioContext instanceof window.AudioContext)) {
    throw new Error('sounds-fun expected an AudioContext instance as its first argument and instead received:', audioContext);
  }

  return url => {
    if (typeof url !== 'string') {
      throw new Error('sounds-fun expected a url string as its second argument and instead received:', url);
    }

    const bufferPromise = new Promise((resolve, reject) => {
      const req = new window.XMLHttpRequest();
      req.responseType = 'arraybuffer';
      req.open('GET', url, true);
      req.onerror = reject;
      req.onreadystatechange = () => {
        if (req.readyState !== window.XMLHttpRequest.DONE) return;
        if (req.status >= 200 && req.status < 300) {
          resolve(audioContext.decodeAudioData(req.response));
        } else {
          reject(new Error(`${ req.status } status received when fetching from ${ url }`));
        }
      };
      req.send();
    });

    return ({
      echo,
      filter,
      gain = 1,
      pan = 0,
      playbackRate = 1,
      reverse = false
    } = {}) => bufferPromise.then(buffer => {
      const sourceNode = audioContext.createBufferSource();
      const gainNode = audioContext.createGain();
      const panNode = audioContext.createStereoPanner();
      const duration = buffer.duration / playbackRate + 0.1;
      const stopTime = audioContext.currentTime + duration;
      const delayGainNode = audioContext.createGain();

      gainNode.gain.value = gain;
      panNode.pan.value = pan;

      sourceNode.buffer = buffer;
      sourceNode.playbackRate.value = playbackRate;

      if (reverse) {
        Array.apply(null, { length: buffer.numberOfChannels }).map((_, i) => buffer.getChannelData(i).reverse());
      }

      sourceNode.connect(gainNode);
      panNode.connect(audioContext.destination);

      if (echo) {
        const { time = 0.3, feedback = 0.5 } = echo;
        const delayNode = audioContext.createDelay();

        delayNode.delayTime.value = time;
        delayGainNode.gain.value = feedback < 0 ? 0 : feedback > 1 ? 1 : feedback;

        panNode.connect(delayNode);
        delayNode.connect(delayGainNode);
        delayGainNode.connect(audioContext.destination);
        delayGainNode.connect(delayNode);

        if (feedback < 1) {
          window.setTimeout(() => delayGainNode.disconnect(), 60 * 1000);
        }
      }

      if (filter) {
        const filterNode = audioContext.createBiquadFilter();
        const { frequency = 1500, resonance = 10 } = filter;

        filterNode.frequency.value = frequency;
        filterNode.Q.value = resonance;
        gainNode.connect(filterNode);
        filterNode.connect(panNode);
      } else {
        gainNode.connect(panNode);
      }

      sourceNode.start();
      sourceNode.stop(stopTime);

      window.setTimeout(() => panNode.disconnect(), duration * 1000);
    });
  };
};

module.exports = index;
