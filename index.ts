Bun.serve({
	port: 3000,
	fetch(req) {
		console.log('req', req);
		return new Response("Bun!");
	}
});

console.log(`App "${Bun.env.APP_NAME}" is listening on port 3000`);
