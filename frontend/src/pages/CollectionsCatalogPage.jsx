import React, { useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { storefrontClient } from '../api/storefrontProductsClient';
import { ProductGridSkeleton } from '../components/common/ProductCardSkeleton';
import LuxuryProductCard from '../components/common/LuxuryProductCard';
import { collectionsNavItems } from '../data/navigationData';
import { Sparkles, ChevronRight, ChevronDown, Heart, ShoppingBag, ShieldCheck, ArrowLeft, PhoneCall, Gem, Layers, Eye, Award, ArrowRight, CheckCircle2 } from 'lucide-react';

const COLLECTIONS_MAP = {
  'wedding': { 
    title: 'Wedding & Bridal Collections', 
    desc: 'Grand Muhurtham trousseau sets, temple Mayura harams, antique vankis, and royal wedding ornaments handcrafted in 22K hallmarked gold.' 
  },
  'wedding-collections': { 
    title: 'Wedding & Bridal Collections', 
    desc: 'Grand Muhurtham trousseau sets, temple Mayura harams, antique vankis, and royal wedding ornaments handcrafted in 22K hallmarked gold.' 
  },
  'baby': { 
    title: 'Baby Collections (First Jewels)', 
    desc: 'Auspicious black bead nazariya bracelets, child-safe rounded bangles, silver anklets, and protective charms crafted with smooth skin-safe hypoallergenic finishes.' 
  },
  'baby-collections': { 
    title: 'Baby Collections (First Jewels)', 
    desc: 'Auspicious black bead nazariya bracelets, child-safe rounded bangles, silver anklets, and protective charms crafted with smooth skin-safe hypoallergenic finishes.' 
  },
  'mens-accessories': { 
    title: "Men's Fine Accessories", 
    desc: 'Solid 22K gold Veera Simha kadas, certified gemstone signet rings, heavy silver chains, and executive gold cufflinks.' 
  },
  'girls-accessories': { 
    title: "Girls' & Teen Accessories", 
    desc: 'Delicate butterfly charm bracelets, lightweight floral earrings, chiming silver payals, and everyday modern pendants.' 
  },
  'pooja-items': { 
    title: 'Sacred Temple Pooja Collections', 
    desc: 'Mayur Stambh five-tier aarti deepams, Ashtalakshmi prayer ensembles, hand-chased silver deepams, and puja thalis crafted for spiritual sanctity.' 
  },
  'silver-idols': { 
    title: 'Artisanal Pure Silver Idols (Murtis)', 
    desc: 'Sacred cast 92.5 solid silver murtis of Lord Siddhi Anjaneya, Ganesha, Goddess Lakshmi, and Balaji on double-lotus pedestals.' 
  },
  'silver-idol': { 
    title: 'Artisanal Pure Silver Idols (Murtis)', 
    desc: 'Sacred cast 92.5 solid silver murtis of Lord Siddhi Anjaneya, Ganesha, Goddess Lakshmi, and Balaji on double-lotus pedestals.' 
  },
  'gift-collection': { 
    title: 'Artisanal Pure Silver Gift Collection', 
    desc: "Cherished pure 92.5 hallmarked silver bowl sets, royal dinnerware, and auspicious presentation gifts tailored for life's grand celebrations." 
  },
  'gift': { 
    title: 'Artisanal Pure Silver Gift Collection', 
    desc: "Cherished pure 92.5 hallmarked silver bowl sets, royal dinnerware, and auspicious presentation gifts tailored for life's grand celebrations." 
  },
  'mens accessories': {
    title: "Men's Fine Accessories",
    desc: 'Solid 22K gold Veera Simha kadas, certified gemstone signet rings, heavy silver chains, and executive gold cufflinks.'
  },
  'baby collections': {
    title: 'Baby Collections (First Jewels)',
    desc: 'Auspicious black bead nazariya bracelets, child-safe rounded bangles, silver anklets, and protective charms crafted with smooth skin-safe hypoallergenic finishes.'
  },
  'wedding collections': {
    title: 'Wedding & Bridal Collections',
    desc: 'Grand Muhurtham trousseau sets, temple Mayura harams, antique vankis, and royal wedding ornaments handcrafted in 22K hallmarked gold.'
  },
  'pooja items': {
    title: 'Sacred Temple Pooja Collections',
    desc: 'Mayur Stambh five-tier aarti deepams, Ashtalakshmi prayer ensembles, hand-chased silver deepams, and puja thalis crafted for spiritual sanctity.'
  },
  'silver idols': {
    title: 'Artisanal Pure Silver Idols (Murtis)',
    desc: 'Sacred cast 92.5 solid silver murtis of Lord Siddhi Anjaneya, Ganesha, Goddess Lakshmi, and Balaji on double-lotus pedestals.'
  },
  'gift collection': {
    title: 'Artisanal Pure Silver Gift Collection',
    desc: "Cherished pure 92.5 hallmarked silver bowl sets, royal dinnerware, and auspicious presentation gifts tailored for life's grand celebrations."
  }
};

// Map each collection slug to its strictly assigned exclusive product ID
const COLLECTION_EXCLUSIVE_PRODUCT_MAP = {
  'wedding': 'collections-wedding-exclusive-01',
  'wedding-collections': 'collections-wedding-exclusive-01',
  'baby': 'collections-baby-exclusive-01',
  'baby-collections': 'collections-baby-exclusive-01',
  'mens-accessories': 'collections-mens-exclusive-01',
  'girls-accessories': 'collections-girls-exclusive-01',
  'pooja-items': 'collections-pooja-exclusive-01',
  'silver-idols': 'collections-silver-idol-exclusive-01',
  'silver-idol': 'collections-silver-idol-exclusive-01',
  'gift-collection': 'collections-gift-exclusive-01',
  'gift': 'collections-gift-exclusive-01'
};

const COLLECTION_HERO_IMAGES = {
  'wedding': '/images/col_wedding_2k.jpg',
  'wedding-collections': '/images/col_wedding_2k.jpg',
  'baby': '/images/col_baby.jpg',
  'baby-collections': '/images/col_baby.jpg',
  'mens-accessories': '/images/col_mens.jpg',
  'girls-accessories': '/images/col_girls.jpg',
  'pooja-items': '/images/silver_pooja_luxury_stage_hero.jpg',
  'silver-idols': '/images/col_silver_idol.jpg',
  'silver-idol': '/images/col_silver_idol.jpg',
  'gift-collection': '/images/col_gift.jpg',
  'gift': '/images/col_gift.jpg'
};

// Matching logic to accurately route products to their curated collection
function matchesCollectionSlug(item, slug) {
  if (!item) return false;
  const cat = (item.category || '').toLowerCase();
  const sub = (item.subCategory || '').toLowerCase();
  const subSlug = (item.subCategorySlug || '').toLowerCase();
  const name = (item.name || '').toLowerCase();
  const desc = (item.description || '').toLowerCase();
  const coll = (item.collection || '').toLowerCase();
  const sku = (item.sku || '').toLowerCase();
  const id = String(item.id || '').toLowerCase();

  const isCuratedItem =
    cat === 'collections' ||
    coll.includes('curated') ||
    sku.includes('coll') ||
    id.includes('coll') ||
    sku.startsWith('vr-coll-') ||
    id.startsWith('vr-coll-') ||
    id === 'mens-gold-kada' ||
    id === 'baby-nazariya-set' ||
    sku.startsWith('silver-idols-') ||
    id.startsWith('silver-idols-') ||
    id === 'silver-idol-04-sacred-lakshmi-ganesha';

  const rawSlug = (slug || 'all').toLowerCase().trim();
  const s = rawSlug.replace(/[\s_]+/g, '-');

  if (s === 'all') {
    return isCuratedItem;
  }

  if (s === 'wedding' || s === 'wedding-collections' || s === 'bridal') {
    return (
      (isCuratedItem || item.isBridal === true) &&
      (sub.includes('wedding') ||
        subSlug.includes('wedding') ||
        sub.includes('bridal') ||
        sku.includes('wed') ||
        id.includes('wed') ||
        coll.includes('wedding') ||
        (isCuratedItem &&
          (name.includes('vaddanam') ||
            name.includes('bridal') ||
            name.includes('haar') ||
            name.includes('kasu mala'))))
    );
  }

  if (s === 'baby' || s === 'baby-collections') {
    return (
      isCuratedItem &&
      (sub.includes('baby') ||
        subSlug.includes('baby') ||
        sku.includes('baby') ||
        id.includes('baby') ||
        name.includes('baby') ||
        name.includes('nazariya'))
    );
  }

  if (s === 'mens-accessories' || s === 'mens' || s === 'men') {
    // Strictly masculine jewellery: Kada, Cufflinks, Mens Chain, Signet Ring
    if (
      id.includes('baby') ||
      name.includes('baby') ||
      id.includes('dia-') ||
      id.startsWith('dia') ||
      cat === 'diamond' ||
      cat.includes('diamond') ||
      item.isDiamond ||
      item.department?.toLowerCase() === 'diamond' ||
      name.includes('women') ||
      name.includes('girl') ||
      name.includes('bridal') ||
      name.includes('vaddanam') ||
      name.includes('choker') ||
      name.includes('necklace') ||
      name.includes('haram')
    ) {
      return false;
    }
    return (
      sub.includes('men') ||
      subSlug.includes('men') ||
      sku.includes('mens') ||
      id.includes('mens') ||
      id === 'mens-gold-kada' ||
      name.includes("men's") ||
      name.includes('mens ') ||
      (isCuratedItem &&
        (sku.includes('mens') ||
          id.includes('mens') ||
          name.includes('veera simha') ||
          name.includes('cufflinks')))
    );
  }

  if (s === 'girls-accessories' || s === 'girls' || s === 'girl') {
    return (
      isCuratedItem &&
      (sub.includes('girl') ||
        subSlug.includes('girl') ||
        sku.includes('girl') ||
        id.includes('girl') ||
        name.includes('girl') ||
        name.includes('teens'))
    );
  }

  if (s === 'pooja-items' || s === 'pooja' || s === 'pooja-collection') {
    return (
      isCuratedItem &&
      (sub.includes('pooja') ||
        subSlug.includes('pooja') ||
        sku.includes('pooja') ||
        id.includes('pooja') ||
        name.includes('pooja') ||
        name.includes('deepam') ||
        name.includes('kalash') ||
        name.includes('thali') ||
        id === 'collections-pooja-bell-lamp')
    );
  }

  if (s === 'silver-idols' || s === 'silver-idol') {
    return (
      (isCuratedItem || cat === 'silver pooja' || cat === 'silver') &&
      (sub.includes('idol') ||
        subSlug.includes('idol') ||
        sku.includes('idol') ||
        id.includes('idol') ||
        name.includes('murti') ||
        name.includes('idol') ||
        name.includes('balaji') ||
        name.includes('lakshmi ganesha'))
    );
  }

  if (s === 'gift-collection' || s === 'gift') {
    return (
      isCuratedItem &&
      (sub.includes('gift') ||
        subSlug.includes('gift') ||
        sku.includes('gift') ||
        id.includes('gift') ||
        name.includes('gift') ||
        name.includes('katori') ||
        name.includes('presentation box'))
    );
  }

  return (
    isCuratedItem &&
    (cat.includes(s) ||
      sub.includes(s) ||
      subSlug.includes(s) ||
      coll.includes(s) ||
      name.includes(s) ||
      sku.includes(s))
  );
}

export default function CollectionsCatalogPage({
  searchQuery = '',
  onViewProduct = () => {},
  onAddToCart = () => {},
  onAddToWishlist = () => {},
  wishlistItems = []
}) {
  const { subCategory } = useParams();
  const location = useLocation();
  const [sortBy, setSortBy] = useState('featured');
  const [dbProducts, setDbProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  React.useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setApiError(null);

    storefrontClient.getStorefrontProducts({ page_size: 200 })
      .then(res => {
        if (!isMounted) return;
        if (res.success) {
          setDbProducts(res.items);
        } else {
          setApiError(res.error || 'Failed to load collections products');
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setApiError('Unable to connect to product server');
        setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, [subCategory]);

  const normalizedSubCategory = subCategory ? subCategory.toLowerCase().trim().replace(/[\s_]+/g, '-') : 'all';
  const activeSlug = normalizedSubCategory;
  const categoryInfo = COLLECTIONS_MAP[activeSlug] || COLLECTIONS_MAP[subCategory?.toLowerCase()?.trim()] || {
    title: 'Curated Signature Collections',
    desc: "Discover bespoke jewelry lines tailored for auspicious family milestones, weddings, baby ceremonies, men's heirlooms, and sacred temple rituals."
  };

  // Filter products strictly for collection and ensure no duplicate product or image shows again
  const seenImages = new Set();
  const seenNames = new Set();
  const filteredProducts = dbProducts.filter(item => {
    // 1. Search Query Filter if active
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        (item.subCategory && item.subCategory.toLowerCase().includes(q)) ||
        (item.material && item.material.toLowerCase().includes(q)) ||
        (item.purity && item.purity.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (!matchesCollectionSlug(item, activeSlug)) return false;

    // Strict deduplication: ensure no product image or identical name is displayed more than once
    const imgKey = String(item.image || '').trim().toLowerCase();
    const nameKey = String(item.name || '').trim().toLowerCase();
    if (imgKey && seenImages.has(imgKey)) return false;
    if (nameKey && seenNames.has(nameKey)) return false;
    if (imgKey) seenImages.add(imgKey);
    if (nameKey) seenNames.add(nameKey);
    return true;
  });

  const WEDDING_PRIORITY = [
    'VR-COLL-WED-02',
    'VR-COLL-WED-03',
    'VR-COLL-WED-04',
    'VR-COLL-WED-01'
  ];

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.numericPrice - b.numericPrice;
    if (sortBy === 'price-high') return b.numericPrice - a.numericPrice;
    if (activeSlug === 'wedding' || activeSlug === 'wedding-collections') {
      const idxA = WEDDING_PRIORITY.findIndex(sku => a.sku === sku || a.id === sku || (a.name && a.name.includes(sku.replace('VR-COLL-WED-', ''))));
      const idxB = WEDDING_PRIORITY.findIndex(sku => b.sku === sku || b.id === sku || (b.name && b.name.includes(sku.replace('VR-COLL-WED-', ''))));
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
    }
    return 0;
  });

  return (
    <div className="bg-[#FAF7F2] min-h-screen border-b border-[#EAE2D5] select-none font-sans">
      
      {/* Full-Bleed Split Luxury Collection Hero Banner */}
      <section className="relative bg-[#1A0408] text-white overflow-hidden border-b border-[#C5A253]/35 min-h-[480px] lg:min-h-[540px] flex items-center mb-8 sm:mb-10">
        {/* Background stage showcase on the right */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={COLLECTION_HERO_IMAGES[activeSlug] || '/images/col_wedding_2k.jpg'}
            alt={categoryInfo.title}
            className="w-full h-full object-cover object-[75%_center] lg:object-right"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/images/col_gold_2k.jpg';
            }}
          />
          {/* Crisp Left-Only Fade: Leaves the entire right jewelry showcase 100% clear and luminous */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A0408] via-[#1A0408]/90 via-35% md:via-42% to-transparent to-60% md:to-58% pointer-events-none" />
        </div>

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16">
          <div className="max-w-2xl lg:max-w-xl xl:max-w-2xl">
            {/* Breadcrumb Navigation inside Hero */}
            <div className="flex items-center gap-2 text-xs text-[#E5B5B5] mb-4 font-medium tracking-wide">
              <Link to="/" className="hover:text-white transition-colors cursor-pointer">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#C5A253]" />
              <Link to="/collections" className="hover:text-white transition-colors cursor-pointer">Collections</Link>
              {subCategory && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-[#C5A253]" />
                  <span className="text-[#FCEB9C] capitalize font-semibold">{subCategory.replace(/-/g, ' ')}</span>
                </>
              )}
            </div>

            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#350810]/90 border border-[#C5A253]/60 text-[#F5DE98] text-[11px] font-semibold mb-4 tracking-widest uppercase shadow-[0_2px_12px_rgba(197,162,83,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-[#E7C878]" />
              <span>CURATED THEME COLLECTION &bull; VEDHA RADHA EXCLUSIVE</span>
            </div>

            {/* Title */}
            <h1 
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
              className="text-3xl sm:text-5xl lg:text-[50px] font-bold text-white tracking-tight leading-[1.12]"
            >
              {categoryInfo.title}
            </h1>

            {/* Filigree horizontal divider */}
            <div className="flex items-center gap-3 my-3.5">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#C5A253] to-[#C5A253]"></div>
              <span className="text-[#C5A253] text-xs">✦</span>
              <div className="h-[1px] w-28 bg-gradient-to-r from-[#C5A253] to-transparent"></div>
            </div>

            {/* Narrative description */}
            <p className="text-xs sm:text-sm text-[#F3DCDD] mt-3 font-light leading-relaxed max-w-xl">
              {categoryInfo.desc}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 mt-7">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('collection-catalog-grid');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-gradient-to-r from-[#D4AF37] via-[#FCEB9C] to-[#C59B27] hover:brightness-110 text-[#1A0407] font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-[0_4px_20px_rgba(212,175,55,0.35)] transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Explore Curated Pieces</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/contact')}
                className="bg-[#2D060E]/90 hover:bg-[#3D0A14] border border-[#C5A253]/60 hover:border-[#C5A253] text-[#F3E5C8] font-medium text-xs sm:text-sm px-5 py-3 rounded-full backdrop-blur-sm transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C5A253]" />
                <span>Custom Order Inquiry</span>
              </button>
            </div>

            {/* Trust Badges matching reference design */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10 max-w-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#350810] border border-[#C5A253]/50 flex items-center justify-center shrink-0">
                  <Award className="w-3.5 h-3.5 text-[#E7C878]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">Certified Purity</p>
                  <p className="text-[10px] text-[#E5B5B5] leading-tight">BIS 916 &amp; 925</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#350810] border border-[#C5A253]/50 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#E7C878]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">Master Craft</p>
                  <p className="text-[10px] text-[#E5B5B5] leading-tight">South Indian Heritage</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#350810] border border-[#C5A253]/50 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-[#E7C878]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">Exclusive Designs</p>
                  <p className="text-[10px] text-[#E5B5B5] leading-tight">Curated Themes</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#350810] border border-[#C5A253]/50 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E7C878]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">Insured Shipping</p>
                  <p className="text-[10px] text-[#E5B5B5] leading-tight">Across India</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">

        {/* Subcategory Navigation Pills Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-[#DECDBB]">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to="/collections"
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                !subCategory || activeSlug === 'all'
                  ? 'bg-[#581923] text-white shadow-xs'
                  : 'bg-white text-[#4A403A] hover:bg-[#F3EAD3] border border-[#DECDBB]'
              }`}
            >
              All Collections
            </Link>

            {collectionsNavItems.filter(item => !item.isAll).map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#581923] text-white shadow-xs'
                      : 'bg-white text-[#4A403A] hover:bg-[#F3EAD3] border border-[#DECDBB]'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end lg:self-auto text-xs">
            <span className="text-[#7A6E65]">Showing {sortedProducts.length} {sortedProducts.length === 1 ? 'exclusive design' : 'curated designs'}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#DECDBB] rounded-lg px-3 py-1.5 text-xs text-[#2C1D18] focus:outline-none focus:border-[#581923]"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <ProductGridSkeleton
            count={6}
            columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            aspect="aspect-square"
            label="Curating Signature Collections..."
          />
        ) : apiError ? (
          <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-[#E8DFC0] my-8 shadow-xs max-w-2xl mx-auto space-y-3">
            <h3 className="font-serif text-xl font-bold text-[#8C1D28]">{apiError}</h3>
            <p className="text-xs text-[#7A6E65]">Please verify your backend connection or try again later.</p>
          </div>
        ) : sortedProducts.length > 0 ? (
          <div id="collection-catalog-grid" className="w-full max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 my-8">
            {sortedProducts.map((item) => (
              <LuxuryProductCard
                key={item.id}
                item={item}
                wishlistItems={wishlistItems}
                onAddToCart={onAddToCart}
                onAddToWishlist={onAddToWishlist}
                onViewProduct={onViewProduct}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-[#E8DFC0] my-8 shadow-xs max-w-2xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#F3EAD3] text-[#581923] flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7 text-[#8C6D2D]" />
            </div>
            <h3 className="text-xl font-bold text-[#241716]">
              No products available yet.
            </h3>
            <p className="text-xs text-[#63574F] leading-relaxed max-w-md mx-auto">
              There are currently no products available in this signature collection. New designs will be shown here as soon as they are added to the showroom inventory.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                to="/collections"
                className="inline-flex items-center gap-1.5 bg-[#581923] text-white px-5 py-2.5 rounded-lg text-xs font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>View All Collections</span>
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 border border-[#581923] text-[#581923] px-5 py-2.5 rounded-lg text-xs font-semibold hover:bg-[#FAF0E1]"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Showroom Concierge</span>
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
