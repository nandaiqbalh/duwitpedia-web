import { ArrowUpCircle, ArrowDownCircle, ArrowRightLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

/**
 * Get icon for transaction type
 * @param {string} type - Transaction type ('income', 'expense', 'transfer')
 * @returns {JSX.Element|null} Icon component
 */
export const getTypeIcon = (type) => {
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

/**
 * Get badge variant for transaction type
 * @param {string} type - Transaction type ('income', 'expense', 'transfer')
 * @returns {string} Badge variant
 */
export const getTypeBadgeVariant = (type) => {
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

/**
 * Get badge class for transaction type
 * @param {string} type - Transaction type ('income', 'expense', 'transfer')
 * @returns {string} CSS classes for badge
 */
export const getTypeBadgeClass = (type) => {
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

/**
 * Get category type color class
 * @param {string} type - Category type ('income', 'expense', 'transfer')
 * @returns {string} Color class
 */
export const getCategoryTypeColor = (type) => {
  switch (type) {
    case 'income':
      return 'bg-green-500';
    case 'expense':
      return 'bg-red-500';
    case 'transfer':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};

/**
 * Transaction Type Badge Component
 * @param {Object} props
 * @param {string} props.type - Transaction type ('income', 'expense', 'transfer')
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Badge component
 */
export function TransactionTypeBadge({ type, className = '' }) {
  return (
    <Badge className={`gap-1 ${getTypeBadgeClass(type)} ${className}`}>
      {getTypeIcon(type)}
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </Badge>
  );
}