import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Wand2 } from "lucide-react";
import { useRef, useState } from "react";
import { generateEmail } from "@/lib/ai.functions";
import { PageHeader, Disclaimer } from "@/components/PageHeader";
import { AiOutput, ErrorNote, LoadingLines } from "@/components/AiOutput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI" },
      {
        name: "description",
        content:
          "Generate complete, context-aware professional emails from a single description.",
      },
      { property: "og:title", content: "Smart Email Generator — Workplace AI" },
      {
        property: "og:description",
        content:
          "Generate complete, context-aware professional emails from a single description.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const attempt = useRef(0);

  const generate = async (regenerate = false) => {
    if (!prompt.trim()) {
      setError("Describe the email you need so the assistant can write it.");
      return;
    }
    setBusy(true);
    setError("");
    attempt.current = regenerate ? attempt.current + 1 : 0;
    try {
      const res = await run({
        data: {
          prompt,
          variation: attempt.current,
        },
      });
      setResult(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong generating the email.");
    } finally {
      setBusy(false);
    }
  };

  const clearAll = () => {
    setResult("");
    setError("");
    attempt.current = 0;
  };

  return (
    <div>
      <PageHeader
        eyebrow="Email Generator"
        title="Smart Email Generator"
        description="Describe the email you need in plain language. The assistant writes a complete, natural draft you can edit before sending."
      />

      <form
        className="rounded-xl border border-border bg-card p-5 shadow-card sm:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          void generate(false);
        }}
      >
        <div>
          <Label htmlFor="email-prompt">What email do you need?</Label>
          <Textarea
            id="email-prompt"
            required
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Write a formal apology to our client Acme Corp because a delivery slipped by a week. Explain the supplier delay, propose a new delivery date of 14 March, mention a 5% discount, and suggest a review call on Friday."
            className="mt-2 min-h-[180px] resize-y bg-surface"
            aria-describedby="email-prompt-help"
          />
          <p id="email-prompt-help" className="mt-2 text-sm text-muted-foreground">
            Include the recipient, purpose, tone, and any key details you want mentioned.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={busy}>
            <Wand2 className="size-4" aria-hidden="true" />
            {busy ? "Generating…" : "Generate email"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled={busy}
            onClick={() => {
              setPrompt("");
              clearAll();
            }}
          >
            Clear
          </Button>
          <Disclaimer className="basis-full sm:basis-auto" />
        </div>
      </form>

      <div className="mt-6 space-y-4">
        {error ? <ErrorNote message={error} /> : null}
        {busy && !result ? <LoadingLines label="Writing your email…" /> : null}
        {result ? (
          <AiOutput
            title="Generated email"
            value={result}
            onChange={setResult}
            busy={busy}
            onRegenerate={() => void generate(true)}
            onClear={clearAll}
          />
        ) : null}
      </div>
    </div>
  );
}
