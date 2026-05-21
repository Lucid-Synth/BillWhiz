import type { ReactNode } from "react";
import Sidebar from "@/components/Dashboard/Sidebar";
import Navbar from "@/components/Navbar";
import Dashnavbar from "@/components/Dashboard/Navbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#0A0B0F] text-white overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Dashnavbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}