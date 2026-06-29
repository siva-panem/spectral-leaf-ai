import { jsPDF } from "jspdf";
import type { PredictionRecord } from "./history";

const GREEN = "#00C853";
const DARK = "#0a0a0a";
const MUTED = "#666666";

function addHeader(doc: jsPDF, title: string) {
  doc.setFillColor(5, 11, 8);
  doc.rect(0, 0, 210, 22, "F");
  doc.setTextColor(GREEN);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("MangoGuard AI", 14, 14);
  doc.setTextColor("#ffffff");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(title, 210 - 14, 14, { align: "right" });
}

function addFooter(doc: jsPDF) {
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setTextColor(MUTED);
    doc.setFontSize(8);
    doc.text(
      `Generated ${new Date().toLocaleString()}  ·  Page ${i} / ${pages}`,
      105,
      290,
      { align: "center" },
    );
  }
}

export function downloadSingleReport(rec: PredictionRecord) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  addHeader(doc, "Detection Report");

  doc.setTextColor(DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(rec.diseaseName, 14, 36);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(MUTED);
  doc.text(new Date(rec.createdAt).toLocaleString(), 14, 42);

  // image
  try {
    if (rec.imageDataUrl?.startsWith("data:image")) {
      const fmt = rec.imageDataUrl.includes("png") ? "PNG" : "JPEG";
      doc.addImage(rec.imageDataUrl, fmt, 14, 50, 70, 70, undefined, "FAST");
    }
  } catch {
    /* ignore image errors */
  }

  const rows: [string, string][] = [
    ["Confidence", `${rec.confidence.toFixed(2)}%`],
    ["Severity", rec.severity],
    ["Status", rec.status],
    ["Recommended Medicine", rec.medicine],
  ];

  let y = 54;
  const x = 92;
  doc.setFontSize(9);
  rows.forEach(([k, v]) => {
    doc.setTextColor(MUTED);
    doc.setFont("helvetica", "normal");
    doc.text(k.toUpperCase(), x, y);
    doc.setTextColor(DARK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(String(v), x, y + 6);
    doc.setFontSize(9);
    y += 16;
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(DARK);
  const summary =
    rec.diseaseName === "Healthy"
      ? "Leaf is in optimal condition. Maintain current orchard practices, regular watering, and routine inspection."
      : `Recommended action: apply ${rec.medicine}. Monitor recovery weekly and re-scan affected leaves after 7 days to track progress.`;
  const wrapped = doc.splitTextToSize(summary, 182);
  doc.text(wrapped, 14, 140);

  addFooter(doc);
  doc.save(`mangoguard-${rec.diseaseName.toLowerCase().replace(/\s+/g, "-")}-${rec.id}.pdf`);
}

export function downloadFullReport(items: PredictionRecord[]) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  addHeader(doc, "Full Detection Report");

  doc.setTextColor(DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Detection Summary", 14, 36);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(MUTED);
  doc.text(
    `${items.length} prediction${items.length === 1 ? "" : "s"} · generated ${new Date().toLocaleString()}`,
    14,
    42,
  );

  // table header
  let y = 54;
  doc.setFillColor(240, 245, 240);
  doc.rect(14, y - 5, 182, 8, "F");
  doc.setFontSize(8);
  doc.setTextColor(MUTED);
  doc.setFont("helvetica", "bold");
  doc.text("DATE", 16, y);
  doc.text("DISEASE", 56, y);
  doc.text("CONF.", 116, y);
  doc.text("SEVERITY", 136, y);
  doc.text("MEDICINE", 160, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(DARK);
  doc.setFontSize(9);
  items.forEach((r) => {
    if (y > 280) {
      doc.addPage();
      addHeader(doc, "Full Detection Report");
      y = 36;
    }
    doc.text(new Date(r.createdAt).toLocaleDateString(), 16, y);
    doc.text(r.diseaseName.slice(0, 28), 56, y);
    doc.text(`${r.confidence.toFixed(1)}%`, 116, y);
    doc.text(r.severity, 136, y);
    doc.text(r.medicine.slice(0, 22), 160, y);
    y += 7;
  });

  addFooter(doc);
  doc.save(`mangoguard-full-report-${Date.now()}.pdf`);
}
