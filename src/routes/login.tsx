import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, ArrowLeft, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { ParticlesBg } from "@/components/ParticlesBg";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/login")({
  ssr: false,
  component: Login,
});

type Mode = "email" | "verify";

function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("email");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const goToApp = () => navigate({ to: "/app" });

  const onSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Enter your email");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: window.location.origin,
        data: name ? { full_name: name } : undefined,
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Could not send code");
      return;
    }
    toast.success("6-digit code sent to your email");
    setMode("verify");
  };

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Enter the 6-digit code");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Invalid or expired code");
      return;
    }
    toast.success("You're in!");
    goToApp();
  };

  const onResend = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success("New code sent");
  };

  const onGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setLoading(false);
      toast.error("Google sign-in failed");
      return;
    }
    if (result.redirected) return;
    goToApp();
  };

  const inputBase =
    "w-full rounded-lg border border-border bg-background/40 py-2.5 pl-10 pr-3.5 text-sm outline-none transition-all focus:border-primary/60 focus:ring-2 focus:ring-primary/20";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <ParticlesBg count={28} />
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-32 top-1/4 h-96 w-96 rounded-full"
        style={{ background: "oklch(0.74 0.20 148 / 0.25)", filter: "blur(120px)" }}
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full"
        style={{ background: "oklch(0.86 0.16 92 / 0.18)", filter: "blur(120px)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="glass relative z-10 w-full max-w-md rounded-3xl p-8 md:p-10"
      >
        <div className="flex flex-col items-center text-center">
          <Logo size={48} />
          <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight">
            {mode === "email" ? "Sign in with a code" : "Enter your code"}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {mode === "email" ? (
              "We'll email you a 6-digit code — no password needed"
            ) : (
              <>
                Code sent to <span className="text-foreground">{email}</span>
              </>
            )}
          </p>
        </div>

        {mode === "email" ? (
          <>
            <button
              onClick={onGoogle}
              disabled={loading}
              className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-white/[0.03] py-3 text-sm font-medium text-foreground transition-all hover:bg-white/[0.06] hover:border-primary/40 disabled:opacity-60"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="#EA4335"
                  d="M12 11v3.2h4.5c-.2 1.2-1.5 3.6-4.5 3.6-2.7 0-4.9-2.2-4.9-5s2.2-5 4.9-5c1.5 0 2.6.6 3.2 1.2l2.2-2.1C15.9 5.5 14.1 4.7 12 4.7c-4 0-7.3 3.3-7.3 7.3s3.3 7.3 7.3 7.3c4.2 0 7-3 7-7.2 0-.5 0-.8-.1-1.1H12z"
                />
              </svg>
              Continue with Google
            </button>

            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
                or with email
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={onSendCode} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Name <span className="opacity-60">(optional, first time only)</span>
                </label>
                <div className="relative mt-1.5">
                  <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className={inputBase}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Email</label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputBase}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-60 glow-primary"
              >
                {loading ? "Sending code…" : "Send 6-digit code"}
              </button>
            </form>
          </>
        ) : (
          <form onSubmit={onVerify} className="mt-7 flex flex-col gap-4">
            <input
              autoFocus
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="••••••"
              className="w-full rounded-xl border border-border bg-background/40 py-4 text-center text-2xl font-semibold tracking-[0.5em] outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-60 glow-primary"
            >
              {loading ? "Verifying…" : "Verify & continue"}
            </button>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <button
                type="button"
                onClick={() => {
                  setOtp("");
                  setMode("email");
                }}
                className="flex items-center gap-1 hover:text-foreground"
              >
                <ArrowLeft className="h-3 w-3" /> Change email
              </button>
              <button
                type="button"
                onClick={onResend}
                disabled={loading}
                className="text-primary hover:underline"
              >
                Resend code
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
