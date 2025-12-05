/**
 * Utility functions for reports components
 */

/**
 * Format currency amount to Indonesian Rupiah
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format percentage value
 * @param {number} value - The percentage value
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 1) => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Calculate percentage of a value relative to total
 * @param {number} value - The value to calculate percentage for
 * @param {number} total - The total value
 * @returns {number} Percentage value
 */
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

/**
 * Get color for category based on category name
 * @param {string} categoryName - The category name
 * @returns {string} Color hex code
 */
export const getColorForCategory = (categoryName) => {
  const colors = {
    'Food & Beverage': '#ef4444',
    'Transportation': '#3b82f6',
    'Entertainment': '#fbbf24',
    'Shopping': '#22c55e',
    'Bills & Utilities': '#a855f7',
    'Health & Fitness': '#f97316',
    'Education': '#ec4899',
    'Travel': '#0ea5e9',
    'Salary': '#22c55e',
    'Business': '#3b82f6',
    'Investment': '#fbbf24',
    'Other': '#6b7280',
  };

  return colors[categoryName] || '#6b7280';
};

/**
 * Format date for display in reports
 * @param {string|Date} date - The date to format
 * @param {string} format - Format type ('short', 'medium', 'long')
 * @returns {string} Formatted date string
 */
export const formatReportDate = (date, format = 'medium') => {
  const dateObj = new Date(date);

  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
    case 'medium':
      return dateObj.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    case 'long':
      return dateObj.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    default:
      return dateObj.toLocaleDateString('id-ID');
  }
};

/**
 * Calculate trend indicator
 * @param {number} current - Current period value
 * @param {number} previous - Previous period value
 * @returns {object} Trend object with direction and percentage
 */
export const calculateTrend = (current, previous) => {
  if (previous === 0) {
    return {
      direction: current > 0 ? 'up' : current < 0 ? 'down' : 'neutral',
      percentage: 0,
      value: current
    };
  }

  const diff = current - previous;
  const percentage = Math.round((diff / Math.abs(previous)) * 100);

  return {
    direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral',
    percentage: Math.abs(percentage),
    value: diff
  };
};