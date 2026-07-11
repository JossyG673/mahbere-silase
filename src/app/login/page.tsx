"use client";

import ClientShell, { useApp } from "@/components/ClientShell";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight } from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const { locale, login } = useApp();
  const isAm = locale === "am";
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login failed"); return; }
      login(data.token);
      router.push(data.user.role === "admin" ? "/admin" : "/portal");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-linen" />
      <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-[0.04]" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4 border-3 border-amber/30 shadow-lg">
            <Image src="/images/logo.png" alt="Logo" width={64} height={64} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-slate">
            {isAm ? "እንኳን ደህና መጡ" : "Welcome Back"}
          </h1>
          <p className="text-slate-light mt-1 text-sm">
            {isAm
              ? "ወደ ማኅበረ ሥላሴ የአባላት መግቢያ"
              : "Sign in to your Mahibere Silassie account"}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 card-shadow-lg border border-sand/50">
          {error && (
            <div className="bg-red-50 text-danger text-sm p-3 rounded-xl mb-4 border border-red-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-danger flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate mb-1.5">
                {isAm ? "ኢሜይል" : "Email"}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-light/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-sand rounded-xl focus:ring-2 focus:ring-wine/20 focus:border-wine transition text-sm bg-ivory/50"
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate mb-1.5">
                {isAm ? "የይለፍ ቃል" : "Password"}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-light/50" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 border border-sand rounded-xl focus:ring-2 focus:ring-wine/20 focus:border-wine transition text-sm bg-ivory/50"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-light/50 hover:text-slate transition"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-wine text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="w-5 h-5" />
              )}
              {isAm ? "ግባ" : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-light">
            {isAm ? "መለያ የለዎትም?" : "Don\u2019t have an account?"}{" "}
            <Link href="/register" className="text-wine font-semibold hover:text-amber-dark transition">
              {isAm ? "ይመዝገቡ" : "Register"}
            </Link>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-linen rounded-xl text-xs text-slate-light border border-sand/50">
            <p className="font-bold text-slate mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal" />
              {isAm ? "የሙከራ መለያዎች" : "Demo Credentials"}
            </p>
            <div className="space-y-1">
              <p><span className="font-semibold text-wine">Admin:</span> admin@mahiberesilassie.org / admin123</p>
              <p><span className="font-semibold text-teal">Member:</span> member@example.com / member123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <ClientShell>
      <LoginForm />
    </ClientShell>
  );
}
