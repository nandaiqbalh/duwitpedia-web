'use client';

import { Edit2, SearchX, Trash2 } from 'lucide-react';
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
import { LoadingState, EmptyState, ErrorState } from '@/components/common';
import { formatDateWIB } from '@/lib/utils';

export function CategoryTable({ categories, onEdit, onDelete, loading, currentPage = 1, itemsPerPage = 10 }) {
  if (loading) {
    return <LoadingState message="Loading categories..." />;
  }

  if (!categories || categories.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No categories found"
        description="Get started by creating your first category."
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
            <TableHead>Type</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category, index) => {
            const itemNumber = (currentPage - 1) * itemsPerPage + index + 1;
            return (
            <TableRow key={category.id}>
              <TableCell className="font-medium text-gray-600">{itemNumber}</TableCell>
              <TableCell>
                <div className="font-medium text-gray-900">{category.name}</div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={category.type === 'income' ? 'default' : 'secondary'}
                  className={
                    category.type === 'income'
                      ? 'bg-green-100 text-green-800 hover:bg-green-100'
                      : category.type === 'expense'
                        ? 'bg-red-100 text-red-800 hover:bg-red-100'
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                  }
                >
                  {category.type === 'income' ? 'Income' : category.type === 'expense' ? 'Expense' : 'Transfer'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm text-gray-600">
                  {formatDateWIB(category.createdAt)}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-gray-600">
                  {formatDateWIB(category.updatedAt)}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(category)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(category)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}