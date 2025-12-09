"use client";

import { useEffect, useState } from "react";
import { apiGet } from "../../lib/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterProduct, setFilterProduct] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterUser, setFilterUser] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    apiGet('/api/orders')
      .then((data) => {
        if (!mounted) return;
        // map backend OrderEntity -> UI shape
        const mapped = (Array.isArray(data) ? data : []).map(o => ({
          id: o.orderId ?? o.id,
          user: "Customer", // Hide actual user for data protection
          product: o.productName ?? (o.product?.name ?? (o.product || 'Unknown')),
          quantity: o.quantity ?? o.qty ?? 0,
          timestamp: o.timestamp ?? o.createdAt ?? '',
          status: o.status ?? 'Pending'
        }));
        setOrders(mapped);
      })
      .catch((err) => {
        console.error('Failed to load orders', err);
        if (!mounted) return;
        setError(err.message || String(err));
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const filteredOrders = orders.filter(order =>
    (filterProduct === "" || (order.product || '').toLowerCase().includes(filterProduct.toLowerCase())) &&
    (filterStatus === "" || order.status === filterStatus) &&
    (filterUser === "" || (order.user || '').toLowerCase().includes(filterUser.toLowerCase()))
  );

  const statuses = [...new Set(orders.map(o => o.status))];
  const products = [...new Set(orders.map(o => o.product))];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Operations</p>
          <h1 className="text-3xl font-semibold text-white">Order Monitoring</h1>
          <p className="text-sm text-slate-400">Live fulfillment feed</p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/5 bg-white/5 p-6 shadow-2xl">
        <div className="grid gap-4 md:grid-cols-3">
          <input
            type="text"
            placeholder="Filter by user..."
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
          <select
            value={filterProduct}
            onChange={(e) => setFilterProduct(e.target.value)}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            <option value="">All Products</option>
            {products.map((p) => (
              <option key={p} value={p} className="text-slate-900">
                {p}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            <option value="">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s} className="text-slate-900">
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/5 bg-white/5 shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-slate-300">Loading orders...</div>
        ) : error ? (
          <div className="p-12 text-center text-rose-300">Error loading orders: {error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-100">
              <thead className="bg-white/5 text-xs uppercase tracking-[0.3em] text-slate-400">
                <tr>
                  <th className="px-6 py-4 text-left">Order ID</th>
                  <th className="px-6 py-4 text-left">User</th>
                  <th className="px-6 py-4 text-left">Product</th>
                  <th className="px-6 py-4 text-left">Quantity</th>
                  <th className="px-6 py-4 text-left">Timestamp</th>
                  <th className="px-6 py-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-6 py-4 font-semibold text-white">{order.id}</td>
                    <td className="px-6 py-4 text-slate-300">{order.user}</td>
                    <td className="px-6 py-4 text-slate-300">{order.product}</td>
                    <td className="px-6 py-4">{order.quantity}</td>
                    <td className="px-6 py-4 text-xs uppercase tracking-[0.3em] text-slate-400">
                      {order.timestamp}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          order.status === "Delivered"
                            ? "bg-emerald-500/20 text-emerald-100"
                            : order.status === "Shipped"
                            ? "bg-sky-500/20 text-sky-100"
                            : "bg-amber-400/20 text-amber-100"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
