import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import Navigation from "@/components/Navigation";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EcoChain - Platform Agregator Rantai Pasok Sirkular AI",
  description:
    "EcoChain menghubungkan penghasil limbah rumah tangga, pemulung, dan pengepul langsung dengan industri daur ulang di Indonesia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} ${outfit.variable}`}
    >
      <body className="font-sans bg-slate-50/70 text-slate-900 min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
        <AuthProvider>
          <Navigation />
          <div className="flex-1">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
