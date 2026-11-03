import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { cartClient } from '../src/api/cartClient.js';

// Polyfill localStorage & mock fetch for Node test runner
const memoryStore = {};
globalThis.localStorage = {
  getItem: (key) => memoryStore[key] || null,
  setItem: (key, val) => { memoryStore[key] = String(val); },
  removeItem: (key) => { delete memoryStore[key]; },
  clear: () => { Object.keys(memoryStore).forEach(k => delete memoryStore[k]); }
};

describe('Full Shopping Cart Page & Coupon Client Tests', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  it('normalizes cart response with coupon details, 3% tax and calculated totals', () => {
    const rawCartResponse = {
      success: true,
      cart_token: 'cart_token_abc_789',
      item_count: 2,
      subtotal: 50000,
      applied_coupon_code: 'WELCOME5',
      coupon_discount: 2500,
      tax: 1425,
      delivery_charge: 0,
      cart_total: 47500,
      has_price_changes: false,
      has_unavailable_items: false,
      items: [
        {
          id: 'item-1',
          product_id: 'prod-1',
          name: 'Sterling Silver Bracelet',
          sku: 'VR-SSB-001',
          current_price: 7425,
          unit_price_snapshot: 7425,
          price_changed: false,
          quantity: 1,
          item_subtotal: 7425,
          image_url: '/images/products/silver/bracelet1.jpg',
          item_type: 'unique',
          is_unique: true,
          is_available: true,
          stock_quantity: 1,
        },
        {
          id: 'item-2',
          product_id: 'prod-2',
          name: 'Handcrafted Gold Bangle',
          sku: 'VR-GB-002',
          current_price: 42575,
          unit_price_snapshot: 42575,
          price_changed: false,
          quantity: 1,
          item_subtotal: 42575,
          image_url: '/images/products/gold/bangle2.jpg',
          item_type: 'unique',
          is_unique: true,
          is_available: true,
          stock_quantity: 1,
        }
      ]
    };

    const formatted = cartClient.formatCartResponse(rawCartResponse);

    assert.equal(formatted.success, true);
    assert.equal(formatted.cartToken, 'cart_token_abc_789');
    assert.equal(formatted.items.length, 2);
    assert.equal(formatted.subtotal, 50000);
    assert.equal(formatted.appliedCouponCode, 'WELCOME5');
    assert.equal(formatted.couponDiscount, 2500);
    assert.equal(formatted.tax, 1425);
    assert.equal(formatted.deliveryCharge, 0);
    assert.equal(formatted.cartTotal, 47500);
    // Total payable = subtotal (50000) - couponDiscount (2500) + tax (1425) + delivery (0) = 48925
    assert.equal(formatted.totalPayable, 48925);
  });

  it('correctly locks unique jewellery pieces to maximum quantity of 1', () => {
    const uniqueItem = cartClient.normalizeCartItem({
      id: 'unique-item-01',
      product_id: 'prod-antique-choker',
      name: 'Antique Peacock Choker',
      sku: 'VR-CHOKER-01',
      current_price: 185000,
      quantity: 1,
      item_type: 'unique',
      is_unique: true,
      stock_quantity: 1,
    });

    assert.equal(uniqueItem.isUnique, true);
    assert.equal(uniqueItem.stockQuantity, 1);
    assert.equal(uniqueItem.quantity, 1);
  });

  it('applyCoupon rejects empty or whitespace-only code locally without network call', async () => {
    const resEmpty = await cartClient.applyCoupon('');
    assert.equal(resEmpty.success, false);
    assert.match(resEmpty.error, /coupon code/i);

    const resWhitespace = await cartClient.applyCoupon('   ');
    assert.equal(resWhitespace.success, false);
    assert.match(resWhitespace.error, /coupon code/i);
  });

  it('applyCoupon and removeCoupon communicate with correct endpoints', async () => {
    const originalFetch = globalThis.fetch;
    const fetchCalls = [];

    globalThis.fetch = async (url, options) => {
      fetchCalls.push({ url, options });
      return {
        ok: true,
        json: async () => ({
          success: true,
          cart_token: 'cart_token_test',
          subtotal: 30000,
          applied_coupon_code: options.method === 'POST' ? 'FESTIVE10' : null,
          coupon_discount: options.method === 'POST' ? 3000 : 0,
          tax: 810,
          delivery_charge: 0,
          cart_total: options.method === 'POST' ? 27000 : 30000,
          items: []
        })
      };
    };

    try {
      cartClient.setToken('cart_token_test');

      // Test apply coupon
      const applyRes = await cartClient.applyCoupon(' festive10 ');
      assert.equal(applyRes.success, true);
      assert.equal(applyRes.appliedCouponCode, 'FESTIVE10');
      assert.equal(applyRes.couponDiscount, 3000);
      assert.equal(fetchCalls[0].options.method, 'POST');
      assert.match(fetchCalls[0].url, /\/api\/cart\/coupon\/apply/);
      assert.equal(JSON.parse(fetchCalls[0].options.body).code, 'FESTIVE10');

      // Test remove coupon
      const removeRes = await cartClient.removeCoupon();
      assert.equal(removeRes.success, true);
      assert.equal(removeRes.appliedCouponCode, null);
      assert.equal(removeRes.couponDiscount, 0);
      assert.equal(fetchCalls[1].options.method, 'DELETE');
      assert.match(fetchCalls[1].url, /\/api\/cart\/coupon/);

    } finally {
      globalThis.fetch = originalFetch;
    }
  });

});

