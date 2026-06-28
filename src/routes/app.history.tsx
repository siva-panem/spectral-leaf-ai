import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Trash2, Download, ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import { listHistory, deleteHistory, type PredictionRecord } from "@/lib/history";

export const Route = createFileRoute("/app/history")({
  ssr: false,
  component: HistoryPage,
});

function HistoryPage() {
  const [items, setItems] = useState<PredictionRecord[]>([]);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"new" | "old" | "conf">("new");

  useEffect(() => setItems(listHistory()), []);

  const filtered = useMemo(() => {
    let arr = items.filter(
      (i) =>
        !q ||
        i.diseaseName.toLowerCase().includes(q.toLowerCase()) ||
        i.medicine.toLowerCase().includes(q.toLowerCase()),
    );
    if (sort === "new") arr = arr.sort((a, b) => b.createdAt - a.createdAt);
    if (sort === "old") arr = arr.sort((a, b) => a.createdAt - b.createdAt);
    if (sort === "conf") arr = arr.sort((a, b) => b.confidence - a.confidence);
    return arr;
  }, [items, q, sort]);

  const del = (id: string) => {
    deleteHistory(id);
    setItems(listHistory());
  };

  const exportPdf = (rec: PredictionRecord) => {
    const html = `<!doctype html><html><head><title>Report — ${rec.diseaseName}</title>
      <style>body{font-family:system-ui;padding:40px;color:#0a0a0a;}h1{color:#00C853;}img{max-width:300px;border-radius:12px;}
      .row{margin:8px 0;}.k{color:#666;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;}</style>
      </head><body>
      <h1>MangoGuard AI — Detection Report</h1>
      <img src="${rec.imageDataUrl}" />
      <div class="row"><div class="k">Disease</div><div><strong>${rec.diseaseName}</strong></div></div>
      <div class="row"><div class="k">Confidence</div><div>${rec.confidence.toFixed(2)}%</div></div>
      <div class="row"><div class="k">Severity</div><div>${rec.severity}</div></div>
      <div class="row"><div class="k">Recommended Medicine</div><div>${rec.medicine}</div></div>
      <div class="row"><div class="k">Date</div><div>${new Date(rec.createdAt).toLocaleString()}</div></div>
      <p style="margin-top:24px;font-size:12px;color:#666">Doctor-style summary: ${rec.diseaseName === "Healthy" ? "Leaf is in optimal condition. Maintain current orchard practices." : "Treat with " + rec.medicine + " and monitor recovery weekly."}</p>
      <script>window.print()</script>
      </body></html>`;
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 md:px-10 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
      >
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">History</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            All your past detections, searchable and exportable.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search disease or medicine"
              className="rounded-lg border border-border bg-background/40 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            onClick={() => setSort(sort === "new" ? "old" : "new")}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-white/[0.03] px-3 py-2 text-xs font-medium text-foreground hover:bg-white/[0.06]"
          >
            {sort === "new" ? <ArrowDownAZ className="h-4 w-4" /> : <ArrowUpAZ className="h-4 w-4" />}
            {sort === "new" ? "Newest" : "Oldest"}
          </button>
          <button
            onClick={() => setSort("conf")}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium ${sort === "conf" ? "border-primary/60 bg-primary/10 text-primary" : "border-border bg-white/[0.03] text-foreground hover:bg-white/[0.06]"}`}
          >
            By Confidence
          </button>
        </div>
      </motion.div>

      {filtered.length === 0 ? (
        <div className="glass grid place-items-center rounded-2xl py-20 text-center">
          <div className="font-display text-lg">No predictions yet</div>
          <div className="mt-2 text-sm text-muted-foreground">
            Run a scan from the Detection page to start your history.
          </div>
        </div>
      ) : (
        <div className="glass overflow-hidden rounded-2xl">
          <div className="hidden grid-cols-[80px_1fr_120px_100px_140px_120px_80px] gap-3 border-b border-border/60 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground md:grid">
            <span>Leaf</span>
            <span>Disease</span>
            <span>Confidence</span>
            <span>Severity</span>
            <span>Date</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>
          <ul className="divide-y divide-border/40">
            {filtered.map((r) => (
              <motion.li
                key={r.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-[64px_1fr_auto] items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.03] md:grid-cols-[80px_1fr_120px_100px_140px_120px_80px]"
              >
                <img src={r.imageDataUrl} alt="" className="h-14 w-14 rounded-lg object-cover md:h-16 md:w-16" />
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{r.diseaseName}</div>
                  <div className="truncate text-xs text-muted-foreground">{r.medicine}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground md:hidden">
                    {new Date(r.createdAt).toLocaleDateString()} · {r.confidence.toFixed(1)}% · {r.severity}
                  </div>
                </div>
                <div className="hidden text-sm font-medium text-primary md:block">
                  {r.confidence.toFixed(2)}%
                </div>
                <div className="hidden md:block">
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wider">
                    {r.severity}
                  </span>
                </div>
                <div className="hidden text-xs text-muted-foreground md:block">
                  {new Date(r.createdAt).toLocaleDateString()}
                </div>
                <div className="hidden md:block">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                      r.status === "Healthy"
                        ? "bg-primary/15 text-primary"
                        : r.status === "Treated"
                          ? "bg-accent/15 text-accent"
                          : "bg-destructive/15 text-destructive"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => exportPdf(r)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-primary"
                    aria-label="Export PDF"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => del(r.id)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
