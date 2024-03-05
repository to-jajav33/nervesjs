import { SketchPad } from "./sketchPad/SketchPad.js";

(async () => {
	const sketchPad = new SketchPad(); 
	sketchPad.addEventListener('connected', () => {
		console.log('ready');
		sketchPad.style.backgroundColor = 'blue';
		sketchPad.props.width = 30;
	});
	document.body.appendChild(sketchPad);
})();
