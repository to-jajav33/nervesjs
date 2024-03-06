import { NervioComponent } from "../../NervioComponent.js";

export class ViewMain extends NervioComponent {
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
			this._currentLabelIndex++;

			this.refs.refLabel[0].textContent = this._labels[this._currentLabelIndex];
		})
	}
}

ViewMain.define();
