"use client";

export default function ProductCard({ product, onOrder }) {
  const stockLabel =
    product.stock === 0
      ? "bg-rose-500/20 text-rose-100"
      : product.stock <= 10
      ? "bg-amber-400/20 text-amber-100"
      : "bg-emerald-500/20 text-emerald-100";

  const imageIsUrl = typeof product.image === "string" && product.image.startsWith("http");

  return (
    <div className="frosted-card flex h-full flex-col gap-4 p-5">
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900/60 via-slate-900/30 to-slate-900/70 p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent"></div>
        <div className="relative flex h-44 items-center justify-center rounded-2xl bg-white/5">
          {imageIsUrl ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full rounded-2xl object-cover"
            />
          ) : (
            <span className="text-6xl">{product.image || "📦"}</span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-white">{product.name}</p>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${stockLabel}`}>
            {product.stock === 0 ? "Out" : `${product.stock} left`}
          </span>
        </div>
        <p className="text-sm uppercase tracking-[0.35em] text-slate-400">{product.category}</p>
        <p className="text-2xl font-semibold text-indigo-200">${product.price}</p>
      </div>

      {onOrder && (
        <button
          onClick={() => onOrder(product)}
          disabled={product.stock === 0}
          className="mt-auto rounded-2xl bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-orange-400 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-indigo-500/30 transition disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/50 disabled:shadow-none"
        >
          {product.stock === 0 ? "Unavailable" : "Quick Order"}
        </button>
      )}
    </div>
  );
}
