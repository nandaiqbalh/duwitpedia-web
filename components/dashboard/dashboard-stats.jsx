'use client';

import { Card } from '@/components/ui/card';
import { Wallet, TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function DashboardStats({ stats, formatCurrency }) {
  const statsCards = [
    {
      title: 'Total Balance',
      value: stats.totalBalance,
      icon: DollarSign,
      iconColor: 'text-blue-600',
      subtitle: `${stats.accountsCount} ${stats.accountsCount === 1 ? 'account' : 'accounts'}`,
    },
    {
      title: 'Income This Month',
      value: stats.currentIncome,
      icon: ArrowDownRight,
      iconColor: 'text-green-600',
      change: stats.incomeChange,
      changeType: 'income',
    },
    {
      title: 'Expenses This Month',
      value: stats.currentExpense,
      icon: ArrowUpRight,
      iconColor: 'text-red-600',
      change: stats.expenseChange,
      changeType: 'expense',
    },
    {
      title: 'Resources',
      value: stats.walletsCount,
      icon: Wallet,
      iconColor: 'text-purple-600',
      subtitle: `${stats.walletsCount} wallets • ${stats.categoriesCount} categories`,
      isCount: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statsCards.map((card, index) => (
        <Card key={index} className="p-5 hover:shadow-md transition-all border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-600">{card.title}</p>
            <card.icon className={`w-5 h-5 ${card.iconColor}`} />
          </div>
          
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {card.isCount ? card.value : formatCurrency(card.value)}
          </p>

          {/* Change indicator or subtitle */}
          {card.change !== null && card.change !== undefined ? (
            <div className={`flex items-center gap-1 text-xs ${
              card.changeType === 'expense' 
                ? (card.change > 0 ? 'text-red-600' : 'text-green-600')
                : (card.change > 0 ? 'text-green-600' : 'text-red-600')
            }`}>
              {card.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span className="font-medium">{Math.abs(card.change).toFixed(1)}%</span>
              <span className="text-gray-500">vs last month</span>
            </div>
          ) : card.subtitle ? (
            <p className="text-xs text-gray-500">{card.subtitle}</p>
          ) : null}
        </Card>
      ))}
    </div>
  );
}
