import React from 'react';
import { useNavigate } from 'react-router-dom';
import LuxuryProductCard from '../components/common/LuxuryProductCard';
import { Sparkles, ShieldCheck, Heart, Eye, ArrowRight, Award, Compass, ChevronRight, CheckCircle2 } from 'lucide-react';
import { POOJA_PRODUCTS } from '../data/poojaProducts';

export default function SilverPoojaPage({ onViewProduct, onAddToCart, onAddToWishlist, wishlistItems = [] }) {
  const navigate = useNavigate();

  return (
    <div className="bg-[#FAF7F2] min-h-screen select-none font-sans">
      
      {/* 1. Split Luxury Silver Pooja Hero Banner matching reference design */}
      <section className="relative bg-[#12070A] text-white overflow-hidden border-b border-[#C5A253]/35 min-h-[520px] lg:min-h-[580px] flex items-center">
        {/* Background stage showcase on the right */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="/images/silver_pooja_luxury_stage_hero.jpg"
            alt="Sacred Pure Silver Pooja Kalash and Vilakku Ritual Showcase"
            className="w-full h-full object-cover object-[75%_center] lg:object-right"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/images/generated/silver_pooja_kalash.jpg';
            }}
          />
          {/* Crisp Left-Only Fade: Leaves the entire right jewelry showcase 100% clear and luminous */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#12070A] via-[#12070A]/90 via-35% md:via-42% to-transparent to-60% md:to-58% pointer-events-none" />
        </div>

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16">
          <div className="max-w-2xl lg:max-w-xl xl:max-w-2xl">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs text-[#E5B5B5] mb-4 font-medium tracking-wide">
              <button onClick={() => navigate('/')} className="hover:text-white transition-colors cursor-pointer">Home</button>
              <ChevronRight className="w-3.5 h-3.5 text-[#C5A253]" />
              <button onClick={() => navigate('/silver')} className="hover:text-white transition-colors cursor-pointer">Silver Articles</button>
              <ChevronRight className="w-3.5 h-3.5 text-[#C5A253]" />
              <span className="text-[#FCEB9C] font-semibold">Sacred Pooja Collection</span>
            </div>

            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2E0B12]/90 border border-[#C5A253]/60 text-[#F5DE98] text-[11px] font-semibold mb-4 tracking-widest uppercase shadow-[0_2px_12px_rgba(197,162,83,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-[#E7C878]" />
              <span>DEVOTIONAL PURITY &bull; 92.5 &amp; 999 PURE SILVER</span>
            </div>

            {/* Title */}
            <h1 
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
              className="text-3xl sm:text-5xl lg:text-[52px] font-bold text-white tracking-tight leading-[1.12]"
            >
              The Sacred <span className="font-serif">Silver Pooja Collection</span>
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
              Where Sacred Purity Meets Timeless Devotion.
            </p>

            {/* Narrative description */}
            <p className="text-xs sm:text-sm text-[#F3DCDD] mt-3 font-light leading-relaxed max-w-xl">
              Elevate your home shrine and auspicious festive ceremonies with heirloom-quality silver vilakkus, Ashtalakshmi kalashes, and pooja thalis crafted with sacred reverence and lasting purity.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 mt-7">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('pooja-products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-gradient-to-r from-[#D4AF37] via-[#FCEB9C] to-[#C59B27] hover:brightness-110 text-[#12070A] font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-[0_4px_20px_rgba(212,175,55,0.35)] transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Explore Pooja Articles</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/contact')}
                className="bg-[#24080E]/90 hover:bg-[#380E16] border border-[#C5A253]/60 hover:border-[#C5A253] text-[#F3E5C8] font-medium text-xs sm:text-sm px-5 py-3 rounded-full backdrop-blur-sm transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C5A253]" />
                <span>Custom Pooja Orders</span>
              </button>
            </div>

            {/* Trust Badges matching reference design */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10 max-w-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#25080F] border border-[#C5A253]/50 flex items-center justify-center shrink-0">
                  <Award className="w-3.5 h-3.5 text-[#E7C878]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">92.5 &amp; 999 Fine</p>
                  <p className="text-[10px] text-[#E5B5B5] leading-tight">Certified Assay Purity</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#25080F] border border-[#C5A253]/50 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#E7C878]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">Auspicious Motifs</p>
                  <p className="text-[10px] text-[#E5B5B5] leading-tight">Vedic Proportions</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#25080F] border border-[#C5A253]/50 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-[#E7C878]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">Tarnish Resistant</p>
                  <p className="text-[10px] text-[#E5B5B5] leading-tight">Hand-Finished Luster</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#25080F] border border-[#C5A253]/50 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E7C878]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">Pan-India Insured</p>
                  <p className="text-[10px] text-[#E5B5B5] leading-tight">Sacred Safe Delivery</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Features Row */}
      <section className="bg-white py-10 border-b border-[#E2E8F0]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0]">
            <div className="px-4 pt-4 md:pt-0">
              <h4 className="font-serif font-bold text-sm text-[#0F172A]">Certified 92.5 Purity</h4>
              <p className="text-xs text-[#64748B] mt-1">Guaranteed sterling purity stamped on every single pooja vessel and utensil.</p>
            </div>
            <div className="px-4 pt-4 md:pt-0">
              <h4 className="font-serif font-bold text-sm text-[#0F172A]">Tarnish-Resistant Coating</h4>
              <p className="text-xs text-[#64748B] mt-1">Specialized protective organic clear polish preserves silver luster without daily tarnishing.</p>
            </div>
            <div className="px-4 pt-4 md:pt-0">
              <h4 className="font-serif font-bold text-sm text-[#0F172A]">Sacred Weight Testing</h4>
              <p className="text-xs text-[#64748B] mt-1">Precision digital scale assay receipt provided with every purchase for 100% transparency.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Products Grid */}
      <section id="pooja-products" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[11px] font-semibold tracking-widest text-[#64748B] uppercase block mb-1">
            AUSPICIOUS PUJA ESSENTIALS
          </span>
          <h2 
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            className="text-2xl sm:text-4xl font-bold text-[#0F172A] tracking-tight"
          >
            Sacred Silver Masterpieces
          </h2>
        </div>

        <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 my-8">
          {POOJA_PRODUCTS.map((prod) => (
            <LuxuryProductCard
              key={prod.id}
              item={prod}
              wishlistItems={wishlistItems}
              onAddToCart={onAddToCart}
              onAddToWishlist={onAddToWishlist}
              onViewProduct={onViewProduct}
            />
          ))}
        </div>
      </section>

    </div>
  );
}

