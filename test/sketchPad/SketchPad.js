import { NerveComponent } from "../NeverComponent.js";

export class SketchPad extends NerveComponent {
	constructor() {
		super({metaURL: import.meta.url})
	}
}

SketchPad.define();
