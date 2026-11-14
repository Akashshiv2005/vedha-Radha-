import React, { useState } from 'react';
import { Eye, Heart, ShoppingBag } from 'lucide-react';

// Formatter to keep hallmark and certification badges concise, preventing text overflow
export function formatHallmarkBadge(raw, isSilver, isCoin, isDiamond) {
  if (isDiamond) {
    const s = String(raw || '').toLowerCase();
    if (s.includes('gia') && s.includes('igi')) return 'GIA & IGI Certified';
    if (s.includes('gia')) return 'GIA Certified Diamond';
    if (s.includes('igi')) return 'IGI Certified Natural';
    if (s.includes('conflict')) return '100% Conflict-Free';
    if (s.includes('solitaire')) return 'IGI Certified Solitaire';
    return 'IGI Certified Natural';
  }
  if (isCoin) {
    const s = String(raw || '').toLowerCase();
    if (s.includes('silver')) return '999 Fine Silver';
    return '24K 999 Purity';
  }
  if (isSilver) {
    const s = String(raw || '').toLowerCase();
    if (s.includes('pooja') || s.includes('temple')) return '925 Sacred Silver';
    if (s.includes('999') || s.includes('fine')) return '999 Fine Silver';
    if (s.includes('assay')) return '925 Assay Certified';
    return '925 Hallmarked Silver';
  }
  const s = String(raw || '').trim();
  if (!s) return 'BIS 916 Hallmarked';

  const lower = s.toLowerCase();
  if (lower.includes('gia') || lower.includes('igi') || lower.includes('diamond')) {
    return 'IGI Certified Diamond';
  }

  // If already concise (e.g. "BIS 916 Hallmarked", "BIS 916 Laser Inscribed")
  if (s.length <= 26 && (s.toLowerCase().includes('bis') || s.toLowerCase().includes('hallmark'))) {
    return s.replace(/^▲\s*/, '');
  }

  if (lower.includes('laser')) return 'BIS 916 Laser Inscribed';
  if (lower.includes('916')) return 'BIS 916 Hallmarked';
  if (lower.includes('24k') || lower.includes('999')) return '24K Pure Gold';
  if (lower.includes('18k') || lower.includes('750')) return '18K Hallmarked';
  if (lower.includes('bis') || lower.includes('hallmark')) return 'BIS Hallmarked';
  return 'BIS 916 Hallmarked';
}

/**
 * Luxury Signature Jewellery Product Card
 * Photorealistic royal presentation:
 * - Crisp pure-white card with platinum/ice-silver accents for Diamonds and Silver
 * - Warm heirloom gold presentation with glowing 24K wave divider for Gold & Temple Jewellery
 */
