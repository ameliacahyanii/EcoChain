"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button, Card } from "@/components/ui";
import {
  LineChart as ChartIcon,
  ArrowLeft,
  Leaf,
  Scale,
  Users,
  Download,
  Calendar,
  Sparkles,
  CheckCircle2,
  PieChart as PieIcon,
  Award,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function ImpactDashboardPage() {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // ESG Impact Summary Data
  const impactSummary = {
    total_managed_waste_kg: 18450,
    total_co2_reduction_kg: 33210, // ~1.8 kg CO2 per kg waste
    empowered_partners: 48, // Pemulung & Pengepul
    recycled_rate_pct: 94.2,
  };

  // Monthly Trend Data for LineChart
  const monthlyTrendData = [
    { month: "Jan", waste_kg: 1200, co2_kg: 2160 },
    { month: "Feb", waste_kg: 1800, co2_kg: 3240 },
    { month: "Mar", waste_kg: 2100, co2_kg: 3780 },
    { month: "Apr", waste_kg: 2900, co2_kg: 5220 },
    { month: "Mei", waste_kg: 3400, co2_kg: 6120 },
    { month: "Jun", waste_kg: 3850, co2_kg: 6930 },
    { month: "Jul", waste_kg: 4200, co2_kg: 7560 },
  ];

  // Category Breakdown Data for PieChart
  const categoryBreakdownData = [
    { name: "Plastik PET & HDPE", value: 6800, color: "#16A34A" },
    { name: "Kertas Kardus & HVS", value: 5200, color: "#0D9488" },
    { name: "Logam Tembaga & Aluminium", value: 3900, color: "#F59E0B" },
    { name: "Elektronik (E-Waste)", value: 1650, color: "#2563EB" },
    { name: "Minyak Jelantah & Lainnya", value: 900, color: "#8B5CF6" },
  ];

  // Trigger ESG Report CSV Download
  const handleDownloadEsgReport = () => {
    const csvHeader =
      "Bulan,Total Sampah Terkelola (kg),Reduksi CO2 (kg CO2e)\n";
    const csvRows = monthlyTrendData
      .map((row) => `${row.month},${row.waste_kg},${row.co2_kg}`)
      .join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Laporan_ESG_EcoTrack_${new Date().getFullYear()}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <main className="min-h-screen bg-[#F9FAFB] p-4 sm:p-6 max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="outline" className="p-3 min-w-[48px] min-h-[48px]">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-[#111827] tracking-tight font-heading flex items-center gap-2">
              <Leaf className="w-7 h-7 text-[#16A34A]" />
              EcoTrack — Dashboard Dampak ESG
            </h1>
            <p className="text-sm text-[#4B5563]">
              Laporan real-time tonase daur ulang & estimasi reduksi jejak
              karbon korporat
            </p>
          </div>
        </div>

        {/* Export ESG Report Button */}
        <Button
          variant="primary"
          onClick={handleDownloadEsgReport}
          className="py-3 px-5 text-base shadow-md"
        >
          <Download className="w-5 h-5 mr-2 stroke-[2.5px]" />
          Unduh Laporan ESG (CSV)
        </Button>
      </div>

      {downloadSuccess && (
        <div className="p-4 bg-[#DCFCE7] border border-[#86EFAC] text-[#166534] rounded-xl font-bold text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
          <span>Laporan ESG EcoTrack berhasil diunduh ke perangkat Anda!</span>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 1. HERO IMPACT METRICS GRID                                          */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Total Sampah Terkelola */}
        <Card className="flex items-center justify-between p-6 bg-white border-l-4 border-l-[#16A34A] shadow-xs">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">
              Total Sampah Terkelola
            </span>
            <p className="text-3xl font-extrabold text-[#16A34A]">
              {(impactSummary.total_managed_waste_kg / 1000).toFixed(1)}{" "}
              <span className="text-base font-semibold text-[#374151]">
                Ton
              </span>
            </p>
            <span className="text-xs text-[#165834] font-medium">
              {impactSummary.total_managed_waste_kg.toLocaleString("id-ID")} kg
              terselamatkan
            </span>
          </div>
          <div className="p-3.5 bg-[#DCFCE7] text-[#16A34A] rounded-2xl">
            <Scale className="w-8 h-8 stroke-[2.5px]" />
          </div>
        </Card>

        {/* Card 2: Estimasi Reduksi CO2 */}
        <Card className="flex items-center justify-between p-6 bg-white border-l-4 border-l-[#0D9488] shadow-xs">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">
              Estimasi Reduksi CO₂e
            </span>
            <p className="text-3xl font-extrabold text-[#0D9488]">
              {(impactSummary.total_co2_reduction_kg / 1000).toFixed(1)}{" "}
              <span className="text-base font-semibold text-[#374151]">
                Ton CO₂e
              </span>
            </p>
            <span className="text-xs text-[#0F766E] font-medium">
              {impactSummary.total_co2_reduction_kg.toLocaleString("id-ID")} kg
              CO₂e tereduksi
            </span>
          </div>
          <div className="p-3.5 bg-[#CCFBF1] text-[#0D9488] rounded-2xl">
            <Leaf className="w-8 h-8 stroke-[2.5px]" />
          </div>
        </Card>

        {/* Card 3: Mitra Diberdayakan (Accent Golden #F59E0B dengan Teks Gelap #111827) */}
        <Card className="flex items-center justify-between p-6 bg-[#F59E0B] text-[#111827] border border-[#D97706] shadow-md rounded-[16px]">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wider opacity-90">
              Mitra Diberdayakan
            </span>
            <p className="text-3xl font-extrabold tracking-tight">
              {impactSummary.empowered_partners}{" "}
              <span className="text-base font-semibold">Mitra</span>
            </p>
            <span className="text-xs font-bold bg-[#111827] text-white px-2.5 py-0.5 rounded-full w-fit">
              Dampak Sosial Inklusif
            </span>
          </div>
          <div className="p-3.5 bg-[#111827] text-[#F59E0B] rounded-2xl shrink-0">
            <Users className="w-8 h-8 stroke-[2.5px]" />
          </div>
        </Card>
      </div>

      {/* ==================================================================== */}
      {/* 2. CHARTS SECTION (Monthly Trend Line Chart & Category Pie Chart)    */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Line Chart: Tren Bulanan Reduksi Karbon (7 Cols Desktop) */}
        <Card className="lg:col-span-7 p-6 bg-white border border-[#E5E7EB] flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
            <h3 className="text-lg font-bold text-[#111827] flex items-center gap-2">
              <ChartIcon className="w-5 h-5 text-[#16A34A]" />
              Tren Bulanan Reduksi Jejak Karbon (CO₂e)
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 bg-[#DCFCE7] text-[#166534] rounded-full">
              2026
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyTrendData}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis
                  dataKey="month"
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    name === "co2_kg" ? `${value} kg CO₂e` : `${value} kg`,
                    name === "co2_kg" ? "Reduksi Karbon" : "Total Sampah",
                  ]}
                  contentStyle={{
                    backgroundColor: "#111827",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="co2_kg"
                  stroke="#16A34A"
                  strokeWidth={3.5}
                  dot={{ r: 5, fill: "#16A34A" }}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="waste_kg"
                  stroke="#0D9488"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 4, fill: "#0D9488" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pie Chart: Distribution breakdown per Kategori Sampah (5 Cols Desktop) */}
        <Card className="lg:col-span-5 p-6 bg-white border border-[#E5E7EB] flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
            <h3 className="text-lg font-bold text-[#111827] flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-[#0D9488]" />
              Proporsi Komposisi Sampah
            </h3>
            <span className="text-xs text-[#6B7280]">Per Kategori</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value} kg`, "Volume"]}
                  contentStyle={{
                    backgroundColor: "#111827",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Category Legend */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#E5E7EB]">
            {categoryBreakdownData.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-[#374151]">
                    {item.name}
                  </span>
                </div>
                <span className="font-bold text-[#111827]">
                  {item.value.toLocaleString("id-ID")} kg
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ==================================================================== */}
      {/* 3. ESG COMPLIANCE CERTIFICATION BANNER                              */}
      {/* ==================================================================== */}
      <Card className="bg-gradient-to-r from-[#166534] via-[#16A34A] to-[#0D9488] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md rounded-[16px]">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md shrink-0">
            <Award className="w-10 h-10 text-[#F59E0B]" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold font-heading">
              Sertifikat Kepatuhan ESG & Pelaporan EPR Resmi
            </h3>
            <p className="text-sm text-green-100 leading-relaxed max-w-xl">
              Seluruh data transaksi di EcoChain telah terverifikasi secara
              digital untuk memenuhi kriteria standar pelaporan *Extended
              Producer Responsibility* (EPR) & audit ESG korporasi.
            </p>
          </div>
        </div>

        <Button
          variant="accent"
          onClick={handleDownloadEsgReport}
          className="py-3 px-6 text-base font-bold shadow-lg text-[#111827] whitespace-nowrap"
        >
          Cetak Sertifikat ESG
        </Button>
      </Card>
    </main>
  );
}
