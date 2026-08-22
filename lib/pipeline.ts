import { GoogleGenAI } from "@google/genai";
import { checkImageQuality, ImageQualityResult } from "./imageQuality";

export interface WasteCategoryItem {
  id: string;
  name: string;
  unit: string;
  base_price_per_unit: number;
  category_group: string;
}

export interface PipelineStage1Result {
  passed: boolean;
  quality: ImageQualityResult;
}

export interface PipelineStage2Result {
  category_name: string;
  item_condition: "Sangat Baik" | "Kotor / Perlu Dibersihkan" | "Rusak Parah / Kontaminasi";
  hazardous_components: string[];
  recycling_recommendation: string;
  estimated_weight_kg: number;
  confidence: number; // 0.0 to 1.0 scale
  secondary_category_name?: string;
  secondary_confidence?: number;
  reasoning: string;
}

export interface PipelineStage3Result {
  matched_category: WasteCategoryItem;
  base_price_per_unit: number;
  condition_multiplier: number;
  adjusted_unit_price: number;
  total_price: number;
  price_notes: string[];
}

export interface PipelineStage4Result {
  decision: "AUTOMATIC_FINAL_PRICE" | "ECOPOINT_MANUAL_VERIFICATION";
  confidence_score: number;
  category_margin: number;
  quality_passed: boolean;
  decision_reasons: string[];
}

export interface EcoScanPipelineOutput {
  success: boolean;
  scan_id: string;
  stage1_quality: PipelineStage1Result;
  stage2_vision_nlp: PipelineStage2Result;
  stage3_rule_engine: PipelineStage3Result;
  stage4_confidence_gate: PipelineStage4Result;
  final_summary: {
    category: WasteCategoryItem;
    weight_kg: number;
    unit_price: number;
    total_price: number;
    confidence_pct: number;
    decision: "AUTOMATIC_FINAL_PRICE" | "ECOPOINT_MANUAL_VERIFICATION";
    recommendation: string;
    is_electronics: boolean;
  };
}

