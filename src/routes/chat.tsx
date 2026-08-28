import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { SendHorizonal, RotateCcw, Bot, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { chatReply } from "@/lib/ai.functions";
import { PageHeader, Disclaimer } from "@/components/PageHeader";
import { ErrorNote } from "@/components/AiOutput";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chat — Workplace AI" },
      {
        name: "description",
        content:
          "Chat with a workplace AI assistant for brainstorming, writing help, summaries, planning, explanations and recommendations.",
      },
      { property: "og:title", content: "AI Workplace Chat — Workplace AI" },
      {
        property: "og:description",
        content:
          "A conversational assistant for brainstorming, planning, writing and explanations at work.",
      },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Help me brainstorm agenda items for a quarterly planning session.",
  "Rewrite this update so it sounds more confident and concise.",
  "Explain OKRs to a new team member in plain language.",
  "Draft a 30-day plan for onboarding a new support hire.",
];

function ChatPage() {
  const run = useServerFn(chatReply);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setError("");
    setBusy(true);
    try {
      const res = await run({ data: { messages: next.slice(-24) } });
      setMessages((m) => [...m, { role: "assistant", content: res.text }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The assistant couldn't respond. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="AI Chat"
        title="AI Workplace Chatbot"
        description="Ask follow-ups, iterate on ideas and keep context through the conversation. History stays in this browser session only."
      />

      <div className="flex h-[68vh] min-h-[480px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Bot className="size-4" aria-hidden="true" />
            Assistant
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={busy || messages.length === 0}
            onClick={() => {
              setMessages([]);
              setError("");
            }}
          >
            <RotateCcw className="size-4" />
            Clear chat
          </Button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6" aria-live="polite">
          {messages.length === 0 ? (
            <div className="mx-auto max-w-lg py-6 text-center">
              <p className="text-sm text-muted-foreground">
                Start with a task — or try one of these:
              </p>
              <div className="mt-4 grid gap-2 text-left">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void send(s)}
                    className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" ? (
                <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-surface">
                  <Bot className="size-3.5" aria-hidden="true" />
                </span>
              ) : null}
              <div
                className={
                  m.role === "user"
                    ? "max-w-[80%] rounded-xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground"
                    : "prose-ai max-w-[85%] rounded-xl rounded-tl-sm border border-border bg-surface px-4 py-3 text-sm"
                }
              >
                {m.role === "user" ? (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                ) : (
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                )}
              </div>
              {m.role === "user" ? (
                <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-surface">
                  <User className="size-3.5" aria-hidden="true" />
                </span>
              ) : null}
            </div>
          ))}

          {busy ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-1.5 animate-bounce rounded-full bg-muted-foreground"
                    style={{ animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </span>
              Assistant is thinking…
            </div>
          ) : null}

          {error ? <ErrorNote message={error} /> : null}
          <div ref={endRef} />
        </div>

        <form
          className="border-t border-border p-3 sm:p-4"
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
        >
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
              aria-label="Message the assistant"
              placeholder="Ask anything about your work…"
              className="max-h-40 min-h-[52px] resize-none bg-surface"
            />
            <Button type="submit" size="icon" className="size-[52px]" disabled={busy || !input.trim()} aria-label="Send message">
              <SendHorizonal className="size-4" />
            </Button>
          </div>
          <Disclaimer className="mt-3" />
        </form>
      </div>
    </div>
  );
}
