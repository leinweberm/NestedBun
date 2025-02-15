export type ModuleOpts = {
	controllers?: any[];
	providers?: any[];
	imports?: IModule[];
	exports?: any[];
};

export interface IModule {
	controllers: any[];
	providers: any[];
	imports: IModule[];
	exports: any[]
}

export function Module(opts: ModuleOpts) {
	return function <T extends new (...args: any[]) => {}>(BaseClass: T) {
		return class extends BaseClass implements IModule {
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
	};
}

export function AppModule(opts: ModuleOpts) {
	return function <T extends new (...args: any[]) => {}>(BaseClass: T) {
		return class extends BaseClass implements IModule {
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
	};
}
