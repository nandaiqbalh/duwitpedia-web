'use client';

import { useState, useMemo } from 'react';
import { Edit2, SearchX, Trash2, Wallet } from 'lucide-react';
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
import { formatDateWIB } from '@/lib/utils';

export function WalletTable({ wallets, onEdit, onDelete, loading }) {
  const [sortColumn, setSortColumn] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  // Sort wallets
  const sortedWallets = useMemo(() => {
    if (!wallets?.length) return wallets;

    return [...wallets].sort((a, b) => {
      const getValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc?.[part], obj);
      };

      let aValue = getValue(a, sortColumn);
      let bValue = getValue(b, sortColumn);

      // Handle date comparison
      if (sortColumn.includes('At')) {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      // Handle numeric comparison (balance)
      else if (sortColumn === 'balance') {
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
  }, [wallets, sortColumn, sortDirection]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };
  if (loading) {
    return <LoadingState message="Loading wallets..." />;
  }

  if (!wallets || wallets.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No wallets found"
        description="Get started by creating your first wallet."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">No</TableHead>
            <SortableTableHead
              column="name"
              label="Name"
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
              column="balance"
              label="Balance"
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
              className="text-right"
              align="right"
            />
            <SortableTableHead
              column="createdAt"
              label="Created"
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <SortableTableHead
              column="updatedAt"
              label="Updated"
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <TableHead className="text-right w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedWallets.map((wallet, index) => (
            <TableRow key={wallet.id}>
              <TableCell className="font-medium text-gray-600">{index + 1}</TableCell>
              <TableCell>
                <div className="font-medium text-gray-900">{wallet.name}</div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-gray-600">
                  {wallet.account?.name || 'N/A'}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className={`font-semibold ${
                  parseFloat(wallet.balance) >= 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  Rp {parseFloat(wallet.balance).toLocaleString('id-ID', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-gray-600">
                  {formatDateWIB(wallet.createdAt)}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-gray-600">
                  {formatDateWIB(wallet.updatedAt)}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(wallet)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(wallet)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
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
