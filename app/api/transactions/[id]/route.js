import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { 
  handleTransactionUpdate, 
  handleTransactionDelete 
} from '@/lib/services/balance.service';

// GET /api/transactions/[id] - Get single transaction
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: session.user.id,
        deletedAt: null,
      },
      include: {
        account: {
          select: {
            id: true,
            name: true,
            currency: true,
          },
        },
        wallet: {
          select: {
            id: true,
            name: true,
          },
        },
        toWallet: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction' },
      { status: 500 }
    );
  }
}

// PUT /api/transactions/[id] - Update transaction
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { accountId, walletId, toAccountId, toWalletId, categoryId, amount, type, note, date } = body;

    // Check if transaction exists and belongs to user
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: session.user.id,
        deletedAt: null,
      },
    });

    if (!existingTransaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Validate required fields
    if (!accountId || !walletId || !categoryId || !amount || !type || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate transaction type
    if (!['income', 'expense', 'transfer'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid transaction type' },
        { status: 400 }
      );
    }

    // Validate toAccountId and toWalletId for transfer
    if (type === 'transfer') {
      if (!toAccountId || !toWalletId) {
        return NextResponse.json(
          { error: 'Destination account and wallet are required for transfers' },
          { status: 400 }
        );
      }
      // If same account, wallets must be different
      if (accountId === toAccountId && walletId === toWalletId) {
        return NextResponse.json(
          { error: 'Source and destination wallets must be different' },
          { status: 400 }
        );
      }
    }

    // Validate toWalletId for transfer
    if (type === 'transfer') {
      if (!toWalletId) {
        return NextResponse.json(
          { error: 'Destination wallet is required for transfers' },
          { status: 400 }
        );
      }
      if (walletId === toWalletId) {
        return NextResponse.json(
          { error: 'Source and destination wallets must be different' },
          { status: 400 }
        );
      }
    }

    // Validate amount
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }

    // Verify account belongs to user
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId: session.user.id,
        deletedAt: null,
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    // Verify wallet belongs to user and account
    const wallet = await prisma.wallet.findFirst({
      where: {
        id: walletId,
        accountId: accountId,
        userId: session.user.id,
        deletedAt: null,
      },
    });

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found or does not belong to the selected account' },
        { status: 404 }
      );
    }

    // Verify toWallet for transfer
    if (type === 'transfer' && toWalletId) {
      const toWallet = await prisma.wallet.findFirst({
        where: {
          id: toWalletId,
          accountId: toAccountId,
          userId: session.user.id,
          deletedAt: null,
        },
      });

      if (!toWallet) {
        return NextResponse.json(
          { error: 'Destination wallet not found or does not belong to the selected account' },
          { status: 404 }
        );
      }
    }

    // Verify category belongs to user
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: session.user.id,
        deletedAt: null,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Validate category type matches transaction type (except for transfer)
    if (type !== 'transfer' && category.type !== type) {
      return NextResponse.json(
        { error: `Category type must be ${type}` },
        { status: 400 }
      );
    }

    // Update transaction
    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        accountId,
        walletId,
        toAccountId: type === 'transfer' ? toAccountId : null,
        toWalletId: type === 'transfer' ? toWalletId : null,
        categoryId,
        amount: amountNum,
        type,
        note: note || null,
        date: new Date(date),
        updatedAt: new Date(),
      },
      include: {
        account: {
          select: {
            id: true,
            name: true,
            currency: true,
          },
        },
        wallet: {
          select: {
            id: true,
            name: true,
          },
        },
        toWallet: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });

    // Update wallet and account balances
    await handleTransactionUpdate(existingTransaction, transaction);
    await handleTransactionUpdate(existingTransaction, transaction);

    return NextResponse.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}

// DELETE /api/transactions/[id] - Soft delete transaction
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Check if transaction exists and belongs to user
    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: session.user.id,
        deletedAt: null,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Update wallet and account balances before deletion
    await handleTransactionDelete(transaction);

    // Soft delete transaction
    await prisma.transaction.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
}
