import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ScanLine,
  History,
  BookOpen,
  FileText,
  Info,
  Settings,
  HelpCircle,
  User,
  LogOut,
} from "lucide-react";
import { Logo } from "./Logo";
import { signOut } from "@/lib/auth";

const NAV = [
  { to: "/app", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { to: "/app/detect", icon: ScanLine, label: "Detection" },
  { to: "/app/history", icon: History, label: "History" },
  { to: "/app/library", icon: BookOpen, label: "Disease Library" },
  { to: "/app/reports", icon: FileText, label: "Reports" },
  { to: "/app/about", icon: Info, label: "About" },
  { to: "/app/settings", icon: Settings, label: "Settings" },
  { to: "/app/help", icon: HelpCircle, label: "Help" },
  { to: "/app/profile", icon: User, label: "Profile" },
] as const;

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate({ to: "/login" });
  };

  return (
    <aside className="glass-strong sticky top-0 flex h-screen w-64 flex-col gap-2 border-r border-border/60 p-4">
      <div className="px-2 pt-2 pb-4">
        <Logo size={32} withText />
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-primary/15 text-foreground"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              {active && (
                <span
                  className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-primary"
                  style={{ boxShadow: "0 0 12px oklch(0.74 0.20 148 / 0.8)" }}
                />
              )}
              <Icon className={`h-4 w-4 ${active ? "text-primary" : ""}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </aside>
  );
}
