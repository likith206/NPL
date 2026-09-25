"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages, BookOpen, GraduationCap, Users, ShieldAlert, Radio, Sparkles, Menu, X, Cpu } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "AI Translator", href: "/translate", icon: Languages },
    { name: "Live Speech", href: "/live", icon: Radio },
    { name: "Dictionary", href: "/dictionary", icon: BookOpen },
    { name: "Learning Hub", href: "/learn", icon: GraduationCap },
    { name: "Community Hub", href: "/contribute", icon: Users },
    { name: "Pipeline", href: "/pipeline", icon: Cpu },
    { name: "Review Queue", href: "/review", icon: ShieldAlert },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-900/20 heritage-glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-600 via-orange-600 to-amber-800 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform border border-amber-400/30">
              <span className="text-xl font-extrabold text-amber-100">HV</span>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-amber-50 group-hover:text-amber-300 transition-colors">
                Heritage<span className="gradient-text-heritage">Voice</span>
              </span>
              <p className="text-[10px] text-amber-400/70 font-mono uppercase tracking-widest">
                Dravidian AI Preservation
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-amber-600/20 text-amber-300 border border-amber-500/30 shadow-sm"
                      : "text-neutral-300 hover:text-amber-200 hover:bg-neutral-800/50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-neutral-400"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-950/60 border border-amber-700/30 text-xs font-medium text-amber-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Kodava & Tulu</span>
            </div>

            <Link
              href="/translate"
              className="hidden sm:inline-flex px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-amber-950 shadow-glow transition-all active:scale-95"
            >
              Translate Now
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-neutral-900 border border-amber-500/20 text-amber-200 hover:bg-neutral-800 transition-all"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-amber-900/30 space-y-2 pb-6 animate-fadeIn">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-amber-600/20 text-amber-300 border border-amber-500/30"
                      : "text-neutral-300 hover:text-amber-200 hover:bg-neutral-900/50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-neutral-400"}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </header>
  );
}

