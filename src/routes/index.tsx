import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, BookOpen, MessageSquare, ArrowRight, ShieldCheck, Zap, PenLine } from "lucide-react";
import { PageHeader, Disclaimer } from "@/components/PageHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Workplace AI Productivity Assistant" },
      {
        name: "description",
        content:
          "One workspace for AI-drafted emails, research summaries and an assistant chat built for everyday professional tasks.",
      },
      { property: "og:title", content: "Dashboard — Workplace AI Productivity Assistant" },
      {
        property: "og:description",
        content:
          "One workspace for AI-drafted emails, research summaries and an assistant chat built for everyday professional tasks.",
      },
    ],
  }),
  component: Dashboard,
});

const FEATURES = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    body: "Describe the situation and get a complete, natural email tuned to your tone and audience.",
    action: "Draft an email",
  },
  {
    to: "/research",
    icon: BookOpen,
    title: "AI Research Assistant",
    body: "Turn a topic, question, article or report into a scannable brief with insights and next steps.",
    action: "Summarise something",
  },
  {
    to: "/chat",
    icon: MessageSquare,
    title: "AI Workplace Chatbot",
    body: "Brainstorm, plan, rewrite and explain with a conversational assistant that keeps context.",
    action: "Start chatting",
  },
] as const;

const QUICK = [
  { to: "/email", label: "Follow up with a client", icon: PenLine },
  { to: "/research", label: "Summarise a long report", icon: Zap },
  { to: "/chat", label: "Plan next week's priorities", icon: MessageSquare },
] as const;

function Dashboard() {
  return (
    <div>
      <PageHeader
        eyebrow="Workspace"
        title="Your AI workplace assistant"
        description="Three focused tools for the writing, reading and thinking work that fills a professional day. Everything is generated live from your input."
      />

      <section aria-labelledby="tools" className="mb-10">
        <h2 id="tools" className="sr-only">
          Tools
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ to, icon: Icon, title, body, action }) => (
            <Link
              key={to}
              to={to}
              aria-label={`${title}: ${action}`}
              className="group flex flex-col rounded-xl border border-border bg-card p-5 shadow-card transition-colors hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="mb-4 flex size-10 items-center justify-center rounded-lg bg-surface text-foreground">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="text-base font-semibold">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium">
                {action}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="quick" className="mb-10">
        <h2 id="quick" className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Quick actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {QUICK.map(({ to, label, icon: Icon }) => (
            <Link
              key={label}
              to={to}
              className="flex min-h-11 items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </div>
      </section>

      <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <Disclaimer />
      </div>
    </div>
  );
}
