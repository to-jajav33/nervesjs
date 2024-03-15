import { NervioComponent } from "../../NervioComponent.js";

export class SketchPad extends NervioComponent {
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

	/**
	 * @type {{
	 * 	refCanvas: HTMLCanvasElement[]
	 * }}
	 */
	refs = this.refs;

	constructor() {
		super();
		
		this.handleConnected = this.handleConnected.bind(this);
		this.handlePointerDown = this.handlePointerDown.bind(this);
		this.handlePointerUp = this.handlePointerUp.bind(this);
		this.handlePointerMove = this.handlePointerMove.bind(this);

		this.paths = [];
		/** @type {CanvasRenderingContext2D} */
		this.ctx;
		this.addEventListener('connected', this.handleConnected);
	}

	draw() {
		this.ctx.strokeStyle = 'black';
		this.ctx.lineWidth = 3;
		this.ctx.lineCap = 'round';
		this.ctx.lineJoin = 'round';
		for (let i = 0; i < this.paths.length; i++) {
			this.ctx.beginPath();
			this.ctx.moveTo(...this.paths[i][0]);
			for (let j = 1; j < this.paths[i].length; j++) { 
				this.ctx.lineTo(...this.paths[i][j]);
			}
			this.ctx.stroke();
		}

		this.refs.refUndoButton[0].disabled = this.paths.length == 0;
	}

	getImageData() {
		const canvas = this.refs.refCanvas[0];
		return canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
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
		this.refs.refUndoButton[0].addEventListener('click', () => {
			this.paths.pop();
			this.redraw();
		});

		this.redraw();
	}

	handlePointerDown(ev) {
		this.paths.push([this.getMousePos(ev)]);

		this.draw();

		this.isDrawing = true;
	}

	handlePointerMove(ev) {
		if (!this.isDrawing) return;

		const lastPath = this.paths[this.paths.length - 1];
		lastPath.push(this.getMousePos(ev));

		this.draw();
	}

	handlePointerUp(ev) {
		this.isDrawing = false;
	}

	reset() {
		this.paths = [];
		this.isDrawing = false;

		this.redraw();
	}
	
	redraw() {
		this.ctx.clearRect(0, 0, this.refs.refCanvas[0].width, this.refs.refCanvas[0].height);
		this.draw();
	}
}

SketchPad.define();
