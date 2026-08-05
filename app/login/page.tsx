"use client";

import React from "react";
import Link from "next/link";
import { Button, Card, BigInput } from "@/components/ui";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#F9FAFB] p-4 flex items-center justify-center">
      <Card className="w-full max-w-md flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-[#16A34A] tracking-tight">
            Masuk ke EcoChain
          </h1>
          <p className="text-base text-[#4B5563] mt-1">
            Pilih peran dan masuk ke akun Anda
          </p>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <BigInput
            label="Nomor HP / Email"
            placeholder="Contoh: 081234567890"
            type="text"
            required
          />
          <BigInput
            label="Kata Sandi"
            placeholder="Masukkan kata sandi"
            type="password"
            required
          />

          <Button variant="primary" fullWidth className="mt-2">
            Masuk Sekarang
          </Button>
        </form>

        <div className="text-center text-base text-[#4B5563]">
          Belum punya akun?{" "}
          <Link href="/register" className="text-[#16A34A] font-bold underline">
            Daftar di sini
          </Link>
        </div>
      </Card>
    </main>
  );
}
