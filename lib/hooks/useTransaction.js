'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '@/lib/services/transaction.service';
import { accountKeys } from './useAccount';
import { walletKeys } from './useWallet';
import { cachePresets } from '@/components/provider/query-provider';

// Query keys
export const transactionKeys = {
  all: ['transactions'],
  lists: () => [...transactionKeys.all, 'list'],
  list: (params) => [...transactionKeys.lists(), params],
  details: () => [...transactionKeys.all, 'detail'],
  detail: (id) => [...transactionKeys.details(), id],
};

// Hook for fetching transactions with pagination and filters
export function useTransactions(initialFilters = {}) {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    type: '',
    accountId: '',
    walletId: '',
    categoryId: '',
    startDate: '',
    endDate: '',
    ...initialFilters,
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: transactionKeys.list(filters),
    queryFn: () => transactionService.getTransactions(filters),
    ...cachePresets.transactional, // Transaksi berubah cepat
    select: (response) => ({
      transactions: response.data || [],
      pagination: response.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    }),
  });

  // Filter setters
  const setPage = (page) => setFilters((prev) => ({ ...prev, page }));
  const setSearch = (search) => setFilters((prev) => ({ ...prev, search, page: 1 }));
  const setType = (type) => setFilters((prev) => ({ ...prev, type, page: 1 }));
  const setAccountId = (accountId) => setFilters((prev) => ({ ...prev, accountId, page: 1 }));
  const setWalletId = (walletId) => setFilters((prev) => ({ ...prev, walletId, page: 1 }));
  const setCategoryId = (categoryId) => setFilters((prev) => ({ ...prev, categoryId, page: 1 }));
  const setDateRange = (startDate, endDate) => setFilters((prev) => ({ ...prev, startDate, endDate, page: 1 }));

  return {
    transactions: data?.transactions || [],
    pagination: data?.pagination || {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    loading: isLoading,
    error: error?.message || null,
    refetch,
    filters,
    setPage,
    setSearch,
    setType,
    setAccountId,
    setWalletId,
    setCategoryId,
    setDateRange,
  };
}

export function useTransaction(id) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: () => transactionService.getTransaction(id),
    enabled: !!id,
    select: (response) => response.data,
  });

  return {
    transaction: data || null,
    loading: isLoading,
    error: error?.message || null,
    refetch,
  };
}

// Hook for transaction mutations (create, update, delete)
export function useTransactionMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data) => transactionService.createTransaction(data),
    onSuccess: () => {
      // Invalidate transactions, accounts, and wallets since balances are updated
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      queryClient.invalidateQueries({ queryKey: walletKeys.lists() });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => transactionService.updateTransaction(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      queryClient.invalidateQueries({ queryKey: walletKeys.lists() });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => transactionService.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      queryClient.invalidateQueries({ queryKey: walletKeys.lists() });
    },
  });

  const createTransaction = async (data) => {
    try {
      const response = await createMutation.mutateAsync(data);
      if (response.status === 'success' || response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error || response.message };
      }
    } catch (err) {
      return { success: false, error: err.message || 'Failed to create transaction' };
    }
  };

  const updateTransaction = async (id, data) => {
    try {
      const response = await updateMutation.mutateAsync({ id, data });
      if (response.status === 'success' || response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error || response.message };
      }
    } catch (err) {
      return { success: false, error: err.message || 'Failed to update transaction' };
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const response = await deleteMutation.mutateAsync(id);
      if (response.status === 'success' || response.success) {
        return { success: true };
      } else {
        return { success: false, error: response.error || response.message };
      }
    } catch (err) {
      return { success: false, error: err.message || 'Failed to delete transaction' };
    }
  };

  return {
    createTransaction,
    updateTransaction,
    deleteTransaction,
    loading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    error: createMutation.error || updateMutation.error || deleteMutation.error,
  };
}

// These helper hooks are kept for backward compatibility
// They fetch data without pagination for dropdowns
// Hook for fetching accounts for dropdown
export function useAccounts() {
  const { data, isLoading } = useQuery({
    queryKey: ['accounts', 'dropdown'],
    queryFn: async () => {
      const response = await fetch('/api/accounts?limit=1000');
      const data = await response.json();
      return data;
    },
    select: (response) => response.data?.accounts || [],
  });

  return { 
    accounts: data || [], 
    loading: isLoading 
  };
}

// Hook for fetching wallets for dropdown
export function useWallets() {
  const { data, isLoading } = useQuery({
    queryKey: ['wallets', 'dropdown'],
    queryFn: async () => {
      const response = await fetch('/api/wallets?limit=1000');
      const data = await response.json();
      return data;
    },
    select: (response) => response.data?.wallets || [],
  });

  return { 
    wallets: data || [], 
    loading: isLoading 
  };
}

// Hook for fetching categories for dropdown
export function useCategoriesForDropdown(type = null) {
  const { data, isLoading } = useQuery({
    queryKey: ['categories', 'dropdown', type],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: '1000' });
      if (type) {
        params.append('type', type);
      }
      const response = await fetch(`/api/categories?${params}`);
      const data = await response.json();
      return data;
    },
    select: (response) => response.data?.categories || response.data || [],
  });

  return { 
    categories: data || [], 
    loading: isLoading 
  };
}
