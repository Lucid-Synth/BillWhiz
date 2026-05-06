import { FadeUp, steps } from '@/app/page'

function Working() {
  return (
    <section id="how" className="relative py-28 px-6">
              <div className="max-w-5xl mx-auto">
                <FadeUp>
                  <div className="text-center mb-16">
                    <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3">
                      How it works
                    </p>
                    <h2
                      className="text-4xl md:text-5xl font-bold tracking-tight"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      Three steps to clarity
                    </h2>
                  </div>
                </FadeUp>
    
                <div className="grid md:grid-cols-3 gap-6">
                  {steps.map((step: any, i: any) => (
                    <FadeUp key={step.num} delay={i * 0.1}>
                      <div className="relative group rounded-2xl border border-white/8 bg-[#13141A] p-7 hover:border-amber-400/30 transition-colors duration-300 h-full">
                        <span
                          className="absolute top-5 right-6 text-5xl font-bold text-white/4 select-none"
                          style={{ fontFamily: "'Syne', sans-serif" }}
                        >
                          {step.num}
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mb-5">
                          {step.icon}
                        </div>
                        <h3 className="text-base font-semibold mb-2">{step.title}</h3>
                        <p className="text-sm text-white/45 leading-relaxed">{step.desc}</p>
                      </div>
                    </FadeUp>
                  ))}
                </div>
              </div>
            </section>
  )
}

export default Working