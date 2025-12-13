/**
 * Format number with thousand separator (.)
 * Example: 1000000 -> 1.000.000
 */
export const formatNumber = (value) => {
  if (!value) return '';
  
  // Remove all non-digit characters except decimal point
  const cleaned = value.toString().replace(/[^\d.]/g, '');
  
  // Split by decimal point
  const parts = cleaned.split('.');
  
  // Format the integer part with thousand separator
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  // Join back with decimal point (if exists)
  return parts.join(',');
};

/**
 * Parse formatted number to plain number
 * Example: 1.000.000 -> 1000000
 */
export const parseFormattedNumber = (value) => {
  if (!value) return '';
  
  // Remove thousand separators (.) and replace decimal comma with dot
  return value.toString().replace(/\./g, '').replace(/,/g, '.');
};

/**
 * Handle number input change with formatting
 * @param {string} value - Input value
 * @param {Function} setValue - Function to set the value
 * @param {string} fieldName - Name of the field
 */
export const handleNumberInputChange = (value, setValue, fieldName) => {
  // Parse the formatted number
  const parsed = parseFormattedNumber(value);
  
  // Validate it's a valid number
  if (parsed === '' || !isNaN(parsed)) {
    // Format and set the value
    setValue(fieldName, parsed);
  }
};
