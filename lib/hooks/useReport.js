'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportService } from '@/lib/services/report.service';
import { cachePresets } from '@/components/provider/query-provider';

// Query keys
export const reportKeys = {
  all: ['reports'],
  lists: () => [...reportKeys.all, 'list'],
  list: (filters) => [...reportKeys.lists(), filters],
};

// Hook for fetching financial reports
export function useReports(initialFilters = {}) {
  const [filters, setFilters] = useState({
    period: 'monthly', // monthly, weekly, custom
    month: '', // YYYY-MM format for custom period
    startDate: '',
    endDate: '',
    year: new Date().getFullYear(),
    accountId: '',
    walletId: '',
    categoryId: '',
    ...initialFilters,
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: reportKeys.list(filters),
    queryFn: () => reportService.getReports(filters),
    ...cachePresets.dashboard, // Report data seperti dashboard
    select: (response) => ({
      transactions: response.data?.transactions || [],
      summary: response.data?.summary || {
        totalIncome: 0,
        totalExpense: 0,
        totalTransfer: 0,
        netIncome: 0,
        transactionCount: 0,
        period: {
          startDate: '',
          endDate: '',
          label: '',
        },
        comparison: {
          income: { value: 0, percentage: 0, trend: 'neutral' },
          expense: { value: 0, percentage: 0, trend: 'neutral' },
          balance: { value: 0, percentage: 0, trend: 'neutral' },
        },
      },
      charts: response.data?.charts || {
        categoryData: [],
        dailyData: [],
        walletData: [],
      },
      biggestTransactions: response.data?.biggestTransactions || {
        income: [],
        expense: [],
      },
      financialHealth: response.data?.financialHealth || {
        savingsRate: 0,
        expenseIncomeRatio: 0,
        dailyAverageSpending: 0,
        netCashFlow: 0,
        spendingStability: 0,
      },
    }),
  });

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return {
    reportData: data || {
      transactions: [],
      summary: {
        totalIncome: 0,
        totalExpense: 0,
        totalTransfer: 0,
        netIncome: 0,
        transactionCount: 0,
        period: {
          startDate: '',
          endDate: '',
          label: '',
        },
        comparison: {
          income: { value: 0, percentage: 0, trend: 'neutral' },
          expense: { value: 0, percentage: 0, trend: 'neutral' },
          balance: { value: 0, percentage: 0, trend: 'neutral' },
        },
      },
      charts: {
        categoryData: [],
        dailyData: [],
        walletData: [],
      },
      biggestTransactions: {
        income: [],
        expense: [],
      },
      financialHealth: {
        savingsRate: 0,
        expenseIncomeRatio: 0,
        dailyAverageSpending: 0,
        netCashFlow: 0,
        spendingStability: 0,
      },
    },
    loading: isLoading,
    error: error?.message || null,
    filters,
    updateFilters,
    refetch,
  };
}

// Hook for report filters dropdown data
// Uses React Query to fetch filter data
export function useReportFilters() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['reports', 'filters'],
    queryFn: async () => {
      const [accountsRes, walletsRes, categoriesRes] = await Promise.all([
        fetch('/api/accounts'),
        fetch('/api/wallets'),
        fetch('/api/categories'),
      ]);

      const [accountsData, walletsData, categoriesData] = await Promise.all([
        accountsRes.json(),
        walletsRes.json(),
        categoriesRes.json(),
      ]);

      return {
        accounts: accountsData.success ? accountsData.data : [],
        wallets: walletsData.success ? walletsData.data : [],
        categories: categoriesData.success ? categoriesData.data : [],
      };
    },
  });

  return {
    accounts: data?.accounts || [],
    wallets: data?.wallets || [],
    categories: data?.categories || [],
    loading: isLoading,
    refetch,
  };
}

// Hook for processing category data with calculations
export function useCategoryInsights(categoryData) {
  const processedData = useMemo(() => {
    if (!categoryData || categoryData.length === 0) {
      return {
        expenseCategories: [],
        incomeCategories: [],
        topExpenseCategory: null,
        topIncomeCategory: null,
      };
    }

    const expenseCategories = categoryData
      .filter(c => c.type === 'expense')
      .sort((a, b) => b.total - a.total);
    
    const incomeCategories = categoryData
      .filter(c => c.type === 'income')
      .sort((a, b) => b.total - a.total);

    return {
      expenseCategories,
      incomeCategories,
      topExpenseCategory: expenseCategories[0] || null,
      topIncomeCategory: incomeCategories[0] || null,
    };
  }, [categoryData]);

  return processedData;
}

// Hook for processing chart data with top items
export function useChartInsights(charts) {
  const processedData = useMemo(() => {
    if (!charts) {
      return {
        topCategories: [],
        topWallets: [],
      };
    }

    const topCategories = (charts.categoryData || [])
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 3);
    
    const topWallets = (charts.walletData || [])
      .slice(0, 3);

    return {
      topCategories,
      topWallets,
    };
  }, [charts]);

  return processedData;
}

