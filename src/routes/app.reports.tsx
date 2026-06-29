import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FileText, Download } from "lucide-react";
import { listHistory, type PredictionRecord } from "@/lib/history";
import { downloadSingleReport, downloadFullReport } from "@/lib/pdf";
import { toast } from "sonner";

export const Route = createFileRoute("/app/reports")({
  ssr: false,
  component: ReportsPage,
});

function ReportsPage() {
  const [items, setItems] = useState<PredictionRecord[]>([]);
  useEffect(() => setItems(listHistory()), []);

  const downloadAll = () => {
    if (!items.length) return;
    try {
      downloadFullReport(items);
      toast.success("Full report downloaded");
    } catch {
      toast.error("Could not generate PDF");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 md:px-10 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
      >
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Reports</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Generate professional PDF summaries of your detection history.
          </p>
        </div>
        <button
          onClick={downloadAll}
          disabled={!items.length}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground glow-primary transition-all hover:opacity-90 disabled:opacity-40"
        >
          <Download className="h-4 w-4" />
          Export full report
        </button>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 ? (
          <div className="glass col-span-full grid place-items-center rounded-2xl py-20 text-center">
            <FileText className="h-8 w-8 text-muted-foreground" />
            <div className="mt-3 font-display text-lg">No reports yet</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Reports appear automatically after every detection.
            </div>
          </div>
        ) : (
          items.map((r) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass overflow-hidden rounded-2xl"
            >
              <img src={r.imageDataUrl} alt="" className="aspect-video w-full object-cover" />
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold">{r.diseaseName}</h3>
                  <span className="text-sm font-semibold text-primary">
                    {r.confidence.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {new Date(r.createdAt).toLocaleString()} · {r.severity}
                </div>
                <button
                  onClick={() => {
                    try {
                      downloadSingleReport(r);
                      toast.success("Report downloaded");
                    } catch {
                      toast.error("Could not generate PDF");
                    }
                  }}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-white/[0.03] py-2 text-xs font-medium text-foreground hover:bg-white/[0.06]"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download PDF
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
