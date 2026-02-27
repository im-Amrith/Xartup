"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { PORTFOLIO_GROWTH_DATA } from "@/lib/chart-data";
import { TrendingUp } from "lucide-react";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#16181D]/90 backdrop-blur-md border border-[#272A30] rounded-lg px-4 py-3 shadow-2xl">
      <div className="text-[10px] text-[#828690] font-mono uppercase tracking-wider mb-2">
        {label}
      </div>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-4 text-[11px]">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: p.color }}
            />
            <span className="text-[#828690] capitalize">{p.dataKey}</span>
          </div>
          <span className="text-[#F3F4F6] font-mono font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function GrowthLineChart() {
  const latest = PORTFOLIO_GROWTH_DATA[PORTFOLIO_GROWTH_DATA.length - 1];
  const first = PORTFOLIO_GROWTH_DATA[0];
  const growth = (((latest.value - first.value) / first.value) * 100).toFixed(1);

  return (
    <div className="bg-[#16181D] border border-[#272A30] rounded-2xl p-5 h-full flex flex-col shadow-md shadow-black/20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[10px] font-mono text-[#828690] uppercase tracking-wider">
            Portfolio Growth
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-lg font-bold text-[#F3F4F6]">{latest.value}</span>
            <span className="text-[11px] font-mono text-[#00C278] flex items-center gap-0.5">
              <TrendingUp size={10} />+{growth}%
            </span>
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={PORTFOLIO_GROWTH_DATA}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#272A30"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#828690", fontSize: 9, fontFamily: "monospace" }}
              dy={6}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#828690", fontSize: 9, fontFamily: "monospace" }}
              domain={["dataMin - 10", "dataMax + 10"]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="benchmark"
              stroke="#272A30"
              strokeWidth={1}
              strokeDasharray="4 4"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#00C278"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 5,
                fill: "#00C278",
                stroke: "#0D0E12",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-[10px] text-[#828690]">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 rounded-full bg-[#00C278]" />
          Portfolio
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 rounded-full bg-[#272A30]" />
          Benchmark
        </div>
      </div>
    </div>
  );
}
