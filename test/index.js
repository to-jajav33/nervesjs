import { NervioRouter } from "./components/nervioRouter/NervioRouter.js";
import { ViewMain } from "./components/viewMain/ViewMain.js";

(() => {
	const router = document.querySelector('nervio-router');

	router.addEventListener('connected', async () => {
		router.routes = {
			'/': {
				component: ViewMain
			}
		};
		await router.goTo('/');
	});
})();
