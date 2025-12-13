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
const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Category name is too long'),
  type: z.enum(['income', 'expense', 'transfer'], {
    required_error: 'Please select a category type',
  }),
});

export function CategoryFormDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
  hideTypeSelector = false, // New prop to hide type selector when called from transaction form
  isCreatingFromTransaction = false, // Flag to indicate creating from transaction form
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      type: 'expense',
    },
  });

  const selectedType = watch('type');

  // Reset form when dialog opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (isCreatingFromTransaction) {
        // When creating from transaction, only set type, clear name
        reset({
          name: '',
          type: initialData?.type || 'expense',
        });
      } else {
        // Normal edit mode
        reset({
          name: initialData?.name || '',
          type: initialData?.type || 'expense',
        });
      }
    }
  }, [isOpen, initialData, isCreatingFromTransaction, reset]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] backdrop-blur-md">
        <DialogHeader>
          <DialogTitle>
            {(initialData && !isCreatingFromTransaction) ? 'Edit Category' : 'Create New Category'}
          </DialogTitle>
          <DialogDescription>
            {(initialData && !isCreatingFromTransaction)
              ? 'Update your category information below.'
              : 'Add a new category to organize your transactions.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., Food, Transportation, Salary"
              {...register('name')}
              disabled={loading}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {!hideTypeSelector && (
            <div className="space-y-2">
              <Label htmlFor="type">Category Type *</Label>
              <Select
                value={selectedType}
                onValueChange={(value) => setValue('type', value)}
                disabled={loading}
              >
                <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select category type" />
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
          )}
          
          {hideTypeSelector && (
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p>
                <strong>Category Type:</strong>{' '}
                <span className="inline-flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${
                    selectedType === 'income' ? 'bg-green-500' :
                    selectedType === 'expense' ? 'bg-red-500' : 'bg-blue-500'
                  }`}></span>
                  {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
                </span>
              </p>
              <p className="text-xs mt-1">
                Category type is automatically set based on your transaction type.
              </p>
            </div>
          )}

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
                <span>{(initialData && !isCreatingFromTransaction) ? 'Update' : 'Create'}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}