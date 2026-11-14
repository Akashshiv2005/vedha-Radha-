import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { products } from '../data/products';
import { exclusiveNewArrivals } from '../data/newArrivalsData';
import { diamondProducts } from '../data/diamondProducts';
import { newArrivalsHighlightProducts } from '../data/newArrivalsHighlightProducts';
import { templeProducts } from '../data/templeProducts';
import { poojaProducts } from '../data/poojaProducts';
import { NEW_ARRIVALS_SHOWCASE } from '../components/NewArrivalsSection';
import { storefrontClient } from '../api/storefrontProductsClient';
import ProductDetailModal from '../components/ProductDetailModal';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { doesProductMatchIdentifier, getProductIdentifier, getProductUrl } from '../utils/productSlug';

const allStaticCatalogs = [
  ...newArrivalsHighlightProducts,
  ...diamondProducts,
  ...templeProducts,
  ...poojaProducts,
  ...exclusiveNewArrivals,
  ...NEW_ARRIVALS_SHOWCASE,
  ...products
];

function normalizeProductForDisplay(raw) {
  if (!raw) return null;
  const p = { ...raw };

  // 1. Ensure images array
  if (!Array.isArray(p.images) || p.images.length === 0) {
    p.images = p.image ? [p.image] : ['/images/product_gold_chain.jpg'];
  } else {
    p.images = p.images.filter(img => typeof img === 'string' && img.trim().length > 0);
    if (p.images.length === 0 && p.image) {
      p.images = [p.image];
    }
  }
  if (!p.image && p.images[0]) {
    p.image = p.images[0];
  }

  // 2. Ensure numeric price & formattedPrice
  if (p.price && !p.numericPrice) {
    if (typeof p.price === 'number') {
      p.numericPrice = p.price;
      p.formattedPrice = `₹ ${Number(p.price).toLocaleString('en-IN')}*`;
    } else {
      const cleaned = String(p.price).replace(/[^0-9]/g, '');
      if (cleaned) {
        p.numericPrice = parseInt(cleaned, 10);
      }
    }
  }
  if (!p.formattedPrice && p.numericPrice) {
    p.formattedPrice = `₹ ${Number(p.numericPrice).toLocaleString('en-IN')}*`;
  }
  if (!p.price && p.numericPrice) {
    p.price = `₹ ${Number(p.numericPrice).toLocaleString('en-IN')}`;
  }

  // 3. Ensure weight & purity
  if (!p.weight && p.grossWeight) p.weight = p.grossWeight;
  if (!p.grossWeight && p.weight) p.grossWeight = p.weight;
  if (!p.purity && p.goldPurity) p.purity = p.goldPurity;
  if (!p.goldPurity && p.purity) p.goldPurity = p.purity;

  // 4. Ensure badge
  if (!p.badge) {
    if (p.isDiamond || p.category?.toLowerCase() === 'diamond') {
      p.badge = 'IGI Certified Natural';
      p.badgeType = 'certified';
    } else if (p.isSilver || p.category?.toLowerCase()?.includes('silver')) {
      p.badge = '925 Sacred Silver';
      p.badgeType = 'hallmarked';
    } else {
      p.badge = 'BIS 916 Hallmarked';
      p.badgeType = 'hallmarked';
    }
  }

  return p;
}

function findLocalProduct(idOrSlug) {
  if (!idOrSlug) return null;
  const matched = allStaticCatalogs.find(p => doesProductMatchIdentifier(p, idOrSlug));
  if (!matched) return null;

  // If this item is a showcase card that points to a richer parent item in another catalog:
  if (matched.id) {
    const richParent = allStaticCatalogs.find(p => 
      p !== matched && 
      p.id === matched.id && 
      (Array.isArray(p.images) && p.images.length > 1 || Boolean(p.fourCs) || (p.description && p.description.length > 40))
    );
    if (richParent) {
      return normalizeProductForDisplay({ ...richParent, ...matched, images: richParent.images || matched.images });
    }
  }

  return normalizeProductForDisplay(matched);
}

