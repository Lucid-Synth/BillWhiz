"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { JSX } from "react";
import { authClient } from "@/app/lib/auth-client";
import Image from "next/image";

interface NavItem {
  label: string;
  href: string;
  icon: JSX.Element;
}

const navItems: NavItem[] = [
  {
    label: "Analyze Invoice",
    href: "/dashboard",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: "History",
    href: "/dashboard/history",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    label: "Send Email",
    href: "/dashboard/send",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

export default function Sidebar(): JSX.Element {
  const [open, setOpen] = useState<boolean>(true);
  const pathname = usePathname();

  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch //refetch the session
  } = authClient.useSession()

  return (
    <motion.aside
      animate={{ width: open ? 220 : 64 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col h-screen bg-[#0D0E12] border-r border-white/6 shrink-0 overflow-hidden"
    >
      {/* Logo + toggle */}
      <div className="flex items-center h-14 px-4 border-b border-white/6 shrink-0">
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="logo"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-2.5 mr-auto"
            >
              <div className="w-6 h-6 rounded-md bg-amber-400 flex items-center justify-center shrink-0">
                <span className="text-[#0A0B0F] font-bold text-xs leading-none">B</span>
              </div>
              <span className="font-semibold text-sm tracking-wide whitespace-nowrap">BillWhiz</span>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setOpen((v) => !v)}
          className={`w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/6 transition-all ${!open ? "mx-auto" : "ml-auto"}`}
        >
          <motion.svg
            animate={{ rotate: open ? 0 : 180 }}
            transition={{ duration: 0.25 }}
            width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </motion.svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 group
                ${active
                  ? "bg-amber-400/10 text-amber-400"
                  : "text-white/40 hover:text-white/80 hover:bg-white/4"
                }
              `}
            >
              {active && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-xl bg-amber-400/10"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <span className="relative shrink-0">{item.icon}</span>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.span
                    key="label"
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -4 }}
                    transition={{ duration: 0.15 }}
                    className="relative text-sm font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip when collapsed */}
              {!open && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-[#1A1B22] border border-white/8 text-xs font-medium text-white/70 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className={`shrink-0 px-2 py-3 border-t border-white/6 flex items-center gap-3 ${!open && "justify-center"}`}>
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-white/10 bg-linear-to-br from-orange-400/20 to-yellow-400/20">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || "User"}
              fill
              className="object-cover"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-orange-400">
              {session?.user?.name?.charAt(0).toUpperCase() || "U"}
            </span>
          )}
        </div>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="user"
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.15 }}
              className="min-w-0"
            >
              <p className="text-xs font-medium text-white/70 truncate">{session?.user?.name}</p>
              <p className="text-[11px] text-white/25 truncate">{session?.user?.email}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}