'use client';

import { Card } from '@/components/ui/card';
import { ArrowDownRight, Trophy, Medal, Award } from 'lucide-react';
import { formatDateWIB } from '@/lib/utils';
import { formatCurrency } from '../utils';
import { EmptyState } from '@/components/common';

export function BiggestIncomeItem({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <ArrowDownRight className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Top Income</h3>
        </div>
        <EmptyState
          icon={ArrowDownRight}
          title="No Income"
          description="No income transactions found for this period."
          className="py-8"
        />
      </Card>
    );
  }

  const getTransactionLabel = (transaction) => {
    if (transaction.isIncomingTransfer) {
      return transaction.note || `Transfer from ${transaction.wallet?.name || 'Unknown'}`;
    }
    if (transaction.type === 'transfer') {
      return transaction.note || `Transfer to ${transaction.toWallet?.name || 'Unknown'}`;
    }
    return transaction.note || transaction.category?.name || 'N/A';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <ArrowDownRight className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">Top Income</h3>
      </div>
      <div className="space-y-3">
        {transactions.map((transaction, index) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {index === 0 ? (
                  <Trophy className="w-4 h-4 text-yellow-600" />
                ) : index === 1 ? (
                  <Medal className="w-4 h-4 text-gray-600" />
                ) : index === 2 ? (
                  <Award className="w-4 h-4 text-amber-600" />
                ) : (
                  <span className="text-sm font-bold text-green-700 bg-green-200 px-2 py-1 rounded">
                    #{index + 1}
                  </span>
                )}
                <p className="font-medium text-gray-900">{getTransactionLabel(transaction)}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>{transaction.category?.name}</span>
                <span>•</span>
                <span>{formatDateWIB(transaction.date, "dd/MM/yyyy")}</span>
                {transaction.isIncomingTransfer && (
                  <>
                    <span>•</span>
                    <span className="text-blue-600 font-medium">Transfer In</span>
                  </>
                )}
              </div>
            </div>
            <div className="text-right ml-4">
              <p className="font-semibold text-green-600">
                {formatCurrency(parseFloat(transaction.amount))}
              </p>
              <p className="text-xs text-gray-600">
                {transaction.isIncomingTransfer
                  ? transaction.toWallet?.name
                  : transaction.wallet?.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}