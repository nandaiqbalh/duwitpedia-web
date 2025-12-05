"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Receipt, SearchX } from "lucide-react";
import Link from "next/link";
import { formatDateWIB } from "@/lib/utils";

export function RecentTransactions({ transactions = [], formatCurrency }) {
  const getTypeColor = (type) => {
    const normalizedType = type?.toLowerCase();
    switch (normalizedType) {
      case 'income':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'expense':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'transfer':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (transactions.length === 0) {
    return (
      <Card className="p-8 border-gray-200">
        <div className="flex flex-col items-center justify-center text-center">
          <SearchX className="w-12 h-12 text-gray-400 mb-3" />
          <h3 className="text-base font-semibold text-gray-900 mb-1">No transactions yet</h3>
          <p className="text-sm text-gray-600 mb-4">Start adding your first transaction</p>
          <Button asChild size="sm">
            <Link href="/transactions">Add Transaction</Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5 border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-gray-600" />
          <h3 className="text-base font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <Button variant="ghost" size="sm" asChild className="text-blue-600 hover:text-blue-700">
          <Link href="/transactions" className="flex items-center gap-1 text-sm">
            View all
            <ArrowRight className="w-3 h-3" />
          </Link>
        </Button>
      </div>

      <div className="space-y-2">
        {transactions.slice(0, 5).map((transaction, index) => {
          const normalizedType = transaction.type?.toLowerCase();
          const amountColor = normalizedType === 'income' 
            ? 'text-green-600' 
            : normalizedType === 'expense'
            ? 'text-red-600'
            : 'text-blue-600';

          return (
            <div 
              key={transaction.id}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <div className="flex-1 min-w-0 mr-4">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {transaction.category?.name || 'Uncategorized'}
                  </p>
                  <Badge 
                    variant="outline" 
                    className={`capitalize text-xs ${getTypeColor(transaction.type)}`}
                  >
                    {normalizedType}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{formatDateWIB(transaction.date)}</span>
                  <span>•</span>
                  <span className="truncate">
                    {normalizedType === 'transfer' && transaction.toWallet 
                      ? `${transaction.wallet?.name} → ${transaction.toWallet.name}`
                      : transaction.wallet?.name || 'N/A'
                    }
                  </span>
                </div>
              </div>
              <p className={`text-sm font-semibold ${amountColor} flex-shrink-0`}>
                {formatCurrency(parseFloat(transaction.amount))}
              </p>
            </div>
          );
        })}
      </div>
      
      {transactions.length > 5 && (
        <div className="mt-3 pt-3 border-t text-center text-xs text-gray-500">
          Showing 5 of {transactions.length} transactions
        </div>
      )}
    </Card>
  );
}
