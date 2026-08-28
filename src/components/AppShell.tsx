import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Mail, BookOpen, MessageSquare, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/research", label: "Research Assistant", icon: BookOpen },
  { to: "/chat", label: "AI Chat", icon: MessageSquare },
] as const;

function NavList() {
  return (
    <nav aria-label="Main navigation">
      <ul className="flex flex-col gap-1">
        {NAV.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              title={label}
              aria-label={label}
              activeOptions={{ exact: to === "/" }}
              className="flex min-h-11 items-center justify-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar lg:justify-start"
              activeProps={{
                className:
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                "aria-current": "page",
              }}
            >
              <Icon className="size-5 shrink-0 lg:size-4" aria-hidden="true" />
              <span className="hidden lg:inline">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      <a
        href="#main-content"
        className="sr-only rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to main content
      </a>

      <aside
        aria-label="Sidebar"
        className="fixed inset-y-0 left-0 z-30 flex w-16 flex-col border-r border-sidebar-border bg-sidebar px-2 py-4 lg:w-64 lg:px-4 lg:py-5"
      >
        <Link
          to="/"
          aria-label="Workplace AI Productivity Assistant — go to dashboard"
          className="flex items-center justify-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:justify-start"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <span className="hidden leading-tight lg:block">
            <span className="block font-display text-sm font-semibold tracking-tight">
              Workplace AI
            </span>
            <span className="block text-xs text-muted-foreground">Productivity Assistant</span>
          </span>
        </Link>

        <div className="mt-8 flex-1">
          <NavList />
        </div>

        <p className="hidden rounded-lg border border-border bg-surface p-3 text-[11px] leading-relaxed text-muted-foreground lg:block">
          AI-generated content may contain errors. Review and verify important information before
          using it.
        </p>
      </aside>

      <main id="main-content" tabIndex={-1} className="pl-16 focus:outline-none lg:pl-64">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">{children}</div>
      </main>
    </div>
  );
}
