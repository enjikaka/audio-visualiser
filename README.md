# `<audio-visualiser>`

FFT Audio Analyser visuals ready for retina displays.

Note: Uses ResizeObserver. Polyfill it on your end.

## API

### Inputs

| Method | Description | Related media event |
| --- | --- | --- |
| `set analyser` | Set analyser to read data from. |  |
| `start()` | Start the visuals drawing loop. | [`play`](https://developer.mozilla.org/en-US/docs/Web/Events/play) |
| `stop()` | Stop the visuals drawing loop. | [`pause`](https://developer.mozilla.org/en-US/docs/Web/Events/pause) / [`ended`](https://developer.mozilla.org/en-US/docs/Web/Events/ended) |

| Attribute | Description |
| --- | --- |
| `color` | Sets the color of the visual. |

## Usage

Install audio-visualiser via npm or import it in your ES module supported browser with `import 'https://cdn.skypack.dev/audio-visualiser';`

Create an AnalyserNode and connect it to <audio-visualier> by calling the setter `analyser` on the instance of the custom element. `document.querySelector('audio-visualiser').analyser = yourAnalyserNode;`. For a little live demo of this you can check out https://enjikaka.github.io/audio-visualiser/. Open dev tools or view-source to see how the <audio> tag is set up to the analyser via createMediaElementSource.

```html
<audio id="audio" src="worth-fighting-for.mp3" controls></audio>
<audio-visualiser id="visuals" color="rebeccapurple"></audio-visualiser>
```

```js
import 'https://cdn.skypack.dev/audio-visualiser';

const audio = document.getElementById('audio');
const visuals = document.getElementById('visuals');

audio.currentTime = 41;

const audioContext = new AudioContext();

const source = audioContext.createMediaElementSource(audio);
const analyser = audioContext.createAnalyser();

analyser.fftSize = 1024;

source.connect(analyser);
analyser.connect(audioContext.destination);

visuals.analyser = analyser;

audio.addEventListener('play', () => {
  audioContext.resume();
  console.log('playing');
  visuals.start();
});

audio.addEventListener('pause', () => {
  console.log('paused');
  visuals.stop();
});
```