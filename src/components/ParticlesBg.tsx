import { useMemo } from "react";

interface Props {
  count?: number;
  showLeaves?: boolean;
  className?: string;
}

export function ParticlesBg({ count = 30, showLeaves = true, className = "" }: Props) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 12,
        duration: 14 + Math.random() * 16,
        opacity: 0.2 + Math.random() * 0.5,
      })),
    [count],
  );

  const leaves = useMemo(
    () =>
      Array.from({ length: showLeaves ? 8 : 0 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 14 + Math.random() * 20,
        delay: Math.random() * 16,
        duration: 22 + Math.random() * 18,
        rotate: Math.random() * 360,
      })),
    [showLeaves],
  );

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 grid-bg opacity-60" />
      {/* Soft moving light rays */}
      <div
        className="absolute -top-1/3 left-1/2 h-[120vh] w-[80vw] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 30%, oklch(0.74 0.20 148 / 0.16), transparent 60%)",
          animation: "glow-pulse 8s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-0 right-0 h-[60vh] w-[60vw]"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 80% 100%, oklch(0.86 0.16 92 / 0.10), transparent 70%)",
        }}
      />
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute bottom-0 rounded-full"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: "oklch(0.85 0.18 145)",
            opacity: p.opacity,
            filter: "blur(0.5px)",
            boxShadow: "0 0 12px oklch(0.74 0.20 148 / 0.8)",
            animation: `float-up ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
      {leaves.map((l) => (
        <svg
          key={`leaf-${l.id}`}
          viewBox="0 0 24 24"
          className="absolute bottom-0"
          width={l.size}
          height={l.size}
          style={{
            left: `${l.left}%`,
            color: "oklch(0.74 0.20 148 / 0.35)",
            transform: `rotate(${l.rotate}deg)`,
            animation: `float-up ${l.duration}s linear ${l.delay}s infinite`,
          }}
          fill="currentColor"
        >
          <path d="M12 2C7 2 3 6 3 11c0 5 4 9 9 11 5-2 9-6 9-11 0-5-4-9-9-9zm0 4c.6 4 3 6.4 7 7-4 .6-6.4 3-7 7-.6-4-3-6.4-7-7 4-.6 6.4-3 7-7z" />
        </svg>
      ))}
    </div>
  );
}
