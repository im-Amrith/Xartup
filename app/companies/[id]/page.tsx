"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import ThesisScoreBadge from "@/components/ThesisScoreBadge";
import { MOCK_COMPANIES } from "@/lib/mock-data";
import type { EnrichmentResult, List } from "@/lib/types";
import {
  ArrowLeft,
  Zap,
  MapPin,
  Users,
  Calendar,
  DollarSign,
  ExternalLink,
  BookmarkPlus,
  Tag,
  CheckCircle2,
  AlertCircle,
  Loader2,
  PenLine,
  Clock,
  TrendingUp,
  Globe,
  ChevronDown,
  Plus,
  Check,
  Sparkles,
  Radio,
} from "lucide-react";

const SIGNAL_ICONS: Record<string, string> = {
  funding: "\u{1f4b0}",
  hiring: "\u{1f465}",
  product: "\u{1f680}",
  press: "\u{1f4f0}",
  founder: "\u{1f9d1}\u{200d}\u{1f4bb}",
};

function stageBadgeClass(stage: string) {
  if (stage === "Pre-seed") return "stage-pre-seed";
  if (stage === "Seed") return "stage-seed";
  if (stage === "Series A") return "stage-series-a";
  if (stage === "Series B") return "stage-series-b";
  return "stage-series-c";
}

