import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import {
  UploadCloud,
  Image as ImageIcon,
  Camera,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Pill,
  Leaf,
  Lightbulb,
  RotateCw,
} from "lucide-react";
import { ScanAnimation } from "@/components/ScanAnimation";
import { ConfidenceGauge } from "@/components/ConfidenceGauge";
import { pickMockDetection, type Disease, type Severity } from "@/lib/diseases";
import { addHistory } from "@/lib/history";

export const Route = createFileRoute("/app/detect")({
  ssr: false,
  component: DetectPage,
});

type Phase = "idle" | "scanning" | "result";

const STEPS = [
  "Analyzing Image...",
  "Extracting Features...",
  "Running Machine Learning...",
  "Checking Spectral Characteristics...",
  "Generating Report...",
];

const SEVERITY_COLOR: Record<Severity, string> = {
  Healthy: "oklch(0.74 0.20 148)",
  Low: "oklch(0.82 0.18 110)",
  Medium: "oklch(0.86 0.16 92)",
  High: "oklch(0.70 0.20 50)",
  Critical: "oklch(0.65 0.22 25)",
};

const SEVERITY_VALUE: Record<Severity, number> = {
  Healthy: 5,
  Low: 25,
  Medium: 50,
  High: 75,
  Critical: 95,
};

