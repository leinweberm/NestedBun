import { type IModule } from "../module/module";
import { ModuleClassNames } from "../module/module.dto";
import { extractModuleStructure } from "../module/utils/extractModuleStructure";

export const createApp = (AppModuleClass: any) => {
	const providersName: Set<string> = new Set();
	const providerContructors: any[] = [];

	if (AppModuleClass.name !== ModuleClassNames.APP_MODULE) {
		throw new Error('FactoryError: invalid app module provided');
	}

	const appInstance = new AppModuleClass();
	extractModuleStructure(appInstance as IModule);

	// for (let i = 0, length = appInstance.imports.length; i < length; i++) {
	// 	const module = appInstance.imports[0];
	// 	extractModuleStructure(module as IModule);
	// }
}
