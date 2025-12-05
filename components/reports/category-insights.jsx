'use client';

import { PieChart, TrendingUp, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { formatCurrency } from './utils';
import { EmptyState } from '@/components/common';
import { ExpenseCategoryItem } from './category-insights/ExpenseCategoryItem';
import { IncomeCategoryItem } from './category-insights/IncomeCategoryItem';
import { useCategoryInsights } from '@/lib/hooks/useReport';

export function CategoryInsights({ categoryData, summary, loading = false }) {
  const { expenseCategories, incomeCategories, topExpenseCategory } = useCategoryInsights(categoryData);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-2 bg-gray-100 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!categoryData || categoryData.length === 0) {
    return (
      <EmptyState
        icon={PieChart}
        title="No Category Data"
        description="No category spending data is available for the selected period."
          className="bg-white rounded-lg shadow"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Expense Categories */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">Expense Categories</h3>
        </div>

        {/* Top Insight */}
        {topExpenseCategory && (
          <div className="mb-6 p-4 rounded-lg bg-orange-50 border border-orange-200">
            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <p className="font-medium text-orange-900">
                  🔍 <strong>{topExpenseCategory.name}</strong> accounts for <strong>{topExpenseCategory.percentage}%</strong> of your total expenses.
                </p>
                <p className="text-sm text-orange-700 mt-1">
                  💸 Total spent: {formatCurrency(topExpenseCategory.total)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Category Breakdown */}
        <div className="space-y-4">
          {expenseCategories.map((category, index) => (
            <ExpenseCategoryItem key={category.name} category={category} index={index} />
          ))}
        </div>
      </Card>

      {/* Income Categories */}
      {incomeCategories.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Income Sources</h3>
          </div>

          <div className="space-y-4">
            {incomeCategories.map((category, index) => (
              <IncomeCategoryItem key={category.name} category={category} index={index} />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
