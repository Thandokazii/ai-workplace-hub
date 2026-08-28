import { Copy, RefreshCw, Trash2, Check, Pencil, Eye } from "lucide-react";
import { useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Disclaimer } from "@/components/PageHeader";

export function LoadingLines({ label }: { label: string }) {
  return (
    <div role="status" aria-live="polite" className="rounded-xl border border-border bg-card p-6">
      <p className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <RefreshCw className="size-4 animate-spin" aria-hidden="true" />
        {label}
      </p>
      <div className="space-y-3">
        {[100, 92, 80, 96, 64].map((w, i) => (
          <div
            key={i}
            className="h-3 animate-pulse rounded-full bg-surface"
            style={{ width: `${w}%`, animationDelay: `${i * 90}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive"
    >
      {message}
    </div>
  );
}

export function AiOutput({
  title,
  value,
  onChange,
  onRegenerate,
  onClear,
  busy,
  markdown = false,
  footer,
}: {
  title: string;
  value: string;
  onChange: (v: string) => void;
  onRegenerate: () => void;
  onClear: () => void;
  busy?: boolean;
  markdown?: boolean;
  footer?: ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(!markdown);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Copying isn't available in this browser");
    }
  };

  return (
    <section className="rounded-xl border border-border bg-card shadow-card" aria-label={title}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-primary-foreground">
            AI generated
          </span>
          <h2 className="text-sm font-semibold">{title}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {markdown ? (
            <Button variant="outline" size="sm" onClick={() => setEditing((e) => !e)}>
              {editing ? <Eye className="size-4" /> : <Pencil className="size-4" />}
              {editing ? "Preview" : "Edit"}
            </Button>
          ) : null}
          <Button variant="outline" size="sm" onClick={copy}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={onRegenerate} disabled={busy}>
            <RefreshCw className={`size-4 ${busy ? "animate-spin" : ""}`} />
            Regenerate
          </Button>
          <Button variant="ghost" size="sm" onClick={onClear} disabled={busy}>
            <Trash2 className="size-4" />
            Clear
          </Button>
        </div>
      </div>

      <div className="p-5">
        {editing ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label={`${title} (editable)`}
            className="min-h-[320px] resize-y border-border bg-surface font-mono text-[13px] leading-relaxed"
          />
        ) : (
          <div className="prose-ai max-w-none text-sm text-foreground">
            <ReactMarkdown>{value}</ReactMarkdown>
          </div>
        )}
        {footer}
        <Disclaimer className="mt-4 border-t border-border pt-3" />
      </div>
    </section>
  );
}
