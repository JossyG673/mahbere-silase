"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import type { Locale } from "@/lib/i18n";

interface AuthUser {
  userId: string;
  email: string;
  role: "admin" | "member";
  token: string;
}

interface AppContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  user: AuthUser | null;
  login: (token: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType>({
  locale: "en",
  setLocale: () => {},
  user: null,
  login: () => {},
  logout: () => {},
});

export function useApp() {
  return useContext(AppContext);
}

function parseJwt(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function ClientShell({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale;
    if (savedLocale === "am" || savedLocale === "en") setLocale(savedLocale);

    const token = localStorage.getItem("token");
    if (token) {
      const payload = parseJwt(token);
      if (payload) {
        setUser({
          userId: payload.userId as string,
          email: payload.email as string,
          role: payload.role as "admin" | "member",
          token,
        });
      }
    }
  }, []);

  const handleSetLocale = useCallback((l: Locale) => {
    setLocale(l);
    localStorage.setItem("locale", l);
  }, []);

  const login = useCallback((token: string) => {
    localStorage.setItem("token", token);
    const payload = parseJwt(token);
    if (payload) {
      setUser({
        userId: payload.userId as string,
        email: payload.email as string,
        role: payload.role as "admin" | "member",
        token,
      });
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  return (
    <AppContext.Provider
      value={{ locale, setLocale: handleSetLocale, user, login, logout }}
    >
      <div className="flex flex-col min-h-screen">
        <Navbar
          locale={locale}
          onLocaleChange={handleSetLocale}
          user={user ? { role: user.role, email: user.email } : null}
          onLogout={logout}
        />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} />
      </div>
    </AppContext.Provider>
  );
}
