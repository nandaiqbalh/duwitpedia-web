'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '@/lib/services/account.service';

// Query keys
export const accountKeys = {
  all: ['accounts'],
  lists: () => [...accountKeys.all, 'list'],
  list: (params) => [...accountKeys.lists(), params],
  details: () => [...accountKeys.all, 'detail'],
  detail: (id) => [...accountKeys.details(), id],
};

export function useAccounts(initialParams = {}) {
  const params = {
    page: 1,
    limit: 10,
    search: '',
    ...initialParams,
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: accountKeys.list(params),
    queryFn: () => accountService.getAccounts(params),
    select: (response) => ({
      accounts: response.data?.accounts || [],
      pagination: response.data?.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    }),
  });

  return {
    accounts: data?.accounts || [],
    pagination: data?.pagination || {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    loading: isLoading,
    error: error?.message || null,
    refetch,
  };
}

export function useAccount(id) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: accountKeys.detail(id),
    queryFn: () => accountService.getAccount(id),
    enabled: !!id,
    select: (response) => response.data,
  });

  return {
    account: data || null,
    loading: isLoading,
    error: error?.message || null,
    refetch,
  };
}

export function useAccountMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data) => accountService.createAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => accountService.updateAccount(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      queryClient.invalidateQueries({ queryKey: accountKeys.detail(variables.id) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => accountService.deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
    },
  });

  const createAccount = async (data) => {
    try {
      const response = await createMutation.mutateAsync(data);
      if (response.status === 'success') {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      return { success: false, error: 'Failed to create account' };
    }
  };

  const updateAccount = async (id, data) => {
    try {
      const response = await updateMutation.mutateAsync({ id, data });
      if (response.status === 'success') {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      return { success: false, error: 'Failed to update account' };
    }
  };

  const deleteAccount = async (id) => {
    try {
      const response = await deleteMutation.mutateAsync(id);
      if (response.status === 'success') {
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      return { success: false, error: 'Failed to delete account' };
    }
  };

  return {
    createAccount,
    updateAccount,
    deleteAccount,
    loading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    error: createMutation.error || updateMutation.error || deleteMutation.error,
  };
}
