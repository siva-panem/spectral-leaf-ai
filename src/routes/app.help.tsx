import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, BookOpen, Sprout, Building2, Phone } from "lucide-react";

export const Route = createFileRoute("/app/help")({
  ssr: false,
  component: HelpPage,
});

const FAQS = [
  {
    q: "How accurate is MangoGuard AI?",
    a: "Our ensemble model achieves >95% accuracy on benchmark datasets, with confidence scores reported on every scan.",
  },
  {
    q: "Can I use it without internet?",
    a: "The web app needs a connection. Offline mobile inference is on the roadmap using TensorFlow Lite.",
  },
  {
    q: "What kind of photo gives the best result?",
    a: "Use natural daylight, fill the frame with one leaf, and avoid heavy shadows. Both leaf surfaces help.",
  },
  {
    q: "Should I treat based only on the AI result?",
    a: "Always confirm with your local agricultural officer before applying pesticides.",
  },
];

const TIPS = [
  "Inspect new flush weekly during the monsoon.",
  "Prune to keep airflow open inside the canopy.",
  "Rotate fungicide chemistries to prevent resistance.",
  "Mulch the basin to reduce soil-splash spread.",
  "Time sprays for the early morning, never midday.",
];

function HelpPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 md:px-10 md:py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Help Center</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Guides, tips, and contacts to get the most out of MangoGuard AI.
        </p>
      </motion.div>

      <section className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 text-primary">
          <BookOpen className="h-4 w-4" />
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em]">FAQ</h2>
        </div>
        <ul className="mt-4 space-y-2">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q} className="rounded-xl border border-border bg-white/[0.02]">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                >
                  <span className="text-sm font-medium">{f.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180 text-primary" : ""}`}
                  />
                </button>
                {isOpen && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="px-4 pb-4 text-sm text-muted-foreground"
                  >
                    {f.a}
                  </motion.p>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 text-primary">
            <Sprout className="h-4 w-4" />
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em]">
              Farmer Tips
            </h2>
          </div>
          <ul className="mt-4 space-y-2">
            {TIPS.map((t) => (
              <li key={t} className="flex gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {t}
              </li>
            ))}
          </ul>
        </section>

        <section className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 text-primary">
            <Building2 className="h-4 w-4" />
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em]">
              Government Schemes
            </h2>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Placeholder — connect your region's horticulture portal to surface subsidy and crop
            insurance details here.
          </p>
          <div className="mt-4 flex items-center gap-2 text-primary">
            <Phone className="h-4 w-4" />
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em]">
              Emergency
            </h2>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Placeholder — your local Krishi Vigyan Kendra contact will appear here.
          </p>
        </section>
      </div>
    </div>
  );
}
