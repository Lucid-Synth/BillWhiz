"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import type { JSX } from "react";


type InvoiceResult = {
  invoice_summary: {
    vendor_name: string | null;
    invoice_number: string | null;
    invoice_date: string | null;
    due_date: string | null;
    currency: string | null;
    subtotal: number | null;
    tax: number | null;
    total: number | null;
  };
  line_items: {
    item: string;
    quantity: string;
    unit_price: number;
    total_price: number;
    category: string;
    explanation: string;
  }[];
  anomalies: {
    type: string;
    severity: string;
    description: string;
    confidence: number;
  }[];
  customer_friendly_summary: string;
};

type SeverityLevel = "high" | "medium" | "low" | string;


function severityConfig(severity: SeverityLevel): {
  card: string;
  badge: string;
  dot: string;
} {
  switch (severity.toLowerCase()) {
    case "high":
      return {
        card: "bg-red-500/[0.06] border-red-500/20",
        badge: "bg-red-500/10 border-red-500/20 text-red-400",
        dot: "bg-red-400",
      };
    case "medium":
      return {
        card: "bg-amber-500/[0.06] border-amber-500/20",
        badge: "bg-amber-500/10 border-amber-500/20 text-amber-400",
        dot: "bg-amber-400",
      };
    case "low":
      return {
        card: "bg-blue-500/[0.06] border-blue-500/20",
        badge: "bg-blue-500/10 border-blue-500/20 text-blue-400",
        dot: "bg-blue-400",
      };
    default:
      return {
        card: "bg-white/[0.03] border-white/10",
        badge: "bg-white/5 border-white/10 text-white/40",
        dot: "bg-white/30",
      };
  }
}

function fmt(value: number | null, currency: string | null): string {
  if (value === null) return "—";
  return `${currency ?? ""} ${value.toLocaleString()}`.trim();
}


function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}


