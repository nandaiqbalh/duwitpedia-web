'use client';

import { useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Card } from '@/components/ui/card';
import { BarChart3, PieChart, TrendingUp, Wallet } from 'lucide-react';
import { formatCurrency } from './utils';
import { EmptyState } from '@/components/common';
import { useChartInsights } from '@/lib/hooks/useReport';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function ReportCharts({ charts, loading = false }) {
  const { topCategories, topWallets } = useChartInsights(charts);

  // Income vs Expense Chart Data
  const incomeExpenseData = {
    labels: charts.dailyData.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Income',
        data: charts.dailyData.map(d => d.income),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
      },
      {
        label: 'Expense',
        data: charts.dailyData.map(d => d.expense),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 2,
      },
    ],
  };

  const incomeExpenseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'Rp ' + (value / 1000) + 'K';
          }
        }
      }
    }
  };

  // Category Breakdown Chart Data
  const categoryData = {
    labels: charts.categoryData.map(c => c.name),
    datasets: [{
      data: charts.categoryData.map(c => c.total),
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',   // Red
        'rgba(59, 130, 246, 0.8)',  // Blue
        'rgba(251, 191, 36, 0.8)',  // Yellow
        'rgba(34, 197, 94, 0.8)',   // Green
        'rgba(168, 85, 247, 0.8)',  // Purple
        'rgba(249, 115, 22, 0.8)',  // Orange
        'rgba(236, 72, 153, 0.8)',  // Pink
        'rgba(14, 165, 233, 0.8)',  // Cyan
      ],
      borderColor: [
        'rgba(239, 68, 68, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(251, 191, 36, 1)',
        'rgba(34, 197, 94, 1)',
        'rgba(168, 85, 247, 1)',
        'rgba(249, 115, 22, 1)',
        'rgba(236, 72, 153, 1)',
        'rgba(14, 165, 233, 1)',
      ],
      borderWidth: 2,
    }],
  };

  const categoryOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const category = charts.categoryData[context.dataIndex];
            return category.name + ': ' + formatCurrency(category.total) + ' (' + category.percentage + '%)';
          }
        }
      }
    }
  };

  // Trend Line Chart Data
  const trendData = {
    labels: charts.dailyData.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Net Balance',
        data: charts.dailyData.map(d => d.net),
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return 'Net: ' + formatCurrency(context.parsed.y);
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value) {
            return 'Rp ' + (value / 1000) + 'K';
          }
        }
      }
    }
  };

  // Wallet Distribution Chart Data
  const walletData = {
    labels: charts.walletData.map(w => w.name),
    datasets: [{
      data: charts.walletData.map(w => w.transactionCount),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(249, 115, 22, 0.8)',
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(34, 197, 94, 1)',
        'rgba(251, 191, 36, 1)',
        'rgba(168, 85, 247, 1)',
        'rgba(249, 115, 22, 1)',
      ],
      borderWidth: 2,
    }],
  };

  const walletOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const wallet = charts.walletData[context.dataIndex];
            return wallet.name + ': ' + wallet.transactionCount + ' transactions';
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-100 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (!charts.dailyData.length && !charts.categoryData.length) {
    return (
      <EmptyState
        icon={BarChart3}
        title="No Data Available"
        description="There are no transactions to display in the charts. Add some transactions to see your financial insights."
        className="bg-white rounded-lg shadow"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Income vs Expense Bar Chart */}
      {charts.dailyData.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Income vs Expense</h3>
          </div>
          <div className="h-80">
            <Bar data={incomeExpenseData} options={incomeExpenseOptions} />
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Doughnut Chart */}
        {charts.categoryData.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Category Breakdown</h3>
            </div>
            <div className="h-80">
              <Doughnut data={categoryData} options={categoryOptions} />
            </div>
            
            {/* Category Insights */}
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium text-gray-700 mb-2">Top Categories:</p>
              <div className="space-y-2">
                {topCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} {category.name}
                    </span>
                    <span className="font-medium text-gray-900">
                      {category.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Wallet Distribution Chart */}
        {charts.walletData.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Wallet Activity</h3>
            </div>
            <div className="h-80">
              <Doughnut data={walletData} options={walletOptions} />
            </div>
            
            {/* Wallet Insights */}
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium text-gray-700 mb-2">Most Active Wallets:</p>
              <div className="space-y-2">
                {topWallets.map((wallet, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {wallet.name}
                    </span>
                    <span className="font-medium text-gray-900">
                      {wallet.transactionCount} transactions
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Trend Line Chart */}
      {charts.dailyData.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Net Balance Trend</h3>
          </div>
          <div className="h-80">
            <Line data={trendData} options={trendOptions} />
          </div>
        </Card>
      )}
    </div>
  );
}
