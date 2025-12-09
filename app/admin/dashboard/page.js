"use client";

import { useEffect, useState } from "react";
import StockOptimizerPanel from "../../components/StockOptimizerPanel";
import ModelInfoPanel from "../../components/ModelInfoPanel";
import FeatureImportanceChart from "../../components/charts/FeatureImportanceChart";
import PredictionDistributionChart from "../../components/charts/PredictionDistributionChart";
import SalesTrendChart from "../../components/charts/SalesTrendChart";
import { apiGet } from "../../lib/api";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch real products for optimizer
    apiGet('/api/products')
      .then(data => {
        console.log('Dashboard received products:', data);
        const mapped = (Array.isArray(data) ? data : []).map(p => ({
          id: p.productId ?? p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          stock: p.stockLevel ?? p.stock ?? 0,
          description: p.description,
          image: p.imageUrl || null
        }));
        console.log('Dashboard mapped products:', mapped);
        setProducts(mapped);
        setError(null);
      })
      .catch(err => {
        console.error('Failed to fetch products for optimizer:', err);
        setError(err.message || 'Failed to load products');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Stock Optimization Dashboard</h1>
        <p className="text-slate-400 mb-8">ML-driven demand forecasting and inventory optimization</p>

        {/* Core Deliverable: Stock Optimizer */}
        <div className="mb-10">
          {loading ? (
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-6 bg-slate-700 rounded w-1/3"></div>
                <div className="h-4 bg-slate-700 rounded w-2/3"></div>
                <div className="h-4 bg-slate-700 rounded w-1/2"></div>
              </div>
            </div>
          ) : error ? (
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Stock Optimizer</h3>
              <p className="text-red-400">Error loading products: {error}</p>
            </div>
          ) : (
            <StockOptimizerPanel products={products} />
          )}
        </div>

        {/* Supporting ML Evidence & Sales Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <SalesTrendChart />
            <PredictionDistributionChart />
            <FeatureImportanceChart />
          </div>
          <div className="lg:col-span-1">
            <ModelInfoPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
