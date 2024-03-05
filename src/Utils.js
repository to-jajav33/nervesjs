
/**
 * 
 * @param {number} max 
 * @param {number} min 
 * @returns 
 */
export function randomInRange(max, min) {
	return (Math.random() * (max - min)) + min;
}

/**
 * 
 * @param {string} str 
 * @returns 
 */
export function camelToHyphen(str) {
	str = str.replace(str[0], str[0].toLowerCase());
	return str.replaceAll(/[A-Z]/g, (val) => {
		return `-${val.toLowerCase()}`;
	})
}

export function promiseFactory(cb) {
	let _resolve, _reject;
	const prom = new Promise((resolve, reject) => {
		_resolve = resolve;
		_reject = reject;
	});

	prom.state = 'pending';
	prom.resolve = _resolve;
	prom.reject = _reject;

	cb(prom.resolve, prom.reject);

	return prom;
}

const locks = {};
export function lock(lockName) {
	const oldLock = locks[lockName];

	const prom = promiseFactory(() => {});
	prom.unlock = prom.resolve;
	
	locks[lockName] = prom;

	if (oldLock) return Promise.resolve(oldLock).then(prom);
	return prom;
}
