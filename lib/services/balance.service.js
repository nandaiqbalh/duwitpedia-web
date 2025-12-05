import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

/**
 * Updates a wallet's balance based on a transaction
 * @param {string} walletId - The wallet ID to update
 * @param {number} amount - The transaction amount
 * @param {string} type - Transaction type: 'income', 'expense', or 'transfer'
 * @param {string} direction - For transfers: 'from' or 'to'
 */
export async function updateWalletBalance(
  walletId,
  amount,
  type,
  direction = null
) {
  const wallet = await prisma.wallet.findUnique({
    where: { id: walletId },
    select: { balance: true, accountId: true },
  });

  if (!wallet) {
    throw new Error('Wallet not found');
  }

  let balanceChange = new Prisma.Decimal(0);

  if (type === 'income') {
    balanceChange = new Prisma.Decimal(amount);
  } else if (type === 'expense') {
    balanceChange = new Prisma.Decimal(amount).negated();
  } else if (type === 'transfer') {
    if (direction === 'from') {
      balanceChange = new Prisma.Decimal(amount).negated();
    } else if (direction === 'to') {
      balanceChange = new Prisma.Decimal(amount);
    }
  }

  const newBalance = wallet.balance.add(balanceChange);

  await prisma.wallet.update({
    where: { id: walletId },
    data: { balance: newBalance },
  });

  return wallet.accountId;
}

/**
 * Reverts a wallet's balance by reversing a transaction
 * @param {string} walletId - The wallet ID to update
 * @param {number} amount - The transaction amount
 * @param {string} type - Transaction type: 'income', 'expense', or 'transfer'
 * @param {string} direction - For transfers: 'from' or 'to'
 */
export async function revertWalletBalance(
  walletId,
  amount,
  type,
  direction = null
) {
  const wallet = await prisma.wallet.findUnique({
    where: { id: walletId },
    select: { balance: true, accountId: true },
  });

  if (!wallet) {
    throw new Error('Wallet not found');
  }

  let balanceChange = new Prisma.Decimal(0);

  // Revert is opposite of update
  if (type === 'income') {
    balanceChange = new Prisma.Decimal(amount).negated();
  } else if (type === 'expense') {
    balanceChange = new Prisma.Decimal(amount);
  } else if (type === 'transfer') {
    if (direction === 'from') {
      balanceChange = new Prisma.Decimal(amount);
    } else if (direction === 'to') {
      balanceChange = new Prisma.Decimal(amount).negated();
    }
  }

  const newBalance = wallet.balance.add(balanceChange);

  await prisma.wallet.update({
    where: { id: walletId },
    data: { balance: newBalance },
  });

  return wallet.accountId;
}

/**
 * Recalculates an account's balance from all its wallet balances
 * @param {string} accountId - The account ID to recalculate
 */
export async function recalculateAccountBalance(accountId) {
  const wallets = await prisma.wallet.findMany({
    where: { accountId, deletedAt: null },
    select: { balance: true },
  });

  const totalBalance = wallets.reduce(
    (sum, wallet) => sum.add(wallet.balance),
    new Prisma.Decimal(0)
  );

  await prisma.account.update({
    where: { id: accountId },
    data: { balance: totalBalance },
  });

  return totalBalance;
}

/**
 * Handles balance updates for a new transaction
 * @param {object} transaction - The transaction object with type, amount, walletId, toWalletId
 */
export async function handleTransactionCreate(transaction) {
  const accountIds = new Set();

  if (transaction.type === 'transfer') {
    // Update 'from' wallet
    const fromAccountId = await updateWalletBalance(
      transaction.walletId,
      transaction.amount,
      'transfer',
      'from'
    );
    accountIds.add(fromAccountId);

    // Update 'to' wallet
    if (transaction.toWalletId) {
      const toAccountId = await updateWalletBalance(
        transaction.toWalletId,
        transaction.amount,
        'transfer',
        'to'
      );
      accountIds.add(toAccountId);
    }
  } else {
    // Income or expense
    const accountId = await updateWalletBalance(
      transaction.walletId,
      transaction.amount,
      transaction.type
    );
    accountIds.add(accountId);
  }

  // Recalculate all affected accounts
  for (const accountId of accountIds) {
    await recalculateAccountBalance(accountId);
  }
}

/**
 * Handles balance updates for an updated transaction
 * @param {object} oldTransaction - The old transaction data
 * @param {object} newTransaction - The new transaction data
 */
export async function handleTransactionUpdate(oldTransaction, newTransaction) {
  const accountIds = new Set();

  // Revert old transaction
  if (oldTransaction.type === 'transfer') {
    const fromAccountId = await revertWalletBalance(
      oldTransaction.walletId,
      oldTransaction.amount,
      'transfer',
      'from'
    );
    accountIds.add(fromAccountId);

    if (oldTransaction.toWalletId) {
      const toAccountId = await revertWalletBalance(
        oldTransaction.toWalletId,
        oldTransaction.amount,
        'transfer',
        'to'
      );
      accountIds.add(toAccountId);
    }
  } else {
    const accountId = await revertWalletBalance(
      oldTransaction.walletId,
      oldTransaction.amount,
      oldTransaction.type
    );
    accountIds.add(accountId);
  }

  // Apply new transaction
  if (newTransaction.type === 'transfer') {
    const fromAccountId = await updateWalletBalance(
      newTransaction.walletId,
      newTransaction.amount,
      'transfer',
      'from'
    );
    accountIds.add(fromAccountId);

    if (newTransaction.toWalletId) {
      const toAccountId = await updateWalletBalance(
        newTransaction.toWalletId,
        newTransaction.amount,
        'transfer',
        'to'
      );
      accountIds.add(toAccountId);
    }
  } else {
    const accountId = await updateWalletBalance(
      newTransaction.walletId,
      newTransaction.amount,
      newTransaction.type
    );
    accountIds.add(accountId);
  }

  // Recalculate all affected accounts
  for (const accountId of accountIds) {
    await recalculateAccountBalance(accountId);
  }
}

/**
 * Handles balance updates for a deleted transaction
 * @param {object} transaction - The deleted transaction object
 */
export async function handleTransactionDelete(transaction) {
  const accountIds = new Set();

  // Revert the transaction
  if (transaction.type === 'transfer') {
    const fromAccountId = await revertWalletBalance(
      transaction.walletId,
      transaction.amount,
      'transfer',
      'from'
    );
    accountIds.add(fromAccountId);

    if (transaction.toWalletId) {
      const toAccountId = await revertWalletBalance(
        transaction.toWalletId,
        transaction.amount,
        'transfer',
        'to'
      );
      accountIds.add(toAccountId);
    }
  } else {
    const accountId = await revertWalletBalance(
      transaction.walletId,
      transaction.amount,
      transaction.type
    );
    accountIds.add(accountId);
  }

  // Recalculate all affected accounts
  for (const accountId of accountIds) {
    await recalculateAccountBalance(accountId);
  }
}
