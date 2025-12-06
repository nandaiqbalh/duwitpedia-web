'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/lib/services/dashboard.service';
import { cachePresets } from '@/components/provider/query-provider';

// Query keys
export const dashboardKeys = {
  all: ['dashboard'],
  data: () => [...dashboardKeys.all, 'data'],
};

// Hook for fetching dashboard data
export function useDashboard() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: dashboardKeys.data(),
    queryFn: () => dashboardService.getDashboardData(),
    ...cachePresets.dashboard, // Dashboard data perlu refresh setiap 5 menit
    select: (response) => ({
      stats: response.data?.stats || {
        totalBalance: 0,
        currentIncome: 0,
        currentExpense: 0,
        netIncome: 0,
        incomeChange: 0,
        expenseChange: 0,
        accountsCount: 0,
        walletsCount: 0,
        categoriesCount: 0,
        transactionsCount: 0,
      },
      insights: response.data?.insights || {
        topExpenses: [],
        topIncomes: [],
        totalExpenseCategories: 0,
        totalIncomeCategories: 0,
      },
      recentTransactions: response.data?.recentTransactions || [],
    }),
  });

  return {
    dashboardData: data || {
      stats: {
        totalBalance: 0,
        currentIncome: 0,
        currentExpense: 0,
        netIncome: 0,
        incomeChange: 0,
        expenseChange: 0,
        accountsCount: 0,
        walletsCount: 0,
        categoriesCount: 0,
        transactionsCount: 0,
      },
      insights: {
        topExpenses: [],
        topIncomes: [],
        totalExpenseCategories: 0,
        totalIncomeCategories: 0,
      },
      recentTransactions: [],
    },
    isLoading,
    error: error?.message || null,
    refetch,
    fetchDashboard: refetch,
  };
}