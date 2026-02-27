"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import ThesisScoreBadge from "@/components/ThesisScoreBadge";
import { MOCK_COMPANIES, SECTORS, STAGES } from "@/lib/mock-data";
import type { Company } from "@/lib/types";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  MapPin,
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
  Sparkles,
} from "lucide-react";

const PAGE_SIZE = 10;

type SortKey = "name" | "thesisScore" | "foundedYear" | "stage";
type SortDir = "asc" | "desc";

function stageBadgeClass(stage: string) {
  if (stage === "Pre-seed") return "stage-pre-seed";
  if (stage === "Seed") return "stage-seed";
  if (stage === "Series A") return "stage-series-a";
  if (stage === "Series B") return "stage-series-b";
  return "stage-series-c";
}

export default function CompaniesPage() {
  const [query, setQuery] = useState("");
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [minScore, setMinScore] = useState(0);
  const [sortKey, setSortKey] = useState<SortKey>("thesisScore");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilter = useCallback(
    (arr: string[], val: string, set: (v: string[]) => void) => {
      set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
      setPage(1);
    },
    []
  );

  const filtered = useMemo(() => {
    let data = [...MOCK_COMPANIES];

    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.sector.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q)) ||
          c.location.toLowerCase().includes(q)
      );
    }

    if (selectedStages.length > 0) {
      data = data.filter((c) => selectedStages.includes(c.stage));
    }
    if (selectedSectors.length > 0) {
      data = data.filter((c) => selectedSectors.includes(c.sector));
    }
    if (minScore > 0) {
      data = data.filter((c) => c.thesisScore >= minScore);
    }

    data.sort((a, b) => {
      let diff = 0;
      if (sortKey === "name") diff = a.name.localeCompare(b.name);
      else if (sortKey === "thesisScore") diff = a.thesisScore - b.thesisScore;
      else if (sortKey === "foundedYear") diff = a.foundedYear - b.foundedYear;
      else if (sortKey === "stage")
        diff = STAGES.indexOf(a.stage) - STAGES.indexOf(b.stage);
      return sortDir === "asc" ? diff : -diff;
    });

    return data;
  }, [query, selectedStages, selectedSectors, minScore, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k)
      return (
        <ArrowUpDown
          size={12}
          className="text-[#828690]"
        />
      );
    return sortDir === "desc" ? (
      <ArrowDown size={12} className="text-[#F3F4F6]" />
    ) : (
      <ArrowUp size={12} className="text-[#F3F4F6]" />
    );
  };

  const activeFilterCount =
    selectedStages.length + selectedSectors.length + (minScore > 0 ? 1 : 0);

  return (
    <PageWrapper>
      {/* Header */}
      <div className="bg-[#16181D] border-b border-[#272A30] sticky top-0 z-20">
        <div className="px-6 py-4 flex items-center gap-4">
          <div className="flex items-center gap-2 mr-2">
            <Sparkles size={18} className="text-[#F3F4F6]" />
            <h1 className="text-lg font-semibold text-[#F3F4F6]">Companies</h1>
          </div>
          <div className="relative flex-1 max-w-xl">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#828690]"
            />
            <input
              type="text"
              placeholder="Search companies, sectors, tags..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#0D0E12] border border-[#272A30] rounded-lg pl-9 pr-4 py-2.5 text-sm text-[#F3F4F6] placeholder:text-[#828690] focus:outline-none focus:border-[#828690]/40 focus:ring-1 focus:ring-[#828690]/15 transition-all font-mono"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#828690] hover:text-[#F3F4F6]"
              >
                <X size={13} />
              </button>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-all ${showFilters || activeFilterCount > 0
                ? "bg-white/[0.08] border-white/20 text-[#F3F4F6]"
                : "bg-[#0D0E12] border-[#272A30] text-[#828690] hover:text-[#F3F4F6]"
              }`}
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-white text-[#0D0E12] text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full leading-none">
                {activeFilterCount}
              </span>
            )}
          </motion.button>
          <div className="text-sm text-[#828690] font-mono whitespace-nowrap">
            {filtered.length} companies
          </div>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-5 border-t border-[#272A30]/60">
                <div className="pt-4 grid grid-cols-3 gap-6">
                  {/* Stage */}
                  <div>
                    <div className="text-[11px] font-mono text-[#828690] uppercase tracking-[0.12em] mb-2.5">
                      Stage
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {STAGES.map((s) => (
                        <motion.button
                          key={s}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            toggleFilter(
                              selectedStages,
                              s,
                              setSelectedStages
                            )
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs transition-all ${selectedStages.includes(s)
                              ? "bg-white/10 text-[#F3F4F6] border border-white/20"
                              : "bg-[#0D0E12] text-[#828690] border border-[#272A30] hover:border-[#3A3D44]"
                            }`}
                        >
                          {s}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  {/* Sector */}
                  <div>
                    <div className="text-[11px] font-mono text-[#828690] uppercase tracking-[0.12em] mb-2.5">
                      Sector
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {SECTORS.map((s) => (
                        <motion.button
                          key={s}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            toggleFilter(
                              selectedSectors,
                              s,
                              setSelectedSectors
                            )
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs transition-all ${selectedSectors.includes(s)
                              ? "bg-white/10 text-[#F3F4F6] border border-white/20"
                              : "bg-[#0D0E12] text-[#828690] border border-[#272A30] hover:border-[#3A3D44]"
                            }`}
                        >
                          {s}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  {/* Min Score */}
                  <div>
                    <div className="text-[11px] font-mono text-[#828690] uppercase tracking-[0.12em] mb-2.5">
                      Min Thesis Score: {minScore > 0 ? minScore : "Any"}
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={95}
                      step={5}
                      value={minScore}
                      onChange={(e) => {
                        setMinScore(Number(e.target.value));
                        setPage(1);
                      }}
                      className="w-full accent-white cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-[#828690] font-mono mt-1">
                      <span>0</span>
                      <span>50</span>
                      <span>95</span>
                    </div>
                  </div>
                </div>
                {activeFilterCount > 0 && (
                  <button
                    onClick={() => {
                      setSelectedStages([]);
                      setSelectedSectors([]);
                      setMinScore(0);
                      setPage(1);
                    }}
                    className="mt-4 text-xs text-[#828690] hover:text-[#F3F4F6] flex items-center gap-1 transition-colors"
                  >
                    <X size={11} />
                    Clear all filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="border-b border-[#272A30]">
              <th className="text-left px-6 py-3 text-[11px] font-mono text-[#828690] uppercase tracking-[0.1em] font-normal">
                <button
                  className="flex items-center gap-1.5 group"
                  onClick={() => handleSort("name")}
                >
                  Company <SortIcon k="name" />
                </button>
              </th>
              <th className="text-left px-4 py-3 text-[11px] font-mono text-[#828690] uppercase tracking-[0.1em] font-normal">
                <button
                  className="flex items-center gap-1.5 group"
                  onClick={() => handleSort("stage")}
                >
                  Stage <SortIcon k="stage" />
                </button>
              </th>
              <th className="text-left px-4 py-3 text-[11px] font-mono text-[#828690] uppercase tracking-[0.1em] font-normal">
                Sector
              </th>
              <th className="text-left px-4 py-3 text-[11px] font-mono text-[#828690] uppercase tracking-[0.1em] font-normal">
                Location
              </th>
              <th className="text-left px-4 py-3 text-[11px] font-mono text-[#828690] uppercase tracking-[0.1em] font-normal">
                <button
                  className="flex items-center gap-1.5 group"
                  onClick={() => handleSort("foundedYear")}
                >
                  Founded <SortIcon k="foundedYear" />
                </button>
              </th>
              <th className="text-right px-6 py-3 text-[11px] font-mono text-[#828690] uppercase tracking-[0.1em] font-normal">
                <button
                  className="flex items-center gap-1.5 group ml-auto"
                  onClick={() => handleSort("thesisScore")}
                >
                  Thesis Score <SortIcon k="thesisScore" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-20 text-center text-[#828690]"
                >
                  <Filter
                    size={28}
                    className="mx-auto mb-3 text-[#4B5563]"
                  />
                  <p>No companies match your filters.</p>
                  <button
                    onClick={() => {
                      setQuery("");
                      setSelectedStages([]);
                      setSelectedSectors([]);
                      setMinScore(0);
                    }}
                    className="mt-2 text-[#F3F4F6] hover:underline text-sm"
                  >
                    Clear filters
                  </button>
                </td>
              </tr>
            ) : (
              paginated.map((company, i) => (
                <CompanyRow key={company.id} company={company} index={i} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-[#272A30] px-6 py-3 flex items-center justify-between bg-[#16181D]/60">
          <span className="text-xs text-[#828690] font-mono">
            Page {page} of {totalPages} · {filtered.length} results
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg text-[#828690] hover:text-[#F3F4F6] hover:bg-[#272A30] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => Math.abs(p - page) <= 2)
              .map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-mono transition-all ${p === page
                      ? "bg-[#272A30] text-[#F3F4F6] border border-[#272A30]"
                      : "text-[#828690] hover:text-[#F3F4F6] hover:bg-[#272A30]"
                    }`}
                >
                  {p}
                </button>
              ))}
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg text-[#828690] hover:text-[#F3F4F6] hover:bg-[#272A30] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}

function CompanyRow({
  company,
  index,
}: {
  company: Company;
  index: number;
}) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className="border-b border-[#272A30]/60 hover:bg-white/[0.02] transition-colors group cursor-pointer"
    >
      <td className="px-6 py-3.5">
        <Link href={`/companies/${company.id}`} className="block">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#272A30] flex items-center justify-center text-xs font-bold text-[#828690] flex-shrink-0 group-hover:bg-white/10 group-hover:text-[#F3F4F6] transition-all">
              {company.name[0]}
            </div>
            <div>
              <div className="font-medium text-[#F3F4F6] group-hover:text-white transition-colors">
                {company.name}
              </div>
              <div className="text-[11px] text-[#828690] font-mono flex items-center gap-1 mt-0.5">
                {company.domain}
                <ExternalLink
                  size={10}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>
        </Link>
      </td>
      <td className="px-4 py-3.5">
        <Link href={`/companies/${company.id}`}>
          <span
            className={`text-xs px-2.5 py-1 rounded-lg font-mono ${stageBadgeClass(
              company.stage
            )}`}
          >
            {company.stage}
          </span>
        </Link>
      </td>
      <td className="px-4 py-3.5">
        <Link href={`/companies/${company.id}`}>
          <span className="text-xs text-[#828690]">{company.sector}</span>
        </Link>
      </td>
      <td className="px-4 py-3.5">
        <Link href={`/companies/${company.id}`}>
          <span className="text-xs text-[#828690] flex items-center gap-1">
            <MapPin size={10} className="flex-shrink-0" />
            {company.location}
          </span>
        </Link>
      </td>
      <td className="px-4 py-3.5">
        <Link href={`/companies/${company.id}`}>
          <span className="text-xs text-[#828690] font-mono">
            {company.foundedYear}
          </span>
        </Link>
      </td>
      <td className="px-6 py-3.5 text-right">
        <Link
          href={`/companies/${company.id}`}
          className="flex justify-end"
        >
          <ThesisScoreBadge score={company.thesisScore} size="sm" />
        </Link>
      </td>
    </motion.tr>
  );
}
