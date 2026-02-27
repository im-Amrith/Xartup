"use client";

import { motion } from "framer-motion";

export default function ThesisScoreBadge({
  score,
  size = "md",
}: {
  score: number;
  size?: "sm" | "md" | "lg";
}) {
  const color =
    score >= 80 ? "score-high" : score >= 60 ? "score-mid" : "score-low";
  const barColor =
    score >= 80
      ? "score-bar-high"
      : score >= 60
        ? "score-bar-mid"
        : "score-bar-low";

  const sizeClasses = {
    sm: "text-xs gap-1.5",
    md: "text-sm gap-2",
    lg: "text-base gap-2.5",
  };

  const barW = { sm: 14, md: 18, lg: 22 };
  const barH = { sm: 2, md: 4, lg: 6 };

  return (
    <div className={`flex items-center ${sizeClasses[size]}`}>
      <div
        className="bg-[#272A30] rounded-full overflow-hidden flex-shrink-0"
        style={{ width: `${barW[size] * 4}px`, height: barH[size] }}
      >
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        />
      </div>
      <span className={`font-mono font-medium tabular-nums ${color}`}>
        {score}
      </span>
    </div>
  );
}
