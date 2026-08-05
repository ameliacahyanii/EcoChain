"use client";

import React from "react";
import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { Package, ArrowLeft } from "lucide-react";

export default function InventoryPage() {
  return (
    <main className="min-h-screen bg-slate-50/70 p-4 sm:p-6 max-w-4xl mx-auto flex flex-col gap-6 pb-24">
      {/* HEADER */}
      <div className="flex items-center gap-4 pt-2">
        <Link href="/dashboard/pengepul">
          <Button
            variant="outline"
            className="p-3 min-w-[48px] min-h-[48px] rounded-xl border-slate-200/80 shadow-sm bg-white/80 backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-heading flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-md">
              <Package className="w-4 h-4" />
            </div>
            Inventaris Stok Pengepul
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-2">
            Konsolidasi stok per kategori untuk EcoVault B2B
          </p>
        </div>
      </div>

      {/* CARD STOK */}
      <Card className="flex flex-col gap-4 p-6 sm:p-8 bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 rounded-3xl">
        {/* Card Content */}
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/80 shrink-0">
              <Package className="w-6 h-6 stroke-[2px]" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-slate-900 font-heading">
                Kertas Kardus Cokelat
              </p>
              <p className="text-sm font-medium text-slate-500">
                Gudang Lapak Jaya
              </p>
            </div>
          </div>
          <span className="text-2xl font-black text-emerald-600 font-heading tracking-tight">
            1.250 kg
          </span>
        </div>
      </Card>
    </main>
  );
}
