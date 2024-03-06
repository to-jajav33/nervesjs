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
		this.lock = lock(`routerGoTo:${this.routerId}`);
		
		if (location.hash !== `#${routePath}`) {
			location.hash = routePath;
		} else {
			this._handleHashChange({
				newURL: routePath,
				oldURL: routePath,
			});
		}
		await this.lock;
	}

	findRouteInfo(newURL) {
		const splitNewPath = newURL.split("/");

		for (let defRoute in this.routes) {
			let splitDefRoute = defRoute.split('/');

			let i = 0;
			let found = false;
			for (let key of splitDefRoute) {
				found = (splitNewPath[i] == key || key.startsWith(':'));

				if (!found) break;
			}

			if (found) return this.routes[defRoute];
		}
	}

	async _handleHashChange(ev) {
		const { newURL, oldURL } = ev;

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
	}
}

NervioRouter.define();