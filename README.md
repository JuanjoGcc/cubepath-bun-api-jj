# cubepath-bun-api-jj

To install dependencies:

```bash
bun install
```

To run in development mode:

```bash
bun run dev
```

Environment setup:

```bash
cp .env.example .env
```

Then edit .env and set OPENROUTER_API_KEY.

To run once:

```bash
bun run start
```

Landing page:

Open http://localhost:3000/ in your browser to test /health and /chat.

Healthcheck endpoint:

```bash
curl http://localhost:3000/health
```

Response:

```json
{"status":"ok"}
```

Chat endpoint:

POST http://localhost:3000/chat

Example request:

{
	"message": "How many r's are in the word strawberry?"
}

Example request with explicit model and stream aggregation:

{
	"model": "openrouter/free",
	"stream": true,
	"messages": [
		{ "role": "user", "content": "How many r's are in the word strawberry?" }
	]
}

This project was created using `bun init` in bun v1.3.11. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
