import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { ParticlesBg } from "@/components/ParticlesBg";
import { getUser } from "@/lib/auth";

export const Route = createFileRoute("/")({
  ssr: false,
  component: Splash,
});

const LOADING_STEPS = [
  "Initializing AI...",
  "Loading Machine Learning Models...",
  "Preparing Spectral Imaging...",
  "Optimizing Detection Engine...",
  "Almost Ready...",
];

const TITLE = "MangoGuard AI";

function Splash() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    const total = 3800;
    const tick = 40;
    let elapsed = 0;
    const id = setInterval(() => {
      elapsed += tick;
      const pct = Math.min(100, (elapsed / total) * 100);
      setProgress(pct);
      setStepIdx(Math.min(LOADING_STEPS.length - 1, Math.floor((pct / 100) * LOADING_STEPS.length)));
      if (pct >= 100) {
        clearInterval(id);
        setTimeout(() => {
          const dest = getUser() ? "/app" : "/login";
          navigate({ to: dest });
        }, 600);
      }
    }, tick);
    return () => clearInterval(id);
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      animate={progress >= 100 ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6"
    >
      <ParticlesBg count={40} />
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Logo with rotating ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="relative grid h-32 w-32 place-items-center"
        >
          {/* Rotating golden ring */}
          <motion.div
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            transition={{ opacity: { delay: 1, duration: 0.4 }, rotate: { delay: 1, duration: 1.5, ease: "easeInOut" } }}
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, oklch(0.86 0.16 92) 90deg, transparent 180deg, oklch(0.74 0.20 148) 270deg, transparent 360deg)",
              mask: "radial-gradient(circle, transparent 60%, black 62%, black 100%)",
              WebkitMask: "radial-gradient(circle, transparent 60%, black 62%, black 100%)",
            }}
          />
          {/* Ambient glow */}
          <motion.div
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity }}
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.74 0.20 148 / 0.5), transparent 70%)",
              filter: "blur(20px)",
            }}
          />
          <Logo size={84} />
          {/* Emit particles */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 0],
                x: Math.cos((i * Math.PI * 2) / 8) * 80,
                y: Math.sin((i * Math.PI * 2) / 8) * 80,
              }}
              transition={{ delay: 1.5 + i * 0.05, duration: 1.4, repeat: Infinity, repeatDelay: 1 }}
              className="absolute h-1.5 w-1.5 rounded-full bg-primary"
              style={{ boxShadow: "0 0 10px oklch(0.74 0.20 148)" }}
            />
          ))}
        </motion.div>

        {/* Title letter-by-letter */}
        <div className="mt-10 flex">
          {TITLE.split("").map((ch, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 2 + i * 0.05, duration: 0.4 }}
              className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl"
            >
              {ch === " " ? "\u00A0" : ch}
            </motion.span>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8, duration: 0.6 }}
          className="mt-3 text-sm text-muted-foreground md:text-base"
        >
          AI-Powered Early Mango Disease Detection
        </motion.p>

        {/* Loading bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.0, duration: 0.5 }}
          className="mt-10 w-72"
        >
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary via-primary-glow to-accent"
              style={{
                width: `${progress}%`,
                boxShadow: "0 0 16px oklch(0.74 0.20 148 / 0.8)",
              }}
              transition={{ ease: "linear" }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            <span>{LOADING_STEPS[stepIdx]}</span>
            <span className="tabular-nums text-primary">{Math.floor(progress)}%</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
