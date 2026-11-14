import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import LuxuryProductCard from '../components/common/LuxuryProductCard';
import { diamondProducts } from '../data/diamondProducts';
import { storefrontClient } from '../api/storefrontProductsClient';
import { Sparkles, ArrowRight, Gem, ChevronRight, ShieldCheck, Award, Loader2 } from 'lucide-react';
import { getProductUrl } from '../utils/productSlug';

const DIAMOND_CATEGORIES = [
  { id: 'all', label: 'All Diamonds' },
  { id: 'rings', label: 'Solitaire & Bands' },
  { id: 'necklaces', label: 'Necklaces & Harams' },
  { id: 'bracelets', label: 'Tennis Bracelets & Kadas' },
  { id: 'earrings', label: 'Halo Drops & Jhumkas' },
  { id: 'pendants', label: 'Solitaire Pendants' },
  { id: 'nosepins', label: 'Diamond Nose Pins' }
];

export default function DiamondPage({ onViewProduct, onAddToCart, onAddToWishlist, wishlistItems = [] }) {
  const navigate = useNavigate();
  const { subCategory } = useParams();
  const [searchParams] = useSearchParams();

  const activeCategoryFromRoute = useMemo(() => {
    const raw = (subCategory || searchParams.get('category') || '').toLowerCase().trim();
    if (!raw) return 'all';
    if (raw.includes('ring') || raw.includes('solitaire') || raw.includes('band')) return 'rings';
    if (raw.includes('necklace') || raw.includes('choker') || raw.includes('haram')) return 'necklaces';
    if (raw.includes('bracelet') || raw.includes('bangle') || raw.includes('kada')) return 'bracelets';
    if (raw.includes('earring') || raw.includes('stud') || raw.includes('jhumka') || raw.includes('halo')) return 'earrings';
    if (raw.includes('pendant') || raw.includes('tanmaniya')) return 'pendants';
    if (raw.includes('nose') || raw.includes('mookuthi')) return 'nosepins';
    return 'all';
  }, [subCategory, searchParams]);

  const [selectedCategory, setSelectedCategory] = useState(activeCategoryFromRoute);
  const [diamondList, setDiamondList] = useState(diamondProducts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedCategory(activeCategoryFromRoute);
  }, [activeCategoryFromRoute]);

  useEffect(() => {
    let isMounted = true;
    async function loadDynamicDiamonds() {
      setLoading(true);
      try {
        const res = await storefrontClient.getStorefrontProducts({
          product_type: 'diamond',
          page_size: 100
        });
        if (isMounted && res.success && Array.isArray(res.items) && res.items.length > 0) {
          setDiamondList(res.items);
        }
      } catch (err) {
        console.warn('Dynamic diamond fetch error; retaining resilient cache:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadDynamicDiamonds();
    return () => { isMounted = false; };
  }, []);

  const filteredProducts = diamondList.filter(item => {
    if (selectedCategory === 'all') return true;
    const sub = (item.subCategory || item.sub_category || '').toLowerCase();
    const cat = (item.category || '').toLowerCase();
    if (selectedCategory === 'rings') return sub.includes('ring') || cat.includes('ring');
    if (selectedCategory === 'necklaces') return sub.includes('necklace') || sub.includes('choker') || sub.includes('haram');
    if (selectedCategory === 'bracelets') return sub.includes('bracelet') || sub.includes('bangle') || sub.includes('kada');
    if (selectedCategory === 'earrings') return sub.includes('earring') || sub.includes('stud') || sub.includes('jhumka') || sub.includes('chandelier');
    if (selectedCategory === 'pendants') return sub.includes('pendant') || sub.includes('tanmaniya');
    if (selectedCategory === 'nosepins') return sub.includes('nose') || sub.includes('mookuthi');
    return true;
  });

  const handleCardClick = (product) => {
    if (onViewProduct) {
      onViewProduct(product);
    } else {
      navigate(getProductUrl(product));
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen select-none font-sans">
      
      {/* 1. Split Luxury Hero Banner matching reference design */}
      <section className="relative bg-[#060D1A] text-white overflow-hidden border-b border-[#C5A253]/30 min-h-[520px] lg:min-h-[580px] flex items-center">
        {/* Background stage showcase on the right */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="/images/hero_slide_diamond_sapphire.png"
            alt="Diamond & Sapphire Luxury Suite"
            className="w-full h-full object-cover object-[70%_center] lg:object-right"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/images/diamonds/diamond_hero_showcase.jpg';
            }}
          />
          {/* Crisp Left-Only Fade: Leaves the entire right jewelry showcase 100% clear and luminous */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#060D1A] via-[#060D1A]/90 via-35% md:via-42% to-transparent to-60% md:to-58% pointer-events-none" />
        </div>

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16">
          <div className="max-w-2xl lg:max-w-xl xl:max-w-2xl">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs text-[#8EA0BF] mb-4 font-medium tracking-wide">
              <button onClick={() => navigate('/')} className="hover:text-white transition-colors cursor-pointer">Home</button>
              <ChevronRight className="w-3.5 h-3.5 text-[#C5A253]" />
              <span className="text-[#E7C878] font-semibold">Certified Natural Diamonds</span>
            </div>

            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F1B2E]/90 border border-[#C5A253]/60 text-[#F5DE98] text-[11px] font-semibold mb-4 tracking-widest uppercase shadow-[0_2px_12px_rgba(197,162,83,0.18)]">
              <Gem className="w-3.5 h-3.5 text-[#E7C878]" />
              <span>CERTIFIED NATURAL BRILLIANCE &bull; IGI &amp; GIA</span>
            </div>

            {/* Title */}
            <h1 
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
              className="text-3xl sm:text-5xl lg:text-[52px] font-bold text-white tracking-tight leading-[1.12]"
            >
              The <span className="font-serif">Diamond Collection</span>
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
              Unrivalled Fire, Clarity &amp; Symmetry. Certified by IGI &amp; GIA.
            </p>

            {/* Narrative description */}
            <p className="text-xs sm:text-sm text-[#C4D0E5] mt-3 font-light leading-relaxed max-w-xl">
              Every Vedha Radha diamond is hand-selected from conflict-free natural sources for extraordinary scintillation and icy white brilliance, set into timeless platinum and 18K gold heirloom creations.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 mt-7">
              <button
                onClick={() => {
                  const el = document.getElementById('diamond-showcase');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-gradient-to-r from-[#D4AF37] via-[#FCEB9C] to-[#C59B27] hover:brightness-110 text-[#121A2B] font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-[0_4px_20px_rgba(212,175,55,0.35)] transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Explore Diamond Masterpieces</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="bg-[#0F1B2E]/90 hover:bg-[#162742] border border-[#C5A253]/60 hover:border-[#C5A253] text-[#F3E5C8] font-medium text-xs sm:text-sm px-5 py-3 rounded-full backdrop-blur-sm transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <Gem className="w-3.5 h-3.5 text-[#C5A253]" />
                <span>Book Diamond Specialist</span>
              </button>
            </div>

            {/* Trust Badges matching reference design */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10 max-w-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#132035] border border-[#C5A253]/50 flex items-center justify-center shrink-0">
                  <Gem className="w-3.5 h-3.5 text-[#E7C878]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">Certified Diamonds</p>
                  <p className="text-[10px] text-[#8EA0BF] leading-tight">100% Natural</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#132035] border border-[#C5A253]/50 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#E7C878]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">Conflict-Free</p>
                  <p className="text-[10px] text-[#8EA0BF] leading-tight">Ethical Sourcing</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#132035] border border-[#C5A253]/50 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-[#E7C878]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">Exceptional Fire</p>
                  <p className="text-[10px] text-[#8EA0BF] leading-tight">Hearts &amp; Arrows</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#132035] border border-[#C5A253]/50 flex items-center justify-center shrink-0">
                  <Award className="w-3.5 h-3.5 text-[#E7C878]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">IGI &amp; GIA</p>
                  <p className="text-[10px] text-[#8EA0BF] leading-tight">Global Certification</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Featured Diamond Showcase */}
      <section id="diamond-showcase" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[#0284C7] text-xs">✦</span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#0284C7] font-serif">
                Certified Natural Diamonds
              </span>
              <span className="text-[#0284C7] text-xs">✦</span>
            </div>
            <h2 
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              className="text-2xl sm:text-4xl font-bold text-[#0F172A] tracking-tight"
            >
              Signature Diamond Masterpieces
            </h2>
            <p className="text-xs text-[#64748B] mt-1 flex items-center gap-1.5">
              <span>Showing {filteredProducts.length} certified diamond creations in stock.</span>
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C5A253]" />}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
            {DIAMOND_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#0F172A] text-white border border-[#CBD5E1] shadow-sm'
                    : 'bg-white text-[#475569] border border-[#CBD5E1] hover:bg-[#F8FAFC]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid: Generous 3-Column Luxury Layout identical to Gold Page */}
        <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 my-8">
          {filteredProducts.map((prod) => (
            <LuxuryProductCard
              key={prod.id}
              item={prod}
              wishlistItems={wishlistItems}
              onAddToCart={onAddToCart}
              onAddToWishlist={onAddToWishlist}
              onViewProduct={handleCardClick}
            />
          ))}
        </div>

      </section>

      {/* 4. Consultation CTA */}
      <section className="bg-gradient-to-r from-[#18233C] via-[#0E1524] to-[#18233C] text-white py-14 border-t border-[#D4AF37]/30">
        <div className="max-w-[1000px] mx-auto px-4 text-center">
          <div className="w-12 h-12 rounded-full bg-[#FAF3E5]/10 text-[#FCEB9C] border border-[#D4AF37]/40 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            className="text-2xl sm:text-3xl font-bold text-white"
          >
            Custom Solitaire Ring &amp; Bridal Diamond Consultation
          </h3>
          <p className="text-xs sm:text-sm text-[#D1D9E6] mt-2 max-w-xl mx-auto font-light leading-relaxed">
            Looking for a specific diamond carat, cut, or custom engagement ring setting? Our certified gemologists at Vedha Radha Trichy &amp; Mylapore will guide your choice with 100% transparent pricing and international assay certificates.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate('/contact')}
              className="bg-gradient-to-r from-[#D4AF37] via-[#FCEB9C] to-[#C59B27] hover:brightness-105 text-[#18233C] font-bold text-xs sm:text-sm px-7 py-3 rounded-full shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Schedule Diamond Appointment</span>
              <ArrowRight className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
