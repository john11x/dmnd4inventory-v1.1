"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const osFeatures = [
  {
    title: "Next-Gen Kernel",
    description: "Quantum-resistant cryptography with autonomous microkernel orchestration."
  },
  {
    title: "AI-Driven Performance",
    description: "Real-time kernel tuning with embedded ML inference pipelines."
  },
  {
    title: "Zero-Trust Security",
    description: "Hardware-rooted trust anchors with self-healing subsystems."
  }
];

const heroStats = [
  { label: "OS Versions", value: "5.0+" },
  { label: "Enterprise Deployments", value: "12.8K" },
  { label: "Security Updates", value: "24/7" }
];

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setStatsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative isolate min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-16 py-16 lg:py-24 px-6">
        <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-8">
            <div className="overflow-hidden">
              <span className={`inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 backdrop-blur-sm px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-indigo-300 transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
                Sentora OS • Enterprise 2025
              </span>
            </div>
            
            <div className="space-y-6">
              <h1 className={`text-4xl font-bold leading-tight text-white sm:text-6xl transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                The future of
                <span className="block text-transparent bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-orange-400 bg-clip-text animate-gradient">
                  operating systems
                </span>
              </h1>
              <p className={`text-lg text-slate-300 leading-relaxed transition-all duration-1000 delay-200 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                Experience the next evolution in enterprise operating systems. Sentora OS delivers 
                autonomous performance, quantum-safe security, and AI-driven optimization for 
                mission-critical infrastructure.
              </p>
            </div>
            
            <div className={`flex flex-wrap gap-4 transition-all duration-1000 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <button
                onClick={() => router.push("/auth")}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-orange-400 px-8 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-xl shadow-indigo-500/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/40 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-0"
              >
                <span className="relative z-10">Launch Console</span>
              </button>
              <button
                onClick={() => router.push("/user/home")}
                className="group rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition-all duration-300 hover:bg-white/10 hover:border-indigo-400/40 hover:shadow-lg hover:shadow-indigo-500/20"
              >
                <span className="flex items-center gap-2">
                  Explore Versions
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>
            
            <div className={`grid grid-cols-2 gap-4 sm:grid-cols-3 transition-all duration-1000 delay-500 ${statsVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              {heroStats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-3 text-center transition-all duration-300 hover:border-indigo-400/30 hover:bg-indigo-500/10 hover:shadow-lg hover:shadow-indigo-500/20"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <p className="relative text-2xl font-bold text-white">{stat.value}</p>
                  <p className="relative text-xs uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`glass-panel relative overflow-hidden p-8 transition-all duration-1000 delay-700 ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/10 to-orange-500/10"></div>
            
            <div className="relative mb-8 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">System Status</p>
              </div>
              <h2 className="text-2xl font-bold text-white">Live Operations</h2>
              <p className="text-sm text-slate-300">Real-time performance metrics</p>
            </div>
            
            <div className="relative space-y-4">
              {osFeatures.map((feature, index) => (
                <div
                  key={feature.title}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 transition-all duration-300 hover:border-indigo-400/30 hover:bg-indigo-500/10 hover:shadow-lg hover:shadow-indigo-500/20"
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <p className="text-sm font-bold text-white">{feature.title}</p>
                    <p className="text-sm text-slate-300 mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="relative mt-8 overflow-hidden rounded-2xl border border-indigo-400/30 bg-gradient-to-r from-indigo-500/20 to-fuchsia-500/20 p-5 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-fuchsia-500/10 animate-pulse"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  <p className="text-xs uppercase tracking-[0.35em] text-orange-300">Latest Release</p>
                </div>
                <p className="text-lg font-bold text-white">Sentora 5.0 Available</p>
                <p className="text-indigo-100/80 text-sm mt-1">Featuring autonomous microkernel orchestration.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={`space-y-8 transition-all duration-1000 delay-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Why Enterprise Chooses Sentora</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {osFeatures.map((feature, index) => (
              <div 
                key={feature.title} 
                className="group relative overflow-hidden frosted-card space-y-4 p-6 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20"
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-xl font-bold text-white">{feature.title}</p>
                  <p className="text-sm text-slate-300 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .delay-1000 { animation-delay: 1s; }
        .delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
}
