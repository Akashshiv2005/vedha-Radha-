/**
 * Utility functions for human-readable, SEO-friendly product URL slugs.
 * Replaces raw database UUIDs (e.g. e8071d2a-e4b8-48e9-bf74-db99ee0a7742)
 * with the actual jewellery piece name (e.g. gajalakshmi-nakshi-handcrafted-22k-gold-bridal-vaddanam).
 */

/**
 * Convert any product name/title into a clean URL-friendly slug.
 * Example:
 * "Gajalakshmi Nakshi Handcrafted 22K Gold Bridal Vaddanam"
 * -> "gajalakshmi-nakshi-handcrafted-22k-gold-bridal-vaddanam"
 */
export function slugifyProductName(name) {
  if (!name || typeof name !== 'string') return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')     // Remove special characters, quotes, commas
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-')          // Replace duplicate hyphens
    .replace(/^-+|-+$/g, '');     // Trim leading/trailing hyphens
}

/**
 * Checks if a string looks like a standard UUID (v4)
 */
export function isUuid(str) {
  if (!str || typeof str !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str.trim());
}

/**
 * Normalizes any identifier (slug, SKU, or name) by removing non-alphanumeric chars for tolerant matching
 */
export function normalizeIdentifier(str) {
  if (!str || typeof str !== 'string') return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Get human-readable identifier for a product.
 * Always prefers descriptive product name or full name over raw database UUIDs.
 */
export function getProductIdentifier(product) {
  if (!product) return '';
  
  // 1. Primary: Prefer full name if present
  if (product.fullName && typeof product.fullName === 'string' && product.fullName.trim().length > 0) {
    const slug = slugifyProductName(product.fullName);
    if (slug) return slug;
  }

  // 2. Slug from product name
  if (product.name && typeof product.name === 'string') {
    const slug = slugifyProductName(product.name);
    if (slug) return slug;
  }

  // 3. Slug from title
  if (product.title && typeof product.title === 'string') {
    const slug = slugifyProductName(product.title);
    if (slug) return slug;
  }

  // 4. Existing slug property
  if (product.slug && typeof product.slug === 'string') {
    return slugifyProductName(product.slug);
  }

  // 5. SKU or Product Code
  if (product.sku && typeof product.sku === 'string' && !isUuid(product.sku)) {
    return slugifyProductName(product.sku);
  }

  if (product.productCode && typeof product.productCode === 'string') {
    return slugifyProductName(product.productCode);
  }

  // 6. Fallback: ID (if string)
  if (product.id && typeof product.id === 'string') {
    return product.id;
  }

  return '';
}

/**
 * Get full URL path for a product.
 * Returns e.g. "/product/gajalakshmi-nakshi-handcrafted-22k-gold-bridal-vaddanam"
 */
export function getProductUrl(product) {
  const identifier = getProductIdentifier(product);
  return identifier ? `/product/${encodeURIComponent(identifier)}` : '/gold';
}

/**
 * Check if a product matches an input identifier (which could be a slug, SKU, name, ID, or UUID)
 */
export function doesProductMatchIdentifier(product, identifier) {
  if (!product || !identifier) return false;
  const rawId = String(identifier).trim().toLowerCase();
  const normId = normalizeIdentifier(rawId);
  if (!normId) return false;

  // 1. Check ID (e.g. UUID, "temple-p-2", "dia-solitaire-01", "prod-arr-1")
  if (product.id) {
    const idLower = String(product.id).trim().toLowerCase();
    if (idLower === rawId || normalizeIdentifier(idLower) === normId) return true;
  }

  // 2. Check exact slug of fullName
  if (product.fullName && typeof product.fullName === 'string') {
    const fullSlug = slugifyProductName(product.fullName);
    if (fullSlug && fullSlug === rawId) return true;
    const normFull = normalizeIdentifier(product.fullName);
    if (normFull && (normFull === normId || normFull.includes(normId) || normId.includes(normFull))) {
      if (Math.abs(normFull.length - normId.length) < 8) return true;
    }
  }

  // 3. Check exact slug of name
  if (product.name && typeof product.name === 'string') {
    const nameSlug = slugifyProductName(product.name);
    if (nameSlug && nameSlug === rawId) return true;
    const normName = normalizeIdentifier(product.name);
    if (normName && (normName === normId || normName.includes(normId) || normId.includes(normName))) {
      if (Math.abs(normName.length - normId.length) < 8) return true;
    }
  }

  // 4. Check title
  if (product.title && typeof product.title === 'string') {
    const titleSlug = slugifyProductName(product.title);
    if (titleSlug && titleSlug === rawId) return true;
    const normTitle = normalizeIdentifier(product.title);
    if (normTitle && (normTitle === normId || normTitle.includes(normId) || normId.includes(normTitle))) {
      if (Math.abs(normTitle.length - normId.length) < 8) return true;
    }
  }

  // 5. Check SKU
  if (product.sku) {
    const skuLower = String(product.sku).trim().toLowerCase();
    if (skuLower === rawId || normalizeIdentifier(skuLower) === normId) return true;
  }

  // 6. Check productCode / code
  if (product.productCode || product.code) {
    const code = String(product.productCode || product.code).trim().toLowerCase();
    if (code === rawId || normalizeIdentifier(code) === normId) return true;
  }

  // 7. Check slug property
  if (product.slug) {
    const slugLower = String(product.slug).trim().toLowerCase();
    if (slugLower === rawId || normalizeIdentifier(slugLower) === normId) return true;
  }

  // 8. Check short categoryTag or badge label if it matches
  if (product.categoryTag) {
    const tagSlug = slugifyProductName(product.categoryTag);
    if (tagSlug && tagSlug === rawId) return true;
  }

  return false;
}

