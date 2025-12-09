"use client";
import { useState } from "react";

export default function ModelInfoPanel() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        ML Model Info
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">Model Type</span>
          <span className="text-indigo-300 font-mono">Random Forest</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Training Samples</span>
          <span className="text-indigo-300 font-mono">1,000,000</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Features</span>
          <span className="text-indigo-300 font-mono">12</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">R² Score</span>
          <span className="text-emerald-300 font-mono">0.822</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">RMSE</span>
          <span className="text-rose-300 font-mono">60.93</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">MAE</span>
          <span className="text-rose-300 font-mono">50.30</span>
        </div>
      </div>

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="mt-4 text-xs px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 hover:bg-indigo-500/30 transition"
      >
        {showDetails ? "Hide" : "Show"} Details
      </button>

      {showDetails && (
        <div className="mt-4 space-y-2 text-sm text-slate-400">
          <p>• Trained on 2 years of synthetic inventory transactions</p>
          <p>• Uses features: current_stock, price, timestamps, SKU, location</p>
          <p>• Handles missing values and categorical encoding</p>
          <p>• Model saved as demand_model.joblib</p>
          <p>
            • Notebook:{" "}
            <a
              href="/ml/Inventory_ML.ipynb"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 underline hover:text-indigo-300"
            >
              Inventory_ML.ipynb
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
