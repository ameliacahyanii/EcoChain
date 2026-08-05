"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import Image from "next/image";
import { UserRole } from "@/lib/types";
import {
  Home,
  Camera,
  Truck,
  History,
  User,
  LayoutDashboard,
  Package,
  CheckSquare,
  Tags,
  LogOut,
  LogIn,
  RefreshCw,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ROLE_DOT: Record<UserRole, string> = {
  rumah_tangga: "bg-slate-400",
  pemulung: "bg-accent",
  pengepul: "bg-secondary",
  admin: "bg-primary-hover",
};

const ROLE_ROW_ACTIVE: Record<UserRole, string> = {
  rumah_tangga: "bg-slate-100 text-neutral-text",
  pemulung: "bg-amber-50 text-amber-700",
  pengepul: "bg-teal-50 text-teal-700",
  admin: "bg-primary-light text-primary-hover",
};

export const Navigation: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { role, setRole, isLoggedIn, setIsLoggedIn, logout } = useAuth();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const getNavItems = (currentRole: UserRole): NavItem[] => {
    switch (currentRole) {
      case "pemulung":
        return [
          { label: "Beranda", href: "/", icon: Home },
          { label: "Scan Barang", href: "/scan", icon: Camera },
          { label: "Jemput", href: "/pickup", icon: Truck },
          { label: "Riwayat", href: "/history", icon: History },
          { label: "Profil", href: "/profile", icon: User },
        ];
      case "pengepul":
        return [
          {
            label: "Dashboard",
            href: "/dashboard/pengepul",
            icon: LayoutDashboard,
          },
          { label: "Stok", href: "/inventory", icon: Package },
          { label: "Riwayat", href: "/history", icon: History },
          { label: "Profil", href: "/profile", icon: User },
        ];
      case "admin":
        return [
          {
            label: "Admin Hub",
            href: "/dashboard/admin",
            icon: LayoutDashboard,
          },
          {
            label: "Verifikasi",
            href: "/admin/verification",
            icon: CheckSquare,
          },
          { label: "Kategori", href: "/admin/categories", icon: Tags },
          { label: "Profil", href: "/profile", icon: User },
        ];
      case "rumah_tangga":
      default:
        return [
          { label: "Beranda", href: "/", icon: Home },
          { label: "Scan Barang", href: "/scan", icon: Camera },
          { label: "Riwayat", href: "/history", icon: History },
          { label: "Profil", href: "/profile", icon: User },
        ];
    }
  };

  const navItems = getNavItems(role);

  const roleLabels: Record<UserRole, string> = {
    rumah_tangga: "Rumah Tangga",
    pemulung: "Pemulung (EcoRoute)",
    pengepul: "Pengepul Mitra",
    admin: "Admin",
  };

  return (
    <>
      {/* ========================================== */}
      {/* DESKTOP HEADER & TOP NAVIGATION BAR         */}
      {/* ========================================== */}
      <header className="sticky top-0 z-40 bg-neutral-bg/95 backdrop-blur-sm border-b border-neutral-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 flex items-center justify-center rounded-full bg-primary-light transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/logo-ecochain.png"
                alt="EcoChain Logo"
                width={22}
                height={22}
                className="w-[30px] h-[22px]"
                priority
              />
            </div>

            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight font-heading text-neutral-text group-hover:text-primary transition-colors">
                EcoChain
              </span>
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase -mt-0.5 text-accent-hover">
                Rantai Pasok Sirkular
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links — underline tabs, not a pill-in-pill box */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 flex items-center gap-2 text-sm font-bold transition-colors ${
                    isActive
                      ? "text-neutral-text"
                      : "text-slate-500 hover:text-primary"
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.label}</span>
                  <span
                    className={`absolute left-3 right-3 -bottom-[1px] h-[2px] rounded-full bg-primary transition-opacity ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Role Switcher & Auth Actions */}
          <div className="flex items-center gap-2.5">
            {/* Quick Demo Role Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="min-h-[44px] pl-3 pr-3 py-2 rounded-full border border-neutral-border bg-white hover:bg-slate-50 flex items-center gap-2 text-sm font-bold text-neutral-text transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                title="Pilih Peran Pengguna (Untuk Pengujian Demo)"
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${ROLE_DOT[role]}`}
                />
                <span className="hidden sm:inline font-normal text-slate-400">
                  Peran:
                </span>
                <span className="font-extrabold truncate max-w-[110px] sm:max-w-[160px] text-primary">
                  {roleLabels[role]}
                </span>
                <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-neutral-border py-2 z-50 shadow-lg">
                  <div className="px-4 py-2 border-b border-neutral-border text-[10px] font-black tracking-[0.15em] uppercase text-slate-400">
                    Pilih Peran Demo
                  </div>
                  {(
                    [
                      "rumah_tangga",
                      "pemulung",
                      "pengepul",
                      "admin",
                    ] as UserRole[]
                  ).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setRole(r);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm font-semibold transition-colors flex items-center gap-2.5 min-h-[44px] ${
                        role === r
                          ? ROLE_ROW_ACTIVE[r] + " font-bold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${ROLE_DOT[r]}`}
                      />
                      <span className="flex-1">{roleLabels[r]}</span>
                      {role === r && (
                        <span className="text-primary font-bold">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Login / Logout Button */}
            {isLoggedIn ? (
              <button
                onClick={() => logout()}
                className="min-h-[44px] min-w-[44px] px-4 py-2 rounded-full bg-red-50 text-danger font-bold text-sm hover:bg-red-100 flex items-center gap-2 transition-colors border border-danger/20"
                title="Keluar Akun"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsLoggedIn(true);
                  router.push("/");
                }}
                className="min-h-[44px] px-5 py-2 rounded-full bg-primary hover:bg-primary-hover text-white font-bold text-sm flex items-center gap-2 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk Demo</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-neutral-bg border-t border-neutral-border px-3 py-2">
        <nav className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center min-h-[48px] min-w-[48px] px-2 py-1 select-none"
                aria-label={item.label}
              >
                <span
                  className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
                    isActive ? "bg-primary" : ""
                  }`}
                >
                  <Icon
                    className={`w-[18px] h-[18px] ${isActive ? "text-white" : "text-slate-400"}`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </span>
                <span
                  className={`text-[11px] leading-tight mt-1 tracking-tight font-semibold ${
                    isActive ? "text-neutral-text" : "text-slate-400"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom spacer for mobile layout */}
      <div className="md:hidden h-16 w-full" aria-hidden="true" />
    </>
  );
};

export default Navigation;
