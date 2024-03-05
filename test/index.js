import { SketchPad } from "./sketchPad/SketchPad.js";

(async () => {
	const sketchPad = new SketchPad(); 
	sketchPad.addEventListener('connected', () => {
		sketchPad.refs.refCanvas[0].style.backgroundColor = 'gray';
		sketchPad.refs.refCanvas[0].style.boxShadow = '0px 0px 10px 2px black';
		sketchPad.refs.refCanvas[0].style.height = '400px';
		sketchPad.refs.refCanvas[0].style.width = '400px';
		sketchPad.props.width = 400;
		sketchPad.props.height = 400;
	});
	document.body.appendChild(sketchPad);
})();
