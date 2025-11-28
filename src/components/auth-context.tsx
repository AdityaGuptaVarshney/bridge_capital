"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/lib/types";

type AuthCtx = { user: User | null; setUser: (u: User | null) => void; logout: () => void };
const Ctx = createContext<AuthCtx>({ user: null, setUser: () => {}, logout: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const id = localStorage.getItem("bb_user_id");
    const email = localStorage.getItem("bb_user_email");
    if (!email) return;
    fetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email }), headers: { "Content-Type": "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((u) => u && setUser(u))
      .catch(() => {});
  }, []);
  const logout = () => {
    localStorage.removeItem("bb_user_id");
    localStorage.removeItem("bb_user_email");
    setUser(null);
    window.location.href = "/";
  };
  return <Ctx.Provider value={{ user, setUser, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  return useContext(Ctx);
}

