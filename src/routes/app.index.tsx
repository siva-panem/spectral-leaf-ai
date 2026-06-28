import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ScanLine,
  Activity,
  Leaf,
  ShieldAlert,
  Cloud,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { getUser } from "@/lib/auth";
import { listHistory, type PredictionRecord } from "@/lib/history";
import orchard from "@/assets/orchard.jpg";

export const Route = createFileRoute("/app/")({
  ssr: false,
  component: Dashboard,
});

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  delay = 0,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
      className="glass rounded-2xl p-5"
    >
      <div className="flex items-center justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        {hint && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
            {hint}
          </span>
        )}
      </div>
      <div className="mt-4 font-display text-3xl font-bold tracking-tight">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
    </motion.div>
  );
}

function Dashboard() {
  const user = getUser();
  const [history, setHistory] = useState<PredictionRecord[]>([]);

  useEffect(() => {
    setHistory(listHistory());
  }, []);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const total = history.length;
  const healthy = history.filter((h) => h.diseaseSlug === "healthy").length;
  const diseases = total - healthy;
  const avgConfidence = total
    ? history.reduce((a, b) => a + b.confidence, 0) / total
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 md:px-10 md:py-10">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="glass relative overflow-hidden rounded-3xl p-8 md:p-12"
      >
        <img
          src={orchard}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-primary">
            <Sparkles className="h-3 w-3" />
            AI Vision · Spectral Imaging
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold leading-tight tracking-tight md:text-5xl">
            Detect Mango Diseases <br className="hidden md:block" />
            <span className="text-gradient">Before They Become Visible</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
            AI + Machine Learning + Spectral Imaging for early disease detection — built for
            modern orchards.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/app/detect"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground glow-primary transition-all hover:opacity-90"
            >
              <ScanLine className="h-4 w-4" />
              Start Detection
            </Link>
            <Link
              to="/app/about"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-white/[0.03] px-5 py-3 text-sm font-medium text-foreground transition-all hover:bg-white/[0.06]"
            >
              Learn More
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Welcome strip */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-5 md:col-span-2"
        >
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Welcome</div>
          <div className="mt-1 font-display text-2xl font-semibold">
            Hello, {user?.name ?? "Farmer"} 👋
          </div>
          <div className="mt-1 text-sm text-muted-foreground">{today}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass flex items-center justify-between rounded-2xl p-5"
        >
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Weather</div>
            <div className="mt-1 font-display text-2xl font-semibold">28°C</div>
            <div className="text-xs text-muted-foreground">Partly cloudy · Humid</div>
          </div>
          <Cloud className="h-10 w-10 text-primary" />
        </motion.div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={Activity} label="Total Scans" value={String(total)} delay={0.2} />
        <StatCard
          icon={Leaf}
          label="Healthy Leaves"
          value={String(healthy)}
          hint="OK"
          delay={0.25}
        />
        <StatCard
          icon={ShieldAlert}
          label="Detected Diseases"
          value={String(diseases)}
          delay={0.3}
        />
        <StatCard
          icon={Sparkles}
          label="Avg. Accuracy"
          value={`${avgConfidence ? avgConfidence.toFixed(1) : "0.0"}%`}
          hint="AI"
          delay={0.35}
        />
      </div>

      {/* Quick action + recent */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass relative overflow-hidden rounded-2xl p-6 lg:col-span-1"
        >
          <div className="font-display text-lg font-semibold">Quick Detection</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload a leaf image and get an AI diagnosis in seconds.
          </p>
          <Link
            to="/app/detect"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 glow-primary"
          >
            <ScanLine className="h-4 w-4" />
            Open scanner
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass rounded-2xl p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between">
            <div className="font-display text-lg font-semibold">Recent Predictions</div>
            <Link
              to="/app/history"
              className="text-xs font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          {history.length === 0 ? (
            <div className="mt-6 grid place-items-center rounded-xl border border-dashed border-border py-12 text-center">
              <div className="text-sm text-muted-foreground">No scans yet.</div>
              <Link
                to="/app/detect"
                className="mt-3 text-sm font-medium text-primary hover:underline"
              >
                Run your first detection →
              </Link>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-border/60">
              {history.slice(0, 4).map((h) => (
                <li key={h.id} className="flex items-center gap-4 py-3">
                  <img
                    src={h.imageDataUrl}
                    alt=""
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{h.diseaseName}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(h.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-primary">
                      {h.confidence.toFixed(1)}%
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {h.severity}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </div>
  );
}
