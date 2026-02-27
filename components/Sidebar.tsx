"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Building2,
  BookMarked,
  Search,
  Zap,
  TrendingUp,
  Settings,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/lists", label: "Lists", icon: BookMarked },
  { href: "/saved", label: "Saved Searches", icon: Search },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 flex-shrink-0 bg-[#16181D] border-r border-[#272A30] rounded-none flex flex-col h-full sticky top-0 z-30">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#272A30]">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
            <Zap size={15} className="text-[#0D0E12]" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-[15px] font-semibold text-[#F3F4F6] leading-tight tracking-tight">
              Scout
            </div>
            <div className="text-[10px] font-mono text-[#828690] leading-tight tracking-[0.15em]">
              VC INTELLIGENCE
            </div>
          </div>
        </Link>
      </div>

      {/* Thesis chip */}
      <div className="mx-4 mt-4 px-3.5 py-2.5 rounded-xl bg-[#16181D] border border-[#272A30]">
        <div className="flex items-center gap-1.5 mb-1">
          <TrendingUp size={11} className="text-[#828690]" />
          <span className="text-[10px] font-mono text-[#828690] uppercase tracking-[0.12em]">
            Active Thesis
          </span>
        </div>
        <p className="text-[11px] text-[#828690] leading-snug">
          AI-native B2B SaaS · Seed–Series A · $1M–$5M tickets
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 mt-5 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className="block relative">
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-[#272A30]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <div
                className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-colors ${active
                    ? "text-[#F3F4F6] font-medium"
                    : "text-[#828690] hover:text-[#F3F4F6]"
                  }`}
              >
                <Icon
                  size={16}
                  className={
                    active ? "text-[#F3F4F6]" : "text-[#828690]"
                  }
                  strokeWidth={active ? 2.2 : 1.8}
                />
                {label}
                {active && (
                  <ChevronRight
                    size={12}
                    className="ml-auto text-[#828690]"
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-[#272A30]">
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#828690] hover:text-[#F3F4F6] hover:bg-white/[0.03] text-xs transition-all">
          <Settings size={14} />
          <span>Preferences</span>
        </button>
        <div className="mt-2 px-3">
          <div className="text-[10px] font-mono text-[#4B5563]">
            v1.0.0 · Scout MVP
          </div>
        </div>
      </div>
    </aside>
  );
}
