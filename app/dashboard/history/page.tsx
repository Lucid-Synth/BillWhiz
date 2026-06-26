"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { JSX } from "react";
import { authClient } from "@/app/lib/auth-client";
import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";

interface HistoryItem {
  id: string;
  vendor_name: string | null;
  invoice_number: string;
  total: number | null;
  currency: string;
  date: string;
  anomaly_count: number;
  line_item_count: number;
  summary_snippet: string;
  status: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmt(value: number | null, currency: string): string {
  if (value === null) return `${currency} —`;
  return `${currency} ${value.toLocaleString()}`;
}

function EmptyState(): JSX.Element {
  return (
    <div className="col-span-full py-16 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/4 mb-4">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/25">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
      </div>
      <p className="text-sm text-white/40">No invoices found</p>
      <p className="text-xs text-white/25 mt-1">Try adjusting your filters or search query</p>
    </div>
  );
}

function HistoryCard({ item, index }: { item: HistoryItem; index: number }): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/dashboard/history/${item.id}`} className="group block h-full">
        <div className="h-full rounded-2xl border border-white/[0.07] bg-[#111216] hover:border-amber-400/25 hover:bg-[#13141A] transition-all duration-200 overflow-hidden flex flex-col">
          <div className="px-5 pt-5 pb-4 border-b border-white/5 flex items-start justify-between gap-3">
            <div className="min-w-0">
              {/* Fallback for null vendor_name */}
              <p className="text-sm font-semibold text-white/85 truncate group-hover:text-white transition-colors">
                {item.vendor_name ?? "Unknown vendor"}
              </p>
              <p className="text-[11px] text-white/30 font-mono mt-0.5">{item.invoice_number}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-base font-bold text-amber-400">{fmt(item.total, item.currency)}</p>
              <p className="text-[11px] text-white/25 mt-0.5">{formatDate(item.date)}</p>
            </div>
          </div>
          <div className="px-5 py-4 flex-1">
            <p className="text-xs text-white/40 leading-relaxed line-clamp-3">
              {item.summary_snippet}
            </p>
          </div>
          <div className="px-5 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[11px] text-white/25">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
                {item.line_item_count} items
              </span>
              {item.anomaly_count > 0 ? (
                <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  {item.anomaly_count} {item.anomaly_count === 1 ? "anomaly" : "anomalies"}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Clean
                </span>
              )}
            </div>
            <span className="text-[11px] text-white/20 group-hover:text-amber-400/60 flex items-center gap-1 transition-colors">
              View details
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// EmptyState and FilterBar unchanged …

type Filter = "all" | "anomalies" | "clean";

function FilterBar({ active, onChange }: { active: Filter; onChange: (f: Filter) => void }): JSX.Element {
  const options: { label: string; value: Filter }[] = [
    { label: "All",       value: "all"       },
    { label: "Anomalies", value: "anomalies" },
    { label: "Clean",     value: "clean"     },
  ];
  return (
    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/3 border border-white/6">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            active === o.value ? "bg-amber-400 text-[#0A0B0F]" : "text-white/35 hover:text-white/70"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function HistoryPage(): JSX.Element {
  const [filter, setFilter] = useState<Filter>("all");
  const [search,  setSearch]  = useState<string>("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/history")
      .then((r) => r.json())
      .then((data) => setHistory(data.history ?? []))
      .catch(() => setError("Failed to load history"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = history.filter((item) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "anomalies" && item.anomaly_count > 0) ||
      (filter === "clean"     && item.anomaly_count === 0);
    const q = search.toLowerCase();
    const matchesSearch =
      q === "" ||
      (item.vendor_name?.toLowerCase().includes(q) ?? false) ||
      item.invoice_number.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const { data: session } = authClient.useSession();
  if (!session) console.log("Unauthorized!!");

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-xl font-bold text-white tracking-tight mb-0.5">Invoice History</h1>
        <p className="text-sm text-white/30">All your previously analyzed invoices</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6"
      >

        <FilterBar active={filter} onChange={setFilter} />
        <span className="text-xs text-white/20 sm:ml-auto">
          {filtered.length} {filtered.length === 1 ? "result" : "results"}
        </span>
      </motion.div>

      {loading && <p className="text-sm text-white/30 py-10 text-center">Loading…</p>}
      {error   && <p className="text-sm text-red-400  py-10 text-center">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            filtered.map((item, i) => <HistoryCard key={item.id} item={item} index={i} />)
          )}
        </div>
      )}
    </div>
  );
}