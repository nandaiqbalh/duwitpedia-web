'use client';

import { Card } from '@/components/ui/card';
import { TrendingDown, TrendingUp } from 'lucide-react';

export function DashboardInsights({ insights, formatCurrency }) {
  const { topExpenses = [], topIncomes = [] } = insights || {};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      {/* Top Expenses */}
      <Card className="p-5 border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="w-5 h-5 text-red-600" />
          <h3 className="text-base font-semibold text-gray-900">Top Expenses</h3>
        </div>

        {topExpenses.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            <p className="text-sm">No expense data</p>
          </div>
        ) : (
          <div className="space-y-2">
            {topExpenses.map((item, index) => {
              const categoryName = typeof item.category === 'string' 
                ? item.category 
                : item.category?.name || item.name || 'Uncategorized';
              
              return (
                <div 
                  key={`expense-${index}-${categoryName}`} 
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm text-gray-500 w-6">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{categoryName}</p>
                      <p className="text-xs text-gray-500">{item.count} transactions</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-red-600 ml-2">
                    {formatCurrency(item.total)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Top Incomes */}
      <Card className="p-5 border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h3 className="text-base font-semibold text-gray-900">Top Incomes</h3>
        </div>

        {topIncomes.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            <p className="text-sm">No income data</p>
          </div>
        ) : (
          <div className="space-y-2">
            {topIncomes.map((item, index) => {
              const categoryName = typeof item.category === 'string' 
                ? item.category 
                : item.category?.name || item.name || 'Uncategorized';
              
              return (
                <div 
                  key={`income-${index}-${categoryName}`} 
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm text-gray-500 w-6">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{categoryName}</p>
                      <p className="text-xs text-gray-500">{item.count} transactions</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-green-600 ml-2">
                    {formatCurrency(item.total)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
