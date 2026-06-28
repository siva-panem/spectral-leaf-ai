export type Severity = "Healthy" | "Low" | "Medium" | "High" | "Critical";

export interface Disease {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  symptoms: string[];
  causes: string[];
  earlySigns: string[];
  advancedSigns: string[];
  spread: string;
  riskLevel: Severity;
  climate: string;
  recoveryTime: string;
  prevention: string[];
  medicine: {
    name: string;
    type: string;
    dosage: string;
    sprayMethod: string;
    safetyTips: string[];
    interval: string;
    recovery: string;
  };
  suggestions: string[];
  color: string; // hex-ish for chart usage
}

export const DISEASES: Disease[] = [
  {
    slug: "healthy",
    name: "Healthy",
    shortDescription: "No disease detected. Leaf shows optimal chlorophyll signature.",
    description:
      "The leaf displays uniform pigmentation, healthy vein structure, and a strong NDVI signal indicating a vigorous photosynthetic state.",
    symptoms: ["Uniform deep-green color", "Intact leaf margins", "Strong NDVI / NDRE signal"],
    causes: ["Balanced nutrition", "Adequate irrigation", "Good orchard hygiene"],
    earlySigns: ["No anomalies"],
    advancedSigns: ["No anomalies"],
    spread: "None",
    riskLevel: "Healthy",
    climate: "All",
    recoveryTime: "—",
    prevention: [
      "Monitor canopy weekly",
      "Maintain balanced NPK fertilization",
      "Keep airflow between trees",
    ],
    medicine: {
      name: "Not required",
      type: "—",
      dosage: "—",
      sprayMethod: "—",
      safetyTips: ["Continue routine inspection"],
      interval: "—",
      recovery: "—",
    },
    suggestions: ["Continue current orchard practices", "Run a scan every 7 days"],
    color: "#00C853",
  },
  {
    slug: "anthracnose",
    name: "Anthracnose",
    shortDescription: "Fungal disease causing dark sunken lesions on leaves, flowers, and fruit.",
    description:
      "Caused by Colletotrichum gloeosporioides, anthracnose is the most economically damaging mango disease worldwide, thriving in warm humid conditions.",
    symptoms: ["Dark brown to black spots", "Sunken lesions", "Leaf tip dieback", "Fruit rot"],
    causes: ["Fungal spores spread by rain splash", "High humidity (>80%)", "Dense canopy"],
    earlySigns: ["Tiny dark flecks on young leaves", "Reduced NDRE values"],
    advancedSigns: ["Coalescing necrotic patches", "Premature leaf drop", "Black fruit lesions"],
    spread: "Rapid in wet weather, via wind-blown spores",
    riskLevel: "High",
    climate: "Warm, humid, 25–30°C",
    recoveryTime: "3–6 weeks with treatment",
    prevention: [
      "Prune for airflow",
      "Remove fallen infected leaves",
      "Avoid overhead irrigation",
      "Apply preventive copper sprays pre-monsoon",
    ],
    medicine: {
      name: "Copper Oxychloride 50% WP",
      type: "Protective fungicide",
      dosage: "3 g per litre of water",
      sprayMethod: "Foliar spray covering both leaf surfaces",
      safetyTips: ["Wear gloves and mask", "Do not spray near harvest", "Avoid windy conditions"],
      interval: "Every 10–14 days during humid season",
      recovery: "Visible improvement within 3 weeks",
    },
    suggestions: [
      "Treat within 48 hours for highest recovery rate",
      "Inspect adjacent trees immediately",
      "Avoid excessive irrigation",
    ],
    color: "#B71C1C",
  },
  {
    slug: "bacterial-canker",
    name: "Bacterial Canker",
    shortDescription: "Bacterial infection causing water-soaked lesions and gum exudation.",
    description:
      "Caused by Xanthomonas campestris pv. mangiferaeindicae, bacterial canker enters through wounds and stomata, producing characteristic black cankers.",
    symptoms: ["Water-soaked lesions", "Black angular spots", "Gum exudation", "Twig dieback"],
    causes: ["Bacterial entry via wounds", "Insect vectors", "Storm-damaged tissue"],
    earlySigns: ["Translucent spots when held to light"],
    advancedSigns: ["Cankered bark", "Stem cracking"],
    spread: "Moderate; via rain splash and pruning tools",
    riskLevel: "High",
    climate: "Tropical, high rainfall",
    recoveryTime: "4–8 weeks",
    prevention: [
      "Sterilise pruning tools between trees",
      "Avoid mechanical injury",
      "Windbreaks to reduce storm wounds",
    ],
    medicine: {
      name: "Streptocycline + Copper Oxychloride",
      type: "Bactericide combination",
      dosage: "Streptocycline 0.1 g/L + Copper 3 g/L",
      sprayMethod: "Thorough foliar and bark spray",
      safetyTips: ["Use fresh solution", "Avoid mixing with other chemicals"],
      interval: "Every 15 days, 2–3 sprays",
      recovery: "4–6 weeks",
    },
    suggestions: [
      "Disinfect tools after each tree",
      "Remove and burn severely cankered branches",
    ],
    color: "#D84315",
  },
  {
    slug: "cutting-weevil",
    name: "Cutting Weevil",
    shortDescription: "Insect pest that severs young shoots, causing wilt and dieback.",
    description:
      "Deporaus marginatus adults cut tender shoots and lay eggs in leaf rolls. Infestations devastate new flush growth.",
    symptoms: ["Cut and wilting shoots", "Rolled leaves", "Larval tunnels"],
    causes: ["Weevil oviposition on tender flush"],
    earlySigns: ["Small notches on young leaves"],
    advancedSigns: ["Heavy shoot fall", "Sparse canopy"],
    spread: "Local; adult flight between trees",
    riskLevel: "Medium",
    climate: "Warm tropical pre-monsoon",
    recoveryTime: "2–4 weeks after control",
    prevention: [
      "Collect and destroy fallen leaves",
      "Light traps at dusk",
      "Inspect new flush weekly",
    ],
    medicine: {
      name: "Lambda-cyhalothrin 5% EC",
      type: "Contact insecticide",
      dosage: "1 ml per litre",
      sprayMethod: "Foliar spray on new flush",
      safetyTips: ["Wear PPE", "Re-entry interval 24 h"],
      interval: "Two sprays at 14-day interval during flushing",
      recovery: "Damage halts within a week",
    },
    suggestions: ["Monitor every 3 days during flushing", "Time sprays with new flush emergence"],
    color: "#EF6C00",
  },
  {
    slug: "die-back",
    name: "Die Back",
    shortDescription: "Progressive death of twigs from tip downward.",
    description:
      "Caused by Lasiodiplodia theobromae, die back kills shoots from the apex inward, eventually involving major branches.",
    symptoms: ["Brown tip browning", "Dry twigs", "Internal vascular discoloration"],
    causes: ["Fungal invasion through wounds", "Drought stress"],
    earlySigns: ["Slight leaf yellowing at tips"],
    advancedSigns: ["Whole-branch death"],
    spread: "Slow but cumulative",
    riskLevel: "Medium",
    climate: "Hot dry summers following monsoon",
    recoveryTime: "6–10 weeks",
    prevention: [
      "Prune 8 cm below affected tissue",
      "Seal cuts with Bordeaux paste",
      "Maintain tree vigor",
    ],
    medicine: {
      name: "Carbendazim 50% WP",
      type: "Systemic fungicide",
      dosage: "1 g per litre",
      sprayMethod: "Spray on cut surfaces and canopy",
      safetyTips: ["Avoid skin contact", "Do not use during flowering"],
      interval: "2 sprays at 21-day interval",
      recovery: "6–8 weeks",
    },
    suggestions: [
      "Inspect after pruning wounds heal",
      "Improve irrigation in dry spells",
    ],
    color: "#6D4C41",
  },
  {
    slug: "powdery-mildew",
    name: "Powdery Mildew",
    shortDescription: "White powdery fungal growth on leaves and inflorescence.",
    description:
      "Oidium mangiferae produces a chalky white coating that disrupts flowering and fruit set, especially in cool dry weather.",
    symptoms: ["White powder on leaves", "Distorted inflorescence", "Flower drop"],
    causes: ["Cool nights and dry days", "Overcrowded canopy"],
    earlySigns: ["Fine white dust on flush"],
    advancedSigns: ["Necrotic flowers", "Failed fruit set"],
    spread: "Very fast; wind-dispersed conidia",
    riskLevel: "High",
    climate: "Cool 20–25°C with low humidity",
    recoveryTime: "2–4 weeks",
    prevention: [
      "Open up canopy",
      "Apply sulphur dust pre-flowering",
      "Avoid excess nitrogen",
    ],
    medicine: {
      name: "Wettable Sulphur 80% WP",
      type: "Contact fungicide",
      dosage: "2 g per litre",
      sprayMethod: "Light even foliar spray",
      safetyTips: ["Do not spray above 32°C", "Wear mask"],
      interval: "Every 10 days, 2–3 applications",
      recovery: "Symptoms recede within 2 weeks",
    },
    suggestions: ["Spray early morning", "Avoid sulphur near oil sprays"],
    color: "#9E9E9E",
  },
  {
    slug: "sooty-mould",
    name: "Sooty Mould",
    shortDescription: "Black fungal coat growing on honeydew secreted by pests.",
    description:
      "Capnodium spp. colonise honeydew left by hoppers and scales, forming a black film that blocks photosynthesis.",
    symptoms: ["Black sooty coating", "Reduced vigor", "Sticky leaves"],
    causes: ["Hopper or scale infestation", "Honeydew accumulation"],
    earlySigns: ["Sticky leaf surface"],
    advancedSigns: ["Thick black coat", "Reduced fruit yield"],
    spread: "Tracks pest population",
    riskLevel: "Low",
    climate: "Hopper-prone humid weather",
    recoveryTime: "2 weeks after pest control",
    prevention: [
      "Control hoppers and scales",
      "Spray water + soap to wash sooty film",
      "Encourage natural predators",
    ],
    medicine: {
      name: "Imidacloprid 17.8% SL + starch wash",
      type: "Systemic insecticide",
      dosage: "0.3 ml per litre",
      sprayMethod: "Spray on pest population, then rinse canopy",
      safetyTips: ["Avoid spraying during flowering peak", "Protect pollinators"],
      interval: "One spray; repeat after 21 days if needed",
      recovery: "Sooty mould flakes away naturally",
    },
    suggestions: ["Target the underlying pest first", "Monitor every 7 days"],
    color: "#212121",
  },
  {
    slug: "gall-midge",
    name: "Gall Midge",
    shortDescription: "Tiny fly larvae forming galls on leaves and inflorescence.",
    description:
      "Procontarinia spp. larvae feed inside leaf tissue producing characteristic galls that reduce photosynthesis and damage flowering panicles.",
    symptoms: ["Pinhead galls", "Wart-like swellings", "Distorted flowering"],
    causes: ["Adult midge oviposition on tender tissue"],
    earlySigns: ["Tiny chlorotic spots"],
    advancedSigns: ["Necrotic galls", "Premature leaf drop"],
    spread: "Multiple overlapping generations per season",
    riskLevel: "Medium",
    climate: "Warm humid coastal climates",
    recoveryTime: "3–5 weeks",
    prevention: [
      "Plough basin soil to expose pupae",
      "Remove and burn galled leaves",
      "Encourage parasitoid wasps",
    ],
    medicine: {
      name: "Dimethoate 30% EC",
      type: "Systemic insecticide",
      dosage: "1.5 ml per litre",
      sprayMethod: "Spray on new flush before gall formation",
      safetyTips: ["Avoid harvest within 21 days", "Use PPE"],
      interval: "Two sprays at 14-day interval",
      recovery: "3–4 weeks",
    },
    suggestions: ["Target the early flush stage", "Combine with soil cultivation"],
    color: "#7B1FA2",
  },
];

export const getDisease = (slug: string) => DISEASES.find((d) => d.slug === slug);

export function pickMockDetection(): { disease: Disease; confidence: number; severity: Severity } {
  // Skew toward variety but include healthy
  const non = DISEASES.filter((d) => d.slug !== "healthy");
  const roll = Math.random();
  const disease = roll < 0.25 ? DISEASES[0] : non[Math.floor(Math.random() * non.length)];
  const confidence = Math.round((92 + Math.random() * 7.9) * 100) / 100;
  const sevOrder: Severity[] = ["Healthy", "Low", "Medium", "High", "Critical"];
  const severity: Severity =
    disease.slug === "healthy"
      ? "Healthy"
      : sevOrder[1 + Math.floor(Math.random() * 4)];
  return { disease, confidence, severity };
}
