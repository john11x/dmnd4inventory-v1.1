"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function PredictionDistributionChart() {
  // Monthly performance trends for area chart
  const performanceData = [
    { month: 'Jul', stockouts: 12, accuracy: 85, returns: 8, turnover: 6.2 },
    { month: 'Aug', stockouts: 10, accuracy: 82, returns: 6, turnover: 6.8 },
    { month: 'Sep', stockouts: 18, accuracy: 78, returns: 12, turnover: 5.9 },
    { month: 'Oct', stockouts: 8, accuracy: 88, returns: 5, turnover: 7.4 },
    { month: 'Nov', stockouts: 6, accuracy: 86, returns: 4, turnover: 7.8 },
    { month: 'Dec', stockouts: 4, accuracy: 90, returns: 3, turnover: 8.2 }
  ];

  const data = {
    labels: performanceData.map(item => item.month),
    datasets: [
      {
        label: 'Stockout Reduction',
        data: performanceData.map(item => 100 - (item.stockouts * 5)), // Convert to % (fewer stockouts = better)
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.3)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: 'Prediction Accuracy',
        data: performanceData.map(item => item.accuracy),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.3)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: 'Return Rate',
        data: performanceData.map(item => 100 - (item.returns * 8)), // Convert to % (fewer returns = better)
        borderColor: 'rgba(251, 146, 60, 1)',
        backgroundColor: 'rgba(251, 146, 60, 0.3)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#e5e7eb',
          font: { size: 13 },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: 'Performance Trends Analysis',
        color: '#e5e7eb',
        font: { size: 18, weight: 'bold' },
        padding: { bottom: 20 }
      },
      subtitle: {
        display: true,
        text: 'Monthly trends in warehouse efficiency, prediction accuracy, and order fulfillment',
        color: '#9ca3af',
        font: { size: 13 },
        padding: { top: 4 }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          afterLabel: function(context) {
            const index = context.dataIndex;
            const month = performanceData[index];
            return `Turnover Rate: ${month.turnover}x/month`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: { 
          color: '#9ca3af',
          font: { size: 12, weight: '500' }
        },
        grid: { 
          color: 'rgba(156, 163, 175, 0.15)',
          drawBorder: false
        },
        title: {
          display: true,
          text: 'Month',
          color: '#e5e7eb',
          font: { size: 13, weight: '500' }
        }
      },
      y: {
        ticks: { 
          color: '#9ca3af',
          font: { size: 11 }
        },
        grid: { 
          color: 'rgba(156, 163, 175, 0.15)',
          drawBorder: false
        },
        title: {
          display: true,
          text: 'Performance Score (%)',
          color: '#e5e7eb',
          font: { size: 13, weight: '500' }
        },
        min: 50,
        max: 100,
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    elements: {
      point: {
        hoverBorderWidth: 3,
        hoverBorderColor: '#fff'
      }
    }
  };

  return (
    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6" style={{ height: '460px' }}>
      <div style={{ height: '280px' }}>
        <Line data={data} options={options} />
      </div>
      
      {/* Performance Summary - Fixed spacing */}
      <div className="mt-6">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-green-400">
              {100 - (performanceData[performanceData.length - 1].stockouts * 5)}%
            </div>
            <div className="text-xs text-slate-400">Stockout Prevention</div>
            <div className="text-xs text-green-300 mt-1">{performanceData[performanceData.length - 1].stockouts} stockouts</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">
              {performanceData[performanceData.length - 1].accuracy}%
            </div>
            <div className="text-xs text-slate-400">Prediction Accuracy</div>
            <div className="text-xs text-blue-300 mt-1">{100 - performanceData[performanceData.length - 1].accuracy}% error rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-400">
              {100 - (performanceData[performanceData.length - 1].returns * 8)}%
            </div>
            <div className="text-xs text-slate-400">Return Prevention</div>
            <div className="text-xs text-orange-300 mt-1">{performanceData[performanceData.length - 1].returns} returns</div>
          </div>
        </div>
      </div>
    </div>
  );
}