export default function LuxuryProductCard({
  item = {},
  wishlistItems = [],
  onAddToCart = () => {},
  onAddToWishlist = () => {},
  onViewProduct = () => {}
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const isWishlisted = wishlistItems.some((w) => w.id === item.id);
  const isGiftCard =
    item.collection === 'gift-collection' ||
    item.subCategory === 'Gift Collection' ||
    Boolean(item.suitableFor);

  const images =
    !isGiftCard && item.images && item.images.length > 0
      ? item.images
      : [item.image || '/images/product_gold_chain.jpg'];
  const currentImage = images[activeImageIndex] || item.image || '/images/product_gold_chain.jpg';

  // Detection of precious metal type
  const isSilver =
    Boolean(item.isSilver) ||
    String(item.productType || item.category || '').toLowerCase().includes('silver') ||
    String(item.department || '').toLowerCase().includes('silver') ||
    String(item.collection || '').toLowerCase().includes('silver') ||
    String(item.subCategory || '').toLowerCase().includes('silver') ||
    String(item.name || '').toLowerCase().includes('silver') ||
    String(item.purity || '').includes('925') ||
    String(item.id || '').toLowerCase().startsWith('pooja-') ||
    String(item.id || '').toLowerCase().includes('slv') ||
    String(item.sku || '').toLowerCase().includes('slv');

  const isCoin =
    String(item.category || item.subCategory || '').toLowerCase().includes('coin') ||
    String(item.category || item.subCategory || '').toLowerCase().includes('bar') ||
    String(item.name || '').toLowerCase().includes('coin') ||
    String(item.name || '').toLowerCase().includes('bar');

  const isDiamond =
    Boolean(item.isDiamond) ||
    String(item.category || item.department || '').toLowerCase() === 'diamond' ||
    String(item.subCategory || '').toLowerCase().includes('diamond') ||
    Boolean(item.carat);

  // Both Diamond and Silver use the clean white card, platinum borders, and midnight navy velvet stage
  const isSilverOrDiamond = isDiamond || isSilver;

  // Weight display with sensible fallback
  const displayWeight =
    (item.carat && item.grossWeight ? `${item.carat} • ${item.grossWeight}` : null) ||
    item.carat ||
    item.weight ||
    item.grossWeight ||
    (item.netWeight ? String(item.netWeight) : null) ||
    (item.grams ? `${item.grams} grams` : null) ||
    (item.purity ? item.purity : '32.0 grams');

  // Hallmark / Purity badge label
  const hallmarkBadgeText = formatHallmarkBadge(
    item.certification || item.details || item.purity,
    isSilver,
    isCoin,
    isDiamond
  );

  // Top Hallmark pill badge
  const topBadgeRaw =
    item.badge ||
    item.certification ||
    (isDiamond ? 'IGI Certified Natural' : isCoin ? '24K 999 Purity' : isSilver ? '925 Hallmarked Silver' : 'BIS 916 Hallmarked');
  const topBadgeText = formatHallmarkBadge(topBadgeRaw, isSilver, isCoin, isDiamond);

  // Format price
  let displayPrice = item.price;
  if (!displayPrice && item.numericPrice) {
    displayPrice = `₹ ${Number(item.numericPrice).toLocaleString('en-IN')}`;
  } else if (!displayPrice) {
    displayPrice = 'Price on Request';
  } else if (typeof displayPrice === 'number') {
    displayPrice = `₹ ${Number(displayPrice).toLocaleString('en-IN')}`;
  }

  const safeGradId =
    'goldWaveGrad-' +
    String(item.id || item.sku || Math.random()).replace(/[^a-zA-Z0-9_-]/g, '_');

  // Intelligent object-positioning so each piece of jewellery is framed prominently
  const imgLower = String(currentImage || '').toLowerCase();
  const nameLower = String(item.name || '').toLowerCase();
  let objectPositionStyle = 'center 48%';
  if (
    imgLower.includes('plate_01') ||
    nameLower.includes('kasu') ||
    nameLower.includes('mala') ||
    nameLower.includes('necklace') ||
    nameLower.includes('haar')
  ) {
    objectPositionStyle = 'center 90%';
  } else if (
    imgLower.includes('plate_06') ||
    nameLower.includes('vaddanam') ||
    nameLower.includes('waistbelt')
  ) {
    objectPositionStyle = 'center 50%';
  } else if (
    imgLower.includes('plate_07') ||
    nameLower.includes('vanki') ||
    nameLower.includes('armlet') ||
    nameLower.includes('kada')
  ) {
    objectPositionStyle = 'center 50%';
  }

  return (
    <div 
      id={item.id ? `product-card-${item.id}` : undefined}
      data-product-id={item.id}
      className={`${
      isSilverOrDiamond
        ? 'bg-white rounded-[24px] sm:rounded-[26px] border-[2px] border-[#CBD5E1] shadow-[0_18px_40px_-8px_rgba(148,163,184,0.32),0_8px_18px_-4px_rgba(15,23,42,0.1)] ring-1 ring-[#E2E8F0] hover:border-[#94A3B8] hover:shadow-[0_26px_50px_-6px_rgba(148,163,184,0.48)]'
        : 'bg-[#FFF9F0] rounded-[24px] sm:rounded-[26px] border-[2px] border-[#C99A38] shadow-[0_18px_40px_-8px_rgba(180,135,50,0.32),0_8px_18px_-4px_rgba(74,16,25,0.16)] ring-1 ring-[#FFE8AA]/70 hover:shadow-[0_26px_50px_-6px_rgba(201,154,56,0.42)]'
    } hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden group h-full`}>
      {/* 1. Product Image Section - Blends seamlessly with jewellery color */}
      <div
        onClick={() => onViewProduct(item)}
        className={`relative w-full h-[310px] sm:h-[335px] lg:h-[355px] overflow-hidden ${
          isSilverOrDiamond ? 'bg-[#F8FAFC]' : 'bg-[#FAF5EC]'
        } cursor-pointer`}
      >
        {/* Ambient subtle image backdrop to eliminate any left/right gaps */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src={currentImage}
            alt=""
            className="w-full h-full object-cover blur-2xl scale-125 opacity-35"
            aria-hidden="true"
          />
        </div>

        {/* Safe bottom clearance so no jewellery parts are cropped by the curve */}
        <div className="absolute inset-0 pb-8 sm:pb-9 flex items-center justify-center">
          <img
            src={currentImage}
            alt={`${item.name} - View ${activeImageIndex + 1}`}
            className="block w-full h-full max-w-none object-cover transition-transform duration-700 ease-out select-none group-hover:scale-105 relative z-10"
            style={{ objectPosition: objectPositionStyle }}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = isDiamond
                ? '/images/diamonds/diamond_tennis_bracelet.jpg'
                : isSilver
                  ? '/images/product_silver_bowl.jpg'
                  : '/images/product_gold_chain.jpg';
            }}
          />
        </div>

        {/* 2. Top-Left: Certification pill with metal-specific styling */}
        <div className="absolute top-3.5 left-3.5 z-20 pointer-events-none">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] sm:text-[11px] font-bold tracking-wider uppercase ${
            isSilverOrDiamond
              ? 'bg-[#F8FAFC] text-[#0F172A] border border-[#CBD5E1] shadow-sm'
              : 'bg-[#FFF9F0] text-[#3B0710] border border-[#E8C77D] shadow-sm'
          } backdrop-blur-md`}>
            <span className={`text-[9px] font-bold leading-none ${isSilverOrDiamond ? 'text-[#0284C7]' : 'text-[#C99A38]'}`}>
              {isSilverOrDiamond ? '✦' : '▲'}
            </span>
            <span className="truncate max-w-[190px]">{topBadgeText}</span>
          </span>
        </div>

        {/* 3. Top-Right: Circular Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAddToWishlist(item);
          }}
          className={`absolute top-3.5 right-3.5 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full ${
            isSilverOrDiamond
              ? 'bg-[#0F172A]/70 hover:bg-[#0F172A]/90 border border-[#CBD5E1]/70'
              : 'bg-[#31050D]/60 hover:bg-[#31050D]/90 border border-[#C99A38]/70'
          } backdrop-blur-md flex items-center justify-center text-white transition-all shadow-md active:scale-90 cursor-pointer`}
          title={isWishlisted ? 'Item in Wishlist' : 'Add to Wishlist'}
          aria-label={isWishlisted ? 'Item in Wishlist' : 'Add to Wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-[#E53935] text-[#E53935]' : 'text-white stroke-[2]'
            }`}
          />
        </button>

        {/* Multi-angle indicator dots if multiple images */}
        {images.length > 1 && (
          <div className="absolute bottom-12 inset-x-0 flex justify-center gap-1.5 z-20 pointer-events-auto">
            <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? isSilverOrDiamond ? 'bg-[#CBD5E1] scale-125 ring-1 ring-white' : 'bg-[#E8C77D] scale-125 ring-1 ring-white'
                      : 'bg-white/50 hover:bg-white'
                  }`}
                  title={`View angle ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* 4. Smooth asymmetric curved wave transition (Silver for Diamonds & Silver, Gold for Gold) */}
        <div className="absolute -bottom-[1px] inset-x-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
          <svg viewBox="0 0 400 48" fill="none" preserveAspectRatio="none" className="w-full h-11 sm:h-13 block">
            <defs>
              <linearGradient id={safeGradId} x1="0%" y1="0%" x2="100%" y2="0%">
                {isSilverOrDiamond ? (
                  <>
                    <stop offset="0%" stopColor="#94A3B8" />
                    <stop offset="25%" stopColor="#CBD5E1" />
                    <stop offset="50%" stopColor="#FFFFFF" />
                    <stop offset="75%" stopColor="#CBD5E1" />
                    <stop offset="100%" stopColor="#94A3B8" />
                  </>
                ) : (
                  <>
                    <stop offset="0%" stopColor="#C99A38" />
                    <stop offset="25%" stopColor="#E8C77D" />
                    <stop offset="50%" stopColor="#FFF2C8" />
                    <stop offset="75%" stopColor="#E8C77D" />
                    <stop offset="100%" stopColor="#C99A38" />
                  </>
                )}
              </linearGradient>

              {/* Radiant glow filter */}
              <filter id={`waveGlow-${safeGradId}`} x="-30%" y="-50%" width="160%" height="220%">
                {isSilverOrDiamond ? (
                  <>
                    <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#E2E8F0" floodOpacity="0.95" />
                    <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor="#CBD5E1" floodOpacity="0.85" />
                    <feDropShadow dx="0" dy="1" stdDeviation="12" floodColor="#94A3B8" floodOpacity="0.6" />
                  </>
                ) : (
                  <>
                    <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#FEE6A8" floodOpacity="0.9" />
                    <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor="#E8C77D" floodOpacity="0.8" />
                    <feDropShadow dx="0" dy="1" stdDeviation="12" floodColor="#C99A38" floodOpacity="0.6" />
                  </>
                )}
              </filter>
            </defs>

            {/* Ambient glow underlayer */}
            <path
              d="M 0,28 C 50,22 100,28 150,38 C 200,47 250,47 310,32 C 350,20 380,10 400,4"
              stroke={isSilverOrDiamond ? "#E2E8F0" : "#FFE8A3"}
              strokeWidth="6.5"
              strokeLinecap="round"
              opacity="0.6"
              className="blur-[2.5px]"
            />

            {/* Cutout filling with lower card background */}
            <path
              d="M 0,28 C 50,22 100,28 150,38 C 200,47 250,47 310,32 C 350,20 380,10 400,4 L 400,48 L 0,48 Z"
              fill={isSilverOrDiamond ? "#FFFFFF" : "#FFF9F0"}
            />

            {/* Glowing metallic accent wave line */}
            <path
              d="M 0,28 C 50,22 100,28 150,38 C 200,47 250,47 310,32 C 350,20 380,10 400,4"
              stroke={`url(#${safeGradId})`}
              strokeWidth="4.5"
              strokeLinecap="round"
              filter={`url(#waveGlow-${safeGradId})`}
            />

            {/* Delicate highlight shimmer along the wave apex */}
            <path
              d="M 0,28 C 50,22 100,28 150,38 C 200,47 250,47 310,32 C 350,20 380,10 400,4"
              stroke={isSilverOrDiamond ? "#FFFFFF" : "#FFFDF5"}
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.95"
            />
          </svg>
        </div>
      </div>

      {/* 5. Product Information Section */}
      <div className={`p-5 sm:p-6 flex-1 flex flex-col justify-between ${
        isSilverOrDiamond ? 'bg-white' : 'bg-[#FFF9F0]'
      } space-y-3`}>
        <div className="space-y-3">
          {/* Product Title - Clean line-height preventing descenders from colliding */}
          <h3
            onClick={() => onViewProduct(item)}
            className={`text-[19px] sm:text-[21px] lg:text-[22px] font-bold ${
              isSilverOrDiamond ? 'text-[#0F172A] group-hover:text-[#334155]' : 'text-[#4A1019] group-hover:text-[#3B0710]'
            } font-serif leading-[1.38] line-clamp-2 transition-colors cursor-pointer tracking-normal`}
            title={item.name}
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {item.name}
          </h3>

          {/* 6. Specification Badges */}
          <div className="flex items-center gap-2.5 pt-1 whitespace-nowrap overflow-hidden">
            {/* Weight / Spec Badge */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
              isSilverOrDiamond
                ? 'bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]'
                : 'bg-[#FAF3E5] border border-[#E8C77D] text-[#4A1019]'
            } text-[11.5px] sm:text-xs font-semibold shadow-2xs shrink-0`}>
              <svg
                className={`w-3.5 h-3.5 ${isSilverOrDiamond ? 'text-[#64748B]' : 'text-[#C99A38]'} shrink-0`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                <path d="M7 21h10" />
                <path d="M12 3v18" />
                <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
              </svg>
              <span>{displayWeight}</span>
            </div>

            {/* Hallmark / Certification Badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
                isSilverOrDiamond
                  ? 'bg-[#F1F5F9] border border-[#CBD5E1] text-[#0F172A]'
                  : 'bg-[#FFFDF9] border border-[#E8C77D] text-[#4A1019]'
              } text-[11.5px] sm:text-xs font-semibold shadow-2xs shrink-0 min-w-0`}
              title={hallmarkBadgeText}
            >
              <svg
                className={`w-3.5 h-3.5 ${isSilverOrDiamond ? 'text-[#0284C7]' : 'text-[#C99A38]'} shrink-0`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span className="truncate">{hallmarkBadgeText}</span>
            </div>
          </div>
        </div>

        {/* 7. Decorative Divider (Silver for Diamond & Silver, Gold for Gold) */}
        <div className="my-3 sm:my-3.5 flex items-center justify-center gap-2 select-none">
          <span className={`h-[1px] w-12 sm:w-16 ${
            isSilverOrDiamond
              ? 'bg-gradient-to-r from-transparent via-[#CBD5E1] to-[#94A3B8]'
              : 'bg-gradient-to-r from-transparent via-[#E8C77D] to-[#C99A38]'
          }`} />
          {isSilverOrDiamond ? (
            <svg className="w-4 h-4 text-[#64748B] shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 3h12l4 7-10 11L2 10l4-7z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-[#C99A38] shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
            </svg>
          )}
          <span className={`h-[1px] w-12 sm:w-16 ${
            isSilverOrDiamond
              ? 'bg-gradient-to-l from-transparent via-[#CBD5E1] to-[#94A3B8]'
              : 'bg-gradient-to-l from-transparent via-[#E8C77D] to-[#C99A38]'
          }`} />
        </div>

        {/* 8. Product Footer */}
        <div className={`mt-auto pt-1 flex items-center justify-between gap-2 border-t ${
          isSilverOrDiamond ? 'border-[#E2E8F0]' : 'border-[#E8C77D]/40'
        }`}>
          {/* Product Price */}
          <span className={`text-xl sm:text-[23px] font-bold ${
            isSilverOrDiamond ? 'text-[#0F172A]' : 'text-[#4A1019]'
          } font-serif tracking-tight whitespace-nowrap`}>
            {displayPrice}
          </span>

          {/* Details & Add to Cart buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onViewProduct(item)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full ${
                isSilverOrDiamond
                  ? 'bg-[#F8FAFC] border border-[#CBD5E1] hover:border-[#94A3B8] text-[#0F172A] hover:bg-[#F1F5F9]'
                  : 'bg-[#FFF9F0] border border-[#4A1019]/60 hover:border-[#4A1019] text-[#4A1019] hover:bg-[#FAF3E5]'
              } text-xs font-semibold transition-all duration-200 cursor-pointer shadow-2xs active:scale-95`}
            >
              <Eye className={`w-3.5 h-3.5 ${isSilverOrDiamond ? 'text-[#0F172A]' : 'text-[#4A1019]'}`} />
              <span>Details</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(item);
              }}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full ${
                isSilverOrDiamond
                  ? 'bg-[#0F172A] hover:bg-[#1E293B] text-[#F8FAFC]'
                  : 'bg-[#4A1019] hover:bg-[#3B0710] text-white'
              } text-xs font-semibold shadow-sm hover:shadow transition-all duration-200 cursor-pointer active:scale-95`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-white" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

