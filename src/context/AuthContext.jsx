"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/auth/me")
      .then((data) => setUser(data.usuario))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, senha) {
    const data = await api("/auth/login", { method: "POST", body: { email, senha } });
    setUser(data.usuario);
  }

  async function register(dados) {
    const data = await api("/auth/register", { method: "POST", body: dados });
    setUser(data.usuario);
  }

  async function logout() {
    await api("/auth/logout", { method: "POST" });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);