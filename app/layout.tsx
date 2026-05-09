import type { Metadata } from "next";
import "./globals.css";
import { Syne } from "next/font/google";

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
      className={`${syne.variable} h-full antialiased relative`}
    >
      <body className="min-h-full flex flex-col relative">{children}</body>
    </html>
  );
}
