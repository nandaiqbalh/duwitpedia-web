'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, CommonPagination, useConfirmDialog, ErrorState } from '@/components/common';
import { WalletTable } from '@/components/wallets/wallet-table';
import { WalletFormDialog } from '@/components/wallets/wallet-form-dialog';
import { WalletFilters } from '@/components/wallets/wallet-filters';
import { useWallets, useWalletMutations } from '@/lib/hooks/useWallet';
import { useAccounts } from '@/lib/hooks/useTransaction';
import { toast } from 'sonner';

export default function WalletsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [editingWallet, setEditingWallet] = useState(null);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);
  const { ConfirmDialog, showConfirm } = useConfirmDialog();

  // Initialize filters from URL params
  const [filters, setFilters] = useState({
    accountId: searchParams.get('accountId') || '',
  });

  const {
    wallets,
    pagination,
    loading,
    error,
    refetch,
    setPage,
    setSearch,
    setAccountFilter,
  } = useWallets(searchInput, filters.accountId);

  const {
    createWallet,
    updateWallet,
    deleteWallet,
    loading: mutationLoading,
  } = useWalletMutations();

  const { accounts } = useAccounts();

  // Function to update URL params
  const updateURL = (params) => {
    const newSearchParams = new URLSearchParams(searchParams);

    // Update or remove params
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== '') {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });

    router.replace(`?${newSearchParams.toString()}`, { scroll: false });
  };

  // Sync state with URL params when URL changes
  useEffect(() => {
    setFilters({
      accountId: searchParams.get('accountId') || '',
    });
    setSearchInput(searchParams.get('search') || '');
  }, [searchParams]);

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    updateURL({ search: searchInput });
  };

  const handleFilterChange = (filterType, value) => {
    const apiValue = value === 'all' ? '' : value;

    const updates = {
      [filterType]: apiValue,
    };

    // Update local state
    setFilters(prev => ({ ...prev, ...updates }));

    // Update URL params
    updateURL(updates);

    // Update API filters
    if (filterType === 'accountId') {
      setAccountFilter(apiValue);
    }
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      accountId: '',
    };

    setFilters(clearedFilters);
    updateURL(clearedFilters);
    setAccountFilter('');
  };

  const activeFiltersCount = Object.values(filters).filter(value => value && value !== '').length;

  const handleCreate = () => {
    setEditingWallet(null);
    setShowForm(true);
  };

  const handleEdit = (wallet) => {
    setEditingWallet(wallet);
    setShowForm(true);
  };

  const handleSubmit = async (data) => {
    let result;
    if (editingWallet) {
      result = await updateWallet(editingWallet.id, data);
    } else {
      result = await createWallet(data);
    }

    if (result.success) {
      toast.success(
        editingWallet
          ? 'Wallet updated successfully'
          : 'Wallet created successfully'
      );
      setShowForm(false);
      setEditingWallet(null);
      refetch();
    } else {
      toast.error(result.error || 'Something went wrong');
    }
  };

  const handleDelete = async (wallet) => {
    const confirmed = await showConfirm({
      title: 'Delete Wallet',
      message: `Are you sure you want to delete "${wallet.name}"? This action cannot be undone.`,
      variant: 'danger',
      confirmText: 'Delete',
    });

    if (confirmed) {
      const result = await deleteWallet(wallet.id);
      if (result.success) {
        toast.success('Wallet deleted successfully');
        refetch();
      } else {
        toast.error(result.error || 'Failed to delete wallet');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">

      <PageHeader
        title="Wallets"
        description="Manage where your money is stored"
        infoContent={
          <div className="space-y-2">
            <p>
              Wallets represent the specific places where your money is stored. They can be
              physical, digital, or bank-based. Wallets help you separate your funds inside
              an account for better clarity and tracking.
            </p>

            <p>Common examples of wallets include:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>BCA</strong> (bank account)</li>
              <li><strong>BNI</strong> (bank account)</li>
              <li><strong>Cash</strong> (physical money)</li>
              <li><strong>OVO</strong></li>
              <li><strong>Dana</strong></li>
              <li><strong>Gopay</strong></li>
            </ul>

            <p>
              Each wallet has its own balance and records transactions independently.
              This allows you to track where money enters and leaves each source without mixing them.
            </p>

            <p>
              Wallets are grouped under an <strong>Account</strong>.
              For example, inside the account <strong>“Uang Pribadi”</strong>, you may have:
            </p>

            <ul className="list-disc pl-5 space-y-1">
              <li>BCA</li>
              <li>Cash</li>
              <li>Gopay</li>
            </ul>

            <p>
              By managing your wallets, you can clearly see how much money is stored in every source
              and ensure your financial tracking stays organized and accurate.
            </p>
          </div>
        }
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Wallets' },
        ]}
        actions={
          <Button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Wallet
          </Button>
        }
      />

      {/* Filters */}
      <WalletFilters
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        onSearchSubmit={handleSearchSubmit}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        filters={filters}
        onFilterChange={handleFilterChange}
        accounts={accounts || []}
        loading={loading}
        onClearFilters={handleClearFilters}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <WalletTable
          wallets={wallets}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />

        {/* Pagination */}
        {!loading && (
          <div className="px-4 py-4 border-t">
            <CommonPagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
              onPageChange={setPage}
              itemLabel="wallets"
            />
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <ErrorState
          title="Failed to load wallets"
          description={error}
          actionLabel="Try Again"
          actionOnClick={() => refetch()}
          className="mt-4"
        />
      )}

      {/* Form Dialog */}
      <WalletFormDialog
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingWallet(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingWallet}
        loading={mutationLoading}
        accounts={accounts}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog />
    </div>
  );
}
