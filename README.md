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

Install audio-visualiser via npm or import it in your ES module supported browser with `import 'https://unpkg.com/audio-visualiser?module';`

Create an AnalyserNode and connect it to <audio-visualier> by calling the setter `analyser` on the instance of the custom element. `document.querySelector('audio-visualiser').analyser = yourAnalyserNode;`. For a little live demo of this you can check out https://enjikaka.github.io/audio-visualiser/. Open dev tools or view-source to see how the <audio> tag is set up to the analyser via createMediaElementSource.
