import { randomInRange } from "./Utils.js";

export class Level {
	constructor() {
		this.inputs = [];
		this.outputs = [];
		this.biases = [];
		this.weights = [];
	}

	/**
	 * 
	 * @param {number} inputCount 
	 * @param {number} outputCount 
	 */
	async init(inputCount, outputCount) {
		this.inputs = new Array(inputCount);
		this.outputCount = new Array(outputCount);
		this.biases = new Array(outputCount);

		this.weights = [];
		for (let i = 0; i < inputCount; i++) {
			this.weights[i] = new Array(outputCount);
		}

		Level.#randomize(this);
	}

	/**
	 * 
	 * @param {Level} level 
	 */
	static #randomize(level) {
		const max = 1;
		const min = -1;
		for (let i = 0; i < level.inputs; i++) {
			for (let j = 0; j < level.outputs.length; j++) {
				level.weights[i][j] = randomInRange(max, min);
			}
		}

		for (let i = 0; i < level.biases.length; i++) {
			level.biases[i] = randomInRange(max, min);
		}
	}
}
