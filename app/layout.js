"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import AuthProvider from "./providers/AuthProvider";
import RealtimeProvider from "./providers/RealtimeProvider";
import Header from "./components/Header";

const inter = Inter({
  subsets: ["latin"],
  display: "swap"
});

export default function RootLayout({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en" className="bg-slate-950" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-transparent text-slate-100 antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <RealtimeProvider>
            <div className="relative min-h-screen overflow-hidden">
              <div className="pointer-events-none absolute inset-x-0 top-[-320px] z-0 flex justify-center blur-3xl">
                <div className="h-[420px] w-[640px] rounded-full bg-gradient-to-r from-indigo-500/40 via-sky-400/30 to-cyan-400/30 opacity-80"></div>
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-[-200px] z-0 blur-[120px]">
                <div className="h-96 w-96 rounded-full bg-fuchsia-500/20"></div>
              </div>
              <Header />
              <main className="relative z-10 px-4 pb-12 pt-6 sm:px-8 lg:px-12">{children}</main>
            </div>
          </RealtimeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
