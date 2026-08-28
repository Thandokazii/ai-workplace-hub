import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { researchSummarize } from "@/lib/ai.functions";
import { PageHeader, Disclaimer } from "@/components/PageHeader";
import { AiOutput, ErrorNote, LoadingLines } from "@/components/AiOutput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workplace AI" },
      {
        name: "description",
        content:
          "Paste a topic, question, article or report and get an AI overview, key points, insights, recommendations and a plain-language explanation.",
      },
      { property: "og:title", content: "AI Research Assistant — Workplace AI" },
      {
        property: "og:description",
        content:
          "Turn any topic, article or report into a scannable brief with insights and recommendations.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const run = useServerFn(researchSummarize);
  const [content, setContent] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const attempt = useRef(0);

  const generate = async (regenerate = false) => {
    if (!content.trim()) {
      setError("Add a topic, question, article or report to analyse.");
      return;
    }
    setBusy(true);
    setError("");
    attempt.current = regenerate ? attempt.current + 1 : 0;
    try {
      const res = await run({ data: { content, variation: attempt.current } });
      setResult(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong generating the summary.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Research Assistant"
        title="AI Research Assistant"
        description="Drop in a topic, question, article or report. You get an overview, key points, insights, recommendations and a simple explanation — all generated from what you provide."
      />

      <form
        className="rounded-xl border border-border bg-card p-5 shadow-card sm:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          void generate(false);
        }}
      >
        <Label htmlFor="content">Topic, question, article or report</Label>
        <Textarea
          id="content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste text, or ask something like: What should our team consider before moving support to a 4-day week?"
          className="mt-2 min-h-48 bg-surface"
        />
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={busy}>
            <Sparkles className="size-4" />
            {busy ? "Analysing…" : "Summarise with AI"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled={busy}
            onClick={() => {
              setContent("");
              setResult("");
              setError("");
              attempt.current = 0;
            }}
          >
            Clear
          </Button>
          <Disclaimer className="basis-full sm:basis-auto" />
        </div>
      </form>

      <div className="mt-6 space-y-4">
        {error ? <ErrorNote message={error} /> : null}
        {busy && !result ? <LoadingLines label="Reading and analysing your input…" /> : null}
        {result ? (
          <AiOutput
            title="Research brief"
            markdown
            value={result}
            onChange={setResult}
            busy={busy}
            onRegenerate={() => void generate(true)}
            onClear={() => {
              setResult("");
              setError("");
              attempt.current = 0;
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
