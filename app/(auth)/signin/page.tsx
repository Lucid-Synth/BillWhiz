"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { JSX, FormEvent, ChangeEvent } from "react";
import { authClient } from "@/app/lib/auth-client";
import { redirect } from "next/navigation";
import { convertServerPatchToFullTree } from "next/dist/client/components/segment-cache/navigation";

interface Field {
  id: string;
  label: string;
  type: string;
}

interface LoginForm {
  email: string;
  password: string;
}


const fields: Field[] = [
  { id: "email", label: "Email address", type: "email" },
  { id: "password", label: "Password", type: "password" },
];

function FloatingInput({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element {
  const [focused, setFocused] = useState<boolean>(false);
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
        autoComplete={field.type === "password" ? "current-password" : "email"}
        placeholder=""
        className={[
          "w-full px-4 pt-5 pb-2 rounded-xl text-sm text-white bg-white/4",
          "border transition-all duration-200 outline-none",
          focused
            ? "border-amber-400/60 bg-white/6 shadow-[0_0_0_3px_rgba(251,191,36,0.08)]"
            : "border-white/8 hover:border-white/[0.14]",
        ].join(" ")}
        suppressHydrationWarning
      />
      <label
        htmlFor={field.id}
        className={[
          "absolute left-4 pointer-events-none transition-all duration-200 select-none",
          lifted
            ? "top-2 text-[10px] font-medium tracking-wider uppercase text-amber-400/80"
            : "top-1/2 -translate-y-1/2 text-sm text-white/30",
        ].join(" ")}
      >
        {field.label}
      </label>
    </div>
  );
}


export default function LoginPage(): JSX.Element {
  const [mounted, setMounted] = useState<boolean>(false);
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await authClient.signIn.email({
      email: form.email,
      password: form.password,
      callbackURL: '/dashboard'
    },
      {
        onRequest: (ctx) => {
          new Promise((r) => setTimeout(r, 1200));
          setLoading(false);
        },
        onSuccess: (ctx) => {
          setDone(true);
          redirect('/dashboard');
        },
        onError: (ctx) => {
          alert(ctx.error.message)
        }
      }
    )
  };

  return (
    <div className="min-h-screen bg-[#0A0B0F] flex flex-col items-center justify-center px-4 relative overflow-hidden">

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-175 h-100 bg-amber-500/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-[-10%] w-75 h-75 bg-blue-600/5 rounded-full blur-3xl" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 border-l border-white/2.5"
            style={{ left: `${(i + 1) * (100 / 9)}%` }}
          />
        ))}
      </div>

      <motion.div
        initial={mounted ? { opacity: 0, y: -10 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.18 }}
        className="mb-10 relative z-10"
      >
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-400/20 group-hover:bg-amber-300 transition-colors">
            <span className="text-[#0A0B0F] font-bold text-base leading-none select-none">B</span>
          </div>
          <span className="font-semibold text-white text-sm tracking-wide">BillWhiz</span>
        </Link>
      </motion.div>

      <motion.div
        initial={mounted ? { opacity: 0, y: 20, scale: 0.98 } : false}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.75, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="rounded-2xl border border-white/8 bg-[#111216] shadow-2xl shadow-black/60 p-7">

          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-xl font-bold text-white tracking-tight mb-1">
              Welcome back
            </h1>
            <p className="text-xs text-white/35">
              Sign in to continue to BillWhiz
            </p>
          </div>

          <AnimatePresence mode="wait">
            {done ? (

              <motion.div
                key="success"
                initial={mounted ? { opacity: 0, scale: 0.95 } : false}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.75, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="py-8 text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="text-white font-semibold text-sm">Signed in!</p>
                <p className="text-white/35 text-xs">Redirecting to your dashboard…</p>
              </motion.div>
            ) : (

              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-3"
                noValidate
                initial={mounted ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {fields.map((field) => (
                  <FloatingInput
                    key={field.id}
                    field={field}
                    value={form[field.id as keyof LoginForm]}
                    onChange={handleChange}
                  />
                ))}

                <div className="flex justify-end pt-0.5">
                  <Link
                    href="/forgot-password"
                    className="text-xs text-white/30 hover:text-amber-400 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-amber-400 text-[#0A0B0F] text-sm font-bold hover:bg-amber-300 active:scale-[0.98] transition-all duration-150 disabled:opacity-70"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-[#0A0B0F]/30 border-t-[#0A0B0F] rounded-full animate-spin" />
                        Signing in…
                      </span>
                    ) : (
                      "Sign in"
                    )}
                  </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-white/6" />
                  <span className="text-[11px] text-white/20 uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-white/6" />
                </div>

                {/* Google */}
                <button
                  type="button"
                  className="w-full py-2.5 rounded-xl border border-white/8 bg-white/3 hover:bg-white/6 hover:border-white/[0.14] transition-all text-sm text-white/60 font-medium flex items-center justify-center gap-2.5"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" className="shrink-0">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom link */}
        <p className="text-center text-[11px] text-white/20 mt-5">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-amber-400/70 hover:text-amber-400 transition-colors">
            Sign up for free
          </Link>
        </p>
      </motion.div>
    </div>
  );
}