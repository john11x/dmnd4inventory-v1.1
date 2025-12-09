"use client";
import React, { useState, useEffect } from "react";
import { apiPredict, apiGet } from "../lib/api";

function computeOptimalStock(predictedDemand, currentStock, price, leadTimeDays = 7) {
  const dailyDemand = predictedDemand / 30;
  const safetyStock = dailyDemand * leadTimeDays * 1.5;
  const reorderPoint = dailyDemand * leadTimeDays + safetyStock;
  
  // STOCK-ONLY LOGIC: Remove price sensitivity, base on demand patterns
  const stockBasedOrderQty = Math.round(
    Math.sqrt(2 * dailyDemand * 30 * 50) / 2  // Price removed, simplified for stock-heavy approach
  );
  
  return {
    reorderPoint: Math.ceil(reorderPoint),
    economicOrderQty: Math.max(1, stockBasedOrderQty),
    safetyStock: Math.ceil(safetyStock),
    status: currentStock <= reorderPoint ? "Reorder now" : "OK",
  };
}

function estimateDemandFromOrders(product, orders = []) {
  const recentOrders = orders.filter(
    (o) =>
      o.productId === product.id &&
      new Date(o.orderDate || Date.now()) >
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  const totalQuantity = recentOrders.reduce((sum, order) => sum + (order.quantity || 1), 0);
  const avgOrderSize = recentOrders.length > 0 ? totalQuantity / recentOrders.length : 1;
  const orderFrequency = recentOrders.length / 4;
  const estimatedMonthlyDemand = orderFrequency * avgOrderSize * 4;
  const baseDemand = Math.max(estimatedMonthlyDemand, product.stock * 0.1);
  return Math.round(baseDemand * (1 + Math.random() * 0.2));
}

export default function StockOptimizerPanel({ products = [] }) {
  const [optimizations, setOptimizations] = useState({});
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const runOptimizations = async (productsToUse) => {
      if (!productsToUse || productsToUse.length === 0) {
        setLoading(false);
        return;
      }

      let ordersData = [];
      try {
        ordersData = (await apiGet("/api/orders")) || [];
        setOrders(ordersData);
      } catch (err) {
        ordersData = [];
        console.warn("Could not fetch orders for fallback:", err);
      }

      const results = {};
      let fallbackCount = 0;

      for (const p of productsToUse) {
        try {
          const pred = await apiPredict(p.id, p.stock, p.price);
          const demand = pred.demand || pred.predictedDemand || 0;
          const opt = computeOptimalStock(demand, p.stock, p.price);
          results[p.id] = {
            product: p,
            prediction: demand,
            ...opt,
          };
        } catch (err) {
          const fallbackDemand = estimateDemandFromOrders(p, ordersData);
          const opt = computeOptimalStock(fallbackDemand, p.stock, p.price);
          results[p.id] = {
            product: p,
            prediction: fallbackDemand,
            ...opt,
            fallback: true,
            status: opt.status === "Reorder now" ? "Reorder (est.)" : "OK (est.)",
          };
          fallbackCount++;
          console.warn(`Prediction failed for ${p.id} - using fallback`, err);
        }
      }

      setUsingFallback(fallbackCount > 0);
      setOptimizations(results);
      setLoading(false);
    };

    if (products && products.length > 0) {
      runOptimizations(products);
    } else {
      setLoading(false);
    }
  }, [products]);

  const criticalStatuses = ["Reorder now", "Reorder (est.)"];
  
  // Stock level function matching the products page logic
  function getStockLevel(stock) {
    if (stock === 0) return { color: "red", status: "CRITICAL", threshold: 0 };
    if (stock <= 5) return { color: "red", status: "CRITICAL", threshold: 5 };
    if (stock <= 15) return { color: "yellow", status: "LOW", threshold: 15 };
    return { color: "green", status: "HEALTHY", threshold: null };
  }

  if (loading) {
    return (
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">Stock Optimizer</h3>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-white/5 rounded w-3/4"></div>
          <div className="h-4 bg-white/5 rounded w-1/2"></div>
          <div className="h-4 bg-white/5 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!Object.keys(optimizations).length) {
    return (
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center" />
          <h3 className="text-xl font-bold text-white">Stock Optimizer</h3>
        </div>
        <p className="text-gray-300">No products available for optimization.</p>
        <p className="text-xs text-gray-400 mt-2">Ensure products are passed into the component.</p>
      </div>
    );
  }

  const toReorder = Object.values(optimizations).filter((o) =>
    criticalStatuses.includes(o.status)
  );
  
  // Calculate stock status counts using the same logic as products page
  const stockStatusCounts = Object.values(optimizations).reduce((acc, opt) => {
    const stockLevel = getStockLevel(opt.product.stock);
    if (stockLevel.status === "CRITICAL") acc.critical++;
    else if (stockLevel.status === "LOW") acc.monitor++;
    else acc.healthy++;
    return acc;
  }, { critical: 0, monitor: 0, healthy: 0 });

  return (
    <div className="glass-panel p-6">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">Stock Optimizer</h2>
          <p className="text-xs text-gray-400">Real-time restock recommendations</p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 font-semibold">ML</span>
          {usingFallback && (
            <span className="text-xs px-2 py-1 rounded-full bg-orange-600/20 border border-orange-500/30 text-orange-300 font-semibold">Fallback</span>
          )}
        </div>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="frosted-card p-4 border border-red-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-red-300 font-bold">CRITICAL</p>
              <p className="text-3xl font-extrabold text-white">{stockStatusCounts.critical}</p>
              <p className="text-xs text-gray-400 mt-1">Need immediate restock</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-500/20 border border-red-500/30">
              <span className="text-red-300 font-extrabold">{stockStatusCounts.critical}</span>
            </div>
          </div>
        </div>

        <div className="frosted-card p-4 border border-yellow-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-yellow-300 font-bold">MONITOR</p>
              <p className="text-3xl font-extrabold text-white">{stockStatusCounts.monitor}</p>
              <p className="text-xs text-gray-400 mt-1">Low stock items</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-yellow-500/20 border border-yellow-500/30">
              <svg className="w-5 h-5 text-yellow-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" />
              </svg>
            </div>
          </div>
        </div>

        <div className="frosted-card p-4 border border-green-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-300 font-bold">HEALTHY</p>
              <p className="text-3xl font-extrabold text-white">{stockStatusCounts.healthy}</p>
              <p className="text-xs text-gray-400 mt-1">Sufficient stock</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-500/20 border border-green-500/30">
              <svg className="w-5 h-5 text-green-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2">
        {Object.values(optimizations).map((opt) => {
          const isCritical = criticalStatuses.includes(opt.status);
          const stockLevel = getStockLevel(opt.product.stock);

          return (
            <div
              key={opt.product.id}
              className={`frosted-card p-4 border transition-all duration-200 hover:scale-[1.01] ${
                stockLevel.color === "red" 
                  ? "border-red-500/30 bg-red-950/20" 
                  : stockLevel.color === "yellow"
                  ? "border-yellow-500/30 bg-yellow-950/20"
                  : "border-green-500/30 bg-green-950/20"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-extrabold text-white">{opt.product.name}</p>

                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                      stockLevel.color === "red" 
                        ? "bg-red-600/20 border border-red-500/30 text-red-300" 
                        : stockLevel.color === "yellow"
                        ? "bg-yellow-600/20 border border-yellow-500/30 text-yellow-300"
                        : "bg-green-600/20 border border-green-500/30 text-green-300"
                    }`}>
                      {stockLevel.status}
                    </span>

                    {opt.fallback && (
                      <span className="text-xs px-2 py-1 rounded-full bg-orange-600/20 border border-orange-500/30 text-orange-300 font-bold">
                        EST
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-6 mt-3 text-sm">
                    <div className="text-white/90">
                      <span className="text-gray-400 text-xs">Stock</span>
                      <div className="font-bold text-xl">{opt.product.stock}</div>
                    </div>

                    <div className="text-white/90">
                      <span className="text-gray-400 text-xs">Demand</span>
                      <div className="font-bold text-xl">{Math.round(opt.prediction)}/30d</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className={`text-sm px-3 py-1 rounded-full font-extrabold ${
                    isCritical 
                      ? "bg-red-600/20 border border-red-500/30 text-red-300" 
                      : "bg-green-600/20 border border-green-500/30 text-green-300"
                  }`}>
                    {isCritical ? "REORDER" : "OK"}
                  </div>
                </div>
              </div>

              {(isCritical || stockLevel.color === "yellow") && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-xs font-bold text-yellow-300 mb-3">
                    {isCritical ? "Restock Recommendations" : "Stock Monitoring"}
                  </p>

                  {isCritical && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="frosted-card p-3 border border-gray-700">
                        <p className="text-orange-300 font-bold">Reorder Point</p>
                        <p className="text-white font-extrabold">{opt.reorderPoint} units</p>
                      </div>

                      <div className="frosted-card p-3 border border-gray-700">
                        <p className="text-cyan-300 font-bold">Order Qty</p>
                        <p className="text-white font-extrabold">{opt.economicOrderQty} units</p>
                      </div>

                      <div className="frosted-card p-3 border border-gray-700">
                        <p className="text-green-300 font-bold">Safety Stock</p>
                        <p className="text-white font-extrabold">{opt.safetyStock} units</p>
                      </div>
                    </div>
                  )}

                  {stockLevel.color === "yellow" && !isCritical && (
                    <div className="text-xs text-yellow-300 bg-yellow-950/20 p-3 rounded-lg border border-yellow-500/20">
                      Stock level is low but within acceptable range. Monitor closely.
                    </div>
                  )}

                  {opt.fallback && (
                    <p className="mt-3 text-xs text-orange-300 bg-orange-950/20 p-3 rounded-lg border border-orange-500/20">
                      Based on order history estimation
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-400">
          Powered by demand forecasting (RandomForest) + EOQ heuristic
          {usingFallback && " • Using order history fallback for failed predictions"}
        </p>
      </div>
    </div>
  );
}
