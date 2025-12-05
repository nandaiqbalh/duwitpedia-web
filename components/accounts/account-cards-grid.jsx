'use client';

import { AccountCard } from './account-card';
import { LoadingState, EmptyState } from '@/components/common';

export function AccountCardsGrid({ accounts, onEdit, onDelete, loading }) {
  if (loading) {
    return <LoadingState message="Loading accounts..." />;
  }

  if (!accounts || accounts.length === 0) {
    return (
      <EmptyState
        title="No accounts found"
        description="Get started by creating your first account."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {accounts.map((account) => (
        <AccountCard
          key={account.id}
          account={account}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
