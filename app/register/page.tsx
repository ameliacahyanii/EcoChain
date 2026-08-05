"use client";

import React from "react";
import Link from "next/link";
import { Button, Card, BigInput } from "@/components/ui";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#F9FAFB] p-4 flex items-center justify-center">
      <Card className="w-full max-w-md flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-[#16A34A] tracking-tight">Daftar Akun EcoTrade</h1>
          <p className="text-base text-[#4B5563] mt-1">
            Bergabung untuk transaksi daur ulang adil & transparan
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <BigInput
            label="Nama Lengkap"
            placeholder="Masukkan nama sesuai KTP"
            type="text"
            required
          />
          <BigInput
            label="Nomor WhatsApp / HP"
            placeholder="Contoh: 081234567890"
            type="tel"
            required
          />
          <BigInput
            label="Kata Sandi"
            placeholder="Minimal 6 karakter"
            type="password"
            required
          />

          <Button variant="primary" fullWidth className="mt-2">
            Daftar Akun Baru
          </Button>
        </form>

        <div className="text-center text-base text-[#4B5563]">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-[#16A34A] font-bold underline">
            Masuk ke Akun
          </Link>
        </div>
      </Card>
    </main>
  );
}