export async function runEcoScanPipeline(
  imageBuffer: Buffer,
  mimeType: string,
  fileName: string,
  categoriesCatalog: WasteCategoryItem[],
  apiKey?: string
): Promise<EcoScanPipelineOutput> {
  const scanId = `scan-${Date.now()}`;
  const categoryNamesList = categoriesCatalog.map((c) => c.name).join(", ");

  // =========================================================================
  // STAGE 1: OpenCV - Image Quality Check
  // =========================================================================
  const qualityData = checkImageQuality(imageBuffer);
  const stage1: PipelineStage1Result = {
    passed: qualityData.passed,
    quality: qualityData,
  };

  // =========================================================================
  // STAGE 2: Google Gemini API - Computer Vision & NLP
  // =========================================================================
  let stage2: PipelineStage2Result = {
    category_name: "",
    item_condition: "Sangat Baik",
    hazardous_components: [],
    recycling_recommendation: "Aman didaur ulang secara umum.",
    estimated_weight_kg: 1.0,
    confidence: 0.85,
    secondary_category_name: "",
    secondary_confidence: 0.10,
    reasoning: "Analisis visual awal oleh model vision.",
  };

  let geminiSuccess = false;

  if (apiKey && apiKey !== "your_gemini_api_key_here") {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Anda adalah EcoScan AI Classifier Engine untuk sistem daur ulang & penanganan limbah di Indonesia.
Analisis foto berikut dan kategorikan berdasarkan katalog resmi:
[${categoryNamesList}]

Berikan respon HANYA berupa JSON valid tanpa format markdown:
{
  "category_name": "<NAMA_KATEGORI_HARUS_EXACT_SAMA_DENGAN_LIST>",
  "item_condition": "<"Sangat Baik" | "Kotor / Perlu Dibersihkan" | "Rusak Parah / Kontaminasi">",
  "hazardous_components": ["<sebutkan jika ada baterai/merkuri/asam/komponen berbahaya, atau kosongkan [] jika aman>"],
  "recycling_recommendation": "<rekomendasi singkat bahasa alami mis: Aman didaur ulang / Perlu pembongkaran khusus>",
  "estimated_weight_kg": <angka_estimasi_bobot_atau_unit>,
  "confidence": <angka_desimal_0.00_sampai_1.00>,
  "secondary_category_name": "<nama_kategori_kemungkinan_kedua>",
  "secondary_confidence": <angka_desimal_kemungkinan_kedua>,
  "reasoning": "<penjelasan_singkat_apa_yang_dilihat_dalam_bahasa_indonesia>"
}`;

      let responseText = "";
      const modelsToTry = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
      let lastErrorMessage = "";

      for (const modelName of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: [
              {
                role: "user",
                parts: [
                  { inlineData: { mimeType, data: imageBuffer.toString("base64") } },
                  { text: prompt },
                ],
              },
            ],
          });
          responseText = response.text || "";
          if (responseText) break;
        } catch (err: any) {
          lastErrorMessage = err?.message || String(err);
          console.warn(`Gemini model ${modelName} failed:`, lastErrorMessage);
        }
      }

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        stage2 = {
          category_name: parsed.category_name || "",
          item_condition: parsed.item_condition || "Sangat Baik",
          hazardous_components: Array.isArray(parsed.hazardous_components) ? parsed.hazardous_components : [],
          recycling_recommendation: parsed.recycling_recommendation || "Aman didaur ulang.",
          estimated_weight_kg: Number(parsed.estimated_weight_kg) || 1.0,
          confidence: Math.min(1.0, Math.max(0.1, Number(parsed.confidence) || 0.85)),
          secondary_category_name: parsed.secondary_category_name || "",
          secondary_confidence: Number(parsed.secondary_confidence) || 0.10,
          reasoning: parsed.reasoning || "Pengenalan objek otomatis berbasis Gemini Vision & NLP.",
        };
        geminiSuccess = true;
      } else if (lastErrorMessage) {
        (stage2 as any).api_error = lastErrorMessage;
      }
    } catch (geminiError: any) {
      console.error("Gemini API call error in pipeline Stage 2:", geminiError);
      (stage2 as any).api_error = geminiError?.message || String(geminiError);
    }
  }

  // Fallback heuristic if Gemini call failed or key is omitted
  if (!geminiSuccess || !stage2.category_name) {
    const fileNameLower = fileName.toLowerCase();
    let detectedName = categoriesCatalog[0]?.name || "Plastik PET (Botol Bening)";
    let weight = 1.2;
    let confidence = 0.85;
    let haz: string[] = [];
    let rec = "Aman didaur ulang secara umum.";

    if (fileNameLower.includes("laptop") || fileNameLower.includes("pc") || fileNameLower.includes("hp") || fileNameLower.includes("electronic")) {
      detectedName = "Elektronik - Laptop Bekas";
      weight = 1.5;
      confidence = 0.90;
      haz = ["Baterai Lithium-ion", "Sirkuit PCB"];
      rec = "Perlu penanganan e-waste khusus & ekstraksi komponen bernilai (RAM/Tembaga).";
    } else if (fileNameLower.includes("kardus") || fileNameLower.includes("paper") || fileNameLower.includes("karton")) {
      detectedName = "Kertas Kardus Cokelat";
      weight = 2.5;
      confidence = 0.88;
      rec = "Aman didaur ulang. Pastikan dalam kondisi kering.";
    } else if (fileNameLower.includes("tembaga") || fileNameLower.includes("copper") || fileNameLower.includes("kabel")) {
      detectedName = "Logam Tembaga Super";
      weight = 0.8;
      confidence = 0.92;
      rec = "Sangat bernilai tinggi. Kupas isolator luar untuk grade maksimal.";
    } else if (fileNameLower.includes("kaleng") || fileNameLower.includes("aluminium")) {
      detectedName = "Logam Aluminium Kaleng";
      weight = 1.0;
      confidence = 0.86;
      rec = "Aman didaur ulang. Pipihkan untuk menghemat ruang penyimpanan.";
    }

    const isKeyMissing = !apiKey || apiKey === "your_gemini_api_key_here";
    const apiErr = (stage2 as any).api_error;
    let notePrefix = "⚠️ [Demo Mode: GEMINI_API_KEY belum dipasang di .env.local] ";
    if (apiErr) {
      notePrefix = `❌ [Gemini API Error: ${apiErr}] `;
    } else if (!isKeyMissing) {
      notePrefix = "ℹ️ [AI Fallback: Menggunakan Smart Heuristic] ";
    }

    stage2 = {
      category_name: detectedName,
      item_condition: "Sangat Baik",
      hazardous_components: haz,
      recycling_recommendation: rec,
      estimated_weight_kg: weight,
      confidence: confidence,
      secondary_category_name: categoriesCatalog[1]?.name || "",
      secondary_confidence: 0.12,
      reasoning: `${notePrefix}Terdeteksi sebagai ${detectedName} (${weight} kg).`,
    };
  }

  // =========================================================================
  // STAGE 3: Rule Engine + Price Database - Knowledge Lookup
  // =========================================================================
  const matchedCategory =
    categoriesCatalog.find(
      (c) => c.name.toLowerCase().trim() === stage2.category_name.toLowerCase().trim()
    ) ||
    categoriesCatalog.find((c) =>
      stage2.category_name.toLowerCase().includes(c.category_group.toLowerCase())
    ) ||
    categoriesCatalog[0];

  let conditionMultiplier = 1.0;
  const priceNotes: string[] = [`Kategori acuan: ${matchedCategory.name}`];

  if (stage2.item_condition === "Kotor / Perlu Dibersihkan") {
    conditionMultiplier = 0.85;
    priceNotes.push("Potongan 15% untuk biaya pembersihan/pemilahan awal");
  } else if (stage2.item_condition === "Rusak Parah / Kontaminasi") {
    conditionMultiplier = 0.70;
    priceNotes.push("Potongan 30% karena keterbatasan grade daur ulang");
  } else {
    priceNotes.push("Grade A (Sangat Baik / Bersih) - 100% Nilai Acuan Pasar");
  }

  if (stage2.hazardous_components.length > 0) {
    conditionMultiplier *= 0.95;
    priceNotes.push(`Terdeteksi komponen khusus (${stage2.hazardous_components.join(", ")})`);
  }

  const adjustedUnitPrice = Math.round(matchedCategory.base_price_per_unit * conditionMultiplier);
  const totalPrice = Math.round(adjustedUnitPrice * stage2.estimated_weight_kg);

  const stage3: PipelineStage3Result = {
    matched_category: matchedCategory,
    base_price_per_unit: matchedCategory.base_price_per_unit,
    condition_multiplier: Number(conditionMultiplier.toFixed(2)),
    adjusted_unit_price: adjustedUnitPrice,
    total_price: totalPrice,
    price_notes: priceNotes,
  };

  // =========================================================================
  // STAGE 4: Confidence Gate - Decision Layer
  // =========================================================================
  const confidenceScore = stage2.confidence;
  const categoryMargin = Number((confidenceScore - (stage2.secondary_confidence || 0.10)).toFixed(2));
  const qualityPassed = stage1.passed;

  const decisionReasons: string[] = [];
  let decision: "AUTOMATIC_FINAL_PRICE" | "ECOPOINT_MANUAL_VERIFICATION" = "AUTOMATIC_FINAL_PRICE";

  if (confidenceScore < 0.75) {
    decision = "ECOPOINT_MANUAL_VERIFICATION";
    decisionReasons.push(`Skor AI Confidence (${Math.round(confidenceScore * 100)}%) di bawah ambang batas minimum 75%`);
  }
  if (categoryMargin < 0.15) {
    decision = "ECOPOINT_MANUAL_VERIFICATION";
    decisionReasons.push(`Margin perbedaan kategori (${categoryMargin}) terlalu sempit / ambigu`);
  }
  if (!qualityPassed) {
    decision = "ECOPOINT_MANUAL_VERIFICATION";
    decisionReasons.push(`Kualitas foto tidak memenuhi standar (${qualityData.recommendations.join("; ")})`);
  }

  if (decision === "AUTOMATIC_FINAL_PRICE") {
    decisionReasons.push("Confidence ≥ 0.75, Kategori Jelas, dan Kualitas Foto Sangat Baik -> Harga Final Otomatis Diisi.");
  }

  const stage4: PipelineStage4Result = {
    decision,
    confidence_score: confidenceScore,
    category_margin: categoryMargin,
    quality_passed: qualityPassed,
    decision_reasons: decisionReasons,
  };

  const isElectronics =
    matchedCategory.category_group === "elektronik" ||
    matchedCategory.name.toLowerCase().includes("elektronik") ||
    matchedCategory.name.toLowerCase().includes("laptop") ||
    matchedCategory.name.toLowerCase().includes("smartphone");

  return {
    success: true,
    scan_id: scanId,
    stage1_quality: stage1,
    stage2_vision_nlp: stage2,
    stage3_rule_engine: stage3,
    stage4_confidence_gate: stage4,
    final_summary: {
      category: matchedCategory,
      weight_kg: stage2.estimated_weight_kg,
      unit_price: adjustedUnitPrice,
      total_price: totalPrice,
      confidence_pct: Math.round(confidenceScore * 100),
      decision,
      recommendation: stage2.recycling_recommendation,
      is_electronics: isElectronics,
    },
  };
}
