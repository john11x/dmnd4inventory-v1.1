"use client";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend);

// Category sales distribution - should be replaced with real data from database
const categorySales = {
  labels: ["Operating Systems", "Electronics", "Accessories", "Other"],
  values: [65, 25, 8, 2],
};

export default function CategorySalesPieChart() {
  const data = {
    labels: categorySales.labels,
    datasets: [
      {
        label: "Sales Share (%)",
        data: categorySales.values,
        backgroundColor: [
          "rgba(99, 102, 241, 0.7)",
          "rgba(34, 197, 94, 0.7)",
          "rgba(251, 146, 60, 0.7)",
          "rgba(163, 230, 53, 0.7)",
          "rgba(249, 115, 22, 0.7)",
        ],
        borderColor: "rgba(30, 41, 59, 0.8)",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#e5e7eb", padding: 16 },
      },
      title: {
        display: true,
        text: "Sales by Category",
        color: "#e5e7eb",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}%`,
        },
      },
    },
  };

  return (
    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 h-full">
      <Pie data={data} options={options} />
    </div>
  );
}
