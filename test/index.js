import { NervioRouter } from "./components/nervioRouter/NervioRouter.js";
import { ViewImagesViewer } from "./components/viewImagesViewer/ViewImagesViewer.js";
import { ViewMain } from "./components/viewMain/ViewMain.js";

(() => {
	const router = document.querySelector('nervio-router');
	debugger;
	router.addEventListener('connected', async () => {
		router.routes = {
			'/': {
				component: ViewMain
			},
			'/viewer': {
				component: ViewImagesViewer
			},
		};

		await router.goTo(window.location.hash.replace('#', ''));
	});
})();
