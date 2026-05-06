import { FadeUp, features, Orb } from '@/app/page'
import { Tooltip } from 'radix-ui'
import React from 'react'

function Features() {
  return (
    <section id="features" className="relative py-24 px-6 border-t border-white/6">
              <Orb className="w-100 h-100 bg-blue-700/8 top-0 right-0" />
              <div className="max-w-5xl mx-auto">
                <FadeUp>
                  <div className="text-center mb-16">
                    <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3">
                      Features
                    </p>
                    <h2
                      className="text-4xl md:text-5xl font-bold tracking-tight"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      Built to save you time
                    </h2>
                  </div>
                </FadeUp>
    
                <div className="grid sm:grid-cols-2 gap-5">
                  {features.map((f, i) => (
                    <FadeUp key={f.label} delay={i * 0.08}>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <div className="group cursor-default flex gap-5 p-6 rounded-2xl border border-white/[0.07] bg-[#13141A] hover:border-amber-400/25 hover:bg-[#15161C] transition-all duration-200">
                            <div className="shrink-0 w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                              {f.icon}
                            </div>
                            <div>
                              <h3 className="font-semibold text-sm mb-1.5">{f.label}</h3>
                              <p className="text-sm text-white/45 leading-relaxed">{f.desc}</p>
                            </div>
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            className="z-50 px-3 py-1.5 rounded-lg text-xs bg-amber-400 text-[#0A0B0F] font-semibold shadow-lg"
                            sideOffset={6}
                          >
                            {f.tip}
                            <Tooltip.Arrow className="fill-amber-400" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </FadeUp>
                  ))}
                </div>
              </div>
            </section>
  )
}

export default Features