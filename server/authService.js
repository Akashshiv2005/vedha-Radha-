import crypto from 'node:crypto';

// In-memory server session store (with TTL cleanup)
const activeSessions = new Map();

// Staff accounts for showroom management (verified with constant-time comparison)
const STAFF_REGISTRY = [
  {
    id: 'USR-001',
    username: 'admin',
    aliases: ['admin@vedaradha.com', 'manager'],
    name: 'Veda Radha (Managing Director)',
    role: 'Managing Director & Vault Custodian',
    email: 'admin@vedaradha.com',
    passwordHash: crypto.createHash('sha256').update('admin@123' + 'vr_salt_2026_secure').digest('hex'),
    salt: 'vr_salt_2026_secure'
  }
];

function hashPassword(password, salt) {
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

/**
 * Authenticate staff credentials
 */
export async function authenticateStaff(username, password) {
  if (!username || typeof username !== 'string' || !password || typeof password !== 'string') {
    return {
      success: false,
      statusCode: 400,
      error: 'Username and password are required.'
    };
  }

  const normalizedUser = username.trim().toLowerCase();
  const staff = STAFF_REGISTRY.find(
    s => s.username.toLowerCase() === normalizedUser || s.aliases.includes(normalizedUser)
  );

  if (!staff) {
    // Constant-time dummy delay simulation to prevent timing attacks
    await new Promise(r => setTimeout(r, 60));
    return {
      success: false,
      statusCode: 401,
      error: 'Unable to sign in. Check your details and try again.'
    };
  }

  const computedHash = hashPassword(password.trim(), staff.salt);
  const isMatch = crypto.timingSafeEqual(
    Buffer.from(computedHash, 'utf8'),
    Buffer.from(staff.passwordHash, 'utf8')
  );

  if (!isMatch) {
    return {
      success: false,
      statusCode: 401,
      error: 'Unable to sign in. Check your details and try again.'
    };
  }

  // Issue session token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  const sessionUser = {
    id: staff.id,
    username: staff.username,
    name: staff.name,
    role: staff.role,
    email: staff.email
  };

  activeSessions.set(token, {
    user: sessionUser,
    expiresAt
  });

  return {
    success: true,
    statusCode: 200,
    token,
    expiresAt,
    user: sessionUser
  };
}

/**
 * Verify an active session token
 */
export function verifySession(token) {
  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }

  return session.user;
}

/**
 * Destroy session (logout)
 */
export function invalidateSession(token) {
  if (token) {
    activeSessions.delete(token);
  }
  return { success: true };
}

/**
 * Validates a return URL to prevent open redirect vulnerabilities
 */
export function validateSafeReturnUrl(returnUrl) {
  if (!returnUrl || typeof returnUrl !== 'string') return '/admin';
  const clean = returnUrl.trim();

  // Must start with /admin and must not contain protocol schemes or backslashes
  if (
    clean.startsWith('/admin') &&
    !clean.startsWith('//') &&
    !clean.includes('\\') &&
    !clean.includes(':')
  ) {
    return clean;
  }
  return '/admin';
}
