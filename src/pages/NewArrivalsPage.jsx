import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { exclusiveNewArrivals } from '../data/newArrivalsData';
import { Sparkles, ChevronRight, Heart, ShoppingBag, ArrowLeft, Tag } from 'lucide-react';

export default function NewArrivalsPage({
  searchQuery = '',
  onViewProduct = () => {},
  onAddToCart = () => {},
  onAddToWishlist = () => {},
  wishlistItems = []
}) {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  // Exclusive New Arrivals data source (isolated from Gold, Silver, Coins & Bars, and Collections pages)
  const newArrivals = exclusiveNewArrivals;

  const filteredProducts = newArrivals.filter(p => {
    // Search filter
    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(q)) ||
        (p.subType && p.subType.toLowerCase().includes(q)) ||
        (p.department && p.department.toLowerCase().includes(q)) ||
        (p.material && p.material.toLowerCase().includes(q));
      if (!matchSearch) return false;
    }

    // Category filter
    if (activeFilter === 'All') return true;
    return (
      (p.department && p.department.toLowerCase() === activeFilter.toLowerCase()) ||
      (p.category && p.category.toLowerCase() === activeFilter.toLowerCase())
    );
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
          <span className="font-semibold text-[#581923]">New Arrivals</span>
        </div>

        {/* Hero Header Banner */}
        <div className="bg-gradient-to-r from-[#4A161E] via-[#66202D] to-[#3B1117] text-[#FAF6EE] rounded-2xl p-6 sm:p-10 mb-8 border border-[#7A2A37] shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5C278]/20 border border-[#E5C278]/40 text-[#F5DFAB] text-[11px] font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#E5C278]" />
              2026 Festive Collection
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Fresh New Arrivals & Master Creations
            </h1>
            <p className="text-xs sm:text-sm text-[#E6D4D6] mt-2 leading-relaxed">
              Discover the latest South Indian temple necklaces, antique jhumkas, hallmark gold coins, and 92.5 sterling silver articles just unveiled by our master artisans.
            </p>
          </div>
        </div>

        {/* Filter Pills Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-[#DECDBB]">
          <div className="flex items-center gap-2 flex-wrap">
            {['All', 'Gold', 'Silver', 'Coins & Bars', 'Collections'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === cat
                    ? 'bg-[#581923] text-white shadow-xs'
                    : 'bg-white text-[#4A403A] hover:bg-[#F3EAD3] border border-[#DECDBB]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end lg:self-auto text-xs">
            <span className="text-[#7A6E65]">Showing {sortedProducts.length} new designs</span>
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
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#581923] text-white tracking-wider uppercase shadow-xs">
                      NEW
                    </span>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF2DF] text-[#7A5826] border border-[#E2D4B7]">
                      {item.department || item.category}
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
                    <h3 className="text-base font-bold text-[#241716] group-hover:text-[#581923] transition-colors line-clamp-1 mt-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#63574F] line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#EAE2D5] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#7A6E65] block">Showroom Price</span>
                      <span className="text-lg font-bold text-[#48161E]">
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

      </div>
    </div>
  );
}
