/**
 * Currency formatting utility for Indian Rupee (INR).
 * Uses standard Intl.NumberFormat with 'en-IN' locale and 'INR' currency.
 * Guarantees correct Unicode Rupee symbol (₹, U+20B9) formatting across all browsers.
 *
 * Examples:
 *   formatCurrency(20984) => "₹20,984"
 *   formatCurrency(4110)  => "₹4,110"
 *   formatCurrency(822)   => "₹822"
 *   formatCurrency(24272) => "₹24,272"
 */

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export const formatCurrency = (amount, maximumFractionDigits = 0) => {
  if (amount === undefined || amount === null || amount === '') return '₹0';

  const numeric = typeof amount === 'number'
    ? amount
    : parseFloat(String(amount).replace(/[^0-9.-]/g, '')) || 0;

  if (maximumFractionDigits > 0) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: maximumFractionDigits,
      maximumFractionDigits: maximumFractionDigits,
    }).format(numeric);
  }

  return inrFormatter.format(numeric);
};

export default formatCurrency;
