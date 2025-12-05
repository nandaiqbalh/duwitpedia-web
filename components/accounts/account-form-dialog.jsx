'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Validation schema
const accountSchema = z.object({
  name: z.string().min(1, 'Account name is required').max(100, 'Account name is too long'),
});

export function AccountFormDialog({
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
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: '',
    },
  });

  // Reset form when dialog opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      reset({
        name: initialData?.name || '',
      });
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      currency: 'IDR', // Fixed to IDR for now
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] backdrop-blur-md">

        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Account' : 'Create New Account'}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Update the details of this financial account.'
              : 'Add a new financial account to help organize and track your money.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Account Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., Uang Pribadi, Tabungan, Dompet Utama"
              {...register('name')}
              disabled={loading}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
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
  );
}
