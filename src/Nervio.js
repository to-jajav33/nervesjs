import { Level } from "./Level.js";

export class Nervio {
	/**
	 * 
	 * @param {number} inputCount 
	 * @param {number} outputCount 
	 */
	async start(inputCount, outputCount) {
		const level = new Level();
		await level.init(inputCount, outputCount);
	}
}
