'use client';

import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from './utils';
import { EmptyState } from '@/components/common';
import { useWalletInsights } from '@/lib/hooks/useReport';

export function WalletReport({ walletData, loading = false }) {
  const { mostActiveWallet, largestOutflowWallet, largestInflowWallet } = useWalletInsights(walletData);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </Card>
    );
  }

  if (!walletData || walletData.length === 0) {
    return (
      <EmptyState
        icon={Wallet}
        title="No Wallet Data"
        description="No wallet activity data is available for the selected period."
        className="bg-white rounded-lg shadow"
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Wallet Report</h3>
        </div>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-700 mb-1">Most Active Wallet</p>
            <p className="font-semibold text-blue-900">{mostActiveWallet?.name}</p>
            <p className="text-xs text-blue-600 mt-1">
              {mostActiveWallet?.transactionCount} transactions
            </p>
          </div>
          <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
            <p className="text-sm text-orange-700 mb-1">Largest Outflow</p>
            <p className="font-semibold text-orange-900">{largestOutflowWallet?.name}</p>
            <p className="text-xs text-orange-600 mt-1">
              {formatCurrency(largestOutflowWallet?.outflow || 0)}
            </p>
          </div>
        </div>

        {/* Wallet Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Wallet</TableHead>
                <TableHead>Account</TableHead>
                <TableHead className="text-right">Inflow</TableHead>
                <TableHead className="text-right">Outflow</TableHead>
                <TableHead className="text-right">Net</TableHead>
                <TableHead className="text-center">Transactions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {walletData.map((wallet) => (
                <TableRow key={wallet.id}>
                  <TableCell>
                    <div className="font-medium text-gray-900">{wallet.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">{wallet.accountName}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="text-green-600 font-medium">
                      {formatCurrency(wallet.inflow)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="text-red-600 font-medium">
                      {formatCurrency(wallet.outflow)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={`font-semibold ${
                      wallet.net >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(wallet.net)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="text-gray-900 font-medium">
                      {wallet.transactionCount}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