function DetectPage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [result, setResult] = useState<{
    disease: Disease;
    confidence: number;
    severity: Severity;
  } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setImageUrl(url);
      runScan(url);
    };
    reader.readAsDataURL(f);
  };

  const runScan = (url: string) => {
    setPhase("scanning");
    setStepIdx(0);
    let i = 0;
    const stepInterval = setInterval(() => {
      i++;
      if (i >= STEPS.length) {
        clearInterval(stepInterval);
        return;
      }
      setStepIdx(i);
    }, 700);

    setTimeout(() => {
      const r = pickMockDetection();
      setResult(r);
      setPhase("result");
      addHistory({
        id: crypto.randomUUID(),
        imageDataUrl: url,
        diseaseSlug: r.disease.slug,
        diseaseName: r.disease.name,
        confidence: r.confidence,
        severity: r.severity,
        medicine: r.disease.medicine.name,
        status:
          r.disease.slug === "healthy"
            ? "Healthy"
            : r.severity === "Critical" || r.severity === "High"
              ? "Pending"
              : "Treated",
        createdAt: Date.now(),
      });
    }, 4200);
  };

  const reset = () => {
    setPhase("idle");
    setImageUrl(null);
    setResult(null);
    setStepIdx(0);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 md:px-10 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          Disease Detection
        </h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          Upload or capture a mango leaf image. Our AI will analyse spectral and visual features
          to identify diseases with high precision.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="glass rounded-3xl p-6 md:p-10"
          >
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              className="grid place-items-center rounded-2xl border-2 border-dashed border-primary/30 bg-primary/[0.03] px-6 py-16 text-center transition-all hover:border-primary/60 hover:bg-primary/[0.06]"
            >
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary ring-glow">
                <UploadCloud className="h-7 w-7" />
              </div>
              <h2 className="mt-5 font-display text-xl font-semibold">
                Drag &amp; drop a leaf image
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                or choose how to provide your image
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 glow-primary"
                >
                  <ImageIcon className="h-4 w-4" />
                  Browse Image
                </button>
                <button
                  onClick={() => cameraRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-white/[0.06]"
                >
                  <Camera className="h-4 w-4" />
                  Take Photo
                </button>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
              <input
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
              <div className="mt-6 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                JPG · PNG · HEIC · Max 10 MB
              </div>
            </div>
          </motion.div>
        )}

        {phase === "scanning" && imageUrl && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            <ScanAnimation src={imageUrl} />
            <div className="glass flex flex-col rounded-2xl p-6">
              <div className="text-xs uppercase tracking-[0.2em] text-primary">AI Processing</div>
              <h2 className="mt-2 font-display text-2xl font-semibold">
                Running Machine Learning model
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                MobileNetV2 + EfficientNetV2 ensemble · spectral indices in flight.
              </p>
              <ul className="mt-6 space-y-3">
                {STEPS.map((s, i) => (
                  <li key={s} className="flex items-center gap-3">
                    <span
                      className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-semibold transition-all ${
                        i < stepIdx
                          ? "bg-primary text-primary-foreground"
                          : i === stepIdx
                            ? "bg-primary/30 text-primary ring-2 ring-primary"
                            : "bg-white/5 text-muted-foreground"
                      }`}
                    >
                      {i < stepIdx ? "✓" : i + 1}
                    </span>
                    <span
                      className={`text-sm transition-all ${
                        i <= stepIdx ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {s}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 4, ease: "linear" }}
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    style={{ boxShadow: "0 0 12px oklch(0.74 0.20 148 / 0.8)" }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {phase === "result" && result && imageUrl && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <ResultView
              imageUrl={imageUrl}
              disease={result.disease}
              confidence={result.confidence}
              severity={result.severity}
              onReset={reset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResultView({
  imageUrl,
  disease,
  confidence,
  severity,
  onReset,
}: {
  imageUrl: string;
  disease: Disease;
  confidence: number;
  severity: Severity;
  onReset: () => void;
}) {
  const sevColor = SEVERITY_COLOR[severity];
  const isHealthy = disease.slug === "healthy";

  return (
    <>
      {/* Top result */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="glass overflow-hidden rounded-3xl lg:col-span-1">
          <img src={imageUrl} alt="" className="aspect-square w-full object-cover" />
        </div>
        <div className="glass relative overflow-hidden rounded-3xl p-6 md:p-8 lg:col-span-2">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full"
            style={{
              background: `radial-gradient(circle, ${disease.color}55, transparent 70%)`,
              filter: "blur(40px)",
            }}
          />
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-primary">
                {isHealthy ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                {isHealthy ? "All Clear" : "Disease Detected"}
              </div>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
                {disease.name}
              </h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                {disease.shortDescription}
              </p>
            </div>
            <button
              onClick={onReset}
              className="hidden shrink-0 items-center gap-2 rounded-lg border border-border bg-white/[0.03] px-3 py-2 text-xs font-medium text-foreground hover:bg-white/[0.06] sm:inline-flex"
            >
              <RotateCw className="h-3.5 w-3.5" />
              New scan
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 items-center gap-6 md:grid-cols-[auto_1fr]">
            <ConfidenceGauge value={confidence} color={sevColor} />
            <div className="space-y-4">
              <Meter label="Severity" value={SEVERITY_VALUE[severity]} color={sevColor} caption={severity} />
              <Meter
                label="Risk Level"
                value={isHealthy ? 5 : SEVERITY_VALUE[severity]}
                color={sevColor}
                caption={disease.riskLevel}
              />
              <Meter
                label="Health Meter"
                value={isHealthy ? 95 : 100 - SEVERITY_VALUE[severity]}
                color="oklch(0.74 0.20 148)"
                caption={isHealthy ? "Excellent" : "Needs attention"}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Disease Details" icon={<Leaf className="h-4 w-4" />} className="lg:col-span-2">
          <p className="text-sm text-muted-foreground">{disease.description}</p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Block label="Symptoms" items={disease.symptoms} />
            <Block label="Causes" items={disease.causes} />
            <Block label="Early Signs" items={disease.earlySigns} />
            <Block label="Advanced Signs" items={disease.advancedSigns} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs md:grid-cols-4">
            <Pill2 label="Spread" value={disease.spread} />
            <Pill2 label="Risk" value={disease.riskLevel} />
            <Pill2 label="Climate" value={disease.climate} />
            <Pill2 label="Recovery" value={disease.recoveryTime} />
          </div>
        </Card>

        <Card title="Medicine" icon={<Pill className="h-4 w-4" />}>
          <div className="font-display text-lg font-semibold">{disease.medicine.name}</div>
          <div className="mt-1 text-xs uppercase tracking-[0.18em] text-primary">
            {disease.medicine.type}
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <DRow k="Dosage" v={disease.medicine.dosage} />
            <DRow k="Method" v={disease.medicine.sprayMethod} />
            <DRow k="Interval" v={disease.medicine.interval} />
            <DRow k="Recovery" v={disease.medicine.recovery} />
          </dl>
          <div className="mt-4 rounded-lg border border-accent/30 bg-accent/10 p-3 text-xs text-foreground/90">
            <span className="font-semibold text-accent">Important: </span>
            Consult your local agricultural officer before using pesticides.
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Prevention" icon={<CheckCircle2 className="h-4 w-4" />}>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {disease.prevention.map((p) => (
              <li
                key={p}
                className="flex items-start gap-2 rounded-lg bg-white/[0.03] p-3 text-sm"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {p}
              </li>
            ))}
          </ul>
        </Card>

        <Card title="AI Suggestions" icon={<Lightbulb className="h-4 w-4" />}>
          <ul className="space-y-2">
            {disease.suggestions.map((s) => (
              <li
                key={s}
                className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm"
              >
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {s}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 glow-primary"
            >
              <RotateCw className="h-4 w-4" />
              Scan another leaf
            </button>
            <Link
              to="/app/history"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-white/[0.06]"
            >
              View history
            </Link>
          </div>
        </Card>
      </div>
    </>
  );
}

function Meter({
  label,
  value,
  color,
  caption,
}: {
  label: string;
  value: number;
  color: string;
  caption: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
        <span className="font-medium" style={{ color }}>
          {caption}
        </span>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full"
          style={{ background: color, boxShadow: `0 0 10px ${color}` }}
        />
      </div>
    </div>
  );
}

function Card({
  title,
  icon,
  children,
  className = "",
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-2xl p-6 ${className}`}
    >
      <div className="mb-4 flex items-center gap-2 text-primary">
        {icon}
        <h3 className="font-display text-sm font-semibold uppercase tracking-[0.2em]">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

function Block({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="rounded-lg bg-white/[0.03] p-3">
      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </div>
      <ul className="mt-2 space-y-1 text-sm">
        {items.map((i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Pill2({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-white/[0.02] p-3">
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}

function DRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/40 pb-2 last:border-none">
      <dt className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{k}</dt>
      <dd className="text-right text-sm">{v}</dd>
    </div>
  );
}
