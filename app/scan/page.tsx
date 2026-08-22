"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card } from "@/components/ui";
import {
  ArrowLeft,
  ScanLine,
  Upload,
  Loader2,
  Plus,
  Minus,
  CheckCircle2,
  Cpu,
  Route,
  Store,
  AlertTriangle,
  Info,
  Coins,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Calculator,
  Eye,
  Layers,
  ChevronDown,
  ChevronUp,
  ClipboardList,
} from "lucide-react";

interface PipelineSteps {
  stage1_opencv?: any;
  stage2_gemini?: any;
  stage3_rule_engine?: any;
  stage4_confidence_gate?: any;
}

interface ScanResponseData {
  success: boolean;
  scan_id: string;
  category: {
    id: string;
    name: string;
    unit: string;
    base_price_per_unit: number;
    category_group: string;
  };
  estimated_weight_kg: number;
  estimated_price_per_unit: number;
  estimated_total_price: number;
  confidence: number;
  reasoning: string;
  nlp_recommendation?: string;
  is_electronics: boolean;
  ecoguide_available: boolean;
  fallback_needed?: boolean;
  pipeline_steps?: PipelineSteps;
  available_categories?: Array<{
    id: string;
    name: string;
    unit: string;
    base_price_per_unit: number;
    category_group: string;
  }>;
}

