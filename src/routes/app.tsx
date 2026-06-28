import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { getUser } from "@/lib/auth";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/app")({
  ssr: false,
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!getUser()) navigate({ to: "/login" });
  }, [navigate]);

  return (
    <div className="relative flex min-h-screen w-full bg-background">
      <div className="grid-bg pointer-events-none fixed inset-0 opacity-30" />
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 80% 0%, oklch(0.74 0.20 148 / 0.10), transparent 60%), radial-gradient(ellipse 50% 40% at 10% 100%, oklch(0.86 0.16 92 / 0.06), transparent 70%)",
        }}
      />
      {/* Desktop sidebar */}
      <div className="relative z-10 hidden md:block">
        <AppSidebar />
      </div>

      {/* Mobile header */}
      <div className="md:hidden">
        <header className="glass-strong sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border/60 px-4">
          <Logo size={28} withText />
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-foreground hover:bg-white/5"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative z-10">
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute -right-12 top-3 rounded-lg p-2 text-foreground hover:bg-white/10"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
              <AppSidebar onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        )}
      </div>

      <main className="relative z-10 min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
