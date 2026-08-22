import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { runEcoScanPipeline, WasteCategoryItem } from "@/lib/pipeline";

// Fallback catalog in case database is not populated yet
const DEFAULT_CATEGORIES: WasteCategoryItem[] = [
  {
    id: "cat-plastik-pet",
    name: "Plastik PET (Botol Bening)",
    unit: "kg",
    base_price_per_unit: 4500,
    category_group: "plastik",
  },
  {
    id: "cat-plastik-hdpe",
    name: "Plastik HDPE (Tutup/Baskom)",
    unit: "kg",
    base_price_per_unit: 3800,
    category_group: "plastik",
  },
  {
    id: "cat-kertas-kardus",
    name: "Kertas Kardus Cokelat",
    unit: "kg",
    base_price_per_unit: 2200,
    category_group: "kertas",
  },
  {
    id: "cat-kertas-hvs",
    name: "Kertas HVS Bekas",
    unit: "kg",
    base_price_per_unit: 2500,
    category_group: "kertas",
  },
  {
    id: "cat-logam-tembaga",
    name: "Logam Tembaga Super",
    unit: "kg",
    base_price_per_unit: 95000,
    category_group: "logam",
  },
  {
    id: "cat-logam-aluminium",
    name: "Logam Aluminium Kaleng",
    unit: "kg",
    base_price_per_unit: 14000,
    category_group: "logam",
  },
  {
    id: "cat-logam-besi",
    name: "Besi Tua / Rongsok",
    unit: "kg",
    base_price_per_unit: 4000,
    category_group: "logam",
  },
  {
    id: "cat-elektronik-laptop",
    name: "Elektronik - Laptop Bekas",
    unit: "unit",
    base_price_per_unit: 150000,
    category_group: "elektronik",
  },
  {
    id: "cat-elektronik-hp",
    name: "Elektronik - Smartphone PCB",
    unit: "unit",
    base_price_per_unit: 35000,
    category_group: "elektronik",
  },
  {
    id: "cat-jelantah",
    name: "Minyak Jelantah",
    unit: "kg",
    base_price_per_unit: 7500,
    category_group: "lainnya",
  },
];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    const userId = (formData.get("user_id") as string) || null;

    if (!file) {
      return NextResponse.json(
        { error: "File gambar tidak ditemukan dalam permintaan" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || "image/jpeg";
    const fileName = file.name || "image.jpg";

    // 1. Ambil daftar kategori dari database Supabase (fallback ke DEFAULT_CATEGORIES jika error)
    let dbCategories = DEFAULT_CATEGORIES;
    try {
      const { data, error } = await supabase.from("waste_categories").select("*");
      if (!error && data && data.length > 0) {
        dbCategories = data;
      }
    } catch {
      // Use default categories catalog
    }

    // 2. Jalankan EcoScan 4-Stage AI Classification Pipeline (Google Gemini 3.6 Flash + OpenCV + Rule Engine + Confidence Gate)
    const apiKey = process.env.GEMINI_API_KEY;
    const pipelineResult = await runEcoScanPipeline(
      buffer,
      mimeType,
      fileName,
      dbCategories,
      apiKey
    );

    const isFallbackNeeded =
      pipelineResult.stage4_confidence_gate.decision === "ECOPOINT_MANUAL_VERIFICATION";

    // 3. Simpan ke scan_results di Supabase jika userId tersedia
    let scanId = pipelineResult.scan_id;
    if (userId) {
      try {
        const { data, error } = await supabase
          .from("scan_results")
          .insert({
            user_id: userId,
            image_url: `data:${mimeType};base64,${buffer.toString("base64").substring(0, 100)}...`,
            detected_category_id: pipelineResult.final_summary.category.id,
            estimated_weight_kg: pipelineResult.final_summary.weight_kg,
            estimated_price: pipelineResult.final_summary.total_price,
            ai_confidence: pipelineResult.final_summary.confidence_pct,
          })
          .select("id")
          .single();

        if (!error && data) {
          scanId = data.id;
        }
      } catch {
        // Ignore DB save errors in local demo mode
      }
    }

    return NextResponse.json({
      success: true,
      scan_id: scanId,
      fallback_needed: isFallbackNeeded,
      category: pipelineResult.final_summary.category,
      estimated_weight_kg: pipelineResult.final_summary.weight_kg,
      estimated_price_per_unit: pipelineResult.final_summary.unit_price,
      estimated_total_price: pipelineResult.final_summary.total_price,
      confidence: pipelineResult.final_summary.confidence_pct,
      reasoning: pipelineResult.stage2_vision_nlp.reasoning,
      nlp_recommendation: pipelineResult.final_summary.recommendation,
      is_electronics: pipelineResult.final_summary.is_electronics,
      ecoguide_available: pipelineResult.final_summary.is_electronics,
      available_categories: dbCategories,

      // Multi-stage pipeline transparency payload
      pipeline_steps: {
        stage1_opencv: pipelineResult.stage1_quality,
        stage2_gemini: pipelineResult.stage2_vision_nlp,
        stage3_rule_engine: pipelineResult.stage3_rule_engine,
        stage4_confidence_gate: pipelineResult.stage4_confidence_gate,
      },
    });
  } catch (error) {
    console.error("Scan API Pipeline Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal memproses pemindaian foto dalam Pipeline AI",
        fallback_needed: true,
        available_categories: DEFAULT_CATEGORIES,
      },
      { status: 500 }
    );
  }
}
