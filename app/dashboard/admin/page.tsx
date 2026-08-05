"use client";

import React from "react";
import Link from "next/link";
import { Button, Card } from "@/components/ui";
import {
  LayoutDashboard,
  ArrowLeft,
  Users,
  Tags,
  ShieldCheck,
} from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50/70 p-4 sm:p-6 max-w-4xl mx-auto flex flex-col gap-6 pb-24">
      {/* HEADER */}
      <div className="flex items-center gap-4 pt-2">
        <Link href="/">
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
              <LayoutDashboard className="w-4 h-4" />
            </div>
            Dashboard Administrator
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-2">
            Kelola platform, verifikasi mitra, & standar harga
          </p>
        </div>
      </div>

      {/* STATS CARDS (GRID 3 KOLOM - DATA TETAP SAMA) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Total Mitra */}
        <div className="group bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-5 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:border-emerald-300/50 transition-all duration-300 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/80 shrink-0">
            <Users className="w-7 h-7 stroke-[2px]" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Total Mitra
            </span>
            <div className="flex items-baseline gap-1.5">
              <p className="text-3xl font-black text-slate-900 font-heading tracking-tight">
                128
              </p>
              <span className="text-sm font-bold text-emerald-600">
                Partner
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Verifikasi Pending */}
        <div className="group bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-5 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:border-teal-300/50 transition-all duration-300 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-200/80 shrink-0">
            <ShieldCheck className="w-7 h-7 stroke-[2px]" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Verifikasi Pending
            </span>
            <div className="flex items-baseline gap-1.5">
              <p className="text-3xl font-black text-slate-900 font-heading tracking-tight">
                5
              </p>
              <span className="text-sm font-bold text-teal-600">Pengajuan</span>
            </div>
          </div>
        </div>

        {/* Card 3: Kategori Harga */}
        <div className="group bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-5 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:border-amber-300/50 transition-all duration-300 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/80 shrink-0">
            <Tags className="w-7 h-7 stroke-[2px]" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Kategori Harga
            </span>
            <div className="flex items-baseline gap-1.5">
              <p className="text-3xl font-black text-slate-900 font-heading tracking-tight">
                10
              </p>
              <span className="text-sm font-bold text-amber-600">Item</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
