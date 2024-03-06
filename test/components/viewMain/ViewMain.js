import { NervioComponent } from "../../NervioComponent.js";

export class ViewMain extends NervioComponent {
	constructor() {
		super();

		NervioComponent.import('../sketchPad/SketchPad.js', this.getFileUrl());
	}
}

ViewMain.define();
