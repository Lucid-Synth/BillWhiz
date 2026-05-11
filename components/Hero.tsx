import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowIcon } from "@/app/page";

interface OrbProps {
  className: string;
}

function GridLines(): React.ReactElement {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="absolute top-0 bottom-0 border-l border-white/4"
          style={{ left: `${(i + 1) * (100 / 7)}%` }}
        />
      ))}
    </div>
  );
}

function Orb({ className }: OrbProps): React.ReactElement {
  return (
    <div
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
    />
  );
}

function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const techStack: string[] = ["Next.js", "Groq", "Resend", "Tesseract OCR", "Tailwind CSS"];

  return (
    <section
      ref={heroRef}
      className="relative min-h-svh flex flex-col items-center justify-center text-center px-6 pt-20 overflow-hidden"
    >
      <GridLines />
      <Orb className="w-150 h-150 bg-amber-500/10 -top-32 left-1/2 -translate-x-1/2" />
      <Orb className="w-75 h-75 bg-blue-600/10 bottom-20 -left-20" />
      <Orb className="w-62.5 h-62.5 bg-amber-500/8 bottom-10 -right-10" />

      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-10 max-w-4xl"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="inline-flex items-center gap-2 mb-8 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 text-xs font-medium tracking-wider uppercase"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          AI-powered invoice intelligence
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-7xl font-bold leading-[1.06] tracking-tight mb-6"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Invoices, <span className="text-amber-400">explained</span>
          <br />
          in plain English.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="text-lg md:text-xl text-white/50 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Upload any invoice — PDF or image — and BillWhiz uses AI to decode
          charges, catch anomalies, and email a clear summary to anyone.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.34 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <a
            href="#pricing"
            className="group flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-amber-400 text-[#0A0B0F] font-bold text-sm hover:bg-amber-300 transition-colors"
          >
            Start for free
            <span className="group-hover:translate-x-0.5 transition-transform">
              <ArrowIcon />
            </span>
          </a>
          <a
            href="#how"
            className="px-7 py-3.5 rounded-xl border border-white/10 text-white/70 text-sm hover:bg-white/5 hover:text-white transition-colors"
          >
            See how it works
          </a>
        </motion.div>

        {/* Tech stack badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-2"
        >
          {techStack.map((t) => (
            <span
              key={t}
              className="px-2.5 py-1 rounded-md text-[11px] font-mono text-white/35 border border-white/8 bg-white/3"
            >
              {t}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Hero invoice mockup */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.75, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mt-16 w-full max-w-2xl mx-auto"
      >
        <div className="rounded-2xl border border-white/10 bg-[#13141A] overflow-hidden shadow-2xl shadow-black/50">
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.07] bg-[#0F1014]">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="ml-3 text-[11px] text-white/25 font-mono">
              billwhiz — invoice analysis
            </span>
          </div>
          {/* Terminal content */}
          <div className="p-5 space-y-3 text-left text-sm font-mono">
            <div className="flex items-center gap-2 text-amber-400">
              <span>▸</span>
              <span>Parsing invoice_Q2_2025.pdf…</span>
              <span className="ml-auto text-white/25 text-xs">done</span>
            </div>
            <div className="h-px bg-white/6" />
            <p className="text-white/70 leading-relaxed">
              <span className="text-emerald-400">✓ Summary:</span> This is a
              vendor invoice from <span className="text-white">Acme Corp</span>{" "}
              totaling <span className="text-amber-300">$4,820.00</span>.
              Includes monthly SaaS subscription ($299), consulting fees (12hrs
              × $350), and a{" "}
              <span className="text-red-400 font-semibold">⚠ flagged</span>{" "}
              duplicate line item for &ldquo;Setup Fee&rdquo; charged twice.
            </p>
            <div className="h-px bg-white/6" />
            <div className="flex items-center gap-2 text-white/40 text-xs">
              <span className="text-emerald-400">✓</span>
              Email sent to{" "}
              <span className="text-white/60">finance@yourco.com</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default Hero;