export default function ScanPage() {
  const router = useRouter();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<"upload" | "loading" | "result" | "fallback">("upload");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResponseData | null>(null);
  const [currentWeight, setCurrentWeight] = useState<number>(1.0);
  const [selectedManualCategory, setSelectedManualCategory] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPipelineDetails, setShowPipelineDetails] = useState<boolean>(true);

  // Default category fallback grid items
  const fallbackCategoriesList = scanResult?.available_categories || [
    {
      id: "1",
      name: "Plastik PET (Botol Bening)",
      unit: "kg",
      base_price_per_unit: 4500,
      category_group: "plastik",
    },
    {
      id: "2",
      name: "Kertas Kardus Cokelat",
      unit: "kg",
      base_price_per_unit: 2200,
      category_group: "kertas",
    },
    {
      id: "3",
      name: "Logam Tembaga Super",
      unit: "kg",
      base_price_per_unit: 95000,
      category_group: "logam",
    },
    {
      id: "4",
      name: "Logam Aluminium Kaleng",
      unit: "kg",
      base_price_per_unit: 14000,
      category_group: "logam",
    },
    {
      id: "5",
      name: "Besi Tua / Rongsok",
      unit: "kg",
      base_price_per_unit: 4000,
      category_group: "logam",
    },
    {
      id: "6",
      name: "Elektronik - Laptop Bekas",
      unit: "unit",
      base_price_per_unit: 150000,
      category_group: "elektronik",
    },
    {
      id: "7",
      name: "Elektronik - Smartphone PCB",
      unit: "unit",
      base_price_per_unit: 35000,
      category_group: "elektronik",
    },
    {
      id: "8",
      name: "Minyak Jelantah",
      unit: "kg",
      base_price_per_unit: 7500,
      category_group: "lainnya",
    },
  ];

  // Handle File Upload & Trigger Scan API Multi-Stage Pipeline
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setStep("loading");
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        body: formData,
      });

      const data: ScanResponseData = await res.json();

      if (res.ok && data.success) {
        setScanResult(data);
        setCurrentWeight(data.estimated_weight_kg || 1.0);

        if (data.fallback_needed) {
          setStep("fallback");
        } else {
          setStep("result");
        }
      } else {
        setStep("fallback");
        setErrorMessage(
          data.reasoning || "Belum bisa dikenali otomatis, silakan pilih kategori manual."
        );
      }
    } catch (err) {
      console.error("Scan error:", err);
      setStep("fallback");
      setErrorMessage(
        "Koneksi lambat atau terputus. Silakan pilih kategori secara manual di bawah."
      );
    }
  };

  // Adjust weight with +/- buttons
  const handleAdjustWeight = (delta: number) => {
    setCurrentWeight((prev) => {
      const nextVal = Math.max(0.1, Number((prev + delta).toFixed(1)));
      return nextVal;
    });
  };

  // Calculate current total price with condition grade rules if available
  const activeCategory = selectedManualCategory || scanResult?.category;
  const conditionMultiplier = scanResult?.pipeline_steps?.stage3_rule_engine.condition_multiplier || 1.0;
  const baseUnitPrice = activeCategory?.base_price_per_unit || 0;
  const unitPrice = Math.round(baseUnitPrice * conditionMultiplier);
  const calculatedTotalPrice = Math.round(unitPrice * currentWeight);

  const isElectronicsItem =
    activeCategory?.category_group === "elektronik" ||
    activeCategory?.name.toLowerCase().includes("elektronik") ||
    activeCategory?.name.toLowerCase().includes("laptop") ||
    activeCategory?.name.toLowerCase().includes("smartphone");

  const pipeline = scanResult?.pipeline_steps;
  const gate = pipeline?.stage4_confidence_gate;

  return (
    <main className="min-h-screen bg-slate-50/70 p-3 sm:p-6 pt-3 sm:pt-6 max-w-2xl mx-auto flex flex-col gap-5 sm:gap-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4 pt-2">
        <Link href="/">
          <Button
            variant="outline"
            className="p-2.5 sm:p-3 min-w-[44px] sm:min-w-[80px] min-h-[44px] sm:min-h-[50px] rounded-xl border-slate-200/80 shadow-xs bg-white/80 backdrop-blur-xs flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white flex items-center justify-center shadow-md shrink-0">
              <ScanLine className="w-4 h-4" />
            </div>
            EcoScan AI Pipeline
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
            4-Stage AI Pipeline: OpenCV Quality → Gemini → Rule Engine → Confidence Gate
          </p>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* STEP 1: LAYAR PERTAMA (UPLOAD / CAMERA INPUT)                        */}
      {/* ==================================================================== */}
      {step === "upload" && (
        <Card className="flex flex-col items-center justify-center p-8 sm:p-12 text-center border-2 border-dashed border-teal-500/40 min-h-[450px] gap-8 bg-gradient-to-br from-teal-50/40 via-white to-white shadow-xl shadow-slate-200/50">
          <div className="relative">
            <div className="absolute -inset-6 rounded-full bg-teal-500/15 blur-2xl animate-pulse" />
            <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-2xl shadow-teal-500/30">
              <ScanLine className="w-12 h-12 stroke-[2px]" />
            </div>
          </div>

          <div className="max-w-md flex flex-col gap-3">
            <h2 className="text-2xl font-black text-slate-900 font-heading">
              Pindai Sampah / Rongsok
            </h2>
            <p className="text-base text-slate-600 leading-relaxed font-medium">
              Ambil foto sampah plastik, kertas, logam, atau e-waste untuk diuji oleh 4-Stage AI Pipeline secara otomatis.
            </p>
          </div>

          {/* Hidden inputs for camera capture & gallery pick */}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={cameraInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            type="file"
            accept="image/*"
            ref={galleryInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 w-full max-w-sm">
            <Button
              variant="secondary"
              fullWidth
              className="py-4 text-lg font-bold shadow-xl shadow-teal-500/20 rounded-2xl"
              onClick={() => cameraInputRef.current?.click()}
            >
              <ScanLine className="w-5 h-5 mr-2.5 stroke-[2.5px]" />
              Ambil Foto Langsung
            </Button>

            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              className="min-h-[48px] px-4 py-2 text-base font-semibold text-slate-500 hover:text-teal-600 hover:underline flex items-center justify-center gap-2 transition-colors"
            >
              <Upload className="w-4 h-4" />
              atau pilih dari galeri
            </button>
          </div>
        </Card>
      )}

      {/* ==================================================================== */}
      {/* STEP 2: LAYAR KEDUA (LOADING STATE DEEP PIPELINE)                    */}
      {/* ==================================================================== */}
      {step === "loading" && (
        <Card className="flex flex-col items-center justify-center p-12 text-center min-h-[420px] gap-6 bg-white shadow-xl shadow-slate-200/50 rounded-3xl">
          <div className="relative flex items-center justify-center w-28 h-28">
            <div className="absolute inset-0 rounded-full border-2 border-teal-300/30 animate-ping" />
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-xl shadow-teal-500/25">
              <Loader2 className="w-12 h-12 animate-spin stroke-[2px]" />
            </div>
          </div>

          <div className="flex flex-col gap-3 max-w-sm">
            <h2 className="text-2xl font-black text-slate-900 font-heading">
              Memproses Multi-Stage AI...
            </h2>
            <div className="flex flex-col gap-2 text-left bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2 text-teal-600">
                <CheckCircle2 className="w-4 h-4" /> 1. OpenCV Image Quality Check
              </div>
              <div className="flex items-center gap-2 text-teal-600">
                <CheckCircle2 className="w-4 h-4" /> 2. Gemini Computer Vision & NLP
              </div>
              <div className="flex items-center gap-2 text-teal-600">
                <CheckCircle2 className="w-4 h-4" /> 3. Rule Engine + Price Knowledge Lookup
              </div>
              <div className="flex items-center gap-2 text-amber-600 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" /> 4. Confidence Gate Decision Layer
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* ==================================================================== */}
      {/* STEP 3: LAYAR KETIGA (HASIL DETEKSI PIPELINE & VERIFIKASI)           */}
      {/* ==================================================================== */}
      {(step === "result" || (step === "fallback" && selectedManualCategory)) &&
        activeCategory && (
          <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
            {/* CARD HASIL UTAMA */}
            <Card className="flex flex-col gap-6 p-6 sm:p-8 bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 rounded-3xl">
              {/* Header & Confidence Gate Badge */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-200/60 pb-5">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Hasil Klasifikasi AI Pipeline
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-heading">
                    {activeCategory.name}
                  </h2>
                </div>
                {gate ? (
                  <span
                    className={`px-3.5 py-1.5 text-xs font-extrabold rounded-full border shadow-2xs flex items-center gap-1.5 shrink-0 ${
                      gate.is_final_automatic
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-800 border-amber-300"
                    }`}
                  >
                    {gate.is_final_automatic ? (
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                    )}
                    {gate.confidence_percentage}% Confidence
                  </span>
                ) : (
                  <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-extrabold rounded-full border border-emerald-200 shrink-0 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {scanResult?.confidence || 85}%
                  </span>
                )}
              </div>

              {/* Photo Preview Thumbnail & NLP Recommendation */}
              {previewUrl && (
                <div className="flex items-start gap-4 bg-slate-50/90 p-4 rounded-2xl border border-slate-200/70">
                  <img
                    src={previewUrl}
                    alt="Foto Sampah"
                    className="w-20 h-20 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
                  />
                  <div className="text-sm text-slate-600 leading-relaxed flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 font-extrabold text-slate-900 text-sm">
                      <Sparkles className="w-4 h-4 text-teal-600" />
                      <span>Rekomendasi Penanganan AI</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium bg-white p-2.5 rounded-xl border border-slate-200">
                      {scanResult?.nlp_recommendation || scanResult?.reasoning || "Aman didaur ulang."}
                    </p>
                  </div>
                </div>
              )}

              {/* DECISION GATE BANNER */}
              {gate && (
                <div
                  className={`p-4 rounded-2xl border flex items-start gap-3 ${
                    gate.is_final_automatic
                      ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                      : "bg-amber-50/90 border-amber-300 text-amber-900"
                  }`}
                >
                  {gate.is_final_automatic ? (
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex flex-col gap-1">
                    <span className="font-extrabold text-sm">{gate.badge_text}</span>
                    <p className="text-xs font-medium leading-relaxed">{gate.reason}</p>
                    {!gate.is_final_automatic && (
                      <Link href="/admin/verification" className="mt-1 inline-block">
                        <Button variant="outline" className="text-xs py-1.5 px-3 border-amber-400 bg-white hover:bg-amber-100 text-amber-900">
                          Lihat Antrean Operator EcoPoint →
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* COLLAPSIBLE 4-STAGE PIPELINE DIAGNOSTICS CARD                 */}
              {/* ============================================================== */}
              {pipeline && (
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
                  <button
                    type="button"
                    onClick={() => setShowPipelineDetails(!showPipelineDetails)}
                    className="w-full px-4 py-3 flex items-center justify-between text-xs font-black uppercase text-slate-600 bg-slate-100/80 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-teal-600" />
                      <span>Rincian Diagnostik Pipeline AI (4 Stage)</span>
                    </div>
                    {showPipelineDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {showPipelineDetails && (
                    <div className="p-4 flex flex-col gap-3 text-xs text-slate-700">
                      {/* Stage 1 */}
                      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col gap-1">
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span className="flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5 text-teal-600" /> Stage 1: OpenCV Quality Check
                          </span>
                          <span className={pipeline?.stage1_opencv?.passed ? "text-emerald-600 font-extrabold" : "text-amber-600 font-extrabold"}>
                            {pipeline?.stage1_opencv?.passed ? "PASSED" : "WARNING"}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Pencahayaan: {pipeline?.stage1_opencv?.quality?.brightness?.score ?? pipeline?.stage1_opencv?.luminance?.score ?? 85}/100 ({pipeline?.stage1_opencv?.quality?.brightness?.status ?? pipeline?.stage1_opencv?.luminance?.status ?? "BALANCED"}) | Sharpness: {pipeline?.stage1_opencv?.quality?.blur?.laplacian_variance ?? pipeline?.stage1_opencv?.blur?.sharpnessScore ?? 150} ({pipeline?.stage1_opencv?.quality?.blur?.is_blurry ? "Buram" : "Fokus"})
                        </p>
                      </div>

                      {/* Stage 2 */}
                      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col gap-1">
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-teal-600" /> Stage 2: Gemini Vision & NLP
                          </span>
                          <span className="text-teal-700 font-extrabold">
                            {pipeline?.stage2_gemini?.item_condition ?? pipeline?.stage2_gemini?.condition_grade ?? "Sangat Baik"}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Kondisi: {pipeline?.stage2_gemini?.item_condition ?? pipeline?.stage2_gemini?.condition_grade ?? "Sangat Baik"} | Hazardous: {Array.isArray(pipeline?.stage2_gemini?.hazardous_components) ? (pipeline?.stage2_gemini?.hazardous_components.length > 0 ? pipeline?.stage2_gemini?.hazardous_components.join(", ") : "Nihil") : (pipeline?.stage2_gemini?.hazardous_component ?? "Nihil")}
                        </p>
                      </div>

                      {/* Stage 3 */}
                      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col gap-1">
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span className="flex items-center gap-1.5">
                            <Calculator className="w-3.5 h-3.5 text-teal-600" /> Stage 3: Rule Engine Lookup
                          </span>
                          <span className="text-slate-900 font-bold">
                            Rp {(pipeline?.stage3_rule_engine?.adjusted_unit_price ?? unitPrice).toLocaleString("id-ID")}/{pipeline?.stage3_rule_engine?.matched_category?.unit ?? activeCategory?.unit ?? "kg"}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex flex-col gap-0.5">
                          {(pipeline?.stage3_rule_engine?.price_notes ?? pipeline?.stage3_rule_engine?.breakdown_notes ?? [`Kategori: ${activeCategory?.name}`]).map((note: string, idx: number) => (
                            <span key={idx}>• {note}</span>
                          ))}
                        </div>
                      </div>

                      {/* Stage 4 */}
                      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col gap-1">
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Stage 4: Confidence Gate
                          </span>
                          <span className={`font-extrabold ${pipeline?.stage4_confidence_gate?.decision === "AUTOMATIC_FINAL_PRICE" || gate?.is_final_automatic ? "text-emerald-600" : "text-amber-600"}`}>
                            {pipeline?.stage4_confidence_gate?.decision ?? gate?.decision ?? "AUTOMATIC_FINAL_PRICE"}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {pipeline?.stage4_confidence_gate?.decision_reasons?.join("; ") ?? gate?.reason ?? "Terverifikasi otomatis"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Estimasi Berat dengan Tombol +/- */}
              <div className="flex flex-col gap-4 bg-slate-50/70 p-5 rounded-2xl border border-slate-200/70">
                <div className="flex items-center justify-between">
                  <label className="text-base font-extrabold text-slate-900 font-heading">
                    Estimasi Berat / Kuantitas
                  </label>
                  <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                    Satuan: <span className="text-slate-900">{activeCategory.unit}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 sm:gap-4 pt-1">
                  <button
                    type="button"
                    onClick={() => handleAdjustWeight(-0.5)}
                    className="w-12 h-12 sm:w-14 sm:h-14 bg-white hover:bg-slate-50 text-slate-900 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-center transition-colors hover:border-teal-400 active:scale-95 shrink-0"
                  >
                    <Minus className="w-5 h-5 stroke-[2.5px]" />
                  </button>

                  <div className="flex items-baseline gap-1.5 sm:gap-2 text-center flex-1 justify-center min-w-0">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={currentWeight}
                      onChange={(e) =>
                        setCurrentWeight(Math.max(0.1, parseFloat(e.target.value) || 0.1))
                      }
                      className="w-20 sm:w-28 text-center text-2xl sm:text-3xl font-extrabold text-slate-900 bg-white border border-slate-200 rounded-2xl py-2.5 sm:py-3 focus:ring-4 focus:ring-teal-500/15 focus:outline-hidden font-heading shadow-2xs"
                    />
                    <span className="text-base sm:text-lg font-bold text-slate-500 shrink-0">
                      {activeCategory.unit}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAdjustWeight(0.5)}
                    className="w-12 h-12 sm:w-14 sm:h-14 bg-white hover:bg-slate-50 text-slate-900 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-center transition-colors hover:border-teal-400 active:scale-95 shrink-0"
                  >
                    <Plus className="w-5 h-5 stroke-[2.5px]" />
                  </button>
                </div>
              </div>

              {/* ESTIMASI HARGA TOTAL HASIL RULE ENGINE */}
              <div className="bg-gradient-to-r from-amber-500 to-amber-400 rounded-2xl p-5 sm:p-6 text-slate-900 flex flex-col gap-2 shadow-xl shadow-amber-500/25">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900/80">
                      Estimasi Nilai Hasil Rule Engine
                    </span>
                    <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                      <span className="text-2xl sm:text-4xl font-black tracking-tight font-heading">
                        Rp {calculatedTotalPrice.toLocaleString("id-ID")}
                      </span>
                      <span className="text-[11px] sm:text-xs font-bold text-slate-900 bg-white/40 px-2 py-0.5 sm:py-1 rounded-lg backdrop-blur-xs">
                        @ {unitPrice.toLocaleString("id-ID")}/{activeCategory.unit}
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/30 text-slate-900 flex items-center justify-center backdrop-blur-xs shadow-inner shrink-0">
                    <Coins className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5px]" />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-1 px-1">
                <Info className="w-4 h-4 shrink-0 text-slate-400 mt-1" />
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  Estimasi dihitung oleh Rule Engine berbasis database harga terkini. Penimbangan presisi dilakukan saat penjemputan/drop-off.
                </p>
              </div>
            </Card>

            {/* Special EcoGuide Button if item is Electronics */}
            {isElectronicsItem && (
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white p-5 rounded-2xl shadow-lg shadow-teal-500/25 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 text-white rounded-xl backdrop-blur-md shrink-0">
                    <Cpu className="w-5 h-5 stroke-[2.5px]" />
                  </div>
                  <div>
                    <h3 className="text-base font-black font-heading">
                      Elektronik Bekas Terdeteksi!
                    </h3>
                    <p className="text-xs text-white/90 font-medium">
                      Lihat komponen berharga di dalamnya sebelum dijual.
                    </p>
                  </div>
                </div>
                <Link href="/ecoguide" className="w-full sm:w-auto">
                  <Button
                    variant="accent"
                    className="w-full sm:w-auto text-sm py-3 px-6 text-slate-900 font-black rounded-xl shadow-md"
                  >
                    <ClipboardList className="w-4 h-4 mr-2" />
                    Lihat Panduan
                  </Button>
                </Link>
              </div>
            )}

            {/* TWO MAIN ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                variant="primary"
                fullWidth
                className="py-4 text-lg shadow-xl shadow-emerald-500/25 rounded-2xl"
                onClick={() =>
                  router.push(
                    `/pickup?scan_id=${scanResult?.scan_id || ""}&category=${encodeURIComponent(
                      activeCategory.name
                    )}&weight=${currentWeight}`
                  )
                }
              >
                <Route className="w-5 h-5 mr-2.5" />
                Jemput ke Rumah
              </Button>

              <Button
                variant="outline"
                fullWidth
                className="py-4 text-lg rounded-2xl"
                onClick={() =>
                  router.push(
                    `/pickup?type=drop_off&scan_id=${scanResult?.scan_id || ""}&category=${encodeURIComponent(
                      activeCategory.name
                    )}`
                  )
                }
              >
                <Store className="w-5 h-5 mr-2.5 text-emerald-600" />
                Antar ke EcoPoint
              </Button>
            </div>

            {/* Re-scan or Change Category Action */}
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setStep("fallback")}
                className="text-sm font-bold text-teal-600 hover:underline hover:text-teal-700 transition-colors"
              >
                Kategori tidak sesuai? Pilih Kategori Manual
              </button>
            </div>
          </div>
        )}

      {/* ==================================================================== */}
      {/* STEP 4: FALLBACK MANUAL SELECTION GRID                              */}
      {/* ==================================================================== */}
      {step === "fallback" && !selectedManualCategory && (
        <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
          <Card className="p-6 sm:p-8 bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 rounded-3xl flex flex-col gap-6">
            {errorMessage && (
              <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl text-sm font-semibold text-amber-800 flex items-center gap-3 shadow-2xs">
                <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <h2 className="text-2xl font-black text-slate-900 font-heading">
                Pilih Kategori Secara Manual
              </h2>
              <p className="text-sm text-slate-600 font-medium mt-1.5">
                Pilih jenis sampah atau rongsokan di bawah untuk melanjutkan hitung estimasi harga:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {fallbackCategoriesList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedManualCategory(cat);
                    setStep("result");
                  }}
                  className="p-4 text-left border border-slate-200/80 hover:border-emerald-500 rounded-2xl transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/10 bg-slate-50/50 active:scale-[0.98] flex flex-col gap-2 min-h-[80px] group"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-extrabold text-slate-800 text-base group-hover:text-emerald-700 transition-colors">
                      {cat.name}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-200/60 px-2 py-1 rounded-full group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">
                      {cat.category_group}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span className="font-medium">Estimasi per {cat.unit}</span>
                    <span className="font-extrabold text-emerald-600 text-sm bg-emerald-50 px-2.5 py-1 rounded-full group-hover:bg-emerald-100">
                      Rp {cat.base_price_per_unit.toLocaleString("id-ID")}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => setStep("upload")}
              className="mt-2 py-3.5 rounded-2xl border-slate-200/80 shadow-2xs"
            >
              <ScanLine className="w-4.5 h-4.5 mr-2" />
              Coba Foto Ulang
            </Button>
          </Card>
        </div>
      )}
    </main>
  );
}
