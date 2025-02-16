import { ModuleClassNames } from "../module.dto"

export const createModuleMemberName = (NewClass: any, BaseClass: any): void => {
	if (
		NewClass.name !== ModuleClassNames.CONTROLLER &&
		NewClass.name !== ModuleClassNames.PROVIDER &&
		NewClass.name !== ModuleClassNames.MODULE
	) {
		throw new Error('Invalid class name provided');
	}

	Object.defineProperty(
		NewClass,
		'name',
		{ value: `${NewClass.name}_${BaseClass.name}` }
	);
}
