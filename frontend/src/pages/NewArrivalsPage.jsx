import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { storefrontClient } from '../api/storefrontProductsClient';
import { ProductGridSkeleton } from '../components/common/ProductCardSkeleton';
import LuxuryProductCard from '../components/common/LuxuryProductCard';
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
          setApiError(res.error || 'Failed to load new arrivals');
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setApiError('Unable to connect to product server');
        setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const newArrivals = dbProducts;

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

        {/* Hero Header Banner with Opulent Jewellery Backdrop */}
        <div className="relative min-h-[220px] sm:min-h-[260px] rounded-2xl overflow-hidden mb-8 border border-[#D4AF37]/40 shadow-xl bg-[#2D0A10] flex items-center">
          <div className="absolute inset-0 pointer-events-none">
            <img
              src="/images/hero_luxury_indian_gold_display.png"
              alt="Fresh New Arrivals and Master Creations"
              className="w-full h-full object-cover object-[75%_center] md:object-right"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/images/col_gold_2k.jpg';
              }}
            />
            {/* Crisp Left-Only Fade: Leaves the entire right jewelry showcase 100% clear and luminous */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#240409] via-[#240409]/90 via-35% md:via-42% to-transparent to-60% md:to-58% pointer-events-none" />
          </div>

          <div className="relative z-10 px-6 sm:px-10 lg:px-12 py-8 max-w-xl lg:max-w-2xl text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5C278]/20 border border-[#E5C278]/40 text-[#F5DFAB] text-[11px] font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#E5C278]" />
              2026 Festive Collection
            </span>
            <h1 
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              className="text-2xl sm:text-4xl font-bold text-white tracking-tight"
            >
              Fresh New Arrivals &amp; Master Creations
            </h1>
            <p className="text-xs sm:text-sm text-[#F0D5D8] mt-2 leading-relaxed">
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
        {isLoading ? (
          <ProductGridSkeleton
            count={6}
            columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            aspect="aspect-square"
            label="Curating New Showroom Arrivals..."
          />
        ) : apiError ? (
          <div className="bg-[#FAF8F5] rounded-xl p-12 text-center border border-[#DECDBB] my-8">
            <h3 className="text-xl font-bold text-[#8C1D28]">{apiError}</h3>
            <p className="text-xs text-[#7A6E65] mt-1">Please verify your server connection or try again later.</p>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="bg-[#FAF8F5] rounded-xl p-12 text-center border border-[#DECDBB] my-8">
            <div className="w-14 h-14 rounded-full bg-[#FAF3E3] text-[#8C6D2D] flex items-center justify-center mx-auto mb-3 border border-[#E8DFC0]">
              <Sparkles className="w-7 h-7 text-[#8C6D2D]" />
            </div>
            <h3 className="text-xl font-bold text-[#241716]">No products available yet.</h3>
            <p className="text-xs text-[#7A6E65] mt-1">New showroom designs will be featured here as soon as they arrive.</p>
            <div className="pt-3">
              <Link
                to="/gold"
                className="inline-flex items-center gap-1.5 bg-[#581923] text-white px-5 py-2.5 rounded-lg text-xs font-semibold shadow transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Explore Gold Jewellery</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 my-8">
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
        )}

      </div>
    </div>
  );
}
