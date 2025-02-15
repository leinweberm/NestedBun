// @ts-nocheck
import { expect, test } from 'bun:test';
import { Router } from '../src/router';

let router = null;

const route1ReturnValue = 'get-test-route1';
const route1 = {
	method: 'GET',
	path: '/test',
	returnValue: route1ReturnValue,
	handler() { return route1ReturnValue; }
};

const route2ReturnValue = 'get-test-route2';
const route2 = {
	method: 'GET',
	path: '/test/:name',
	returnValue: route2ReturnValue,
	handler() { return route2ReturnValue; }
};

const route3ReturnValue = 'post-test-route3';
const route3 = {
	method: 'POST',
	path: '/test',
	returnValue: route3ReturnValue,
	handler() { return route3ReturnValue; }
};

const route4ReturnValue = 'get-test-route4';
const route4 = {
	method: 'GET',
	path: '/zkouska',
	returnValue: route4ReturnValue,
	handler() { return route4ReturnValue; }
};

test('create single router without tag', () => {
	router = new Router();
	expect(router).toBeInstanceOf(Router);
});

test('add routes', () => {
	router.addRoute(route1.method, route1.path, route1.handler);
	router.addRoute(route2.method, route2.path, route2.handler);
	router.addRoute(route3.method, route3.path, route3.handler);
	router.addRoute(route4.method, route4.path, route4.handler);
});

test('find routes', () => {
	// ROUTE 1
	let route = router.findRoute(route1.method, route1.path);
	expect(route).not.toBeNull();
	expect(route.handler).toBeDefined();
	expect(route.params).toBeDefined();
	let routeResponse = route.handler();
	expect(routeResponse).toBe(route1.returnValue);

	// ROUTE 2
	route = router.findRoute(route2.method, '/test/leinweber');
	expect(route).not.toBeNull();
	expect(route.handler).toBeDefined();
	expect(route.params).toBeDefined();
	routeResponse = route.handler();
	expect(routeResponse).toBe(route2.returnValue);
	expect(route.params.name).toBe('leinweber');

	// ROUTE 3
	route = router.findRoute(route3.method, route3.path);
	expect(route).not.toBeNull();
	expect(route.handler).toBeDefined();
	expect(route.params).toBeDefined();
	routeResponse = route.handler();
	expect(routeResponse).toBe(route3.returnValue);

	// ROUTE 4
	route = router.findRoute(route4.method, route4.path);
	expect(route).not.toBeNull();
	expect(route.handler).toBeDefined();
	expect(route.params).toBeDefined();
	routeResponse = route.handler();
	expect(routeResponse).toBe(route4.returnValue);

	// NON-EXISTING ROUTE
	route = router.findRoute('GET', '/test/name/address');
	expect(route).toBeNull();
});
