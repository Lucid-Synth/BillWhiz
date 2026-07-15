import Image from "next/image";
import React from "react";

function Footer() {
  return (
    <footer className="border-t border-white/6 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/30">
        <div className="flex items-center gap-2">
           <Image
                        src="https://i.pinimg.com/736x/b2/5c/5e/b25c5eb015bb5cfa887b9cd5fd9d5818.jpg"
                        alt="Logo"
                        width={28}
                        height={28}
                        className="object-cover"
                      />
          <span>BillWhiz</span>
        </div>
        <span>Open-source · Built with Next.js, Groq &amp; Resend</span>
      </div>
    </footer>
  );
}

export default Footer;
