"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Command, Zap, Bell } from "lucide-react";

const NAV_LINKS = [
  { label: "Dashboard", href: "/" },
  { label: "Companies", href: "/companies" },
  { label: "Lists", href: "/lists" },
  { label: "Saved", href: "/saved" },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-[#16181D] border-b border-[#272A30]">
      <div className="flex items-center justify-between h-14 px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center">
            <Zap size={15} className="text-[#0D0E12]" />
          </div>
          <span className="font-semibold text-[#F3F4F6] text-sm tracking-tight">
            VC Intel
          </span>
        </Link>

        {/* Centre Nav */}
        <div className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-[13px] font-medium transition-colors rounded-lg ${isActive
                    ? "text-[#F3F4F6]"
                    : "text-[#828690] hover:text-[#F3F4F6] hover:bg-white/[0.03]"
                  }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-active-pill"
                    className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-[#F3F4F6]"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0D0E12] border border-[#272A30] rounded-lg px-3.5 py-[7px] text-[13px] text-[#828690] w-56 cursor-pointer hover:border-[#3A3D44] transition-all">
            <Search size={14} />
            <span className="flex-1">Search...</span>
            <kbd className="text-[10px] font-mono bg-[#16181D] px-1.5 py-0.5 rounded-md text-[#828690] flex items-center gap-0.5 border border-[#272A30]">
              <Command size={9} />K
            </kbd>
          </div>
          <button className="relative p-2 rounded-lg text-[#828690] hover:text-[#F3F4F6] hover:bg-white/[0.04] transition-all">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#F3F4F6]" />
          </button>
          <div className="w-8 h-8 rounded-full bg-[#272A30] flex items-center justify-center text-[11px] font-bold text-[#F3F4F6]">
            VC
          </div>
        </div>
      </div>
    </nav>
  );
}
