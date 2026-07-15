import { ArrowIcon, CheckIcon, FadeUp, Orb } from '@/app/page'

const planFeatures: string[] = [
  "Unlimited invoice uploads",
  "AI explanation & anomaly detection",
  "Email delivery via Resend",
  "PDF supported via uploadthing",
  "Built on Next.js App Router",
  "Open-source & self-hostable",
];


function Pricing() {
  return (
    <section id="pricing" className="relative py-28 px-6 border-t border-white/6">
              <Orb className="w-125 h-125 bg-amber-500/6 bottom-0 left-1/2 -translate-x-1/2" />
              <div className="max-w-xl mx-auto relative z-10">
                <FadeUp>
                  <div className="text-center mb-12">
                    <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3">
                      Pricing
                    </p>
                    <h2
                      className="text-4xl md:text-5xl font-bold tracking-tight"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      Always free.
                    </h2>
                    <p className="mt-4 text-white/45 text-base">
                      Open-source and self-hostable. No credit card, no trial period.
                    </p>
                  </div>
                </FadeUp>
    
                <FadeUp delay={0.1}>
                  <div className="relative rounded-2xl border border-amber-400/30 bg-[#13141A] p-8 overflow-hidden">
                    <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
    
                    <div className="flex items-end gap-1 mb-1">
                      <span
                        className="text-6xl font-bold text-white"
                        style={{ fontFamily: "'Syne', sans-serif" }}
                      >
                        $0
                      </span>
                      <span className="text-white/40 mb-2.5 text-sm">/ forever</span>
                    </div>
                    <p className="text-white/40 text-sm mb-8">
                      Self-host in minutes on Vercel or any Node.js server.
                    </p>
    
                    <ul className="space-y-3 mb-8">
                      {planFeatures.map((feat) => (
                        <li key={feat} className="flex items-center gap-3 text-sm text-white/70">
                          <span className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                            <CheckIcon />
                          </span>
                          {feat}
                        </li>
                      ))}
                    </ul>
    
                    <a
                      href="/signin"
                      className="group flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl bg-amber-400 text-[#0A0B0F] font-bold text-sm hover:bg-amber-300 transition-colors"
                    >
                      Try for free
                      <span className="group-hover:translate-x-0.5 transition-transform">
                        <ArrowIcon />
                      </span>
                    </a>
                  </div>
                </FadeUp>
              </div>
            </section>
    
  )
}

export default Pricing