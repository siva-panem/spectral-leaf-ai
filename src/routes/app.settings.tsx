import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { clearHistory } from "@/lib/history";

export const Route = createFileRoute("/app/settings")({
  ssr: false,
  component: SettingsPage,
});

const LANGUAGES = [
  { label: "English", code: "en" },
  { label: "हिन्दी", code: "hi" },
  { label: "தமிழ்", code: "ta" },
  { label: "తెలుగు", code: "te" },
] as const;

const PREF_KEY = "mg_settings";

type Prefs = { dark: boolean; notif: boolean; language: string };

function loadPrefs(): Prefs {
  if (typeof window === "undefined") return { dark: true, notif: true, language: "en" };
  try {
    const raw = localStorage.getItem(PREF_KEY);
    if (raw) return { dark: true, notif: true, language: "en", ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return { dark: true, notif: true, language: "en" };
}

function savePrefs(p: Prefs) {
  localStorage.setItem(PREF_KEY, JSON.stringify(p));
}

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
  const [prefs, setPrefs] = useState<Prefs>(() => loadPrefs());

  // Apply on mount + whenever prefs change
  useEffect(() => {
    savePrefs(prefs);
    if (typeof document !== "undefined") {
      document.documentElement.lang = prefs.language;
      document.documentElement.classList.toggle("dark", prefs.dark);
    }
  }, [prefs]);

  const update = <K extends keyof Prefs>(key: K, value: Prefs[K], label: string) => {
    setPrefs((p) => ({ ...p, [key]: value }));
    toast.success(label);
  };

  const currentLang = LANGUAGES.find((l) => l.code === prefs.language) ?? LANGUAGES[0];

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 md:px-10 md:py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">Customise your MangoGuard experience.</p>
      </motion.div>

      <div className="mt-8 space-y-4">
        <Row label="Dark Mode" desc="MangoGuard is optimised for dark environments.">
          <Toggle
            value={prefs.dark}
            onChange={(v) => update("dark", v, v ? "Dark mode on" : "Dark mode off")}
          />
        </Row>
        <Row label="Notifications" desc="Get notified when new disease alerts apply to your region.">
          <Toggle
            value={prefs.notif}
            onChange={(v) => update("notif", v, v ? "Notifications on" : "Notifications off")}
          />
        </Row>
        <Row label="Language" desc={`Current: ${currentLang.label}. Display language for the interface.`}>
          <select
            value={prefs.language}
            onChange={(e) => {
              const next = e.target.value;
              const lang = LANGUAGES.find((l) => l.code === next) ?? LANGUAGES[0];
              update("language", next, `Language set to ${lang.label}`);
            }}
            className="rounded-lg border border-border bg-background/40 px-3 py-2 text-sm outline-none focus:border-primary/60"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
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
              if (confirm("Delete all detection history?")) {
                clearHistory();
                toast.success("History cleared");
              }
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