export default function ProductDetailPage({ onAddToCart, onAddToWishlist, wishlistItems = [] }) {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Initial lookup: check static catalog, then check location.state.product
  const [product, setProduct] = useState(() => {
    const local = findLocalProduct(productId);
    if (local) return local;
    if (location.state?.product) {
      const stateProd = location.state.product;
      const matched = findLocalProduct(stateProd.id) || 
                      findLocalProduct(stateProd.fullName) || 
                      findLocalProduct(stateProd.name);
      return matched || normalizeProductForDisplay(stateProd);
    }
    return null;
  });
  const [loading, setLoading] = useState(!product);

  useEffect(() => {
    window.scrollTo(0, 0);

    // 1. Try static catalog first
    let resolved = findLocalProduct(productId);

    // 2. If not found by URL slug, check location.state
    if (!resolved && location.state?.product) {
      const stateProd = location.state.product;
      resolved = findLocalProduct(stateProd.id) || 
                 findLocalProduct(stateProd.fullName) || 
                 findLocalProduct(stateProd.name) || 
                 normalizeProductForDisplay(stateProd);
    }

    if (resolved) {
      setProduct(resolved);
      setLoading(false);
      return;
    }

    // 3. Fetch from backend API if not in static list
    let isMounted = true;
    setLoading(true);
    storefrontClient.getStorefrontProduct(productId)
      .then((apiProduct) => {
        if (!isMounted) return;
        if (apiProduct) {
          setProduct(normalizeProductForDisplay(apiProduct));
        } else {
          setProduct(null);
        }
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setProduct(null);
        setLoading(false);
      });

    return () => { isMounted = false; };
  }, [productId, location.state]);

  // Synchronize browser address bar to show the clean jewellery name slug instead of raw UUID
  useEffect(() => {
    if (product) {
      const canonicalSlug = getProductIdentifier(product);
      if (canonicalSlug) {
        const canonicalPath = `/product/${encodeURIComponent(canonicalSlug)}`;
        if (window.location.pathname !== canonicalPath) {
          window.history.replaceState({ 
            ...(location.state || {}),
            isProductView: true, 
            productId: canonicalSlug, 
            product 
          }, '', canonicalPath);
        }
      }
    }
  }, [product, location.state]);

  const handleBack = () => {
    let backInfo = null;
    try {
      const raw = sessionStorage.getItem('lastProductBackInfo');
      if (raw) backInfo = JSON.parse(raw);
    } catch {}

    const fromPath = location.state?.fromPath || backInfo?.fromPath;
    const scrollY = location.state?.scrollY ?? backInfo?.scrollY;
    const targetProductId = product?.id || backInfo?.productId;

    // 1. If we have a recorded internal catalog fromPath, navigate back with scroll restoration:
    if (
      fromPath && 
      !fromPath.startsWith('/product/')
    ) {
      navigate(fromPath, { state: { restoreScrollY: scrollY, targetProductId } });
      return;
    }

    // 2. If browser history exists:
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    // 3. Fallback to the dedicated catalog route for this specific product:
    const cat = (product?.category || '').toLowerCase();
    const sub = (product?.subCategory || product?.sub_category || product?.subType || '').toLowerCase().trim();
    
    if (product?.isDiamond || cat.includes('diamond')) {
      if (sub.includes('ring')) navigate('/diamonds?category=rings');
      else if (sub.includes('necklace') || sub.includes('choker') || sub.includes('haram')) navigate('/diamonds?category=necklaces');
      else if (sub.includes('bracelet') || sub.includes('bangle') || sub.includes('kada')) navigate('/diamonds?category=bracelets');
      else if (sub.includes('earring') || sub.includes('stud') || sub.includes('jhumka')) navigate('/diamonds?category=earrings');
      else if (sub.includes('pendant')) navigate('/diamonds?category=pendants');
      else if (sub.includes('nose')) navigate('/diamonds?category=nosepins');
      else navigate('/diamonds');
    } else if (product?.isSilverPooja || cat.includes('pooja') || sub.includes('pooja')) {
      navigate('/silver-pooja');
    } else if (cat.includes('coin') || cat.includes('bar') || sub.includes('coin') || sub.includes('bar')) {
      navigate('/coins-bars');
    } else if (product?.isTemple || cat.includes('temple')) {
      navigate('/temple-heritage');
    } else if (product?.isBridal || cat.includes('bridal')) {
      navigate('/bridal');
    } else if (product?.isNewArrival || cat.includes('new')) {
      navigate('/new-arrivals');
    } else if (cat.includes('collection')) {
      navigate('/collections');
    } else if (product?.isSilver || cat.includes('silver')) {
      if (sub) navigate(`/silver/${encodeURIComponent(sub)}`);
      else navigate('/silver');
    } else {
      // Gold default
      if (sub) navigate(`/gold/${encodeURIComponent(sub)}`);
      else navigate('/gold');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#FAF7F2]">
        <Loader2 className="w-8 h-8 text-[#581923] animate-spin mb-3" />
        <p className="text-xs text-[#7A6E65]">Loading jewellery details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#FAF7F2]">
        <div className="w-16 h-16 rounded-full bg-[#581923]/10 text-[#581923] flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#241716] mb-2">
          Jewellery Piece Not Found
        </h2>
        <p className="text-xs sm:text-sm text-[#7A6E65] max-w-md mb-6">
          The requested jewellery piece may have been reserved or moved to our heritage vault.
        </p>
        <Link
          to="/gold"
          className="bg-[#581923] hover:bg-[#431219] text-white px-6 py-3 rounded-full text-xs font-semibold tracking-wide flex items-center gap-2 transition-colors shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Gold Collection</span>
        </Link>
      </div>
    );
  }

  return (
    <ProductDetailModal
      key={product.id || product.sku}
      product={product}
      isDedicatedPage={true}
      onClose={handleBack}
      onBackToProducts={handleBack}
      onAddToCart={onAddToCart}
      onAddToWishlist={onAddToWishlist}
      isWishlisted={wishlistItems.some((item) => item.id === product.id)}
      onSelectRelatedProduct={(related) => navigate(getProductUrl(related), { state: { product: related } })}
    />
  );
}
