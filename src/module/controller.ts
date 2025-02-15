import type { THttpMethod } from "../router";
import { validateUrlString } from "../validators/string";

function createRouteDecorator(method: THttpMethod, path: string) {
	return (controller: any, controllerMethod: any) => {
		controller[controllerMethod].routePath = path;
		controller[controllerMethod].routeMethod = method;
		return controller;
	};
}

export function Get(path: string) {
	return createRouteDecorator('GET', path);
}

export interface IController {
	url: string;
}

type TProcessedController = {
	url: string;
	method: THttpMethod;
	handler: Function;
	middlewares: any[];
};

export function Controller(url: string) {
	return function <T extends new (...args: any[]) => {}>(BaseClass: T) {
		class Extended extends BaseClass implements IController {
			url: string;

			constructor(...args: any[]) {
				super(...args);
				this.url = url;
			}
		}

		const methods = Object.getOwnPropertyNames(BaseClass.prototype);
		for (let i = 0, length = methods.length; i < length; i++) {
			Object.defineProperty(
				Extended.prototype,
				methods[i],
				Object.getOwnPropertyDescriptor(BaseClass.prototype, methods[i])!
			);
		}

		return Extended;
	}
}

export function processController(controller: any): TProcessedController[] {
	const controllerInstance = new controller();
	const controllerPrototype = Object.getPrototypeOf(controllerInstance);
	const methodNames = Object.getOwnPropertyNames(controllerPrototype);
	const routes: TProcessedController[] = [];

	for (let i = 0, length = methodNames.length; i < length; i++) {
		const methodName = methodNames[i];
		if (
			typeof controllerPrototype[methodName] === 'function' &&
			methodName !== 'constructor'
		) {
			validateUrlString(controllerInstance.url);
			validateUrlString(controllerPrototype[methodName].routePath);
			routes.push({
				url: `${controllerInstance.url}${controllerInstance[methodName].routePath}`,
				method: controllerInstance[methodName].routeMethod,
				handler: controllerInstance[methodName],
				middlewares: [],
			});
		}
	}

	return routes;
}
