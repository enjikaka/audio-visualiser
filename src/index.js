function generateCoordinates (i, frequencyData, canvasWidth, canvasHeight) {
  const barWidth = (canvasWidth / frequencyData.length); // eslint-disable-line no-bitwise
  const x = ~~(i * barWidth); // eslint-disable-line no-bitwise
  const y = canvasHeight - ~~(Math.min(255, Math.max(0, frequencyData[i])) * (canvasHeight / 255)); // eslint-disable-line no-bitwise

  return [x, y];
}

const html = tagString => document.createRange().createContextualFragment(tagString);

const template = html(`
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
`);

export default class AudioVisualiser extends HTMLElement {
  constructor () {
    super();

    this.fillStyle = '#ffffff';

    /** @type {AnalyserNode|null} */
    this._analyser = null;

    /** @type {ShadowRoot|null} */
    this._sDOM = null;

    this._animationLoop = 0;

    this.resizeObserver = new ResizeObserver(entry => requestAnimationFrame(() => this.updateCanvasSize(entry)));
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
    if (name === 'color' && newValue && newValue !== oldValue) {
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

    if (!analyser || this._resizing) {
      throw new ReferenceError('Analyser has not been set');
    }

    const { width, height } = canvas;
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);

    analyser.getByteFrequencyData(frequencyData);

    canvasContext.clearRect(0, 0, width, height);
    canvasContext.beginPath();

    canvasContext.moveTo(0, height);

    [...new Array(frequencyData.length)]
      .map((_, i) => generateCoordinates(i, frequencyData, width, height))
      .concat([[width, height]])
      .concat([[0, height]])
      .forEach(([x, y]) => canvasContext.lineTo(x, y));

    canvasContext.closePath();
    canvasContext.fill();

    this.animationLoop = requestAnimationFrame(this.start.bind(this));
  }

  /**
   * @param {ResizeObserverEntry|undefined} entry
   * @returns {void}
   */
  updateCanvasSize (entry) {
    const { canvas } = this;

    if (canvas instanceof HTMLCanvasElement) {
      const rect = entry ? entry.contentRect : canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }
  }

  render () {
    const { _sDOM } = this;

    _sDOM.appendChild(template.cloneNode(true));

    this.canvas = _sDOM.querySelector('canvas');
    this.canvasContext = this.canvas.getContext('2d');

    this.canvasContext.lineCap = 'round';
    this.canvasContext.lineJoin = 'round';
    this.canvasContext.fillStyle = this.getAttribute('color') || this.fillStyle;

    this.resizeObserver.observe(this.canvas);
  }

  connectedCallback () {
    this._sDOM = this.attachShadow({ mode: 'closed' });

    this.render();
    this.updateCanvasSize();
  }
}

customElements.define('audio-visualiser', AudioVisualiser);
