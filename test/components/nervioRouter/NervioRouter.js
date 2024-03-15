import { lock } from "../../../src/Utils.js";
import { NervioComponent } from "../../NervioComponent.js";

export class NervioRouter extends NervioComponent {
	constructor() {
		super();

		this.routerId = crypto.randomUUID();
		this._routes = {};
		this._handleHashChange = this._handleHashChange.bind(this);
		window.addEventListener('hashchange', this._handleHashChange)
	}

	get routes() {
		return this._routes;
	}
	set routes(val) {
		this._routes = val;
	}

	async goTo(routePath) {
		if (location.hash !== `#${routePath}`) {
			location.hash = routePath;
		} else {
			this._handleHashChange({
				newURL: routePath,
				oldURL: routePath,
			});
		}
	}

	findRouteInfo(newURL) {
		const splitNewPath = newURL.split("/");

		for (let defRoute in this.routes) {
			let splitDefRoute = defRoute.split('/');

			let found = false;
			for (let i in splitDefRoute) {
				const key = splitDefRoute[i];
				found = (splitNewPath[i] === key || key.startsWith(':'));

				if (!found) break;
			}

			if (found) return this.routes[defRoute];
		}
	}

	async _handleHashChange(ev) {
		this.lock = lock(`routerGoTo:${this.routerId}`);
		let { newURL, oldURL } = ev;
		newURL = (newURL.includes('#')) ? newURL.split('#')[1] || '/' : newURL;


		const routeInfo = this.findRouteInfo(newURL);

		const pageController = this;

		for (const child of pageController.children) {
			child.remove();
		}

		const pageContent = new routeInfo.component();
		pageContent.addEventListener('connected', this.lock.unlock.bind(this.lock), {
			once: true
		});
		pageController.appendChild(pageContent);

		await this.lock;
	}
}

NervioRouter.define();