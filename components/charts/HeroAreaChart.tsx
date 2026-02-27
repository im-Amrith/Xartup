"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { DEAL_FLOW_DATA } from "@/lib/chart-data";

const TIME_RANGES = ["3M", "6M", "1Y", "All"] as const;

function rangeSlice(range: string) {
  if (range === "3M") return DEAL_FLOW_DATA.slice(-3);
  if (range === "6M") return DEAL_FLOW_DATA.slice(-6);
  if (range === "1Y") return DEAL_FLOW_DATA.slice(-12);
  return DEAL_FLOW_DATA;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#16181D]/90 backdrop-blur-md border border-[#272A30] rounded-lg px-4 py-3 shadow-2xl min-w-[160px]">
      <div className="text-[10px] text-[#828690] font-mono uppercase tracking-wider mb-2">
        {label}
      </div>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: p.color }}
            />
            <span className="text-[#828690] capitalize text-xs">
              {p.dataKey}
            </span>
          </div>
          <span className="text-[#F3F4F6] font-mono text-xs font-semibold">
            {p.dataKey === "capital" ? `$${p.value}M` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function HeroAreaChart() {
  const [range, setRange] = useState<string>("All");
  const data = rangeSlice(range);
  const latestCapital = data[data.length - 1]?.capital ?? 0;
  const prevCapital = data[data.length - 2]?.capital ?? 0;
  const change = prevCapital
    ? (((latestCapital - prevCapital) / prevCapital) * 100).toFixed(1)
    : "0";

  return (
    <div className="bg-[#16181D] border border-[#272A30] rounded-2xl p-5 h-full flex flex-col shadow-md shadow-black/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div>
          <div className="text-[10px] font-mono text-[#828690] uppercase tracking-wider">
            Capital Deployed
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-[#F3F4F6]">
              ${latestCapital}M
            </span>
            <span
              className={`text-xs font-mono ${Number(change) >= 0 ? "text-[#00C278]" : "text-[#F33959]"
                }`}
            >
              {Number(change) >= 0 ? "+" : ""}
              {change}%
            </span>
          </div>
        </div>
        <div className="flex gap-0.5 bg-[#0D0E12] rounded-lg p-1 border border-[#272A30]">
          {TIME_RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`relative px-3 py-1.5 text-[11px] font-medium rounded-md transition-colors z-10 ${range === r
                  ? "text-[#F3F4F6]"
                  : "text-[#828690] hover:text-[#F3F4F6]"
                }`}
            >
              {range === r && (
                <motion.div
                  layoutId="chart-range-pill"
                  className="absolute inset-0 bg-[#272A30] rounded-md"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{r}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 mt-2 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 4, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="capitalGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.08} />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="dealsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#828690" stopOpacity={0.06} />
                <stop offset="100%" stopColor="#828690" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#272A30"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#828690", fontSize: 10, fontFamily: "monospace" }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#828690", fontSize: 10, fontFamily: "monospace" }}
              tickFormatter={(v) => `$${v}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="capital"
              stroke="#FFFFFF"
              strokeWidth={2}
              fill="url(#capitalGrad)"
              dot={false}
              activeDot={{
                r: 5,
                fill: "#FFFFFF",
                stroke: "#0D0E12",
                strokeWidth: 2,
              }}
            />
            <Area
              type="monotone"
              dataKey="deals"
              stroke="#828690"
              strokeWidth={1.5}
              fill="url(#dealsGrad)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#828690",
                stroke: "#0D0E12",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
