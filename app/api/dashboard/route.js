import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

// GET /api/dashboard - Get dashboard data with stats and insights
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    // Get all accounts for total balance
    const accounts = await prisma.account.findMany({
      where: {
        userId,
        deletedAt: null,
      },
    });

    // Get current month transactions
    const currentMonthTransactions = await prisma.transaction.findMany({
      where: {
        userId,
        deletedAt: null,
        date: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
      include: {
        category: true,
        account: true,
        wallet: true,
      },
    });

    // Get last month transactions for comparison
    const lastMonthTransactions = await prisma.transaction.findMany({
      where: {
        userId,
        deletedAt: null,
        date: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
    });

    // Calculate total balance
    const totalBalance = accounts.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);

    // Calculate current month stats
    let currentIncome = 0;
    let currentExpense = 0;
    const categoryExpenses = {};
    const categoryIncomes = {};

    currentMonthTransactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount);
      
      if (transaction.type === 'income') {
        currentIncome += amount;
        
        // Track income by category
        const catName = transaction.category.name;
        if (!categoryIncomes[catName]) {
          categoryIncomes[catName] = {
            name: catName,
            total: 0,
            count: 0,
            category: transaction.category,
          };
        }
        categoryIncomes[catName].total += amount;
        categoryIncomes[catName].count += 1;
      } else if (transaction.type === 'expense') {
        currentExpense += amount;
        
        // Track expenses by category
        const catName = transaction.category.name;
        if (!categoryExpenses[catName]) {
          categoryExpenses[catName] = {
            name: catName,
            total: 0,
            count: 0,
            category: transaction.category,
          };
        }
        categoryExpenses[catName].total += amount;
        categoryExpenses[catName].count += 1;
      }
    });

    // Calculate last month stats for comparison
    let lastIncome = 0;
    let lastExpense = 0;

    lastMonthTransactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount);
      if (transaction.type === 'income') {
        lastIncome += amount;
      } else if (transaction.type === 'expense') {
        lastExpense += amount;
      }
    });

    // Calculate percentage changes
    const incomeChange = lastIncome === 0 
      ? (currentIncome > 0 ? 100 : 0)
      : ((currentIncome - lastIncome) / lastIncome) * 100;

    const expenseChange = lastExpense === 0
      ? (currentExpense > 0 ? 100 : 0)
      : ((currentExpense - lastExpense) / lastExpense) * 100;

    // Get top 5 expense categories
    const topExpenses = Object.values(categoryExpenses)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    // Get top 5 income categories
    const topIncomes = Object.values(categoryIncomes)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    // Get recent transactions (last 10)
    const recentTransactions = await prisma.transaction.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
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
      },
      orderBy: {
        date: 'desc',
      },
      take: 10,
    });

    // Count resources
    const [accountsCount, walletsCount, categoriesCount] = await Promise.all([
      prisma.account.count({ where: { userId, deletedAt: null } }),
      prisma.wallet.count({ where: { userId, deletedAt: null } }),
      prisma.category.count({ where: { userId, deletedAt: null } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalBalance,
          currentIncome,
          currentExpense,
          netIncome: currentIncome - currentExpense,
          incomeChange,
          expenseChange,
          accountsCount,
          walletsCount,
          categoriesCount,
          transactionsCount: currentMonthTransactions.length,
        },
        insights: {
          topExpenses,
          topIncomes,
          totalExpenseCategories: Object.keys(categoryExpenses).length,
          totalIncomeCategories: Object.keys(categoryIncomes).length,
        },
        recentTransactions,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}