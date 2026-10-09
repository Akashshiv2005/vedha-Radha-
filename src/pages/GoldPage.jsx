import React, { useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { products } from '../data/products';
import { goldCategories } from '../data/categoryData';
import { 
  Sparkles, 
  ChevronRight, 
  Heart, 
  ShoppingBag, 
  ShieldCheck, 
  ArrowLeft, 
  PhoneCall, 
  SlidersHorizontal,
  Gem,
  CircleDot,
  Crown,
  Filter,
  Layers,
  Check,
  X
} from 'lucide-react';

const CATEGORY_MAP = {
  // Main Categories
  'earrings': { 
    title: 'Gold Earrings Collection', 
    desc: 'From royal Chettinad antique jhumkas to daily wear studs in 22K BIS 916 hallmarked gold.',
    parent: null
  },
  'studs': { 
    title: '22K Gold Studs', 
    desc: 'Delicate everyday floral, pearl cluster, and solitaire-style gemstone studs.',
    parent: { name: 'Earrings', slug: 'earrings', path: '/gold/earrings' }
  },
  'hangings': { 
    title: 'Gold Hanging Earrings', 
    desc: 'Graceful dangling earrings and chandelier hangings with fine gold bead droplets.',
    parent: { name: 'Earrings', slug: 'earrings', path: '/gold/earrings' }
  },
  'drops': { 
    title: 'Gold Drop Earrings', 
    desc: 'Heirloom tear-drop and oval antique drops adorned with rubies and emeralds.',
    parent: { name: 'Earrings', slug: 'earrings', path: '/gold/earrings' }
  },
  'jhumkas': { 
    title: 'Chettinad Royal Gold Jhumkas', 
    desc: 'Grand multi-tier bell jhumkas inspired by South Indian temple architecture.',
    parent: { name: 'Earrings', slug: 'earrings', path: '/gold/earrings' }
  },
  'hoops-bali': { 
    title: 'Gold Hoops & Bali Earrings', 
    desc: 'Classic circular South Indian balis, twisted hoop earrings, and lightweight daily loops.',
    parent: { name: 'Earrings', slug: 'earrings', path: '/gold/earrings' }
  },

  // Rings
  'rings': { 
    title: 'Gold Rings Collection', 
    desc: 'Artisanal 22K cocktail rings, engagement bands, and auspicious gemstone signet rings.',
    parent: null
  },
  'engagement-rings': { 
    title: 'Gold Engagement Rings', 
    desc: 'Auspicious proposal bands, filigree solitaires, and eternity wedding rings.',
    parent: { name: 'Rings', slug: 'rings', path: '/gold/rings' }
  },
  'casual-rings': { 
    title: 'Casual & Daily Wear Gold Rings', 
    desc: 'Comfort-fit lightweight gold rings, floral bands, and stackable modern accents.',
    parent: { name: 'Rings', slug: 'rings', path: '/gold/rings' }
  },

  // Bangles & Bracelets
  'bangles': { 
    title: 'Gold Bangles & Bracelets', 
    desc: 'Antique finish screw-kadas, traditional valayal sets, and lightweight daily bracelets.',
    parent: null
  },
  'cuff-bracelets': { 
    title: 'Gold Cuff Bracelets', 
    desc: 'Heavy structured kadas, open cuff bangles, and peacock-embossed wrist cuffs.',
    parent: { name: 'Bangle & Bracelets', slug: 'bangles', path: '/gold/bangles' }
  },
  'chain-bracelets': { 
    title: 'Gold Chain Bracelets', 
    desc: 'Flexible woven link bracelets, watch-charm bangles, and delicate gold wrist chains.',
    parent: { name: 'Bangle & Bracelets', slug: 'bangles', path: '/gold/bangles' }
  },
  'bangle-bracelets': { 
    title: 'Gold Bangle Bracelets', 
    desc: 'Contemporary hinge-lock bangle bracelets crafted for festive styling.',
    parent: { name: 'Bangle & Bracelets', slug: 'bangles', path: '/gold/bangles' }
  },

  // Necklaces
  'necklaces': { 
    title: 'Gold Necklaces & Harams', 
    desc: 'Heritage temple choker necklaces, long harams, and bridal kasu malas in 22K gold.',
    parent: null
  },
  'short-necklace': { 
    title: 'Short Gold Necklaces & Chokers', 
    desc: 'Close-fitting temple collar chokers, mango malas, and festive short necklaces.',
    parent: { name: 'Necklaces', slug: 'necklaces', path: '/gold/necklaces' }
  },
  'long-necklace': { 
    title: 'Long Gold Harams & Kasu Malas', 
    desc: 'Grand 22-to-28 inch long bridal harams, coin malas, and multi-tier heirloom necklaces.',
    parent: { name: 'Necklaces', slug: 'necklaces', path: '/gold/necklaces' }
  },

  // Nosepin
  'nosepin': { 
    title: '22K Gold Nosepins & Mookuthi', 
    desc: 'Traditional South Indian stone mookuthi, floral diamond studs, and clip-on nose rings.',
    parent: null
  },

  // Occasion
  'occasion': { 
    title: 'Occasion Wear Gold Jewellery', 
    desc: 'Curated 22K jewellery ensembles tailored for casual days, celebrations, and wedding muhurthams.',
    parent: null
  },
  'casual-wear': { 
    title: 'Casual & Daily Wear Gold', 
    desc: 'Understated, lightweight 22K gold essentials designed for daily elegance and durability.',
    parent: { name: 'Occasion', slug: 'occasion', path: '/gold/occasion' }
  },
  'party-wear': { 
    title: 'Party & Festive Wear Gold', 
    desc: 'Radiant statement pieces, cocktail rings, and gemstone-accented jewellery for celebrations.',
    parent: { name: 'Occasion', slug: 'occasion', path: '/gold/occasion' }
  },
  'traditional-wear': { 
    title: 'Traditional & Muhurtham Wedding Gold', 
    desc: 'Auspicious temple harams, antique kadas, Kasu malas, and bridal heirloom sets.',
    parent: { name: 'Occasion', slug: 'occasion', path: '/gold/occasion' }
  },

  // Chains & Pendants
  'chains': { 
    title: '22K Gold Chains', 
    desc: 'Hand-woven mugappu chains, hollow rope links, and durable everyday 22K chains.',
    parent: null
  },
  'pendants': { 
    title: '22K Gold Pendants', 
    desc: 'Sacred temple deities, peacock medallions, and floral repoussé lockets in 22K gold.',
    parent: null
  },
  'bridal-jewellery': { 
    title: 'Bridal Gold Jewellery', 
    desc: 'Complete auspicious Muhurtham wedding trousseau sets and temple bridal jewelry.',
    parent: null
  }
};

// Helper for custom category gold line-art icons matching exact design reference
function getCategoryIcon(slug, isActive = false) {
  const iconColor = isActive ? 'text-[#CFA85A]' : 'text-[#B89248]';

  switch (slug) {
    case 'all':
      return (
        <svg className={`w-4 h-4 shrink-0 ${iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case 'earrings':
      return (
        <svg className={`w-4 h-4 shrink-0 ${iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="3.5" r="1.5" />
          <path d="M12 5V7.5" />
          <path d="M6.5 14C6.5 10 9 7.5 12 7.5C15 7.5 17.5 10 17.5 14H6.5Z" />
          <path d="M7 14L6 17M12 14V18M17 14L18 17" />
          <circle cx="6" cy="17.5" r="0.8" fill="currentColor" />
          <circle cx="12" cy="18.5" r="0.8" fill="currentColor" />
          <circle cx="18" cy="17.5" r="0.8" fill="currentColor" />
        </svg>
      );
    case 'rings':
      return (
        <svg className={`w-4 h-4 shrink-0 ${iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="14" r="6" />
          <path d="M9.5 5.5L12 2.5L14.5 5.5L13.5 8H10.5L9.5 5.5Z" />
          <path d="M10.5 8L12 5L13.5 8" />
        </svg>
      );
    case 'bangles':
      return (
        <svg className={`w-4 h-4 shrink-0 ${iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="12" rx="8" ry="6" transform="rotate(-30 12 12)" />
          <ellipse cx="12" cy="12" rx="6" ry="4.2" transform="rotate(-30 12 12)" />
          <line x1="7" y1="8" x2="8.5" y2="10" strokeWidth="1.2" />
          <line x1="15.5" y1="14" x2="17" y2="16" strokeWidth="1.2" />
        </svg>
      );
    case 'necklaces':
      return (
        <svg className={`w-4 h-4 shrink-0 ${iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 6C5 12.5 8.2 17 12 17C15.8 17 19 12.5 19 6" />
          <circle cx="6.5" cy="10" r="0.9" fill="currentColor" />
          <circle cx="9" cy="13.5" r="0.9" fill="currentColor" />
          <circle cx="15" cy="13.5" r="0.9" fill="currentColor" />
          <circle cx="17.5" cy="10" r="0.9" fill="currentColor" />
          <path d="M12 17V19.5" />
          <circle cx="12" cy="20.5" r="1.2" fill="currentColor" />
        </svg>
      );
    case 'nosepin':
      return (
        <svg className={`w-4 h-4 shrink-0 ${iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          <path d="M12 5C12 7.5 10.5 8.8 12 10.5C13.5 8.8 12 7.5 12 5Z" />
          <path d="M12 19C12 16.5 10.5 15.2 12 13.5C13.5 15.2 12 16.5 12 19Z" />
          <path d="M5 12C7.5 12 8.8 10.5 10.5 12C8.8 13.5 7.5 12 5 12Z" />
          <path d="M19 12C16.5 12 15.2 10.5 13.5 12C15.2 13.5 16.5 12 19 12Z" />
          <path d="M7 7C8.5 8.5 9.5 9.5 11 11C9.5 9.5 8.5 8.5 7 7Z" />
          <path d="M17 17C15.5 15.5 14.5 14.5 13 13C14.5 14.5 15.5 15.5 17 17Z" />
          <path d="M17 7C15.5 8.5 14.5 9.5 13 11C14.5 9.5 15.5 8.5 17 7Z" />
          <path d="M7 17C8.5 15.5 9.5 14.5 11 13C9.5 14.5 8.5 15.5 7 17Z" />
        </svg>
      );
    case 'occasion':
      return (
        <svg className={`w-4 h-4 shrink-0 ${iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5C12 8.5 10.5 11.5 12 16C13.5 11.5 12 8.5 12 5Z" />
          <path d="M12 16C9.5 11.5 5 13 5 15.5C5 18 9 18.5 12 18.5C15 18.5 19 18 19 15.5C19 13 14.5 11.5 12 16Z" />
          <path d="M8 17C6.5 17.5 4.5 19 4.5 20H19.5C19.5 19 17.5 17.5 16 17" />
        </svg>
      );
    case 'chains':
      return (
        <svg className={`w-4 h-4 shrink-0 ${iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="7" y="10" width="10" height="4" rx="2" transform="rotate(-45 12 12)" />
          <path d="M7.5 8.5L5 11C3.89543 12.1046 3.89543 13.8954 5 15C6.10457 16.1046 7.89543 16.1046 9 15L11.5 12.5" />
          <path d="M16.5 15.5L19 13C20.1046 11.8954 20.1046 10.1046 19 9C17.8954 7.89543 16.1046 7.89543 15 9L12.5 11.5" />
        </svg>
      );
    case 'pendants':
      return (
        <svg className={`w-4 h-4 shrink-0 ${iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="4" r="1.5" />
          <path d="M12 5.5V7.5" />
          <path d="M12 7.5C8.5 11.5 7 14.5 7 17C7 19.8 9.2 22 12 22C14.8 22 17 19.8 17 17C17 14.5 15.5 11.5 12 7.5Z" />
          <circle cx="12" cy="16" r="1.5" fill="currentColor" />
        </svg>
      );
    default:
      return <Gem className={`w-4 h-4 shrink-0 ${iconColor}`} />;
  }
}

export default function GoldPage({
  onViewProduct = () => {},
  onAddToCart = () => {},
  onAddToWishlist = () => {},
  wishlistItems = []
}) {
  const { subCategory, category, subType } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [sortBy, setSortBy] = useState('featured');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [priceFilter, setPriceFilter] = useState('all'); // 'all' | 'under50k' | '50k-100k' | 'above100k'

  // Identify active category key from either single-level or nested route
  const activeKey = (subType || subCategory || category || 'all').toLowerCase();
  const activeMainCat = (category || subCategory || 'all').toLowerCase();

  const categoryInfo = CATEGORY_MAP[activeKey] || {
    title: '22K Hallmarked Gold Jewellery',
    desc: 'Explore our complete range of BIS 916 certified South Indian bridal necklaces, antique bangles, earrings, and temple jewels.',
    parent: null
  };

  // Smooth scroll helper to navigate directly to catalog products instead of jumping to hero
  const isInitialMount = React.useRef(true);
  const scrollToCatalog = () => {
    setTimeout(() => {
      const el = document.getElementById('gold-catalog-section');
      if (el) {
        const yOffset = -90; // offset for sticky showroom header
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 50);
  };

  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    scrollToCatalog();
  }, [activeKey, activeMainCat, location.pathname]);

  // Filter products matching category or subcategory
  const filteredProducts = products.filter(item => {
    if (item.category !== 'Gold') return false;

    // Category match
    let matchesCategory = false;
    if (activeKey === 'all') {
      matchesCategory = true;
    } else if (subType) {
      // Direct subcategory view (e.g., /gold/earrings/studs, /gold/rings/engagement-rings, /gold/occasion/casual-wear)
      matchesCategory = (
        item.subType === activeKey ||
        item.subCategorySlug === activeKey ||
        item.occasion === activeKey
      );
    } else if (activeMainCat === 'all') {
      matchesCategory = true;
    } else if (activeMainCat === 'earrings') {
      matchesCategory = (item.subCategory === 'earrings' || item.subCategorySlug === 'earrings');
    } else if (activeMainCat === 'necklaces') {
      matchesCategory = (item.subCategory === 'necklaces' || item.subCategorySlug === 'necklaces');
    } else if (activeMainCat === 'bangles') {
      matchesCategory = (item.subCategory === 'bangles' || item.subCategorySlug === 'bangles');
    } else if (activeMainCat === 'rings') {
      matchesCategory = (item.subCategory === 'rings' || item.subCategorySlug === 'rings');
    } else if (activeMainCat === 'occasion') {
      matchesCategory = (item.subCategory === 'occasion' || item.occasion || item.isBridal);
    } else if (activeMainCat === 'nosepin') {
      matchesCategory = (item.subCategory === 'nosepin' || item.subCategorySlug === 'nosepin' || item.subType === 'nosepin');
    } else if (activeMainCat === 'chains') {
      matchesCategory = (item.subCategory === 'chains' || item.subCategorySlug === 'chains' || item.subType === 'chains');
    } else if (activeMainCat === 'pendants') {
      matchesCategory = (item.subCategory === 'pendants' || item.subCategorySlug === 'pendants' || item.subType === 'pendants');
    } else {
      matchesCategory = (
        item.subType === activeKey ||
        item.subCategorySlug === activeKey ||
        item.subCategory === activeKey ||
        item.occasion === activeKey
      );
    }

    if (!matchesCategory) return false;

    // Price Filter
    if (priceFilter === 'under50k' && item.numericPrice > 50000) return false;
    if (priceFilter === '50k-100k' && (item.numericPrice <= 50000 || item.numericPrice > 100000)) return false;
    if (priceFilter === 'above100k' && item.numericPrice <= 100000) return false;

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.numericPrice - b.numericPrice;
    if (sortBy === 'price-high') return b.numericPrice - a.numericPrice;
    return 0;
  });

  // Find subcategories for the current main category
  const currentCategoryData = goldCategories.find(c => c.slug === activeMainCat || c.slug === activeKey);
  const activeSubcategories = currentCategoryData?.subcategories || [];

  return (
    <div className="bg-[#FAF7F2] min-h-screen border-b border-[#EAE2D5] font-sans selection:bg-[#581923] selection:text-white">
      
      {/* Breadcrumb Navigation Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-4 sm:pt-6 pb-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#7A6E65] flex-wrap">
          <Link to="/" className="hover:text-[#581923] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#B38E46] shrink-0" />
          <Link to="/gold" className={`hover:text-[#581923] transition-colors ${activeKey === 'all' ? 'font-bold text-[#581923]' : ''}`}>
            Gold Jewellery
          </Link>
          
          {categoryInfo.parent && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[#B38E46] shrink-0" />
              <Link to={categoryInfo.parent.path} className="hover:text-[#581923] transition-colors">
                {categoryInfo.parent.name}
              </Link>
            </>
          )}

          {activeKey !== 'all' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[#B38E46] shrink-0" />
              <span className="font-semibold text-[#581923] capitalize">
                {activeKey.replace(/-/g, ' ')}
              </span>
            </>
          )}
        </nav>
      </div>

      {/* ========================================================================= */}
      {/* FULL-WIDTH PREMIUM SPLIT HERO BANNER                                      */}
      {/* ========================================================================= */}
      <div className="w-full bg-[#2D0F15] overflow-hidden shadow-lg border-y border-[#521B24] mb-8 sm:mb-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 min-h-[300px] lg:min-h-[440px]">
          
          {/* Left Column: Lifestyle Image with Traditional Saree & Gold Jewellery */}
          <div className="relative w-full h-[280px] sm:h-[360px] lg:h-full min-h-[280px] lg:min-h-[440px] overflow-hidden bg-[#1E080D]">
            <img
              src="/images/col_gold.jpg"
              alt="South Indian Traditional Gold Jewellery with Saree"
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
              loading="eager"
            />
            {/* Subtle inner shadow gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/50 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Right Column: Deep Maroon / Chocolate Panel with Warm Gold & Ivory Copy */}
          <div className="p-8 sm:p-12 lg:p-16 xl:p-20 flex flex-col justify-center bg-gradient-to-br from-[#3B1117] via-[#2E0E15] to-[#240B10] text-[#FAF6EE] relative">
            {/* Eyebrow */}
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.25em] text-[#E5C278] uppercase mb-2 sm:mb-3 block font-sans">
              VEDA RADHA THANGAMAALIGAI
            </span>

            {/* Main Heading */}
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-[44px] font-bold text-white tracking-tight leading-[1.15]">
              The Radiance of Pure Gold
            </h1>

            {/* Supporting Description */}
            <p className="text-xs sm:text-sm text-[#E6D4D6] mt-3 sm:mt-4 leading-relaxed max-w-xl font-sans">
              Discover timeless South Indian jewellery for life’s most treasured moments—from everyday elegance to wedding celebrations.
            </p>

            {/* Subtle BIS 916 Hallmark Assurance Pill */}
            <div className="mt-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#E5C278]/30 text-[#E5C278] text-[11px] font-medium self-start">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E5C278]" />
              <span>22K (916) BIS Hallmarked Heritage Craft</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN CATALOG CONTENT CONTAINER                                            */}
      {/* ========================================================================= */}
      <div id="gold-catalog-section" className="max-w-[1440px] mx-auto px-4 sm:px-8 pb-12 scroll-mt-24">
        
        {/* CENTERED SECTION HEADING & LOTUS FLOURISH */}
        <div className="text-center mb-6">
          {/* "Gold Collections" in Deep Navy Serif Typography */}
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#0C1E44] tracking-tight mb-2.5">
            Gold Collections
          </h2>

          {/* Centered 5-Petal Lotus Divider */}
          <div className="flex items-center justify-center gap-3.5 mb-6">
            <div className="h-[1.5px] bg-gradient-to-r from-transparent via-[#C8A058] to-[#C8A058] w-16 sm:w-28 opacity-90" />

            <div className="text-[#C8A058] flex items-center justify-center">
              <svg
                className="w-7 h-7 text-[#C8A058]"
                viewBox="0 0 40 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Center Petal */}
                <path d="M20 4C16.8 8.2 16.8 13.2 20 19" />
                <path d="M20 4C23.2 8.2 23.2 13.2 20 19" />

                {/* Left Inner Petal */}
                <path d="M20 19C16.5 14 11.8 11.5 10.5 13.8C9.3 16.2 13.5 19 20 19Z" />

                {/* Right Inner Petal */}
                <path d="M20 19C23.5 14 28.2 11.5 29.5 13.8C30.7 16.2 26.5 19 20 19Z" />

                {/* Left Outer Petal */}
                <path d="M19 19.5C14.5 17.2 8.2 17.5 6.5 20C5.3 22 11.8 22.8 19.5 20.5" />

                {/* Right Outer Petal */}
                <path d="M21 19.5C25.5 17.2 31.8 17.5 33.5 20C34.7 22 28.2 22.8 20.5 20.5" />

                {/* Bottom Lotus Curve */}
                <path d="M10 21C13.5 23.5 16.8 24.5 20 24.5C23.2 24.5 26.5 23.5 30 21" />
              </svg>
            </div>

            <div className="h-[1.5px] bg-gradient-to-l from-transparent via-[#C8A058] to-[#C8A058] w-16 sm:w-28 opacity-90" />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CATEGORY FILTERS: Exact Reference Pill Design & Custom Gold Vector Icons  */}
        {/* ========================================================================= */}
        <div className="mb-6">
          <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto scrollbar-none pb-2 sm:pb-0 px-1 sm:justify-center">
            
            {/* "All Gold (N)" Pill */}
            <Link
              to="/gold"
              onClick={scrollToCatalog}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-xs shrink-0 ${
                activeKey === 'all'
                  ? 'bg-[#4D141C] text-white border border-[#4D141C] shadow-md'
                  : 'bg-white text-[#1C273C] hover:text-[#581923] hover:border-[#C8A058] border border-[#E7DFD3]'
              }`}
            >
              {getCategoryIcon('all', activeKey === 'all')}
              <span>All Gold ({products.filter(p => p.category === 'Gold').length})</span>
            </Link>

            {/* Category Shortcut Pills */}
            {goldCategories.map(cat => {
              const isActive = activeMainCat === cat.slug;
              return (
                <Link
                  key={cat.id}
                  to={cat.path}
                  onClick={scrollToCatalog}
                  className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-xs shrink-0 ${
                    isActive
                      ? 'bg-[#4D141C] text-white border border-[#4D141C] shadow-md'
                      : 'bg-white text-[#1C273C] hover:text-[#581923] hover:border-[#C8A058] border border-[#E7DFD3]'
                  }`}
                >
                  {getCategoryIcon(cat.slug, isActive)}
                  <span>{cat.name}</span>
                </Link>
              );
            })}

            {/* Dark Navy "Filter" Button with Filter Icon */}
            <button
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-xs shrink-0 ${
                isFilterDrawerOpen || priceFilter !== 'all'
                  ? 'bg-[#121B28] text-[#E5C278] border border-[#E5C278] shadow-md'
                  : 'bg-[#1A2536] hover:bg-[#111A27] text-white border border-[#1A2536]'
              }`}
              title="Toggle Price & Purity Filter"
              aria-label="Filter products"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#E5C278] shrink-0" />
              <span>Filter</span>
              {priceFilter !== 'all' && (
                <span className="w-2 h-2 rounded-full bg-[#E5C278]" />
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Filter Panel (When Filter is toggled) */}
        {isFilterDrawerOpen && (
          <div className="bg-white border border-[#E2D7C8] rounded-2xl p-4 sm:p-5 mb-6 shadow-sm animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#EAE2D5] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#581923]" />
                <h3 className="font-serif text-sm font-bold text-[#241716]">
                  Filter Gold Jewellery
                </h3>
              </div>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1"
                aria-label="Close filters"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-gray-500 font-medium">Price Range:</span>
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under50k', label: 'Under ₹50,000' },
                { id: '50k-100k', label: '₹50,000 - ₹1,00,000' },
                { id: 'above100k', label: 'Above ₹1,00,000' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setPriceFilter(opt.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    priceFilter === opt.id
                      ? 'bg-[#581923] text-white shadow-xs'
                      : 'bg-[#FAF7F2] text-gray-700 hover:bg-[#F3EAD3] border border-[#DECDBB]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Secondary Subcategory Sub-pills (When inside a category with subcategories) */}
        {activeSubcategories.length > 0 && (
          <div className="bg-[#FAF3E3] p-3 rounded-xl border border-[#E8DFC0] mb-6 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-bold text-[#8C6D2D] uppercase tracking-wider pl-1 shrink-0">
              {currentCategoryData.name} Styles:
            </span>
            <Link
              to={currentCategoryData.path}
              onClick={scrollToCatalog}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeKey === currentCategoryData.slug
                  ? 'bg-[#581923] text-white'
                  : 'bg-white/80 text-[#3A2E28] hover:bg-white border border-[#DECDBB]'
              }`}
            >
              View All
            </Link>
            {activeSubcategories.map(sub => {
              const isSubActive = activeKey === sub.slug;
              return (
                <Link
                  key={sub.slug}
                  to={sub.path}
                  onClick={scrollToCatalog}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isSubActive
                      ? 'bg-[#581923] text-white'
                      : 'bg-white/80 text-[#3A2E28] hover:bg-white border border-[#DECDBB]'
                  }`}
                >
                  {sub.name}
                </Link>
              );
            })}
          </div>
        )}

        {/* Toolbar: Result Count & Sort Dropdown aligned neatly to the right */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#DECDBB] text-xs">
          <span className="text-[#7A6E65]">
            Showing <strong className="text-[#2C1D18]">{sortedProducts.length}</strong> designs in {categoryInfo.title}
          </span>

          <div className="flex items-center gap-2">
            <label htmlFor="sort-dropdown" className="text-gray-500 font-medium whitespace-nowrap hidden sm:inline">
              Sort by:
            </label>
            <select
              id="sort-dropdown"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#DECDBB] rounded-lg px-3 py-1.5 text-xs text-[#2C1D18] focus:outline-none focus:border-[#581923] cursor-pointer shadow-xs"
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
            {sortedProducts.map((item) => {
              const isWishlisted = wishlistItems.some(w => w.id === item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-[#E8DFC0] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="relative aspect-square overflow-hidden bg-[#FAF6EE]">
                    <img
                      src={item.image}
                      alt={item.altText || item.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#DCF0DF] text-[#1E5C2D] border border-[#C1E3C6] shadow-xs">
                        {item.badge}
                      </span>
                    </div>

                    <button
                      onClick={() => onAddToWishlist(item)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-[#581923] shadow-md transition-transform active:scale-95 cursor-pointer"
                      title={isWishlisted ? "Item in Wishlist" : "Add to Wishlist"}
                      aria-label={`Add ${item.name} to Wishlist`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#D32F2F] text-[#D32F2F]' : ''}`} />
                    </button>
                  </div>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D2D]">
                          {item.purity || item.details}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F4EFE6] text-[#63574F] capitalize">
                          {item.subType ? item.subType.replace(/-/g, ' ') : item.subCategory}
                        </span>
                      </div>
                      <h3 
                        onClick={() => onViewProduct(item)}
                        className="font-serif text-base font-bold text-[#241716] group-hover:text-[#581923] transition-colors line-clamp-1 mt-1 cursor-pointer"
                      >
                        {item.name}
                      </h3>
                      <p className="text-xs text-[#63574F] line-clamp-2 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#EAE2D5] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#7A6E65] block">Showroom Price</span>
                        <span className="font-serif text-lg font-bold text-[#48161E]">
                          {item.price}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onViewProduct(item)}
                          className="px-3 py-1.5 rounded-md border border-[#581923] text-[#581923] hover:bg-[#FAF0E1] text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => onAddToCart(item)}
                          className="px-3 py-1.5 rounded-md bg-[#581923] hover:bg-[#431219] text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Graceful Dedicated Category Card & Custom Commissioning State */
          <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-[#E8DFC0] my-8 shadow-xs max-w-2xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#FAF3E3] text-[#8C6D2D] flex items-center justify-center mx-auto border border-[#E8DFC0]">
              <Sparkles className="w-7 h-7 text-[#8C6D2D]" />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#241716]">
              {categoryInfo.title} Catalog
            </h2>
            <p className="text-xs sm:text-sm text-[#63574F] leading-relaxed max-w-md mx-auto">
              Our master goldsmiths in Mylapore are hand-forging new 2026 designs for this category. You can explore ready gold collections or contact our showroom for custom bespoke order commissioning with live 22K benchmark rates.
            </p>
            <div className="pt-2 flex justify-center gap-3 flex-wrap">
              <Link
                to="/gold"
                className="inline-flex items-center gap-1.5 bg-[#581923] hover:bg-[#431219] text-white px-5 py-2.5 rounded-lg text-xs font-semibold shadow transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Explore All Gold Jewellery</span>
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 border border-[#581923] text-[#581923] hover:bg-[#FAF0E1] px-5 py-2.5 rounded-lg text-xs font-semibold transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Showroom Custom Commission</span>
              </Link>
            </div>
          </div>
        )}

        {/* Showroom Purity Assurance Footer */}
        <div className="bg-[#FAF3E6] rounded-xl p-5 border border-[#E5D5BA] flex items-center justify-between flex-wrap gap-4 text-xs text-[#52453E]">
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#581923]" />
            <span>100% BIS 916 Hallmark &bull; 0% Deduction on Old Gold Exchange &bull; Lifetime Free Maintenance</span>
          </div>
          <Link to="/contact" className="text-[#581923] font-bold hover:underline">
            Visit Mylapore Showroom &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}
