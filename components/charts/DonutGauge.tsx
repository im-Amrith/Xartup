"use client";

import { motion } from "framer-motion";
import { PIPELINE_DATA } from "@/lib/chart-data";

export default function DonutGauge() {
  const total = PIPELINE_DATA.reduce((s, d) => s + d.value, 0);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  let cumulativeOffset = 0;

  return (
    <div className="bg-[#16181D] border border-[#272A30] rounded-2xl p-5 h-full flex flex-col shadow-md shadow-black/20">
      <div className="text-[10px] font-mono text-[#828690] uppercase tracking-wider mb-1">
        Pipeline Distribution
      </div>
      <div className="text-lg font-bold text-[#F3F4F6]">
        {total}{" "}
        <span className="text-xs text-[#828690] font-normal">in pipeline</span>
      </div>

      <div className="flex-1 flex items-center justify-center py-2">
        <div className="relative">
          <svg width="170" height="170" viewBox="0 0 180 180">
            {/* Background ring */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="#272A30"
              strokeWidth="14"
            />
            {/* Segments */}
            {PIPELINE_DATA.map((seg, i) => {
              const strokeLength = (seg.value / total) * circumference;
              const offset = cumulativeOffset;
              cumulativeOffset += strokeLength;
              return (
                <motion.circle
                  key={seg.stage}
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="14"
                  strokeDasharray={`${strokeLength} ${circumference - strokeLength}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="round"
                  initial={{ strokeDasharray: `0 ${circumference}` }}
                  animate={{
                    strokeDasharray: `${strokeLength} ${circumference - strokeLength}`,
                  }}
                  transition={{
                    duration: 1,
                    delay: 0.3 + i * 0.15,
                    ease: "easeOut",
                  }}
                  transform="rotate(-90 90 90)"
                />
              );
            })}
          </svg>
          {/* Centre label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <div className="text-2xl font-bold text-[#F3F4F6] text-center font-mono">
                {total}
              </div>
              <div className="text-[10px] font-mono text-[#828690] uppercase tracking-wider text-center">
                Deals
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-auto">
        {PIPELINE_DATA.map((seg) => (
          <div key={seg.stage} className="flex items-center gap-2 text-xs">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                background: seg.color,
              }}
            />
            <span className="text-[#828690] truncate">{seg.stage}</span>
            <span className="text-[#4B5563] font-mono ml-auto">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
