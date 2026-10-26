import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { 
  authenticateStaff, 
  verifySession, 
  invalidateSession, 
  validateSafeReturnUrl 
} from '../server/authService.js';

describe('Admin Authentication Backend Service', () => {

  it('rejects missing or empty credentials with 400 Bad Request', async () => {
    const res1 = await authenticateStaff('', '');
    assert.equal(res1.success, false);
    assert.equal(res1.statusCode, 400);

    const res2 = await authenticateStaff('admin', null);
    assert.equal(res2.success, false);
    assert.equal(res2.statusCode, 400);

    const res3 = await authenticateStaff(null, 'password');
    assert.equal(res3.success, false);
    assert.equal(res3.statusCode, 400);
  });

  it('rejects invalid username or password with non-revealing 401 error', async () => {
    const res = await authenticateStaff('unknown.user@vedaradha.com', 'wrongpassword');
    assert.equal(res.success, false);
    assert.equal(res.statusCode, 401);
    assert.equal(res.error, 'Unable to sign in. Check your details and try again.');
  });

  it('rejects incorrect password for valid username without revealing account existence', async () => {
    const res = await authenticateStaff('admin', 'WrongPassword123');
    assert.equal(res.success, false);
    assert.equal(res.statusCode, 401);
    assert.equal(res.error, 'Unable to sign in. Check your details and try again.');
  });

  it('authenticates valid Managing Director credentials (admin / admin@123)', async () => {
    const res = await authenticateStaff('admin', 'admin@123');
    assert.equal(res.success, true);
    assert.equal(res.statusCode, 200);
    assert.ok(res.token && typeof res.token === 'string');
    assert.ok(res.user);
    assert.equal(res.user.name, 'Admin');
    assert.equal(res.user.role, 'Administrator');
    // Ensure password hash or salt is NEVER exposed in the user object
    assert.equal(res.user.passwordHash, undefined);
    assert.equal(res.user.salt, undefined);

    // Verify session token can be validated
    const verifiedUser = verifySession(res.token);
    assert.ok(verifiedUser);
    assert.equal(verifiedUser.id, res.user.id);

    // Test logout invalidation
    invalidateSession(res.token);
    assert.equal(verifySession(res.token), null);
  });

  it('authenticates Managing Director alias (admin@vedaradha.com / admin@123)', async () => {
    const res = await authenticateStaff('admin@vedaradha.com', 'admin@123');
    assert.equal(res.success, true);
    assert.equal(res.statusCode, 200);
    assert.equal(res.user.name, 'Admin');
    assert.ok(res.token);
  });
});

describe('Safe Return URL & Open Redirect Safeguards', () => {

  it('allows safe relative admin URLs', () => {
    assert.equal(validateSafeReturnUrl('/admin'), '/admin');
    assert.equal(validateSafeReturnUrl('/admin/products'), '/admin/products');
    assert.equal(validateSafeReturnUrl('/admin/orders?tab=reservations'), '/admin/orders?tab=reservations');
    assert.equal(validateSafeReturnUrl('/admin/delivery'), '/admin/delivery');
  });

  it('blocks open redirect attempts to external protocols or domains', () => {
    assert.equal(validateSafeReturnUrl('https://evil.com'), '/admin');
    assert.equal(validateSafeReturnUrl('http://attacker.com/admin'), '/admin');
    assert.equal(validateSafeReturnUrl('//evil.com/admin'), '/admin');
    assert.equal(validateSafeReturnUrl('javascript:alert(1)'), '/admin');
    assert.equal(validateSafeReturnUrl('/admin\\evil.com'), '/admin');
  });

  it('falls back to default /admin on null, undefined, or empty values', () => {
    assert.equal(validateSafeReturnUrl(null), '/admin');
    assert.equal(validateSafeReturnUrl(undefined), '/admin');
    assert.equal(validateSafeReturnUrl(''), '/admin');
    assert.equal(validateSafeReturnUrl('   '), '/admin');
  });
});
