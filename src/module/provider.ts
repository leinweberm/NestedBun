import { createModuleMemberName } from "./utils/createClassName";
import { ModuleClassNames } from "./module.dto";

export interface IProvider {
	injected?: Set<string>;
}

export function Provided(ProviderClassName: string) {
	return function (target: any, _property: undefined, _propertyIndex: number) {
		if (!target.injectedProviders) {
			Object.defineProperty(
				target,
				'injected',
				{
					value: new Set(),
					writable: true,
					enumerable: true,
					configurable: true
				}
			);
		}

		target.injected.add(`${ModuleClassNames.PROVIDER}_${ProviderClassName}`);
	}
}

export function Provider() {
	return function <T extends new (...args: any[]) => {}>(BaseClass: T) {
		class ProviderClass extends BaseClass implements IProvider {

			constructor(...args: any[]) {
				super(...args);
			}
		}

		const methods = Object.getOwnPropertyNames(BaseClass.prototype);
		for (let i = 0, length = methods.length; i < length; i++) {
			Object.defineProperty(
				ProviderClass.prototype,
				methods[i],
				Object.getOwnPropertyDescriptor(BaseClass.prototype, methods[i])!
			);
		}

		createModuleMemberName(ProviderClass, BaseClass);

		return ProviderClass;
	}
}
