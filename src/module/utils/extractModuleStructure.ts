import { type IModule } from "../module";
import { validateStructureName } from "./validateModule";
import { ModuleStructureMap } from "../module.dto";

type TModuleBody = {
	imports: Set<string>;
	controllers: Set<string>;
	providers: Set<string>;
	exports: Set<string>;
};

type TModuleStructure = {
	name: string;
	structure: TModuleBody;
};

type TModuleBodyExtended = TModuleBody & {
	dependencies: string[];
}

type TAppModules = Map<string, TModuleBodyExtended>;

const getAndVerifyModulMetadata = (module: IModule): TModuleStructure => {
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
	}

	for (let i = 0, length = module.controllers.length; i < length; i++) {
		const name = module.controllers[i].name;
		validateStructureName(moduleData.name, name, ModuleStructureMap.controllers);
		moduleData.structure.controllers.add(name);
	}

	for (let i = 0, length = module.providers.length; i < length; i++) {
		const name = module.providers[i].name;
		validateStructureName(moduleData.name, name, ModuleStructureMap.providers);
		moduleData.structure.providers.add(name);
	}

	for (let i = 0, length = module.exports.length; i < length; i++) {
		const name = module.exports[i].name;
		validateStructureName(moduleData.name, name, ModuleStructureMap.exports);
		moduleData.structure.exports.add(name);
	}

	return moduleData;
};

export const orderAppModules = (appModules: TAppModules) => {
	const graph: Map<string, string[]> = new Map();
	const inDegree: Map<string, number> = new Map();
	const result: string[] = [];

	const mapIterator = appModules.entries();
	for (let i = 0; i < appModules.size; i++) {
		const entry = mapIterator.next().value;
		if (!entry) continue;
		const [moduleName, value]: [string, TModuleBodyExtended] = entry;

		inDegree.set(moduleName, 0);

		const depIterator = value.imports.entries();
		for (const entry of depIterator) {
			if (!graph.has(entry[0])) {
				graph.set(entry[0], []);
			}
			graph.get(entry[0])?.push(moduleName);
			inDegree.set(moduleName, (inDegree.get(moduleName) || 0) + 1);
		}
	}

	const queue: string[] = [];
	const inDeegreIterator = inDegree.entries();
	for (let i = 0; i < inDegree.size; i++) {
		const entry = inDeegreIterator.next().value;
		if (!entry) continue;
		const [moduleName, depCount] = entry;
		if (depCount === 0) {
			queue.push(moduleName);
		}
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

	return result;
};

export const extractModuleStructure = (module: IModule) => {
	const appModules: TAppModules = new Map();
	for (const importedModule of module.imports) {
		const moduleMetadata = getAndVerifyModulMetadata(importedModule);
		appModules.set(moduleMetadata.name, {
			...moduleMetadata.structure,
			dependencies: [...moduleMetadata.structure.imports]
		});
	}

	console.log('appModules', appModules);
	const appModulesOrder = orderAppModules(appModules);
	console.log('appModulesOrder', appModulesOrder);
};
