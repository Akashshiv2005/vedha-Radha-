import React, { useState, useRef } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { silverCategories } from '../data/categoryData';
import { storefrontClient } from '../api/storefrontProductsClient';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  Heart, 
  ShoppingBag, 
  ShieldCheck, 
  ArrowLeft, 
  PhoneCall, 
  ArrowRight,
  Award
} from 'lucide-react';

const SILVER_CATEGORY_MAP = {
  // 1. Earrings
  'earrings': { 
    title: '92.5 Sterling Silver Earrings', 
    desc: 'Artisanal oxidized silver jhumkas, delicate studs, hanging drops, and contemporary balis.',
    parent: null
  },
  'studs': { 
    title: 'Silver Stud Earrings', 
    desc: 'Understated 925 sterling silver daily studs, floral motifs, and cubic zirconia accents.',
    parent: { name: 'Earrings', slug: 'earrings', path: '/silver/earrings' }
  },
  'hangings': { 
    title: 'Silver Hanging Earrings', 
    desc: 'Graceful dangling silver hangings with cascading beads and filigree craftsmanship.',
    parent: { name: 'Earrings', slug: 'earrings', path: '/silver/earrings' }
  },
  'drops': { 
    title: 'Silver Drop Earrings', 
    desc: 'Heirloom tear-drop and oval sterling silver drops with antique oxidized detailing.',
    parent: { name: 'Earrings', slug: 'earrings', path: '/silver/earrings' }
  },
  'jhumkas': { 
    title: 'Handcrafted Silver Jhumkas', 
    desc: 'Traditional South Indian temple bell jhumkas in pure 92.5 sterling silver.',
    parent: { name: 'Earrings', slug: 'earrings', path: '/silver/earrings' }
  },
  'hoops-bali': { 
    title: 'Silver Hoops & Bali Earrings', 
    desc: 'Classic circular silver balis, lightweight hoops, and textured twisted silver rings.',
    parent: { name: 'Earrings', slug: 'earrings', path: '/silver/earrings' }
  },

  // 2. Rings
  'rings': { 
    title: '92.5 Sterling Silver Rings', 
    desc: 'Auspicious bridal metti toe rings, engagement bands, and daily casual silver rings.',
    parent: null
  },
  'engagement-rings': { 
    title: 'Silver Engagement Rings', 
    desc: 'Pure 925 sterling silver couple bands, solitaire rings, and delicate filigree bands.',
    parent: { name: 'Rings', slug: 'rings', path: '/silver/rings' }
  },
  'casual-rings': { 
    title: 'Casual & Daily Wear Silver Rings', 
    desc: 'Stackable minimalist silver bands, auspicious toe rings (metti), and comfort-fit rings.',
    parent: { name: 'Rings', slug: 'rings', path: '/silver/rings' }
  },

  // 3. Bangles & Bracelets
  'bangles': { 
    title: 'Silver Bangles & Bracelets', 
    desc: 'Solid sterling silver kadas, traditional Salem payals, and contemporary wrist bracelets.',
    parent: null
  },
  'cuff-bracelets': { 
    title: 'Silver Cuff Bracelets', 
    desc: 'Structured open cuffs, engraved tribal kadas, and statement silver wristlets.',
    parent: { name: 'Bangle & Bracelets', slug: 'bangles', path: '/silver/bangles' }
  },
  'chain-bracelets': { 
    title: 'Silver Chain Bracelets', 
    desc: 'Flexible curb link bracelets, charm payals, and melodic ankle chain bracelets.',
    parent: { name: 'Bangle & Bracelets', slug: 'bangles', path: '/silver/bangles' }
  },
  'bangle-bracelets': { 
    title: 'Silver Bangle Bracelets', 
    desc: 'Hinged screw-lock silver bangles and lightweight daily wear valayals.',
    parent: { name: 'Bangle & Bracelets', slug: 'bangles', path: '/silver/bangles' }
  },

  // 4. Necklaces
  'necklaces': { 
    title: '92.5 Silver Necklaces & Harams', 
    desc: 'Traditional silver haslis, choker sets, and antique coin kasu malas in pure 925 silver.',
    parent: null
  },
  'short-necklace': { 
    title: 'Short Silver Necklaces & Chokers', 
    desc: 'Close-fitting collar chokers, oxidized silver neckpieces, and festive short necklaces.',
    parent: { name: 'Necklaces', slug: 'necklaces', path: '/silver/necklaces' }
  },
  'long-necklace': { 
    title: 'Long Silver Harams', 
    desc: 'Grand 24-inch traditional silver harams, Kasu coin malas, and festive pendant malas.',
    parent: { name: 'Necklaces', slug: 'necklaces', path: '/silver/necklaces' }
  },

  // 5. Nosepin
  'nosepin': { 
    title: '92.5 Silver Nosepins & Mookuthi', 
    desc: 'Traditional South Indian stone mookuthi, press-on studs, and clip-on silver nose rings.',
    parent: null
  },

  // 6. Occasion
  'occasion': { 
    title: 'Occasion Wear Silver Collection', 
    desc: 'Curated 92.5 sterling silver ensembles for daily elegance, celebrations, and puja rituals.',
    parent: null
  },
  'casual-wear': { 
    title: 'Casual & Daily Wear Silver', 
    desc: 'Anti-tarnish, rhodium-finished 925 chains, lightweight anklets, and everyday bands.',
    parent: { name: 'Occasion', slug: 'occasion', path: '/silver/occasion' }
  },
  'party-wear': { 
    title: 'Party & Festive Wear Silver', 
    desc: 'Oxidized statement jewellery, cocktail rings, and glistening sterling silver accessories.',
    parent: { name: 'Occasion', slug: 'occasion', path: '/silver/occasion' }
  },
  'traditional-wear': { 
    title: 'Traditional & Sacred Silver', 
    desc: 'Auspicious bridal metti, Kamakshi deepams, Ashtalakshmi thalis, and temple payals.',
    parent: { name: 'Occasion', slug: 'occasion', path: '/silver/occasion' }
  },

  // 7. Chains & 8. Pendants
  'chains': { 
    title: '92.5 Sterling Silver Chains', 
    desc: 'Diamond-cut solid rope chains, Italian links, curb chains, and pendant neck chains.',
    parent: null
  },
  'pendants': { 
    title: '92.5 Sterling Silver Pendants', 
    desc: 'Lord Ganesha medallions, Lakshmi motifs, and floral oxidized lockets.',
    parent: null
  },

  // Legacy & Specific Articles
  'anklets': { 
    title: '92.5 Pure Silver Anklets & Payals', 
    desc: 'Melodic ghungroo payals, antique Kasu payals, and Salem bridal ankle kadas.',
    parent: null
  },
  'pooja-items': { 
    title: '92.5 Silver Pooja Articles', 
    desc: 'Hand-chased Ashtalakshmi thali sets, kumkum chimizhs, puja bells, and sacred vessels.',
    parent: null
  },
  'lamps': { 
    title: 'Auspicious Silver Lamps (Vilakku)', 
    desc: 'Authentic Kamakshi Deepam vilakkus and daily prayer oil lamps in 92.5 sterling silver.',
    parent: null
  },
  'toe-rings': { 
    title: 'Auspicious Silver Toe Rings (Metti)', 
    desc: 'Traditional South Indian bridal metti and contemporary sterling silver toe rings.',
    parent: null
  },
  'coins': { 
    title: '999 Pure Silver Coins', 
    desc: 'Certified 999 fine pure silver coins embossed with sacred Goddess Lakshmi, royal peacock, and blooming lotus motifs for puja, gifting, and prosperity.',
    parent: null
  },
  'handcrafted-silver': { 
    title: 'Handcrafted Heritage Silver', 
    desc: 'Chettinad antique finish tribal payals, oxidized silver jewelry, and artisan silverware.',
    parent: null
  }
};

