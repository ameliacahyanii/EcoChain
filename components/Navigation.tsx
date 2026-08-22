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
  LucideIcon,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
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
      {/* DESKTOP & MOBILE HEADER                     */}
      {/* ========================================== */}
      <header className="sticky top-0 z-40 bg-neutral-bg/95 backdrop-blur-sm border-b border-neutral-border">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-primary-light transition-transform duration-200 group-hover:scale-105 shrink-0">
              <Image
                src="/logo-ecochain.png"
                alt="EcoChain Logo"
                width={22}
                height={22}
                className="w-6 h-5 sm:w-[30px] sm:h-[22px]"
                priority
              />
            </div>

            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black tracking-tight font-heading text-neutral-text group-hover:text-primary transition-colors leading-tight">
                EcoChain
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.12em] uppercase text-accent-hover leading-tight">
                Rantai Pasok Sirkular
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links — underline tabs */}
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
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Quick Demo Role Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="min-h-[40px] sm:min-h-[44px] px-2.5 sm:px-3 py-1.5 rounded-full border border-neutral-border bg-white hover:bg-slate-50 flex items-center gap-1.5 text-xs sm:text-sm font-bold text-neutral-text transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                title="Pilih Peran Pengguna (Untuk Pengujian Demo)"
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${ROLE_DOT[role]}`}
                />
                <span className="hidden sm:inline font-normal text-slate-400">
                  Peran:
                </span>
                <span className="font-extrabold truncate max-w-[85px] sm:max-w-[160px] text-primary">
                  {roleLabels[role]}
                </span>
                <RefreshCw className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-1.5rem)] bg-white rounded-xl border border-neutral-border py-2 z-50 shadow-lg">
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
                      className={`w-full text-left px-4 py-3 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2.5 min-h-[44px] ${
                        role === r
                          ? ROLE_ROW_ACTIVE[r] + " font-bold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${ROLE_DOT[r]}`}
                      />
                      <span className="flex-1 truncate">{roleLabels[r]}</span>
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
                className="min-h-[40px] sm:min-h-[44px] min-w-[40px] px-3 sm:px-4 py-1.5 rounded-full bg-red-50 text-danger font-bold text-xs sm:text-sm hover:bg-red-100 flex items-center gap-1.5 transition-colors border border-danger/20"
                title="Keluar Akun"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsLoggedIn(true);
                  router.push("/");
                }}
                className="min-h-[40px] sm:min-h-[44px] px-3 sm:px-5 py-1.5 rounded-full bg-primary hover:bg-primary-hover text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shrink-0"
              >
                <LogIn className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Masuk Demo</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ========================================== */}
      {/* MOBILE BOTTOM NAVIGATION BAR                */}
      {/* ========================================== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-neutral-bg/95 backdrop-blur-md border-t border-neutral-border px-2 py-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] shadow-lg">
        <nav className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 select-none"
                aria-label={item.label}
              >
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                    isActive ? "bg-primary text-white shadow-xs" : ""
                  }`}
                >
                  <Icon
                    className={`w-[18px] h-[18px] ${isActive ? "text-white" : "text-slate-400"}`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </span>
                <span
                  className={`text-[10px] leading-tight mt-0.5 tracking-tight font-semibold ${
                    isActive ? "text-neutral-text font-bold" : "text-slate-400"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

    </>
  );
};

export default Navigation;
