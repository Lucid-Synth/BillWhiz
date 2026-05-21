import type { Metadata } from "next";
import "./globals.css";
import { Syne, Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
});


export const metadata: Metadata = {
  title: "BillWhiz",
  description: "An AI invoice explainer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", "relative", syne.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col relative">{children}</body>
    </html>
  );
}
