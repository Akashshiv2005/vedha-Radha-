import { describe, it } from 'node:test';
import assert from 'node:assert';
import { formatCurrency } from '../src/utils/currency.js';

describe('INR Currency Formatter & Rupee Symbol Preservation', () => {
  it('formats exact prompt examples with Indian Rupee symbol (₹, U+20B9)', () => {
    assert.strictEqual(formatCurrency(20984), '₹20,984');
    assert.strictEqual(formatCurrency(4110), '₹4,110');
    assert.strictEqual(formatCurrency(822), '₹822');
    assert.strictEqual(formatCurrency(24272), '₹24,272');
  });

  it('correctly uses the Unicode U+20B9 Indian Rupee symbol without encoding corruption', () => {
    const formatted = formatCurrency(28200);
    assert.strictEqual(formatted.charCodeAt(0), 0x20B9, 'First char must be Unicode ₹ (U+20B9)');
    assert.strictEqual(formatted, '₹28,200');
  });

  it('handles Indian numbering system (lakhs & crores)', () => {
    assert.strictEqual(formatCurrency(112000), '₹1,12,000');
    assert.strictEqual(formatCurrency(380000), '₹3,80,000');
    assert.strictEqual(formatCurrency(10000000), '₹1,00,00,000');
  });

  it('handles string amounts with or without preexisting symbols', () => {
    assert.strictEqual(formatCurrency('24500'), '₹24,500');
    assert.strictEqual(formatCurrency('₹ 24,500'), '₹24,500');
    assert.strictEqual(formatCurrency('28200.00'), '₹28,200');
  });

  it('handles zero, null, and empty amounts gracefully', () => {
    assert.strictEqual(formatCurrency(0), '₹0');
    assert.strictEqual(formatCurrency(null), '₹0');
    assert.strictEqual(formatCurrency(undefined), '₹0');
    assert.strictEqual(formatCurrency(''), '₹0');
  });

  it('supports decimal precision when explicitly requested', () => {
    assert.strictEqual(formatCurrency(191.24, 2), '₹191.24');
    assert.strictEqual(formatCurrency(206.75, 2), '₹206.75');
  });
});
