import React, { useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { storefrontClient } from '../api/storefrontProductsClient';
import { ProductGridSkeleton } from '../components/common/ProductCardSkeleton';
import LuxuryProductCard from '../components/common/LuxuryProductCard';
import { coinsBarsNavItems } from '../data/navigationData';
import { Sparkles, ChevronRight, Heart, ShoppingBag, ShieldCheck, Award, ArrowLeft, RefreshCcw, ArrowRight, CheckCircle2 } from 'lucide-react';

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
  const navigate = useNavigate();
  const location = useLocation();
  const [sortBy, setSortBy] = useState('featured');
  const [dbProducts, setDbProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  React.useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setApiError(null);

    storefrontClient.getStorefrontProducts({
      category: 'coins',
      page_size: 200
    }).then(res => {
      if (!isMounted) return;
      if (res.success) {
        setDbProducts(res.items);
      } else {
        setApiError(res.error || 'Failed to load bullion products');
      }
      setIsLoading(false);
    }).catch(() => {
      if (!isMounted) return;
      setApiError('Unable to connect to product server');
      setIsLoading(false);
    });

    return () => { isMounted = false; };
  }, [subCategory]);

  const activeSlug = subCategory ? subCategory.toLowerCase() : 'all';
  const categoryInfo = COINS_MAP[activeSlug] || {
    title: 'Precious Gold & Silver Coins & Bars',
    desc: 'Government recognized 24K (999/999.9) pure investment gold and 999 fine silver coins & bullion bars with 100% buyback guarantee.'
  };

  // Filter products by category 'Coins & Bars', subcategory, and search query
  const filteredProducts = dbProducts.filter(item => {
    const isCoinsCat = item.category?.toLowerCase().includes('coin') || item.category?.toLowerCase().includes('bar');
    if (!isCoinsCat) return false;

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
    return item.subCategorySlug === activeSlug || item.subCategory === activeSlug || item.name.toLowerCase().includes(activeSlug.replace('-', ' '));
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.numericPrice - b.numericPrice;
    if (sortBy === 'price-high') return b.numericPrice - a.numericPrice;
    return 0;
  });

  return (
    <div className="bg-[#FAF7F2] min-h-screen border-b border-[#EAE2D5] select-none font-sans">
      
      {/* Full-Bleed Split Luxury Bullion Hero Banner matching reference design */}
      <section className="relative bg-[#180D03] text-white overflow-hidden border-b border-[#C5A253]/35 min-h-[480px] lg:min-h-[540px] flex items-center mb-8 sm:mb-10">
        {/* Background stage showcase on the right */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="/images/bar_gold.jpg"
            alt="24K Pure Gold and Silver Bullion"
            className="w-full h-full object-cover object-[75%_center] lg:object-right"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/images/coin_gold.jpg';
            }}
          />
          {/* Crisp Left-Only Fade: Leaves the entire right jewelry showcase 100% clear and luminous */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#180D03] via-[#180D03]/90 via-35% md:via-42% to-transparent to-60% md:to-58% pointer-events-none" />
        </div>

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16">
          <div className="max-w-2xl lg:max-w-xl xl:max-w-2xl">
            {/* Breadcrumb Navigation inside Hero */}
            <div className="flex items-center gap-2 text-xs text-[#E5B5B5] mb-4 font-medium tracking-wide">
              <Link to="/" className="hover:text-white transition-colors cursor-pointer">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#C5A253]" />
              <Link to="/coins-bars" className="hover:text-white transition-colors cursor-pointer">Coins &amp; Bars</Link>
              {subCategory && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-[#C5A253]" />
                  <span className="text-[#FCEB9C] capitalize font-semibold">{subCategory.replace(/-/g, ' ')}</span>
                </>
              )}
            </div>

            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2A1504]/90 border border-[#C5A253]/60 text-[#F5DE98] text-[11px] font-semibold mb-4 tracking-widest uppercase shadow-[0_2px_12px_rgba(197,162,83,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-[#E7C878]" />
              <span>24K 999.9 FINE GOLD &bull; 999 PURE SILVER BULLION</span>
            </div>

            {/* Title */}
            <h1 
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
              className="text-3xl sm:text-5xl lg:text-[50px] font-bold text-white tracking-tight leading-[1.12]"
            >
              Precious Gold &amp; Silver Coins &amp; Bars
            </h1>

            {/* Filigree horizontal divider */}
            <div className="flex items-center gap-3 my-3.5">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#C5A253] to-[#C5A253]"></div>
              <span className="text-[#C5A253] text-xs">✦</span>
              <div className="h-[1px] w-28 bg-gradient-to-r from-[#C5A253] to-transparent"></div>
            </div>

            {/* Subtitle */}
            <p 
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              className="text-base sm:text-xl text-[#E5C058] italic font-normal"
            >
              Certified Investment-Grade Bullion with 100% Transparent Assay.
            </p>

            {/* Narrative description */}
            <p className="text-xs sm:text-sm text-[#F3DCDD] mt-3 font-light leading-relaxed max-w-xl">
              {categoryInfo.desc}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 mt-7">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('bullion-catalog-grid');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-gradient-to-r from-[#D4AF37] via-[#FCEB9C] to-[#C59B27] hover:brightness-110 text-[#180D03] font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-[0_4px_20px_rgba(212,175,55,0.35)] transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Explore Bullion Products</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/contact')}
                className="bg-[#241203]/90 hover:bg-[#381B05] border border-[#C5A253]/60 hover:border-[#C5A253] text-[#F3E5C8] font-medium text-xs sm:text-sm px-5 py-3 rounded-full backdrop-blur-sm transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C5A253]" />
                <span>Bulk Investment Desk</span>
              </button>
            </div>

            {/* Trust Badges matching reference design */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10 max-w-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#2A1504] border border-[#C5A253]/50 flex items-center justify-center shrink-0">
                  <Award className="w-3.5 h-3.5 text-[#E7C878]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">999.9 Purity</p>
                  <p className="text-[10px] text-[#E5B5B5] leading-tight">Assayed Certicards</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#2A1504] border border-[#C5A253]/50 flex items-center justify-center shrink-0">
                  <RefreshCcw className="w-3.5 h-3.5 text-[#E7C878]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">0% Deduction</p>
                  <p className="text-[10px] text-[#E5B5B5] leading-tight">Buyback Guarantee</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#2A1504] border border-[#C5A253]/50 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#E7C878]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">Tamper Proof</p>
                  <p className="text-[10px] text-[#E5B5B5] leading-tight">Sealed Security</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#2A1504] border border-[#C5A253]/50 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E7C878]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">Insured Transit</p>
                  <p className="text-[10px] text-[#E5B5B5] leading-tight">Secure Doorstep</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">

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
              All Coins & Bars ({dbProducts.filter(p => p.category?.toLowerCase().includes('coin') || p.category?.toLowerCase().includes('bar')).length})
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
        {isLoading ? (
          <ProductGridSkeleton
            count={8}
            columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            aspect="aspect-square"
            label="Curating 24K Bullion Coins & Bars..."
          />
        ) : apiError ? (
          <div className="bg-[#FAF8F5] rounded-xl p-12 text-center border border-[#DECDBB] my-8 max-w-2xl mx-auto space-y-3">
            <h3 className="font-serif text-xl font-bold text-[#8C1D28]">{apiError}</h3>
            <p className="text-xs text-[#7A6E65]">Please verify your backend connection or try again later.</p>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="bg-[#FAF8F5] rounded-xl p-12 text-center border border-[#DECDBB] my-8 max-w-2xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#FAF3E3] text-[#8C6D2D] flex items-center justify-center mx-auto border border-[#E8DFC0]">
              <Sparkles className="w-7 h-7 text-[#8C6D2D]" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#241716]">No products available yet.</h3>
            <p className="text-xs sm:text-sm text-[#63574F] leading-relaxed max-w-md mx-auto">
              There are currently no bullion coins or bars available in this selection. New inventory will appear here as soon as it is registered.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                to="/coins-bars"
                className="inline-flex items-center gap-1.5 bg-[#581923] text-white px-5 py-2.5 rounded-lg text-xs font-semibold shadow transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>View All Coins & Bars</span>
              </Link>
            </div>
          </div>
        ) : (
          <div id="bullion-catalog-grid" className="w-full max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 my-8">
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
