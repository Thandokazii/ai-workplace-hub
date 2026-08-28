const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/responses";
const MODEL = "openai/gpt-5.6-sol";

export type AiMessage = { role: "system" | "user" | "assistant"; content: string };

export class AiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function extractText(payload: unknown): string {
  const data = payload as any;
  const direct = data?.output_text;
  if (typeof direct === "string" && direct.trim()) {
    return direct;
  }
  const chunks: string[] = [];
  for (const item of data?.output ?? []) {
    for (const part of item?.content ?? []) {
      if (typeof part?.text === "string") chunks.push(part.text);
    }
  }
  return chunks.join("\n").trim();
}

export async function callAi(messages: AiMessage[]): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new AiError(500, "AI is not configured for this app.");

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
    },
    body: JSON.stringify({
      model: MODEL,
      input: messages.map((m) => ({ role: m.role, content: m.content })),
      reasoning: { effort: "low" },
    }),
  });

  if (!res.ok) {
    let message = `AI request failed (${res.status}).`;
    try {
      const err = (await res.json()) as any;
      if (err?.error?.message) message = err.error.message;
      else if (err?.message) message = err.message;
    } catch {
      /* keep default */
    }
    if (res.status === 429) message = "Too many requests right now. Please retry in a moment.";
    if (res.status === 402) message = message || "AI credits are exhausted for this workspace.";
    throw new AiError(res.status, message);
  }

  const text = extractText(await res.json());
  if (!text) throw new AiError(502, "The AI returned an empty response. Please try again.");
  return text;
}
