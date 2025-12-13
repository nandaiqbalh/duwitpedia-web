'use client';

import { useState } from 'react';
import { Activity, TrendingUp, DollarSign, PiggyBank, Target, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { formatCurrency } from './utils';
import { useFinancialHealthMetrics } from '@/lib/hooks/useReport';
import { MetricInfoDialog } from './financial-health/MetricInfoDialog';

export function FinancialHealth({ financialHealth, summary, loading = false }) {
  const { overallScore, healthMetrics, getHealthColor, getHealthLabel } = useFinancialHealthMetrics(financialHealth, summary);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleInfoClick = (metric) => {
    setSelectedMetric(metric);
    setIsDialogOpen(true);
  };

  const iconMap = {
    'Savings Rate': PiggyBank,
    'Expense-Income Ratio': Target,
    'Daily Average Spending': DollarSign,
    'Spending Stability': Activity,
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Health Score */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Financial Health Score
            </h3>
            <p className="text-sm text-gray-600">
              Based on your income, expenses, and spending patterns
            </p>
          </div>
          <div className={`px-4 py-2 rounded-lg ${getHealthColor(overallScore)}`}>
            <p className="text-2xl font-bold">{overallScore}</p>
          </div>
        </div>
        
        <div className="mb-2">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                overallScore >= 70 
                  ? 'bg-gradient-to-r from-green-400 to-green-600' 
                  : overallScore >= 40 
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' 
                  : 'bg-gradient-to-r from-red-400 to-red-600'
              }`}
              style={{ width: `${overallScore}%` }}
            />
          </div>
        </div>
        
        <p className="text-sm font-medium text-gray-700 text-center">
          {getHealthLabel(overallScore)}
        </p>
      </Card>

      {/* Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {healthMetrics.map((metric, index) => {
          const IconComponent = iconMap[metric.title];
          return (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <button
                      onClick={() => handleInfoClick(metric)}
                      className="cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors"
                      title="More information"
                    >
                      <Info className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                    </button>
                  </div>
                  <p className={`text-3xl font-bold ${metric.colorClass}`}>
                    {metric.isCurrency 
                      ? formatCurrency(metric.value) 
                      : `${metric.value}${metric.suffix || ''}`
                    }
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${metric.iconBg}`}>
                  <IconComponent className={`w-6 h-6 ${metric.iconColor}`} />
                </div>
              </div>
              <p className="text-sm text-gray-600">{metric.description}</p>
            </Card>
          );
        })}
      </div>

      {/* Metric Info Dialog */}
      <MetricInfoDialog 
        metric={selectedMetric} 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
      />

      {/* Net Cash Flow */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Net Cash Flow</h3>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">This period</p>
            <p className={`text-2xl sm:text-3xl font-bold ${
              financialHealth.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(financialHealth.netCashFlow)}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:flex sm:justify-end gap-4 sm:gap-6">
            <div className="text-left sm:text-right">
              <p className="text-sm text-gray-600 mb-1">Total Income</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(summary.totalIncome)}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(summary.totalExpense)}
              </p>
            </div>
          </div>
        </div>

        {financialHealth.netCashFlow > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-green-700">
              💧 <strong>Positive cash flow!</strong> You saved {formatCurrency(financialHealth.netCashFlow)} this period.
            </p>
          </div>
        )}

        {financialHealth.netCashFlow < 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-red-700">
              ⚠️ <strong>Negative cash flow.</strong> You spent {formatCurrency(Math.abs(financialHealth.netCashFlow))} more than you earned.
            </p>
          </div>
        )}
      </Card>

      {/* Recommendations */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Recommendations</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          {financialHealth.savingsRate < 20 && (
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Try to increase your savings rate to at least 20% of your income.</span>
            </li>
          )}
          {financialHealth.expenseIncomeRatio > 80 && (
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Your expenses are high relative to income. Consider reviewing discretionary spending.</span>
            </li>
          )}
          {financialHealth.spendingStability < 50 && (
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Your spending varies significantly. Creating a budget could help maintain consistency.</span>
            </li>
          )}
          {financialHealth.savingsRate >= 20 && financialHealth.expenseIncomeRatio <= 80 && (
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Great job! Your financial habits are healthy. Keep up the good work! 🎉</span>
            </li>
          )}
        </ul>
      </Card>
    </div>
  );
}
