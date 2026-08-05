"use client";

import React from "react";
import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { CheckSquare, ArrowLeft, UserCheck, XCircle } from "lucide-react";

export default function VerificationPage() {
  return (
    <main className="min-h-screen bg-slate-50/70 p-4 sm:p-6 max-w-4xl mx-auto flex flex-col gap-6 pb-24">
      {/* HEADER */}
      <div className="flex items-center gap-4 pt-2">
        <Link href="/dashboard/admin">
          <Button
            variant="outline"
            className="p-3 min-w-[48px] min-h-[48px] rounded-xl border-slate-200/80 shadow-sm bg-white/80 backdrop-blur-sm hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-heading flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-md">
              <CheckSquare className="w-4 h-4" />
            </div>
            Verifikasi Mitra Resmi
          </h1>
          <p className="text-sm font-medium text-slate-500 -mt-0.5">
            Pemeriksaan dokumen Pemulung Mitra & Pengepul
          </p>
        </div>
      </div>

      {/* CARD VERIFIKASI */}
      <Card className="flex flex-col gap-5 p-6 sm:p-8 bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 rounded-3xl">
        {/* Bagian Atas: Data Mitra & Status */}
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

          {/* Status Badge (Dibuat manual agar konsisten) */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-extrabold border border-amber-200/80 shrink-0 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Menunggu
          </div>
        </div>

        {/* Bagian Bawah: Tombol Aksi */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <Button
            variant="primary"
            className="w-full sm:w-auto rounded-2xl px-6 py-3 shadow-lg shadow-emerald-500/20"
          >
            <CheckSquare className="w-4.5 h-4.5 mr-2 stroke-[2.5px]" />
            Setujui Verifikasi
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
    </main>
  );
}
