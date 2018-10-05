
function scaleValue (value, from, to) {
  const scale = (to[1] - to[0]) / (from[1] - from[0]);
  const capped = Math.min(from[1], Math.max(from[0], value)) - from[0];

  // eslint-disable-next-line no-bitwise
  return ~~(capped * scale + to[0]);
}

function generateCoordinates (i, frequencyData, canvasWidth, canvasHeight) {
  const barWidth = (canvasWidth / frequencyData.length);
  const x = ~~(i * barWidth); // eslint-disable-line no-bitwise
  const y = canvasHeight - scaleValue(frequencyData[i], [0, 255], [0, canvasHeight]);

  return [x, y];
}

class AudioVisualiser extends HTMLElement {
  constructor () {
    super();

    this.fillStyle = '#ffffff';

    /** @type {AnalyserNode|null} */
    this._analyser = null;
    this.resizeObserver = new ResizeObserver(() => this.updateCanvasSize());
  }

  /**
   * @param {AnalyserNode} analyser
   */
  set analyser (analyser) {
    if (analyser instanceof AnalyserNode) {
      this._analyser = analyser;
    } else {
      const actualType = typeof analyser;

      throw new TypeError(`Passed in parameter needs to be an AnalyserNode. Was a ${actualType}.`);
    }
  }

  static get observedAttributes () {
    return ['color'];
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'color' && newValue) {
      this.fillStyle = newValue;
      this.canvasContext.fillStyle = newValue;
    }
  }

  stop () {
    cancelAnimationFrame(this.animationLoop);

    this.animationLoop = undefined;
  }

  start () {
    const { canvas, canvasContext, _analyser: analyser } = this;

    if (!analyser) {
      throw new ReferenceError('Analyser has not been set');
    }

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);

    analyser.getByteFrequencyData(frequencyData);

    canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
    canvasContext.beginPath();

    canvasContext.moveTo(0, canvasHeight);

    [...new Array(frequencyData.length)]
      .map((_, i) => generateCoordinates(i, frequencyData, canvasWidth, canvasHeight))
      .concat([[canvasWidth, canvasHeight]])
      .concat([[0, canvasHeight]])
      .forEach(([x, y]) => canvasContext.lineTo(x, y));

    canvasContext.closePath();
    canvasContext.fill();

    this.animationLoop = requestAnimationFrame(this.start.bind(this));
  }

  updateCanvasSize () {
    const { canvas } = this;

    if (canvas instanceof HTMLCanvasElement) {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      const canvasWidth = rect.width * dpr;
      const canvasHeight = rect.height * dpr;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      this.resizeObserver.observe(canvas);
    }
  }

  render () {
    this.sDOM.innerHTML = `
      <style>
      :host {
        contain: strict;
      }

      canvas {
        width: 100%;
        height: 100%;
      }
      </style>
      <canvas></canvas>
    `;

    this.canvas = this.sDOM.querySelector('canvas');
    this.canvasContext = this.canvas.getContext('2d');
    this.canvasContext.fillStyle = this.fillStyle;
    this.canvasContext.lineCap = 'round';
    this.canvasContext.lineJoin = 'round';
  }

  connectedCallback () {
    this.sDOM = this.attachShadow({ mode: 'closed' });
    this.render();
    this.updateCanvasSize();
  }
}

customElements.define('audio-visualiser', AudioVisualiser);
