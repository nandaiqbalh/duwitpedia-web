'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AccountField, WalletField, CategoryField, DateField } from './fields';
import { useAccounts, useAccountMutations } from '@/lib/hooks/useAccount';
import { useWallets, useWalletMutations } from '@/lib/hooks/useWallet';
import { useCategories, useCategoryMutations } from '@/lib/hooks/useCategory';
import { AccountFormDialog } from '@/components/accounts/account-form-dialog';
import { WalletFormDialog } from '@/components/wallets/wallet-form-dialog';
import { CategoryFormDialog } from '@/components/categories/category-form-dialog';
import { transactionSchema } from '@/lib/validations/transaction.schema';
import { format } from 'date-fns';
import { toast } from 'sonner';

export function TransactionFormDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  loading = false
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      accountId: '',
      walletId: '',
      toAccountId: '',
      toWalletId: '',
      categoryId: '',
      amount: '',
      type: 'expense',
      date: format(new Date(), 'yyyy-MM-dd'),
      note: '',
    },
  });

  const selectedType = watch('type');
  const selectedAccountId = watch('accountId');
  const selectedWalletId = watch('walletId');
  const selectedToAccountId = watch('toAccountId');
  const selectedToWalletId = watch('toWalletId');
  const selectedCategoryId = watch('categoryId');
  const selectedDate = watch('date');

  // State for create dialogs
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const [showWalletDialog, setShowWalletDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);

  // Get data from existing hooks
  const { accounts, loading: accountsLoading, refetch: refetchAccounts } = useAccounts();
  const { wallets, loading: walletsLoading, refetch: refetchWallets } = useWallets();
  const { categories, loading: categoriesLoading, refetch: refetchCategories } = useCategories({
    type: selectedType,
  });

  // Mutation hooks
  const { createAccount, loading: creatingAccount } = useAccountMutations();
  const { createWallet, loading: creatingWallet } = useWalletMutations();
  const { createCategory, loading: creatingCategory } = useCategoryMutations();

  // Filter wallets based on selected account
  const filteredWallets = selectedAccountId 
    ? wallets.filter(wallet => wallet.accountId === selectedAccountId)
    : [];

  // Filter destination wallets based on toAccountId
  const filteredToWallets = selectedToAccountId 
    ? wallets.filter(wallet => {
        if (selectedToAccountId === selectedAccountId) {
          return wallet.accountId === selectedToAccountId && wallet.id !== selectedWalletId;
        }
        return wallet.accountId === selectedToAccountId;
      })
    : [];

  // Filter categories based on transaction type
  const filteredCategories = selectedType === 'transfer' 
    ? categories.filter(cat => cat.type === 'transfer')
    : categories.filter(cat => cat.type === selectedType);

  // Populate form with initialData when editing
  useEffect(() => {
    if (initialData && isOpen) {
      setValue('accountId', initialData.accountId || '');
      setValue('walletId', initialData.walletId || '');
      setValue('toAccountId', initialData.toAccountId || '');
      setValue('toWalletId', initialData.toWalletId || '');
      setValue('categoryId', initialData.categoryId || '');
      setValue('amount', initialData.amount?.toString() || '');
      setValue('type', initialData.type || 'expense');
      setValue('date', initialData.date ? format(new Date(initialData.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'));
      setValue('note', initialData.note || '');
    } else if (!initialData && isOpen) {
      reset({
        accountId: '',
        walletId: '',
        toAccountId: '',
        toWalletId: '',
        categoryId: '',
        amount: '',
        type: 'expense',
        date: format(new Date(), 'yyyy-MM-dd'),
        note: '',
      });
    }
  }, [initialData, isOpen, setValue, reset]);

  // Reset walletId when account changes
  useEffect(() => {
    if (selectedAccountId && selectedWalletId) {
      const walletBelongsToAccount = filteredWallets.some(w => w.id === selectedWalletId);
      if (!walletBelongsToAccount) {
        setValue('walletId', '');
      }
    }
  }, [selectedAccountId, selectedWalletId, filteredWallets, setValue]);

  // Reset toAccountId and toWalletId when type changes
  useEffect(() => {
    if (selectedType !== 'transfer') {
      setValue('toAccountId', '');
      setValue('toWalletId', '');
    }
  }, [selectedType, setValue]);

  // Reset toWalletId when toAccountId changes
  useEffect(() => {
    if (selectedToAccountId && selectedToWalletId) {
      const walletBelongsToAccount = filteredToWallets.some(w => w.id === selectedToWalletId);
      if (!walletBelongsToAccount) {
        setValue('toWalletId', '');
      }
    }
  }, [selectedToAccountId, selectedToWalletId, filteredToWallets, setValue]);

  // Refetch categories when transaction type changes
  useEffect(() => {
    if (selectedType) {
      refetchCategories();
    }
  }, [selectedType, refetchCategories]);

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      note: data.note || null,
    });
  };

  const handleCreateAccount = async (data) => {
    const result = await createAccount(data);
    if (result.success) {
      toast.success('Account created successfully');
      refetchAccounts();
      setValue('accountId', result.data.id);
      setShowAccountDialog(false);
    } else {
      toast.error(result.error || 'Failed to create account');
    }
  };

  const handleCreateWallet = async (data) => {
    const result = await createWallet(data);
    if (result.success) {
      toast.success('Wallet created successfully');
      refetchWallets();
      setValue('walletId', result.data.id);
      setShowWalletDialog(false);
    } else {
      toast.error(result.error || 'Failed to create wallet');
    }
  };

  const handleCreateCategory = async (data) => {
    const result = await createCategory(data);
    if (result.success) {
      toast.success('Category created successfully');
      refetchCategories();
      setValue('categoryId', result.data.id);
      setShowCategoryDialog(false);
    } else {
      toast.error(result.error || 'Failed to create category');
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {initialData ? 'Edit Transaction' : 'Create New Transaction'}
            </DialogTitle>
            <DialogDescription>
              {initialData
                ? 'Update your transaction information below.'
                : 'Add a new transaction to track your finances.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Transaction Type *</Label>
              <Select
                value={selectedType}
                onValueChange={(value) => {
                  setValue('type', value);
                  setValue('categoryId', '');
                }}
                disabled={loading}
              >
                <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      Income
                    </div>
                  </SelectItem>
                  <SelectItem value="expense">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      Expense
                    </div>
                  </SelectItem>
                  <SelectItem value="transfer">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      Transfer
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AccountField
                value={selectedAccountId}
                onChange={(value) => setValue('accountId', value)}
                accounts={accounts}
                loading={accountsLoading}
                disabled={loading}
                error={errors.accountId?.message}
                onCreateNew={() => setShowAccountDialog(true)}
              />

              <WalletField
                label={selectedType === 'transfer' ? 'From Wallet' : 'Wallet'}
                value={selectedWalletId}
                onChange={(value) => setValue('walletId', value)}
                wallets={filteredWallets}
                loading={walletsLoading}
                disabled={loading}
                error={errors.walletId?.message}
                accountSelected={!!selectedAccountId}
                onCreateNew={() => setShowWalletDialog(true)}
              />

              {selectedType === 'transfer' && (
                <>
                  <AccountField
                    label="To Account"
                    value={selectedToAccountId}
                    onChange={(value) => setValue('toAccountId', value)}
                    accounts={accounts}
                    loading={accountsLoading}
                    disabled={loading}
                    error={errors.toAccountId?.message}
                  />

                  <WalletField
                    label="To Wallet"
                    value={selectedToWalletId}
                    onChange={(value) => setValue('toWalletId', value)}
                    wallets={filteredToWallets}
                    loading={walletsLoading}
                    disabled={loading}
                    error={errors.toWalletId?.message}
                    accountSelected={!!selectedToAccountId}
                  />
                </>
              )}
            </div>

            <CategoryField
              value={selectedCategoryId}
              onChange={(value) => setValue('categoryId', value)}
              categories={filteredCategories}
              loading={categoriesLoading}
              disabled={loading}
              error={errors.categoryId?.message}
              transactionType={selectedType}
              onCreateNew={() => setShowCategoryDialog(true)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 100000"
                  {...register('amount')}
                  disabled={loading}
                  className={errors.amount ? 'border-red-500' : ''}
                />
                {errors.amount && (
                  <p className="text-sm text-red-500">{errors.amount.message}</p>
                )}
              </div>

              <DateField
                value={selectedDate}
                onChange={(value) => setValue('date', value)}
                disabled={loading}
                error={errors.date?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <Textarea
                id="note"
                placeholder="Add a note about this transaction..."
                rows={3}
                {...register('note')}
                disabled={loading}
                className={errors.note ? 'border-red-500' : ''}
              />
              {errors.note && (
                <p className="text-sm text-red-500">{errors.note.message}</p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <span>{initialData ? 'Update' : 'Create'}</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="relative z-[100]">
        <AccountFormDialog
          isOpen={showAccountDialog}
          onClose={() => setShowAccountDialog(false)}
          onSubmit={handleCreateAccount}
          loading={creatingAccount}
        />

        <WalletFormDialog
          isOpen={showWalletDialog}
          onClose={() => setShowWalletDialog(false)}
          onSubmit={handleCreateWallet}
          loading={creatingWallet}
          accounts={accounts}
          initialData={selectedAccountId ? { accountId: selectedAccountId } : null}
        />

        <CategoryFormDialog
          isOpen={showCategoryDialog}
          onClose={() => setShowCategoryDialog(false)}
          onSubmit={handleCreateCategory}
          loading={creatingCategory}
          initialData={{ type: selectedType === 'transfer' ? 'expense' : selectedType }}
        />
      </div>
    </>
  );
}
