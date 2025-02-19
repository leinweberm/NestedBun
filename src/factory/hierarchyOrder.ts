import type { TAppModules, TClassesList } from "../module/utils/extractModuleStructure";

export const orderProviders = (modules: TAppModules, classes: TClassesList): TAppModules => {
	const newModules: TAppModules = new Map(modules);

	for (const [moduleName, moduleData] of newModules.entries()) {
		const graph: Map<string, Set<string>> = new Map();
		const visited: Map<string, boolean | 'visiting'> = new Map();
		const sorted: string[] = [];

		const depthFirstSearch = (providerName: string) => {
			const visition = visited.get(providerName);

			if (visition === 'visiting') {
				throw new Error(`FactoryError: cyclic providers in ${moduleName}`);
			} else if (visition) {
				return;
			} else {
				visited.set(providerName, 'visiting');
			}

			for (const dep of graph.get(providerName)!) {
				if (!graph.has(dep)) {
					throw new Error(`FactoryError: unknown provider ${dep}`);
				}
				depthFirstSearch(dep);
			}

			visited.set(providerName, true);
			sorted.push(providerName);
		};

		for (const name of moduleData.providers.entries()) {
			const provider = classes.get(name[0]);
			if (!provider) throw new Error(`FactoryError: no provider ${name[0]}`);
			graph.set(name[0], provider?.injected || new Set());
			visited.set(name[0], false);
		}

		for (const name of moduleData.providers.entries()) {
			if (!visited.get(name[0])) depthFirstSearch(name[0]);
		}

		const newProviders: Set<string> = new Set();
		for (const provider of sorted) {
			newProviders.add(provider);
		}

		moduleData.providers = newProviders;
	}

	return newModules;
};
