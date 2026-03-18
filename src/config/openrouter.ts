import { OpenRouter } from "@openrouter/sdk";

export function getOpenRouterClient(): OpenRouter {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("Missing OPENROUTER_API_KEY environment variable");
  }

  return new OpenRouter({ apiKey });
}
