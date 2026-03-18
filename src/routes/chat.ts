import { getOpenRouterClient } from "../config/openrouter";

type ChatRole = "system" | "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type ChatRequestBody = {
  message?: string;
  model?: string;
  stream?: boolean;
  messages?: ChatMessage[];
};

function badRequest(message: string): Response {
  return Response.json({ error: message }, { status: 400 });
}

export async function handleChat(req: Request): Promise<Response> {
  let body: ChatRequestBody;

  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return badRequest("Invalid JSON body");
  }

  const model = body.model || "openrouter/free";
  const stream = body.stream === true;

  const messages: ChatMessage[] =
    Array.isArray(body.messages) && body.messages.length > 0
      ? body.messages
      : body.message
        ? [{ role: "user", content: body.message }]
        : [];

  if (messages.length === 0) {
    return badRequest("Provide 'message' or a non-empty 'messages' array");
  }

  try {
    const openrouter = getOpenRouterClient();

    if (stream) {
      const result = await openrouter.chat.send({
        chatGenerationParams: {
          model,
          messages,
          stream: true,
        },
      });

      let reply = "";
      let usage: unknown = null;

      for await (const chunk of result as AsyncIterable<any>) {
        const content = chunk.choices?.[0]?.delta?.content;
        if (typeof content === "string") {
          reply += content;
        }

        if (chunk.usage) {
          usage = chunk.usage;
        }
      }

      return Response.json({
        model,
        reply,
        usage,
      });
    }

    const completion: any = await openrouter.chat.send({
      chatGenerationParams: {
        model,
        messages,
      },
    });

    const reply = completion.choices?.[0]?.message?.content ?? "";

    return Response.json({
      model,
      reply,
      usage: completion.usage ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { error: "OpenRouter request failed", details: message },
      { status: 502 },
    );
  }
}
