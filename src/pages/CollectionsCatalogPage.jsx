import React, { useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { products } from '../data/products';
import { collectionsNavItems } from '../data/navigationData';
import { Sparkles, ChevronRight, Heart, ShoppingBag, ShieldCheck, ArrowLeft, PhoneCall, Gem, Layers, Eye } from 'lucide-react';

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
    title: 'Men’s Fine Accessories', 
    desc: 'Solid 22K gold Veera Simha kadas, certified gemstone signet rings, heavy silver chains, and executive gold cufflinks.' 
  },
  'girls-accessories': { 
    title: 'Girls’ & Teen Accessories', 
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
    desc: 'Cherished pure 92.5 hallmarked silver bowl sets, royal dinnerware, and auspicious presentation gifts tailored for life’s grand celebrations.' 
  },
  'gift': { 
    title: 'Artisanal Pure Silver Gift Collection', 
    desc: 'Cherished pure 92.5 hallmarked silver bowl sets, royal dinnerware, and auspicious presentation gifts tailored for life’s grand celebrations.' 
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

const EXCLUSIVE_PRODUCT_IDS = Object.values(COLLECTION_EXCLUSIVE_PRODUCT_MAP);

// Reusable Interactive Card with Thumbnail Gallery Switching
function CollectionProductCard({ item, wishlistItems, onAddToCart, onAddToWishlist, onViewProduct }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const isWishlisted = wishlistItems.some(w => w.id === item.id);
  const isGiftCard = item.collection === 'gift-collection' || item.subCategory === 'Gift Collection' || !!item.suitableFor;
  const images = (!isGiftCard && item.images && item.images.length > 0) ? item.images : [item.image];
  const currentImage = images[activeImageIndex] || item.image;

  return (
    <div className="bg-[#FAF8F5] rounded-xl border border-[#E8DFC0] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
      {/* Product Image Stage */}
      <div className="relative aspect-4/3 overflow-hidden bg-[#EFE8DC]">
        <img
          src={currentImage}
          alt={`${item.name} - View ${activeImageIndex + 1}`}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Collection Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#FAF3E3] text-[#581923] border border-[#E8DFC0] shadow-xs">
            {item.badge}
          </span>
        </div>

        {/* View Index Badge */}
        {images.length > 1 && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
            <span className="bg-black/60 text-[#E5C278] text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
              <Eye className="w-3 h-3" />
              View {activeImageIndex + 1} of {images.length}
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => onAddToWishlist(item)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-[#581923] shadow-md transition-transform active:scale-95 cursor-pointer z-10"
          title={isWishlisted ? "Item in Wishlist" : "Add to Wishlist"}
          aria-label={isWishlisted ? "Item in Wishlist" : "Add to Wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#D32F2F] text-[#D32F2F]' : ''}`} />
        </button>

        {/* Interactive 3-Image Thumbnail Strip at bottom of preview */}
        {images.length > 1 && (
          <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1.5 px-3 py-1 bg-black/40 backdrop-blur-xs rounded-full max-w-fit mx-auto z-10">
            {images.map((imgSrc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(idx);
                }}
                className={`relative w-8 h-8 rounded-md overflow-hidden border transition-all cursor-pointer ${
                  activeImageIndex === idx
                    ? 'border-[#FAF7F2] ring-2 ring-[#581923] scale-110'
                    : 'border-white/50 opacity-75 hover:opacity-100'
                }`}
                title={`Switch to View ${idx + 1}`}
                aria-label={`View angle ${idx + 1}`}
              >
                <img
                  src={imgSrc}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
        <div className="space-y-2">
          {/* Category/Purity & Weight Header Row */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D2D] bg-[#FAF3E3] px-2 py-0.5 rounded border border-[#E8DFC0]/70 truncate">
              {item.purity || item.details || item.material}
            </span>
            {item.weight && (
              <span className="text-[10.5px] font-semibold text-[#581923] bg-[#FAF0E1] px-2 py-0.5 rounded border border-[#E0D2C0] shrink-0 whitespace-nowrap">
                {item.weight}
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onViewProduct(item)}
            className="font-serif text-[15px] sm:text-base font-bold text-[#241716] group-hover:text-[#581923] transition-colors line-clamp-2 leading-snug cursor-pointer pt-0.5"
            title={item.name}
          >
            {item.name}
          </h3>

          {/* Product Description */}
          <p className="text-xs text-[#63574F] line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Suitable For Label - ONLY on relevant gift collection cards */}
          {item.suitableFor && (
            <div className="pt-1 flex items-center gap-2">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#8C6D2D] shrink-0">
                Suitable For:
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FAF0E1] text-[#581923] border border-[#E0D2C0]">
                {item.suitableFor}
              </span>
            </div>
          )}

          {/* Dimensions Specs Tag */}
          {item.dimensions && (
            <div className="pt-0.5">
              <span className="inline-block text-[11px] text-[#63574F] bg-[#F7F2EA] px-2.5 py-0.5 rounded border border-[#E8DFC0]/70 max-w-full truncate" title={item.dimensions}>
                <span className="font-semibold text-[#8C6D2D] mr-1">Dimensions:</span>
                {item.dimensions}
              </span>
            </div>
          )}
        </div>

        {/* Pricing & CTA Controls */}
        <div className="mt-3 pt-3 border-t border-[#EAE2D5] flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-[#7A6E65] block font-medium">Showroom Price</span>
            <span className="font-serif text-lg font-bold text-[#48161E]">
              {item.price}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onViewProduct(item)}
              className="px-3 py-1.5 rounded-lg border border-[#581923] text-[#581923] hover:bg-[#FAF0E1] text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>
            <button
              onClick={() => onAddToCart(item)}
              className="px-3 py-1.5 rounded-lg bg-[#581923] hover:bg-[#431219] text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
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

  const activeSlug = subCategory ? subCategory.toLowerCase() : 'all';
  const categoryInfo = COLLECTIONS_MAP[activeSlug] || {
    title: 'Curated Signature Collections',
    desc: 'Discover bespoke jewelry lines tailored for auspicious family milestones, weddings, baby ceremonies, men’s heirlooms, and sacred temple rituals.'
  };

  // Filter products strictly so each collection displays exactly 1 new unique product
  const filteredProducts = products.filter(item => {
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

    // 2. Collection Route Filter: Each collection displays its exact 1 exclusive product
    if (!subCategory || activeSlug === 'all') {
      return item.id.startsWith('collections-') && item.id.includes('-exclusive-');
    }

    // Gift Collection displays all gift collection products
    if (activeSlug === 'gift-collection' || activeSlug === 'gift') {
      return (
        item.collection === 'gift-collection' ||
        item.subCategory === 'Gift Collection' ||
        item.subCategorySlug === 'gift-collection' ||
        item.id.startsWith('collections-gift-')
      );
    }

    const assignedId = COLLECTION_EXCLUSIVE_PRODUCT_MAP[activeSlug];
    if (assignedId) {
      return item.id === assignedId;
    }

    return item.collection === activeSlug;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.numericPrice - b.numericPrice;
    if (sortBy === 'price-high') return b.numericPrice - a.numericPrice;
    return 0;
  });

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8 sm:py-12 border-b border-[#EAE2D5]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#7A6E65] mb-4">
          <Link to="/" className="hover:text-[#581923]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#B38E46]" />
          <Link to="/collections" className={`hover:text-[#581923] ${!subCategory ? 'font-bold text-[#581923]' : ''}`}>
            Collections
          </Link>
          {subCategory && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[#B38E46]" />
              <span className="font-semibold text-[#581923] capitalize">
                {subCategory.replace(/-/g, ' ')}
              </span>
            </>
          )}
        </div>

        {/* Hero Header Banner */}
        <div className="bg-gradient-to-r from-[#4A161E] via-[#5C1D27] to-[#3D0E15] text-[#FAF6EE] rounded-2xl p-6 sm:p-10 mb-8 border border-[#7A2A37] shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block text-[11px] uppercase tracking-[0.25em] text-[#E6C37A] font-semibold mb-2">
              Curated Theme Collections
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight">
              {categoryInfo.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#E6D4D6] mt-2 leading-relaxed">
              {categoryInfo.desc}
            </p>
          </div>
          {/* Decorative motif */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 text-[#B8924B]/15 pointer-events-none">
            <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
              <circle cx="50" cy="50" r="45" />
            </svg>
          </div>
        </div>

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
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
            {sortedProducts.map((item) => (
              <CollectionProductCard
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
            <h3 className="font-serif text-xl font-bold text-[#241716]">
              {categoryInfo.title} Catalog Expanding
            </h3>
            <p className="text-xs text-[#63574F] leading-relaxed max-w-md mx-auto">
              Our master artisans are curating new pieces for this collection. You can explore all ready collections or contact our showroom concierge for custom design inquiries.
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
