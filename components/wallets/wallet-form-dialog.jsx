'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Validation schema
const walletSchema = z.object({
  name: z.string().min(1, 'Wallet name is required').max(100, 'Wallet name is too long'),
  accountId: z.string().min(1, 'Account is required'),
  initialBalance: z.string().optional().refine(
    (val) => !val || !isNaN(parseFloat(val)),
    'Initial balance must be a valid number'
  ),
});

export function WalletFormDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
  accounts = []
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(walletSchema),
    defaultValues: {
      name: '',
      accountId: '',
      initialBalance: '0',
    },
  });

  const accountId = watch('accountId');

  // Reset form when dialog opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      reset({
        name: initialData?.name || '',
        accountId: initialData?.accountId || '',
        initialBalance: initialData?.balance?.toString() || '0',
      });
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] backdrop-blur-md">

        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Wallet' : 'Create New Wallet'}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Update the wallet details below.'
              : 'Create a new wallet to represent where your money is stored, such as a bank account, e-wallet, or cash.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">

          {/* ACCOUNT SELECT */}
          <div className="space-y-2">
            <Label htmlFor="accountId">Account *</Label>
            <Select
              value={accountId}
              onValueChange={(value) => setValue('accountId', value)}
              disabled={loading}
            >
              <SelectTrigger className={errors.accountId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Choose an account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No accounts available
                  </SelectItem>
                ) : (
                  accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.accountId && (
              <p className="text-sm text-red-500">{errors.accountId.message}</p>
            )}
          </div>

          {/* WALLET NAME */}
          <div className="space-y-2">
            <Label htmlFor="name">Wallet Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., BCA, Cash, OVO, BNI"
              {...register('name')}
              disabled={loading}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* INITIAL BALANCE */}
          {!initialData && (
            <div className="space-y-2">
              <Label htmlFor="initialBalance">Initial Balance</Label>
              <Input
                id="initialBalance"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('initialBalance')}
                disabled={loading}
                className={errors.initialBalance ? 'border-red-500' : ''}
              />
              {errors.initialBalance && (
                <p className="text-sm text-red-500">
                  {errors.initialBalance.message}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Starting balance for this wallet (defaults to 0).
              </p>
            </div>
          )}

          {/* FOOTER BUTTONS */}
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
  );
}
