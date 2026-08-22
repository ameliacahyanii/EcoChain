"use client";

import React from "react";
import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { Tags, ArrowLeft, Plus, Edit, Trash } from "lucide-react";

export default function AdminCategoriesPage() {
  return (
    <main className="min-h-screen bg-slate-50/70 p-4 sm:p-6 max-w-5xl mx-auto flex flex-col gap-6 pb-24">
      {/* HEADER & TOMBOL TAMBAH */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                <Tags className="w-4 h-4" />
              </div>
              Kelola Kategori & Harga Acuan
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-2">
              Update standar harga pasar untuk EcoScan AI
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          className="w-full sm:w-auto rounded-2xl px-6 py-3 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4 mr-2 stroke-[2.5px]" />
          Kategori Baru
        </Button>
      </div>

      {/* TABEL / KARTU KATEGORI */}
      <Card className="p-6 sm:p-8 bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
        {/* Header Tabel (Desktop) */}
        <div className="hidden sm:grid grid-cols-12 gap-4 border-b border-slate-200/60 pb-3 mb-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
          <div className="col-span-5">Nama Kategori</div>
          <div className="col-span-3">Grup</div>
          <div className="col-span-3">Harga Acuan / kg</div>
          <div className="col-span-1 text-right">Aksi</div>
        </div>

        {/* List Item Kategori */}
        <div className="flex flex-col gap-2">
          <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 rounded-2xl border border-slate-100 hover:border-emerald-200/80 hover:shadow-md transition-all duration-200 bg-white/50">
            {/* Kiri: Nama & Grup */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1">
              <div className="flex flex-col sm:flex-1 min-w-0">
                <p className="font-extrabold text-slate-900 text-base sm:text-lg truncate">
                  Plastik PET (Botol Bening)
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-extrabold bg-teal-50 text-teal-700 border border-teal-200/80 uppercase tracking-wide">
                  plastik
                </span>
              </div>
            </div>

            {/* Kanan: Harga & Aksi */}
            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
              <span className="text-lg sm:text-xl font-black text-emerald-600 font-heading tracking-tight">
                Rp 4.500 / kg
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 transition-colors border border-slate-200/60 hover:border-emerald-200/80"
                  aria-label="Edit kategori"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  className="p-2 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors border border-slate-200/60 hover:border-red-200/80"
                  aria-label="Hapus kategori"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Tabel (Opsional: Total Kategori) */}
        <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
          <span className="font-bold">
            Total: <span className="text-slate-900">1 Kategori</span>
          </span>
          <span className="text-slate-400">Terakhir diperbarui: Hari ini</span>
        </div>
      </Card>
    </main>
  );
}
