"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  {
    label: "Overview",
    description: "Insights & KPIs",
    href: "/admin/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-indigo-200">
        <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="13" y="3" width="8" height="5" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="13" y="10" width="8" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    label: "Inventory",
    description: "Catalog & stock",
    href: "/admin/products",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-indigo-200">
        <path
          d="M4 7.5L12 3l8 4.5-8 4.5L4 7.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M4 12l8 4.5 8-4.5M12 21v-4.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  },
  {
    label: "Orders",
    description: "Fulfillment hub",
    href: "/admin/orders",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-indigo-200">
        <path
          d="M7 6h10M7 12h10M7 18h6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <rect
          x="3.75"
          y="3.75"
          width="16.5"
          height="16.5"
          rx="2.25"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    )
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass-panel hidden h-full w-72 flex-col border border-white/5 bg-slate-900/70 px-6 py-8 text-sm text-slate-200 shadow-2xl lg:flex">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Control Room</p>
        <h2 className="text-2xl font-semibold text-white">Admin Panel</h2>
        <p className="text-xs text-slate-400">Realtime visibility across the network</p>
      </div>

      <nav className="mt-8 flex flex-col gap-2">
        {NAV_LINKS.map((link) => {
          const active = pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex flex-col rounded-2xl border px-4 py-3 transition ${
                active
                  ? "border-indigo-400/40 bg-indigo-500/10 text-white shadow-lg shadow-indigo-500/25"
                  : "border-white/5 bg-white/5 hover:border-indigo-400/20 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-2xl border text-indigo-100 ${
                    active
                      ? "border-indigo-400/60 bg-indigo-500/80 shadow shadow-indigo-500/50"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  {link.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold">{link.label}</p>
                  <p className="text-xs text-slate-400">{link.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900/40 via-slate-900/60 to-slate-900/80 p-5">
        <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">AI Monitor</p>
        <p className="mt-2 text-lg font-semibold text-white">Realtime Forecast</p>
        <p className="text-xs text-slate-400">
          Demand projections refresh every 15 minutes with anomaly detection.
        </p>
      </div>
    </aside>
  );
}
