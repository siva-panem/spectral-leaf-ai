import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { DISEASES } from "@/lib/diseases";

export const Route = createFileRoute("/app/library")({
  ssr: false,
  component: LibraryLayout,
});

function LibraryLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isIndex = pathname === "/app/library" || pathname === "/app/library/";

  if (!isIndex) return <Outlet />;

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 md:px-10 md:py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          Disease Library
        </h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          A curated knowledge base of every disease MangoGuard AI can detect.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DISEASES.map((d, i) => (
          <motion.div
            key={d.slug}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Link
              to="/app/library/$slug"
              params={{ slug: d.slug }}
              className="glass group relative block overflow-hidden rounded-2xl p-5 transition-all hover:-translate-y-1 hover:border-primary/40"
            >
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-60 transition-opacity group-hover:opacity-100"
                style={{ background: `radial-gradient(circle, ${d.color}66, transparent 70%)`, filter: "blur(28px)" }}
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span
                    className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                    style={{ background: `${d.color}22`, color: d.color }}
                  >
                    {d.riskLevel}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {d.climate.split(",")[0]}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold">{d.name}</h3>
                <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                  {d.shortDescription}
                </p>
                <div className="mt-4 text-xs font-medium text-primary group-hover:underline">
                  Learn more →
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
