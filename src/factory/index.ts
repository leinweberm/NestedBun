import { ModuleClassNames } from "../module/module.dto";
import { extractModuleStructure } from "../module/utils/extractModuleStructure";

export const createApp = (AppModuleClass: any) => {
	if (AppModuleClass.constructor.name !== ModuleClassNames.APP_MODULE) {
		throw new Error('FactoryError: invalid app module provided');
	}
	
	extractModuleStructure(AppModuleClass);
}