// Hook for processing financial health data with calculations
export function useFinancialHealthMetrics(financialHealth, summary) {
  const metrics = useMemo(() => {
    const getHealthColor = (value) => {
      if (value >= 70) return 'text-green-600 bg-green-100';
      if (value >= 40) return 'text-yellow-600 bg-yellow-100';
      return 'text-red-600 bg-red-100';
    };

    const getHealthLabel = (value) => {
      if (value >= 70) return 'Excellent';
      if (value >= 40) return 'Good';
      return 'Needs Attention';
    };

    const getSavingsRateColor = (rate) => {
      if (rate >= 30) return 'text-green-600';
      if (rate >= 20) return 'text-blue-600';
      if (rate >= 10) return 'text-yellow-600';
      return 'text-red-600';
    };

    const getSavingsRateLabel = (rate) => {
      if (rate >= 30) return 'Excellent! 🎉';
      if (rate >= 20) return 'Great! 👍';
      if (rate >= 10) return 'Good 👌';
      if (rate > 0) return 'Keep it up 💪';
      return 'Consider saving 🤔';
    };

    // Overall financial health score (weighted average)
    const overallScore = Math.round(
      (financialHealth.savingsRate * 0.4) +
      ((100 - Math.min(financialHealth.expenseIncomeRatio, 100)) * 0.3) +
      (financialHealth.spendingStability * 0.3)
    );

    const healthMetrics = [
      {
        title: 'Savings Rate',
        value: financialHealth.savingsRate,
        suffix: '%',
        description: getSavingsRateLabel(financialHealth.savingsRate),
        colorClass: getSavingsRateColor(financialHealth.savingsRate),
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
      },
      {
        title: 'Expense-Income Ratio',
        value: financialHealth.expenseIncomeRatio,
        suffix: '%',
        description: financialHealth.expenseIncomeRatio > 100 
          ? 'Spending more than earning ⚠️' 
          : financialHealth.expenseIncomeRatio > 80 
          ? 'Close to limit 👀' 
          : 'Healthy ratio ✅',
        colorClass: financialHealth.expenseIncomeRatio > 100 
          ? 'text-red-600' 
          : financialHealth.expenseIncomeRatio > 80 
          ? 'text-yellow-600' 
          : 'text-green-600',
        iconBg: financialHealth.expenseIncomeRatio > 100 ? 'bg-red-100' : 'bg-green-100',
        iconColor: financialHealth.expenseIncomeRatio > 100 ? 'text-red-600' : 'text-green-600',
      },
      {
        title: 'Daily Average Spending',
        value: financialHealth.dailyAverageSpending,
        isCurrency: true,
        description: 'Average per day this period 📅',
        colorClass: 'text-gray-900',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
      },
      {
        title: 'Spending Stability',
        value: Math.round(financialHealth.spendingStability),
        suffix: '%',
        description: financialHealth.spendingStability >= 70 
          ? 'Very consistent ✨' 
          : financialHealth.spendingStability >= 40 
          ? 'Moderately stable 📊' 
          : 'Highly variable 📈',
        colorClass: financialHealth.spendingStability >= 70 
          ? 'text-green-600' 
          : financialHealth.spendingStability >= 40 
          ? 'text-blue-600' 
          : 'text-orange-600',
        iconBg: 'bg-indigo-100',
        iconColor: 'text-indigo-600',
      },
    ];

    return {
      overallScore,
      healthMetrics,
      getHealthColor,
      getHealthLabel,
    };
  }, [financialHealth]);

  return metrics;
}

// Hook for processing wallet report data with calculations
export function useWalletInsights(walletData) {
  const insights = useMemo(() => {
    if (!walletData || walletData.length === 0) {
      return {
        mostActiveWallet: null,
        largestOutflowWallet: null,
        largestInflowWallet: null,
      };
    }

    // Find most active wallet
    const mostActiveWallet = walletData.reduce((max, wallet) => 
      wallet.transactionCount > (max?.transactionCount || 0) ? wallet : max
    , null);

    // Find wallet with largest outflow
    const largestOutflowWallet = walletData.reduce((max, wallet) => 
      wallet.outflow > (max?.outflow || 0) ? wallet : max
    , null);

    // Find wallet with largest inflow
    const largestInflowWallet = walletData.reduce((max, wallet) => 
      wallet.inflow > (max?.inflow || 0) ? wallet : max
    , null);

    return {
      mostActiveWallet,
      largestOutflowWallet,
      largestInflowWallet,
    };
  }, [walletData]);

  return insights;
}

// Hook for processing summary data with helper functions
export function useSummaryHelpers() {
  const getTrendIcon = (trend) => {
    return trend; // Return the trend string, component will handle icon rendering
  };

  const getTrendColor = (trend, isExpense = false) => {
    if (trend === 'neutral') return 'text-gray-600';
    
    // For expenses, down is good (green), up is bad (red)
    if (isExpense) {
      return trend === 'up' ? 'text-red-600' : 'text-green-600';
    }
    
    // For income and balance, up is good (green), down is bad (red)
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  return {
    getTrendIcon,
    getTrendColor,
  };
}