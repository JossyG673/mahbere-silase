"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Globe, User, LogOut, ChevronDown } from "lucide-react";

interface NavbarProps {
  locale: "en" | "am";
  onLocaleChange: (l: "en" | "am") => void;
  user?: { role: string; email: string } | null;
  onLogout?: () => void;
}

export default function Navbar({
  locale,
  onLocaleChange,
  user,
  onLogout,
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const isAm = locale === "am";

  return (
    <nav className="bg-wine-dark/95 backdrop-blur-md text-white sticky top-0 z-50 border-b border-amber/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-amber/40 group-hover:border-amber transition-colors flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt="ማኅበረ ሥላሴ"
                width={44}
                height={44}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-base leading-tight tracking-wide text-amber-light">
                {isAm ? "ማኅበረ ሥላሴ" : "Mahibere Silassie"}
              </div>
              <div className="text-[10px] text-white/50 leading-tight">
                {isAm ? "የሰበታ ዋታ ቤ/ክ ደጋፊ ማኅበር" : "Sebeta Wata Church Association"}
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-0.5">
            <NavLink href="/">{isAm ? "መነሻ" : "Home"}</NavLink>
            <NavLink href="/events">{isAm ? "ዝግጅቶች" : "Events"}</NavLink>
            <NavLink href="/register">{isAm ? "ይመዝገቡ" : "Register"}</NavLink>
            {user ? (
              <>
                {user.role === "admin" && (
                  <NavLink href="/admin">{isAm ? "አስተዳዳሪ" : "Admin"}</NavLink>
                )}
                <NavLink href="/portal">{isAm ? "መግቢያ" : "Portal"}</NavLink>
                <button
                  onClick={onLogout}
                  className="px-3 py-2 text-sm rounded-lg hover:bg-white/10 transition flex items-center gap-1.5 text-white/70 hover:text-white"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {isAm ? "ውጣ" : "Logout"}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="ml-1 px-4 py-2 text-sm font-semibold rounded-lg bg-amber/90 text-wine-dark hover:bg-amber transition flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                {isAm ? "ግባ" : "Login"}
              </Link>
            )}
            <div className="w-px h-6 bg-white/10 mx-2" />
            <button
              onClick={() => onLocaleChange(isAm ? "en" : "am")}
              className="px-3 py-1.5 text-xs font-bold rounded-full border border-white/15 hover:border-amber/40 hover:bg-white/5 transition flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-amber-light" />
              {isAm ? "EN" : "አማ"}
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-wine-dark border-t border-white/5 animate-slide-down">
          <div className="px-4 py-3 space-y-1">
            <MobileLink href="/" onClick={() => setOpen(false)}>
              {isAm ? "መነሻ" : "Home"}
            </MobileLink>
            <MobileLink href="/events" onClick={() => setOpen(false)}>
              {isAm ? "ዝግጅቶች" : "Events"}
            </MobileLink>
            <MobileLink href="/register" onClick={() => setOpen(false)}>
              {isAm ? "ይመዝገቡ" : "Register"}
            </MobileLink>
            {user ? (
              <>
                {user.role === "admin" && (
                  <MobileLink href="/admin" onClick={() => setOpen(false)}>
                    {isAm ? "አስተዳዳሪ" : "Admin Dashboard"}
                  </MobileLink>
                )}
                <MobileLink href="/portal" onClick={() => setOpen(false)}>
                  {isAm ? "የአባላት መግቢያ" : "Member Portal"}
                </MobileLink>
                <button
                  onClick={() => { onLogout?.(); setOpen(false); }}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-sm hover:bg-white/5 flex items-center gap-2 text-white/70"
                >
                  <LogOut className="w-4 h-4" />
                  {isAm ? "ውጣ" : "Logout"}
                </button>
              </>
            ) : (
              <MobileLink href="/login" onClick={() => setOpen(false)}>
                <User className="w-4 h-4 inline mr-1.5" />
                {isAm ? "ግባ" : "Login"}
              </MobileLink>
            )}
            <div className="pt-2 border-t border-white/5">
              <button
                onClick={() => { onLocaleChange(isAm ? "en" : "am"); setOpen(false); }}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm hover:bg-white/5 flex items-center gap-2 text-amber-light"
              >
                <Globe className="w-4 h-4" />
                {isAm ? "Switch to English" : "ወደ አማርኛ ቀይር"}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-white/8 transition text-white/80 hover:text-white"
    >
      {children}
    </Link>
  );
}

function MobileLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-2.5 rounded-lg text-sm hover:bg-white/5 text-white/80"
    >
      {children}
    </Link>
  );
}
