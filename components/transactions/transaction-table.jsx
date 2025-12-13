'use client';

import { useState, useMemo } from 'react';
import { Edit2, Trash2, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LoadingState, EmptyState, SortableTableHead } from '@/components/common';
import { formatCurrency } from '@/lib/utils/numberFormat';
import { formatDate } from '@/lib/utils/dateFormat';
import { TransactionTypeBadge, getCategoryTypeColor } from './badge-transaction';


export function TransactionTable({
  transactions = [],
  onEdit,
  onDelete,
  loading = false,
  currentPage = 1,
  pageSize = 10,
  onSort,
}) {
  const [sortColumn, setSortColumn] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  // Sort transactions based on current sort settings
  const sortedTransactions = useMemo(() => {
    if (!transactions.length) return transactions;

    return [...transactions].sort((a, b) => {
      let aValue, bValue;

      // Handle nested properties (e.g., 'category.name', 'account.name')
      const getValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc?.[part], obj);
      };

      aValue = getValue(a, sortColumn);
      bValue = getValue(b, sortColumn);

      // Handle date comparison
      if (sortColumn === 'date') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      // Handle numeric comparison
      else if (sortColumn === 'amount') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }
      // Handle string comparison (case-insensitive)
      else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue || '').toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [transactions, sortColumn, sortDirection]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      // Toggle direction if same column
      const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      setSortDirection(newDirection);
    } else {
      // New column, default to desc
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">No</TableHead>
            <SortableTableHead
              column="date"
              label="Date"
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <SortableTableHead
              column="type"
              label="Type"
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <SortableTableHead
              column="category.name"
              label="Category"
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <SortableTableHead
              column="account.name"
              label="Account"
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <SortableTableHead
              column="wallet.name"
              label="Wallet"
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <SortableTableHead
              column="amount"
              label="Amount"
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
              className="text-right"
              align="right"
            />
            <TableHead>Note</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTransactions.map((transaction, index) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">
                {(currentPage - 1) * pageSize + index + 1}
              </TableCell>
              <TableCell>{formatDate(transaction.date)}</TableCell>
              <TableCell>
                <TransactionTypeBadge type={transaction.type} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getCategoryTypeColor(transaction.category.type)}`}></div>
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
                    className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Edit2 className="h-4 w-4" />
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
