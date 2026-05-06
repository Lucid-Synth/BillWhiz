import React from "react";

function Footer() {
  return (
    <footer className="border-t border-white/6 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/30">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-amber-400 flex items-center justify-center">
            <span className="text-[#0A0B0F] font-bold text-[10px]">B</span>
          </div>
          <span>BillWhiz</span>
        </div>
        <span>Open-source · Built with Next.js, Groq &amp; Resend</span>
      </div>
    </footer>
  );
}

export default Footer;
