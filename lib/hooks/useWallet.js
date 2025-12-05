'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { walletService } from '@/lib/services/wallet.service';

const API_BASE = '/api/wallets';

// Query keys
export const walletKeys = {
  all: ['wallets'],
  lists: () => [...walletKeys.all, 'list'],
  list: (params) => [...walletKeys.lists(), params],
  details: () => [...walletKeys.all, 'detail'],
  detail: (id) => [...walletKeys.details(), id],
};

export function useWallets(search = '', accountId = '') {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const params = {
    page,
    limit,
    search: search || '',
    accountId: accountId || '',
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: walletKeys.list(params),
    queryFn: () => walletService.getWallets(params),
    select: (response) => ({
      wallets: response.data?.wallets || [],
      pagination: response.data?.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    }),
  });

  const setSearch = (newSearch) => {
    setPage(1); // Reset to first page when searching
  };

  const setAccountFilter = (newAccountId) => {
    setPage(1); // Reset to first page when filtering
  };

  return {
    wallets: data?.wallets || [],
    pagination: data?.pagination || {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    loading: isLoading,
    error: error?.message || null,
    refetch,
    setPage,
    setSearch,
    setAccountFilter,
  };
}

export function useWalletMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data) => walletService.createWallet(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: walletKeys.lists() });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => walletService.updateWallet(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: walletKeys.lists() });
      queryClient.invalidateQueries({ queryKey: walletKeys.detail(variables.id) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => walletService.deleteWallet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: walletKeys.lists() });
    },
  });

  const createWallet = async (data) => {
    try {
      const response = await createMutation.mutateAsync(data);
      if (response.status === 'success') {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      return { success: false, error: err.message || 'Failed to create wallet' };
    }
  };

  const updateWallet = async (id, data) => {
    try {
      const response = await updateMutation.mutateAsync({ id, data });
      if (response.status === 'success') {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      return { success: false, error: err.message || 'Failed to update wallet' };
    }
  };

  const deleteWallet = async (id) => {
    try {
      const response = await deleteMutation.mutateAsync(id);
      if (response.status === 'success') {
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      return { success: false, error: err.message || 'Failed to delete wallet' };
    }
  };

  return {
    createWallet,
    updateWallet,
    deleteWallet,
    loading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    error: createMutation.error || updateMutation.error || deleteMutation.error,
  };
}
