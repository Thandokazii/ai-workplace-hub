import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Wand2 } from "lucide-react";
import { useRef, useState } from "react";
import { generateEmail } from "@/lib/ai.functions";
import { PageHeader, Disclaimer } from "@/components/PageHeader";
import { AiOutput, ErrorNote, LoadingLines } from "@/components/AiOutput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI" },
      {
        name: "description",
        content:
          "Generate complete, context-aware professional emails with formal, informal or persuasive tone for clients, managers or teams.",
      },
      { property: "og:title", content: "Smart Email Generator — Workplace AI" },
      {
        property: "og:description",
        content:
          "Generate complete, context-aware professional emails for clients, managers or teams.",
      },
    ],
  }),
  component: EmailPage,
});

type Tone = "Formal" | "Informal" | "Persuasive";
type Audience = "Client" | "Manager" | "Team";

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [situation, setSituation] = useState("");
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [details, setDetails] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [audience, setAudience] = useState<Audience>("Client");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const attempt = useRef(0);

  const generate = async (regenerate = false) => {
    if (!situation.trim()) {
      setError("Describe the situation so the assistant has something to work with.");
      return;
    }
    setBusy(true);
    setError("");
    attempt.current = regenerate ? attempt.current + 1 : 0;
    try {
      const res = await run({
        data: {
          situation,
          purpose,
          recipient,
          details,
          tone,
          audience,
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
        description="Give the assistant the context and it writes a complete, natural email — not a template. Edit anything before you send."
      />

      <form
        className="rounded-xl border border-border bg-card p-5 shadow-card sm:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          void generate(false);
        }}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="situation">Situation / context</Label>
            <Textarea
              id="situation"
              required
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="e.g. Our delivery to the client slipped by a week because of a supplier delay, and I need to explain it and propose a new date."
              className="mt-2 min-h-28 bg-surface"
            />
          </div>
          <div>
            <Label htmlFor="purpose">Purpose</Label>
            <Input
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Apologise and reset expectations"
              className="mt-2 bg-surface"
            />
          </div>
          <div>
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Sarah Naidoo, Head of Operations"
              className="mt-2 bg-surface"
            />
          </div>
          <div>
            <Label htmlFor="tone">Tone</Label>
            <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
              <SelectTrigger id="tone" className="mt-2 w-full bg-surface">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Formal", "Informal", "Persuasive"].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="audience">Audience</Label>
            <Select value={audience} onValueChange={(v) => setAudience(v as Audience)}>
              <SelectTrigger id="audience" className="mt-2 w-full bg-surface">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Client", "Manager", "Team"].map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="details">Key details to include</Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="New delivery date 14 March, 5% discount offered, review call on Friday."
              className="mt-2 min-h-24 bg-surface"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={busy}>
            <Wand2 className="size-4" />
            {busy ? "Generating…" : "Generate email"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled={busy}
            onClick={() => {
              setSituation("");
              setPurpose("");
              setRecipient("");
              setDetails("");
              clearAll();
            }}
          >
            Clear form
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
