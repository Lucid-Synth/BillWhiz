"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { JSX, FormEvent, ChangeEvent } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = "login" | "signup";

interface Field {
  id: string;
  label: string;
  type: string;
  placeholder: string;
}

interface FormState {
  email: string;
  password: string;
  name: string;
}

// ─── Field config ─────────────────────────────────────────────────────────────

const signupFields: Field[] = [
  { id: "name",     label: "Full name",       type: "text",     placeholder: "Jane Smith" },
  { id: "email",    label: "Email address",   type: "email",    placeholder: "jane@company.com" },
  { id: "password", label: "Password",        type: "password", placeholder: "Min. 8 characters" },
];

const loginFields: Field[] = [
  { id: "email",    label: "Email address",   type: "email",    placeholder: "jane@company.com" },
  { id: "password", label: "Password",        type: "password", placeholder: "Your password" },
];

// ─── Tiny logo mark ───────────────────────────────────────────────────────────

const Logo = (): JSX.Element => (
  <div className="flex items-center gap-2.5">
    <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-400/20">
      <span className="text-[#0A0B0F] font-bold text-base leading-none select-none">B</span>
    </div>
    <span className="font-semibold text-white text-sm tracking-wide">BillWhiz</span>
  </div>
);

// ─── Input component ──────────────────────────────────────────────────────────

interface InputProps {
  field: Field;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const FloatingInput = ({ field, value, onChange }: InputProps): JSX.Element => {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <div className="relative">
      <input
        id={field.id}
        name={field.id}
        type={field.type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete={field.type === "password" ? "current-password" : field.id}
        placeholder=""
        className={`
          peer w-full px-4 pt-5 pb-2 rounded-xl text-sm text-white bg-white/4
          border transition-all duration-200 outline-none
          ${focused
            ? "border-amber-400/60 bg-white/6 shadow-[0_0_0_3px_rgba(251,191,36,0.08)]"
            : "border-white/8 hover:border-white/[0.14]"
          }
        `}
      />
      <label
        htmlFor={field.id}
        className={`
          absolute left-4 pointer-events-none transition-all duration-200 select-none
          ${lifted
            ? "top-2 text-[10px] font-medium tracking-wider uppercase text-amber-400/80"
            : "top-1/2 -translate-y-1/2 text-sm text-white/30"
          }
        `}
      >
        {field.label}
      </label>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

export default function AuthPage(): JSX.Element {
  const [mode, setMode] = useState<Mode>("login");
  const [form, setForm] = useState<FormState>({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const fields = mode === "signup" ? signupFields : loginFields;

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    console.log(form);
    setLoading(false);
    setDone(true);
  };

  const switchMode = (next: Mode): void => {
    setMode(next);
    setForm({ email: "", password: "", name: "" });
    setDone(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0B0F] flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* ── Ambient glow ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-175 h-100 bg-amber-500/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-[-10%] w-75 h-75 bg-blue-600/5 rounded-full blur-3xl" />
        {/* Subtle grid */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="absolute top-0 bottom-0 border-l border-white/2.5"
            style={{ left: `${(i + 1) * (100 / 9)}%` }} />
        ))}
      </div>

      {/* ── Logo ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10 relative z-10"
      >
        <Logo />
      </motion.div>

      {/* ── Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="rounded-2xl border border-white/8 bg-[#111216] shadow-2xl shadow-black/60 overflow-hidden">

          {/* ── Tab switcher ── */}
          <div className="flex border-b border-white/6">
            {(["login", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`
                  flex-1 py-3.5 text-xs font-semibold uppercase tracking-widest transition-all duration-200 relative
                  ${mode === m ? "text-white" : "text-white/30 hover:text-white/60"}
                `}
              >
                {m === "login" ? "Sign in" : "Sign up"}
                {mode === m && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-4 right-4 h-px bg-amber-400"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* ── Form body ── */}
          <div className="p-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                {/* Heading */}
                <div className="mb-7">
                  <h1 className="text-xl font-bold text-white tracking-tight mb-1">
                    {mode === "login" ? "Welcome back" : "Create account"}
                  </h1>
                  <p className="text-xs text-white/35">
                    {mode === "login"
                      ? "Sign in to continue to BillWhiz"
                      : "Start understanding your invoices instantly"}
                  </p>
                </div>

                {!done ? (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    {fields.map((field) => (
                      <FloatingInput
                        key={field.id}
                        field={field}
                        value={form[field.id as keyof FormState]}
                        onChange={handleChange}
                      />
                    ))}

                    {mode === "login" && (
                      <div className="flex justify-end pt-0.5">
                        <button type="button" className="text-xs text-white/30 hover:text-amber-400 transition-colors">
                          Forgot password?
                        </button>
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="relative w-full py-3 rounded-xl bg-amber-400 text-[#0A0B0F] text-sm font-bold hover:bg-amber-300 active:scale-[0.98] transition-all duration-150 disabled:opacity-70 overflow-hidden"
                      >
                        <AnimatePresence mode="wait">
                          {loading ? (
                            <motion.span
                              key="loading"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center justify-center gap-2"
                            >
                              <span className="w-4 h-4 border-2 border-[#0A0B0F]/30 border-t-[#0A0B0F] rounded-full animate-spin" />
                              {mode === "login" ? "Signing in…" : "Creating account…"}
                            </motion.span>
                          ) : (
                            <motion.span
                              key="idle"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              {mode === "login" ? "Sign in" : "Create account"}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </button>
                    </div>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="py-6 text-center space-y-3"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <p className="text-white font-semibold text-sm">
                      {mode === "login" ? "Signed in!" : "Account created!"}
                    </p>
                    <p className="text-white/35 text-xs">
                      {mode === "login"
                        ? "Redirecting to your dashboard…"
                        : "Check your email to verify your account."}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* ── Divider + OAuth ── */}
            {!done && (
              <div className="mt-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-white/6" />
                  <span className="text-[11px] text-white/20 uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-white/6" />
                </div>
                <button
                  type="button"
                  className="w-full py-2.5 rounded-xl border border-white/8 bg-white/3 hover:bg-white/6 hover:border-white/[0.14] transition-all text-sm text-white/60 font-medium flex items-center justify-center gap-2.5"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" className="shrink-0">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Bottom note ── */}
        <p className="text-center text-[11px] text-white/20 mt-5">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => switchMode(mode === "login" ? "signup" : "login")}
            className="text-amber-400/70 hover:text-amber-400 transition-colors"
          >
            {mode === "login" ? "Sign up for free" : "Sign in"}
          </button>
        </p>
      </motion.div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&display=swap');
      `}</style>
    </div>
  );
}