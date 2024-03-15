import { NervioComponent } from "../../NervioComponent";

export class NervioRepeat extends NervioComponent {
	constructor() {
		super();

		this._handleConnect = this._handleConnect.bind(this);

		this._items = [];
		this._repeatTemplate;

		this.addEventListener('connect', this._handleConnect);
	}

	get items() {
		return this._items;
	}
	set items(val) {
		this.items.splice(0, this.items.length, ...val);
	}

	_handleConnect() {
		this._repeatTemplate = this._repeatTemplate || this.querySelector('template');

		if (!this._repeatTemplate) throw ('Missing <template></template>');
		this.updateItems();
	}


	async updateItems() {
		const arr = this.items;
		const template = this._repeatTemplate;
		const parentElement = this;

		if (typeof arr === 'number') {
			arr = new Array(arr);
		}

		/**
		 * @type {Map<HTMLElement, {
		 * parentElement: HTMLElement,
		 * repeated: HTMLElement[],
		 * template: HTMLTemplateElement,
		 * }>}
		 * */
		const map = this.constructor.repeatElementInfo;
		if (!map.has(template)) {
			map.set(template, {
				repeated: [],
				parentElement,
				template,
			});
		}

		const repeatInfo = map.get(template);
		if (repeatInfo.repeated.length > arr.length) {
			// add
			for (let i = arr.length; i < repeatInfo.repeated.length - 1; i++) {
				const newElem = repeatInfo.template.cloneNode(true);
				repeatInfo.parentElement.appendChild(newElem);
				if (newElem.whenReady) await newElem.whenReady;
			}
		} else {
			// remove
			const totalElems = repeatInfo.repeated.length;
			for (let i = totalElems; i >= arr.length; i--) {
				await Promise.resolve(repeatInfo.repeated[i].remove());
			}
		}

		for (let i in repeatInfo.repeated) {
			const elem = repeatInfo.repeated[i];
			this.dispatchEvent(new CustomEvent('n-on-change', {
				detail: {
					elem,
					item: arr[i],
					index: i,
				}
			}));
		}
	}
}
