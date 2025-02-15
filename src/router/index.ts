type THttpMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';
type TRouteHandler = () => Response | Promise<Response>;
type TRouterOpts = { tag?: string; };

type TRouterRoot = {
	[key in THttpMethod]?: RouteNode;
};

class RouteNode {
	children: Map<string, RouteNode>;
	handler?: TRouteHandler;
	isDynamic: boolean;

	constructor(isDynamic: boolean, handler?: TRouteHandler) {
		this.children = new Map();
		this.isDynamic = isDynamic;
		this.handler = handler || undefined;
	}
}

export class Router {
	root: TRouterRoot;
	tag?: string;

	constructor(opts?: TRouterOpts) {
		this.root = {};
		if (opts && opts.tag) this.tag = opts.tag;
	}

	async process(req: Request) {
		const url = new URL(req.url);
		const method = req.method as THttpMethod;
		const route = this.findRoute(method, url.pathname);
		if (route?.handler) {

		} else {
			return new Response('Resource not found', {
				status: 404,
				statusText: 'NotFound'
			});
		}
	}


	addRoute(method: THttpMethod, path: string, handler: TRouteHandler): void {
		const parts = path.split('/').filter(Boolean);
		if (!this.root[method]) this.root[method] = new RouteNode(false);
		let node = this.root[method];

		for (const part of parts) {
			let child = node.children.get(part);
			if (child) {
				node = child;
			} else {
				const newNode = new RouteNode(part.includes(':'));
				node.children.set(part, newNode);
				node = newNode;
			}
		}

		console.log('node', node);
		node.handler = handler;
	}

	findRoute(method: THttpMethod, urlPathname: string) {
		const parts = urlPathname.split('/').filter(Boolean);
		if (!this.root[method]) return null;
		let node = this.root[method];
		let child;
		const params: Record<string, string> = {};

		for (const part of parts) {
			if (node.children.has(part)) {
				child = node.children.get(part);
				if (child) node = child;
			} else {
				const iterator = node.children.keys();
				const loops = node.children.size;
				let dynamicModule;

				for (let i = 0; i < loops; i++) {
					let key = iterator.next().value;
					if (key?.startsWith(':')) {
						dynamicModule = key;
						break;
					}
				}

				if (dynamicModule) {
					params[dynamicModule.slice(1)] = part;
					child = node.children.get(dynamicModule);
					if (child) node = child;
				} else {
					return null;
				}
			}
		}

		return node.handler ? { handler: node.handler, params } : null;
	}
}
