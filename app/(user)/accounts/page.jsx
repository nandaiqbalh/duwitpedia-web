'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Plus, Search, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader, useConfirmDialog, ErrorState, LoadingState, EmptyState, CommonPagination } from '@/components/common';
import { AccountCard } from '@/components/accounts/account-card';
import { AccountFormDialog } from '@/components/accounts/account-form-dialog';
import { useAccounts, useAccountMutations } from '@/lib/hooks/useAccount';
import { toast } from 'sonner';

export default function AccountsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const { ConfirmDialog, showConfirm } = useConfirmDialog();

  const {
    accounts,
    pagination,
    loading,
    error,
    refetch,
  } = useAccounts({
    page,
    search: searchInput,
  });

  const {
    createAccount,
    updateAccount,
    deleteAccount,
    loading: mutationLoading,
  } = useAccountMutations();

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
    setPage(1); // Reset to first page when searching
    // The search will be applied through the useAccounts hook with the updated searchInput
  };

  const handleCreate = () => {
    setEditingAccount(null);
    setShowForm(true);
  };

  const handleEdit = (account) => {
    setEditingAccount(account);
    setShowForm(true);
  };

  const handleSubmit = async (data) => {
    let result;
    if (editingAccount) {
      result = await updateAccount(editingAccount.id, data);
    } else {
      result = await createAccount(data);
    }

    if (result.success) {
      toast.success(
        editingAccount
          ? 'Account updated successfully'
          : 'Account created successfully'
      );
      setShowForm(false);
      setEditingAccount(null);
      refetch();
    } else {
      toast.error(result.error || 'Something went wrong');
    }
  };

  const handleDelete = async (account) => {
    const confirmed = await showConfirm({
      title: 'Delete Account',
      message: `Are you sure you want to delete "${account.name}"? This action cannot be undone.`,
      variant: 'danger',
      confirmText: 'Delete',
    });

    if (confirmed) {
      const result = await deleteAccount(account.id);
      if (result.success) {
        toast.success('Account deleted successfully');
        refetch();
      } else {
        toast.error(result.error || 'Failed to delete account');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Accounts"
        description="Manage your financial accounts"
        infoContent={
          <div className="space-y-2">
            <p>
              Accounts are your main financial containers. They represent where your
              money is stored—for example:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Uang Pribadi (cash you carry)</li>
              <li>Tabungan (your bank savings)</li>
              <li>Rekening Gaji (salary account)</li>
              <li>Dana Darurat (emergency fund)</li>
            </ul>
            <p>
              Each account can contain multiple wallets inside it. Wallets help you
              separate money for different purposes—while still belonging to the same
              account. For example, inside account <strong>“Uang Pribadi”</strong>, you
              may have:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Dompet Harian</li>
              <li>Uang Transport</li>
              <li>Uang Jajan</li>
            </ul>
            <p>
              Tracking transactions per account helps you know exactly how much money
              you have in each source and understand your spending more clearly.
            </p>
          </div>
        }
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Accounts' },
        ]}
        actions={
          <Button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Account
          </Button>
        }
      />

      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="mb-6">
        <div className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search accounts..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Search
          </Button>
        </div>
      </form>

      {/* Cards Grid */}
      {loading ? (
        <LoadingState message="Loading accounts..." />

      ) : accounts.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No accounts yet"
          description="Get started by creating your first account to manage your finances"
          className="bg-white rounded-lg shadow"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account, index) => (
              <AccountCard
                key={account.id}
                account={account}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          {accounts.length > 0 && pagination.totalPages > 1 && (
            <CommonPagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
              onPageChange={setPage}
              loading={loading}
              itemLabel="accounts"
              layout="responsive"
            />
          )}
        </>
      )}

      {/* Error Display */}
      {error && (
        <ErrorState
          title="Failed to load accounts"
          description={error}
          actionLabel="Try Again"
          actionOnClick={() => refetch()}
          className="mt-4"
        />
      )}

      {/* Form Dialog */}
      <AccountFormDialog
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingAccount(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingAccount}
        loading={mutationLoading}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog />
    </div>
  );
}
