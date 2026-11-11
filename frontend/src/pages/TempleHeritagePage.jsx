import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LuxuryProductCard from '../components/common/LuxuryProductCard';
import { Sparkles, ShieldCheck, Heart, Eye, ArrowRight, Award, Compass, MapPin, Calendar, ChevronRight, CheckCircle2 } from 'lucide-react';
import { TEMPLE_PRODUCTS } from '../data/templeProducts';

export default function TempleHeritagePage({ onViewProduct, onAddToCart, onAddToWishlist, wishlistItems = [] }) {
  const navigate = useNavigate();

  return (
    <div className="bg-[#FAF7F2] min-h-screen select-none font-sans">
      
      {/* 1. Split Luxury Temple Heritage Hero Banner matching reference design */}
      <section className="relative bg-[#1E0409] text-white overflow-hidden border-b border-[#C5A253]/35 min-h-[520px] lg:min-h-[580px] flex items-center">
        {/* Background stage showcase on the right */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="/images/hero_opulent_temple_jewelry_still_life.png"
            alt="Opulent Temple Jewellery Nakshi Art on Carved Teakwood"
            className="w-full h-full object-cover object-[75%_center] lg:object-right"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/images/col_handcrafted.jpg';
            }}
          />
          {/* Crisp Left-Only Fade: Leaves the entire right jewelry showcase 100% clear and luminous */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E0409] via-[#1E0409]/90 via-35% md:via-42% to-transparent to-60% md:to-58% pointer-events-none" />
        </div>

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16">
          <div className="max-w-2xl lg:max-w-xl xl:max-w-2xl">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs text-[#E5B5B5] mb-4 font-medium tracking-wide">
              <button onClick={() => navigate('/')} className="hover:text-white transition-colors cursor-pointer">Home</button>
              <ChevronRight className="w-3.5 h-3.5 text-[#C5A253]" />
              <button onClick={() => navigate('/collections')} className="hover:text-white transition-colors cursor-pointer">Collections</button>
              <ChevronRight className="w-3.5 h-3.5 text-[#C5A253]" />
              <span className="text-[#FCEB9C] font-semibold">Temple Heritage Craft</span>
            </div>

            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#350810]/90 border border-[#C5A253]/60 text-[#F5DE98] text-[11px] font-semibold mb-4 tracking-widest uppercase shadow-[0_2px_12px_rgba(197,162,83,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-[#E7C878]" />
              <span>SACRED SOUTH INDIAN ARTISTRY &bull; 22K PURE GOLD</span>
            </div>

            {/* Title */}
            <h1 
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
              className="text-3xl sm:text-5xl lg:text-[52px] font-bold text-white tracking-tight leading-[1.12]"
            >
              The <span className="font-serif">Temple Heritage Collection</span>
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
              Devotion Cast in Pure 22K Gold. Crafted by Master Goldsmiths.
            </p>

            {/* Narrative description */}
            <p className="text-xs sm:text-sm text-[#F3DCDD] mt-3 font-light leading-relaxed max-w-xl">
              Inspired by the magnificent temple architecture of Srirangam and Thanjavur, our temple collection pays homage to centuries of Dravidian sacred craftsmanship with hand-chased deities, peacocks, and temple motifs.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 mt-7">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('temple-showcase');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-gradient-to-r from-[#D4AF37] via-[#FCEB9C] to-[#C59B27] hover:brightness-110 text-[#1E0409] font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-[0_4px_20px_rgba(212,175,55,0.35)] transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Explore Temple Masterpieces</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/contact')}
                className="bg-[#2D060E]/90 hover:bg-[#3D0A14] border border-[#C5A253]/60 hover:border-[#C5A253] text-[#F3E5C8] font-medium text-xs sm:text-sm px-5 py-3 rounded-full backdrop-blur-sm transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5 text-[#C5A253]" />
                <span>Book Showroom Viewing</span>
              </button>
            </div>

            {/* Trust Badges matching reference design */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10 max-w-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#350810] border border-[#C5A253]/50 flex items-center justify-center shrink-0">
                  <Award className="w-3.5 h-3.5 text-[#E7C878]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">22K BIS 916</p>
                  <p className="text-[10px] text-[#E5B5B5] leading-tight">Sacred Hallmark Purity</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#350810] border border-[#C5A253]/50 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#E7C878]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">Hand-Chased Nakshi</p>
                  <p className="text-[10px] text-[#E5B5B5] leading-tight">Traditional Artisans</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#350810] border border-[#C5A253]/50 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-[#E7C878]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">Natural Rubies</p>
                  <p className="text-[10px] text-[#E5B5B5] leading-tight">Burmese Kemp Stones</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#350810] border border-[#C5A253]/50 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E7C878]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">Heirloom Trust</p>
                  <p className="text-[10px] text-[#E5B5B5] leading-tight">Since 2010 in Trichy</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Artisanship Story Bar */}
      <section className="bg-white py-10 border-b border-[#EAE2D5]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[#F0E6D8]">
            <div className="px-4 pt-4 md:pt-0">
              <div className="w-10 h-10 rounded-full bg-[#FAF5EB] text-[#B88E3E] flex items-center justify-center mx-auto mb-2.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-sm text-[#4E0C16]">100% 916 BIS Hallmark</h4>
              <p className="text-xs text-[#73655C] mt-1">Every temple ornament is assayed and laser-marked with official HUID certification.</p>
            </div>
            <div className="px-4 pt-4 md:pt-0">
              <div className="w-10 h-10 rounded-full bg-[#FAF5EB] text-[#B88E3E] flex items-center justify-center mx-auto mb-2.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-sm text-[#4E0C16]">Nakshi Hand-Chasing</h4>
              <p className="text-xs text-[#73655C] mt-1">Each deity and petal is chiseled by hand with traditional punches without molds.</p>
            </div>
            <div className="px-4 pt-4 md:pt-0">
              <div className="w-10 h-10 rounded-full bg-[#FAF5EB] text-[#B88E3E] flex items-center justify-center mx-auto mb-2.5">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-sm text-[#4E0C16]">Antique Red Patina</h4>
              <p className="text-xs text-[#73655C] mt-1">Specialized traditional wax-burnished antique finish that enriches over generations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Product Catalog Grid */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[11px] font-semibold tracking-widest text-[#917144] uppercase block mb-1">
            SACRED PIECES AVAILABLE IN SHOWROOM
          </span>
          <h2 
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            className="text-2xl sm:text-4xl font-bold text-[#4E0C16] tracking-tight"
          >
            Handpicked Temple Masterpieces
          </h2>
        </div>

        <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 my-8">
          {TEMPLE_PRODUCTS.map((prod) => (
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

      {/* 4. Showroom Booking CTA */}
      <section className="bg-gradient-to-r from-[#4E0C16] to-[#34070E] text-white py-14 border-t border-[#D4AF37]/30">
        <div className="max-w-[1000px] mx-auto px-4 text-center">
          <h3 
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            className="text-2xl sm:text-3xl font-bold text-white"
          >
            Experience Our Temple Vault in Trichy
          </h3>
          <p className="text-xs sm:text-sm text-[#EAD8D8] mt-2 max-w-xl mx-auto font-light">
            Visit our Thillai Nagar flagship showroom to view our complete collection of heritage wedding sets, or schedule a personalized consultation with our chief jewellery designer.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate('/contact')}
              className="btn-shine-sweep bg-[#D4AF37] hover:bg-[#C59B27] text-[#241716] font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment at Trichy Showroom</span>
            </button>
            <a
              href="tel:+919876543210"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 text-xs sm:text-sm px-5 py-3 rounded-xl transition-colors cursor-pointer"
            >
              Call +91 98765 43210
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}

