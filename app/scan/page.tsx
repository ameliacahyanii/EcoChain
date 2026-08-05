"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card } from "@/components/ui";
import {
  /* Ikon Final (Sudah dipastikan tersedia di lucide-react) */
  ArrowLeft,
  ScanLine, // Menggantikan ScanFace & Viewfinder (Header & Tombol Scan)
  Upload, // Tetap sama
  Loader2, // Menggantikan Orbit (Loading)
  Plus,
  Minus,
  CheckCircle2,
  Cpu, // Menggantikan Microchip (Panduan Elektronik)
  Route, // Menggantikan Truck (Jemput)
  Store, // Menggantikan MapPin (Antar ke EcoPoint)
  AlertTriangle,
  Info,
  Coins, // Menggantikan DollarSign (Harga)
  Package, // Tetap sama
  ClipboardList,
} from "lucide-react";

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
  is_electronics: boolean;
  ecoguide_available: boolean;
  fallback_needed?: boolean;
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

  const [step, setStep] = useState<
    "upload" | "loading" | "result" | "fallback"
  >("upload");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResponseData | null>(null);
  const [currentWeight, setCurrentWeight] = useState<number>(1.0);
  const [selectedManualCategory, setSelectedManualCategory] =
    useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  // Handle File Upload & Trigger Scan API
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
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
          data.reasoning ||
            "Belum bisa dikenali otomatis, silakan pilih kategori manual.",
        );
      }
    } catch (err) {
      console.error("Scan error:", err);
      setStep("fallback");
      setErrorMessage(
        "Koneksi lambat atau terputus. Silakan pilih kategori secara manual di bawah.",
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

  // Calculate current total price
  const activeCategory = selectedManualCategory || scanResult?.category;
  const unitPrice = activeCategory?.base_price_per_unit || 0;
  const calculatedTotalPrice = Math.round(unitPrice * currentWeight);

  const isElectronicsItem =
    activeCategory?.category_group === "elektronik" ||
    activeCategory?.name.toLowerCase().includes("elektronik") ||
    activeCategory?.name.toLowerCase().includes("laptop") ||
    activeCategory?.name.toLowerCase().includes("smartphone");

  return (
    <main className="min-h-screen bg-slate-50/70 p-4 sm:p-6 max-w-2xl mx-auto flex flex-col gap-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 pt-2">
        <Link href="/">
          <Button
            variant="outline"
            className="p-3 min-w-[80px] min-h-[50px] rounded-xl border-slate-200/80 shadow-sm bg-white/80 backdrop-blur-sm"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-heading flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white flex items-center justify-center shadow-md">
              <ScanLine className="w-4 h-4" />
            </div>
            EcoScan AI
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-2">
            Pindai foto sampah & cek estimasi harga pasar
          </p>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* STEP 1: LAYAR PERTAMA (UPLOAD / CAMERA INPUT)                        */}
      {/* ==================================================================== */}
      {step === "upload" && (
        <Card className="flex flex-col items-center justify-center p-10 sm:p-14 text-center border-2 border-dashed border-teal-500/40 min-h-[450px] gap-8 bg-gradient-to-br from-teal-50/40 via-white to-white shadow-xl shadow-slate-200/50">
          <div className="relative">
            <div className="absolute -inset-6 rounded-full bg-teal-500/15 blur-2xl animate-pulse" />
            <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-2xl shadow-teal-500/30">
              {/* Gunakan ScanLine untuk tombol utama juga */}
              <ScanLine className="w-12 h-12 stroke-[2px]" />
            </div>
          </div>

          <div className="max-w-md flex flex-col gap-3">
            <h2 className="text-2xl font-black text-slate-900 font-heading">
              Ambil Foto Barang
            </h2>
            <p className="text-base text-slate-600 leading-relaxed font-medium">
              Arahkan kamera ke sampah plastik, kertas, logam, atau elektronik
              bekas Anda.
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

          {/* Large Camera Trigger Button */}
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
      {/* STEP 2: LAYAR KEDUA (LOADING STATE)                                 */}
      {/* ==================================================================== */}
      {step === "loading" && (
        <Card className="flex flex-col items-center justify-center p-14 text-center min-h-[400px] gap-6 bg-white shadow-xl shadow-slate-200/50 rounded-3xl">
          <div className="relative flex items-center justify-center w-28 h-28">
            <div className="absolute inset-0 rounded-full border-2 border-teal-300/30 animate-ping" />
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-xl shadow-teal-500/25">
              {/* Gunakan Loader2 */}
              <Loader2 className="w-12 h-12 animate-spin stroke-[2px]" />
            </div>
          </div>

          <div className="flex flex-col gap-2 max-w-sm">
            <h2 className="text-2xl font-black text-slate-900 font-heading">
              Menganalisis Gambar...
            </h2>
            <p className="text-base text-slate-600 font-medium leading-relaxed">
              EcoScan AI sedang mengidentifikasi jenis barang dan estimasi
              harganya
            </p>
          </div>
        </Card>
      )}

      {/* ==================================================================== */}
      {/* STEP 3: LAYAR KETIGA (HASIL DETEKSI & OPSI LANJUTAN)                 */}
      {/* ==================================================================== */}
      {(step === "result" || (step === "fallback" && selectedManualCategory)) &&
        activeCategory && (
          <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
            <Card className="flex flex-col gap-6 p-6 sm:p-8 bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 rounded-3xl">
              {/* Header & Confidence Badge */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-200/60 pb-5">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Kategori Terdeteksi
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-heading">
                    {activeCategory.name}
                  </h2>
                </div>
                <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-extrabold rounded-full border border-emerald-200/80 shrink-0 shadow-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {scanResult?.confidence || 85}%
                </span>
              </div>

              {/* Photo Preview Thumbnail & Reasoning */}
              {previewUrl && (
                <div className="flex items-start sm:items-center gap-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60">
                  <img
                    src={previewUrl}
                    alt="Foto Sampah"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0"
                  />
                  <div className="text-sm text-slate-600 leading-relaxed">
                    <p className="font-extrabold text-slate-800 text-sm">
                      Hasil Analisis AI
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      {scanResult?.reasoning ||
                        "Identifikasi otomatis berdasarkan visual."}
                    </p>
                  </div>
                </div>
              )}

              {/* Estimasi Berat dengan Tombol Besar +/- */}
              <div className="flex flex-col gap-4 bg-slate-50/70 p-5 rounded-2xl border border-slate-200/70">
                <div className="flex items-center justify-between">
                  <label className="text-base font-extrabold text-slate-900 font-heading">
                    Estimasi Berat
                  </label>
                  <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                    Satuan:{" "}
                    <span className="text-slate-900">
                      {activeCategory.unit}
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 pt-1">
                  <button
                    type="button"
                    onClick={() => handleAdjustWeight(-0.5)}
                    className="w-14 h-14 bg-white hover:bg-slate-50 text-slate-900 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-center transition-colors hover:border-teal-400 active:scale-95"
                  >
                    <Minus className="w-5 h-5 stroke-[2.5px]" />
                  </button>

                  <div className="flex items-baseline gap-2 text-center flex-1 justify-center">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={currentWeight}
                      onChange={(e) =>
                        setCurrentWeight(
                          Math.max(0.1, parseFloat(e.target.value) || 0.1),
                        )
                      }
                      className="w-28 text-center text-3xl font-extrabold text-slate-900 bg-white border border-slate-200 rounded-2xl py-3 focus:ring-4 focus:ring-teal-500/15 focus:outline-none font-heading shadow-sm"
                    />
                    <span className="text-lg font-bold text-slate-500">
                      {activeCategory.unit}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAdjustWeight(0.5)}
                    className="w-14 h-14 bg-white hover:bg-slate-50 text-slate-900 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-center transition-colors hover:border-teal-400 active:scale-95"
                  >
                    <Plus className="w-5 h-5 stroke-[2.5px]" />
                  </button>
                </div>
              </div>

              {/* ESTIMASI HARGA TOTAL */}
              <div className="bg-gradient-to-r from-amber-500 to-amber-400 rounded-2xl p-6 text-slate-900 flex flex-col gap-2 shadow-xl shadow-amber-500/25">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900/80">
                      Estimasi Total Nilai
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-black tracking-tight font-heading">
                        Rp {calculatedTotalPrice.toLocaleString("id-ID")}
                      </span>
                      <span className="text-xs font-bold text-slate-900 bg-white/40 px-2 py-1 rounded-lg backdrop-blur-sm">
                        @ {unitPrice.toLocaleString("id-ID")}/
                        {activeCategory.unit}
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white/30 text-slate-900 flex items-center justify-center backdrop-blur-sm shadow-inner shrink-0">
                    <Coins className="w-6 h-6 stroke-[2.5px]" />
                  </div>
                </div>
              </div>

              {/* Catatan Kecil */}
              <div className="flex items-start gap-3 pt-1 px-1">
                <Info className="w-4 h-4 shrink-0 text-slate-400 mt-1" />
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  Estimasi berdasarkan harga pasar terkini. Harga final
                  ditentukan saat penimbangan langsung di lokasi.
                </p>
              </div>
            </Card>

            {/* Special EcoGuide Button if item is Electronics */}
            {isElectronicsItem && (
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white p-5 rounded-2xl shadow-lg shadow-teal-500/25 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 text-white rounded-xl backdrop-blur-md shrink-0">
                    {/* Gunakan Cpu */}
                    <Cpu className="w-5 h-5 stroke-[2.5px]" />
                  </div>
                  <div>
                    <h3 className="text-base font-black font-heading">
                      Elektronik Bekas Terdeteksi!
                    </h3>
                    <p className="text-xs text-white/90 font-medium">
                      Ketahui komponen berharga di dalamnya sebelum dijual.
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
                      activeCategory.name,
                    )}&weight=${currentWeight}`,
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
                      activeCategory.name,
                    )}`,
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
            {/* Alert Error Message */}
            {errorMessage && (
              <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl text-sm font-semibold text-amber-800 flex items-center gap-3 shadow-sm">
                <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <h2 className="text-2xl font-black text-slate-900 font-heading">
                Pilih Kategori Secara Manual
              </h2>
              <p className="text-sm text-slate-600 font-medium mt-1.5">
                Pilih jenis sampah atau rongsokan di bawah untuk melanjutkan
                hitung estimasi harga:
              </p>
            </div>

            {/* Grid options - Premium & Modern */}
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
              className="mt-2 py-3.5 rounded-2xl border-slate-200/80 shadow-sm"
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
