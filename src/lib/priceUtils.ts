/**
 * Price parsing utility that handles both US (dot) and European (comma) decimal formats
 * Properly converts prices like "99,99" or "99.99" or "₹1,299.99" to numbers
 */
export const parsePrice = (p: string | number | undefined | null): number => {
  if (p === undefined || p === null) return 0;
  if (typeof p === 'number') return p;
  
  // Remove currency symbols and whitespace
  let cleaned = String(p).replace(/[^\d.,\-]/g, '').trim();
  
  if (!cleaned) return 0;
  
  // Count dots and commas
  const dots = (cleaned.match(/\./g) || []).length;
  const commas = (cleaned.match(/,/g) || []).length;
  
  // Determine the decimal separator:
  // Case 1: Only dots - could be US format (1,234.56) or just decimal (99.99)
  // Case 2: Only commas - could be EU format (1.234,56) or just decimal (99,99)
  // Case 3: Both - check which comes last
  
  if (dots === 1 && commas === 0) {
    // Simple US format: 99.99 or 1234.56
    return parseFloat(cleaned) || 0;
  }
  
  if (commas === 1 && dots === 0) {
    // Simple EU format: 99,99 - comma is decimal
    return parseFloat(cleaned.replace(',', '.')) || 0;
  }
  
  if (dots > 0 && commas > 0) {
    // Mixed format - the last separator is likely the decimal
    const lastDot = cleaned.lastIndexOf('.');
    const lastComma = cleaned.lastIndexOf(',');
    
    if (lastComma > lastDot) {
      // EU format: 1.234,56 - comma is decimal
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      // US format: 1,234.56 - dot is decimal
      cleaned = cleaned.replace(/,/g, '');
    }
    return parseFloat(cleaned) || 0;
  }
  
  if (dots > 1) {
    // Multiple dots without commas - likely EU thousand separator: 1.234.567
    // Remove all dots (thousand separators)
    return parseFloat(cleaned.replace(/\./g, '')) || 0;
  }
  
  if (commas > 1) {
    // Multiple commas without dots - likely US thousand separator: 1,234,567
    // Remove all commas (thousand separators)
    return parseFloat(cleaned.replace(/,/g, '')) || 0;
  }
  
  // Fallback - just parse what we have
  return parseFloat(cleaned) || 0;
};

/**
 * Calculate discount percentage safely
 * Returns 0 if calculation would result in negative, NaN, or > 100%
 */
export const calculateDiscountPercent = (
  currentPrice: string | number | undefined,
  originalPrice: string | number | undefined
): number => {
  const current = parsePrice(currentPrice);
  const original = parsePrice(originalPrice);
  
  // Validate: both prices must be positive, original must be greater than current
  if (current <= 0 || original <= 0 || original <= current) {
    return 0;
  }
  
  const percent = Math.round((1 - current / original) * 100);
  
  // Clamp to valid range (0-99) - anything 100% or more is invalid
  if (percent <= 0 || percent >= 100) {
    return 0;
  }
  
  return percent;
};
