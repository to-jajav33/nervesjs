import { camelToHyphen, lock } from "../src/Utils.js";

export class NerveComponent extends HTMLElement {
	castProps = {};

	constructor({ metaURL }) {
		super();
		this._domParser;
		this.constructor.define();

		this.props = new Proxy({}, {
			get: (_targ, prop) => {
				const strVal = this.getAttribute(`n-${prop}`);
				const castVal = this.castProps[prop]?.cast(strVal) || strVal;
				return castVal;
			}
		});
		this.refs = new Proxy({}, {
			get: (_targ, prop) => {
				return this.querySelectorAll(`[n-ref="${prop}"]`);
			}
		});

		this.templateReadyLock = lock('templateReadyLock');
		fetch(metaURL.replace('.js', '.html'))
			.then((resp) => {
				resp.text()
					.then((htmlStr) => {
						this._domParser = new DOMParser();
						/** @type {HTMLTemplateElement} */
						const template = this._domParser.parseFromString(htmlStr, 'text/html').querySelector('template');
						this.insertBefore(template.content.cloneNode(true), this.firstChild);
						this.templateReadyLock.unlock();
					});
			});
	}

	static define() {
		const hyphenName = camelToHyphen(this.name);
		if (customElements.get(hyphenName)) return;

		customElements.define(hyphenName, this);
	}

	async connectedCallback() {
		await this.templateReadyLock;
		this.dispatchEvent(new CustomEvent('connected'));
	}

	async disconnectedCallback() {
		let prevLock = this.diconnectedLock || Promise.resolve();
		let newLock = lock('disconnectedLock');
		this.diconnectedLock = newLock;
		await prevLock;

		this.dispatchEvent(new CustomEvent('disconnected'));
		newLock.unlock();
	}
}