"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button, Card } from "@/components/ui";
import {
  History,
  ArrowLeft,
  Package,
  Recycle,
  Box,
  CheckCircle2,
  Clock,
  Filter,
  Search,
} from "lucide-react";

// Data mock-up transaksi
const mockTransactions = [
  {
    id: 1,
    category: "Plastik PET",
    categoryIcon: Recycle,
    categoryColor: "text-teal-600 bg-teal-50",
    location: "EcoPoint Cilandak",
    date: "31 Juli 2026",
    weight: "12.5 kg",
    totalPrice: 56250,
    status: "Selesai",
    items: "Botol Plastik, Karton",
  },
  {
    id: 2,
    category: "Kertas Kardus",
    categoryIcon: Box,
    categoryColor: "text-amber-600 bg-amber-50",
    location: "EcoPoint Kebayoran",
    date: "29 Juli 2026",
    weight: "8.2 kg",
    totalPrice: 18040,
    status: "Selesai",
    items: "Kardus Bekas, Kertas HVS",
  },
  {
    id: 3,
    category: "Logam Tembaga",
    categoryIcon: Package,
    categoryColor: "text-red-600 bg-red-50",
    location: "Penjemputan Rumah - EcoRoute",
    date: "27 Juli 2026",
    weight: "3.8 kg",
    totalPrice: 361000,
    status: "Proses",
    items: "Kabel Tembaga, Pipa",
  },
  {
    id: 4,
    category: "Elektronik",
    categoryIcon: History,
    categoryColor: "text-blue-600 bg-blue-50",
    location: "EcoPoint Sudirman",
    date: "25 Juli 2026",
    weight: "1 unit",
    totalPrice: 150000,
    status: "Selesai",
    items: "Laptop Bekas",
  },
];

export default function HistoryPage() {
  const [filter, setFilter] = useState<"Semua" | "Selesai" | "Proses">("Semua");
  const [search, setSearch] = useState("");

  // Fungsi untuk memfilter data berdasarkan status & pencarian
  const filteredTransactions = mockTransactions.filter((t) => {
    const matchesFilter = filter === "Semua" || t.status === filter;
    const matchesSearch =
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      t.items.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Format rupiah
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <main className="min-h-screen bg-slate-50/70 p-4 sm:p-6 max-w-4xl mx-auto flex flex-col gap-6 pb-24">
      {/* HEADER */}
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
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-md">
              <History className="w-4 h-4" />
            </div>
            Riwayat Transaksi
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-2">
            Daftar setoran limbah & penjualan yang telah dilakukan
          </p>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl p-1.5 border border-slate-200/80 shadow-sm">
          {(["Semua", "Selesai", "Proses"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all duration-200 ${
                filter === tab
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Cari kategori atau barang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-9 pl-4 py-2.5 bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* LIST TRANSAKSI */}
      <div className="flex flex-col gap-4">
        {filteredTransactions.length === 0 ? (
          <Card className="p-12 text-center flex flex-col items-center gap-4 bg-white shadow-xl shadow-slate-200/50 rounded-3xl">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400">
              <History className="w-10 h-10 stroke-[1.5px]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                Belum ada transaksi
              </h3>
              <p className="text-sm text-slate-500 font-medium">
                Mulai scan sampah Anda sekarang untuk mencatat riwayat pertama.
              </p>
            </div>
            <Link href="/scan">
              <Button
                variant="primary"
                className="mt-2 px-8 py-3 rounded-2xl shadow-lg shadow-emerald-500/20"
              >
                Scan Barang Sekarang
              </Button>
            </Link>
          </Card>
        ) : (
          filteredTransactions.map((transaction) => {
            const Icon = transaction.categoryIcon;
            const isSelesai = transaction.status === "Selesai";

            return (
              <div
                key={transaction.id}
                className="group bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-3xl p-5 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:border-emerald-300/50 transition-all duration-300 flex flex-col gap-4"
              >
                {/* Bagian Atas: Kategori & Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-2xl ${transaction.categoryColor} flex items-center justify-center shrink-0`}
                    >
                      <Icon className="w-6 h-6 stroke-[2px]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center flex-wrap gap-2">
                        <p className="text-lg font-extrabold text-slate-900 font-heading truncate">
                          {transaction.category}
                        </p>
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          {transaction.items}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <span>{transaction.location}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span>{transaction.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                        isSelesai
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                          : "bg-amber-50 text-amber-700 border border-amber-200/80"
                      }`}
                    >
                      {isSelesai ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                      {transaction.status}
                    </div>
                  </div>
                </div>

                {/* Bagian Bawah: Berat & Total Harga */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-200/60">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                    <Package className="w-4 h-4 text-slate-400" />
                    Total Berat:{" "}
                    <span className="text-slate-900">{transaction.weight}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-bold text-slate-400">
                      Total:
                    </span>
                    <span className="text-xl font-black text-emerald-600 font-heading tracking-tight">
                      {formatRupiah(transaction.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