export default function CompanyProfile() {
  const { id } = useParams();
  const company = MOCK_COMPANIES.find((c) => c.id === id);

  const [enrichment, setEnrichment] = useState<EnrichmentResult | null>(null);
  const [enrichLoading, setEnrichLoading] = useState(false);
  const [enrichError, setEnrichError] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [savedNote, setSavedNote] = useState("");
  const [lists, setLists] = useState<List[]>([]);
  const [showListDropdown, setShowListDropdown] = useState(false);
  const [savedToLists, setSavedToLists] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "signals" | "notes">(
    "overview"
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLists: List[] = JSON.parse(
        localStorage.getItem("vc_lists") || "[]"
      );
      setLists(storedLists);

      const saved = storedLists
        .filter((l) => l.companies.includes(id as string))
        .map((l) => l.id);
      setSavedToLists(saved);

      const cachedNote = localStorage.getItem(`vc_note_${id}`);
      if (cachedNote) {
        setNote(cachedNote);
        setSavedNote(cachedNote);
      }

      const cached = localStorage.getItem(`vc_enrich_${id}`);
      if (cached) {
        try {
          setEnrichment(JSON.parse(cached));
        } catch { }
      }
    }
  }, [id]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowListDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!company) {
    return (
      <PageWrapper>
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <AlertCircle size={40} className="mx-auto text-[#4B5563] mb-3" />
            <p className="text-[#828690]">Company not found.</p>
            <Link
              href="/companies"
              className="text-[#F3F4F6] hover:underline mt-2 inline-block"
            >
              Back to companies
            </Link>
          </motion.div>
        </div>
      </PageWrapper>
    );
  }

  const handleEnrich = async () => {
    setEnrichLoading(true);
    setEnrichError(null);
    try {
      const res = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: company.domain, companyId: company.id }),
      });
      const data: EnrichmentResult = await res.json();
      if (data.error) {
        setEnrichError(data.error);
      } else {
        setEnrichment(data);
        localStorage.setItem(`vc_enrich_${id}`, JSON.stringify(data));
      }
    } catch {
      setEnrichError("Failed to fetch enrichment. Check your API key.");
    } finally {
      setEnrichLoading(false);
    }
  };

  const saveNote = () => {
    localStorage.setItem(`vc_note_${id}`, note);
    setSavedNote(note);
  };

  const toggleList = (listId: string) => {
    const storedLists: List[] = JSON.parse(
      localStorage.getItem("vc_lists") || "[]"
    );
    const updated = storedLists.map((l) => {
      if (l.id !== listId) return l;
      const has = l.companies.includes(id as string);
      return {
        ...l,
        companies: has
          ? l.companies.filter((c) => c !== id)
          : [...l.companies, id as string],
      };
    });
    localStorage.setItem("vc_lists", JSON.stringify(updated));
    setLists(updated);
    setSavedToLists(
      updated
        .filter((l) => l.companies.includes(id as string))
        .map((l) => l.id)
    );
  };

  const createAndAdd = () => {
    const name = prompt("New list name:");
    if (!name?.trim()) return;
    const newList: List = {
      id: `l${Date.now()}`,
      name: name.trim(),
      companies: [id as string],
      createdAt: new Date().toISOString(),
    };
    const storedLists: List[] = JSON.parse(
      localStorage.getItem("vc_lists") || "[]"
    );
    const updated = [...storedLists, newList];
    localStorage.setItem("vc_lists", JSON.stringify(updated));
    setLists(updated);
    setSavedToLists([...savedToLists, newList.id]);
  };

  return (
    <PageWrapper>
      {/* Top bar */}
      <div className="bg-[#16181D] border-b border-[#272A30] sticky top-0 z-20">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/companies"
              className="text-[#828690] hover:text-[#F3F4F6] transition-colors p-1 rounded-lg hover:bg-white/[0.04]"
            >
              <ArrowLeft size={16} />
            </Link>
            <div className="h-4 w-px bg-[#272A30]" />
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#272A30] flex items-center justify-center text-xs font-bold text-[#F3F4F6] border border-[#272A30]">
                {company.name[0]}
              </div>
              <span className="text-sm font-medium text-[#F3F4F6]">
                {company.name}
              </span>
              <span
                className={`text-xs px-2.5 py-1 rounded-lg font-mono ${stageBadgeClass(
                  company.stage
                )}`}
              >
                {company.stage}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Save to list */}
            <div className="relative" ref={dropdownRef}>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowListDropdown((v) => !v)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs transition-all ${savedToLists.length > 0
                    ? "bg-white/[0.08] border-white/20 text-[#F3F4F6]"
                    : "bg-white/[0.03] border-[#272A30] text-[#828690] hover:text-[#F3F4F6]"
                  }`}
              >
                <BookmarkPlus size={13} />
                {savedToLists.length > 0
                  ? `Saved to ${savedToLists.length} list${savedToLists.length > 1 ? "s" : ""
                  }`
                  : "Save to list"}
                <ChevronDown size={11} />
              </motion.button>
              <AnimatePresence>
                {showListDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1.5 w-56 bg-[#1E2027] border border-[#272A30] rounded-xl shadow-2xl z-30 overflow-hidden"
                  >
                    {lists.length === 0 && (
                      <div className="px-4 py-3 text-xs text-[#828690]">
                        No lists yet.
                      </div>
                    )}
                    {lists.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => toggleList(l.id)}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#F3F4F6] hover:bg-white/[0.04] transition-colors"
                      >
                        {savedToLists.includes(l.id) ? (
                          <Check
                            size={12}
                            className="text-[#F3F4F6] flex-shrink-0"
                          />
                        ) : (
                          <div className="w-3 h-3 rounded border border-[#828690] flex-shrink-0" />
                        )}
                        {l.name}
                        <span className="ml-auto text-[#828690] font-mono">
                          {l.companies.length}
                        </span>
                      </button>
                    ))}
                    <div className="border-t border-[#272A30]">
                      <button
                        onClick={createAndAdd}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-[#F3F4F6] hover:bg-white/[0.06] transition-colors"
                      >
                        <Plus size={12} />
                        New list
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <a
              href={`https://${company.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#272A30] bg-white/[0.03] text-[#828690] hover:text-[#F3F4F6] text-xs transition-all"
            >
              <Globe size={13} />
              Visit site
              <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 max-w-5xl mx-auto w-full overflow-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#F3F4F6] mb-1.5 tracking-tight">
                {company.name}
              </h1>
              <div className="flex items-center gap-3 text-sm text-[#828690] flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin size={13} /> {company.location}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={13} /> {company.employees} employees
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={13} /> Founded {company.foundedYear}
                </span>
                {company.fundingTotal && (
                  <span className="flex items-center gap-1">
                    <DollarSign size={13} /> {company.fundingTotal} raised
                  </span>
                )}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-[11px] font-mono text-[#828690] uppercase tracking-[0.12em] mb-2">
                Thesis Score
              </div>
              <div className="flex items-center gap-2.5 justify-end">
                <ThesisScoreBadge score={company.thesisScore} size="lg" />
                <span className="text-3xl font-bold font-mono text-[#F3F4F6]">
                  {company.thesisScore}
                </span>
              </div>
            </div>
          </div>

          {/* Thesis reasons */}
          <div className="mt-5 p-5 rounded-2xl bg-[#16181D] border border-[#272A30]">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={13} className="text-[#828690]" />
              <span className="text-[11px] font-mono text-[#828690] uppercase tracking-[0.12em]">
                Why it matches your thesis
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {company.thesisReasons.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  className="flex items-start gap-2.5 text-sm text-[#F3F4F6]/80"
                >
                  <CheckCircle2
                    size={14}
                    className="text-[#00C278] mt-0.5 flex-shrink-0"
                  />
                  {r}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {company.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#16181D] border border-[#272A30] text-xs text-[#828690] font-mono"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-[#272A30]">
          {(["overview", "signals", "notes"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-5 py-3 text-sm capitalize transition-all ${activeTab === tab
                  ? "text-[#F3F4F6] font-medium"
                  : "text-[#828690] hover:text-[#F3F4F6]"
                }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="profile-tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F3F4F6] rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {tab}
              {tab === "signals" && (
                <span className="ml-1.5 font-mono text-[10px] bg-[#272A30] px-1.5 py-0.5 rounded-full text-[#828690]">
                  {company.signals.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Description */}
              <div>
                <h3 className="text-xs font-mono text-[#828690] uppercase tracking-[0.12em] mb-2.5">
                  About
                </h3>
                <p className="text-[#F3F4F6]/80 leading-relaxed">
                  {company.description}
                </p>
              </div>

              {/* Enrichment */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-mono text-[#828690] uppercase tracking-[0.12em]">
                    Live Enrichment
                  </h3>
                  {!enrichment && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleEnrich}
                      disabled={enrichLoading}
                      className="flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-white text-[#0D0E12] text-sm font-semibold hover:bg-gray-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {enrichLoading ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Zap size={15} />
                      )}
                      {enrichLoading ? "Enriching..." : "Enrich Data"}
                    </motion.button>
                  )}
                  {enrichment && (
                    <button
                      onClick={handleEnrich}
                      disabled={enrichLoading}
                      className="text-xs text-[#828690] hover:text-[#F3F4F6] flex items-center gap-1.5 transition-colors"
                    >
                      {enrichLoading ? (
                        <Loader2 size={11} className="animate-spin" />
                      ) : (
                        <Zap size={11} />
                      )}
                      Re-enrich
                    </button>
                  )}
                </div>

                {enrichError && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2.5 p-4 rounded-xl bg-[#F33959]/[0.06] border border-[#F33959]/15 text-sm text-[#F33959]"
                  >
                    <AlertCircle
                      size={15}
                      className="mt-0.5 flex-shrink-0"
                    />
                    {enrichError}
                  </motion.div>
                )}

                {!enrichment && !enrichLoading && !enrichError && (
                  <div className="p-10 rounded-2xl border border-dashed border-[#272A30] text-center bg-[#16181D]/60">
                    <Sparkles
                      size={28}
                      className="mx-auto text-[#4B5563] mb-3"
                    />
                    <p className="text-sm text-[#828690]">
                      Click{" "}
                      <span className="text-[#F3F4F6] font-medium">
                        &ldquo;Enrich Data&rdquo;
                      </span>{" "}
                      to pull live intelligence from{" "}
                      <span className="text-[#828690] font-mono">
                        {company.domain}
                      </span>
                    </p>
                  </div>
                )}

                {enrichLoading && !enrichment && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative p-10 rounded-2xl bg-[#16181D] border border-[#272A30] text-center overflow-hidden"
                  >
                    <div className="relative z-10">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="inline-block"
                      >
                        <Radio size={28} className="text-[#F3F4F6]" />
                      </motion.div>
                      <p className="text-sm text-[#828690] mt-3 font-mono">
                        Scanning {company.domain}...
                      </p>
                      <div className="flex justify-center gap-6 mt-4">
                        {[
                          "Fetching pages",
                          "Extracting signals",
                          "Analyzing data",
                        ].map((step, i) => (
                          <motion.div
                            key={step}
                            initial={{ opacity: 0.3 }}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.5,
                            }}
                            className="text-[10px] font-mono text-[#828690]"
                          >
                            {step}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {enrichment && !enrichment.error && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-2xl bg-[#16181D] border border-[#272A30] overflow-hidden"
                  >
                    {/* Summary */}
                    <div className="px-6 py-5 border-b border-[#272A30]">
                      <div className="text-[11px] font-mono text-[#828690] uppercase tracking-[0.12em] mb-2">
                        Summary
                      </div>
                      <p className="text-sm text-[#F3F4F6]/80 leading-relaxed">
                        {enrichment.summary}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 divide-x divide-[#272A30]">
                      {/* What they do */}
                      <div className="px-6 py-5">
                        <div className="text-[11px] font-mono text-[#828690] uppercase tracking-[0.12em] mb-3">
                          What They Do
                        </div>
                        <ul className="space-y-2">
                          {enrichment.whatTheyDo.map((item, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.08 }}
                              className="flex items-start gap-2.5 text-xs text-[#F3F4F6]/80"
                            >
                              <span className="text-[#828690] mt-0.5 font-mono">
                                &rarr;
                              </span>
                              {item}
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      {/* Keywords + Signals */}
                      <div className="px-6 py-5 space-y-5">
                        <div>
                          <div className="text-[11px] font-mono text-[#828690] uppercase tracking-[0.12em] mb-3">
                            Keywords
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {enrichment.keywords.map((kw) => (
                              <span
                                key={kw}
                                className="px-2.5 py-1 rounded-lg bg-[#0D0E12] text-xs text-[#828690] font-mono border border-[#272A30]"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] font-mono text-[#828690] uppercase tracking-[0.12em] mb-3">
                            Derived Signals
                          </div>
                          <ul className="space-y-1.5">
                            {enrichment.signals.map((sig, i) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 + i * 0.08 }}
                                className="flex items-start gap-2 text-xs text-[#828690]"
                              >
                                <span className="text-[#00C278] mt-0.5">
                                  &#10003;
                                </span>
                                {sig}
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Sources */}
                    <div className="px-6 py-3.5 border-t border-[#272A30] bg-[#0D0E12]/50">
                      <div className="text-[10px] font-mono text-[#4B5563] uppercase tracking-[0.12em] mb-2">
                        Sources
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {enrichment.sources.map((src, i) => (
                          <a
                            key={i}
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[10px] font-mono text-[#828690] hover:text-[#F3F4F6] transition-colors"
                          >
                            <ExternalLink size={9} />
                            {src.url
                              .replace(/^https?:\/\//, "")
                              .slice(0, 40)}
                            {src.url.replace(/^https?:\/\//, "").length > 40
                              ? "..."
                              : ""}
                          </a>
                        ))}
                      </div>
                      {enrichment.cachedAt && (
                        <div className="text-[10px] font-mono text-[#4B5563] mt-2 flex items-center gap-1">
                          <Clock size={9} />
                          Cached{" "}
                          {new Date(enrichment.cachedAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "signals" && (
            <motion.div
              key="signals"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {company.signals.map((signal, i) => (
                <motion.div
                  key={signal.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-[#16181D] border border-[#272A30] hover:border-[#3A3D44] transition-colors"
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0 signal-${signal.type}`}
                  >
                    {SIGNAL_ICONS[signal.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#F3F4F6]">{signal.title}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-[#828690] font-mono">
                        {new Date(signal.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      {signal.source && (
                        <span className="text-xs text-[#4B5563] font-mono">
                          via {signal.source}
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2.5 py-1 rounded-lg capitalize signal-${signal.type}`}
                  >
                    {signal.type}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "notes" && (
            <motion.div
              key="notes"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <PenLine size={14} className="text-[#828690]" />
                <span className="text-xs font-mono text-[#828690] uppercase tracking-[0.12em]">
                  Private notes
                </span>
                {savedNote === note && savedNote && (
                  <span className="ml-auto text-[10px] font-mono text-[#00C278] flex items-center gap-1">
                    <Check size={10} /> Saved
                  </span>
                )}
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={`Add notes about ${company.name}... (e.g., meeting notes, follow-ups, open questions)`}
                className="w-full h-52 bg-[#16181D] border border-[#272A30] rounded-2xl px-5 py-4 text-sm text-[#F3F4F6] placeholder:text-[#4B5563] focus:outline-none focus:border-[#828690]/30 focus:ring-1 focus:ring-[#828690]/10 resize-none transition-all font-mono leading-relaxed"
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-[11px] text-[#4B5563] font-mono">
                  {note.length} chars ({"\u00B7"} localStorage)
                </span>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={saveNote}
                  disabled={note === savedNote}
                  className="px-5 py-2 rounded-lg bg-white text-[#0D0E12] text-xs font-semibold hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Save note
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}
