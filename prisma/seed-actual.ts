import { config } from 'dotenv';
import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';

// Load environment variables
config({ path: '.env.local' });

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  allowExitOnIdle: true,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seeding...');

  // Delete existing data for demo user if exists
  const existingUser = await prisma.user.findUnique({
    where: { email: 'demo@duwitpedia.com' },
  });

  if (existingUser) {
    console.log('🗑️ Deleting existing data for demo user...');
    await prisma.transaction.deleteMany({ where: { userId: existingUser.id } });
    await prisma.wallet.deleteMany({ where: { userId: existingUser.id } });
    await prisma.category.deleteMany({ where: { userId: existingUser.id } });
    await prisma.account.deleteMany({ where: { userId: existingUser.id } });
    if (existingUser.subscriptionId) {
      await prisma.subscription.delete({ where: { id: existingUser.subscriptionId } });
    }
    await prisma.user.delete({ where: { id: existingUser.id } });
    console.log('✅ Existing data deleted');
  }

  // 1. Create or get demo user
  console.log('📧 Checking for demo user...');
  let demoUser = await prisma.user.findUnique({
    where: { email: 'demo@duwitpedia.com' },
  });

  if (!demoUser) {
    console.log('👤 Creating demo user...');
    const hashedPassword = await bcrypt.hash('gloryglory-man-united', 10);
    
    demoUser = await prisma.user.create({
      data: {
        email: 'demo@duwitpedia.com',
        name: 'Demo User',
        password: hashedPassword,
        emailVerified: new Date(),
        role: 'USER',
        subscription: {
          create: {
            subscriptionStatus: 'PRO',
            approvalStatus: 'ACTIVE',
            subscriptionStart: new Date(),
            subscriptionEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
        },
      },
    });
    console.log('✅ Demo user created');
  } else {
    console.log('✅ Demo user already exists');
  }

  const userId = demoUser.id;

  // 2. Create Accounts
  console.log('🏦 Creating accounts...');
  const personalAccount = await prisma.account.create({
    data: {
      userId,
      name: 'Personal Account',
      currency: 'IDR',
      balance: 0,
    },
  });

  const businessAccount = await prisma.account.create({
    data: {
      userId,
      name: 'Business Account',
      currency: 'IDR',
      balance: 0,
    },
  });

  const savingsAccount = await prisma.account.create({
    data: {
      userId,
      name: 'Savings & Investment',
      currency: 'IDR',
      balance: 0,
    },
  });
  console.log('✅ Accounts created');

  // 3. Create Wallets
  console.log('💳 Creating wallets...');
  const personalWallets = {
    cash: await prisma.wallet.create({
      data: {
        userId,
        accountId: personalAccount.id,
        name: 'Cash',
        balance: 0,
      },
    }),
    bankBCA: await prisma.wallet.create({
      data: {
        userId,
        accountId: personalAccount.id,
        name: 'Bank BCA',
        balance: 0,
      },
    }),
    bankBNI: await prisma.wallet.create({
      data: {
        userId,
        accountId: personalAccount.id,
        name: 'Bank BNI',
        balance: 0,
      },
    }),
    ewallet: await prisma.wallet.create({
      data: {
        userId,
        accountId: personalAccount.id,
        name: 'GoPay',
        balance: 0,
      },
    }),
  };

  const businessWallets = {
    cash: await prisma.wallet.create({
      data: {
        userId,
        accountId: businessAccount.id,
        name: 'Business Cash',
        balance: 0,
      },
    }),
    bank: await prisma.wallet.create({
      data: {
        userId,
        accountId: businessAccount.id,
        name: 'Business Bank',
        balance: 0,
      },
    }),
    ewallet: await prisma.wallet.create({
      data: {
        userId,
        accountId: businessAccount.id,
        name: 'Business Ewallet',
        balance: 0,
      },
    }),
  };

  const savingsWallets = {
    bibit: await prisma.wallet.create({
      data: {
        userId,
        accountId: savingsAccount.id,
        name: 'Bibit',
        balance: 0,
      },
    }),
    reksadana: await prisma.wallet.create({
      data: {
        userId,
        accountId: savingsAccount.id,
        name: 'Reksadana',
        balance: 0,
      },
    }),
  };
  console.log('✅ Wallets created');

  // 4. Create Categories
  console.log('📁 Creating categories...');
  
  // Income Categories
  const salaryCategory = await prisma.category.create({
    data: { userId, name: 'Salary', type: 'income' },
  });
  const freelanceCategory = await prisma.category.create({
    data: { userId, name: 'Freelance', type: 'income' },
  });
  const investmentCategory = await prisma.category.create({
    data: { userId, name: 'Investment', type: 'income' },
  });

  // Expense Categories
  const foodCategory = await prisma.category.create({
    data: { userId, name: 'Food & Dining', type: 'expense' },
  });
  const transportCategory = await prisma.category.create({
    data: { userId, name: 'Transportation', type: 'expense' },
  });
  const shoppingCategory = await prisma.category.create({
    data: { userId, name: 'Shopping', type: 'expense' },
  });
  const entertainmentCategory = await prisma.category.create({
    data: { userId, name: 'Entertainment', type: 'expense' },
  });
  const utilitiesCategory = await prisma.category.create({
    data: { userId, name: 'Utilities', type: 'expense' },
  });
  const healthCategory = await prisma.category.create({
    data: { userId, name: 'Health', type: 'expense' },
  });
  const educationCategory = await prisma.category.create({
    data: { userId, name: 'Education', type: 'expense' },
  });

  // Transfer Category
  const transferCategory = await prisma.category.create({
    data: { userId, name: 'Transfer', type: 'transfer' },
  });
  
  console.log('✅ Categories created');

  // 5. Create Transactions for 2 months
  console.log('💸 Creating transactions...');
  
  const now = new Date();
  const transactions = [];

  // Helper function to create transaction
  const addTransaction = (type: string, amount: number, categoryId: string, accountId: string, walletId: string, toAccountId: string | null, toWalletId: string | null, note: string, daysAgo: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    
    transactions.push({
      userId,
      accountId,
      walletId,
      toWalletId: toWalletId || null,
      toAccountId: toAccountId || null,
      categoryId,
      type: type as any,
      amount,
      note,
      date,
    });
  };

  // Month 1 (30-60 days ago) - November
  addTransaction('income', 8000000, salaryCategory.id, personalAccount.id, personalWallets.bankBCA.id, null, null, 'Monthly Salary - November', 60);
  addTransaction('expense', 50000, foodCategory.id, personalAccount.id, personalWallets.cash.id, null, null, 'Breakfast at cafe', 59);
  addTransaction('expense', 35000, transportCategory.id, personalAccount.id, personalWallets.ewallet.id, null, null, 'Grab ride', 59);
  addTransaction('expense', 150000, shoppingCategory.id, personalAccount.id, personalWallets.bankBCA.id, null, null, 'Groceries', 58);
  addTransaction('expense', 75000, foodCategory.id, personalAccount.id, personalWallets.cash.id, null, null, 'Lunch', 57);
  addTransaction('transfer', 500000, transferCategory.id, personalAccount.id, personalWallets.bankBCA.id, personalAccount.id, personalWallets.cash.id, 'Cash withdrawal', 57);
  addTransaction('expense', 45000, entertainmentCategory.id, personalAccount.id, personalWallets.ewallet.id, null, null, 'Movie', 56);
  addTransaction('income', 1500000, freelanceCategory.id, businessAccount.id, businessWallets.bank.id, null, null, 'Freelance project', 54);
  addTransaction('expense', 200000, utilitiesCategory.id, personalAccount.id, personalWallets.bankBCA.id, null, null, 'Electricity', 53);
  addTransaction('expense', 85000, foodCategory.id, personalAccount.id, personalWallets.cash.id, null, null, 'Dinner', 52);
  addTransaction('expense', 120000, healthCategory.id, personalAccount.id, personalWallets.cash.id, null, null, 'Doctor', 51);
  addTransaction('expense', 40000, transportCategory.id, personalAccount.id, personalWallets.ewallet.id, null, null, 'Ojek', 50);
  addTransaction('expense', 300000, shoppingCategory.id, personalAccount.id, personalWallets.bankBCA.id, null, null, 'Shoes', 49);
  addTransaction('expense', 65000, foodCategory.id, personalAccount.id, personalWallets.cash.id, null, null, 'Coffee', 48);
  addTransaction('expense', 150000, entertainmentCategory.id, personalAccount.id, personalWallets.bankBCA.id, null, null, 'Concert', 47);
  addTransaction('expense', 55000, transportCategory.id, personalAccount.id, personalWallets.ewallet.id, null, null, 'Taxi', 46);
  addTransaction('expense', 500000, educationCategory.id, personalAccount.id, personalWallets.bankBCA.id, null, null, 'Course', 45);
  addTransaction('transfer', 300000, transferCategory.id, personalAccount.id, personalWallets.bankBCA.id, personalAccount.id, personalWallets.ewallet.id, 'Top up', 44);
  addTransaction('expense', 90000, foodCategory.id, personalAccount.id, personalWallets.ewallet.id, null, null, 'Delivery', 43);
  addTransaction('expense', 180000, utilitiesCategory.id, personalAccount.id, personalWallets.bankBCA.id, null, null, 'Internet', 42);
  addTransaction('expense', 250000, shoppingCategory.id, personalAccount.id, personalWallets.bankBCA.id, null, null, 'Clothing', 41);
  addTransaction('income', 500000, investmentCategory.id, savingsAccount.id, savingsWallets.bibit.id, null, null, 'Dividend', 40);
  addTransaction('expense', 70000, foodCategory.id, personalAccount.id, personalWallets.cash.id, null, null, 'Brunch', 39);
  addTransaction('expense', 45000, transportCategory.id, personalAccount.id, personalWallets.ewallet.id, null, null, 'Bus', 38);
  addTransaction('expense', 135000, entertainmentCategory.id, personalAccount.id, personalWallets.ewallet.id, null, null, 'Games', 37);
  addTransaction('expense', 95000, foodCategory.id, personalAccount.id, personalWallets.cash.id, null, null, 'Dinner', 36);
  addTransaction('expense', 200000, healthCategory.id, personalAccount.id, personalWallets.bankBCA.id, null, null, 'Pharmacy', 35);
  addTransaction('transfer', 1000000, transferCategory.id, personalAccount.id, personalWallets.bankBCA.id, personalAccount.id, personalWallets.cash.id, 'Cash', 34);
  addTransaction('expense', 400000, shoppingCategory.id, personalAccount.id, personalWallets.bankBCA.id, null, null, 'Electronics', 33);

  // Month 2 (0-30 days ago) - December
  addTransaction('income', 8000000, salaryCategory.id, personalAccount.id, personalWallets.bankBCA.id, null, null, 'Monthly Salary - December', 30);
  addTransaction('expense', 55000, foodCategory.id, personalAccount.id, personalWallets.cash.id, null, null, 'Breakfast', 29);
  addTransaction('expense', 40000, transportCategory.id, personalAccount.id, personalWallets.ewallet.id, null, null, 'Commute', 29);
  addTransaction('expense', 175000, shoppingCategory.id, personalAccount.id, personalWallets.bankBCA.id, null, null, 'Groceries', 28);
  addTransaction('expense', 80000, foodCategory.id, personalAccount.id, personalWallets.cash.id, null, null, 'Lunch', 27);
  addTransaction('transfer', 600000, transferCategory.id, personalAccount.id, personalWallets.bankBCA.id, personalAccount.id, personalWallets.cash.id, 'ATM', 27);
  addTransaction('expense', 120000, entertainmentCategory.id, personalAccount.id, personalWallets.bankBCA.id, null, null, 'Streaming', 26);
  addTransaction('income', 2000000, freelanceCategory.id, businessAccount.id, businessWallets.bank.id, null, null, 'App project', 24);
  addTransaction('expense', 220000, utilitiesCategory.id, personalAccount.id, personalWallets.bankBCA.id, null, null, 'Water & electricity', 23);
  addTransaction('expense', 95000, foodCategory.id, personalAccount.id, personalWallets.ewallet.id, null, null, 'Delivery', 22);
  addTransaction('expense', 150000, healthCategory.id, personalAccount.id, personalWallets.bankBCA.id, null, null, 'Checkup', 21);
  addTransaction('expense', 35000, transportCategory.id, personalAccount.id, personalWallets.ewallet.id, null, null, 'Bus', 20);
  addTransaction('expense', 450000, shoppingCategory.id, personalAccount.id, personalWallets.bankBCA.id, null, null, 'Jacket', 19);
  addTransaction('expense', 70000, foodCategory.id, personalAccount.id, personalWallets.cash.id, null, null, 'Cafe', 18);
  addTransaction('expense', 200000, entertainmentCategory.id, personalAccount.id, personalWallets.bankBCA.id, null, null, 'Hangout', 17);
  addTransaction('expense', 60000, transportCategory.id, personalAccount.id, personalWallets.ewallet.id, null, null, 'Ride', 16);
  addTransaction('expense', 300000, educationCategory.id, personalAccount.id, personalWallets.bankBCA.id, null, null, 'Books', 15);
  addTransaction('transfer', 400000, transferCategory.id, personalAccount.id, personalWallets.bankBCA.id, personalAccount.id, personalWallets.ewallet.id, 'Top up', 14);
  addTransaction('expense', 85000, foodCategory.id, personalAccount.id, personalWallets.ewallet.id, null, null, 'Dinner', 13);
  addTransaction('expense', 125000, shoppingCategory.id, personalAccount.id, personalWallets.cash.id, null, null, 'Personal care', 12);
  addTransaction('expense', 190000, utilitiesCategory.id, personalAccount.id, personalWallets.bankBCA.id, null, null, 'Phone', 11);
  addTransaction('expense', 350000, shoppingCategory.id, personalAccount.id, personalWallets.bankBCA.id, null, null, 'Shopping', 10);
  addTransaction('income', 750000, investmentCategory.id, savingsAccount.id, savingsWallets.bibit.id, null, null, 'Investment', 9);
  addTransaction('expense', 65000, foodCategory.id, personalAccount.id, personalWallets.cash.id, null, null, 'Coffee', 8);
  addTransaction('expense', 50000, transportCategory.id, personalAccount.id, personalWallets.ewallet.id, null, null, 'Parking', 7);
  addTransaction('expense', 145000, entertainmentCategory.id, personalAccount.id, personalWallets.ewallet.id, null, null, 'Music app', 6);
  addTransaction('expense', 110000, foodCategory.id, personalAccount.id, personalWallets.cash.id, null, null, 'Restaurant', 5);
  addTransaction('expense', 180000, healthCategory.id, personalAccount.id, personalWallets.bankBCA.id, null, null, 'Vitamins', 4);
  addTransaction('transfer', 800000, transferCategory.id, personalAccount.id, personalWallets.bankBCA.id, personalAccount.id, personalWallets.cash.id, 'Holiday cash', 3);
  addTransaction('expense', 275000, entertainmentCategory.id, personalAccount.id, personalWallets.bankBCA.id, null, null, 'Football', 2);
  addTransaction('expense', 90000, foodCategory.id, personalAccount.id, personalWallets.ewallet.id, null, null, 'Dinner', 1);
  addTransaction('expense', 55000, transportCategory.id, personalAccount.id, personalWallets.ewallet.id, null, null, 'Ride', 1);
  addTransaction('income', 10000000, freelanceCategory.id, businessAccount.id, businessWallets.bank.id, null, null, 'App project', 1);

  // Insert all transactions
  for (const transaction of transactions) {
    await prisma.transaction.create({ data: transaction });
  }
  
  console.log(`✅ ${transactions.length} transactions created`);

  // 6. Update wallet balances
  console.log('💰 Calculating balances...');
  
  const allWallets = [personalWallets.cash, personalWallets.bankBCA, personalWallets.bankBNI, personalWallets.ewallet, businessWallets.cash, businessWallets.bank, businessWallets.ewallet, savingsWallets.bibit, savingsWallets.reksadana];
  
  for (const wallet of allWallets) {
    const incomeResult = await prisma.transaction.aggregate({
      where: { walletId: wallet.id, type: 'income', deletedAt: null },
      _sum: { amount: true },
    });

    const expenseResult = await prisma.transaction.aggregate({
      where: { walletId: wallet.id, type: 'expense', deletedAt: null },
      _sum: { amount: true },
    });

    const transferOutResult = await prisma.transaction.aggregate({
      where: { walletId: wallet.id, type: 'transfer', deletedAt: null },
      _sum: { amount: true },
    });

    const transferInResult = await prisma.transaction.aggregate({
      where: { toWalletId: wallet.id, type: 'transfer', deletedAt: null },
      _sum: { amount: true },
    });

    const income = Number(incomeResult._sum.amount || 0);
    const expense = Number(expenseResult._sum.amount || 0);
    const transferOut = Number(transferOutResult._sum.amount || 0);
    const transferIn = Number(transferInResult._sum.amount || 0);

    const balance = income - expense - transferOut + transferIn;

    await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance },
    });

    console.log(`  - ${wallet.name}: Rp ${balance.toLocaleString('id-ID')}`);
  }

  // 7. Update account balances
  console.log('🏦 Calculating account balances...');
  const accounts = [personalAccount, businessAccount, savingsAccount];
  
  for (const account of accounts) {
    const accountBalance = await prisma.wallet.aggregate({
      where: { accountId: account.id, deletedAt: null },
      _sum: { balance: true },
    });

    await prisma.account.update({
      where: { id: account.id },
      data: { balance: accountBalance._sum.balance || 0 },
    });

    console.log(`  - ${account.name}: Rp ${Number(accountBalance._sum.balance || 0).toLocaleString('id-ID')}`);
  }
  
  console.log('\n✅ Seeding completed!');
  console.log('\n📊 Summary:');
  console.log(`  - Email: demo@duwitpedia.com`);
  console.log(`  - Password: gloryglory-man-united`);
  console.log(`  - Accounts: 3`);
  console.log(`  - Wallets: 9`);
  console.log(`  - Categories: 11`);
  console.log(`  - Transactions: ${transactions.length} (2 months)`);
  
  await prisma.$disconnect();
  await pool.end();
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  });
