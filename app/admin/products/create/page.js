"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedClient from "../../../components/ProtectedClient";
import { apiPost } from "../../../lib/api";

export default function CreateProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", category: "", price: "", stockLevel: "" });
  const [loading, setLoading] = useState(false);

  function change(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        category: form.category,
        price: parseFloat(form.price) || 0,
        stockLevel: parseInt(form.stockLevel) || 0
      };
      await apiPost('/api/products', payload);
      alert('Product created successfully');
      router.push("/admin/products");
    } catch (err) {
      alert('Failed to create product: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedClient allowedRoles={["ROLE_ADMIN"]}>
      <div className="min-h-screen px-6 py-10 bg-slate-950 text-white">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Inventory</p>
            <h2 className="text-3xl font-semibold">Create Product</h2>
            <p className="text-sm text-slate-400">Add a new item to the catalog so users can discover and order it.</p>
          </div>

          <form
            onSubmit={submit}
            className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl space-y-4"
          >
            <input
              name="name"
              onChange={change}
              placeholder="Product Name"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              required
            />
            <input
              name="category"
              onChange={change}
              placeholder="Category"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
            <input
              name="price"
              onChange={change}
              placeholder="Price"
              type="number"
              step="0.01"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
            <input
              name="stockLevel"
              onChange={change}
              placeholder="Stock Quantity"
              type="number"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`rounded-2xl px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg shadow-indigo-500/30 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-orange-400 ${
                  loading ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'
                }`}
              >
                {loading ? 'Creating...' : 'Create Product'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-2xl border border-white/20 px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 hover:border-indigo-300/60"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedClient>
  );
}
