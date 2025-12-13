import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

/**
 * Format date with Indonesian locale
 * @param {Date|string} date - Date to format
 * @param {string} formatString - Format pattern (default: 'dd MMM yyyy')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatString = 'dd MMM yyyy') => {
  return format(new Date(date), formatString, { locale: idLocale });
};

/**
 * Format date and time with Indonesian locale
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date) => {
  return format(new Date(date), 'dd MMM yyyy HH:mm', { locale: idLocale });
};

/**
 * Format time only
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted time string
 */
export const formatTime = (date) => {
  return format(new Date(date), 'HH:mm', { locale: idLocale });
};