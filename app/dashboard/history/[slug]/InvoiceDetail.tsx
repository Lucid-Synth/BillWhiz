"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { JSX } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Anomaly {
  type: string;
  severity: "low" | "medium" | "high";
  confidence: number;
  description: string;
}

interface LineItem {
  item: string;
  category: string | null;
  quantity: string | number;
  unit_price: number | null;
  explanation: string | null;
  total_price: number | null;
}

interface InvoiceSummary {
  tax: any;
  total: number | null;
  currency: string | null;
  due_date: string | null;
  subtotal: any;
  vendor_name: string | null;
  invoice_date: string | null;
  invoice_number: string | null;
}

interface AiResponse {
  anomalies: Anomaly[];
  line_items: LineItem[];
  invoice_summary: InvoiceSummary;
  customer_friendly_summary: string;
}

interface Invoice {
  id: string;
  vendorName: string | null;
  invoiceNumber: string | null;
  total: number | string | null;
  currency: string | null;
  date: string | null;
  anomalyCount: number;
  lineItemCount: number;
  summarySnippet: string | null;
  status: string;
  aiResponse: AiResponse | null;
  createdAt?: string | Date | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(value: number | string | null, currency?: string | null): string {
  if (value === null || value === undefined) return "—";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "—";
  const prefix = currency ? `${currency} ` : "";
  return `${prefix}${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(raw: string | null | undefined): string {
  if (!raw) return "—";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

const SEVERITY_STYLES: Record<string, string> = {
  high:   "bg-red-500/10 border-red-500/20 text-red-400",
  medium: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  low:    "bg-blue-500/10 border-blue-500/20 text-blue-400",
};

const SEVERITY_DOT: Record<string, string> = {
  high:   "bg-red-400",
  medium: "bg-amber-400",
  low:    "bg-blue-400",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <h2 className="text-[11px] font-semibold uppercase tracking-widest text-white/25 mb-4">
      {children}
    </h2>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }): JSX.Element {
  return (
    <div className={`rounded-2xl border border-white/[0.07] bg-[#111216] ${className}`}>
      {children}
    </div>
  );
}

function StatRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }): JSX.Element {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <span className="text-xs text-white/35">{label}</span>
      <span className={`text-sm font-medium ${highlight ? "text-amber-400" : "text-white/80"}`}>
        {value}
      </span>
    </div>
  );
}

