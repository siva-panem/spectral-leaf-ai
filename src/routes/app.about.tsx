import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Brain, Layers, Sparkles, Cpu, LineChart, Network } from "lucide-react";

export const Route = createFileRoute("/app/about")({
  ssr: false,
  component: AboutPage,
});

const PIPELINE = [
  { icon: Layers, title: "Image Capture", desc: "Leaf photo or drone shot from the orchard." },
  { icon: Sparkles, title: "Spectral Indices", desc: "NDVI & NDRE highlight stress before it's visible." },
  { icon: Brain, title: "Feature Extraction", desc: "MobileNetV2 + EfficientNetV2 extract deep features." },
  { icon: Network, title: "PCA Reduction", desc: "Principal Component Analysis compresses the signal." },
  { icon: Cpu, title: "SVC Classifier", desc: "Support Vector Classifier predicts the disease class." },
  { icon: LineChart, title: "Report", desc: "Confidence, severity, medicine and prevention plan." },
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-8 md:px-10 md:py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-primary">
          About the Project
        </div>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-5xl">
          How <span className="text-gradient">MangoGuard AI</span> sees what farmers can't.
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-muted-foreground md:text-base">
          A research-grounded pipeline that combines spectral imaging with modern deep learning
          to flag disease before visible symptoms cost a single mango.
        </p>
      </motion.div>

      {/* Pipeline */}
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PIPELINE.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass relative overflow-hidden rounded-2xl p-6"
            >
              <div className="absolute right-4 top-4 font-display text-5xl font-bold text-primary/10">
                0{i + 1}
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Concepts */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Concept
          title="Spectral Imaging"
          body="Mango leaves reflect light differently as stress sets in. By reading red, red-edge and near-infrared bands, we measure photosynthetic vigor before the human eye can detect anything."
        />
        <Concept
          title="NDVI & NDRE"
          body="NDVI (Normalized Difference Vegetation Index) and NDRE (Red-edge variant) summarise canopy health in a single number. A drop in NDRE often precedes visible symptoms of anthracnose, mildew, or canker."
        />
        <Concept
          title="MobileNetV2 + EfficientNetV2"
          body="Two efficient convolutional networks extract complementary deep features — MobileNetV2 for speed on edge devices, EfficientNetV2 for accuracy on richer inputs."
        />
        <Concept
          title="PCA + SVC"
          body="Principal Component Analysis trims hundreds of features down to the most informative directions, then a Support Vector Classifier produces a calibrated, fast prediction."
        />
      </div>
    </div>
  );
}

function Concept({ title, body }: { title: string; body: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
      <h3 className="font-display text-lg font-semibold text-primary">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </motion.div>
  );
}
