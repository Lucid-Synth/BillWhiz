"use client";

import Link from "next/link";
import { ShieldX } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-[#111111] text-white">
      {/* Icon */}
      <div className="mb-6">
        <ShieldX className="w-16 h-16 text-red-500" />
      </div>

      {/* Title */}
      <h1 className="text-5xl font-bold tracking-tight mb-2">
        401
      </h1>

      {/* Subtitle */}
      <p className="text-lg text-zinc-400 mb-6">
        You are not authorized to access this page.
      </p>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Link
          href="/signin"
          className="px-5 py-2 rounded-full text-sm font-medium bg-zinc-200 text-black hover:bg-white"
        >
          Go to Login
        </Link>

        <Link
          href="/"
          className="px-5 py-2 rounded-full text-sm font-medium border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
        >
          Back Home
        </Link>
      </div>
    </div>
  );
}