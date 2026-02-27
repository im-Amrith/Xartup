"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";
import { SECTOR_VOLUME_DATA } from "@/lib/chart-data";
import { TrendingUp, TrendingDown } from "lucide-react";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="bg-[#16181D]/90 backdrop-blur-md border border-[#272A30] rounded-lg px-4 py-3 shadow-2xl">
      <div className="text-xs text-[#F3F4F6] font-medium mb-1">{label}</div>
      <div className="flex items-center gap-3 text-[11px]">
        <span className="text-[#828690] font-mono">{d.count} deals</span>
        <span
          className={`flex items-center gap-0.5 font-mono ${d.change >= 0 ? "text-[#00C278]" : "text-[#F33959]"
            }`}
        >
          {d.change >= 0 ? (
            <TrendingUp size={10} />
          ) : (
            <TrendingDown size={10} />
          )}
          {d.change >= 0 ? "+" : ""}
          {d.change}%
        </span>
      </div>
    </div>
  );
}

export default function VolumeBarChart() {
  const [hovered, setHovered] = useState<number | null>(null);
  const topSectors = SECTOR_VOLUME_DATA.slice(0, 8);

  return (
    <div className="bg-[#16181D] border border-[#272A30] rounded-2xl p-5 h-full flex flex-col shadow-md shadow-black/20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[10px] font-mono text-[#828690] uppercase tracking-wider">
            Sector Activity
          </div>
          <div className="text-lg font-bold text-[#F3F4F6] mt-0.5">
            {SECTOR_VOLUME_DATA.reduce((s, d) => s + d.count, 0)}{" "}
            <span className="text-xs text-[#828690] font-normal">
              total deals
            </span>
          </div>
        </div>
        <span className="text-[10px] font-mono text-[#00C278] flex items-center gap-1">
          <TrendingUp size={10} />
          +8.7% QoQ
        </span>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topSectors}
            margin={{ top: 4, right: 0, left: -24, bottom: 0 }}
            onMouseMove={(state: any) => {
              if (state?.activeTooltipIndex !== undefined) {
                setHovered(state.activeTooltipIndex);
              }
            }}
            onMouseLeave={() => setHovered(null)}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#272A30"
              vertical={false}
            />
            <XAxis
              dataKey="sector"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#828690", fontSize: 9, fontFamily: "monospace" }}
              dy={6}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#828690", fontSize: 9, fontFamily: "monospace" }}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={32}>
              {topSectors.map((_, idx) => (
                <Cell
                  key={idx}
                  fill={
                    hovered === idx
                      ? "#F3F4F6"
                      : "#272A30"
                  }
                  style={{
                    transition: "all 0.2s ease",
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
