'use client';

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
import { LoadingState, EmptyState, ErrorState } from '@/components/common';
import { formatDateWIB } from '@/lib/utils';

export function WalletTable({ wallets, onEdit, onDelete, loading }) {
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
            <TableHead>Name</TableHead>
            <TableHead>Account</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {wallets.map((wallet, index) => (
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
