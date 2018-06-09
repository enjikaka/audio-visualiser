class AudioVisualiser extends HTMLElement {
  constructor () {
    super();

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

  stop () {
    cancelAnimationFrame(this.animationLoop);

    this.animationLoop = undefined;
  }

  start () {
    const { canvas, _analyser: analyser } = this;

    if (!analyser) {
      throw new ReferenceError('Analyser has not been set');
    }

    const canvasHeight = canvas.height;
    const canvasWidth = canvas.width;
    const canvasContext = canvas.getContext('2d');
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);

    analyser.getByteFrequencyData(frequencyData);

    canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
    canvasContext.beginPath();
    canvasContext.fillStyle = this.getAttribute('color') || 'rgb(255,255,255)';

    function makeX (i) {
      const barWidth = (canvasWidth / analyser.frequencyBinCount);

      return ~~(i * barWidth); // eslint-disable-line no-bitwise
    }

    function makeY (i) {
      return (canvasHeight - (canvasHeight * (frequencyData[i] / 255))); // eslint-disable-line no-bitwise
    }

    canvasContext.moveTo(makeX(0), makeY(0));

    [...new Array(canvasWidth - 1)].forEach((_, i) => canvasContext.lineTo(makeX(i), makeY(i)));

    canvasContext.lineTo(canvasWidth, canvasHeight);
    canvasContext.lineTo(0, canvasHeight);
    canvasContext.closePath();
    canvasContext.fill();

    this.animationLoop = requestAnimationFrame(this.start.bind(this));
  }

  updateCanvasSize () {
    const { canvas } = this;

    if (canvas instanceof HTMLCanvasElement) {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;

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
        opacity: 0.8;
      }
      </style>
      <canvas></canvas>
    `;

    this.canvas = this.sDOM.querySelector('canvas');
  }

  connectedCallback () {
    this.sDOM = this.attachShadow({ mode: 'closed' });
    this.render();
    this.updateCanvasSize();
  }
}

customElements.define('audio-visualiser', AudioVisualiser);
