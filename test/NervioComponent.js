import { camelToHyphen, lock } from "../src/Utils.js";

export class NervioComponent extends HTMLElement {
	castProps = {};

	constructor() {
		super();

		this.componentId = crypto.randomUUID();
		this._domParser;
		this.constructor.define();
		this.whenReady = lock(`componentId:${this.componentId}`);
		this.addEventListener('connected', () => {
			this.whenReady.unlock();
		}, { once: true });

		this.props = new Proxy({}, {
			get: (_targ, paramProp) => {
				let prop = camelToHyphen(paramProp);
				const strVal = this.getAttribute(`${prop}`);
				const castVal = (this.castProps[prop]?.cast) ? this.castProps[prop]?.cast(strVal) : strVal;

				return castVal;
			},
			set: (_targ, prop, val) => {
				this.setAttribute(prop, val);
				if (this.castProps[prop]?.on) this.castProps[prop]?.on(val);
				return true;
			}
		});
		this.refs = new Proxy({}, {
			get: (_targ, prop) => {
				return this.querySelectorAll(`[n-ref="${prop}"]`);
			}
		});

		this.templateReadyLock = lock(`templateReadyLock:${this.componentId}`);
		const metaURL = this.getFileUrl().replace('.js', '.html');
		fetch(metaURL)
			.then((resp) => {
				resp.text()
					.then((htmlStr) => {
						this._domParser = new DOMParser();
						/** @type {HTMLTemplateElement} */
						const template = this._domParser.parseFromString(htmlStr, 'text/html').querySelector('template');
						const attrs = template.getAttributeNames();
						for (const attrName of attrs) {
							this.setAttribute(attrName, template.getAttribute(attrName));
						}

						const defaultStyles = template.getAttribute('style');
						if (defaultStyles) {
							const newStyles = this.getAttribute('style');
							this.setAttribute('style', newStyles ? `${defaultStyles} ${newStyles}` : defaultStyles);
						}

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

	static async import(pathOrURL, baseUrl) {
		if (baseUrl) {
			pathOrURL = new URL(pathOrURL, baseUrl).toString();
		}
		const importedModules = await import(pathOrURL);
		const importedModule = importedModules.default || importedModules[Object.keys(importedModules)[0]]
		importedModule.define();
		
		return importedModule;
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

	getFileUrl() {
		const stackTraceFrames = String(new Error().stack)
			.replace(/^Error.*\n/, '')
			.split('\n');
		// 0 = this getFileUrl frame (because the Error is created here)
		// 1 = the caller of getFileUrl (the file path we want to grab)
		const callerFrame = stackTraceFrames.filter((val) => !val.includes(import.meta.url))[0];
		// Extract the script's complete url
		const url = (callerFrame.match(/[a-z]*:\/\/([a-z]|[A-Z]|[0-9]|\s|\\|\/|\.|%)*/)[0]);
		return url;
	}

	async import() {
		NervioComponent.import(this.getFileUrl());
	}
}