function generateCoordinates (i, frequencyData, canvasWidth, canvasHeight) {
  const barWidth = (canvasWidth / frequencyData.length); // eslint-disable-line no-bitwise
  const x = ~~(i * barWidth); // eslint-disable-line no-bitwise
  const y = canvasHeight - ~~(Math.min(255, Math.max(0, frequencyData[i])) * (canvasHeight / 255)); // eslint-disable-line no-bitwise

  return [x, y];
}

export default class AudioVisualiser extends HTMLElement {
  constructor () {
    super();

    this.fillStyle = '#ffffff';

    /** @type {AnalyserNode|null} */
    this._analyser = null;
    // @ts-ignore
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

      if (this.canvasContext) {
        this.canvasContext.fillStyle = newValue;
      }
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

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      this.canvasContext.fillStyle = this.fillStyle;
      this.canvasContext.lineCap = 'round';
      this.canvasContext.lineJoin = 'round';

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

    if (this.fillStyle) {
      this.canvasContext.fillStyle = this.fillStyle;
    }
  }

  connectedCallback () {
    this.sDOM = this.attachShadow({ mode: 'closed' });
    this.render();
    this.updateCanvasSize();
  }
}

customElements.define('audio-visualiser', AudioVisualiser);
