import { ModuleStructureMap } from "../module.dto";

export const validateStructureName = (
	moduleName: string,
	structName: string,
	structGroup: (typeof ModuleStructureMap)[keyof typeof ModuleStructureMap]
) => {
	if (!structName.startsWith(structGroup)) {
		const struct = (structName.includes('_'))
			? structName.split('_')[1]
			: structName;
		const module = (moduleName.includes('_'))
			? moduleName.split('_')[1]
			: moduleName;
		throw new Error(
			`FactoryError: invalid ${structGroup} "${struct}" in module ${module}`
		);
	}
}
