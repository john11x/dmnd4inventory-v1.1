"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageLoading } from "../../components/LoadingSpinner";
import LoadingSpinner from "../../components/LoadingSpinner";
import { apiDelete, apiGet, apiPredictBatch } from "../../lib/api";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [predictions, setPredictions] = useState({});
  const [loadingPredictions, setLoadingPredictions] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet("/api/products");
      console.log('Raw API response:', data);
      const mapped = (Array.isArray(data) ? data : []).map((p) => ({
        id: p.productId ?? p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        stock: p.stockLevel ?? p.stock ?? 0
      }));
      console.log('Mapped products:', mapped);
      setProducts(mapped);
      
      // Load demand predictions
      if (mapped.length > 0) {
        await loadDemandPredictions(mapped);
      }
    } catch (err) {
      console.error("Failed to load products", err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const loadDemandPredictions = async (productsList) => {
    setLoadingPredictions(true);
    try {
      const predictionsData = await apiPredictBatch(productsList);
      const predictionsMap = {};
      predictionsData.forEach(pred => {
        const demand = pred.demand || pred.predictedDemand || 0;
        predictionsMap[pred.productId] = { ...pred, demand };
      });
      setPredictions(predictionsMap);
    } catch (err) {
      console.error("Failed to load demand predictions", err);
    } finally {
      setLoadingPredictions(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];
  const filteredProducts = products.filter(
    (p) =>
      (searchTerm === "" || p.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === "" || p.category === selectedCategory)
  );

  const handleDelete = async (id) => {
    if (confirm("Delete this product?")) {
      try {
        await apiDelete(`/api/products/${id}`);
        setProducts((prev) => prev.filter((p) => p.id !== id));
        alert("Product deleted successfully");
      } catch (err) {
        alert("Failed to delete product: " + (err.message || err));
      }
    }
  };

  const handleRefreshPredictions = async () => {
    if (products.length > 0) {
      await loadDemandPredictions(products);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Inventory</p>
          <h1 className="text-3xl font-semibold text-white">Products</h1>
          <p className="text-sm text-slate-400">Manage catalog, pricing, stock and demand forecasting</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRefreshPredictions}
            disabled={loadingPredictions}
            className="rounded-2xl border border-white/20 bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white shadow-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingPredictions ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner size="sm" text="" />
                Refreshing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Demand
              </span>
            )}
          </button>
          <button
            onClick={() => router.push("/admin/products/create")}
            className="rounded-2xl bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-orange-400 px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white shadow-lg shadow-indigo-500/30"
          >
            + Create product
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-white/5 bg-white/5 p-6 shadow-2xl">
        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="text-slate-900">
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-hidden rounded-3xl border border-white/5 bg-white/5 shadow-2xl">
        {loading ? (
          <div className="p-12">
            <LoadingSpinner size="lg" text="Loading products..." />
          </div>
        ) : error ? (
          <div className="p-12 text-center text-rose-300">Error: {error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-300">No products found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-100">
              <thead className="bg-white/5 text-xs uppercase tracking-[0.3em] text-slate-400">
                <tr>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Category</th>
                  <th className="px-6 py-4 text-left">Price</th>
                  <th className="px-6 py-4 text-left">Stock</th>
                  <th className="px-6 py-4 text-left">Demand Forecast</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-6 py-4 font-semibold text-white">{product.name}</td>
                    <td className="px-6 py-4 text-slate-300">{product.category}</td>
                    <td className="px-6 py-4 text-indigo-200">${product.price}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          product.stock <= 5
                            ? "bg-rose-500/20 text-rose-100"
                            : product.stock <= 20
                            ? "bg-amber-400/20 text-amber-100"
                            : "bg-emerald-500/20 text-emerald-100"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {loadingPredictions ? (
                        <div className="text-xs text-slate-400">Loading...</div>
                      ) : predictions[product.id]?.error ? (
                        <div className="text-xs text-rose-300">N/A</div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-cyan-300">
                            {Math.round(predictions[product.id]?.demand || 0)}
                          </span>
                          <span className="text-xs text-slate-400">units</span>
                          {product.stock > 0 && predictions[product.id]?.demand > 0 && (
                            <div className="w-16 h-1 bg-slate-600 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-300 ${
                                  predictions[product.id].demand > product.stock 
                                    ? 'bg-rose-400' 
                                    : predictions[product.id].demand > product.stock * 0.7
                                    ? 'bg-amber-400'
                                    : 'bg-emerald-400'
                                }`}
                                style={{ 
                                  width: `${Math.min((predictions[product.id].demand / Math.max(product.stock, predictions[product.id].demand)) * 100, 100)}%` 
                                }}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            console.log('Edit clicked for product:', product);
                            console.log('Product ID:', product.id);
                            if (!product.id) {
                              alert('Product has no ID - cannot edit');
                              return;
                            }
                            router.push(`/admin/products/${product.id}/edit`);
                          }}
                          className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white hover:border-indigo-300/60"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="rounded-full bg-rose-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-rose-100 hover:bg-rose-500/30"
                        >
                          Delete
                        </button>
                      </div>
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
