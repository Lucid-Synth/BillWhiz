"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { JSX } from "react";
import { authClient } from "@/app/lib/auth-client";
import { redirect } from "next/navigation";


interface HistoryItem {
  id: string;
  vendor_name: string;
  invoice_number: string;
  total: number;
  currency: string;
  date: string;
  anomaly_count: number;
  line_item_count: number;
  summary_snippet: string;
}

// ─── Mock data — replace with your API call ───────────────────────────────────

const MOCK_HISTORY: HistoryItem[] = [
  {
    id: "inv_01",
    vendor_name: "Acme Corp",
    invoice_number: "INV-2025-001",
    total: 4820,
    currency: "USD",
    date: "2025-05-20",
    anomaly_count: 2,
    line_item_count: 5,
    summary_snippet: "Monthly SaaS subscription plus consulting hours. A duplicate setup fee was flagged.",
  },
  {
    id: "inv_02",
    vendor_name: "TechVault Ltd",
    invoice_number: "INV-2025-089",
    total: 12400,
    currency: "USD",
    date: "2025-05-14",
    anomaly_count: 0,
    line_item_count: 8,
    summary_snippet: "Annual infrastructure renewal covering cloud hosting, CDN, and managed backups.",
  },
  {
    id: "inv_03",
    vendor_name: "Freelance / Jana K.",
    invoice_number: "FRL-0042",
    total: 3200,
    currency: "USD",
    date: "2025-05-08",
    anomaly_count: 1,
    line_item_count: 3,
    summary_snippet: "Design retainer for May. One line item appears to exceed the agreed hourly rate.",
  },
  {
    id: "inv_04",
    vendor_name: "Global Logistics Inc.",
    invoice_number: "GL-78821",
    total: 890,
    currency: "USD",
    date: "2025-04-29",
    anomaly_count: 0,
    line_item_count: 2,
    summary_snippet: "Standard freight invoice for two shipments. No anomalies detected.",
  },
  {
    id: "inv_05",
    vendor_name: "Bright Media Agency",
    invoice_number: "BMA-2025-11",
    total: 7650,
    currency: "USD",
    date: "2025-04-18",
    anomaly_count: 3,
    line_item_count: 6,
    summary_snippet: "Q2 marketing campaign invoice. Three charges flagged for missing deliverable references.",
  },
  {
    id: "inv_06",
    vendor_name: "CloudBase Pro",
    invoice_number: "CB-00391",
    total: 299,
    currency: "USD",
    date: "2025-04-01",
    anomaly_count: 0,
    line_item_count: 1,
    summary_snippet: "Single-line monthly subscription. Invoice looks clean and matches the plan tier.",
  },
];


function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmt(value: number, currency: string): string {
  return `${currency} ${value.toLocaleString()}`;
}


function EmptyState(): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center col-span-full">
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-3xl bg-amber-400/10 blur-xl scale-110" />
        <div className="relative w-16 h-16 rounded-3xl bg-[#111216] border border-amber-400/20 flex items-center justify-center">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
      </div>
      <p className="text-sm font-semibold text-white/50 mb-1.5">No history yet</p>
      <p className="text-xs text-white/25 max-w-50 leading-relaxed mb-5">
        Analyzed invoices will appear here once you upload one
      </p>
      <Link
        href="/dashboard/analyze"
        className="px-4 py-2 rounded-xl bg-amber-400 text-[#0A0B0F] text-xs font-bold hover:bg-amber-300 transition-colors"
      >
        Analyze your first invoice
      </Link>
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

          {/* Card top */}
          <div className="px-5 pt-5 pb-4 border-b border-white/5 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white/85 truncate group-hover:text-white transition-colors">
                {item.vendor_name}
              </p>
              <p className="text-[11px] text-white/30 font-mono mt-0.5">{item.invoice_number}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-base font-bold text-amber-400">{fmt(item.total, item.currency)}</p>
              <p className="text-[11px] text-white/25 mt-0.5">{formatDate(item.date)}</p>
            </div>
          </div>

          {/* Summary snippet */}
          <div className="px-5 py-4 flex-1">
            <p className="text-xs text-white/40 leading-relaxed line-clamp-3">
              {item.summary_snippet}
            </p>
          </div>

          {/* Card footer */}
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
            active === o.value
              ? "bg-amber-400 text-[#0A0B0F]"
              : "text-white/35 hover:text-white/70"
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
  const [search, setSearch] = useState<string>("");

  const filtered = MOCK_HISTORY.filter((item) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "anomalies" && item.anomaly_count > 0) ||
      (filter === "clean"     && item.anomaly_count === 0);

    const q = search.toLowerCase();
    const matchesSearch =
      q === "" ||
      item.vendor_name.toLowerCase().includes(q) ||
      item.invoice_number.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  const{ data:session,
        refetch
  } = authClient.useSession()

  if(!session){
    redirect('/unauthorized');
  }

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-xl font-bold text-white tracking-tight mb-0.5">Invoice History</h1>
        <p className="text-sm text-white/30">All your previously analyzed invoices</p>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6"
      >
        {/* Search */}
        <div className="relative flex-1 w-full sm:max-w-xs">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vendor or invoice #"
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-white bg-white/4 border border-white/8 hover:border-white/[0.14] focus:border-amber-400/50 focus:bg-white/6 outline-none transition-all placeholder:text-white/20"
          />
        </div>

        <FilterBar active={filter} onChange={setFilter} />

        <span className="text-xs text-white/20 sm:ml-auto">
          {filtered.length} {filtered.length === 1 ? "result" : "results"}
        </span>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          filtered.map((item, i) => (
            <HistoryCard key={item.id} item={item} index={i} />
          ))
        )}
      </div>
    </div>
  );
}