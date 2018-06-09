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
