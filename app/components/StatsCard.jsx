"use client";

const COLOR_MAP = {
  red: {
    ring: "from-rose-500/30 via-rose-500/5 to-transparent",
    accent: "text-rose-100",
    badge: "bg-rose-500/20 text-rose-100"
  },
  blue: {
    ring: "from-sky-500/40 via-sky-500/10 to-transparent",
    accent: "text-sky-100",
    badge: "bg-sky-500/30 text-sky-100"
  },
  green: {
    ring: "from-emerald-500/35 via-emerald-500/10 to-transparent",
    accent: "text-emerald-100",
    badge: "bg-emerald-500/20 text-emerald-50"
  }
};

export default function StatsCard({ title, value, icon, color = "green", subtext }) {
  const palette = COLOR_MAP[color] ?? COLOR_MAP.green;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-slate-900/70 via-slate-900/40 to-slate-900/60 p-6 shadow-2xl shadow-slate-950/40">
      <div className={`absolute inset-0 opacity-70 blur-3xl bg-gradient-to-br ${palette.ring}`}></div>
      <div className="relative flex items-center justify-between">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{title}</p>
          <p className="text-3xl font-semibold text-white">{value}</p>
          {subtext && <p className="text-xs text-slate-400">{subtext}</p>}
        </div>
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl ${palette.accent}`}>
          {icon}
        </div>
      </div>
      <div className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${palette.badge}`}>
        Live
        <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse"></span>
      </div>
    </div>
  );
}
