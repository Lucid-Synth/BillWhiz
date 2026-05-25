"use client";

import Link from "next/link";
import Image from "next/image";
import {
  useState,
  useEffect,
  type JSX,
  type Dispatch,
  type SetStateAction,
} from "react";

import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import { SidebarTrigger } from "@/components/Dashboard/Sidebar";

const GithubIcon = (): JSX.Element => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export default function Dashnavbar({
  setMobileOpen,
}: {
  setMobileOpen: Dispatch<SetStateAction<boolean>>;
}): JSX.Element {
  const [open, setOpen] = useState(false);

  const { data: session } = authClient.useSession();

  const router = useRouter();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      setOpen(false);
    };

    if (open) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open]);

  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-4 sm:px-6 border-b border-white/6 bg-[#0A0B0F]/80 backdrop-blur-md sticky top-0 z-40">
      
      {/* Left */}
      <div className="flex items-center gap-3">
        
        {/* Mobile Sidebar Trigger */}
        <div className="md:hidden">
          <SidebarTrigger onClick={() => setMobileOpen(true)} />
        </div>

        {/* Title */}
        <div className="bg-linear-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent text-xl font-extrabold">
          Dashboard
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">

        {/* GitHub */}
        <Link
          href="https://github.com/Lucid-Synth/BillWhiz"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex w-8 h-8 rounded-lg items-center justify-center text-white/35 hover:text-white hover:bg-white/6 border border-transparent hover:border-white/8 transition-all"
        >
          <GithubIcon />
        </Link>

        {/* Divider */}
        <div className="hidden sm:block w-px h-5 bg-white/8 mx-1" />

        {/* Profile */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
            className="group flex items-center gap-3 rounded-2xl border border-white/6 bg-white/2 px-2 py-1.5 transition-all duration-200 hover:border-white/12 hover:bg-white/5 active:scale-[0.98]"
          >
            {/* Avatar */}
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

            {/* User Info */}
            <div className="hidden min-w-0 sm:flex flex-col items-start">
              <span className="max-w-30 truncate text-sm font-semibold text-white/90">
                {session?.user?.name || "User"}
              </span>

              <span className="max-w-35 truncate text-[11px] text-white/40">
                {session?.user?.email}
              </span>
            </div>

            {/* Chevron */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`hidden sm:block text-white/25 transition-all duration-200 group-hover:text-white/60 ${
                open ? "rotate-180" : ""
              }`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Drawer */}
          {open && (
            <div className="absolute right-0 mt-2 z-999 w-44 overflow-hidden rounded-2xl border border-white/10 bg-[#111318]/95 p-2 backdrop-blur-xl shadow-2xl">
              
              <button
                onClick={() => {
                  router.push("/dashboard/profile");
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/75 transition-colors hover:bg-white/5 hover:text-white"
              >
                Profile
              </button>

              <button
                onClick={() => {
                  setOpen(false);
                  authClient.signOut();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}