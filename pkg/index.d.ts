export default class AudioVisualiser extends HTMLElement {
    static get observedAttributes(): string[];
    fillStyle: string;
    /** @type {AnalyserNode|null} */
    _analyser: AnalyserNode | null;
    /** @type {ShadowRoot|null} */
    _sDOM: ShadowRoot | null;
    _animationLoop: number;
    resizeObserver: ResizeObserver;
    /**
     * @param {AnalyserNode} analyser
     */
    set analyser(arg: AnalyserNode);
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    stop(): void;
    animationLoop: number;
    start(): void;
    updateCanvasSize(): void;
    render(): void;
    canvas: HTMLCanvasElement;
    canvasContext: CanvasRenderingContext2D;
    connectedCallback(): void;
}
