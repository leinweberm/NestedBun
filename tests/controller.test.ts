import { test, expect } from 'bun:test';
import { Controller, Get, processController } from '../src/module/controller';

test('controller - create', () => {
	@Controller('/users')
	class TestController {
		constructor() { }

		@Get('/:id/info')
		getData(): string {
			return 'getDataResult';
		}
	}

	const routes = processController(TestController);

	expect(routes.length).toBe(1);
	expect(routes[0].url).toBe('/users/:id/info');
	expect(routes[0].method).toBe('GET');
	expect(Array.isArray(routes[0].middlewares)).toBe(true);
	expect(routes[0].middlewares.length).toBe(0);
	expect(routes[0].handler.name).toBe('getData');
	expect(routes[0].handler()).toBe('getDataResult');
});
