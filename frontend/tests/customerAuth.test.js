import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { customerAuthClient } from '../src/api/customerAuthClient.js';

// Polyfill localStorage for Node test runner
const memoryStore = {};
globalThis.localStorage = {
  getItem: (key) => memoryStore[key] || null,
  setItem: (key, val) => { memoryStore[key] = String(val); },
  removeItem: (key) => { delete memoryStore[key]; },
  clear: () => { Object.keys(memoryStore).forEach(k => delete memoryStore[k]); }
};

describe('Customer Auth Client & Session Isolation', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  it('maintains strict isolation between customer and admin storage keys', () => {
    const customerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.customer';
    const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.admin';

    // Store admin token
    localStorage.setItem('VR_ADMIN_AUTH_TOKEN', adminToken);
    localStorage.setItem('VR_ADMIN_AUTH_USER', JSON.stringify({ name: 'Admin', role: 'Administrator' }));

    // Store customer session via customerAuthClient
    customerAuthClient.setSession(customerToken, {
      customer_name: 'Smt. Radha Ramanathan',
      mobile_number: '9840123456'
    });

    // Check customer getters
    assert.equal(customerAuthClient.getToken(), customerToken);
    assert.equal(customerAuthClient.getStoredCustomer().customer_name, 'Smt. Radha Ramanathan');

    // Verify admin token was not overwritten or interfered with
    assert.equal(localStorage.getItem('VR_ADMIN_AUTH_TOKEN'), adminToken);

    // Logout customer
    customerAuthClient.clearSession();
    assert.equal(customerAuthClient.getToken(), null);
    assert.equal(customerAuthClient.getStoredCustomer(), null);

    // Verify admin token remains active
    assert.equal(localStorage.getItem('VR_ADMIN_AUTH_TOKEN'), adminToken);
  });

  it('rejects login with empty credentials client-side', async () => {
    const res = await customerAuthClient.login({ mobile_number: '', password: '' });
    assert.equal(res.success, false);
    assert.equal(res.error, 'Please enter both mobile number and password.');
  });

  it('returns unauthenticated state when getProfile called without token', async () => {
    customerAuthClient.clearSession();
    const res = await customerAuthClient.getProfile();
    assert.equal(res.success, false);
    assert.equal(res.customer, null);
  });

  it('returns unauthenticated state when getOrderHistory called without token', async () => {
    customerAuthClient.clearSession();
    const res = await customerAuthClient.getOrderHistory();
    assert.equal(res.success, false);
    assert.deepEqual(res.orders, []);
  });

  it('verifies correct auth header formatting with customer Bearer token', () => {
    customerAuthClient.clearSession();
    let headers = customerAuthClient.getAuthHeaders();
    assert.equal(headers['Authorization'], undefined);

    customerAuthClient.setSession('test-token-123', { customer_name: 'Test' });
    headers = customerAuthClient.getAuthHeaders();
    assert.equal(headers['Authorization'], 'Bearer test-token-123');
  });
});

