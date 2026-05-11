"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as Tooltip from "@radix-ui/react-tooltip";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Working from "@/components/Working";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";


interface Step {
  num: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}

interface Feature {
  icon: React.ReactNode;
  label: string;
  tip: string;
  desc: string;
}

interface FadeUpProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

interface OrbProps {
  className: string;
}


export const UploadIcon = (): React.ReactElement => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export const BrainIcon = (): React.ReactElement => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.16Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.16Z" />
  </svg>
);

export const MailIcon = (): React.ReactElement => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export const ShieldIcon = (): React.ReactElement => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
  </svg>
);

export const ZapIcon = (): React.ReactElement => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
  </svg>
);

export const CheckIcon = (): React.ReactElement => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const ArrowIcon = (): React.ReactElement => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);


export const steps: Step[] = [
  {
    num: "01",
    icon: <UploadIcon />,
    title: "Upload your invoice",
    desc: "Drop any PDF or image — scanned receipts, vendor bills, utility statements. We handle the parsing automatically.",
  },
  {
    num: "02",
    icon: <BrainIcon />,
    title: "AI reads & explains",
    desc: "Groq's LLM breaks down every line item, flags unusual charges, and surfaces anything that looks off.",
  },
  {
    num: "03",
    icon: <MailIcon />,
    title: "Send the summary",
    desc: "A clean, plain-English explanation lands in any inbox via Resend — no jargon, no confusion.",
  },
];

export const features: Feature[] = [
  {
    icon: <ZapIcon />,
    label: "Lightning fast",
    tip: "Groq inference means results in under 2 seconds",
    desc: "Groq-powered inference delivers explanations in under 2 seconds, even on complex multi-page invoices.",
  },
  {
    icon: <ShieldIcon />,
    label: "Anomaly detection",
    tip: "AI flags duplicate or inflated charges",
    desc: "The AI flags duplicate charges, inflated line items, and inconsistencies you'd otherwise miss.",
  },
  {
    icon: <MailIcon />,
    label: "One-click sending",
    tip: "Powered by Resend for reliable delivery",
    desc: "Forward explanations to clients, accountants, or your team with a single click via Resend.",
  },
  {
    icon: <BrainIcon />,
    label: "Any format",
    tip: "PDF, JPG, PNG — all supported",
    desc: "PDFs, JPEGs, PNGs — pdf-parse and Tesseract OCR handle whatever you upload.",
  },
];



export function FadeUp({
  children,
  delay = 0,
  className = "",
}: FadeUpProps): React.ReactElement {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      initial={mounted ? { opacity: 0, y: 28 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.75,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}


export function Orb({ className }: OrbProps): React.ReactElement {
  return (
    <div className={`pointer-events-none absolute rounded-full blur-3xl ${className}`} />
  );
}

export default function Home(): React.ReactElement {



  return (
    <Tooltip.Provider delayDuration={120}>
      <div className="relative min-h-screen bg-[#0A0B0F] text-white font-sans overflow-x-hidden">

        <Navbar />


        <Hero />


        <Working />


        <Features />
        

        <Pricing />


        <Cta />


        <Footer />


      </div>
    </Tooltip.Provider>
  );
}