import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, format, subMonths, subWeeks, parseISO, differenceInDays } from 'date-fns';

// GET /api/reports - Get financial reports with filters
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
    const period = searchParams.get('period') || 'monthly'; // monthly, weekly, custom
    const month = searchParams.get('month') || ''; // YYYY-MM format
    const startDateParam = searchParams.get('startDate') || '';
    const endDateParam = searchParams.get('endDate') || '';
    const year = searchParams.get('year') || new Date().getFullYear();
    const accountId = searchParams.get('accountId') || '';
    const walletId = searchParams.get('walletId') || '';
    const categoryId = searchParams.get('categoryId') || '';

    console.log('Report filters received:', { period, month, startDateParam, endDateParam, year, accountId, walletId, categoryId });

    // Calculate date range based on period
    let startDate, endDate, prevStartDate, prevEndDate;

    if (period === 'custom' && startDateParam && endDateParam) {
      // Custom date range
      startDate = parseISO(startDateParam);
      endDate = parseISO(endDateParam);
      const daysDiff = differenceInDays(endDate, startDate) + 1;
      prevEndDate = new Date(startDate);
      prevEndDate.setDate(prevEndDate.getDate() - 1);
      prevStartDate = new Date(prevEndDate);
      prevStartDate.setDate(prevStartDate.getDate() - daysDiff + 1);
    } else if (period === 'custom' && month) {
      // Custom month selection
      const [yearStr, monthStr] = month.split('-');
      startDate = startOfMonth(new Date(parseInt(yearStr), parseInt(monthStr) - 1));
      endDate = endOfMonth(new Date(parseInt(yearStr), parseInt(monthStr) - 1));
      prevStartDate = startOfMonth(subMonths(startDate, 1));
      prevEndDate = endOfMonth(subMonths(startDate, 1));
    } else if (period === 'weekly') {
      // Current week
      startDate = startOfWeek(new Date());
      endDate = endOfWeek(new Date());
      prevStartDate = startOfWeek(subWeeks(startDate, 1));
      prevEndDate = endOfWeek(subWeeks(startDate, 1));
    } else {
      // Default to current month
      startDate = startOfMonth(new Date());
      endDate = endOfMonth(new Date());
      prevStartDate = startOfMonth(subMonths(startDate, 1));
      prevEndDate = endOfMonth(subMonths(startDate, 1));
    }

    console.log('Calculated date range:', {
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      prevStartDate: format(prevStartDate, 'yyyy-MM-dd'),
      prevEndDate: format(prevEndDate, 'yyyy-MM-dd')
    });

    // Build where clause
    const where = {
      userId: session.user.id,
      deletedAt: null,
      date: {
        gte: startDate,
        lte: endDate,
      },
      ...(accountId && { accountId }),
      ...(walletId && { walletId }),
      ...(categoryId && { categoryId }),
    };

    // Build where clause for incoming transfers (when account is destination)
    const whereIncomingTransfers = accountId ? {
      userId: session.user.id,
      deletedAt: null,
      type: 'transfer',
      date: {
        gte: startDate,
        lte: endDate,
      },
      toAccountId: accountId,
      ...(categoryId && { categoryId }),
    } : null;

    // Get transactions for the period
    const transactions = await prisma.transaction.findMany({
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
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Get incoming transfers if accountId filter is applied
    let incomingTransfers = [];
    if (whereIncomingTransfers) {
      incomingTransfers = await prisma.transaction.findMany({
        where: whereIncomingTransfers,
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
    }

    // Get previous period transactions for comparison
    const prevWhere = {
      userId: session.user.id,
      deletedAt: null,
      date: {
        gte: prevStartDate,
        lte: prevEndDate,
      },
      ...(accountId && { accountId }),
      ...(walletId && { walletId }),
      ...(categoryId && { categoryId }),
    };

    // Build where clause for previous period incoming transfers
    const prevWhereIncomingTransfers = accountId ? {
      userId: session.user.id,
      deletedAt: null,
      type: 'transfer',
      date: {
        gte: prevStartDate,
        lte: prevEndDate,
      },
      toAccountId: accountId,
      ...(categoryId && { categoryId }),
    } : null;

    const prevTransactions = await prisma.transaction.findMany({
      where: prevWhere,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });

    // Get previous period incoming transfers
    let prevIncomingTransfers = [];
    if (prevWhereIncomingTransfers) {
      prevIncomingTransfers = await prisma.transaction.findMany({
        where: prevWhereIncomingTransfers,
      });
    }

    // Get all wallets for wallet report
    const wallets = await prisma.wallet.findMany({
      where: {
        account: {
          userId: session.user.id,
        },
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
      },
    });

    // Calculate summary
    const summary = {
      totalIncome: 0,
      totalExpense: 0,
      totalTransfer: 0,
      netIncome: 0,
      transactionCount: transactions.length,
      period: {
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        label: period === 'weekly' ? `${format(startDate, 'MMM dd')} - ${format(endDate, 'MMM dd, yyyy')}` :
               period === 'custom' ? `${format(startDate, 'MMM dd')} - ${format(endDate, 'MMM dd, yyyy')}` :
               format(startDate, 'MMMM yyyy'),
      },
      comparison: {
        income: { value: 0, percentage: 0, trend: 'neutral' },
        expense: { value: 0, percentage: 0, trend: 'neutral' },
        balance: { value: 0, percentage: 0, trend: 'neutral' },
      },
    };

    // Previous period summary
    const prevSummary = {
      totalIncome: 0,
      totalExpense: 0,
    };

    prevTransactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount);
      if (transaction.type === 'income') {
        prevSummary.totalIncome += amount;
      } else if (transaction.type === 'expense') {
        prevSummary.totalExpense += amount;
      } else if (transaction.type === 'transfer') {
        // For source account, transfer is counted as expense
        if (accountId && transaction.accountId === accountId) {
          prevSummary.totalExpense += amount;
        }
      }
    });

    // Add incoming transfers to previous period income
    prevIncomingTransfers.forEach(transaction => {
      const amount = parseFloat(transaction.amount);
      prevSummary.totalIncome += amount;
    });

    // Group transactions by category for chart data
    const categorySummary = {};
    const dailySummary = {};
    const walletSummary = {};
    const biggestTransactions = {
      income: [],
      expense: [],
    };

    transactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount);

      // Summary calculations
      if (transaction.type === 'income') {
        summary.totalIncome += amount;
        biggestTransactions.income.push(transaction);
      } else if (transaction.type === 'expense') {
        summary.totalExpense += amount;
        biggestTransactions.expense.push(transaction);
      } else if (transaction.type === 'transfer') {
        summary.totalTransfer += amount;
        // For source account/wallet, transfer is counted as expense
        if (accountId && transaction.accountId === accountId) {
          summary.totalExpense += amount;
          biggestTransactions.expense.push(transaction);
        }
      }

      // Category summary
      if (transaction.category) {
        const categoryKey = transaction.category.name;
        if (!categorySummary[categoryKey]) {
          categorySummary[categoryKey] = {
            name: categoryKey,
            type: transaction.category.type,
            total: 0,
            count: 0,
            color: getColorForCategory(categoryKey),
          };
        }
        categorySummary[categoryKey].total += amount;
        categorySummary[categoryKey].count += 1;
      }

      // Wallet summary
      if (transaction.wallet) {
        const walletKey = transaction.wallet.id;
        if (!walletSummary[walletKey]) {
          walletSummary[walletKey] = {
            id: walletKey,
            name: transaction.wallet.name,
            accountName: transaction.account?.name || 'N/A',
            inflow: 0,
            outflow: 0,
            net: 0,
            transactionCount: 0,
          };
        }

        if (transaction.type === 'income') {
          walletSummary[walletKey].inflow += amount;
        } else if (transaction.type === 'expense') {
          walletSummary[walletKey].outflow += amount;
        } else if (transaction.type === 'transfer') {
          // For transfer, source wallet has outflow
          walletSummary[walletKey].outflow += amount;
        }
        
        walletSummary[walletKey].net = walletSummary[walletKey].inflow - walletSummary[walletKey].outflow;
        walletSummary[walletKey].transactionCount += 1;
      }

      // Daily summary
      const dateKey = format(new Date(transaction.date), 'yyyy-MM-dd');
      if (!dailySummary[dateKey]) {
        dailySummary[dateKey] = {
          date: dateKey,
          income: 0,
          expense: 0,
          transfer: 0,
          net: 0,
        };
      }

      if (transaction.type === 'income') {
        dailySummary[dateKey].income += amount;
      } else if (transaction.type === 'expense') {
        dailySummary[dateKey].expense += amount;
      } else if (transaction.type === 'transfer') {
        dailySummary[dateKey].transfer += amount;
        // For source account, transfer counted as expense
        if (accountId && transaction.accountId === accountId) {
          dailySummary[dateKey].expense += amount;
        }
      }

      dailySummary[dateKey].net = dailySummary[dateKey].income - dailySummary[dateKey].expense;
    });

    // Process incoming transfers (when this account is destination)
    incomingTransfers.forEach(transaction => {
      const amount = parseFloat(transaction.amount);

      // Add as income for destination account
      summary.totalIncome += amount;
      biggestTransactions.income.push({
        ...transaction,
        // Mark this as incoming transfer for display purposes
        isIncomingTransfer: true,
      });

      // Add to wallet summary for destination wallet
      if (transaction.toWallet) {
        const walletKey = transaction.toWallet.id;
        if (!walletSummary[walletKey]) {
          // Find wallet info from wallets array
          const walletInfo = wallets.find(w => w.id === transaction.toWallet.id);
          walletSummary[walletKey] = {
            id: walletKey,
            name: transaction.toWallet.name,
            accountName: walletInfo?.account?.name || 'N/A',
            inflow: 0,
            outflow: 0,
            net: 0,
            transactionCount: 0,
          };
        }

        walletSummary[walletKey].inflow += amount;
        walletSummary[walletKey].net = walletSummary[walletKey].inflow - walletSummary[walletKey].outflow;
        walletSummary[walletKey].transactionCount += 1;
      }

      // Add to daily summary
      const dateKey = format(new Date(transaction.date), 'yyyy-MM-dd');
      if (!dailySummary[dateKey]) {
        dailySummary[dateKey] = {
          date: dateKey,
          income: 0,
          expense: 0,
          transfer: 0,
          net: 0,
        };
      }

      dailySummary[dateKey].income += amount;
      dailySummary[dateKey].net = dailySummary[dateKey].income - dailySummary[dateKey].expense;
    });

    summary.netIncome = summary.totalIncome - summary.totalExpense;

    // Calculate comparisons with previous period
    if (prevSummary.totalIncome > 0) {
      const incomeDiff = summary.totalIncome - prevSummary.totalIncome;
      summary.comparison.income.value = incomeDiff;
      summary.comparison.income.percentage = Math.round((incomeDiff / prevSummary.totalIncome) * 100);
      summary.comparison.income.trend = incomeDiff > 0 ? 'up' : incomeDiff < 0 ? 'down' : 'neutral';
    }

    if (prevSummary.totalExpense > 0) {
      const expenseDiff = summary.totalExpense - prevSummary.totalExpense;
      summary.comparison.expense.value = expenseDiff;
      summary.comparison.expense.percentage = Math.round((expenseDiff / prevSummary.totalExpense) * 100);
      summary.comparison.expense.trend = expenseDiff > 0 ? 'up' : expenseDiff < 0 ? 'down' : 'neutral';
    }

    const prevNetIncome = prevSummary.totalIncome - prevSummary.totalExpense;
    if (prevNetIncome !== 0) {
      const balanceDiff = summary.netIncome - prevNetIncome;
      summary.comparison.balance.value = balanceDiff;
      summary.comparison.balance.percentage = Math.round((balanceDiff / Math.abs(prevNetIncome)) * 100);
      summary.comparison.balance.trend = balanceDiff > 0 ? 'up' : balanceDiff < 0 ? 'down' : 'neutral';
    }

    // Sort and limit biggest transactions
    biggestTransactions.income = biggestTransactions.income
      .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
      .slice(0, 5);
    
    biggestTransactions.expense = biggestTransactions.expense
      .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
      .slice(0, 5);

    // Convert to arrays for frontend
    const categoryChartData = Object.values(categorySummary);
    const dailyChartData = Object.values(dailySummary).sort((a, b) => a.date.localeCompare(b.date));
    const walletChartData = Object.values(walletSummary).sort((a, b) => b.transactionCount - a.transactionCount);

    // Calculate category percentages
    const totalCategoryAmount = categoryChartData.reduce((sum, cat) => sum + cat.total, 0);
    categoryChartData.forEach(cat => {
      cat.percentage = totalCategoryAmount > 0 ? Math.round((cat.total / totalCategoryAmount) * 100) : 0;
    });

    // Calculate financial health indicators
    const savingsRate = summary.totalIncome > 0 
      ? Math.round((summary.netIncome / summary.totalIncome) * 100) 
      : 0;
    
    const expenseIncomeRatio = summary.totalIncome > 0 
      ? Math.round((summary.totalExpense / summary.totalIncome) * 100) 
      : 0;

    const daysInPeriod = differenceInDays(endDate, startDate) + 1;
    const dailyAverageSpending = daysInPeriod > 0 
      ? Math.round(summary.totalExpense / daysInPeriod) 
      : 0;

    const financialHealth = {
      savingsRate,
      expenseIncomeRatio,
      dailyAverageSpending,
      netCashFlow: summary.netIncome,
      spendingStability: calculateSpendingStability(dailyChartData),
    };

    return NextResponse.json({
      success: true,
      data: {
        transactions,
        summary,
        charts: {
          categoryData: categoryChartData,
          dailyData: dailyChartData,
          walletData: walletChartData,
        },
        biggestTransactions,
        financialHealth,
      },
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to assign colors to categories
function getColorForCategory(categoryName) {
  const colors = {
    'Food': '#FF6384',
    'Transport': '#36A2EB',
    'Shopping': '#FFCE56',
    'Bills': '#4BC0C0',
    'Entertainment': '#9966FF',
    'Health': '#FF9F40',
    'Education': '#FF6384',
    'Salary': '#4BC0C0',
    'Business': '#36A2EB',
    'Investment': '#9966FF',
    'Other': '#C9CBCF',
  };
  
  return colors[categoryName] || '#' + Math.floor(Math.random()*16777215).toString(16);
}

// Helper function to calculate spending stability
function calculateSpendingStability(dailyData) {
  if (dailyData.length < 2) return 100;
  
  const expenses = dailyData.map(d => d.expense).filter(e => e > 0);
  if (expenses.length === 0) return 100;
  
  const mean = expenses.reduce((sum, val) => sum + val, 0) / expenses.length;
  const variance = expenses.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / expenses.length;
  const stdDev = Math.sqrt(variance);
  
  const coefficientOfVariation = mean > 0 ? (stdDev / mean) * 100 : 0;
  
  // Lower CV = more stable (return inverse as percentage)
  return Math.max(0, Math.min(100, 100 - coefficientOfVariation));
}