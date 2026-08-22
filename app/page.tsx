"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, Card } from "@/components/ui";
import {
  Camera,
  Truck,
  ShieldCheck,
  LineChart,
  ArrowRight,
  Sparkles,
  DollarSign,
  CheckCircle2,
  Users,
  Building2,
  Bike,
  Recycle,
  Leaf,
} from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50/70 flex flex-col">
      {/* ==================================================================== */}
      {/* 1. HERO SECTION                                                     */}
      {/* ==================================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-100 via-teal-50/40 to-slate-50/70 pt-4 sm:pt-10 pb-16 md:pt-20 md:pb-28 px-4 sm:px-6">
        {/* Subtle Decorative Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-300/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/90 border border-emerald-300/80 text-emerald-800 text-sm font-extrabold w-fit mx-auto lg:mx-0 shadow-xs">
              <Leaf className="w-4 h-4 text-emerald-600 animate-pulse" />

              <span>Platform Rantai Pasok Sirkular AI #1 di Indonesia</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] font-heading">
              Jual sampah & barang bekas,{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
                harga langsung kelihatan aja
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium max-w-2xl mx-auto lg:mx-0">
              Ubah rongsokan, kertas, plastik, dan elektronik bekas jadi uang
              tunai instan. Dapatkan estimasi harga otomatis berbasis AI, lalu
              pilih antar ke lapak atau jemput Pemulung Mitra.
            </p>

            {/* Tombol CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-3">
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  className="w-full sm:w-auto text-lg px-9 py-4 shadow-xl shadow-emerald-500/25"
                >
                  Mulai Sekarang
                  <ArrowRight className="w-5 h-5 ml-2.5" />
                </Button>
              </Link>
              <Link href="/scan" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  className="w-full sm:w-auto text-lg px-9 py-4 shadow-xl shadow-teal-500/25"
                >
                  <Camera className="w-5.5 h-5.5 mr-2.5" />
                  Coba EcoScan AI
                </Button>
              </Link>
            </div>
            <div className="pt-8 grid grid-cols-3 gap-2 sm:gap-6 lg:gap-12 border-t border-slate-200/80 max-w-2xl mx-auto lg:mx-0 w-full text-center sm:text-left">
              <div className="flex flex-col items-center sm:items-start">
                <p className="text-xl sm:text-3xl font-extrabold text-emerald-600 font-heading tracking-tight">
                  100%
                </p>
                <p className="text-[10px] sm:text-sm font-bold text-slate-500 leading-tight mt-0.5">
                  Harga Transparan
                </p>
              </div>
              <div className="flex flex-col items-center sm:items-start">
                <p className="text-xl sm:text-3xl font-extrabold text-teal-600 font-heading tracking-tight">
                  On-Demand
                </p>
                <p className="text-[10px] sm:text-sm font-bold text-slate-500 leading-tight mt-0.5">
                  Jemput Pemulung
                </p>
              </div>
              <div className="flex flex-col items-center sm:items-start">
                <p className="text-xl sm:text-3xl font-extrabold text-amber-500 font-heading tracking-tight">
                  Escrow B2B
                </p>
                <p className="text-[10px] sm:text-sm font-bold text-slate-500 leading-tight mt-0.5">
                  EcoVault Safe
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE COLUMN - ILUSTRASI RESPONSIF */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative w-full overflow-hidden sm:overflow-visible py-4 sm:py-0">
            <div className="relative w-full max-w-lg lg:max-w-[480px] flex flex-col items-center justify-center min-h-[380px] sm:min-h-[480px]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-gradient-to-tr from-emerald-200/30 via-teal-200/20 to-transparent blur-[80px] sm:blur-[100px] rounded-full pointer-events-none" />

              {/* === ILUSTRASI EKOSISTEM === */}
              <div className="relative w-full aspect-square max-w-[320px] sm:max-w-[420px] flex items-center justify-center z-10">
                <div className="absolute inset-0 rounded-full border-[2px] border-emerald-200/70" />
                <div className="absolute inset-[18%] rounded-full bg-gradient-to-t from-emerald-100/40 via-transparent to-teal-100/40" />

                <div className="absolute inset-0 z-0">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] sm:w-[120px] h-[100px] sm:h-[120px] bg-gradient-to-br from-emerald-300/30 to-transparent rounded-full blur-[20px] transform rotate-45 translate-x-[-60px] sm:translate-x-[-80px] translate-y-[-60px] sm:translate-y-[-80px]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] sm:w-[120px] h-[100px] sm:h-[120px] bg-gradient-to-r from-emerald-300/20 to-transparent rounded-full blur-[20px] transform translate-x-[60px] sm:translate-x-[80px]" />
                </div>

                {/* Node Tengah */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 sm:w-20 h-16 sm:h-20 bg-white/80 backdrop-blur-xl rounded-full shadow-[0_20px_40px_rgba(16,185,129,0.15)] border border-white/80 flex items-center justify-center z-10">
                  <div className="w-14 sm:w-18 h-14 sm:h-18 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-full flex items-center justify-center text-white shadow-inner">
                    <Recycle className="w-8 sm:w-10 h-8 sm:h-10 stroke-[2px]" />
                  </div>
                </div>

                {/* Kartu 1: Rumah Tangga */}
                <div className="absolute -top-8 sm:-top-14 left-16 sm:left-32 bg-white/85 backdrop-blur-lg p-2.5 sm:p-4 rounded-2xl shadow-lg border border-white/90 flex flex-col items-center gap-1 sm:gap-2 z-10 transition-all duration-300 hover:bg-white/95 w-[95px] sm:w-[110px]">
                  <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-blue-50/80 text-blue-500 flex items-center justify-center">
                    <Users className="w-4 sm:w-5 h-4 sm:h-5 stroke-[1.5px]" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-700 text-center leading-tight">
                    Rumah Tangga
                  </span>
                </div>

                {/* Kartu 2: Pemulung */}
                <div className="absolute -right-2 sm:-right-10 top-1/2 -translate-y-1/2 bg-white/85 backdrop-blur-lg p-2.5 sm:p-4 rounded-2xl shadow-lg border border-white/90 flex flex-col items-center gap-1 sm:gap-2 z-10 transition-all duration-300 hover:bg-white/95 w-[95px] sm:w-[110px]">
                  <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-emerald-50/80 text-emerald-500 flex items-center justify-center">
                    <Bike className="w-4 sm:w-5 h-4 sm:h-5 stroke-[1.5px]" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-700 text-center leading-tight">
                    Pemulung
                  </span>
                </div>

                {/* Kartu 3: Pengepul */}
                <div className="absolute bottom-16 sm:bottom-22 -left-2 sm:-left-6 bg-white/85 backdrop-blur-lg p-2.5 sm:p-4 rounded-2xl shadow-lg border border-white/90 flex flex-col items-center gap-1 sm:gap-2 z-10 transition-all duration-300 hover:bg-white/95 w-[95px] sm:w-[110px]">
                  <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-amber-50/80 text-amber-500 flex items-center justify-center">
                    <Building2 className="w-4 sm:w-5 h-4 sm:h-5 stroke-[1.5px]" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-700 text-center leading-tight">
                    Pengepul
                  </span>
                </div>
              </div>

              {/* Floating Price Pill */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-2xl border border-white/80 shadow-xl flex items-center gap-3 sm:gap-4 w-[95%] sm:w-[90%] max-w-sm z-20 transition-all duration-300">
                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-900 flex items-center justify-center font-extrabold shrink-0 shadow-md">
                  <DollarSign className="w-5 sm:w-6 h-5 sm:h-6 stroke-[2px]" />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <p className="text-[9px] sm:text-[10px] font-extrabold text-slate-400 uppercase tracking-wider leading-tight">
                    Estimasi Harga AI
                  </p>
                  <div className="flex items-baseline gap-1 mt-0.5 flex-wrap">
                    <span className="text-xs sm:text-sm font-bold text-slate-500">
                      Tembaga Super:
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-emerald-600">
                      Rp 95.000/kg
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ==================================================================== */}
      {/* 2. SECTION "CARA KERJA"                                             */}
      {/* ==================================================================== */}
      <section className="py-20 px-4 sm:px-6 bg-white border-y border-slate-200/80 relative">
        <div className="max-w-6xl mx-auto flex flex-col gap-14">
          <div className="text-center flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/90 border border-emerald-300/80 text-emerald-800 text-sm font-extrabold w-fit mx-auto shadow-xs">
              <Recycle className="w-4 h-4 text-emerald-600" />{" "}
              <span>ALUR PENGGUNAAN</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
              Cara Kerja EcoChain
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto font-medium">
              Tiga langkah mudah menjual limbah anorganik dan barang bekas tanpa
              tawar-menawar sepihak.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="flex flex-col items-center text-center p-8 gap-5 border-t-4 border-t-teal-500 glass-card glass-card-hover">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-teal-500 to-teal-400 text-white flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-teal-500/25">
                <Camera className="w-10 h-10 stroke-[2.5px]" />
              </div>
              <span className="px-4 py-1 bg-teal-50 text-teal-700 font-extrabold text-xs rounded-full border border-teal-200">
                Langkah 1
              </span>
              <h3 className="text-2xl font-bold text-slate-900 font-heading">
                Foto Barangnya
              </h3>
              <p className="text-base text-slate-600 leading-relaxed font-medium">
                Foto rongsok/elektronik lewat{" "}
                <strong className="font-extrabold text-slate-900">
                  EcoScan AI
                </strong>
                . Sistem otomatis mendeteksi kategori dan menghitung estimasi
                harganya.
              </p>
            </Card>

            {/* Step 2 */}
            <Card className="flex flex-col items-center text-center p-8 gap-5 border-t-4 border-t-emerald-500 glass-card glass-card-hover">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-emerald-500/25">
                <Truck className="w-10 h-10 stroke-[2.5px]" />
              </div>
              <span className="px-4 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-xs rounded-full border border-emerald-200">
                Langkah 2
              </span>
              <h3 className="text-2xl font-bold text-slate-900 font-heading">
                Pilih Antar / Jemput
              </h3>
              <p className="text-base text-slate-600 leading-relaxed font-medium">
                Pilih antar sendiri ke{" "}
                <strong className="font-extrabold text-slate-900">
                  EcoPoint
                </strong>{" "}
                terdekat atau minta dijemput langsung oleh{" "}
                <strong className="font-extrabold text-slate-900">
                  Pemulung Mitra EcoRoute
                </strong>
                .
              </p>
            </Card>

            {/* Step 3 */}
            <Card className="flex flex-col items-center text-center p-8 gap-5 border-t-4 border-t-amber-500 glass-card glass-card-hover">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-900 flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-amber-500/25">
                <DollarSign className="w-10 h-10 stroke-[2.5px]" />
              </div>
              <span className="px-4 py-1 bg-amber-50 text-amber-800 font-extrabold text-xs rounded-full border border-amber-200">
                Langkah 3
              </span>
              <h3 className="text-2xl font-bold text-slate-900 font-heading">
                Uang Langsung Masuk
              </h3>
              <p className="text-base text-slate-600 leading-relaxed font-medium">
                Tonase ditimbang transparan, pembayaran langsung cair, dan Anda
                ikut berkontribusi mengurangi sampah nasional.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3. SECTION KEUNGGULAN (GRID 4 KARTU)                                */}
      {/* ==================================================================== */}
      <section className="py-20 px-4 sm:px-6 bg-slate-50/70">
        <div className="max-w-7xl mx-auto flex flex-col gap-14">
          <div className="text-center flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/90 border border-emerald-300/80 text-emerald-800 text-sm font-extrabold w-fit mx-auto shadow-xs">
              <Sparkles className="w-4 h-4 text-emerald-600" />{" "}
              <span>INOVASI TEKNOLOGI</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
              Keunggulan Platform EcoChain
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto font-medium">
              Solusi berbasis teknologi yang memodernisasi rantai pasok daur
              ulang di Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <Card className="flex flex-col gap-4 p-7 bg-white border border-slate-200/80 hover:border-emerald-500 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Sparkles className="w-7 h-7 stroke-[2.5px]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                Harga Transparan (EcoScan AI)
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Menghilangkan tawar-menawar sepihak. Dapatkan acuan harga pasar
                objektif menggunakan AI scanner.
              </p>
            </Card>

            {/* Card 2 */}
            <Card className="flex flex-col gap-4 p-7 bg-white border border-slate-200/80 hover:border-teal-500 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/10">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <Truck className="w-7 h-7 stroke-[2.5px]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                Jemput ke Rumah (EcoRoute)
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Penjemputan on-demand memberdayakan jaringan pemulung sekitar
                rute kerjanya tanpa menggantikan peran mereka.
              </p>
            </Card>

            {/* Card 3 */}
            <Card className="flex flex-col gap-4 p-7 bg-white border border-slate-200/80 hover:border-amber-500 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-7 h-7 stroke-[2.5px]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                Escrow Aman (EcoVault B2B)
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Jaminan transaksi tonase besar pengepul ke pabrik daur ulang
                dengan rekening bersama terverifikasi.
              </p>
            </Card>

            {/* Card 4 */}
            <Card className="flex flex-col gap-4 p-7 bg-white border border-slate-200/80 hover:border-emerald-500 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <LineChart className="w-7 h-7 stroke-[2.5px]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                Laporan ESG (EcoTrack)
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Pencatatan tonase daur ulang dan reduksi estimasi jejak karbon
                untuk kebutuhan kepatuhan lingkungan korporasi.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 4. SECTION KHUSUS PEMULUNG / PENGEPUL MITRA (PERSONAL & NATURAL)   */}
      {/* ==================================================================== */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col gap-12">
          {/* HEADER SECTION */}
          <div className="flex flex-col items-center text-center gap-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/90 border border-emerald-300/80 text-emerald-800 text-sm font-extrabold w-fit mx-auto shadow-xs">
              <Users className="w-4 h-4 text-emerald-600" />{" "}
              {/* Tambahkan ini */}
              <span>KEMITRAAN INKLUSIF</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-heading tracking-tight leading-tight">
              Jadi Mitra EcoChain
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium max-w-xl">
              Pilih peran Anda dan bergabunglah dengan ekosistem daur ulang
              nasional. Tidak ada biaya pendaftaran.
            </p>
          </div>

          {/* KARTU MITRA - DUA KOLOM SEJAJAR (Polos & Bersih) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
            {/* KARTU 1: PEMULUNG */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col gap-5 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                  <Bike className="w-7 h-7 stroke-[2px]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-heading">
                    Mitra Pemulung
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">
                    EcoRoute - Kurir Daur Ulang
                  </p>
                </div>
              </div>

              <ul className="flex flex-col gap-2.5 text-sm font-medium text-slate-600 border-t border-slate-100 pt-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Dapat pesanan penjemputan dari rumah tangga</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Insentif harian langsung cair</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Fitur tracking dan sertifikasi digital</span>
                </li>
              </ul>

              <div className="mt-2">
                <Link href="/register?role=pemulung">
                  <Button
                    variant="primary"
                    className="w-full py-3.5 rounded-xl"
                  >
                    Daftar Jadi Pemulung
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* KARTU 2: PENGEPUL */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col gap-5 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                  <Building2 className="w-7 h-7 stroke-[2px]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-heading">
                    Mitra Pengepul
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">
                    EcoHub - Pengelola Stok
                  </p>
                </div>
              </div>

              <ul className="flex flex-col gap-2.5 text-sm font-medium text-slate-600 border-t border-slate-100 pt-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>Pasokan limbah stabil dari jaringan Pemulung</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>Integrasi langsung ke pabrik daur ulang</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>Laporan ESG otomatis untuk kepatuhan</span>
                </li>
              </ul>

              <div className="mt-2">
                <Link href="/register?role=pengepul">
                  <Button
                    variant="accent"
                    className="w-full py-3.5 rounded-xl text-slate-900"
                  >
                    Daftar Jadi Pengepul
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 5. FOOTER SEDERHANA                                                  */}
      {/* ==================================================================== */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-4 sm:px-6 mt-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12 pb-12 border-b border-slate-800">
          <div className="md:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center transition-transform duration-200">
                <Image
                  src="/logo-ecochain.png"
                  alt="EcoChain Logo"
                  width={36}
                  height={36}
                  className="w-9 h-7"
                  priority
                />
              </div>
              <span className="text-2xl font-black text-emerald-500 tracking-tight font-heading">
                EcoChain
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed font-medium">
              Platform agregator rantai pasok sirkular berbasis AI yang
              menghubungkan rumah tangga, pemulung, dan pengepul langsung dengan
              industri daur ulang Indonesia.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <p className="font-bold text-white uppercase tracking-wider text-xs font-heading">
              Fitur Utama
            </p>
            <Link
              href="/scan"
              className="hover:text-emerald-400 transition-colors font-medium"
            >
              EcoScan AI
            </Link>
            <Link
              href="/pickup"
              className="hover:text-emerald-400 transition-colors font-medium"
            >
              EcoRoute Pickup
            </Link>
            <Link
              href="/dashboard/pengepul"
              className="hover:text-emerald-400 transition-colors font-medium"
            >
              EcoHub Pengepul
            </Link>
            <Link
              href="/dashboard/impact"
              className="hover:text-emerald-400 transition-colors font-medium"
            >
              EcoTrack ESG
            </Link>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <p className="font-bold text-white uppercase tracking-wider text-xs font-heading">
              Kemitraan
            </p>
            <Link
              href="/register?role=pemulung"
              className="hover:text-emerald-400 transition-colors font-medium"
            >
              Gabung Pemulung
            </Link>
            <Link
              href="/register?role=pengepul"
              className="hover:text-emerald-400 transition-colors font-medium"
            >
              Gabung Pengepul
            </Link>
            <Link
              href="/login"
              className="hover:text-emerald-400 transition-colors font-medium"
            >
              Masuk Akun
            </Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 font-medium">
          <p>
            &copy; {new Date().getFullYear()} EcoChain Indonesia. Hak Cipta
            Dilindungi.
          </p>
          <p>
            Standardisasi Harga &amp; Keamanan Transaksi Rantai Pasok Sirkular
          </p>
        </div>
      </footer>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-20 sm:bottom-24 right-4 md:bottom-8 md:right-8 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-lg border border-slate-200/80 shadow-lg flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white hover:scale-110 transition-all duration-300"
        aria-label="Scroll ke atas"
      >
        <ArrowRight className="w-5 h-5 rotate-[-90deg]" />
      </button>
    </main>
  );
}
