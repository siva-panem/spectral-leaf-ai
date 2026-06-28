import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { LogOut, FileText, History as HistoryIcon, ScanLine } from "lucide-react";
import { getUser, signOut } from "@/lib/auth";
import { listHistory } from "@/lib/history";

export const Route = createFileRoute("/app/profile")({
  ssr: false,
  component: ProfilePage,
});

function ProfilePage() {
  const user = getUser();
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  useEffect(() => setCount(listHistory().length), []);

  const initials = (user?.name ?? "U")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 md:px-10 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass overflow-hidden rounded-3xl p-8"
      >
        <div className="flex flex-col items-center text-center md:flex-row md:items-center md:gap-6 md:text-left">
          <div className="relative">
            <div
              className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-primary to-accent font-display text-3xl font-bold text-primary-foreground"
              style={{ boxShadow: "0 0 30px oklch(0.74 0.20 148 / 0.5)" }}
            >
              {initials}
            </div>
          </div>
          <div className="mt-4 min-w-0 md:mt-0">
            <h1 className="font-display text-2xl font-semibold">{user?.name ?? "Farmer"}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {count} predictions made
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Quick to="/app/detect" icon={<ScanLine className="h-4 w-4" />} label="Detect" />
        <Quick to="/app/history" icon={<HistoryIcon className="h-4 w-4" />} label="History" />
        <Quick to="/app/reports" icon={<FileText className="h-4 w-4" />} label="Reports" />
        <button
          onClick={() => {
            signOut();
            navigate({ to: "/login" });
          }}
          className="glass flex items-center justify-center gap-2 rounded-2xl p-4 text-sm font-medium text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}

function Quick({
  to,
  icon,
  label,
}: {
  to: "/app/detect" | "/app/history" | "/app/reports";
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="glass flex items-center justify-center gap-2 rounded-2xl p-4 text-sm font-medium text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40"
    >
      {icon}
      {label}
    </Link>
  );
}
