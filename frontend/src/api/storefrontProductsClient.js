import { buildApiUrl } from './config';

/**
 * Public Storefront Products API Client.
 * Communicates with FastAPI /api/products endpoints.
 * Requires NO administrator authentication.
 */

export function adaptStorefrontProduct(raw) {
  if (!raw) return null;

  const numPrice = typeof raw.numericPrice === 'number'
    ? raw.numericPrice
    : (typeof raw.price === 'number'
      ? Math.round(raw.price)
      : parseInt(String(raw.price || 0).replace(/[^0-9]/g, '') || '0', 10));

  const formattedPrice = (typeof raw.price === 'string' && raw.price.trim().startsWith('₹'))
    ? raw.price.trim()
    : `₹ ${numPrice.toLocaleString('en-IN')}`;

  const rawImages = (Array.isArray(raw.images) && raw.images.length > 0)
    ? raw.images.filter(img => typeof img === 'string' && img.trim().length > 0).slice(0, 3)
    : [];
  const primaryFallback = raw.image || raw.image_url || '/images/neutral_product_placeholder.svg';
  const images = rawImages.length > 0 ? rawImages : [primaryFallback];
  const image = images[0];

  const subCat = raw.subCategory || raw.sub_category || '';
  const subCatSlug = raw.subCategorySlug || subCat.toLowerCase().replace(/\s+/g, '-');
  const subType = raw.subType || subCatSlug;

  const stat = String(raw.status || 'available').toLowerCase();
  const isSold = stat.includes('sold') || (raw.stock_quantity !== undefined && raw.stock_quantity <= 0);
  const availability = isSold ? 'out_of_stock' : 'in_stock';

  const rawProductType = String(raw.productType || raw.product_type || '').toLowerCase();
  const rawCategory = String(raw.category || '').toLowerCase();
  const isGoldItem = rawProductType === 'gold' || rawCategory.includes('gold');
  const isSilverItem = rawProductType === 'silver' || rawCategory.includes('silver');
  const isCoinOrBar = rawProductType === 'coins_bars' || rawCategory.includes('coin') || rawCategory.includes('bar');

  let defaultPurityOrDetails = '22K BIS 916';
  if (isSilverItem) {
    defaultPurityOrDetails = '92.5 Silver';
  } else if (isCoinOrBar) {
    defaultPurityOrDetails = '24K 999 Pure Gold';
  } else {
    defaultPurityOrDetails = '22K BIS 916';
  }

  let badge = raw.badge;
  if (!badge) {
    if (isSold) {
      badge = 'Sold';
    } else if (raw.hallmark_details) {
      badge = raw.hallmark_details;
    } else if (raw.purity) {
      badge = raw.purity;
    } else if (isGoldItem) {
      badge = '22K BIS 916';
    } else if (isSilverItem) {
      badge = '92.5 Silver';
    } else if (isCoinOrBar) {
      badge = '24K Pure Gold';
    } else {
      badge = 'In stock';
    }
  }

  const badgeType = raw.badgeType || (isSold ? 'out-of-stock' : (raw.item_type === 'unique' ? 'one-piece' : 'in-stock'));

  const details = raw.details || raw.hallmark_details || raw.purity || defaultPurityOrDetails;

  return {
    id: String(raw.id || raw.sku || Math.random()),
    sku: raw.sku || '',
    name: raw.name || '',
    subtitle: raw.subtitle || '',
    description: raw.description || '',
    productType: raw.productType || raw.product_type || '',
    product_type: raw.product_type || raw.productType || '',
    category: raw.category || '',
    subCategory: subCat,
    subCategorySlug: subCatSlug,
    subType: subType,
    occasion: raw.occasion || (subType && subType.includes('wear') ? subType : 'traditional-wear'),
    price: formattedPrice,
    numericPrice: numPrice,
    image: image,
    images: images,
    altText: raw.altText || raw.name || '',
    badge: badge,
    badgeType: badgeType,
    details: details,
    purity: raw.purity || details,
    weight: raw.weight || raw.gross_weight || raw.grossWeight || '',
    grossWeight: raw.gross_weight || raw.grossWeight || '',
    netWeight: raw.net_weight || raw.netWeight || '',
    dimensions: raw.dimensions || '',
    craftsmanship: raw.craftsmanship || '',
    certification: raw.certification || raw.hallmark_details || 'BIS Hallmarked',
    status: stat,
    isUnique: raw.item_type === 'unique' || !!raw.isUnique,
    isBridal: raw.isBridal ?? (String(raw.category).toLowerCase().includes('bridal') || false),
    isNewArrival: raw.isNewArrival ?? false,
    stockQty: raw.stock_quantity ?? raw.stockQty ?? 1,
    availability: availability
  };
}

export const storefrontClient = {
  /**
   * Fetch active catalogue products from backend PostgreSQL
   */
  async getStorefrontProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.page) query.set('page', params.page);
    if (params.pageSize || params.page_size) query.set('page_size', params.pageSize || params.page_size || 100);
    if (params.search) query.set('search', params.search);
    const prodType = params.product_type || params.productType;
    if (prodType && prodType !== 'all') query.set('product_type', prodType);
    if (params.category && params.category !== 'all') query.set('category', params.category);
    if (params.sub_category && params.sub_category !== 'all') query.set('sub_category', params.sub_category);
    if (params.status && params.status !== 'all') query.set('status', params.status);
    if (params.item_type && params.item_type !== 'all') query.set('item_type', params.item_type);
    if (params.availability && params.availability !== 'all') query.set('availability', params.availability);
    if (params.min_price !== undefined) query.set('min_price', params.min_price);
    if (params.max_price !== undefined) query.set('max_price', params.max_price);
    if (params.sort_by) query.set('sort_by', params.sort_by);
    if (params.sort_order) query.set('sort_order', params.sort_order);

    const queryString = query.toString();
    const url = buildApiUrl(`/api/products${queryString ? `?${queryString}` : ''}`);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        return {
          success: false,
          items: [],
          total: 0,
          error: `Server responded with status ${response.status}`
        };
      }

      const data = await response.json();
      const rawItems = Array.isArray(data.items) ? data.items : [];
      const adaptedItems = rawItems.map(adaptStorefrontProduct);

      return {
        success: true,
        items: adaptedItems,
        total: data.total || adaptedItems.length,
        page: data.page || 1,
        pageSize: data.page_size || 100,
        totalPages: data.total_pages || 1
      };
    } catch (err) {
      console.warn('Network error while querying storefront catalogue:', err);
      return {
        success: false,
        items: [],
        total: 0,
        error: 'Unable to connect to product server'
      };
    }
  },

  /**
   * Fetch single product by UUID or SKU
   */
  async getStorefrontProduct(idOrSku) {
    if (!idOrSku) return null;
    try {
      const response = await fetch(buildApiUrl(`/api/products/${encodeURIComponent(idOrSku)}`), {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) return null;
      const data = await response.json();
      return adaptStorefrontProduct(data);
    } catch {
      return null;
    }
  }
};
