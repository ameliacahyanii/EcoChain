"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserRole, Profile } from "@/lib/types";

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
  profile: Partial<Profile> | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>("rumah_tangga");
  const [isLoggedIn, setIsLoggedInState] = useState<boolean>(false);
  const [profile, setProfile] = useState<Partial<Profile> | null>(null);

  useEffect(() => {
    // Load persisted mock role or real session from localStorage
    const savedRole = localStorage.getItem("ecotrade_role") as UserRole | null;
    const savedLoggedIn = localStorage.getItem("ecotrade_logged_in");
    
    if (savedRole) {
      setRoleState(savedRole);
    }
    if (savedLoggedIn === "true") {
      setIsLoggedInState(true);
      setProfile({
        full_name: savedRole === "pemulung" ? "Pak Budi (Pemulung)" : savedRole === "pengepul" ? "Lapak Jaya (Pengepul)" : savedRole === "admin" ? "Admin EcoTrade" : "Siti Rahma (Rumah Tangga)",
        role: savedRole || "rumah_tangga",
        phone_number: "081234567890",
        is_verified_partner: true,
      });
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem("ecotrade_role", newRole);
    if (isLoggedIn) {
      setProfile((prev) => ({
        ...prev,
        role: newRole,
        full_name: newRole === "pemulung" ? "Pak Budi (Mitra Pemulung)" : newRole === "pengepul" ? "Lapak Sejahtera (Pengepul)" : newRole === "admin" ? "Administrator" : "Siti Rahma (Rumah Tangga)",
      }));
    }
  };

  const setIsLoggedIn = (status: boolean) => {
    setIsLoggedInState(status);
    localStorage.setItem("ecotrade_logged_in", status ? "true" : "false");
    if (status) {
      setProfile({
        full_name: role === "pemulung" ? "Pak Budi (Mitra Pemulung)" : role === "pengepul" ? "Lapak Sejahtera (Pengepul)" : role === "admin" ? "Administrator" : "Siti Rahma (Rumah Tangga)",
        role: role,
        phone_number: "081234567890",
        is_verified_partner: true,
      });
    } else {
      setProfile(null);
    }
  };

  const logout = () => {
    setIsLoggedInState(false);
    localStorage.removeItem("ecotrade_logged_in");
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ role, setRole, isLoggedIn, setIsLoggedIn, profile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
