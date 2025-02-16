export enum ModuleClassNames {
	MODULE = "ModuleClass",
	APP_MODULE = "AppModuleClass",
	PROVIDER = 'ProviderClass',
	CONTROLLER = 'ControllerClass'
};

export enum ModuleStructureGroups {
	APP_IMPORTS = 'appImports',
	IMPORTS = 'imports',
	CONTROLLERS = 'controllers',
	PROVIDERS = 'providers',
	EXPORTS = 'exports'
}

export const ModuleStructureMap: Record<ModuleStructureGroups, ModuleClassNames> = {
	[ModuleStructureGroups.APP_IMPORTS]: ModuleClassNames.APP_MODULE,
	[ModuleStructureGroups.IMPORTS]: ModuleClassNames.MODULE,
	[ModuleStructureGroups.CONTROLLERS]: ModuleClassNames.CONTROLLER,
	[ModuleStructureGroups.PROVIDERS]: ModuleClassNames.PROVIDER,
	[ModuleStructureGroups.EXPORTS]: ModuleClassNames.PROVIDER,
};
