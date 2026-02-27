"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import HeroAreaChart from "@/components/charts/HeroAreaChart";
import VolumeBarChart from "@/components/charts/VolumeBarChart";
import DonutGauge from "@/components/charts/DonutGauge";
import GrowthLineChart from "@/components/charts/GrowthLineChart";
import { DASHBOARD_STATS } from "@/lib/chart-data";
import { MOCK_COMPANIES } from "@/lib/mock-data";
import {
  TrendingUp,
  Zap,
  ArrowUpRight,
  BarChart3,
  DollarSign,
} from "lucide-react";

const topCompanies = [...MOCK_COMPANIES]
  .sort((a, b) => b.thesisScore - a.thesisScore)
  .slice(0, 5);

const stats = [
  {
    label: "Deal Flow",
    value: DASHBOARD_STATS.totalDealFlow,
    change: `+${DASHBOARD_STATS.dealFlowChange}%`,
    positive: true,
    icon: BarChart3,
  },
  {
    label: "Capital Tracked",
    value: DASHBOARD_STATS.totalCapital,
    change: "+14.2%",
    positive: true,
    icon: DollarSign,
  },
  {
    label: "Avg Score",
    value: DASHBOARD_STATS.avgThesisScore,
    change: `+${DASHBOARD_STATS.scoreChange}%`,
    positive: true,
    icon: TrendingUp,
  },
  {
    label: "Active Signals",
    value: DASHBOARD_STATS.activeSignals.toLocaleString(),
    change: `+${DASHBOARD_STATS.signalChange}%`,
    positive: true,
    icon: Zap,
  },
];

export default function Home() {
  return (
    <PageWrapper>
      <div className="flex-1 overflow-auto px-6 py-6">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.06 }}
              className="bg-[#16181D] border border-[#272A30] rounded-2xl p-5 hover:scale-[1.02] hover:border-[#3A3D44] transition-all cursor-default group shadow-md shadow-black/20"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-[#828690] uppercase tracking-wider">
                  {stat.label}
                </span>
                <stat.icon
                  size={14}
                  className="text-[#828690] opacity-50 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-[#F3F4F6] font-mono">
                  {stat.value}
                </span>
                <span
                  className={`text-xs font-mono ${stat.positive ? "text-[#00C278]" : "text-[#F33959]"
                    }`}
                >
                  {stat.change}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hero chart + Top companies panel */}
        <div
          className="grid grid-cols-3 gap-4 mb-4"
          style={{ height: "340px" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-2 h-full"
          >
            <HeroAreaChart />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="h-full"
          >
            <div className="bg-[#16181D] border border-[#272A30] rounded-2xl h-full flex flex-col overflow-hidden shadow-md shadow-black/20">
              <div className="px-5 py-4 border-b border-[#272A30] flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#828690] uppercase tracking-wider">
                  Top by Score
                </span>
                <Link
                  href="/companies"
                  className="text-[10px] text-[#F3F4F6] hover:text-white flex items-center gap-0.5 transition-colors"
                >
                  View all <ArrowUpRight size={9} />
                </Link>
              </div>
              <div className="flex-1 overflow-auto">
                {topCompanies.map((c, i) => (
                  <Link
                    key={c.id}
                    href={`/companies/${c.id}`}
                    className="flex items-center gap-3 px-5 py-2.5 border-b border-[#272A30]/50 last:border-0 hover:bg-white/[0.02] transition-colors group"
                  >
                    <span className="text-[10px] font-mono text-[#828690] w-3">
                      {i + 1}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-[#272A30] flex items-center justify-center text-[11px] font-bold text-[#828690] border border-[#272A30] group-hover:text-[#F3F4F6] transition-colors">
                      {c.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-[#F3F4F6] group-hover:text-white transition-colors truncate">
                        {c.name}
                      </div>
                      <div className="text-[10px] text-[#828690] font-mono">
                        {c.sector}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 h-1 rounded-full bg-[#272A30] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${c.thesisScore}%` }}
                          transition={{
                            delay: 0.5 + i * 0.1,
                            duration: 0.6,
                          }}
                          className="h-full rounded-full"
                          style={{
                            background:
                              c.thesisScore >= 80
                                ? "#00C278"
                                : c.thesisScore >= 60
                                  ? "#828690"
                                  : "#4B5563",
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-[#828690] w-5 text-right">
                        {c.thesisScore}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom analytics grid */}
        <div
          className="grid grid-cols-3 gap-4"
          style={{ height: "280px" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="h-full"
          >
            <VolumeBarChart />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="h-full"
          >
            <DonutGauge />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="h-full"
          >
            <GrowthLineChart />
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
