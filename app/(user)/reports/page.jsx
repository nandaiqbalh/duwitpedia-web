'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BarChart3, PieChart, Wallet, Activity, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader, ErrorState } from '@/components/common';
import {
  ReportFilters,
  ReportSummary,
  ReportCharts,
  WalletReport,
  CategoryInsights,
  FinancialHealth
} from '@/components/reports';
import { useReports } from '@/lib/hooks/useReport';
import { useAccounts } from '@/lib/hooks/useAccount';
import { useWallets } from '@/lib/hooks/useWallet';
import { useCategories } from '@/lib/hooks/useCategory';
import { format } from 'date-fns';
import { ReportTable } from '@/components/reports/report-table/report-table';

export default function ReportsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Initialize filters from URL params
  const [filters, setFilters] = useState({
    period: searchParams.get('period') || 'monthly',
    month: searchParams.get('month') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    accountId: searchParams.get('accountId') || '',
    walletId: searchParams.get('walletId') || '',
    categoryId: searchParams.get('categoryId') || '',
  });

  const { reportData, loading, error, updateFilters, refetch } = useReports(filters);

  const { accounts, loading: accountsLoading } = useAccounts();
  const { wallets, loading: walletsLoading } = useWallets();
  const { categories, loading: categoriesLoading } = useCategories();

  // Function to update URL params
  const updateURL = (params) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    // Update or remove params
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== '') {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });

    router.replace(`?${newSearchParams.toString()}`, { scroll: false });
  };

  // Sync state with URL params when URL changes
  useEffect(() => {
    setFilters({
      period: searchParams.get('period') || 'monthly',
      month: searchParams.get('month') || '',
      startDate: searchParams.get('startDate') || '',
      endDate: searchParams.get('endDate') || '',
      accountId: searchParams.get('accountId') || '',
      walletId: searchParams.get('walletId') || '',
      categoryId: searchParams.get('categoryId') || '',
    });
  }, [searchParams]);

  const handleFilterChange = (filterType, value) => {
    const apiValue = value === 'all' ? '' : value;

    const updates = {
      [filterType]: apiValue,
    };

    if (filterType === 'period') {
      if (value === 'custom') {
        updates.month = format(new Date(), 'yyyy-MM');
        updates.startDate = '';
        updates.endDate = '';
      } else {
        updates.month = '';
        updates.startDate = '';
        updates.endDate = '';
      }
    }

    // Update local state
    setFilters(prev => ({ ...prev, ...updates }));
    
    // Update URL params
    updateURL(updates);
    
    // Update API filters
    updateFilters(updates);
  };

  const { summary, charts, transactions, biggestTransactions, financialHealth } = reportData;

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mt-12 lg:mt-0">
          <PageHeader
            title="Financial Reports"
            description="View your financial summary and analyze spending patterns"
            icon={BarChart3}
            breadcrumbs={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Reports' },
            ]}
          />
        </div>
        <ErrorState
          message={error}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">

      <PageHeader
        title="Financial Reports"
        description="Analyze your financial activity with visual insights"
        icon={BarChart3}
        infoContent={
          <div className="space-y-3">
            <p>
              Financial Reports give you a clear and comprehensive view of your financial
              behavior. They help you understand income, expenses, spending patterns, and
              overall financial health across all your accounts and wallets.
            </p>

            <p>
              You can filter reports by period, account, wallet, and category to explore
              detailed insights. These reports help you identify trends, track progress,
              and make better financial decisions.
            </p>

            <p>
              This page provides several types of insights:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Overview</strong> — a high-level snapshot of your income, expense,
                net balance, and biggest transactions.
              </li>
              <li>
                <strong>Charts</strong> — visual trends such as monthly income vs expense,
                spending distribution, and category comparison.
              </li>
              <li>
                <strong>Category Insights</strong> — breakdown of where your money is spent
                the most, category totals, and spending patterns.
              </li>
              <li>
                <strong>Wallet Reports</strong> — performance of each wallet, how much
                money flows in/out, and which wallets dominate your spending.
              </li>
              <li>
                <strong>Financial Health</strong> — indicators like savings rate, spending
                ratio, and balance strength to help you measure financial stability.
              </li>
            </ul>

            <p>
              By understanding these insights, you can plan your finances more effectively,
              control spending, and improve your long-term financial habits.
            </p>
          </div>
        }
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Reports' },
        ]}
      />


      <ReportFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        accounts={accounts || []}
        wallets={wallets || []}
        categories={categories || []}
        loading={loading || accountsLoading || walletsLoading || categoriesLoading}
      />

      <ReportSummary
        summary={summary}
        loading={loading}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full md:w-auto bg-blue-50 border border-blue-200">
          <TabsTrigger value="overview" className="flex items-center gap-2 px-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700 hover:bg-blue-100">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden md:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-2 px-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700 hover:bg-blue-100">
            <Activity className="w-4 h-4" />
            <span className="hidden md:inline">Health</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2 px-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700 hover:bg-blue-100">
            <PieChart className="w-4 h-4" />
            <span className="hidden md:inline">Categories</span>
          </TabsTrigger>
          <TabsTrigger value="wallets" className="flex items-center gap-2 px-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-700 hover:bg-blue-100">
            <Wallet className="w-4 h-4" />
            <span className="hidden md:inline">Wallets</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <ReportCharts
            charts={charts}
            loading={loading}
          />
          <ReportTable
            transactions={transactions}
            biggestTransactions={biggestTransactions}
            loading={loading}
          />
        </TabsContent>

          <TabsContent value="health" className="space-y-6">
          <FinancialHealth
            financialHealth={financialHealth}
            summary={summary}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <CategoryInsights
            categoryData={charts.categoryData}
            summary={summary}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="wallets" className="space-y-6">
          <WalletReport
            walletData={charts.walletData}
            loading={loading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
