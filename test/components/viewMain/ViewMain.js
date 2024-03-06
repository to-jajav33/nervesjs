import { NervioComponent } from "../../NervioComponent.js";

export class ViewMain extends NervioComponent {
	/**
	 * @type {{
	 * 	refSketchPad: import("../sketchPad/SketchPad.js").SketchPad[]
	 * 	refLabel: HTMLSpanElement[],
	 * 	refNextButton: HTMLButtonElement[]
	 * }
	 * }
	 */
	refs = this.refs;

	constructor() {
		super();
		
		this._handleConnected = this._handleConnected.bind(this);
		
		this.data = {
			username: '',
			session: crypto.randomUUID(),
			drawings: {},
		};

		this._currentLabelIndex = 0;
		this._labels = ['car', 'fish', 'house', 'tree', 'bicycle', 'guitar', 'pencil', 'clock'];


		NervioComponent.import('../sketchPad/SketchPad.js', this.getFileUrl());

		this.addEventListener('connected', this._handleConnected);
	}

	_handleConnected() {
		this.refs.refLabel[0].textContent = this._labels[this._currentLabelIndex];
	
		this.refs.refNextButton[0].addEventListener('click', () => {
			const sketchPad = this.refs.refSketchPad[0];
			if (!sketchPad?.paths?.length) {
				alert('Draw something first');
				return;
			}

			const currLabel = this._labels[this._currentLabelIndex];
			this.data.drawings[currLabel] = sketchPad.paths;

			this._currentLabelIndex++;

			this.refs.refLabel[0].textContent = this._labels[this._currentLabelIndex];

			this.refs.refNextButton[0].disabled = (this._currentLabelIndex >= this._labels.length - 1);

			sketchPad.reset();
		})
	}
}

ViewMain.define();
