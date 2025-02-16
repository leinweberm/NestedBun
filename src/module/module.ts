import { createModuleMemberName } from "./utils/createClassName";

export type TModule = {
	imports: any[];
	controllers: any[];
	providers: any[];
	exports: any[];
}
export interface IModule extends TModule {
	imports: any[];
}
export type TModuleOpts = Partial<TModule>;
export type TAppModuleOpts = Pick<IModule, 'imports'>;
export interface IAppModule extends TAppModuleOpts {}

export function Module(opts: TModuleOpts) {
	return function <T extends new (...args: any[]) => {}>(BaseClass: T) {
		class ModuleClass extends BaseClass implements IModule {
			controllers: any[];
			providers: any[];
			imports: IModule[];
			exports: any[];

			constructor(...args: any[]) {
				super(...args);
				this.controllers = opts.controllers || [];
				this.providers = opts.providers || [];
				this.imports = opts.imports || [];
				this.exports = opts.exports || [];
			}
		};

		createModuleMemberName(ModuleClass, BaseClass);

		return ModuleClass;
	};
}

export function AppModule(opts: TAppModuleOpts) {
	return function <T extends new (...args: any[]) => {}>(BaseClass: T) {
		class AppModuleClass extends BaseClass implements IAppModule {
			imports: IModule[];

			constructor(...args: any[]) {
				super(...args);
				this.imports = opts.imports || [];
			}
		};

		return AppModuleClass;
	};
}
