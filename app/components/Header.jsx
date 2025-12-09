"use client";

import Link from "next/link";
import { useContext, useMemo } from "react";
import { usePathname } from "next/navigation";
import { AuthContext } from "../providers/AuthProvider";

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "OS Versions", href: "/admin/products" },
  { label: "Orders", href: "/admin/orders" }
];

const USER_NAV = [
  { label: "OS Catalog", href: "/user/home" },
  { label: "My Orders", href: "/user/order" }
];

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const pathname = usePathname();

  const navItems = useMemo(() => {
    if (user?.role === "ROLE_ADMIN") return ADMIN_NAV;
    if (user?.role === "ROLE_USER") return USER_NAV;
    return null;
  }, [user]);

  const initials = useMemo(() => {
    if (!user?.name) return "SO";
    return user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 text-sm sm:px-8">
        <Link href="/" className="group flex items-center gap-3 transition-all duration-300 hover:scale-105">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-orange-400 text-base font-bold text-white shadow-lg shadow-indigo-500/40 group-hover:shadow-2xl group-hover:shadow-indigo-500/60">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-indigo-300">Sentora</p>
            <p className="text-lg font-bold text-white">Enterprise OS</p>
          </div>
        </Link>

        {navItems && (
          <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs font-medium text-slate-300 lg:flex backdrop-blur-sm">
            {navItems.map((item) => {
              const active = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-1.5 transition-all duration-300 hover:scale-105 ${
                    active
                      ? "bg-gradient-to-r from-indigo-500/80 to-fuchsia-500/80 text-white shadow shadow-indigo-500/40"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold text-white">{user.name}</p>
                <p className="text-[11px] uppercase tracking-[0.3em] text-indigo-300">
                  {user.role?.replace("ROLE_", "")}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold uppercase text-white backdrop-blur-sm">
                {initials}
              </div>
              <button
                onClick={logout}
                className="btn-primary rounded-full bg-gradient-to-r from-rose-500 to-indigo-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-rose-500/30 transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/40"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth"
                className="soft-button px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition-all duration-300 hover:scale-105"
              >
                Sign In
              </Link>
              <Link
                href="/auth"
                className="btn-primary rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-sky-500/30 transition-all duration-300 hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
