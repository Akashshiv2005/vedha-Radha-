import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { cartClient } from '../src/api/cartClient.js';

// Polyfill localStorage for Node test runner
const memoryStore = {};
globalThis.localStorage = {
  getItem: (key) => memoryStore[key] || null,
  setItem: (key, val) => { memoryStore[key] = String(val); },
  removeItem: (key) => { delete memoryStore[key]; },
  clear: () => { Object.keys(memoryStore).forEach(k => delete memoryStore[k]); }
};

describe('Guest Cart Client & Token Persistence', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  it('correctly persists anonymous cart token in localStorage under VR_GUEST_CART_TOKEN', () => {
    assert.equal(cartClient.getToken(), null);

    const testToken = 'abc_guest_cart_token_12345';
    cartClient.setToken(testToken);

    assert.equal(cartClient.getToken(), testToken);
    assert.equal(localStorage.getItem('VR_GUEST_CART_TOKEN'), testToken);

    cartClient.clearToken();
    assert.equal(cartClient.getToken(), null);
    assert.equal(localStorage.getItem('VR_GUEST_CART_TOKEN'), null);
  });

  it('attaches X-Cart-Token header only when token is present', () => {
    cartClient.clearToken();
    let headers = cartClient.getHeaders();
    assert.equal(headers['X-Cart-Token'], undefined);

    cartClient.setToken('guest_token_xyz');
    headers = cartClient.getHeaders();
    assert.equal(headers['X-Cart-Token'], 'guest_token_xyz');
  });

  it('normalizes cart item correctly with fallback image and Indian price notation', () => {
    const rawItem = {
      id: 'item-uuid-1',
      product_id: 'prod-uuid-1',
      name: 'Temple Gold Choker',
      sku: 'TGC-001',
      current_price: 54000,
      unit_price_snapshot: 50000,
      price_changed: true,
      price_change_diff: 4000,
      quantity: 1,
      item_subtotal: 54000,
      image_url: '/images/products/gold/choker.jpg',
      item_type: 'unique',
      is_unique: true,
      is_available: true,
      stock_quantity: 1,
    };

    const normalized = cartClient.normalizeCartItem(rawItem);
    assert.equal(normalized.id, 'item-uuid-1');
    assert.equal(normalized.productId, 'prod-uuid-1');
    assert.equal(normalized.name, 'Temple Gold Choker');
    assert.equal(normalized.sku, 'TGC-001');
    assert.equal(normalized.price, '₹ 54,000');
    assert.equal(normalized.numericPrice, 54000);
    assert.equal(normalized.unitPriceSnapshot, 50000);
    assert.equal(normalized.priceChanged, true);
    assert.equal(normalized.priceChangeDiff, 4000);
    assert.equal(normalized.isUnique, true);
    assert.equal(normalized.isAvailable, true);
  });

  it('uses neutral placeholder when product image is missing', () => {
    const rawItem = {
      id: 'item-2',
      product_id: 'prod-2',
      name: 'Silver Anklet',
      current_price: 2500,
      image_url: null,
    };

    const normalized = cartClient.normalizeCartItem(rawItem);
    assert.equal(normalized.image, '/images/neutral_product_placeholder.svg');
    assert.equal(normalized.price, '₹ 2,500');
  });
});

