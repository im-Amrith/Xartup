"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import ThesisScoreBadge from "@/components/ThesisScoreBadge";
import { MOCK_COMPANIES } from "@/lib/mock-data";
import type { List } from "@/lib/types";
import {
  BookMarked,
  Plus,
  Trash2,
  Download,
  Users,
  X,
  Building2,
  ArrowUpRight,
} from "lucide-react";

export default function ListsPage() {
  const [lists, setLists] = useState<List[]>([]);
  const [activeList, setActiveList] = useState<string | null>(null);
  const [newListName, setNewListName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("vc_lists") || "[]");
    setLists(stored);
    if (stored.length > 0) setActiveList(stored[0].id);
  }, []);

  const save = (updated: List[]) => {
    localStorage.setItem("vc_lists", JSON.stringify(updated));
    setLists(updated);
  };

  const createList = () => {
    if (!newListName.trim()) return;
    const newList: List = {
      id: `l${Date.now()}`,
      name: newListName.trim(),
      companies: [],
      createdAt: new Date().toISOString(),
    };
    const updated = [...lists, newList];
    save(updated);
    setActiveList(newList.id);
    setNewListName("");
    setCreating(false);
  };

  const deleteList = (id: string) => {
    const updated = lists.filter((l) => l.id !== id);
    save(updated);
    if (activeList === id) setActiveList(updated[0]?.id || null);
  };

  const removeCompany = (listId: string, companyId: string) => {
    const updated = lists.map((l) =>
      l.id === listId
        ? { ...l, companies: l.companies.filter((c) => c !== companyId) }
        : l
    );
    save(updated);
  };

  const exportList = (list: List, format: "csv" | "json") => {
    const companies = list.companies
      .map((cId) => MOCK_COMPANIES.find((c) => c.id === cId))
      .filter(Boolean);

    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === "json") {
      content = JSON.stringify(companies, null, 2);
      filename = `${list.name.replace(/\s+/g, "-")}.json`;
      mimeType = "application/json";
    } else {
      const headers = [
        "name",
        "domain",
        "stage",
        "sector",
        "location",
        "foundedYear",
        "thesisScore",
        "fundingTotal",
      ];
      const rows = companies.map((c: any) =>
        headers
          .map(
            (h) => `"${(c[h] ?? "").toString().replace(/"/g, '""')}"`
          )
          .join(",")
      );
      content = [headers.join(","), ...rows].join("\n");
      filename = `${list.name.replace(/\s+/g, "-")}.csv`;
      mimeType = "text/csv";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentList = lists.find((l) => l.id === activeList);
  const currentCompanies = currentList
    ? currentList.companies
      .map((cId) => MOCK_COMPANIES.find((c) => c.id === cId))
      .filter(Boolean)
    : [];

  return (
    <PageWrapper>
      <div className="flex-1 flex min-w-0 overflow-hidden">
        {/* Lists sidebar panel */}
        <div className="w-60 border-r border-[#272A30] bg-[#16181D]/60 flex flex-col">
          <div className="px-4 py-4 border-b border-[#272A30]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#828690] uppercase tracking-[0.12em]">
                My Lists
              </span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setCreating((v) => !v)}
                className="p-1.5 rounded-lg text-[#828690] hover:text-[#F3F4F6] hover:bg-white/10 transition-all"
              >
                <Plus size={14} />
              </motion.button>
            </div>
            <AnimatePresence>
              {creating && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3">
                    <input
                      autoFocus
                      type="text"
                      placeholder="List name..."
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") createList();
                        if (e.key === "Escape") setCreating(false);
                      }}
                      className="w-full bg-[#0D0E12] border border-[#272A30] rounded-lg px-3 py-2 text-xs text-[#F3F4F6] placeholder:text-[#828690] focus:outline-none focus:border-[#828690]/40 transition-colors"
                    />
                    <div className="flex gap-1.5 mt-2">
                      <button
                        onClick={createList}
                        className="flex-1 text-xs py-1.5 rounded-lg bg-white text-[#0D0E12] font-semibold hover:bg-gray-200 transition-all"
                      >
                        Create
                      </button>
                      <button
                        onClick={() => setCreating(false)}
                        className="px-3 text-xs py-1.5 rounded-lg bg-[#0D0E12] text-[#828690] border border-[#272A30]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1 overflow-auto py-2 px-2 space-y-0.5">
            {lists.length === 0 && (
              <div className="px-3 py-10 text-center">
                <BookMarked
                  size={22}
                  className="mx-auto text-[#4B5563] mb-2"
                />
                <p className="text-xs text-[#828690]">No lists yet.</p>
                <p className="text-[11px] text-[#4B5563] mt-1">
                  Save companies from profiles.
                </p>
              </div>
            )}
            {lists.map((list) => (
              <motion.button
                key={list.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveList(list.id)}
                className={`w-full relative text-left px-3 py-2.5 rounded-xl text-xs transition-all group flex items-center justify-between ${activeList === list.id
                    ? "text-[#F3F4F6]"
                    : "text-[#828690] hover:text-[#F3F4F6] hover:bg-[#0D0E12]"
                  }`}
              >
                {activeList === list.id && (
                  <motion.div
                    layoutId="list-active"
                    className="absolute inset-0 bg-white/[0.08] border border-white/20 rounded-xl"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative truncate">{list.name}</span>
                <span className="relative font-mono text-[10px] text-[#828690] ml-1 flex-shrink-0">
                  {list.companies.length}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* List content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            {!currentList ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex items-center justify-center"
              >
                <div className="text-center">
                  <BookMarked
                    size={40}
                    className="mx-auto text-[#4B5563] mb-3"
                  />
                  <p className="text-[#828690] mb-1">No list selected</p>
                  <p className="text-sm text-[#828690]">
                    Create a list or save companies from their profiles.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={currentList.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                {/* List header */}
                <div className="bg-[#16181D] border-b border-[#272A30] px-6 py-4 flex items-center justify-between flex-shrink-0">
                  <div>
                    <h1 className="text-lg font-semibold text-[#F3F4F6] tracking-tight">
                      {currentList.name}
                    </h1>
                    <div className="flex items-center gap-2 text-xs text-[#828690] mt-0.5">
                      <Users size={11} />
                      {currentList.companies.length} companies
                      <span className="text-[#272A30]">|</span>
                      <span className="font-mono">
                        Created{" "}
                        {new Date(
                          currentList.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => exportList(currentList, "csv")}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#272A30] bg-[#0D0E12] text-[#828690] hover:text-[#F3F4F6] text-xs transition-all"
                      >
                        <Download size={12} />
                        CSV
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => exportList(currentList, "json")}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#272A30] bg-[#0D0E12] text-[#828690] hover:text-[#F3F4F6] text-xs transition-all"
                      >
                        <Download size={12} />
                        JSON
                      </motion.button>
                    </div>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Delete list "${currentList.name}"?`
                          )
                        )
                          deleteList(currentList.id);
                      }}
                      className="p-2 rounded-lg text-[#828690] hover:text-[#F33959] hover:bg-[#F33959]/[0.08] transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Companies */}
                <div className="flex-1 overflow-auto">
                  {currentCompanies.length === 0 ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <Building2
                          size={32}
                          className="mx-auto text-[#4B5563] mb-3"
                        />
                        <p className="text-[#828690] text-sm">
                          This list is empty.
                        </p>
                        <Link
                          href="/companies"
                          className="text-[#F3F4F6] hover:underline text-sm mt-1.5 inline-flex items-center gap-1"
                        >
                          Browse companies
                          <ArrowUpRight size={13} />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 grid gap-3">
                      {currentCompanies.map((company: any, i: number) => (
                        <motion.div
                          key={company.id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="flex items-center gap-4 p-4 rounded-xl bg-[#16181D] border border-[#272A30] hover:border-[#3A3D44] transition-colors group"
                        >
                          <div className="w-9 h-9 rounded-xl bg-[#272A30] flex items-center justify-center text-sm font-bold text-[#828690] flex-shrink-0 group-hover:text-[#F3F4F6] transition-all border border-[#272A30]">
                            {company.name[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/companies/${company.id}`}
                                className="font-medium text-[#F3F4F6] hover:text-white transition-colors"
                              >
                                {company.name}
                              </Link>
                              <span className="text-[11px] text-[#828690] font-mono">
                                {company.domain}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-xs text-[#828690]">
                              <span>{company.stage}</span>
                              <span className="text-[#272A30]">
                                &middot;
                              </span>
                              <span>{company.sector}</span>
                              <span className="text-[#1A2235]">
                                &middot;
                              </span>
                              <span>{company.location}</span>
                            </div>
                          </div>
                          <ThesisScoreBadge
                            score={company.thesisScore}
                            size="sm"
                          />
                          <Link
                            href={`/companies/${company.id}`}
                            className="p-1.5 rounded-lg text-[#828690] hover:text-[#F3F4F6] hover:bg-white/[0.08] transition-all"
                          >
                            <ArrowUpRight size={14} />
                          </Link>
                          <button
                            onClick={() =>
                              removeCompany(currentList.id, company.id)
                            }
                            className="p-1.5 rounded-lg text-[#828690] hover:text-[#F33959] hover:bg-[#F33959]/[0.08] transition-all"
                          >
                            <X size={14} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
}
