"use client";

import { useState } from "react";
import Sidebar from "@/components/Dashboard/Sidebar";
import Dashnavbar from "@/components/Dashboard/Navbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div  className="flex h-screen bg-[#0A0B0F] text-white overflow-hidden">
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Dashnavbar setMobileOpen={setMobileOpen} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}