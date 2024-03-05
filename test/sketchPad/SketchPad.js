import { NerveComponent } from "../NeverComponent.js";

export class SketchPad extends NerveComponent {
	castProps = {
		width: {
			cast: (val) => {
				return Number(val);
			},
			on: (val) => {
				debugger;
				this.refs.refCanvas[0].width = val;
			}
		}
	}
	constructor() {
		super({ metaURL: import.meta.url });
	}
}

SketchPad.define();
