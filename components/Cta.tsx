"use client";

import { FadeUp } from "@/app/page";
import { useState } from "react";

function Cta() {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = (): void => {
    void navigator.clipboard.writeText(
      "git clone https://github.com/Lucid-Synth/BillWhiz",
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <section className="py-24 px-6 border-t border-white/6">
      <div className="max-w-3xl mx-auto text-center">
        <FadeUp>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight mb-5"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Stop guessing what your invoices mean.
          </h2>

          <p className="text-white/45 text-lg mb-10">
            BillWhiz turns a wall of numbers into a human-readable summary — in
            seconds.
          </p>

          <button
            type="button"
            onClick={handleCopy}
            className="group mx-auto flex items-center gap-3 px-5 py-3 rounded-xl border border-white/10 bg-[#13141A] font-mono text-sm text-white/60 hover:border-white/20 hover:text-white/80 transition-all"
          >
            <span className="text-amber-400">$</span>

            <span>git clone https://github.com/Lucid-Synth/BillWhiz</span>

            <span className="ml-2 text-xs text-white/30 group-hover:text-amber-400 transition-colors">
              {copied ? "copied!" : "copy"}
            </span>
          </button>
        </FadeUp>
      </div>
    </section>
  );
}

export default Cta;