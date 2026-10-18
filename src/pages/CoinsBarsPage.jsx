import React, { useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { products } from '../data/products';
import { coinsBarsNavItems } from '../data/navigationData';
import { Sparkles, ChevronRight, Heart, ShoppingBag, ShieldCheck, Award, ArrowLeft, RefreshCcw } from 'lucide-react';

const COINS_MAP = {
  'gold-coins': { title: '24K 999 Pure Gold Coins', desc: 'Auspicious Lakshmi, Ganesha, and Vedha Radha trust emblem stamped gold coins in tamper-proof certicards.' },
  'gold-bars': { title: '24K 999.9 Investment Gold Bars', desc: 'Highest 999.9 fineness Swiss mint investment bullion bars with individual serial assay certificates.' },
  'silver-coins': { title: '999 Pure Fine Silver Coins', desc: 'Auspicious puja and gifting silver coins with high-relief divine motifs and velvet gift packaging.' },
  'silver-bars': { title: '999 Pure Silver Bullion Bars', desc: 'Investment grade solid silver cast bars sealed with laser hallmark purity seals.' }
};

export default function CoinsBarsPage({
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
  const categoryInfo = COINS_MAP[activeSlug] || {
    title: 'Precious Gold & Silver Coins & Bars',
    desc: 'Government recognized 24K (999/999.9) pure investment gold and 999 fine silver coins & bullion bars with 100% buyback guarantee.'
  };

  // Filter products by category 'Coins & Bars', subcategory, and search query
  const filteredProducts = products.filter(item => {
    if (item.category !== 'Coins & Bars') return false;

    // Search query match
    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.subCategory && item.subCategory.toLowerCase().includes(q)) ||
        (item.subType && item.subType.toLowerCase().includes(q)) ||
        (item.material && item.material.toLowerCase().includes(q)) ||
        (item.purity && item.purity.toLowerCase().includes(q));
      if (!matchSearch) return false;
    }

    if (!subCategory || activeSlug === 'all') return true;
    return item.subCategorySlug === activeSlug || item.subCategory === activeSlug;
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
          <Link to="/coins-bars" className={`hover:text-[#581923] ${!subCategory ? 'font-bold text-[#581923]' : ''}`}>
            Coins & Bars
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
        <div className="bg-gradient-to-r from-[#543818] via-[#734E24] to-[#422C12] text-[#FAF6EE] rounded-2xl p-6 sm:p-10 mb-8 border border-[#916733] shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block text-[11px] uppercase tracking-[0.25em] text-[#F3EAD3] font-semibold mb-2">
              24K 999.9 Fine Gold &bull; 999 Pure Silver Bullion
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              {categoryInfo.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#F0E6D8] mt-2 leading-relaxed">
              {categoryInfo.desc}
            </p>
          </div>
        </div>

        {/* Investment Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-white rounded-xl border border-[#E8DFC0] shadow-2xs flex items-center gap-3">
            <Award className="w-8 h-8 text-[#B38E46] shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-[#241716]">999 / 999.9 Certified Purity</h4>
              <p className="text-[11px] text-[#7A6E65]">Assayed with international tamper-proof certicards.</p>
            </div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-[#E8DFC0] shadow-2xs flex items-center gap-3">
            <RefreshCcw className="w-8 h-8 text-[#B38E46] shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-[#241716]">0% Deduction Buyback</h4>
              <p className="text-[11px] text-[#7A6E65]">100% market spot value buyback guarantee.</p>
            </div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-[#E8DFC0] shadow-2xs flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-[#B38E46] shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-[#241716]">Zero Making Charge Advantage</h4>
              <p className="text-[11px] text-[#7A6E65]">Ideal for savings, weddings, and auspicious gifting.</p>
            </div>
          </div>
        </div>

        {/* Subcategory Pills Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-[#DECDBB]">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to="/coins-bars"
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                !subCategory || activeSlug === 'all'
                  ? 'bg-[#581923] text-white shadow-xs'
                  : 'bg-white text-[#4A403A] hover:bg-[#F3EAD3] border border-[#DECDBB]'
              }`}
            >
              All Coins & Bars ({products.filter(p => p.category === 'Coins & Bars').length})
            </Link>

            {coinsBarsNavItems.filter(item => !item.isAll).map(item => {
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
            <span className="text-[#7A6E65]">Showing {sortedProducts.length} bullion items</span>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
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

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D2D]">
                      {item.purity || item.details}
                    </span>
                    <h3 className="text-sm font-bold text-[#241716] group-hover:text-[#581923] transition-colors line-clamp-2 mt-1">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-[#63574F] line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#EAE2D5] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#7A6E65] block">Spot Price</span>
                      <span className="text-base font-bold text-[#48161E]">
                        {item.price}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onViewProduct(item)}
                        className="px-2.5 py-1.5 rounded-md border border-[#581923] text-[#581923] hover:bg-[#FAF0E1] text-[11px] font-semibold cursor-pointer"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => onAddToCart(item)}
                        className="px-3 py-1.5 rounded-md bg-[#581923] hover:bg-[#431219] text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
