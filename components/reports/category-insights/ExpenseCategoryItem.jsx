'use client';

import { formatCurrency } from '../utils';

export function ExpenseCategoryItem({ category, index }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">
            {category.name}
          </span>
          <span className="text-xs text-gray-500">
            ({category.count} transactions)
          </span>
        </div>
        <div className="text-right">
          <span className="text-sm font-semibold text-gray-900">
            {category.percentage}%
          </span>
          <span className="text-xs text-gray-600 ml-2">
            {formatCurrency(category.total)}
          </span>
        </div>
      </div>
      <div className="relative">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all"
            style={{ width: `${category.percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}