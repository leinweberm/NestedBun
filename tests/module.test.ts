// @ts-nocheck
import { expect, test } from 'bun:test';
import { AppModule, Module, type IModule } from '../src/module/module';

test('module - create', () => {
	const providers = ['provider1', 'provider2'];
	const controllers = ['controller1'];
	const exports = ['export1', 'export2'];

	@Module({ providers, controllers, imports: [], exports })
	class TestModule { }

	const myTestModule = new TestModule() as IModule;

	expect(myTestModule.providers).toEqual(providers);
	expect(myTestModule.controllers).toEqual(controllers);
	expect(myTestModule.imports).toEqual([]);
	expect(myTestModule.exports).toEqual(exports);
});
