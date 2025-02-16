import { test, expect } from 'bun:test';
import { type IModule, Module, AppModule } from '../src/module/module';
import { Controller } from '../src/module/controller';
import { Provider } from '../src/module/provider';
import { createApp } from '../src/factory';

test.only('factory - create', () => {
	@Provider()
	class ProviderA {
		constructor() { }
		addRandom(num: number): number {
			return num + 5;
		}
	}

	@Controller('/users')
	class ControllerA {
		constructor() { }
		getData(): string {
			return 'getDataTest';
		}
	}

	@Module({
		imports: [],
		controllers: [ControllerA],
		providers: [ProviderA],
		exports: [ProviderA]
	})
	class ModuleA { }

	@Provider()
	class ProviderB {
		constructor() { }
		addOrganization(): true {
			return true;
		}
	}

	@Controller('/organizations')
	class ControllerB {
		constructor() { }
		add() {
			return true;
		}
	}

	@Module({
		imports: [ModuleA],
		controllers: [ControllerB],
		providers: [ProviderB],
		exports: [ProviderB]

	})
	class ModuleB { }

	@AppModule({
		imports: [new ModuleB(), new ModuleA()]
	})
	class App { }

	createApp(App);
});