// Helper for custom category silver line-art icons
function getSilverCategoryIcon(slug, isActive = false) {
  const iconColor = isActive ? 'text-[#E2E8F0]' : 'text-[#718096]';

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
    case 'anklets':
      return (
        <svg className={`w-4 h-4 shrink-0 ${iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 10C7 16.5 17 16.5 21 10" />
          <path d="M8 14.5V17" />
          <circle cx="8" cy="18" r="1" fill="currentColor" />
          <path d="M12 15.2V18" />
          <circle cx="12" cy="19" r="1" fill="currentColor" />
          <path d="M16 14.5V17" />
          <circle cx="16" cy="18" r="1" fill="currentColor" />
          <circle cx="3.5" cy="10" r="1" fill="currentColor" />
          <circle cx="20.5" cy="10" r="1" fill="currentColor" />
        </svg>
      );
    case 'toe-rings':
      return (
        <svg className={`w-4 h-4 shrink-0 ${iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="14" rx="7" ry="5" />
          <ellipse cx="12" cy="14" rx="4.5" ry="3" />
          <circle cx="12" cy="6" r="2.5" />
          <circle cx="12" cy="6" r="1" fill="currentColor" />
          <path d="M12 8.5V9.5" />
        </svg>
      );
    case 'coins':
      return (
        <svg className={`w-4 h-4 shrink-0 ${iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="6.5" strokeWidth="1" />
          <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" />
          <path d="M12 7.5V8.5M12 15.5V16.5M7.5 12H8.5M15.5 12H16.5" strokeWidth="1.2" />
        </svg>
      );
    default:
      return <Sparkles className={`w-4 h-4 shrink-0 ${iconColor}`} />;
  }
}

export default function SilverPage({
  searchQuery = '',
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
  const [priceFilter, setPriceFilter] = useState('all');
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [dbProducts, setDbProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const pillTrackRef = useRef(null);

  // Active category / subcategory resolution
  const isBanglesSubStyle = Boolean(subType) && (subType.toLowerCase() === 'bangles' || subType.toLowerCase() === 'bangle-bracelets');
  const activeKey = (subType || subCategory || category || 'all').toLowerCase();
  
  let categoryInfo = SILVER_CATEGORY_MAP[activeKey];
  if (isBanglesSubStyle) {
    categoryInfo = {
      title: 'Silver Bangles',
      desc: 'Hinged screw-lock silver bangles, traditional Salem valayals, and antique kada bangles.',
      parent: { name: 'Bangle & Bracelets', slug: 'bangles', path: '/silver/bangles' }
    };
  } else if (!categoryInfo) {
    categoryInfo = {
      title: '92.5 Sterling Silver Collection',
      desc: 'Explore authentic 925 hallmarked South Indian silver anklets, sacred pooja sets, auspicious lamps, and fine silver ornaments.',
      parent: null
    };
  }
  const activeMainCat = (category || (categoryInfo.parent ? categoryInfo.parent.slug : subCategory) || 'all').toLowerCase();
  const isSubStyleView = Boolean(subType) || Boolean(categoryInfo.parent);

  const checkPillScroll = () => {
    if (!pillTrackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = pillTrackRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  React.useEffect(() => {
    const el = pillTrackRef.current;
    if (el) {
      checkPillScroll();
      el.addEventListener('scroll', checkPillScroll, { passive: true });
      window.addEventListener('resize', checkPillScroll);
      return () => {
        el.removeEventListener('scroll', checkPillScroll);
        window.removeEventListener('resize', checkPillScroll);
      };
    }
  }, []);

  const handlePillScroll = (direction) => {
    if (pillTrackRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      pillTrackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  React.useEffect(() => {
    if (!pillTrackRef.current) return;
    if (activeKey === 'all') {
      pillTrackRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      setTimeout(() => {
        const activePill = pillTrackRef.current?.querySelector('[data-active="true"]');
        if (activePill) {
          activePill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }, 50);
    }
    checkPillScroll();
  }, [activeKey, activeMainCat]);

  // Smooth scroll helper to navigate directly to catalog products instead of jumping to hero
  const isInitialMount = React.useRef(true);
  const scrollToCatalog = () => {
    setTimeout(() => {
      const el = document.getElementById('silver-catalog-section');
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

  const handleExploreSilverClick = () => {
    scrollToCatalog();
  };

  React.useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setApiError(null);

    storefrontClient.getStorefrontProducts({
      category: activeMainCat === 'coins' ? 'coins' : 'silver',
      page_size: 200
    }).then(res => {
      if (!isMounted) return;
      if (res.success) {
        setDbProducts(res.items);
      } else {
        setApiError(res.error || 'Failed to load products');
      }
      setIsLoading(false);
    }).catch(() => {
      if (!isMounted) return;
      setApiError('Unable to connect to product server');
      setIsLoading(false);
    });

    return () => { isMounted = false; };
  }, [activeMainCat]);

  // Filter silver products
  const filteredProducts = dbProducts.filter(item => {
    const isSilver = item.category?.toLowerCase().includes('silver');
    const isCoinsMatch = (activeMainCat === 'coins' || activeMainCat === 'coins-bars') && (item.category?.toLowerCase().includes('coin') || item.category?.toLowerCase().includes('bar'));
    if (!isSilver && !isCoinsMatch) return false;

    // Search query filter
    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.subCategory && item.subCategory.toLowerCase().includes(q)) ||
        (item.subType && item.subType.toLowerCase().includes(q)) ||
        (item.material && item.material.toLowerCase().includes(q)) ||
        (item.craftsmanship && item.craftsmanship.toLowerCase().includes(q));
      if (!matchSearch) return false;
    }

    // Category match
    let matchesCategory = false;
    if (activeKey === 'all') {
      matchesCategory = true;
    } else if (isSubStyleView) {
      // Direct subcategory / style view (e.g., /silver/earrings/studs, /silver/rings/engagement-rings, /silver/bangles/bangles, /silver/occasion/casual-wear)
      if (isBanglesSubStyle) {
        matchesCategory = (item.subType === 'bangles' || item.subType === 'bangle-bracelets');
      } else {
        matchesCategory = (
          item.subType === activeKey ||
          item.subCategorySlug === activeKey ||
          item.occasion === activeKey
        );
      }
    } else if (activeMainCat === 'earrings') {
      matchesCategory = (item.subCategory === 'earrings' || item.subCategorySlug === 'earrings');
    } else if (activeMainCat === 'bangles') {
      matchesCategory = (
        (item.subCategory === 'bangles' || item.subCategorySlug === 'bangles' || item.subCategory === 'handcrafted-silver') &&
        !item.name?.toLowerCase().includes('payal') &&
        !item.id?.includes('payal') &&
        item.subCategory !== 'anklets'
      );
    } else if (activeMainCat === 'rings') {
      matchesCategory = (
        (item.subCategory === 'rings' || item.subCategorySlug === 'rings') &&
        !item.name?.toLowerCase().includes('metti') &&
        !item.id?.includes('metti') &&
        item.subCategory !== 'toe-rings'
      );
    } else if (activeMainCat === 'necklaces') {
      matchesCategory = (item.subCategory === 'necklaces' || item.subCategorySlug === 'necklaces');
    } else if (activeMainCat === 'chains') {
      matchesCategory = (item.subCategory === 'chains' || item.subCategorySlug === 'chains' || item.subType === 'chains');
    } else if (activeMainCat === 'pendants') {
      matchesCategory = (item.subCategory === 'pendants' || item.subCategorySlug === 'pendants' || item.subType === 'pendants');
    } else if (activeMainCat === 'nosepin') {
      matchesCategory = (item.subCategory === 'nosepin' || item.subCategorySlug === 'nosepin' || item.subType === 'nosepin');
    } else if (activeMainCat === 'anklets') {
      matchesCategory = (
        item.subCategory === 'anklets' ||
        item.subCategorySlug === 'anklets' ||
        item.subType === 'anklets' ||
        item.designType?.includes('anklet') ||
        item.id?.includes('anklet') ||
        item.id?.includes('payal') ||
        item.name?.toLowerCase().includes('payal') ||
        item.name?.toLowerCase().includes('anklet')
      );
    } else if (activeMainCat === 'toe-rings') {
      matchesCategory = (
        item.subCategory === 'toe-rings' ||
        item.subCategorySlug === 'toe-rings' ||
        item.subType === 'toe-rings' ||
        item.designType?.includes('metti') ||
        item.id?.includes('toe-ring') ||
        item.id?.includes('metti') ||
        item.name?.toLowerCase().includes('toe ring') ||
        item.name?.toLowerCase().includes('metti')
      );
    } else if (activeMainCat === 'pooja-items') {
      matchesCategory = (item.subCategory === 'pooja-items' || item.subCategorySlug === 'pooja-items');
    } else if (activeMainCat === 'silver-idols') {
      matchesCategory = (item.subCategory === 'silver-idols' || item.subCategorySlug === 'silver-idols');
    } else if (activeMainCat === 'coins' || activeMainCat === 'coins-bars') {
      matchesCategory = (
        item.subCategory === 'coins' ||
        item.subCategorySlug === 'coins' ||
        item.subType === 'coins' ||
        item.subCategory === 'coins-bars' ||
        item.subCategorySlug === 'coins-bars'
      );
    } else if (activeMainCat === 'occasion') {
      matchesCategory = (item.subCategory === 'occasion' || item.occasion || item.isBridal);
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
    if (priceFilter === 'under2k' && item.numericPrice > 2000) return false;
    if (priceFilter === '2k-5k' && (item.numericPrice <= 2000 || item.numericPrice > 5000)) return false;
    if (priceFilter === 'above5k' && item.numericPrice <= 5000) return false;

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = typeof a.numericPrice === 'number' ? a.numericPrice : 0;
    const priceB = typeof b.numericPrice === 'number' ? b.numericPrice : 0;
    if (sortBy === 'price-low') return priceA - priceB;
    if (sortBy === 'price-high') return priceB - priceA;
    return 0;
  });

  // Find subcategories for the current main category
  const currentCategoryData = silverCategories.find(
    c => c.slug === activeMainCat || c.slug === activeKey || (categoryInfo.parent && c.slug === categoryInfo.parent.slug)
  );
  const activeSubcategories = currentCategoryData?.subcategories || [];

  return (
    <div className="bg-[#FAF7F2] min-h-screen border-b border-[#EAE2D5] font-sans selection:bg-[#1E293B] selection:text-white">
      
      {/* Breadcrumb Navigation Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-4 sm:pt-6 pb-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#7A6E65] flex-wrap">
          <Link to="/" className="hover:text-[#1E293B] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#B38E46] shrink-0" />
          <Link to="/silver" className={`hover:text-[#1E293B] transition-colors ${activeKey === 'all' ? 'font-bold text-[#1E293B]' : ''}`}>
            Silver Collection
          </Link>
          
          {categoryInfo.parent && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[#B38E46] shrink-0" />
              <Link to={categoryInfo.parent.path} className="hover:text-[#1E293B] transition-colors">
                {categoryInfo.parent.name}
              </Link>
            </>
          )}

          {activeKey !== 'all' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[#B38E46] shrink-0" />
              <span className="font-semibold text-[#1E293B] capitalize">
                {activeKey.replace(/-/g, ' ')}
              </span>
            </>
          )}
        </nav>
      </div>

      {/* ========================================================================= */}
      {/* FULL-WIDTH PHOTOGRAPHIC HERO BANNER                                       */}
      {/* ========================================================================= */}
      <div className="w-full mb-8 sm:mb-10">
        <div className="relative w-full overflow-hidden min-h-[340px] sm:min-h-[420px] lg:min-h-[460px] shadow-lg border-y border-[#334155]/40 flex items-center bg-[#0B0F14]">
          
          {/* High-Resolution Handcrafted Silver Photographic Background */}
          <img
            src="/images/silver_hero_bg.jpg"
            alt="Authentic South Indian Handcrafted Silver Jewellery - Salem Ghungroo Payals, Carved Silver Bangles, Temple Harams and Diya"
            className="absolute inset-0 w-full h-full object-cover object-right md:object-center transform scale-[1.01] pointer-events-none"
            loading="eager"
          />

          {/* Subtle Translucent Scrim on Left Only - Keeping Silver Jewellery Bright & Luminous */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 md:via-black/15 to-transparent pointer-events-none" />

          {/* Banner Content Panel (Aligned Exactly like Gold Hero) */}
          <div className="relative z-10 px-6 sm:px-12 lg:px-16 xl:px-20 py-10 sm:py-14 lg:py-16 max-w-2xl text-left flex flex-col justify-center">
            {/* Eyebrow */}
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.25em] text-[#C5D0DE] uppercase mb-2 sm:mb-3 block font-sans drop-shadow-sm">
              AUTHENTIC SOUTH INDIAN SILVERSMITHING
            </span>

            {/* Main Heading */}
            <h1 className="text-2xl sm:text-4xl lg:text-[44px] font-bold text-white tracking-tight leading-[1.15] drop-shadow-md">
              Timeless radiance in pure silver.
            </h1>

            {/* Supporting Description */}
            <p className="text-xs sm:text-sm text-[#F1F5F9] mt-3 sm:mt-4 leading-relaxed max-w-xl font-sans drop-shadow-sm">
              Discover melodic Salem ghungroo payals, sacred Ashtalakshmi thalis, Kamakshi lamps, and fine sterling silver chains crafted for auspicious family traditions.
            </p>

            {/* Subtle 92.5% Hallmark Assurance Pill at Bottom */}
            <div className="mt-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[#F1F5F9] text-[11px] font-medium self-start shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-[#CBD5E1]" />
              <span>92.5% (925) Certified Silver Fineness &bull; Assay Hallmarked</span>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN CATALOG CONTENT CONTAINER                                            */}
      {/* ========================================================================= */}
      <div id="silver-catalog-section" className="max-w-[1440px] mx-auto px-4 sm:px-8 pb-12 scroll-mt-24">
        
        {/* CENTERED SECTION HEADING & LOTUS FLOURISH */}
        <div className="text-center mb-6">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#0F172A] tracking-tight mb-2.5">
            Silver Collections
          </h2>

          {/* Centered 5-Petal Silver Lotus Divider */}
          <div className="flex items-center justify-center gap-3.5 mb-6">
            <div className="h-[1.5px] bg-gradient-to-r from-transparent via-[#94A3B8] to-[#94A3B8] w-16 sm:w-28 opacity-80" />

            <div className="text-[#64748B] flex items-center justify-center">
              <svg
                className="w-7 h-7 text-[#64748B]"
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

            <div className="h-[1.5px] bg-gradient-to-l from-transparent via-[#94A3B8] to-[#94A3B8] w-16 sm:w-28 opacity-80" />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CATEGORY FILTERS: Compact Rounded White Pills + Dark Navy Filter Button    */}
        {/* ========================================================================= */}
        <div className="relative mb-6">
          {/* Desktop Left Scroll Control */}
          {showLeftArrow && (
            <button
              onClick={() => handlePillScroll('left')}
              className="hidden md:flex absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 items-center justify-center rounded-full bg-white/95 border border-[#DECDBB] text-[#1E293B] shadow-md hover:bg-[#F1F5F9] hover:scale-105 transition-all cursor-pointer focus:outline-none"
              aria-label="Scroll categories left"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
            </button>
          )}

          <div
            ref={pillTrackRef}
            className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none pb-2 sm:pb-0 px-1 justify-start scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* "All Silver (N)" Pill */}
            <Link
              to="/silver"
              onClick={scrollToCatalog}
              data-active={activeKey === 'all'}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-xs shrink-0 ${
                activeKey === 'all'
                  ? 'bg-[#1E293B] text-white border border-[#1E293B] shadow-md'
                  : 'bg-white text-[#1C273C] hover:text-[#1E293B] hover:border-[#94A3B8] border border-[#E2E8F0]'
              }`}
            >
              {getSilverCategoryIcon('all', activeKey === 'all')}
              <span>All Silver ({dbProducts.filter(p => p.category?.toLowerCase().includes('silver')).length})</span>
            </Link>

            {/* Category Shortcut Pills */}
            {silverCategories.map(cat => {
              const isActive = activeMainCat === cat.slug;
              return (
                <Link
                  key={cat.id}
                  to={cat.path}
                  onClick={scrollToCatalog}
                  data-active={isActive}
                  className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-xs shrink-0 ${
                    isActive
                      ? 'bg-[#1E293B] text-white border border-[#1E293B] shadow-md'
                      : 'bg-white text-[#1C273C] hover:text-[#1E293B] hover:border-[#94A3B8] border border-[#E2E8F0]'
                  }`}
                >
                  {getSilverCategoryIcon(cat.slug, isActive)}
                  <span>{cat.name}</span>
                </Link>
              );
            })}

            {/* Dark Navy "Filter" Button with Filter Icon */}
            <button
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-xs shrink-0 ${
                isFilterDrawerOpen || priceFilter !== 'all'
                  ? 'bg-[#0F172A] text-[#93C5FD] border border-[#93C5FD] shadow-md'
                  : 'bg-[#1E293B] hover:bg-[#0F172A] text-white border border-[#1E293B]'
              }`}
              title="Toggle Price Filter"
              aria-label="Filter silver articles"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#93C5FD] shrink-0" />
              <span>Filter</span>
              {priceFilter !== 'all' && (
                <span className="w-2 h-2 rounded-full bg-[#93C5FD]" />
              )}
            </button>
          </div>

          {/* Desktop Right Scroll Control */}
          {showRightArrow && (
            <button
              onClick={() => handlePillScroll('right')}
              className="hidden md:flex absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 items-center justify-center rounded-full bg-white/95 border border-[#DECDBB] text-[#1E293B] shadow-md hover:bg-[#F1F5F9] hover:scale-105 transition-all cursor-pointer focus:outline-none"
              aria-label="Scroll categories right"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.2]" />
            </button>
          )}
        </div>

        {/* Collapsible Filter Panel (When Filter is toggled) */}
        {isFilterDrawerOpen && (
          <div className="bg-white border border-[#CBD5E1] rounded-2xl p-4 sm:p-5 mb-6 shadow-sm animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#1E293B]" />
                <h3 className="text-sm font-bold text-[#0F172A]">
                  Filter Silver Articles
                </h3>
              </div>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1"
                aria-label="Close filters"
              >
                &times;
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-gray-500 font-medium">Price Range:</span>
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under2k', label: 'Under ₹2,000' },
                { id: '2k-5k', label: '₹2,000 - ₹5,000' },
                { id: 'above5k', label: 'Above ₹5,000' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setPriceFilter(opt.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    priceFilter === opt.id
                      ? 'bg-[#1E293B] text-white shadow-xs'
                      : 'bg-[#FAF7F2] text-gray-700 hover:bg-[#E2E8F0] border border-[#CBD5E1]'
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
          <div className="bg-[#F1F5F9] p-3 rounded-xl border border-[#CBD5E1] mb-6 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-bold text-[#475569] uppercase tracking-wider pl-1 shrink-0">
              {currentCategoryData.name} Styles:
            </span>
            <Link
              to={currentCategoryData.path}
              id="style-filter-view-all"
              onClick={scrollToCatalog}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                !subType
                  ? 'bg-[#1E293B] text-white'
                  : 'bg-white text-[#334155] hover:bg-white border border-[#CBD5E1]'
              }`}
            >
              View All
            </Link>
            {activeSubcategories.map(sub => {
              const isSubActive = Boolean(subType) && (subType.toLowerCase() === sub.slug.toLowerCase());
              return (
                <Link
                  key={sub.slug}
                  id={`style-filter-${sub.slug}`}
                  to={sub.path}
                  onClick={scrollToCatalog}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isSubActive
                      ? 'bg-[#1E293B] text-white'
                      : 'bg-white text-[#334155] hover:bg-white border border-[#CBD5E1]'
                  }`}
                >
                  {sub.name}
                </Link>
              );
            })}
          </div>
        )}

        {/* Toolbar: Result Count & Sort Dropdown */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#CBD5E1] text-xs">
          <span className="text-[#64748B]">
            Showing <strong className="text-[#0F172A]">{sortedProducts.length}</strong> articles in {categoryInfo.title}
          </span>

          <div className="flex items-center gap-2">
            <label htmlFor="sort-dropdown-silver" className="text-gray-500 font-medium whitespace-nowrap hidden sm:inline">
              Sort by:
            </label>
            <select
              id="sort-dropdown-silver"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#CBD5E1] rounded-lg px-3 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#1E293B] cursor-pointer shadow-xs"
              aria-label="Sort silver articles"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid */}
        {apiError ? (
          <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-[#CBD5E1] my-8 shadow-xs max-w-2xl mx-auto space-y-3">
            <p className="text-base font-semibold text-[#8C1D28]">{apiError}</p>
            <p className="text-xs text-[#475569]">Please verify your backend connection or try again later.</p>
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
            {sortedProducts.map((item) => {
              const isWishlisted = wishlistItems.some(w => w.id === item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-[#CBD5E1] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div 
                    className="relative aspect-4/3 overflow-hidden bg-[#FAF6EE] cursor-pointer"
                    onClick={() => onViewProduct(item)}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className={`w-full h-full object-cover object-center transition-all duration-500 ${
                        item.images && item.images.length > 1
                          ? 'group-hover:opacity-0 group-hover:scale-105'
                          : 'group-hover:scale-105'
                      }`}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/neutral_product_placeholder.svg';
                      }}
                    />
                    {item.images && item.images.length > 1 && (
                      <img
                        src={item.images[1]}
                        alt={`${item.name} - angle view`}
                        className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 pointer-events-none"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = item.image;
                        }}
                      />
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#F1F5F9] text-[#1E293B] border border-[#CBD5E1]">
                        {item.badge || '92.5 Silver'}
                      </span>
                    </div>

                    <button
                      onClick={() => onAddToWishlist(item)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-[#1E293B] shadow-md transition-transform active:scale-95 cursor-pointer"
                      title={isWishlisted ? "Item in Wishlist" : "Add to Wishlist"}
                      aria-label={`Add ${item.name} to Wishlist`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#D32F2F] text-[#D32F2F]' : ''}`} />
                    </button>
                  </div>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                          {item.purity || item.details}
                        </span>
                        {item.weight && (
                          <span className="text-[10px] font-semibold text-[#1E293B] bg-[#F1F5F9] px-2 py-0.5 rounded border border-[#E2E8F0] shrink-0">
                            {item.weight}
                          </span>
                        )}
                      </div>
                      <h3 
                        onClick={() => onViewProduct(item)}
                        className="text-base font-bold text-[#0F172A] group-hover:text-[#1E293B] transition-colors line-clamp-1 mt-1 cursor-pointer"
                      >
                        {item.name}
                      </h3>
                      <p className="text-xs text-[#475569] line-clamp-2 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#64748B] block">Showroom Price</span>
                        <span className="text-lg font-bold text-[#0F172A]">
                          {item.price}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onViewProduct(item)}
                          className="px-3 py-1.5 rounded-md border border-[#1E293B] text-[#1E293B] hover:bg-[#F1F5F9] text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => onAddToCart(item)}
                          className="px-3 py-1.5 rounded-md bg-[#1E293B] hover:bg-[#0F172A] text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
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
          /* Small consistent empty state message inside existing product-list area */
          <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-[#CBD5E1] my-8 shadow-xs max-w-2xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#F1F5F9] text-[#475569] flex items-center justify-center mx-auto border border-[#CBD5E1]">
              <Sparkles className="w-7 h-7 text-[#475569]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
              No products available yet.
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed max-w-md mx-auto">
              There are currently no products available in this category. New designs will be shown here as soon as they are added to the showroom inventory.
            </p>
            <div className="pt-2 flex justify-center gap-3 flex-wrap">
              <Link
                to="/silver"
                onClick={scrollToCatalog}
                className="inline-flex items-center gap-1.5 bg-[#1E293B] hover:bg-[#0F172A] text-white px-5 py-2.5 rounded-lg text-xs font-semibold shadow transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Explore All Silver Articles</span>
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 border border-[#1E293B] text-[#1E293B] hover:bg-[#F1F5F9] px-5 py-2.5 rounded-lg text-xs font-semibold transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Showroom Custom Commission</span>
              </Link>
            </div>
          </div>
        )}

      </div>

      {/* Showroom Silver Purity & Hallmark Assurance Banner */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pb-10">
        <div className="bg-[#FAF3E6] rounded-xl p-5 border border-[#E5D5BA] flex items-center justify-between flex-wrap gap-4 text-xs text-[#52453E]">
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#581923]" />
            <span>92.5% Certified Silver Fineness &bull; Traditional Salem Craftsmanship &bull; Transparent Weight Assay</span>
          </div>
          <Link to="/contact" className="text-[#581923] font-bold hover:underline">
            Visit Mylapore Showroom &rarr;
          </Link>
        </div>
      </div>

    </div>
  );
}
