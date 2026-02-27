// ─── Deal Flow & Capital Deployed (18 months) ───
export const DEAL_FLOW_DATA = [
  { month: "Sep '24", deals: 11, capital: 42.5 },
  { month: "Oct '24", deals: 14, capital: 58.2 },
  { month: "Nov '24", deals: 9, capital: 35.8 },
  { month: "Dec '24", deals: 7, capital: 28.4 },
  { month: "Jan '25", deals: 16, capital: 67.3 },
  { month: "Feb '25", deals: 19, capital: 78.1 },
  { month: "Mar '25", deals: 22, capital: 92.4 },
  { month: "Apr '25", deals: 18, capital: 71.6 },
  { month: "May '25", deals: 24, capital: 98.5 },
  { month: "Jun '25", deals: 21, capital: 85.2 },
  { month: "Jul '25", deals: 17, capital: 68.9 },
  { month: "Aug '25", deals: 20, capital: 82.3 },
  { month: "Sep '25", deals: 26, capital: 108.7 },
  { month: "Oct '25", deals: 29, capital: 118.4 },
  { month: "Nov '25", deals: 23, capital: 94.1 },
  { month: "Dec '25", deals: 15, capital: 62.8 },
  { month: "Jan '26", deals: 28, capital: 115.3 },
  { month: "Feb '26", deals: 31, capital: 128.9 },
];

// ─── Sector Deal Volume ───
export const SECTOR_VOLUME_DATA = [
  { sector: "AI/ML", count: 47, change: 18.2 },
  { sector: "Fintech", count: 34, change: -2.4 },
  { sector: "DevTools", count: 29, change: 12.8 },
  { sector: "Health", count: 22, change: 8.1 },
  { sector: "Web3", count: 18, change: -8.6 },
  { sector: "Climate", count: 16, change: 22.4 },
  { sector: "Cyber", count: 14, change: 6.3 },
  { sector: "Bio", count: 11, change: 14.7 },
  { sector: "EdTech", count: 9, change: -4.2 },
  { sector: "Space", count: 7, change: 31.5 },
  { sector: "Agri", count: 5, change: 9.8 },
  { sector: "Legal", count: 4, change: -1.3 },
];

// ─── Pipeline Distribution ───
export const PIPELINE_DATA = [
  { stage: "Screening", value: 156, color: "#00E5FF" },
  { stage: "Analysis", value: 64, color: "#B026FF" },
  { stage: "Due Diligence", value: 28, color: "#00FF85" },
  { stage: "Term Sheet", value: 12, color: "#fbbf24" },
  { stage: "Closed", value: 8, color: "#fb7185" },
];

// ─── Portfolio Company Growth Index ───
export const PORTFOLIO_GROWTH_DATA = [
  { month: "Mar '25", value: 142, benchmark: 128 },
  { month: "Apr '25", value: 148, benchmark: 131 },
  { month: "May '25", value: 158, benchmark: 134 },
  { month: "Jun '25", value: 152, benchmark: 138 },
  { month: "Jul '25", value: 164, benchmark: 141 },
  { month: "Aug '25", value: 171, benchmark: 144 },
  { month: "Sep '25", value: 178, benchmark: 148 },
  { month: "Oct '25", value: 186, benchmark: 152 },
  { month: "Nov '25", value: 192, benchmark: 155 },
  { month: "Dec '25", value: 198, benchmark: 158 },
  { month: "Jan '26", value: 210, benchmark: 162 },
  { month: "Feb '26", value: 224, benchmark: 165 },
];

// ─── Aggregate dashboard stats ───
export const DASHBOARD_STATS = {
  totalDealFlow: 339,
  totalCapital: "$1.41B",
  avgThesisScore: 74,
  activeSignals: 1_247,
  capitalChange: 12.3,
  dealFlowChange: 8.7,
  scoreChange: 2.1,
  signalChange: 15.8,
};