function AnomalyCard({ anomaly, index }: { anomaly: Anomaly; index: number }): JSX.Element {
  const sev = anomaly.severity?.toLowerCase() ?? "medium";
  const styleClass = SEVERITY_STYLES[sev] ?? SEVERITY_STYLES.medium;
  const dotClass = SEVERITY_DOT[sev] ?? SEVERITY_DOT.medium;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
      className={`rounded-xl border px-4 py-3.5 ${styleClass}`}
    >
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-0.5 ${dotClass}`} />
          <span className="text-xs font-semibold capitalize">{anomaly.type?.replace(/_/g, " ") ?? "Unknown"}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] capitalize tracking-wider opacity-60">{sev}</span>
          <span className="text-[10px] opacity-50">{Math.round((anomaly.confidence ?? 0) * 100)}% confidence</span>
        </div>
      </div>
      <p className="text-[11px] leading-relaxed opacity-75 pl-3.5">
        {anomaly.description}
      </p>
    </motion.div>
  );
}

function LineItemRow({ item, index, currency }: { item: LineItem; index: number; currency?: string | null }): JSX.Element {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, delay: 0.05 + index * 0.04 }}
      className="border-b border-white/5 last:border-0 group"
    >
      <td className="py-3.5 pr-4">
        <p className="text-sm text-white/80 group-hover:text-white transition-colors">{item.item ?? "—"}</p>
        {item.category && (
          <p className="text-[11px] text-white/25 mt-0.5">{item.category}</p>
        )}
        {item.explanation && (
          <p className="text-[11px] text-white/30 mt-1 leading-relaxed">{item.explanation}</p>
        )}
      </td>
      <td className="py-3.5 pr-4 text-right text-xs text-white/40 whitespace-nowrap">
        {item.quantity ?? "—"}
      </td>
      <td className="py-3.5 pr-4 text-right text-xs text-white/40 whitespace-nowrap">
        {fmt(item.unit_price, currency)}
      </td>
      <td className="py-3.5 text-right text-sm font-medium text-amber-400 whitespace-nowrap">
        {fmt(item.total_price, currency)}
      </td>
    </motion.tr>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function InvoiceDetail({ invoice }: { invoice: Invoice }): JSX.Element {
  if (!invoice) {
    return (
      <div className="px-6 py-8 max-w-5xl mx-auto">
        <p className="text-sm text-white/30">Invoice not found</p>
      </div>
    );
  }

  const ai = invoice.aiResponse;
  const summary = ai?.invoice_summary;
  const anomalies = ai?.anomalies ?? [];
  const lineItems = ai?.line_items ?? [];
  const currency = summary?.currency ?? invoice.currency;

  const hasAnomalies = anomalies.length > 0;
  const highCount   = anomalies.filter(a => a.severity?.toLowerCase() === "high").length;
  const mediumCount = anomalies.filter(a => a.severity?.toLowerCase() === "medium").length;

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">

      {/* Back */}
      <motion.div initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
        <Link
          href="/dashboard/history"
          className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors mb-6 group"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
            <path d="M19 12H5"/><path d="m12 5-7 7 7 7"/>
          </svg>
          Invoice history
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {invoice.vendorName ?? summary?.vendor_name ?? "Unknown vendor"}
            </h1>
            <p className="text-sm text-white/30 font-mono mt-0.5">
              {invoice.invoiceNumber ?? summary?.invoice_number ?? "—"}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Status badge */}
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 capitalize">
              {invoice.status ?? "completed"}
            </span>

            {/* Anomaly summary badge */}
            {hasAnomalies ? (
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                {anomalies.length} {anomalies.length === 1 ? "anomaly" : "anomalies"}
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Clean
              </span>
            )}
          </div>
        </div>

        {/* Customer-friendly summary */}
        {ai?.customer_friendly_summary && (
          <p className="mt-4 text-sm text-white/50 leading-relaxed max-w-2xl border-l-2 border-amber-400/30 pl-4">
            {ai.customer_friendly_summary}
          </p>
        )}
      </motion.div>

      {/* Top grid: Financial summary + Invoice details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

        {/* Financial summary */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          <SectionHeading>Financial summary</SectionHeading>
          <Card className="px-5 py-1">
            <StatRow label="Subtotal"  value={fmt(summary?.subtotal, currency)} />
            <StatRow label="Tax"       value={fmt(summary?.tax, currency)} />
            <StatRow label="Total"     value={fmt(summary?.total ?? invoice.total, currency)} highlight />
            <StatRow label="Currency"  value={currency ?? "—"} />
          </Card>
        </motion.div>

        {/* Invoice details */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          <SectionHeading>Invoice details</SectionHeading>
          <Card className="px-5 py-1">
            <StatRow label="Invoice #"     value={summary?.invoice_number ?? invoice.invoiceNumber ?? "—"} />
            <StatRow label="Invoice date"  value={formatDate(summary?.invoice_date ?? invoice.date)} />
            <StatRow label="Due date"      value={formatDate(summary?.due_date)} />
            <StatRow label="Vendor"        value={summary?.vendor_name ?? invoice.vendorName ?? "—"} />
          </Card>
        </motion.div>
      </div>

      {/* Anomalies */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <SectionHeading>
            Anomalies
          </SectionHeading>
          {hasAnomalies && (
            <div className="flex items-center gap-2 mb-4">
              {highCount > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/15 text-red-400">
                  {highCount} high
                </span>
              )}
              {mediumCount > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/15 text-amber-400">
                  {mediumCount} medium
                </span>
              )}
            </div>
          )}
        </div>

        {hasAnomalies ? (
          <div className="flex flex-col gap-2.5">
            {anomalies.map((a, i) => (
              <AnomalyCard key={i} anomaly={a} index={i} />
            ))}
          </div>
        ) : (
          <Card className="px-5 py-6 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <p className="text-sm text-white/40">No anomalies detected. This invoice looks clean.</p>
          </Card>
        )}
      </motion.div>

      {/* Line items */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
        className="mb-6"
      >
        <SectionHeading>Line items ({lineItems.length})</SectionHeading>
        <Card className="overflow-hidden">
          {lineItems.length === 0 ? (
            <p className="text-sm text-white/30 px-5 py-6">No line items found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-[10px] uppercase tracking-widest text-white/20 px-5 py-3 font-medium">Item</th>
                    <th className="text-right text-[10px] uppercase tracking-widest text-white/20 pr-4 py-3 font-medium">Qty</th>
                    <th className="text-right text-[10px] uppercase tracking-widest text-white/20 pr-4 py-3 font-medium">Unit price</th>
                    <th className="text-right text-[10px] uppercase tracking-widest text-white/20 px-5 py-3 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="px-5">
                  {lineItems.map((item, i) => (
                    <tr key={i} className="border-b border-white/5 last:border-0 group">
                      <td className="py-3.5 px-5 pr-4">
                        <p className="text-sm text-white/80 group-hover:text-white transition-colors">{item.item ?? "—"}</p>
                        {item.category && (
                          <p className="text-[11px] text-white/25 mt-0.5">{item.category}</p>
                        )}
                        {item.explanation && (
                          <p className="text-[11px] text-white/30 mt-1 leading-relaxed max-w-sm">{item.explanation}</p>
                        )}
                      </td>
                      <td className="py-3.5 pr-4 text-right text-xs text-white/40 whitespace-nowrap align-top pt-4">
                        {item.quantity ?? "—"}
                      </td>
                      <td className="py-3.5 pr-4 text-right text-xs text-white/40 whitespace-nowrap align-top pt-4">
                        {fmt(item.unit_price, currency)}
                      </td>
                      <td className="py-3.5 px-5 text-right text-sm font-medium text-amber-400 whitespace-nowrap align-top pt-4">
                        {fmt(item.total_price, currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* Totals footer */}
                {(summary?.subtotal !== null || summary?.tax !== null || summary?.total !== null) && (
                  <tfoot>
                    <tr className="border-t border-white/10">
                      <td colSpan={3} className="py-3 px-5 text-right text-xs text-white/30">Subtotal</td>
                      <td className="py-3 px-5 text-right text-xs text-white/50">{fmt(summary?.subtotal, currency)}</td>
                    </tr>
                    {summary?.tax !== null && summary?.tax !== undefined && (
                      <tr>
                        <td colSpan={3} className="py-1 px-5 text-right text-xs text-white/30">Tax</td>
                        <td className="py-1 px-5 text-right text-xs text-white/50">{fmt(summary?.tax, currency)}</td>
                      </tr>
                    )}
                    <tr className="border-t border-white/[0.07]">
                      <td colSpan={3} className="py-3.5 px-5 text-right text-xs font-semibold text-white/50">Total</td>
                      <td className="py-3.5 px-5 text-right text-base font-bold text-amber-400">{fmt(summary?.total ?? invoice.total, currency)}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Raw AI response (collapsible) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.25 }}
      >
        <SectionHeading>Raw AI response</SectionHeading>
        <Card className="overflow-hidden">
          <details className="group">
            <summary className="px-5 py-4 cursor-pointer list-none flex items-center justify-between text-xs text-white/30 hover:text-white/50 transition-colors select-none">
              <span>View raw JSON</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-open:rotate-180 transition-transform">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </summary>
            <div className="border-t border-white/5 px-5 py-4 overflow-x-auto">
              <pre className="text-[11px] text-white/40 font-mono leading-relaxed whitespace-pre-wrap break-all">
                {JSON.stringify(ai, null, 2)}
              </pre>
            </div>
          </details>
        </Card>
        <div className="py-6 flex items-center justify-end">
          <button className="px-5 py-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/15 text-sm font-bold hover:bg-amber-300/10 active:scale-[0.98] disabled:opacity-60 transition-all flex items-center gap-2 "
          onClick={async () => {
            await fetch("/api/send-email",{
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify(invoice)
            }
            )
            alert("Email Sent!")
          }}>Send as mail</button>
        </div>
      </motion.div>

    </div>
  );
}
