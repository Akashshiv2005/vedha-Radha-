import React, { useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { products } from '../data/products';
import { collectionsNavItems } from '../data/navigationData';
import { Sparkles, ChevronRight, Heart, ShoppingBag, ShieldCheck, ArrowLeft, PhoneCall, Gift, Gem } from 'lucide-react';

const COLLECTIONS_MAP = {
  'wedding': { title: 'Wedding & Bridal Collections', desc: 'Grand Muhurtham trousseau sets, temple Lakshmi harams, antique vankis, and royal wedding ornaments.' },
  'wedding-collections': { title: 'Wedding & Bridal Collections', desc: 'Grand Muhurtham trousseau sets, temple Lakshmi harams, antique vankis, and royal wedding ornaments.' },
  'baby': { title: 'Baby Collections (First Jewels)', desc: 'Auspicious black bead nazariya bracelets, soft baby bangles, silver anklets, and protective charms crafted with smooth skin-safe hypoallergenic finishes.' },
  'baby-collections': { title: 'Baby Collections (First Jewels)', desc: 'Auspicious black bead nazariya bracelets, soft baby bangles, silver anklets, and protective charms crafted with smooth skin-safe hypoallergenic finishes.' },
  'mens-accessories': { title: 'Men’s Fine Accessories', desc: 'Solid 22K gold kadas, certified gemstone Navaratna rings, heavy silver chains, and executive gold cufflinks.' },
  'girls-accessories': { title: 'Girls’ & Teen Accessories', desc: 'Delicate floral studs, lightweight gold bracelets, chiming silver payals, and everyday modern pendants.' },
  'pooja-items': { title: 'Sacred Temple Pooja Collections', desc: 'Ashtalakshmi prayer ensembles, hand-chased silver aarti sets, auspicious incense burners, and puja thalis crafted for spiritual sanctity.' },
  'silver-idols': { title: 'Artisanal Pure Silver Idols (Murtis)', desc: 'Sacred cast silver murtis of Lord Ganesha, Goddess Lakshmi, Balaji, and Kamadhenu on lotus pedestals.' },
  'silver-idol': { title: 'Artisanal Pure Silver Idols (Murtis)', desc: 'Sacred cast silver murtis of Lord Ganesha, Goddess Lakshmi, Balaji, and Kamadhenu on lotus pedestals.' }
};

export default function CollectionsCatalogPage({
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

  // Filter products by collection slug
  const filteredProducts = products.filter(item => {
    if (!subCategory || activeSlug === 'all') return true;
    if (activeSlug === 'wedding' || activeSlug === 'wedding-collections') return item.isBridal || item.collection === 'wedding';
    if (activeSlug === 'baby' || activeSlug === 'baby-collections') return item.collection === 'baby';
    if (activeSlug === 'mens-accessories') return item.collection === 'mens-accessories';
    if (activeSlug === 'girls-accessories') return item.collection === 'girls-accessories';
    if (activeSlug === 'pooja-items') return item.collection === 'pooja-items' || item.subCategorySlug === 'pooja-items';
    if (activeSlug === 'silver-idols' || activeSlug === 'silver-idol') return item.collection === 'silver-idols' || item.collection === 'silver-idol' || item.subCategorySlug === 'silver-idols' || item.subCategorySlug === 'silver-idol';
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

        {/* Subcategory Pills Bar */}
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
            <span className="text-[#7A6E65]">Showing {sortedProducts.length} designs</span>
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
            {sortedProducts.map((item) => {
              const isWishlisted = wishlistItems.some(w => w.id === item.id);
              return (
                <div
                  key={item.id}
                  className="bg-[#FAF8F5] rounded-xl border border-[#E8DFC0] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-[#EFE8DC]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#DCF0DF] text-[#1E5C2D] border border-[#C1E3C6]">
                        {item.badge}
                      </span>
                    </div>

                    <button
                      onClick={() => onAddToWishlist(item)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-[#581923] shadow-md transition-transform active:scale-95 cursor-pointer"
                      title={isWishlisted ? "Item in Wishlist" : "Add to Wishlist"}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#D32F2F] text-[#D32F2F]' : ''}`} />
                    </button>
                  </div>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D2D]">
                        {item.purity || item.details}
                      </span>
                      <h3 className="font-serif text-base font-bold text-[#241716] group-hover:text-[#581923] transition-colors line-clamp-1 mt-1">
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