function Card({ children, className = "" }: { children: React.ReactNode; className?: string }): JSX.Element {
  return (
    <div className={`rounded-2xl border border-white/[0.07] bg-[#111216] overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ label, count }: { label: string; count?: number }): JSX.Element {
  return (
    <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/[0.05]">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-white/25">{label}</span>
      {count !== undefined && (
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.07] text-white/35">
          {count}
        </span>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string | null }): JSX.Element {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
      <span className="text-xs text-white/35">{label}</span>
      <span className="text-xs font-medium text-white/75">{value ?? "—"}</span>
    </div>
  );
}


function LoadingSkeleton(): JSX.Element {
  return (
    <div className="space-y-3 animate-pulse">
      {[
        [180, "100%", "70%"],
        [220, "100%", "55%"],
        [160, "100%", "80%"],
      ].map(([_, w1, w2], i) => (
        <div key={i} className="rounded-2xl border border-white/[0.06] bg-[#111216] overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-3">
            <div className="h-2 w-24 rounded bg-white/[0.06]" />
          </div>
          <div className="px-6 py-5 space-y-3">
            <div className="h-2.5 rounded bg-white/[0.05]" style={{ width: w1 }} />
            <div className="h-2.5 rounded bg-white/[0.04]" style={{ width: w2 }} />
            <div className="h-2.5 rounded bg-white/[0.03] w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}


function EmptyState(): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      {/* Layered icon */}
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-3xl bg-amber-400/10 blur-xl scale-110" />
        <div className="relative w-16 h-16 rounded-3xl bg-[#111216] border border-amber-400/20 flex items-center justify-center">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="11" x2="12" y2="17" />
            <line x1="9" y1="14" x2="15" y2="14" />
          </svg>
        </div>
      </div>
      <p className="text-sm font-semibold text-white/50 mb-1.5">No invoice uploaded yet</p>
      <p className="text-xs text-white/25 max-w-[200px] leading-relaxed">
        Upload a PDF above to get an instant AI-powered breakdown
      </p>
    </motion.div>
  );
}



export default function PdfUploader(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleParsePdf = async (pdfUrl: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      setInvoiceData(null);
      const requestId = crypto.randomUUID();
      const response = await fetch(`/api/process?requestId=${requestId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfUrl, requestId }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Failed to process invoice");
      setInvoiceData(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const { invoice_summary: s, line_items, anomalies, customer_friendly_summary } = invoiceData ?? {};

  const hasAnomalies = anomalies !== undefined && anomalies.length > 0;

  return (
    <div className="min-h-screen bg-[#0A0B0F] text-white">

      {/* ── Ambient glow ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/[0.05] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-600/[0.04] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto px-5 py-10">

        {/* ── Nav ── */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-400/20">
              <span className="text-[#0A0B0F] font-bold text-sm leading-none">B</span>
            </div>
            <span className="font-semibold text-sm tracking-wide">BillWhiz</span>
          </div>
          {invoiceData !== null && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => { setInvoiceData(null); setError(null); }}
              className="flex items-center gap-1.5 text-xs text-white/35 hover:text-white/70 border border-white/[0.07] hover:border-white/[0.14] rounded-lg px-3 py-1.5 transition-all"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.7" />
              </svg>
              New invoice
            </motion.button>
          )}
        </div>

        {/* ── Page title ── */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-1">Invoice Analyzer</h1>
          <p className="text-sm text-white/35">Upload a PDF to get an instant AI-powered breakdown</p>
        </div>

        {/* ── Upload zone ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className="relative group mb-8"
        >
          {/* Upload overlay */}
          <div className="absolute inset-0 z-20">
            <UploadButton<OurFileRouter, "pdfUploader">
              endpoint="pdfUploader"
              appearance={{
                button:
                  "w-full h-full bg-transparent border-0 shadow-none text-transparent hover:bg-transparent",
                allowedContent: "hidden",
              }}
              content={{
                button() {
                  return <span className="hidden">Upload</span>;
                },
              }}
              className="w-full h-full opacity-0 cursor-pointer"
              onClientUploadComplete={async (res) => {
                const pdfUrl = res?.[0]?.serverData?.fileUrl;
                if (!pdfUrl) return;

                await handleParsePdf(pdfUrl);
              }}
              onUploadError={(err: Error) => setError(err.message)}
            />
          </div>

          {/* Glow */}
          <div className="absolute inset-0 rounded-2xl bg-amber-400/0 group-hover:bg-amber-400/[0.03] transition-all duration-500 pointer-events-none" />

          {/* UI */}
          <div className="rounded-2xl border-2 border-dashed border-white/[0.08] group-hover:border-amber-400/30 transition-colors duration-300 p-10 flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/40"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>

            <div className="text-center">
              <p className="text-sm font-medium text-white/60 mb-1">
                Drop your invoice here
              </p>
              <p className="text-xs text-white/25">
                PDF only · Max 10 MB
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Error ── */}
        <AnimatePresence>
          {error !== null && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3.5"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400 mt-0.5 shrink-0">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-red-400">Processing failed</p>
                <p className="text-xs text-red-400/60 mt-0.5 truncate">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="text-red-400/40 hover:text-red-400 transition-colors shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Loading ── */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-5">
            <div className="flex items-center gap-3 mb-6 px-1">
              <span className="w-4 h-4 border-2 border-amber-400/20 border-t-amber-400 rounded-full animate-spin" />
              <span className="text-sm text-white/40">Reading your invoice…</span>
            </div>
            <LoadingSkeleton />
          </motion.div>
        )}

        {/* ── Empty ── */}
        {!loading && invoiceData === null && error === null && <EmptyState />}

        {/* ── Results ── */}
        <AnimatePresence>
          {!loading && invoiceData !== null && s !== undefined && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >

              {/* ── Summary hero ── */}
              <FadeUp delay={0}>
                <div className="rounded-2xl border border-white/[0.07] bg-[#111216] overflow-hidden">
                  {/* Top band */}
                  <div className="relative px-6 pt-6 pb-5 border-b border-white/[0.05] overflow-hidden">
                    <div className="absolute right-0 top-0 w-48 h-full bg-gradient-to-l from-amber-400/[0.05] to-transparent pointer-events-none" />
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25 mb-2">Invoice Summary</p>
                        <p className="text-xl font-bold text-white leading-tight">
                          {s.vendor_name ?? "Unknown Vendor"}
                        </p>
                        <p className="text-xs text-white/30 mt-1 font-mono">
                          #{s.invoice_number ?? "N/A"}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[11px] text-white/25 mb-1">Total due</p>
                        <p className="text-3xl font-bold text-amber-400 leading-none">
                          {fmt(s.total, s.currency)}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Info rows */}
                  <div className="px-6 py-2">
                    <InfoRow label="Invoice date" value={s.invoice_date} />
                    <InfoRow label="Due date" value={s.due_date} />
                    <InfoRow label="Subtotal" value={fmt(s.subtotal, s.currency)} />
                    <InfoRow label="Tax" value={fmt(s.tax, s.currency)} />
                  </div>
                </div>
              </FadeUp>

              {/* ── AI explanation ── */}
              {customer_friendly_summary !== undefined && customer_friendly_summary?.length > 0 && (
                <FadeUp delay={0.07}>
                  <div className="rounded-2xl border border-amber-400/15 bg-gradient-to-br from-amber-400/[0.06] to-transparent p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 rounded-md bg-amber-400/15 border border-amber-400/20 flex items-center justify-center">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.16Z" />
                          <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.16Z" />
                        </svg>
                      </div>
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-400/60">AI Explanation</span>
                    </div>
                    <p className="text-sm text-white/60 leading-relaxed">{customer_friendly_summary}</p>
                  </div>
                </FadeUp>
              )}

              {/* ── Line items ── */}
              {line_items !== undefined && line_items.length > 0 && (
                <FadeUp delay={0.12}>
                  <Card>
                    <CardHeader label="Line Items" count={line_items.length} />
                    <div className="p-3 space-y-2">
                      {line_items.map((item, i) => (
                        <div key={i} className="rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] p-4 transition-colors group">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <p className="text-sm font-semibold text-white/85 leading-snug">{item.item}</p>
                            <p className="text-sm font-bold text-amber-400 shrink-0 tabular-nums">
                              {fmt(item.total_price, s.currency)}
                            </p>
                          </div>
                          <p className="text-xs text-white/35 leading-relaxed mb-3">{item.explanation}</p>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-[11px] text-white/20 font-mono">×{item.quantity}</span>
                            <span className="text-[11px] text-white/20">@ {fmt(item.unit_price, s.currency)}</span>
                            {item.category?.length ? (
                              <span className="ml-auto text-[11px] px-2 py-0.5 rounded-full border border-white/[0.07] bg-white/[0.03] text-white/25">
                                {item.category}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </FadeUp>
              )}

              {/* ── Anomalies ── */}
              <FadeUp delay={0.16}>
                <Card>
                  <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/[0.05]">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-white/25">
                      Anomalies
                    </span>
                    {hasAnomalies ? (
                      <span className="flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        {anomalies.length} found
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Clean
                      </span>
                    )}
                  </div>

                  {!hasAnomalies ? (
                    <div className="flex items-center gap-4 px-6 py-6">
                      <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center shrink-0">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white/60">No anomalies detected</p>
                        <p className="text-xs text-white/25 mt-0.5">This invoice looks clean and consistent.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 space-y-2">
                      {anomalies.map((anomaly, i) => {
                        const cfg = severityConfig(anomaly.severity);
                        return (
                          <div key={i} className={`rounded-xl border p-4 ${cfg.card}`}>
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full shrink-0 mt-0.5 ${cfg.dot}`} />
                                <p className="text-sm font-semibold text-white/80">{anomaly.type}</p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className={`text-[11px] px-2 py-0.5 rounded-full border capitalize ${cfg.badge}`}>
                                  {anomaly.severity}
                                </span>
                                <span className="text-[11px] text-white/20 tabular-nums">
                                  {Math.round(anomaly.confidence * 100)}%
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-white/45 leading-relaxed pl-4">{anomaly.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>
              </FadeUp>

              {/* ── Reset ── */}
              <FadeUp delay={0.2}>
                <button
                  onClick={() => { setInvoiceData(null); setError(null); }}
                  className="w-full py-3 rounded-xl border border-white/[0.06] hover:border-white/[0.12] text-sm text-white/30 hover:text-white/60 transition-all flex items-center justify-center gap-2"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.7" />
                  </svg>
                  Upload another invoice
                </button>
              </FadeUp>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}