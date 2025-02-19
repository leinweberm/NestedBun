import { test, expect } from 'bun:test';
import { Module, AppModule } from '../src/module/module';
import { Controller } from '../src/module/controller';
import { Provided, Provider } from '../src/module/provider';
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
		addFive(input: number): number {
			return input + 5;
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
	class ProviderB1 {
		constructor() {}

		minusFive(input: number) {
			return input - 5;
		}
	}

	@Provider()
	class ProviderB2 {
		constructor(
			@Provided('ProviderB1') private readonly providerB1: ProviderB1,
			@Provided('ProviderA') private readonly providerA: ProviderA
		) { }
		addNumber(input: number): number {
			return this.providerA.addRandom(input);
		}

		substractNumber() {
			return this.providerB1.minusFive(15);
		}
	}

	@Controller('/organizations')
	class ControllerB {
		constructor(
			@Provided('ProviderA') private readonly providerA: ProviderA,
			@Provided('ProviderB1') private readonly providerB1: ProviderB1,
			@Provided('ProviderB2') private readonly providerB2: ProviderB2
		) { }
		add() {
			return this.providerB2.addNumber(5);
		}

		substract() {
			return this.providerB1.minusFive(15);
		}

		testProviderA() {
			return this.providerA.addRandom(5);
		}
	}

	@Module({
		imports: [ModuleA],
		controllers: [ControllerB],
		providers: [ProviderB2, ProviderB1],
		exports: [ProviderB2]

	})
	class ModuleB { }

	@AppModule({
		imports: [new ModuleB(), new ModuleA()]
	})
	class App { }

	createApp(new App());
});
