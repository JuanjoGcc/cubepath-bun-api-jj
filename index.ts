const server = Bun.serve({
	port: Number(process.env.PORT) || 3000,
	fetch(req) {
		const url = new URL(req.url);

		if (url.pathname === "/health") {
			return Response.json({ status: "ok" });
		}

		return new Response("Not Found", { status: 404 });
	},
});

console.log(`API listening on http://localhost:${server.port}`);