import { createModuleMemberName } from "./utils/createClassName";

interface IProvider {
	forwardRef: boolean;
}

export function Provider() {
	return function <T extends new (...args: any[]) => {}>(BaseClass: T) {
		class ProviderClass extends BaseClass implements IProvider {
			forwardRef: boolean;

			constructor(...args: any[]) {
				super(...args);
				this.forwardRef = false;
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

class TestInjectedProvider {
	getRandom(): number {
		return Math.ceil(Math.random() * 100);
	}
}

@Provider()
export class TestProvider {
	constructor(
		injected: TestInjectedProvider
	) {}

	addRandom(num: number): number {
		return num + 5;
		// return num + this.injected.getRandom();
	}
}
