"use client";

import { useSession } from "next-auth/react";
import { LayoutDashboard } from "lucide-react";
import { useDashboard } from "@/lib/hooks/useDashboard";
import { PageHeader, ErrorState } from "@/components/common";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { DashboardInsights } from "@/components/dashboard/dashboard-insights";
import { DashboardQuickActions } from "@/components/dashboard/dashboard-quick-actions";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import {
  DashboardStatsSkeleton,
  DashboardInsightsSkeleton,
  RecentTransactionsSkeleton
} from "@/components/dashboard/dashboard-skeleton";

export default function UserDashboard() {
  const { data: session } = useSession();
  const { dashboardData, isLoading, error, refetch } = useDashboard();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const { stats, insights, recentTransactions } = dashboardData || {};

  return (
    <div className="max-w-7xl mx-auto">

      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${session?.user?.name || "User"}!`}
        icon={LayoutDashboard}
        infoContent={
          <div className="space-y-2">
            <p>Your dashboard provides a quick overview of your financial status.</p>
            <p>Track your income, expenses, and view recent transactions at a glance.</p>
          </div>
        }
      />

      {/* Error State */}
      {error && (
        <div className="mb-6">
          <ErrorState
            message="Failed to load dashboard data"
            onRetry={refetch}
          />
        </div>
      )}

      {/* Stats Cards */}
      {isLoading ? (
        <DashboardStatsSkeleton />
      ) : stats ? (
        <DashboardStats stats={stats} formatCurrency={formatCurrency} />
      ) : null}

      {/* Quick Actions */}
      <DashboardQuickActions />

      {/* Insights */}
      {isLoading ? (
        <DashboardInsightsSkeleton />
      ) : insights ? (
        <DashboardInsights insights={insights} formatCurrency={formatCurrency} />
      ) : null}

      {/* Recent Transactions */}
      {isLoading ? (
        <RecentTransactionsSkeleton />
      ) : recentTransactions ? (
        <RecentTransactions
          transactions={recentTransactions}
          formatCurrency={formatCurrency}
        />
      ) : null}
    </div>
  );
}

