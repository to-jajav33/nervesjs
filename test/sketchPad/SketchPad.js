import { NerveComponent } from "../NeverComponent.js";

export class SketchPad extends NerveComponent {
	castProps = {
		height: {
			cast: (val) => {
				return Number(val);
			},
			on: (val) => {
				this.refs.refCanvas[0].height = val;
			}
		},
		width: {
			cast: (val) => {
				return Number(val);
			},
			on: (val) => {
				this.refs.refCanvas[0].width = val;
			}
		}
	}
	constructor() {
		super({ metaURL: import.meta.url });
		
		this.handleConnected = this.handleConnected.bind(this);
		this.handlePointerDown = this.handlePointerDown.bind(this);
		this.handlePointerUp = this.handlePointerUp.bind(this);
		this.handlePointerMove = this.handlePointerMove.bind(this);

		this.path = [];
		/** @type {CanvasRenderingContext2D} */
		this.ctx;
		this.addEventListener('connected', this.handleConnected);
	}

	getMousePos(ev) {
		const rect = this.refs.refCanvas[0].getBoundingClientRect();

		const mousePos = [
			ev.clientX - rect.left,
			ev.clientY - rect.top,
		];

		return mousePos;
	}

	handleConnected() {
		this.ctx = this.refs.refCanvas[0].getContext('2d');
		this.refs.refCanvas[0].addEventListener('pointerdown', this.handlePointerDown);
		this.refs.refCanvas[0].addEventListener('pointerup', this.handlePointerUp);
		this.refs.refCanvas[0].addEventListener('pointermove', this.handlePointerMove);
	}

	handlePointerDown(ev) {
		this.path = [this.getMousePos(ev)];

		this.isDrawing = true;
	}

	handlePointerMove(ev) {
		if (!this.isDrawing) return;

		this.path.push(this.getMousePos(ev));

		this.ctx.strokeStyle = 'black';
		this.ctx.lineWidth = 3;
		this.ctx.beginPath();
		this.ctx.moveTo(...this.path[0]);
		for (let i = 1; i < this.path.length; i++) {
			this.ctx.lineTo(...this.path[i]);
		}

		this.ctx.stroke();
	}

	handlePointerUp(ev) {
		this.isDrawing = false;
	}

	
}

SketchPad.define();
