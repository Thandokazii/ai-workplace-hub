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
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: MODEL,
      input: messages.map((m) => ({ role: m.role, content: m.content })),
      stream: true,
      store: false,
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
    throw new AiError(res.status, message);
  }

  if (!res.body) throw new AiError(502, "The AI returned no response. Please try again.");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";
  let completed = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      let evt: any;
      try {
        evt = JSON.parse(payload);
      } catch {
        continue;
      }
      if (evt?.type === "response.output_text.delta" && typeof evt.delta === "string") {
        text += evt.delta;
      } else if (evt?.type === "response.completed") {
        completed = extractText(evt.response) || completed;
      } else if (evt?.type === "error" || evt?.type === "response.failed") {
        throw new AiError(502, evt?.error?.message ?? "The AI request failed. Please try again.");
      }
    }
  }

  const final = (text.trim() || completed.trim());
  if (!final) throw new AiError(502, "The AI returned an empty response. Please try again.");
  return final;
}

