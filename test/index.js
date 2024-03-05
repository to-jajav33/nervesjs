import { SketchPad } from "./sketchPad/SketchPad.js";

(async () => {
	const sketchPad = new SketchPad(); 
	sketchPad.addEventListener('connected', () => {
		console.log('ready');
	});
	document.body.appendChild(sketchPad);
})();
