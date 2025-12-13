import * as z from 'zod';

export const transactionSchema = z.object({
  accountId: z.string().min(1, 'Account is required'),
  walletId: z.string().min(1, 'Wallet is required'),
  toAccountId: z.string().optional(),
  toWalletId: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  amount: z.string().min(1, 'Amount is required').refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    { message: 'Amount must be a positive number' }
  ),
  type: z.enum(['income', 'expense', 'transfer'], {
    required_error: 'Please select a transaction type',
  }),
  date: z.string().min(1, 'Date is required'),
  note: z.string().max(500, 'Note is too long').optional(),
  hasAdminFee: z.boolean().optional().default(false),
  adminFeeAmount: z.string().optional().refine(
    (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0),
    { message: 'Admin fee must be a positive number' }
  ),
}).refine(
  (data) => {
    // If type is transfer, toAccountId and toWalletId are required
    if (data.type === 'transfer') {
      return !!data.toAccountId && data.toAccountId.length > 0 &&
             !!data.toWalletId && data.toWalletId.length > 0;
    }
    return true;
  },
  {
    message: 'Destination account and wallet are required for transfers',
    path: ['toAccountId'],
  }
).refine(
  (data) => {
    // If type is transfer and same account, wallets must be different
    if (data.type === 'transfer' && data.accountId === data.toAccountId && data.toWalletId) {
      return data.walletId !== data.toWalletId;
    }
    return true;
  },
  {
    message: 'Source and destination wallets must be different',
    path: ['toWalletId'],
  }
).refine(
  (data) => {
    // If hasAdminFee is true, adminFeeAmount must be a valid positive number
    if (data.hasAdminFee) {
      if (!data.adminFeeAmount || data.adminFeeAmount.length === 0) {
        return false;
      }
      const amount = parseFloat(data.adminFeeAmount);
      return !isNaN(amount) && amount > 0;
    }
    return true;
  },
  {
    message: 'Admin fee amount must be a valid positive number when admin fee is enabled',
    path: ['adminFeeAmount'],
  }
);
