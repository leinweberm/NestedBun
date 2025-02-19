import { type IModule } from "../module";
import { validateStructureName } from "./validateModule";
import { ModuleStructureMap } from "../module.dto";
import { orderProviders } from "../../factory/hierarchyOrder";
import type { IProvider } from "../provider";

export type TModuleBody = {
	imports: Set<string>;
	controllers: Set<string>;
	providers: Set<string>;
	exports: Set<string>;
};

export type TClassesList = Map<string, IProvider>;

type TModuleStructure = {
	name: string;
	structure: TModuleBody;
};

export type TAppModules = Map<string, TModuleBody>;

const getAndVerifyModulMetadata = (module: IModule, classes: TClassesList): TModuleStructure => {
	const moduleData: TModuleStructure = {
		name: module.constructor.name,
		structure: {
			imports: new Set(),
			controllers: new Set(),
			providers: new Set(),
			exports: new Set(),

		}
	};

	validateStructureName(
		`${ModuleStructureMap.appImports}_AppModule`,
		moduleData.name,
		ModuleStructureMap.imports
	);

	for (let i = 0, length = module.imports.length; i < length; i++) {
		const name = module.imports[i].name;
		validateStructureName(moduleData.name, name, ModuleStructureMap.imports);
		moduleData.structure.imports.add(name);
		(!classes.has(name)) && classes.set(name, module.imports[i]);
	}

	for (let i = 0, length = module.controllers.length; i < length; i++) {
		const name = module.controllers[i].name;
		validateStructureName(moduleData.name, name, ModuleStructureMap.controllers);
		moduleData.structure.controllers.add(name);
		(!classes.has(name)) && classes.set(name, module.controllers[i]);
	}

	for (let i = 0, length = module.providers.length; i < length; i++) {
		const name = module.providers[i].name;
		validateStructureName(moduleData.name, name, ModuleStructureMap.providers);
		moduleData.structure.providers.add(name);
		(!classes.has(name)) && classes.set(name, module.providers[i]);
	}

	for (let i = 0, length = module.exports.length; i < length; i++) {
		const name = module.exports[i].name;
		validateStructureName(moduleData.name, name, ModuleStructureMap.exports);
		moduleData.structure.exports.add(name);
		(!classes.has(name)) && classes.set(name, module.exports[i]);
	}

	return moduleData;
};

export const orderModules = (appModules: TAppModules): TAppModules => {
	const graph: Map<string, string[]> = new Map();
	const inDegree: Map<string, number> = new Map();
	const result: string[] = [];

	for (const [moduleName, value] of appModules.entries()) {
		inDegree.set(moduleName, 0);

		const depIterator = value.imports.entries();
		for (const entry of depIterator) {
			if (!graph.has(entry[0])) graph.set(entry[0], []);
			graph.get(entry[0])?.push(moduleName);
			inDegree.set(moduleName, (inDegree.get(moduleName) || 0) + 1);
		}
	}

	const queue: string[] = [];
	for (const [moduleName, depCount] of inDegree.entries()) {
		if (depCount === 0) queue.push(moduleName);
	}

	while (queue.length > 0) {
		const node = queue.shift()!;
		result.push(node);

		const neighbors = graph.get(node) || [];
		for (let i = 0, length = neighbors.length; i < length; i++) {
			const neighbor = neighbors[i];
			inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
			if (inDegree.get(neighbor) === 0) {
				queue.push(neighbor);
			}
		}
	}

	if (result.length !== appModules.size) {
		throw new Error('FactoryError: Circular modules dependency detected');
	}

	const orderedAppModules: TAppModules = new Map();

	for (let i = 0, length = result.length; i < length; i++) {
		const module = appModules.get(result[i]);
		if (module) {
			orderedAppModules.set(result[i], module);
		} else {
			throw new Error(`FactoryError: unable to sort app modules, invalid module ${result[i]}`);
		}
	}

	return orderedAppModules;
};

export const extractModuleStructure = (module: IModule) => {
	const unorderedAppModules: TAppModules = new Map();
	const appClasses: TClassesList = new Map();

	for (const importedModule of module.imports) {
		const moduleMetadata = getAndVerifyModulMetadata(importedModule, appClasses);
		unorderedAppModules.set(moduleMetadata.name, { ...moduleMetadata.structure });
	}

	const appModules = orderModules(unorderedAppModules);
	console.log('appModules', appModules);
	console.log('appClasses', appClasses);
	orderProviders(appModules, appClasses);
};
