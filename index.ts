import { handleChat } from "./src/routes/chat";

const server = Bun.serve({
	port: Number(process.env.PORT) || 3000,
	async fetch(req) {
		const url = new URL(req.url);
		const pathname = url.pathname;

		if (pathname === "/" && req.method === "GET") {
			return new Response(Bun.file("public/index.html"), {
				headers: { "Content-Type": "text/html; charset=utf-8" },
			});
		}

		if (pathname === "/styles.css" && req.method === "GET") {
			return new Response(Bun.file("public/styles.css"), {
				headers: { "Content-Type": "text/css; charset=utf-8" },
			});
		}

		if (pathname === "/app.js" && req.method === "GET") {
			return new Response(Bun.file("public/app.js"), {
				headers: { "Content-Type": "application/javascript; charset=utf-8" },
			});
		}

		if (pathname === "/health" && req.method === "GET") {
			return Response.json({ status: "ok" });
		}

		if (pathname === "/chat" && req.method === "POST") {
			return handleChat(req);
		}

		return new Response("Not Found", { status: 404 });
	},
});

console.log(`API listening on http://localhost:${server.port}`);