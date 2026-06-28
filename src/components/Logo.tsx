import logo from "@/assets/logo.png";

interface LogoProps {
  size?: number;
  withText?: boolean;
  className?: string;
}

export function Logo({ size = 36, withText = false, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="relative grid place-items-center rounded-xl"
        style={{ width: size, height: size }}
      >
        <div
          className="absolute inset-0 rounded-xl"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, oklch(0.74 0.20 148 / 0.45), transparent 70%)",
            filter: "blur(8px)",
          }}
        />
        <img
          src={logo}
          alt="MangoGuard AI"
          width={size}
          height={size}
          className="relative z-10 drop-shadow-[0_0_10px_oklch(0.74_0.20_148/0.5)]"
        />
      </div>
      {withText && (
        <div className="flex flex-col leading-none">
          <span className="font-display text-lg font-semibold tracking-tight text-foreground">
            MangoGuard
          </span>
          <span className="font-display text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
            AI
          </span>
        </div>
      )}
    </div>
  );
}
