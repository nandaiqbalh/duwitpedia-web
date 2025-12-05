'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/lib/services/category.service';

// Query keys
export const categoryKeys = {
  all: ['categories'],
  lists: () => [...categoryKeys.all, 'list'],
  list: (params) => [...categoryKeys.lists(), params],
  details: () => [...categoryKeys.all, 'detail'],
  detail: (id) => [...categoryKeys.details(), id],
};

export function useCategories(params = {}) {
  const queryParams = {
    page: 1,
    limit: 10,
    search: '',
    type: '',
    ...params,
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: categoryKeys.list(queryParams),
    queryFn: () => categoryService.getCategories(queryParams),
    select: (response) => ({
      categories: response.data?.categories || [],
      pagination: response.data?.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    }),
  });

  return {
    categories: data?.categories || [],
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

export function useCategory(id) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryService.getCategory(id),
    enabled: !!id,
    select: (response) => response.data,
  });

  return {
    category: data || null,
    loading: isLoading,
    error: error?.message || null,
    refetch,
  };
}

export function useCategoryMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data) => categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => categoryService.updateCategory(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.id) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });

  const createCategory = async (data) => {
    try {
      const response = await createMutation.mutateAsync(data);
      if (response.status === 'success') {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      return { success: false, error: err.message || 'Failed to create category' };
    }
  };

  const updateCategory = async (id, data) => {
    try {
      const response = await updateMutation.mutateAsync({ id, data });
      if (response.status === 'success') {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      return { success: false, error: err.message || 'Failed to update category' };
    }
  };

  const deleteCategory = async (id) => {
    try {
      const response = await deleteMutation.mutateAsync(id);
      if (response.status === 'success') {
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      return { success: false, error: err.message || 'Failed to delete category' };
    }
  };

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    loading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    error: createMutation.error || updateMutation.error || deleteMutation.error,
  };
}