import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { clearHistory } from "@/lib/history";

export const Route = createFileRoute("/app/settings")({
  ssr: false,
  component: SettingsPage,
});

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative h-6 w-11 rounded-full transition-colors ${value ? "bg-primary" : "bg-white/10"}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`}
      />
    </button>
  );
}

function SettingsPage() {
  const [dark, setDark] = useState(true);
  const [notif, setNotif] = useState(true);
  const [lang, setLang] = useState("English");

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 md:px-10 md:py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">Customise your MangoGuard experience.</p>
      </motion.div>

      <div className="mt-8 space-y-4">
        <Row label="Dark Mode" desc="MangoGuard is optimised for dark environments.">
          <Toggle value={dark} onChange={setDark} />
        </Row>
        <Row label="Notifications" desc="Get notified when new disease alerts apply to your region.">
          <Toggle value={notif} onChange={setNotif} />
        </Row>
        <Row label="Language" desc="Display language for the interface.">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="rounded-lg border border-border bg-background/40 px-3 py-2 text-sm outline-none focus:border-primary/60"
          >
            <option>English</option>
            <option>हिन्दी</option>
            <option>தமிழ்</option>
            <option>తెలుగు</option>
          </select>
        </Row>
        <Row label="Privacy" desc="Your scan history is stored locally on this device.">
          <span className="text-xs uppercase tracking-wider text-primary">Local only</span>
        </Row>
        <Row
          label="Delete History"
          desc="Permanently remove all detection history from this device."
        >
          <button
            onClick={() => {
              if (confirm("Delete all detection history?")) clearHistory();
            }}
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20"
          >
            Clear
          </button>
        </Row>
      </div>
    </div>
  );
}

function Row({
  label,
  desc,
  children,
}: {
  label: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass flex items-center justify-between gap-4 rounded-2xl p-5"
    >
      <div className="min-w-0">
        <div className="text-sm font-semibold">{label}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">{desc}</div>
      </div>
      <div className="shrink-0">{children}</div>
    </motion.div>
  );
}
