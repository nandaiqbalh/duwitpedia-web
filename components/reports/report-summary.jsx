'use client';

import { TrendingUp, TrendingDown, Minus, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { formatCurrency } from './utils';
import { useSummaryHelpers } from '@/lib/hooks/useReport';

export function ReportSummary({ summary, loading = false }) {
  const { getTrendIcon, getTrendColor } = useSummaryHelpers();
  
  const renderTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const summaryCards = [
    {
      title: 'Total Income',
      value: summary.totalIncome,
      icon: ArrowDownRight,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      comparison: summary.comparison.income,
      isExpense: false,
    },
    {
      title: 'Total Expenses',
      value: summary.totalExpense,
      icon: ArrowUpRight,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      comparison: summary.comparison.expense,
      isExpense: true,
    },
    {
      title: 'Net Balance',
      value: summary.netIncome,
      icon: DollarSign,
      iconBg: summary.netIncome >= 0 ? 'bg-blue-100' : 'bg-orange-100',
      iconColor: summary.netIncome >= 0 ? 'text-blue-600' : 'text-orange-600',
      comparison: summary.comparison.balance,
      isExpense: false,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-6">
      {/* Period Label */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Financial Summary</h2>
          <p className="text-sm text-gray-600 mt-1">{summary.period.label}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Transactions</p>
          <p className="text-lg font-semibold text-gray-900">{summary.transactionCount}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {summaryCards.map((card, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <p className={`text-2xl font-bold ${
                  card.value >= 0 ? 'text-gray-900' : 'text-red-600'
                }`}>
                  {formatCurrency(card.value)}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${card.iconBg}`}>
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>

            {/* Comparison with previous period */}
            {card.comparison && card.comparison.percentage !== 0 && (
              <div className={`flex items-center gap-2 text-sm ${getTrendColor(card.comparison.trend, card.isExpense)}`}>
                {renderTrendIcon(card.comparison.trend)}
                <span className="font-medium">
                  {Math.abs(card.comparison.percentage)}%
                </span>
                <span className="text-gray-500">vs last period</span>
              </div>
            )}

            {(!card.comparison || card.comparison.percentage === 0) && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Minus className="w-4 h-4" />
                <span>No change</span>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Insights Banner */}
      {summary.comparison.expense.trend === 'up' && summary.comparison.expense.percentage > 10 && (
        <Card className="p-4 bg-orange-50 border-orange-200">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <p className="font-medium text-orange-900">
                📊 Your spending increased by {summary.comparison.expense.percentage}% compared to last period.
              </p>
              <p className="text-sm text-orange-700 mt-1">
                Consider reviewing your expense categories to identify areas for optimization. 💡
              </p>
            </div>
          </div>
        </Card>
      )}

      {summary.comparison.balance.trend === 'up' && summary.comparison.balance.percentage > 0 && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">
                🎉 Great job! Your net balance improved by {summary.comparison.balance.percentage}% from last period.
              </p>
              <p className="text-sm text-green-700 mt-1">
                Keep up the excellent financial management! 💰
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
