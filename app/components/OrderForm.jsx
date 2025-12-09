"use client";

import { useState } from "react";
import { apiPost } from "@/app/lib/api";

export default function OrderForm({ productId }) {
  const [quantity, setQuantity] = useState(1);
  const [pending, setPending] = useState(false);

  async function placeOrder() {
    try {
      setPending(true);
      const res = await apiPost("/orders", {
        product_id: productId,
        quantity
      });
      alert(res?.message || "Order placed!");
      setQuantity(1);
    } catch (err) {
      alert(err?.message || "Order failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-4 space-y-3">
      <label className="text-xs uppercase tracking-[0.35em] text-slate-400">Quantity</label>
      <input
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => {
          const parsed = Number(e.target.value);
          setQuantity(Number.isNaN(parsed) ? 1 : Math.max(1, parsed));
        }}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        placeholder="Enter quantity"
      />

      <button
        onClick={placeOrder}
        disabled={pending}
        className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-orange-400 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-indigo-500/30 transition disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/60 disabled:shadow-none"
      >
        {pending ? "Placing..." : "Place Order"}
      </button>
    </div>
  );
}
