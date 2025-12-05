'use client';

import { Card } from '@/components/ui/card';
import { BiggestIncomeItem } from './BiggestIncomeItem';
import { BiggestExpenseItem } from './BiggestExpenseItem';

export function ReportTable({ transactions, biggestTransactions, loading = false }) {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Biggest Transactions */}
      {(biggestTransactions.income.length > 0 || biggestTransactions.expense.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Biggest Income */}
          {biggestTransactions.income.length > 0 && (
            <BiggestIncomeItem transactions={biggestTransactions.income} />
          )}

          {/* Biggest Expenses */}
          {biggestTransactions.expense.length > 0 && (
            <BiggestExpenseItem transactions={biggestTransactions.expense} />
          )}
        </div>
      )}
    </div>
  );
}
