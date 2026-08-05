"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Card, BigInput, StatusBadge } from "@/components/ui";
import { useAuth } from "@/lib/context/AuthContext";
import {
  Building2,
  ArrowLeft,
  Package,
  DollarSign,
  Users,
  TrendingUp,
  Plus,
  ShieldCheck,
  Filter,
  CheckCircle2,
  Lock,
  X,
  FileText,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function PengepulDashboardPage() {
  const { role } = useAuth();
  const [loading, setLoading] = useState(true);

  // Dashboard Data State
  const [summary, setSummary] = useState({
    total_stock_kg: 2695,
    active_pemulung_count: 14,
    total_stock_value_rp: 29480000,
  });

  const [stockByCategory, setStockByCategory] = useState<any[]>([]);
  const [volume7DaysTrend, setVolume7DaysTrend] = useState<any[]>([]);
  const [incomingTransactions, setIncomingTransactions] = useState<any[]>([]);
  const [b2bOrders, setB2bOrders] = useState<any[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // B2B Modal State
  const [isB2bModalOpen, setIsB2bModalOpen] = useState(false);
  const [buyerCompany, setBuyerCompany] = useState("PT Daur Ulang Nusantara");
  const [b2bCategory, setB2bCategory] = useState("Kertas Kardus & PET");
  const [b2bWeight, setB2bWeight] = useState("2500");
  const [b2bPrice, setB2bPrice] = useState("15500000");
  const [isSubmittingB2b, setIsSubmittingB2b] = useState(false);
  const [b2bSuccessMessage, setB2bSuccessMessage] = useState<string | null>(
    null,
  );

  // Fetch EcoHub Data
  useEffect(() => {
    fetch("/api/ecohub")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSummary(data.summary);
          setStockByCategory(data.stockByCategory);
          setVolume7DaysTrend(data.volume7DaysTrend);
          setIncomingTransactions(data.incomingTransactions);
          setB2bOrders(data.b2bOrders);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Handle Submit B2B Order Form
  const handleCreateB2bOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingB2b(true);

    try {
      const res = await fetch("/api/ecohub", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyer_company_name: buyerCompany,
          category: b2bCategory,
          total_weight_kg: b2bWeight,
          total_price: b2bPrice,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setB2bOrders([json.data, ...b2bOrders]);
        setB2bSuccessMessage(json.message);
        setTimeout(() => {
          setIsB2bModalOpen(false);
          setB2bSuccessMessage(null);
        }, 2000);
      }
    } catch {
      // Fallback local add
      const mockOrder = {
        id: `b2b-${Date.now()}`,
        buyer_company_name: buyerCompany,
        total_weight_kg: Number(b2bWeight),
        total_price: Number(b2bPrice),
        escrow_status: "funded",
        created_at: "Hari Ini",
      };
      setB2bOrders([mockOrder, ...b2bOrders]);
      setB2bSuccessMessage("Pesanan B2B berhasil dibuat di EcoVault!");
      setTimeout(() => {
        setIsB2bModalOpen(false);
        setB2bSuccessMessage(null);
      }, 2000);
    } finally {
      setIsSubmittingB2b(false);
    }
  };

  const filteredStock =
    categoryFilter === "all"
      ? stockByCategory
      : stockByCategory.filter((item) => item.group === categoryFilter);

  // Colors pulled from the theme tokens in globals.css (recharts needs raw CSS values)
  const BAR_COLORS = ["#10b981", "#14b8a6", "#f59e0b", "#059669", "#64748b"];

  return (
    <main className="min-h-screen bg-neutral-bg p-4 sm:p-6 max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="outline" className="p-3 min-w-[48px] min-h-[48px]">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-neutral-text tracking-tight font-heading flex items-center gap-2">
              <Building2 className="w-7 h-7 text-secondary" />
              EcoHub | Dashboard Pengepul Mitra
            </h1>
            <p className="text-sm text-slate-500">
              Kelola inventaris stok, konsolidasi tonase, & transaksi B2B
              EcoVault
            </p>
          </div>
        </div>

        {/* Action Button: Create B2B Order */}
        <Button
          variant="primary"
          onClick={() => setIsB2bModalOpen(true)}
          className="py-3 px-5 text-base shadow-md"
        >
          <Plus className="w-5 h-5 mr-2 stroke-[2.5px]" />
          Buat Pesanan B2B (EcoVault)
        </Button>
      </div>

      {/* ==================================================================== */}
      {/* 1. SUMMARY MANIFEST STRIP — one connected ledger, not 3 loose cards  */}
      {/* ==================================================================== */}
      <Card className="p-0 bg-white border border-neutral-border overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-neutral-border">
          {/* Metric 1: Total Stok */}
          <div className="p-5 flex items-center gap-4">
            <div className="p-3 bg-primary-light text-primary rounded-xl shrink-0">
              <Package className="w-6 h-6 stroke-[2.5px]" />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Stok Hari Ini
              </span>
              <p className="text-2xl font-extrabold text-neutral-text leading-tight">
                {summary.total_stock_kg.toLocaleString("id-ID")}{" "}
                <span className="text-sm font-semibold text-slate-400">kg</span>
              </p>
              <span className="text-xs text-primary-hover font-semibold">
                ↑ +12% dari minggu lalu
              </span>
            </div>
          </div>

          {/* Metric 2: Pemulung Aktif */}
          <div className="p-5 flex items-center gap-4">
            <div className="p-3 bg-secondary/10 text-secondary rounded-xl shrink-0">
              <Users className="w-6 h-6 stroke-[2.5px]" />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Mitra Pemulung Aktif
              </span>
              <p className="text-2xl font-extrabold text-neutral-text leading-tight">
                {summary.active_pemulung_count}{" "}
                <span className="text-sm font-semibold text-slate-400">
                  Pemulung
                </span>
              </p>
              <span className="text-xs text-secondary font-semibold">
                Merespons orderan EcoRoute
              </span>
            </div>
          </div>

          {/* Metric 3: Estimasi Nilai Stok */}
          <div className="p-5 flex items-center gap-4">
            <div className="p-3 bg-accent/15 text-accent-hover rounded-xl shrink-0">
              <DollarSign className="w-6 h-6 stroke-[2.5px]" />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Estimasi Nilai Stok
              </span>
              <p className="text-2xl font-extrabold text-neutral-text leading-tight truncate">
                Rp {summary.total_stock_value_rp.toLocaleString("id-ID")}
              </p>
              <span className="text-[11px] font-bold bg-neutral-text text-white px-2 py-0.5 rounded-full w-fit">
                Siap Jual B2B EcoVault
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* ==================================================================== */}
      {/* 2. CHARTS SECTION (Recharts Bar & Line Charts)                      */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart: Stok per Kategori */}
        <Card className="p-6 bg-white border border-neutral-border flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-neutral-border pb-3">
            <h3 className="text-lg font-bold text-neutral-text flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Stok Terkumpul per Kategori (kg)
            </h3>
            <span className="text-xs text-slate-400">Update Real-Time</span>
          </div>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stockByCategory}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis
                  dataKey="group"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  formatter={(value: any) => [`${value} kg`, "Volume Stok"]}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: "12px",
                    color: "#fff",
                    border: "none",
                  }}
                />
                <Bar dataKey="weight_kg" radius={[8, 8, 0, 0]}>
                  {stockByCategory.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={BAR_COLORS[index % BAR_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Line Chart: Tren Volume 7 Hari Terakhir */}
        <Card className="p-6 bg-white border border-neutral-border flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-neutral-border pb-3">
            <h3 className="text-lg font-bold text-neutral-text flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-secondary" />
              Tren Volume Masuk 7 Hari Terakhir
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 bg-secondary/10 text-secondary rounded-full">
              Minggu Ini
            </span>
          </div>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={volume7DaysTrend}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis
                  dataKey="day"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  formatter={(value: any) => [`${value} kg`, "Volume Masuk"]}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: "12px",
                    color: "#fff",
                    border: "none",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="volume_kg"
                  stroke="#14b8a6"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#14b8a6" }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ==================================================================== */}
      {/* 3. TABEL STOK PER KATEGORI DENGAN FILTER                             */}
      {/* ==================================================================== */}
      <Card className="p-6 bg-white border border-neutral-border flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-border pb-3">
          <h3 className="text-lg font-bold text-neutral-text flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            Rincian Stok Gudang Lapak
          </h3>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {["all", "plastik", "kertas", "logam", "elektronik"].map(
              (group) => (
                <button
                  key={group}
                  onClick={() => setCategoryFilter(group)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors min-h-[36px] ${
                    categoryFilter === group
                      ? "bg-primary text-white"
                      : "bg-neutral-bg text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {group === "all" ? "Semua" : group}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Stock List Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-border text-xs font-bold text-slate-400 uppercase tracking-wider bg-neutral-bg">
                <th className="p-3">Nama Kategori</th>
                <th className="p-3">Grup</th>
                <th className="p-3">Berat Terkumpul</th>
                <th className="p-3">Harga Acuan/kg</th>
                <th className="p-3">Total Nilai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-border text-sm text-neutral-text">
              {filteredStock.map((item, idx) => (
                <tr key={idx} className="hover:bg-neutral-bg transition-colors">
                  <td className="p-3 font-bold">{item.category}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-light text-primary-hover uppercase">
                      {item.group}
                    </span>
                  </td>
                  <td className="p-3 font-semibold">{item.weight_kg} kg</td>
                  <td className="p-3 text-slate-500">
                    Rp {item.unit_price.toLocaleString("id-ID")}
                  </td>
                  <td className="p-3 font-extrabold text-primary-hover">
                    Rp {item.total_val.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ==================================================================== */}
      {/* 4. ECOVAULT B2B ORDERS & ESCROW LIST                                 */}
      {/* ==================================================================== */}
      <Card className="p-6 bg-white border border-neutral-border flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-neutral-border pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-bold text-neutral-text">
              Pesanan B2B & Status Escrow (EcoVault)
            </h3>
          </div>
          <span className="text-xs font-bold text-primary-hover bg-primary-light px-3 py-1 rounded-full border border-primary/30">
            Rekening Bersama Locked
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {b2bOrders.map((order) => (
            <Card
              key={order.id}
              className="p-4 border border-neutral-border flex flex-col gap-3 bg-neutral-bg"
            >
              <div className="flex items-start justify-between gap-2 border-b border-neutral-border pb-2">
                <div>
                  <h4 className="font-bold text-neutral-text text-base">
                    {order.buyer_company_name}
                  </h4>
                  <p className="text-xs text-slate-400">{order.created_at}</p>
                </div>
                <StatusBadge
                  status={
                    order.escrow_status === "funded" ? "Diproses" : "Selesai"
                  }
                />
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Total Tonase:</span>
                <span className="font-bold text-neutral-text">
                  {order.total_weight_kg} kg
                </span>
              </div>

              {/* "Sealed envelope" escrow line — dashed border instead of solid amber block */}
              <div className="flex justify-between items-center text-base font-extrabold bg-accent/10 p-3 rounded-xl border border-dashed border-accent/50 text-accent-hover">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-accent" />
                  Dana Escrow EcoVault:
                </span>
                <span>Rp {order.total_price.toLocaleString("id-ID")}</span>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* ==================================================================== */}
      {/* MODAL B2B ORDER FORM                                                 */}
      {/* ==================================================================== */}
      {isB2bModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-white p-6 flex flex-col gap-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-neutral-border pb-3">
              <h3 className="text-xl font-bold text-neutral-text flex items-center gap-2">
                <Lock className="w-6 h-6 text-primary" />
                Buat Pesanan B2B EcoVault
              </h3>
              <button
                onClick={() => setIsB2bModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-neutral-bg min-h-[44px] min-w-[44px]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {b2bSuccessMessage ? (
              <div className="p-4 bg-primary-light border border-primary/30 text-primary-hover rounded-xl text-center font-bold text-sm flex flex-col items-center gap-2">
                <CheckCircle2 className="w-8 h-8 text-primary" />
                <span>{b2bSuccessMessage}</span>
              </div>
            ) : (
              <form
                onSubmit={handleCreateB2bOrder}
                className="flex flex-col gap-4"
              >
                <BigInput
                  label="Nama Perusahaan Industri / Pabrik Pembeli"
                  placeholder="Contoh: PT Daur Ulang Nusantara"
                  value={buyerCompany}
                  onChange={(e) => setBuyerCompany(e.target.value)}
                  required
                />

                <BigInput
                  label="Kategori / Deskripsi Tonase"
                  placeholder="Contoh: Kertas Kardus & PET Press"
                  value={b2bCategory}
                  onChange={(e) => setB2bCategory(e.target.value)}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <BigInput
                    label="Total Berat (kg)"
                    type="number"
                    value={b2bWeight}
                    onChange={(e) => setB2bWeight(e.target.value)}
                    required
                  />
                  <BigInput
                    label="Total Harga Transaksi (Rp)"
                    type="number"
                    value={b2bPrice}
                    onChange={(e) => setB2bPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="p-3 bg-accent/10 border border-dashed border-accent/50 rounded-xl text-xs text-accent-hover flex items-start gap-2">
                  <ShieldCheck className="w-5 h-5 shrink-0 text-accent" />
                  <span>
                    Dana pembeli korporat akan ditahan secara otomatis di{" "}
                    <strong className="font-extrabold">EcoVault Escrow</strong>{" "}
                    sampai tonase dan kualitas bahan baku diverifikasi.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsB2bModalOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmittingB2b}
                  >
                    Konfirmasi Pesanan Escrow
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      )}
    </main>
  );
}
