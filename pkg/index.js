function h(s,t,e,n){let i=e/t.length,a=~~(s*i),o=n-~~(Math.min(255,Math.max(0,t[s]))*(n/255));return[a,o]}var d=s=>document.createRange().createContextualFragment(s),f=d(`
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
`),r=class extends HTMLElement{constructor(){super();this.fillStyle="#ffffff",this._analyser=null,this._sDOM=null,this._animationLoop=0,this.resizeObserver=new ResizeObserver(()=>this.updateCanvasSize())}set analyser(t){if(t instanceof AnalyserNode)this._analyser=t;else{let e=typeof t;throw new TypeError(`Passed in parameter needs to be an AnalyserNode. Was a ${e}.`)}}static get observedAttributes(){return["color"]}attributeChangedCallback(t,e,n){t==="color"&&n&&n!==e&&(this.fillStyle=n,this.canvasContext&&(this.canvasContext.fillStyle=n))}stop(){cancelAnimationFrame(this.animationLoop),this.animationLoop=void 0}start(){let{canvas:t,canvasContext:e,_analyser:n}=this;if(!n)throw new ReferenceError("Analyser has not been set");let{width:i,height:a}=t,o=new Uint8Array(n.frequencyBinCount);n.getByteFrequencyData(o),e.clearRect(0,0,i,a),e.beginPath(),e.moveTo(0,a),[...new Array(o.length)].map((l,c)=>h(c,o,i,a)).concat([[i,a]]).concat([[0,a]]).forEach(([l,c])=>e.lineTo(l,c)),e.closePath(),e.fill(),this.animationLoop=requestAnimationFrame(this.start.bind(this))}updateCanvasSize(){let{canvas:t}=this;if(t instanceof HTMLCanvasElement){let e=t.getBoundingClientRect(),n=window.devicePixelRatio||1;t.width=e.width*n,t.height=e.height*n,this.canvasContext.fillStyle=this.fillStyle,this.canvasContext.lineCap="round",this.canvasContext.lineJoin="round",this.resizeObserver.observe(t)}}render(){let{_sDOM:t}=this;t.appendChild(f.cloneNode(!0)),this.canvas=t.querySelector("canvas"),this.canvasContext=this.canvas.getContext("2d"),this.fillStyle&&(this.canvasContext.fillStyle=this.fillStyle)}connectedCallback(){this._sDOM=this.attachShadow({mode:"closed"}),this.render(),this.updateCanvasSize()}},y=r;customElements.define("audio-visualiser",r);export{y as default};
//# sourceMappingURL=index.js.map
