import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { checkoutClient } from '../src/api/checkoutClient.js';

// Polyfill localStorage and sessionStorage for Node test runner
const memoryStore = {};
globalThis.localStorage = {
  getItem: (key) => memoryStore[key] || null,
  setItem: (key, val) => { memoryStore[key] = String(val); },
  removeItem: (key) => { delete memoryStore[key]; },
  clear: () => { Object.keys(memoryStore).forEach(k => delete memoryStore[k]); }
};
globalThis.sessionStorage = {
  getItem: (key) => memoryStore[key] || null,
  setItem: (key, val) => { memoryStore[key] = String(val); },
  removeItem: (key) => { delete memoryStore[key]; },
  clear: () => { Object.keys(memoryStore).forEach(k => delete memoryStore[k]); }
};

describe('Checkout Client Service & Order Processing', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('fetches checkout quote with authoritative values', async () => {
    const mockQuote = {
      subtotal: 50000,
      tax: 1500,
      delivery_charge: 0,
      discount: 0,
      total_amount: 51500,
      item_count: 1,
      items: [],
      available_payment_methods: [
        { provider: 'COD', display_name: 'Cash on Delivery', is_available: true }
      ],
      can_proceed: true,
      validation_errors: []
    };

    globalThis.fetch = async () => ({
      ok: true,
      status: 200,
      json: async () => mockQuote
    });

    const res = await checkoutClient.getQuote();
    assert.equal(res.success, true);
    assert.equal(res.quote.total_amount, 51500);
    assert.equal(res.quote.tax, 1500);
  });

  it('places order and extracts order number and token', async () => {
    const mockOrder = {
      id: 'ord-uuid-1',
      order_number: 'VR-2026-12345',
      customer_name: 'Suresh Kumar',
      total_amount: 51500,
      payment_method: 'COD',
      payment_status: 'pending',
      order_status: 'Confirmed',
      order_token: 'sec-tok-123'
    };

    globalThis.fetch = async () => ({
      ok: true,
      status: 201,
      json: async () => mockOrder
    });

    const res = await checkoutClient.placeOrder({
      customer: { customerName: 'Suresh', mobileNumber: '9840123456' },
      delivery: { fullAddress: 'Madurai', city: 'Madurai', state: 'Tamil Nadu', pinCode: '625001' },
      paymentMethod: 'COD'
    });

    assert.equal(res.success, true);
    assert.equal(res.order.order_number, 'VR-2026-12345');
    assert.equal(res.order.order_token, 'sec-tok-123');
  });

  it('handles backend conflict error detail properly', async () => {
    globalThis.fetch = async () => ({
      ok: false,
      status: 409,
      json: async () => ({ detail: 'Item is no longer available in stock.' })
    });

    const res = await checkoutClient.placeOrder({
      customer: { customerName: 'Buyer', mobileNumber: '9000000000' },
      delivery: { fullAddress: 'Madurai', city: 'Madurai', state: 'Tamil Nadu', pinCode: '625001' },
      paymentMethod: 'COD'
    });

    assert.equal(res.success, false);
    assert.equal(res.error, 'Item is no longer available in stock.');
  });
});
