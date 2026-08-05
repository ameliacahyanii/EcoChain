"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button, Card } from "@/components/ui";
import {
  Wrench,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Cpu,
  Battery,
  Flame,
  HelpCircle,
  Sparkles,
} from "lucide-react";

interface ComponentDetail {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  valueEstimate: string;
  description: string;
  safetyTip: string;
}

interface DisassemblyStep {
  stepNumber: number;
  title: string;
  instruction: string;
  warning?: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function EcoGuidePage() {
  const [selectedDevice, setSelectedDevice] = useState<"laptop" | "smartphone">("laptop");

  const laptopSteps: DisassemblyStep[] = [
    {
      stepNumber: 1,
      title: "Matikan & Lepas Baterai",
      instruction:
        "Pastikan laptop dalam keadaan mati penuh dan kabel charger dilepas. Buka pengunci baterai di bagian bawah laptop lalu keluarkan modul baterai.",
      warning: "PENTING: Jangan menusuk sel baterai Lithium dengan obeng tajam!",
      icon: Battery,
    },
    {
      stepNumber: 2,
      title: "Buka Baut Casing Belakang",
      instruction:
        "Gunakan obeng presisi (Plus PH00) untuk membuka semua baut penutup bawah laptop. Simpan baut dalam wadah kecil agar tidak hilang.",
      icon: Wrench,
    },
    {
      stepNumber: 3,
      title: "Lepas Modul RAM & Keping Memori",
      instruction:
        "Tekan klip pengunci besi di sisi kiri-kanan RAM hingga keping RAM terangkat 45 derajat, lalu tarik perlahan.",
      icon: Cpu,
    },
    {
      stepNumber: 4,
      title: "Ambil Harddisk / SSD & Kabel Tembaga",
      instruction:
        "Lepas baut pengikat penyimpanan SSD/HDD dan kumpulkan kabel fleksibel serta kumparan heatsink tembaga murni.",
      icon: Sparkles,
    },
  ];

  const laptopComponents: ComponentDetail[] = [
    {
      name: "Tembaga Heatsink & Pendingin",
      icon: Flame,
      valueEstimate: "Rp 95.000 / kg",
      description: "Logam tembaga murni kelas tinggi pada saluran pipa pendingin processor.",
      safetyTip: "Tunggu dingin sebelum dilepas.",
    },
    {
      name: "Keping RAM & Papan Motherboard (PCB)",
      icon: Cpu,
      valueEstimate: "Rp 35.000 - Rp 70.000 / unit",
      description: "Mengandung konektor berlapis emas murni dan mikrokontroler bernilai tinggi.",
      safetyTip: "Hindari tekukan keras pada motherboard.",
    },
    {
      name: "Modul Baterai Lithium-Ion",
      icon: Battery,
      valueEstimate: "Rp 15.000 / unit",
      description: "Sel baterai daur ulang yang wajib disalurkan ke mitra berizin B3 KLHK.",
      safetyTip: "Jangan dibakar atau dibuang di TPA umum!",
    },
  ];

  const steps = selectedDevice === "laptop" ? laptopSteps : laptopSteps;
  const components = laptopComponents;

  return (
    <main className="min-h-screen bg-[#F9FAFB] p-4 sm:p-6 max-w-3xl mx-auto flex flex-col gap-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between gap-3">
        <Link href="/scan">
          <Button variant="outline" className="p-3 min-w-[48px] min-h-[48px]">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827] flex items-center gap-2 font-heading">
            <Wrench className="w-6 h-6 text-[#0D9488]" />
            EcoGuide — Panduan Pembongkaran Aman
          </h1>
          <p className="text-sm text-[#4B5563]">
            Panduan bertahap ekstraksi komponen bernilai tinggi pada e-waste
          </p>
        </div>
      </div>

      {/* Safety Alert Header */}
      <Card className="bg-[#FEF3C7] border-2 border-[#F59E0B] p-4 sm:p-6 flex flex-col sm:flex-row items-start gap-4">
        <div className="p-3 bg-[#F59E0B] text-[#111827] rounded-xl shrink-0">
          <ShieldAlert className="w-8 h-8 stroke-[2.5px]" />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-base sm:text-lg font-bold text-[#92400E]">
            Peringatan Keselamatan Penting
          </h2>
          <p className="text-sm text-[#78350F] leading-relaxed">
            Komponen elektronik mengandung bahan berbahaya (B3) dan lithium yang dapat memicu percikan api.
            Selalu utamakan keselamatan kerja: gunakan sarung tangan dan pelindung mata.
          </p>
        </div>
      </Card>

      {/* Device Selector Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-white border border-[#E5E7EB] rounded-2xl">
        <button
          onClick={() => setSelectedDevice("laptop")}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-colors ${
            selectedDevice === "laptop"
              ? "bg-[#0D9488] text-white shadow-xs"
              : "text-[#4B5563] hover:bg-[#F9FAFB]"
          }`}
        >
          💻 Laptop / PC Bekas
        </button>
        <button
          onClick={() => setSelectedDevice("smartphone")}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-colors ${
            selectedDevice === "smartphone"
              ? "bg-[#0D9488] text-white shadow-xs"
              : "text-[#4B5563] hover:bg-[#F9FAFB]"
          }`}
        >
          📱 Smartphone / Tablet
        </button>
      </div>

      {/* Disassembly Steps Section */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-[#111827] flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
          Langkah Pembongkaran Bertahap (4 Langkah)
        </h3>

        <div className="flex flex-col gap-3">
          {steps.map((step) => {
            const StepIcon = step.icon;
            return (
              <Card key={step.stepNumber} className="flex flex-col gap-3 p-5 border border-[#E5E7EB]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#CCFBF1] text-[#0D9488] font-bold text-sm flex items-center justify-center">
                      {step.stepNumber}
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-[#111827]">
                      {step.title}
                    </h4>
                  </div>
                  <StepIcon className="w-6 h-6 text-[#0D9488]" />
                </div>

                <p className="text-sm sm:text-base text-[#374151] leading-relaxed pl-11">
                  {step.instruction}
                </p>

                {step.warning && (
                  <div className="ml-11 p-3 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-[#991B1B] font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-[#DC2626]" />
                    <span>{step.warning}</span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Valuable Components Breakdown */}
      <div className="flex flex-col gap-4 mt-2">
        <h3 className="text-lg font-bold text-[#111827] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#F59E0B]" />
          Komponen Berharga di Dalamnya
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {components.map((comp, idx) => {
            const CompIcon = comp.icon;
            return (
              <Card key={idx} className="flex flex-col gap-3 p-5 bg-white border border-[#E5E7EB]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#FEF3C7] text-[#92400E] rounded-xl shrink-0">
                      <CompIcon className="w-6 h-6 stroke-[2.5px]" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#111827]">{comp.name}</h4>
                      <p className="text-xs text-[#6B7280]">{comp.description}</p>
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold px-3 py-1 bg-[#F59E0B] text-[#111827] rounded-lg shrink-0 shadow-2xs">
                    {comp.valueEstimate}
                  </span>
                </div>

                <div className="text-xs text-[#0D9488] font-medium bg-[#CCFBF1]/50 p-2.5 rounded-lg flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <span>Tips Penanganan: {comp.safetyTip}</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Return Action */}
      <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
        <Link href="/scan" className="w-full sm:w-1/2">
          <Button variant="outline" fullWidth className="py-3">
            Kembali ke EcoScan
          </Button>
        </Link>
        <Link href="/pickup" className="w-full sm:w-1/2">
          <Button variant="primary" fullWidth className="py-3">
            Lanjut Minta Penjemputan
          </Button>
        </Link>
      </div>
    </main>
  );
}
