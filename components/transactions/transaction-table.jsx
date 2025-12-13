'use client';

import { Edit, Trash2, ArrowUpCircle, ArrowDownCircle, ArrowRightLeft, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LoadingState, EmptyState } from '@/components/common';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

export function TransactionTable({
  transactions = [],
  onEdit,
  onDelete,
  loading = false,
  currentPage = 1,
  pageSize = 10,
}) {
  if (loading) {
    return <LoadingState message="Loading transactions..." />;
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={Wallet}
        title="No transactions found"
        description="Start tracking your finances by creating your first transaction."
      />
    );
  }

  const formatCurrency = (amount, currency = 'IDR') => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    return format(new Date(date), 'dd MMM yyyy', { locale: idLocale });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'income':
        return <ArrowUpCircle className="w-4 h-4" />;
      case 'expense':
        return <ArrowDownCircle className="w-4 h-4" />;
      case 'transfer':
        return <ArrowRightLeft className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getTypeBadgeVariant = (type) => {
    switch (type) {
      case 'income':
        return 'default';
      case 'expense':
        return 'destructive';
      case 'transfer':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'income':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'expense':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'transfer':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default:
        return '';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">No</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Wallet</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Note</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction, index) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">
                {(currentPage - 1) * pageSize + index + 1}
              </TableCell>
              <TableCell>{formatDate(transaction.date)}</TableCell>
              <TableCell>
                <Badge className={`gap-1 ${getTypeBadgeClass(transaction.type)}`}>
                  {getTypeIcon(transaction.type)}
                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${transaction.category.type === 'income' ? 'bg-green-500' : transaction.category.type === 'expense' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                  {transaction.category.name}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{transaction.account.name}</span>
                  <span className="text-xs text-gray-500">{transaction.account.currency}</span>
                </div>
              </TableCell>
              <TableCell>
                {transaction.wallet ? (
                  transaction.type === 'transfer' && transaction.toWallet ? (
                    <div className="flex items-center gap-1 text-sm">
                      <span>{transaction.wallet.name}</span>
                      <span className="text-blue-600">→</span>
                      <span>{transaction.toWallet.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm">{transaction.wallet.name}</span>
                  )
                ) : (
                  <span className="text-sm text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col items-end gap-1">
                  <span className={`font-semibold ${
                    transaction.type === 'income' 
                      ? 'text-green-600' 
                      : transaction.type === 'expense'
                      ? 'text-red-600'
                      : 'text-blue-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
                    {formatCurrency(transaction.amount, transaction.account.currency)}
                  </span>
                  {transaction.adminFeeChild && transaction.adminFeeChild.length > 0 && (
                    <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                      +{formatCurrency(transaction.adminFeeChild[0].amount, transaction.account.currency)} admin fee
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {transaction.note ? (
                  <span className="text-sm text-gray-600 line-clamp-2">
                    {transaction.note}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(transaction)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(transaction)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
