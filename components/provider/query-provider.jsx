'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

// Cache presets berdasarkan jenis data
export const cachePresets = {
  // Data yang berubah sangat cepat
  transactional: {
    staleTime: 60 * 1000, // 1 menit
    refetchOnWindowFocus: true,
    retry: 2,
  },

  // Data dashboard dan statistik
  dashboard: {
    staleTime: 5 * 60 * 1000, // 5 menit
    refetchOnWindowFocus: false,
    retry: 1,
  },

  // Data akun dan kategori (jarang berubah)
  account: {
    staleTime: 30 * 60 * 1000, // 30 menit
    refetchOnWindowFocus: false,
    retry: 1,
  },

  // Data user profile (sangat jarang berubah)
  profile: {
    staleTime: 60 * 60 * 1000, // 60 menit
    refetchOnWindowFocus: false,
    retry: 1,
  },

  // Data lookup/statis (hampir tidak pernah berubah)
  lookup: {
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
  },

  // Default untuk data lainnya
  default: {
    staleTime: 5 * 60 * 1000, // 5 menit
    refetchOnWindowFocus: false,
    retry: 1,
  },
};

export function QueryProvider({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: cachePresets.default,
          mutations: {
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
