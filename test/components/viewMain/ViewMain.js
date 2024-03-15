import { NervioComponent } from "../../NervioComponent.js";

export class ViewMain extends NervioComponent {
	/**
	 * @type {{
	 * 	refFileViewerButton: HTMLButtonElement[],
	 * refSketchPad: import("../sketchPad/SketchPad.js").SketchPad[]
	 * 	refLabel: HTMLSpanElement[],
	 * 	refNextButton: HTMLButtonElement[],
	 * 	refSaveButton: HTMLButtonElement[],
	 * }
	 * }
	 */
	refs = this.refs;

	constructor() {
		super();
		
		this._handleConnected = this._handleConnected.bind(this);
		this._handleDisconnected = this._handleDisconnected.bind(this);
		this._handleFileViewerButtonClick = this._handleFileViewerButtonClick.bind(this);
		this._handleNextButtonClick = this._handleNextButtonClick.bind(this);
		this._handleSaveButtonClick = this._handleSaveButtonClick.bind(this);

		/** @type {import('../nervioRouter/NervioRouter.js').NervioRouter} */
		this.router = document.body.querySelector('nervio-router');;

		this.data = {
			username: '',
			session: crypto.randomUUID(),
			drawings: {},
			/** @type {ImageData|undefined} */
			image: undefined,
		};

		this._currentLabelIndex = 0;
		this._labels = ['car', 'fish', 'house', 'tree', 'bicycle', 'guitar', 'pencil', 'clock'];


		NervioComponent.import('../sketchPad/SketchPad.js', this.getFileUrl());

		this.addEventListener('connected', this._handleConnected);
		this.addEventListener('disconnected', this._handleDisconnected);
	}

	_handleConnected() {
		this.refs.refLabel[0].textContent = this._labels[this._currentLabelIndex];
		
		this.refs.refSaveButton[0].disabled = true;
		this.refs.refSaveButton[0].style.display = 'none';
		this.refs.refFileViewerButton[0].addEventListener('click', this._handleFileViewerButtonClick);
		this.refs.refNextButton[0].addEventListener('click', this._handleNextButtonClick);
		this.refs.refSaveButton[0].addEventListener('click', this._handleSaveButtonClick);
	}
	
	_handleDisconnected() {
		this.refs.refSaveButton[0].removeEventListener('click', this._handleSaveButtonClick);
		this.refs.refNextButton[0].removeEventListener('click', this._handleNextButtonClick);
		this.refs.refFileViewerButton[0].removeEventListener('click', this._handleFileViewerButtonClick);
	}

	_handleFileViewerButtonClick() {
		this.router.goTo('/viewer')
	}

	_handleNextButtonClick() {
		const sketchPad = this.refs.refSketchPad[0];
		if (!sketchPad?.paths?.length) {
			alert('Draw something first');
			return;
		}

		const currLabel = this._labels[this._currentLabelIndex];
		this.data.drawings[currLabel] = sketchPad.paths;
		this.data.image = sketchPad.getImageData();

		this._currentLabelIndex++;

		const noMoreLabels = (this._currentLabelIndex > this._labels.length - 1);
		this.refs.refLabelPrefix[0].textContent = noMoreLabels ? '' : 'Please draw a ';
		this.refs.refLabel[0].textContent = noMoreLabels ? "DONE" : `${this._labels[this._currentLabelIndex]}`;

		this.refs.refNextButton[0].disabled = noMoreLabels;
		this.refs.refSaveButton[0].disabled = !noMoreLabels;
		this.refs.refNextButton[0].style.display = noMoreLabels ? 'none' : 'flex';
		this.refs.refSketchPad[0].style.display = noMoreLabels ? 'none' : 'flex';
		this.refs.refSaveButton[0].style.display = !noMoreLabels ? 'none' : 'flex';

		sketchPad.reset();
	}

	_handleSaveButtonClick() {
		const saveBtn = this.refs.refSaveButton[0];
		// saveBtn.disabled = true;
		saveBtn.textContent = 'Downloading...';
		
		const aTag = document.createElement('a');
		const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(this.data))}`;
		
		const fileName = this.data.session;
		aTag.setAttribute("href", dataStr);
		aTag.setAttribute("download", `${fileName}.json`);
		document.body.appendChild(aTag);
		aTag.click();
		aTag.remove();
		saveBtn.textContent = 'SAVE AGAIN';
	}
}

ViewMain.define();
