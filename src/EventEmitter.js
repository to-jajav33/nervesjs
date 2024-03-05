/** @typedef {() => void | Promise<void>} TypeListener */
/** @typedef {{once?: boolean}} TypeListenerOptions */
/**
 * @typedef {{
 * 	fn: TypeListener,
 * 	scope?: unknown,
 * 	opts: TypeListenerOptions,
 * }} TypeListenerInfo
 * */

export class EventEmitter {
	/** @type {Record<string, Array<TypeListenerInfo>>} */
	#events = {};

	constructor() {
		this.#events = {};
	}

	/**
	 * @template {T extends {}} T
	 * @param {string} evName 
	 * @param {TypeListener} fn 
	 * @param {T|undefined} scope 
	 * @param {{once?: boolean} | undefined} opts 
	 */
	on(evName, fn, scope, opts) {
		this.#events[evName] = this.#events[evName] || [];

		this.#events[evName].push({
			fn,
			scope,
			opts
		});
	}

	/**
	 * @template {T extends {}} T
	 * @param {string} evName 
	 * @param {TypeListener} fn 
	 * @param {T|undefined} scope 
	 * @param {{once?: boolean} | undefined} opts 
	 */
	off(evName, fn, scope) {
		let listenerInfoArr = this.#events[evName];
		if (!listenerInfoArr) return;

		let len = listenerInfoArr.length;
		for (let i = len - 1; i >= 0; i--) {
			let shouldDelete = false;
			const listenerInfo = listenerInfoArr[i];
			if (fn && scope && fn === listenerInfo.fn && scope === listenerInfo.scope) {
				shouldDelete = true;
			} else if (fn && fn === listenerInfo.fn) {
				shouldDelete = true;
			} else if (scope && scope === listenerInfo.scope) {
				shouldDelete = true;
			}

			if (shouldDelete) {
				listenerInfoArr.splice(i, 1);
			}
		}
	}
}
