interface Props {
  src: string;
  className?: string;
}

export function ScanAnimation({ src, className = "" }: Props) {
  return (
    <div
      className={`relative aspect-square w-full overflow-hidden rounded-2xl border border-primary/30 ${className}`}
    >
      <img src={src} alt="Scanning" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-background/30" />
      <div className="absolute inset-0 grid-bg opacity-80" />
      {/* Scan line */}
      <div
        className="absolute inset-x-0 h-24"
        style={{
          background:
            "linear-gradient(to bottom, transparent, oklch(0.74 0.20 148 / 0.6), transparent)",
          boxShadow: "0 0 30px oklch(0.74 0.20 148 / 0.8)",
          animation: "scan-line 2.4s ease-in-out infinite",
        }}
      />
      {/* Corner brackets */}
      {[
        "top-2 left-2 border-t-2 border-l-2",
        "top-2 right-2 border-t-2 border-r-2",
        "bottom-2 left-2 border-b-2 border-l-2",
        "bottom-2 right-2 border-b-2 border-r-2",
      ].map((pos, i) => (
        <span
          key={i}
          className={`absolute h-6 w-6 ${pos} border-primary`}
          style={{ boxShadow: "0 0 10px oklch(0.74 0.20 148 / 0.8)" }}
        />
      ))}
      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 rounded-md bg-background/60 px-3 py-1.5 text-[11px] font-medium uppercase tracking-widest text-primary backdrop-blur">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
        AI Scanning…
      </div>
    </div>
  );
}
