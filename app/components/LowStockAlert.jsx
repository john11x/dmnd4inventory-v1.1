"use client";

export default function LowStockAlert({ alert }) {
  const critical = alert.stock === 0;

  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl border px-5 py-4 shadow-inner ${
        critical
          ? "border-rose-500/40 bg-rose-500/10 text-rose-50"
          : "border-amber-400/30 bg-amber-400/10 text-amber-50"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] opacity-70">Alert</p>
          <p className="text-lg font-semibold">{alert.product}</p>
        </div>
        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          {critical ? "Out of Stock" : "Low Stock"}
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p>
          Stock <span className="font-semibold">{alert.stock}</span> / Threshold{" "}
          <span className="font-semibold">{alert.threshold}</span>
        </p>
        <button className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:border-white/60 hover:bg-white/20">
          Restock Now
        </button>
      </div>
    </div>
  );
}
