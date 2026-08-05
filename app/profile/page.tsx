"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { useAuth } from "@/lib/context/AuthContext";
import {
  User,
  ArrowLeft,
  ShieldCheck,
  Phone,
  MapPin,
  LogOut,
  MessageCircle,
} from "lucide-react";

export default function ProfilePage() {
  const { role, profile, logout } = useAuth();

  // State untuk ID Akun (Aman dari Hydration Error)
  const [userId, setUserId] = useState("Memuat...");

  useEffect(() => {
    // Hanya berjalan di Client (Browser)
    const randomId = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");
    setUserId(randomId);
  }, []);

  // Role Labels yang lebih singkat dan clean
  const roleNames = {
    rumah_tangga: "Rumah Tangga",
    pemulung: "Pemulung Mitra",
    pengepul: "Pengepul Mitra",
    admin: "Administrator",
  };

  // Menentukan warna badge berdasarkan role
  const getRoleBadgeColor = (role: keyof typeof roleNames) => {
    switch (role) {
      case "pemulung":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pengepul":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "admin":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-teal-50 text-teal-700 border-teal-200";
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/70 p-4 sm:p-6 max-w-2xl mx-auto flex flex-col gap-6 pb-24">
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
              <User className="w-4 h-4" />
            </div>
            Profil Saya
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-2">
            Kelola data akun & status kemitraan
          </p>
        </div>
      </div>

      {/* MAIN PROFILE CARD - Premium Glassmorphism */}
      <Card className="flex flex-col gap-6 p-6 sm:p-8 bg-white/90 backdrop-blur-sm border border-slate-200/80 shadow-xl shadow-slate-200/50 rounded-3xl">
        {/* BAGIAN ATAS: Avatar & Nama */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-slate-200/60">
          <div className="relative shrink-0">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 opacity-20 blur-md" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-emerald-500/25 border-2 border-white">
              {profile?.full_name ? (
                profile.full_name.charAt(0).toUpperCase()
              ) : (
                <User className="w-8 h-8 stroke-[2.5px]" />
              )}
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-start gap-2 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-black text-slate-900 font-heading">
                {profile?.full_name || "Pengguna EcoChain"}
              </h2>
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold border ${getRoleBadgeColor(role)}`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {roleNames[role]}
              </div>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Terdaftar sejak{" "}
              {new Date().toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
              })}
            </p>
          </div>
        </div>

        {/* BAGIAN TENGAH: Detail Informasi dengan Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Kartu Informasi 1: Kontak */}
          <div className="flex flex-col gap-2 p-4 bg-slate-50/70 rounded-2xl border border-slate-200/60">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Kontak Utama
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>081234567890</span>
              </div>
            </div>
          </div>

          {/* Kartu Informasi 2: Alamat */}
          <div className="flex flex-col gap-2 p-4 bg-slate-50/70 rounded-2xl border border-slate-200/60">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Alamat Terdaftar
            </div>
            <div className="flex items-start gap-2.5 text-sm font-medium text-slate-700">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                Jakarta Selatan, DKI Jakarta
              </span>
            </div>
          </div>
        </div>

        {/* BAGIAN BAWAH: Tombol Aksi */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-200/60 mt-2">
          <Button
            variant="danger"
            onClick={logout}
            className="w-full sm:w-auto py-3.5 rounded-2xl bg-red-50 text-red-600 border border-red-200/80 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm"
          >
            <LogOut className="w-5 h-5 mr-2 stroke-[2.5px]" />
            Keluar dari Akun
          </Button>

          <Button
            variant="outline"
            className="group w-full sm:w-auto py-3.5 rounded-2xl border-slate-200/80 hover:border-emerald-400 transition-colors"
          >
            <MessageCircle className="w-5 h-5 mr-2 text-slate-400 group-hover:text-emerald-500 transition-colors" />
            Hubungi Dukungan
          </Button>
        </div>
      </Card>
    </main>
  );
}
