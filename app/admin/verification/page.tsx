"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button, Card } from "@/components/ui";
import {
  CheckSquare,
  ArrowLeft,
  UserCheck,
  XCircle,
  ShieldAlert,
  ScanLine,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function VerificationPage() {
  const [activeTab, setActiveTab] = useState<"partner" | "ai_scans">("ai_scans");
  const [verifiedScans, setVerifiedScans] = useState<string[]>([]);

  const pendingAiScans = [
    {
      id: "scan-1701",
      user: "Ibu Siti (Rumah Tangga)",
      timestamp: "10 Menit yang lalu",
      detected_category: "Plastik PET (Botol Bening)",
      condition_grade: "Grade B (Agak Basah)",
      ai_confidence: 68, // < 75% -> Ragu / Low confidence
      image_quality_issue: "Kecerahan agak gelap (Luminance: 32)",
      estimated_price: 3825,
      weight: 1.0,
      reasoning: "Visual botol plastik bening namun agak terlipat dan sedikit buram.",
    },
    {
      id: "scan-1702",
      user: "Pak Doni (Kantor Swasta)",
      timestamp: "25 Menit yang lalu",
      detected_category: "Logam Tembaga Super",
      condition_grade: "Grade C (Bercampur Kabel)",
      ai_confidence: 62,
      image_quality_issue: "Foto sedikit blur (Sharpness score: 28%)",
      estimated_price: 66500,
      weight: 1.0,
      reasoning: "Terlihat kumparan kawat tembaga bercampur isolator plastik tebal.",
    },
  ];

  const handleApproveScan = (id: string) => {
    setVerifiedScans((prev) => [...prev, id]);
  };

  return (
    <main className="min-h-screen bg-slate-50/70 p-4 sm:p-6 max-w-4xl mx-auto flex flex-col gap-6 pb-24">
      {/* HEADER */}
      <div className="flex items-center gap-4 pt-2">
        <Link href="/dashboard/admin">
          <Button
            variant="outline"
            className="p-3 min-w-[48px] min-h-[48px] rounded-xl border-slate-200/80 shadow-2xs bg-white/80 backdrop-blur-xs hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-heading flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-md">
              <CheckSquare className="w-4 h-4" />
            </div>
            Pusat Verifikasi Operator EcoPoint
          </h1>
          <p className="text-sm font-medium text-slate-500 -mt-0.5">
            Verifikasi manual untuk dokumen mitra & hasil EcoScan AI confidence rendah (&lt;75%)
          </p>
        </div>
      </div>

      {/* TAB SELECTOR */}
      <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xs">
        <button
          onClick={() => setActiveTab("ai_scans")}
          className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === "ai_scans"
              ? "bg-teal-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Antrean EcoScan AI (&lt;75% Conf.)
        </button>
        <button
          onClick={() => setActiveTab("partner")}
          className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === "partner"
              ? "bg-teal-600 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Verifikasi Dokumen Mitra
        </button>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: ANTREAN VERIFIKASI MANUAL ECOSCAN                             */}
      {/* ==================================================================== */}
      {activeTab === "ai_scans" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 font-heading flex items-center gap-2">
              <ScanLine className="w-5 h-5 text-amber-600" />
              Item Hasil EcoScan Memerlukan Review Operator
            </h2>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Threshold Confidence Gate: 75%
            </span>
          </div>

          {pendingAiScans.map((scan) => {
            const isDone = verifiedScans.includes(scan.id);
            return (
              <Card
                key={scan.id}
                className="flex flex-col gap-4 p-6 bg-white border border-slate-200 shadow-lg rounded-3xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 shrink-0 font-black text-xs">
                      {scan.ai_confidence}%
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 font-heading">
                        {scan.detected_category} ({scan.condition_grade})
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Pengirim: {scan.user} • {scan.timestamp}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full border shrink-0 ${
                      isDone
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-800 border-amber-300"
                    }`}
                  >
                    {isDone ? "Terverifikasi Operator" : "Menunggu Verifikasi"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <div>
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                      Catatan Kualitas Stage 1:
                    </span>
                    <p className="font-semibold text-amber-800 mt-0.5 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      {scan.image_quality_issue}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                      Estimasi Nilai AI Rule Engine:
                    </span>
                    <p className="font-black text-emerald-700 text-sm mt-0.5">
                      Rp {scan.estimated_price.toLocaleString("id-ID")} (@ {scan.weight} kg)
                    </p>
                  </div>

                  <div className="sm:col-span-2 pt-1 border-t border-slate-200/60">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                      Alasan Ragu Gemini Stage 2:
                    </span>
                    <p className="text-slate-700 font-medium mt-0.5">{scan.reasoning}</p>
                  </div>
                </div>

                {/* Tombol Aksi Verifikasi Operator */}
                {!isDone ? (
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                    <Button
                      variant="primary"
                      onClick={() => handleApproveScan(scan.id)}
                      className="w-full sm:w-auto rounded-2xl px-5 py-2.5 shadow-md shadow-emerald-500/20 text-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Setujui Harga & Kategori Ini
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto rounded-2xl px-5 py-2.5 border-slate-200 text-sm"
                    >
                      Koreksi Kategori Manual
                    </Button>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Sudah disetujui oleh Operator EcoPoint. Harga disahkan ke transaksi.</span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: VERIFIKASI MITRA DOKUMEN                                     */}
      {/* ==================================================================== */}
      {activeTab === "partner" && (
        <Card className="flex flex-col gap-5 p-6 sm:p-8 bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 rounded-3xl">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200/60 pb-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/80 shrink-0">
                <UserCheck className="w-6 h-6 stroke-[2px]" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xl font-extrabold text-slate-900 font-heading">
                  Pak Budi — Pemulung EcoRoute
                </p>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 font-medium">
                  <span className="bg-slate-100 px-2.5 py-0.5 rounded-full text-xs font-bold text-slate-700">
                    KTP: 3171000000000000
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  <span>Area Cilandak</span>
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-extrabold border border-amber-200/80 shrink-0 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Menunggu Review Dokumen
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
            <Button
              variant="primary"
              className="w-full sm:w-auto rounded-2xl px-6 py-3 shadow-lg shadow-emerald-500/20"
            >
              <CheckSquare className="w-4.5 h-4.5 mr-2 stroke-[2.5px]" />
              Setujui Verifikasi Mitra
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto rounded-2xl px-6 py-3 border-slate-200/80 hover:border-red-300 hover:text-red-600 transition-colors"
            >
              <XCircle className="w-4.5 h-4.5 mr-2 stroke-[2px]" />
              Tolak
            </Button>
          </div>
        </Card>
      )}
    </main>
  );
}
