import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Leaf, Pill, ShieldCheck, AlertTriangle } from "lucide-react";
import { getDisease } from "@/lib/diseases";

export const Route = createFileRoute("/app/library/$slug")({
  ssr: false,
  component: DiseaseDetail,
});

function DiseaseDetail() {
  const { slug } = Route.useParams();
  const d = getDisease(slug);
  if (!d) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-16 text-center">
        <h1 className="font-display text-2xl">Disease not found</h1>
        <Link to="/app/library" className="mt-4 inline-block text-primary">
          Back to library
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 md:px-10 md:py-10">
      <Link
        to="/app/library"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to library
      </Link>

      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass relative mt-4 overflow-hidden rounded-3xl p-8 md:p-10"
      >
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full"
          style={{ background: `radial-gradient(circle, ${d.color}55, transparent 70%)`, filter: "blur(50px)" }}
        />
        <div className="relative">
          <span
            className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
            style={{ background: `${d.color}22`, color: d.color }}
          >
            {d.riskLevel} Risk
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-5xl">
            {d.name}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
            {d.description}
          </p>
        </div>
      </motion.header>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Section icon={<Leaf className="h-4 w-4" />} title="Symptoms" items={d.symptoms} />
        <Section icon={<AlertTriangle className="h-4 w-4" />} title="Causes" items={d.causes} />
        <Section icon={<AlertTriangle className="h-4 w-4" />} title="Early Signs" items={d.earlySigns} />
        <Section icon={<AlertTriangle className="h-4 w-4" />} title="Advanced Signs" items={d.advancedSigns} />
        <Section icon={<ShieldCheck className="h-4 w-4" />} title="Prevention" items={d.prevention} />

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
          <div className="mb-3 flex items-center gap-2 text-primary">
            <Pill className="h-4 w-4" />
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.2em]">
              Medicine
            </h3>
          </div>
          <div className="font-display text-lg font-semibold">{d.medicine.name}</div>
          <div className="mt-1 text-xs uppercase tracking-[0.18em] text-primary">{d.medicine.type}</div>
          <dl className="mt-3 space-y-2 text-sm">
            <Row k="Dosage" v={d.medicine.dosage} />
            <Row k="Method" v={d.medicine.sprayMethod} />
            <Row k="Interval" v={d.medicine.interval} />
            <Row k="Recovery" v={d.medicine.recovery} />
          </dl>
        </motion.div>
      </div>
    </div>
  );
}

function Section({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
      <div className="mb-3 flex items-center gap-2 text-primary">
        {icon}
        <h3 className="font-display text-sm font-semibold uppercase tracking-[0.2em]">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i} className="flex gap-2 text-sm">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            {i}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/40 pb-2 last:border-none">
      <dt className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{k}</dt>
      <dd className="text-right text-sm">{v}</dd>
    </div>
  );
}
