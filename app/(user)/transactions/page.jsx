'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, useConfirmDialog, ErrorState, CommonPagination } from '@/components/common';
import { TransactionTable } from '@/components/transactions/transaction-table';
import { TransactionFormDialog } from '@/components/transactions/transaction-form-dialog';
import { TransactionFilters } from '@/components/transactions/transaction-filters';
import { useTransactions, useTransactionMutations, useAccounts, useWallets } from '@/lib/hooks/useTransaction';
import { useCategories } from '@/lib/hooks/useCategory';
import { toast } from 'sonner';

export default function TransactionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const { ConfirmDialog, showConfirm } = useConfirmDialog();

  // Initialize filters from URL params
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '');
  const [accountFilter, setAccountFilter] = useState(searchParams.get('accountId') || '');
  const [walletFilter, setWalletFilter] = useState(searchParams.get('walletId') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('categoryId') || '');
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');
  const [showAdminFeeFilter, setShowAdminFeeFilter] = useState(searchParams.get('showAdminFee') === 'true');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));

  const {
    transactions,
    pagination,
    loading,
    error,
    refetch,
    setPage,
    setSearch,
    setType,
    setAccountId,
    setWalletId,
    setCategoryId,
    setDateRange,
    setShowAdminFee,
  } = useTransactions({
    page: currentPage,
    search: searchInput,
    type: typeFilter,
    accountId: accountFilter,
    walletId: walletFilter,
    categoryId: categoryFilter,
    startDate,
    endDate,
    showAdminFee: showAdminFeeFilter,
  });

  const {
    createTransaction,
    updateTransaction,
    deleteTransaction,
    loading: mutationLoading,
  } = useTransactionMutations();

  const { accounts } = useAccounts();
  const { wallets } = useWallets();
  const { categories } = useCategories();

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

    // Always reset page to 1 when filters change (except for page param itself)
    if (!params.page) {
      newSearchParams.set('page', '1');
    }

    router.replace(`?${newSearchParams.toString()}`, { scroll: false });
  };

  // Sync state with URL params when URL changes
  useEffect(() => {
    setSearchInput(searchParams.get('search') || '');
    setTypeFilter(searchParams.get('type') || '');
    setAccountFilter(searchParams.get('accountId') || '');
    setWalletFilter(searchParams.get('walletId') || '');
    setCategoryFilter(searchParams.get('categoryId') || '');
    setStartDate(searchParams.get('startDate') || '');
    setEndDate(searchParams.get('endDate') || '');
    setShowAdminFeeFilter(searchParams.get('showAdminFee') === 'true');
    setCurrentPage(parseInt(searchParams.get('page') || '1'));
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
    updateURL({ search: searchInput });
    setSearch(searchInput);
  };

  const handleTypeFilterChange = (value) => {
    const actualValue = value === 'all' ? '' : value;
    setTypeFilter(actualValue);
    updateURL({ type: actualValue });
    setType(actualValue);
  };

  const handleAccountFilterChange = (value) => {
    const actualValue = value === 'all' ? '' : value;
    setAccountFilter(actualValue);
    updateURL({ accountId: actualValue });
    setAccountId(actualValue);
  };

  const handleWalletFilterChange = (value) => {
    const actualValue = value === 'all' ? '' : value;
    setWalletFilter(actualValue);
    updateURL({ walletId: actualValue });
    setWalletId(actualValue);
  };

  const handleCategoryFilterChange = (value) => {
    const actualValue = value === 'all' ? '' : value;
    setCategoryFilter(actualValue);
    updateURL({ categoryId: actualValue });
    setCategoryId(actualValue);
  };

  const handleDateRangeChange = () => {
    updateURL({ startDate, endDate });
    setDateRange(startDate, endDate);
  };

  const handleShowAdminFeeChange = (value) => {
    setShowAdminFeeFilter(value);
    
    // Reset category filter when showing admin fee only
    if (value) {
      setCategoryFilter('');
      updateURL({ showAdminFee: 'true', categoryId: '' });
      setCategoryId('');
    } else {
      updateURL({ showAdminFee: '' });
    }
    
    setShowAdminFee(value);
  };

  const handleClearFilters = () => {
    setTypeFilter('');
    setAccountFilter('');
    setWalletFilter('');
    setCategoryFilter('');
    setStartDate('');
    setEndDate('');
    setShowAdminFeeFilter(false);
    updateURL({
      type: '',
      accountId: '',
      walletId: '',
      categoryId: '',
      startDate: '',
      endDate: '',
      showAdminFee: '',
      search: searchInput, // Keep search
    });
    setType('');
    setAccountId('');
    setWalletId('');
    setCategoryId('');
    setDateRange('', '');
    setShowAdminFee(false);
  };

  const handleCreate = () => {
    setEditingTransaction(null);
    setShowForm(true);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleSubmit = async (data) => {
    let result;
    if (editingTransaction) {
      result = await updateTransaction(editingTransaction.id, data);
    } else {
      result = await createTransaction(data);
    }

    if (result.success) {
      toast.success(
        editingTransaction
          ? 'Transaction updated successfully'
          : 'Transaction created successfully'
      );
      setShowForm(false);
      setEditingTransaction(null);
      refetch();
    } else {
      toast.error(result.error || 'Something went wrong');
    }
  };

  const handleDelete = async (transaction) => {
    const confirmed = await showConfirm({
      title: 'Delete Transaction',
      message: `Are you sure you want to delete this transaction? This action cannot be undone.`,
      variant: 'danger',
      confirmText: 'Delete',
    });

    if (confirmed) {
      const result = await deleteTransaction(transaction.id);
      if (result.success) {
        toast.success('Transaction deleted successfully');
        refetch();
      } else {
        toast.error(result.error || 'Failed to delete transaction');
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateURL({ page: page.toString() });
    setPage(page);
  };

  const activeFiltersCount = [typeFilter, accountFilter, walletFilter, categoryFilter, startDate, endDate, showAdminFeeFilter].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Transactions"
        description="Track and manage all your financial activities"
        infoContent={
          <div className="space-y-2">
            <p>
              Transactions are the core of your financial system. Every time money enters
              or leaves your wallet—whether it's income, spending, or transferring between
              wallets—it is recorded as a transaction.
            </p>

            <p>There are three types of transactions:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Income</strong> — money coming in (e.g., Salary, Bonus, Refund)</li>
              <li><strong>Expense</strong> — money going out (e.g., Food, Transport, Shopping)</li>
              <li><strong>Transfer</strong> — moving money between your own wallets
                (e.g., Transfer from BCA → Cash)
              </li>
            </ul>

            <p>
              Each transaction is linked to an <strong>Account</strong>, a
              <strong> Category</strong>, and optionally a <strong>Wallet</strong>
              (if the account has multiple wallets). This helps you organize and analyze
              your financial activities with clarity.
            </p>

            <p>
              By consistently recording your transactions, you can see where your money
              comes from, where it goes, and how your financial habits change over time.
            </p>
          </div>
        }
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Transactions' },
        ]}
        actions={
          <Button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        }
      />


      {/* Search and Filter Toggle */}
      <TransactionFilters
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        onSearchSubmit={handleSearchSubmit}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        typeFilter={typeFilter}
        accountFilter={accountFilter}
        walletFilter={walletFilter}
        categoryFilter={categoryFilter}
        startDate={startDate}
        endDate={endDate}
        showAdminFee={showAdminFeeFilter}
        onTypeFilterChange={handleTypeFilterChange}
        onAccountFilterChange={handleAccountFilterChange}
        onWalletFilterChange={handleWalletFilterChange}
        onCategoryFilterChange={handleCategoryFilterChange}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onShowAdminFeeChange={handleShowAdminFeeChange}
        onClearFilters={handleClearFilters}
        accounts={accounts}
        wallets={wallets}
        categories={categories}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <TransactionTable
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          currentPage={pagination.page}
          pageSize={pagination.limit}
        />

        {/* Pagination */}
        {!loading && transactions.length > 0 && pagination.totalPages > 1 && (
          <div className="px-4 py-4 border-t">
            <CommonPagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
              onPageChange={handlePageChange}
              loading={loading}
              itemLabel="transactions"
              layout="responsive"
              className="mt-0"
            />
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <ErrorState
          title="Failed to load transactions"
          description={error}
          actionLabel="Try Again"
          actionOnClick={() => refetch()}
          className="mt-4"
        />
      )}

      {/* Form Dialog */}
      <TransactionFormDialog
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingTransaction}
        loading={mutationLoading}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog />
    </div>
  );
}
