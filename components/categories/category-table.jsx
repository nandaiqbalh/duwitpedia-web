'use client';

import { useState, useMemo } from 'react';
import { Edit2, SearchX, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LoadingState, EmptyState, ErrorState, SortableTableHead } from '@/components/common';
import { formatDateWIB } from '@/lib/utils';
import { TransactionTypeBadge } from '@/components/transactions/badge-transaction';

export function CategoryTable({ categories, onEdit, onDelete, loading, currentPage = 1, itemsPerPage = 10 }) {
  const [sortColumn, setSortColumn] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  // Sort categories
  const sortedCategories = useMemo(() => {
    if (!categories?.length) return categories;

    return [...categories].sort((a, b) => {
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
      // Handle string comparison (case-insensitive)
      else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue || '').toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [categories, sortColumn, sortDirection]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };
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
            <SortableTableHead
              column="name"
              label="Name"
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
          {sortedCategories.map((category, index) => {
            const itemNumber = (currentPage - 1) * itemsPerPage + index + 1;
            return (
            <TableRow key={category.id}>
              <TableCell className="font-medium text-gray-600">{itemNumber}</TableCell>
              <TableCell>
                <div className="font-medium text-gray-900">{category.name}</div>
              </TableCell>
              <TableCell>
                <TransactionTypeBadge type={category.type} />
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