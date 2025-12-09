"use client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useState, useEffect } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function FeatureImportanceChart() {
  const [featureData, setFeatureData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeatureImportance();
  }, []);

  const fetchFeatureImportance = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/feature-importance');
      
      if (!response.ok) {
        throw new Error('Failed to fetch feature importance');
      }
      
      const data = await response.json();
      setFeatureData(data);
    } catch (err) {
      console.error('Error fetching feature importance:', err);
      setError(err.message);
      // Fallback to hardcoded data if API fails
      setFeatureData({
        labels: ["current_stock", "qty_in", "price", "sku_id", "batch_id", "expiry_date", "manufacture_date", "month", "day", "day_of_week", "year", "location", "transaction_type"],
        values: [0.767, 0.230, 0.0005, 0.0004, 0.0005, 0.0004, 0.0004, 0.0002, 0.0002, 0.0001, 0.0001, 0.0001, 0.0001]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading feature importance...</div>
        </div>
      </div>
    );
  }

  if (error && !featureData) {
    return (
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-400">Error loading feature importance</div>
        </div>
      </div>
    );
  }

  const data = {
    labels: featureData.labels,
    datasets: [
      {
        label: "Feature Importance",
        data: featureData.values,
        backgroundColor: "rgba(99, 102, 241, 0.6)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "ML Feature Importance (RandomForest Model)",
        color: "#e5e7eb",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${(context.raw * 100).toFixed(2)}%`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#9ca3af", maxRotation: 45, minRotation: 45 },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#9ca3af" },
        grid: { color: "rgba(156, 163, 175, 0.2)" },
        title: {
          display: true,
          text: "Importance",
          color: "#9ca3af",
        },
      },
    },
  };

  return (
    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
      <Bar data={data} options={options} />
    </div>
  );
}
