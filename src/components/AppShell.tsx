import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Mail, BookOpen, MessageSquare, Menu, Sparkles } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/research", label: "Research Assistant", icon: BookOpen },
  { to: "/chat", label: "AI Chat", icon: MessageSquare },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1" aria-label="Main">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          activeProps={{
            className: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
          }}
        >
          <Icon className="size-4 shrink-0" aria-hidden="true" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Sparkles className="size-4" aria-hidden="true" />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-sm font-semibold tracking-tight">Workplace AI</span>
        <span className="block text-xs text-muted-foreground">Productivity Assistant</span>
      </span>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 lg:flex">
        <Brand />
        <div className="mt-8 flex-1">
          <NavList />
        </div>
        <p className="rounded-lg border border-border bg-surface p-3 text-[11px] leading-relaxed text-muted-foreground">
          AI-generated content may contain errors. Review and verify important information before
          using it.
        </p>
      </aside>

      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
        <Brand />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Open navigation">
              <Menu className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-sidebar p-5">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <Brand />
            <div className="mt-8">
              <NavList onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <main className={cn("lg:pl-64")}>
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">{children}</div>
      </main>
    </div>
  );
}
