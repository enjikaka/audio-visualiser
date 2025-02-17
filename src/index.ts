function generateCoordinates(i, frequencyData, canvasWidth, canvasHeight) {
  const barWidth = (canvasWidth / frequencyData.length);
  const x = ~~(i * barWidth);
  const y = canvasHeight - ~~(Math.min(255, Math.max(0, frequencyData[i])) * (canvasHeight / 255));

  return [x, y];
}

export const html: (args: TemplateStringsArray) => Node = (...args) => {
  // @ts-ignore
  const text = String.raw(...args);

  const template = document.createElement('template');

  template.innerHTML = text;

  return template.content.cloneNode(true);
};

const template = html`
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

export default class AudioVisualiser extends HTMLElement {
  fillStyle: string = '#fff';
  #canvas: HTMLCanvasElement = null;
  #context: CanvasRenderingContext2D = null;
  #analyser: AnalyserNode = null;
  #sDOM: ShadowRoot = null;
  #animationLoop: number = 0;
  #resizeObserver: ResizeObserver = null;

  constructor() {
    super();

    this.#resizeObserver = new ResizeObserver(entry => requestAnimationFrame(() => this.updateCanvasSize(entry[0])));
  }

  set analyser(analyser: AnalyserNode) {
    if (analyser instanceof AnalyserNode) {
      this.#analyser = analyser;
    } else {
      const actualType = typeof analyser;

      throw new TypeError(`Passed in parameter needs to be an AnalyserNode. Was a ${actualType}.`);
    }
  }

  static get observedAttributes(): string[] {
    return ['color'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (name === 'color' && newValue && newValue !== oldValue) {
      this.fillStyle = newValue;
      this.updateCanvasColor();
    }
  }

  stop(): void {
    cancelAnimationFrame(this.#animationLoop);

    this.#animationLoop = undefined;
  }

  start(): void {
    if (!this.#analyser) {
      throw new ReferenceError('Analyser has not been set');
    }

    const { width, height } = this.#canvas;
    const ctx = this.#context;
    const frequencyData = new Uint8Array(this.#analyser.frequencyBinCount);

    this.#analyser.getByteFrequencyData(frequencyData);

    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();

    ctx.moveTo(0, height);

    const lines = [...new Array(frequencyData.length)]
      .map((_, i) => generateCoordinates(i, frequencyData, width, height))
      .concat([[width, height]])
      .concat([[0, height]]);

    for (const [x, y] of lines) {
      ctx.lineTo(x, y);
    }

    ctx.closePath();
    ctx.fill();

    this.#animationLoop = requestAnimationFrame(this.start.bind(this));
  }

  updateCanvasSize(entry?: ResizeObserverEntry): void {
    const canvas = this.#canvas;

    if (canvas instanceof HTMLCanvasElement) {
      const rect = entry ? entry.contentRect : canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }
  }

  updateCanvasColor(): void {
    if (this.#context) {
      this.#context.fillStyle = this.fillStyle;
    }
  }

  render(): void {
    const sDOM = this.#sDOM;

    sDOM.appendChild(template.cloneNode(true));

    this.#canvas = sDOM.querySelector('canvas');
    this.#context = this.#canvas.getContext('2d');

    this.#context.lineCap = 'round';
    this.#context.lineJoin = 'round';
    this.fillStyle = this.getAttribute('color');

    this.#resizeObserver.observe(this.#canvas);
  }

  connectedCallback(): void {
    this.#sDOM = this.attachShadow({ mode: 'closed' });

    this.render();
    this.updateCanvasSize();
    this.updateCanvasColor();
  }
}

customElements.define('audio-visualiser', AudioVisualiser);
