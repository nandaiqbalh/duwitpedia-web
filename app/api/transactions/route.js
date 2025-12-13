import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { handleTransactionCreate } from '@/lib/services/balance.service';
import { parseISO } from 'date-fns';

// GET /api/transactions - Get all transactions with pagination and filters
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const accountId = searchParams.get('accountId') || '';
    const walletId = searchParams.get('walletId') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    const showAdminFee = searchParams.get('showAdminFee') === 'true';

    console.log('Transaction filters received:', { page, limit, search, type, accountId, walletId, categoryId, startDate, endDate, showAdminFee });

    const skip = (page - 1) * limit;

    // Build where clause
    const where = {
      userId: session.user.id,
      deletedAt: null,
      // Filter admin fee transactions based on showAdminFee parameter
      ...(showAdminFee ? { isAdminFee: true } : { isAdminFee: false }),
      ...(search && {
        OR: [
          { note: { contains: search, mode: 'insensitive' } },
          { account: { name: { contains: search, mode: 'insensitive' } } },
          { category: { name: { contains: search, mode: 'insensitive' } } },
        ],
      }),
      ...(type && { type }),
      ...(accountId && { accountId }),
      ...(walletId && { walletId }),
      ...(categoryId && { categoryId }),
      ...(startDate && endDate && {
        date: {
          gte: parseISO(startDate),
          lte: parseISO(endDate),
        },
      }),
    };

    console.log('Transaction where clause:', JSON.stringify(where, null, 2));

    // Get transactions with relations
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
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
          adminFeeChild: {
            select: {
              id: true,
              amount: true,
            },
          },
        },
        orderBy: [
          {
            date: 'desc',
          },
          {
            createdAt: 'desc',
          },
        ],
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// POST /api/transactions - Create new transaction
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { accountId, walletId, toAccountId, toWalletId, categoryId, amount, type, note, date, hasAdminFee, adminFeeAmount } = body;

    // Validate required fields
    if (!accountId || !walletId || !categoryId || !amount || !type || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate admin fee amount format
    if (hasAdminFee) {
      if (!adminFeeAmount) {
        return NextResponse.json(
          { error: 'Admin fee amount is required when admin fee is enabled' },
          { status: 400 }
        );
      }
      const adminFeeNum = parseFloat(adminFeeAmount);
      if (isNaN(adminFeeNum) || adminFeeNum <= 0) {
        return NextResponse.json(
          { error: 'Admin fee amount must be a positive number' },
          { status: 400 }
        );
      }
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

    // Validate amount
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }

    // Validate admin fee doesn't exceed transaction amount
    if (hasAdminFee) {
      const adminFeeNum = parseFloat(adminFeeAmount);
      if (adminFeeNum > amountNum) {
        return NextResponse.json(
          { error: 'Admin fee amount cannot exceed transaction amount' },
          { status: 400 }
        );
      }
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

    // Create parent transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        accountId,
        walletId,
        toAccountId: type === 'transfer' ? toAccountId : null,
        toWalletId: type === 'transfer' ? toWalletId : null,
        categoryId,
        amount: amountNum,
        type,
        note: note || null,
        date: new Date(date),
        isAdminFee: false,
        adminFeeAmount: hasAdminFee ? parseFloat(adminFeeAmount) : null,
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

    // Update wallet and account balances for parent transaction
    await handleTransactionCreate(transaction);

    // Create admin fee child transaction if hasAdminFee is true
    if (hasAdminFee && adminFeeAmount) {
      const adminFeeAmountNum = parseFloat(adminFeeAmount);
      
      // Find or create "Admin Fee" category (expense type)
      let adminFeeCategory = await prisma.category.findFirst({
        where: {
          userId: session.user.id,
          name: 'Admin Fee',
          type: 'expense',
          deletedAt: null,
        },
      });

      if (!adminFeeCategory) {
        adminFeeCategory = await prisma.category.create({
          data: {
            userId: session.user.id,
            name: 'Admin Fee',
            type: 'expense',
          },
        });
      }

      // Create admin fee transaction (always expense)
      const adminFeeTransaction = await prisma.transaction.create({
        data: {
          userId: session.user.id,
          accountId,
          walletId,
          categoryId: adminFeeCategory.id,
          amount: adminFeeAmountNum,
          type: 'expense',
          note: `Admin fee for transaction: ${note || 'Transaction'}`,
          date: new Date(date),
          isAdminFee: true,
          parentId: transaction.id,
        },
      });

      // Update wallet and account balances for admin fee transaction
      await handleTransactionCreate(adminFeeTransaction);
    }

    return NextResponse.json({
      success: true,
      data: transaction,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}
