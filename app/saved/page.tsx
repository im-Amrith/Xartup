"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import type { SavedSearch } from "@/lib/types";
import { MOCK_COMPANIES } from "@/lib/mock-data";
import {
  Search,
  Plus,
  Trash2,
  Play,
  Clock,
  Sparkles,
} from "lucide-react";

export default function SavedPage() {
  const router = useRouter();
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [newName, setNewName] = useState("");
  const [newQuery, setNewQuery] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("vc_saved_searches") || "[]"
    );
    setSearches(stored);
  }, []);

  const save = (updated: SavedSearch[]) => {
    localStorage.setItem("vc_saved_searches", JSON.stringify(updated));
    setSearches(updated);
  };

  const createSearch = () => {
    if (!newName.trim() || !newQuery.trim()) return;
    const s: SavedSearch = {
      id: `ss${Date.now()}`,
      name: newName.trim(),
      query: newQuery.trim(),
      filters: { stage: [], sector: [], minThesisScore: 0 },
      createdAt: new Date().toISOString(),
    };
    save([...searches, s]);
    setNewName("");
    setNewQuery("");
    setCreating(false);
  };

  const deleteSearch = (id: string) => {
    save(searches.filter((s) => s.id !== id));
  };

  const runSearch = (s: SavedSearch) => {
    router.push(`/companies?q=${encodeURIComponent(s.query)}`);
  };

  const previewCount = (s: SavedSearch) => {
    const q = s.query.toLowerCase();
    return MOCK_COMPANIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.sector.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q)) ||
        c.description.toLowerCase().includes(q)
    ).length;
  };

  return (
    <PageWrapper>
      {/* Header */}
      <div className="bg-[#16181D] border-b border-[#272A30] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <div className="flex items-center gap-2.5">
            <Sparkles size={16} className="text-[#F3F4F6]" />
            <h1 className="text-base font-semibold text-[#F3F4F6] tracking-tight">
              Saved Searches
            </h1>
          </div>
          <p className="text-xs text-[#828690] mt-0.5 ml-[26px]">
            Save queries to re-run at any time
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setCreating((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-[#0D0E12] font-semibold text-sm hover:bg-gray-200 transition-all"
        >
          <Plus size={14} />
          New search
        </motion.button>
      </div>

      <div className="flex-1 px-6 py-6 max-w-3xl mx-auto w-full overflow-auto">
        {/* Create form */}
        <AnimatePresence>
          {creating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="p-5 rounded-2xl bg-[#16181D] border border-[#272A30]">
                <h3 className="text-sm font-medium text-[#F3F4F6] mb-4">
                  New Saved Search
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-mono text-[#748297] mb-1.5 block">
                      Name
                    </label>
                    <input
                      autoFocus
                      type="text"
                      placeholder="e.g., AI DevTools Seed"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full bg-[#0D0E12] border border-[#272A30] rounded-lg px-4 py-2.5 text-sm text-[#F3F4F6] placeholder:text-[#828690] focus:outline-none focus:border-[#828690]/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-[#828690] mb-1.5 block">
                      Query
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., AI infrastructure"
                      value={newQuery}
                      onChange={(e) => setNewQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && createSearch()}
                      className="w-full bg-[#0D0E12] border border-[#272A30] rounded-lg px-4 py-2.5 text-sm text-[#F3F4F6] placeholder:text-[#828690] focus:outline-none focus:border-[#828690]/40 font-mono transition-colors"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={createSearch}
                      disabled={!newName.trim() || !newQuery.trim()}
                      className="px-5 py-2 rounded-lg bg-white text-[#0D0E12] font-semibold text-sm hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      Save
                    </motion.button>
                    <button
                      onClick={() => setCreating(false)}
                      className="px-5 py-2 rounded-lg bg-[#0D0E12] border border-[#272A30] text-[#828690] text-sm hover:text-[#F3F4F6] transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Searches list */}
        {searches.length === 0 && !creating ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#16181D] border border-[#272A30] flex items-center justify-center mb-4">
              <Search size={24} className="text-[#828690]" />
            </div>
            <h3 className="text-gray-200 font-medium mb-1">
              No saved searches
            </h3>
            <p className="text-[#828690] text-sm max-w-xs">
              Save common queries to quickly re-run your most important thesis
              screens.
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setCreating(true)}
              className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-[#0D0E12] font-semibold text-sm hover:bg-gray-200 transition-all"
            >
              <Plus size={14} />
              Create your first search
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {searches.map((s, i) => {
              const count = previewCount(s);
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="p-5 rounded-2xl bg-[#16181D] border border-[#272A30] hover:border-[#3A3D44] transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <h3 className="font-medium text-[#F3F4F6]">
                          {s.name}
                        </h3>
                        <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-[#272A30] border border-[#272A30] text-[#828690]">
                          {count} matches
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Search size={11} className="text-[#828690]" />
                        <span className="font-mono text-[#828690]">
                          {s.query}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-2.5 text-[11px] text-[#828690] font-mono">
                        <Clock size={10} />
                        Saved{" "}
                        {new Date(s.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => runSearch(s)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/[0.08] border border-white/20 text-[#F3F4F6] text-xs hover:bg-white/[0.14] transition-all"
                      >
                        <Play size={11} />
                        Run
                      </motion.button>
                      <button
                        onClick={() => deleteSearch(s.id)}
                        className="p-2 rounded-lg text-[#828690] hover:text-[#F33959] hover:bg-[#F33959]/[0.08] transition-all"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
