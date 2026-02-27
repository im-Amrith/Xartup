"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { HERO_PRICE_DATA } from "@/lib/chart-data";
import { BarChart3, Layers } from "lucide-react";

const TIME_RANGES = ["1D", "7D", "1M", "1Y", "All"] as const;

/* ── Compute derived values once ── */
const MAX_VOLUME = Math.max(...HERO_PRICE_DATA.map((d) => d.volume));
const AVG_PRICE =
  HERO_PRICE_DATA.reduce((s, d) => s + d.price, 0) / HERO_PRICE_DATA.length;
const PRICE_MIN = Math.min(...HERO_PRICE_DATA.map((d) => d.price));
const PRICE_MAX = Math.max(...HERO_PRICE_DATA.map((d) => d.price));

/* ── Custom Tooltip ── */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const price = payload.find((p: any) => p.dataKey === "price");
  const volume = payload.find((p: any) => p.dataKey === "volume");
  // Find the actual date — walk back through data to find last labeled point
  const idx = HERO_PRICE_DATA.findIndex(
    (d) => d.price === price?.value && d.volume === volume?.value
  );
  let displayDate = label;
  if (!displayDate && idx >= 0) {
    // Walk backward to find the nearest month label
    for (let i = idx; i >= 0; i--) {
      if (HERO_PRICE_DATA[i].date) {
        const monthLabel = HERO_PRICE_DATA[i].date;
        const dayOffset = idx - i + 1;
        displayDate = `${monthLabel} · Day ${dayOffset}`;
        break;
      }
    }
  }
  return (
    <div className="bg-[#16181D]/95 backdrop-blur-md border border-[#272A30] rounded-lg p-3 shadow-xl min-w-[170px]">
      <div className="text-[#E5E7EB] text-xs font-medium mb-2">
        {displayDate || "—"}
      </div>
      {price && (
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
          <span className="text-[#828690] text-xs">Price:</span>
          <span className="text-white text-xs font-semibold ml-auto">
            ${price.value.toLocaleString()}
          </span>
        </div>
      )}
      {volume && (
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7] flex-shrink-0" />
          <span className="text-[#828690] text-xs">Vol 24h:</span>
          <span className="text-white text-xs font-semibold ml-auto">
            ${volume.value.toFixed(1)}b
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Toggle Switch ── */
function ToggleSwitch({
  label,
  active,
  onToggle,
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1.5 text-[11px] text-[#828690] hover:text-[#F3F4F6] transition-colors"
    >
      <div
        className={`w-7 h-[14px] rounded-full transition-colors relative ${active ? "bg-[#A855F7]" : "bg-[#272A30]"
          }`}
      >
        <motion.div
          className="w-[10px] h-[10px] rounded-full bg-white absolute top-[2px]"
          animate={{ left: active ? 15 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
      <span className={active ? "text-[#F3F4F6]" : ""}>{label}</span>
    </button>
  );
}

/* ── Custom X-Axis tick: "2025" in white bold, months in muted ── */
function CustomXTick({ x, y, payload }: any) {
  if (!payload.value) return null;
  const isYear = /^\d{4}$/.test(payload.value);
  return (
    <text
      x={x}
      y={y + 12}
      textAnchor="middle"
      fill={isYear ? "#F3F4F6" : "#748297"}
      fontSize={10}
      fontWeight={isYear ? 600 : 400}
      fontFamily="monospace"
    >
      {payload.value}
    </text>
  );
}

export default function HeroAreaChart() {
  const [range, setRange] = useState<string>("1M");
  const [metric, setMetric] = useState<"price" | "mcap">("price");
  const [showVolume, setShowVolume] = useState(true);
  const [showTVL, setShowTVL] = useState(false);
  const [showTx, setShowTx] = useState(false);

  const data = HERO_PRICE_DATA;
  const latestPrice = data[data.length - 1]?.price ?? 0;
  const refPrice = Math.round(AVG_PRICE);

  return (
    <div className="bg-[#16181D] border border-[#272A30] rounded-2xl p-5 h-full flex flex-col shadow-md shadow-black/20">
      {/* ── Header controls ── */}
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        {/* Left: Price / Market cap pill + icons */}
        <div className="flex items-center gap-3">
          <div className="flex bg-[#0D0E12] border border-[#272A30] rounded-lg overflow-hidden">
            <button
              onClick={() => setMetric("price")}
              className={`px-3.5 py-1.5 text-[11px] font-medium transition-colors ${metric === "price"
                  ? "bg-[#272A30] text-[#F3F4F6]"
                  : "text-[#828690] hover:text-[#F3F4F6]"
                }`}
            >
              Price
            </button>
            <button
              onClick={() => setMetric("mcap")}
              className={`px-3.5 py-1.5 text-[11px] font-medium transition-colors ${metric === "mcap"
                  ? "bg-[#272A30] text-[#F3F4F6]"
                  : "text-[#828690] hover:text-[#F3F4F6]"
                }`}
            >
              Market cap
            </button>
          </div>
          <div className="flex items-center gap-0.5 bg-[#0D0E12] border border-[#272A30] rounded-lg px-2 py-1">
            <button className="p-1 text-[#828690] hover:text-[#F3F4F6] transition-colors">
              <BarChart3 size={12} />
            </button>
            <button className="p-1 text-[#828690] hover:text-[#F3F4F6] transition-colors">
              <Layers size={12} />
            </button>
          </div>
        </div>

        {/* Right: Toggles + Time Range */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <ToggleSwitch
              label="Volume"
              active={showVolume}
              onToggle={() => setShowVolume((v) => !v)}
            />
            <ToggleSwitch
              label="TVL"
              active={showTVL}
              onToggle={() => setShowTVL((v) => !v)}
            />
            <ToggleSwitch
              label="Transaction"
              active={showTx}
              onToggle={() => setShowTx((v) => !v)}
            />
          </div>

          <div className="flex gap-0.5 bg-[#0D0E12] rounded-lg p-0.5 border border-[#272A30]">
            {TIME_RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`relative px-2.5 py-1 text-[10px] font-medium rounded-md transition-colors z-10 ${range === r
                    ? "text-[#F3F4F6]"
                    : "text-[#828690] hover:text-[#F3F4F6]"
                  }`}
              >
                {range === r && (
                  <motion.div
                    layoutId="hero-range-pill"
                    className="absolute inset-0 bg-[#272A30] rounded-md"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{r}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Chart ── */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 4, left: -10, bottom: 0 }}
            barCategoryGap="0%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#272A30"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={<CustomXTick />}
              interval={0}
              minTickGap={30}
            />
            {/* Left Y-Axis: Price */}
            <YAxis
              yAxisId="price"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#748297", fontSize: 10, fontFamily: "monospace" }}
              domain={[
                Math.floor(PRICE_MIN / 100) * 100 - 50,
                Math.ceil(PRICE_MAX / 100) * 100 + 100,
              ]}
              tickFormatter={(v) => `$${v}`}
            />
            {/* Right Y-Axis: Volume — domain × 4 so bars sit in bottom 25% */}
            <YAxis
              yAxisId="volume"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#748297", fontSize: 10, fontFamily: "monospace" }}
              domain={[0, MAX_VOLUME * 4]}
              tickFormatter={(v) => `${v}b USD`}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* Reference line — average price */}
            <ReferenceLine
              y={refPrice}
              yAxisId="price"
              stroke="#748297"
              strokeDasharray="3 3"
              strokeOpacity={0.5}
            />
            {/* Volume bars — dense, thin histogram */}
            {showVolume && (
              <Bar
                yAxisId="volume"
                dataKey="volume"
                fill="#747E9A"
                fillOpacity={0.6}
                barSize={1.5}
                radius={[1, 1, 0, 0]}
                isAnimationActive={false}
              />
            )}
            {/* Price line — pale icy cyan, jagged linear */}
            <Line
              yAxisId="price"
              type="linear"
              dataKey="price"
              stroke="#C4F1F9"
              strokeWidth={1.5}
              dot={false}
              activeDot={{
                r: 4,
                fill: "#C4F1F9",
                stroke: "#0D0E12",
                strokeWidth: 2,
              }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
