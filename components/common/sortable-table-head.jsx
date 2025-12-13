import { Button } from '@/components/ui/button';
import { TableHead } from '@/components/ui/table';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

/**
 * Sortable Table Head Component
 * @param {Object} props
 * @param {string} props.column - Column identifier
 * @param {string} props.label - Display label
 * @param {string} props.sortColumn - Current sort column
 * @param {string} props.sortDirection - Current sort direction ('asc' or 'desc')
 * @param {Function} props.onSort - Sort handler function
 * @param {string} props.className - Additional CSS classes for TableHead
 * @param {boolean} props.align - Text alignment ('left', 'right', 'center')
 * @returns {JSX.Element}
 */
export function SortableTableHead({ 
  column, 
  label, 
  sortColumn, 
  sortDirection, 
  onSort, 
  className = '',
  align = 'left'
}) {
  const getSortIcon = () => {
    if (sortColumn !== column) {
      return <ChevronsUpDown className="w-4 h-4 ml-1 opacity-50" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-4 h-4 ml-1" />
      : <ChevronDown className="w-4 h-4 ml-1" />;
  };

  const alignmentClass = {
    left: 'justify-start',
    right: 'justify-end',
    center: 'justify-center'
  }[align] || 'justify-start';

  return (
    <TableHead className={className}>
      <Button
        variant="ghost"
        onClick={() => onSort(column)}
        className={`h-auto p-0 font-semibold hover:bg-blue-50 hover:text-blue-700 ${alignmentClass} flex items-center`}
      >
        {label}
        {getSortIcon()}
      </Button>
    </TableHead>
  );
}

/**
 * Hook for sortable table state management
 * @param {Array} data - Array of data to sort
 * @param {string} defaultColumn - Default sort column
 * @param {string} defaultDirection - Default sort direction ('asc' or 'desc')
 * @returns {Object} Sort state and handlers
 */
export function useSortableTable(data, defaultColumn = 'date', defaultDirection = 'desc') {
  const { useState, useMemo } = require('react');
  const [sortColumn, setSortColumn] = useState(defaultColumn);
  const [sortDirection, setSortDirection] = useState(defaultDirection);

  const handleSort = (column) => {
    if (sortColumn === column) {
      // Toggle direction if same column
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default to desc
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const sortedData = useMemo(() => {
    if (!data?.length) return data;

    return [...data].sort((a, b) => {
      const getValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc?.[part], obj);
      };

      let aValue = getValue(a, sortColumn);
      let bValue = getValue(b, sortColumn);

      // Handle date comparison
      if (sortColumn === 'date' || sortColumn.includes('Date')) {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Handle numeric comparison
      if (typeof aValue === 'number' || sortColumn === 'amount') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }

      // Handle string comparison (case-insensitive)
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
      }
      if (typeof bValue === 'string') {
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  return {
    sortColumn,
    sortDirection,
    sortedData,
    handleSort,
  };
}
