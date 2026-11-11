import React from 'react';
import { useNavigate } from 'react-router-dom';
import { storefrontClient } from '../api/storefrontProductsClient';
import { ProductGridSkeleton } from '../components/common/ProductCardSkeleton';
import LuxuryProductCard from '../components/common/LuxuryProductCard';
import { Sparkles, Heart, ShoppingBag, Calendar, CheckCircle2, ChevronRight, PhoneCall, Award, ArrowRight, ShieldCheck } from 'lucide-react';

export default function BridalPage({
  onViewProduct = () => {},
  onAddToCart = () => {},
  onAddToWishlist = () => {},
  wishlistItems = []
}) {
  const navigate = useNavigate();
  const [dbProducts, setDbProducts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [apiError, setApiError] = React.useState(null);

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
          setApiError(res.error || 'Failed to load bridal products');
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

  // Filter bridal items from database
  const bridalProducts = dbProducts.filter(p => p.isBridal || p.category?.toLowerCase().includes('bridal') || p.category?.toLowerCase().includes('gold'));

  return (
    <div className="bg-[#FAF7F2] min-h-screen border-b border-[#EAE2D5] select-none font-sans">
      
      {/* 1. Full-Bleed Split Luxury Bridal Hero Banner matching reference design */}
      <section className="relative bg-[#1A0407] text-white overflow-hidden border-b border-[#C5A253]/35 min-h-[520px] lg:min-h-[580px] flex items-center">
        {/* Background stage showcase on the right */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="/images/bridal_luxury_stage_hero.png"
            alt="Opulent Royal South Indian Bridal Jewellery Suite"
            className="w-full h-full object-cover object-[75%_center] lg:object-right"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/images/bridal_luxury_stage_hero.jpg';
            }}
          />
          {/* Crisp Left-Only Fade: Leaves the entire right jewelry showcase 100% clear and luminous */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A0407] via-[#1A0407]/90 via-35% md:via-42% to-transparent to-60% md:to-58% pointer-events-none" />
        </div>

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16">
          <div className="max-w-2xl lg:max-w-xl xl:max-w-2xl">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs text-[#E5B5B5] mb-4 font-medium tracking-wide">
              <button onClick={() => navigate('/')} className="hover:text-white transition-colors cursor-pointer">Home</button>
              <ChevronRight className="w-3.5 h-3.5 text-[#C5A253]" />
              <span className="text-[#FCEB9C] font-semibold">Bridal Trousseau &amp; Muhurtham</span>
            </div>

            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#350810]/90 border border-[#C5A253]/60 text-[#F5DE98] text-[11px] font-semibold mb-4 tracking-widest uppercase shadow-[0_2px_12px_rgba(197,162,83,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-[#E7C878]" />
              <span>ROYAL SOUTH INDIAN HERITAGE &bull; 22K PURE GOLD</span>
            </div>

            {/* Title */}
            <h1 
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
              className="text-3xl sm:text-5xl lg:text-[52px] font-bold text-white tracking-tight leading-[1.12]"
            >
              The <span className="font-serif">Bridal Collection</span>
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
              Where Every Bride Becomes a Sacred Tradition.
            </p>

            {/* Narrative description */}
            <p className="text-xs sm:text-sm text-[#F3DCDD] mt-3 font-light leading-relaxed max-w-xl">
              Curated for generations of South Indian brides, our bridal trousseau unites antique nakshi temple chokers, multilayered mango harams, and handcrafted temple vaddanams in 22K BIS 916 pure gold.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 mt-7">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('bridal-products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-gradient-to-r from-[#D4AF37] via-[#FCEB9C] to-[#C59B27] hover:brightness-110 text-[#1A0407] font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-[0_4px_20px_rgba(212,175,55,0.35)] transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Explore Bridal Masterpieces</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/contact')}
                className="bg-[#2D060E]/90 hover:bg-[#3D0A14] border border-[#C5A253]/60 hover:border-[#C5A253] text-[#F3E5C8] font-medium text-xs sm:text-sm px-5 py-3 rounded-full backdrop-blur-sm transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5 text-[#C5A253]" />
                <span>Book Bridal Consultation</span>
              </button>
            </div>

            {/* Trust Badges matching reference design */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10 max-w-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#350810] border border-[#C5A253]/50 flex items-center justify-center shrink-0">
                  <Award className="w-3.5 h-3.5 text-[#E7C878]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">100% BIS 916</p>
                  <p className="text-[10px] text-[#E5B5B5] leading-tight">Hallmarked Gold</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#350810] border border-[#C5A253]/50 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#E7C878]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">Antique Nakshi</p>
                  <p className="text-[10px] text-[#E5B5B5] leading-tight">Master Craft</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#350810] border border-[#C5A253]/50 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-[#E7C878]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">0% Making Benefit</p>
                  <p className="text-[10px] text-[#E5B5B5] leading-tight">Select Sets</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#350810] border border-[#C5A253]/50 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E7C878]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">Custom Trousseau</p>
                  <p className="text-[10px] text-[#E5B5B5] leading-tight">Tailored Weight</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 sm:py-12">

        {/* 3 Steps Bridal Assurance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="p-5 bg-white rounded-xl border border-[#E8DFC0] shadow-2xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#F3EAD3] text-[#581923] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#241716]">100% Hallmarked 916 Gold</h3>
              <p className="text-xs text-[#73655C] mt-0.5">Every gram verified by Govt-certified laser assaying for absolute purity.</p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-xl border border-[#E8DFC0] shadow-2xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#F3EAD3] text-[#581923] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#241716]">0% Making Charge Benefit</h3>
              <p className="text-xs text-[#73655C] mt-0.5">Special wedding trousseau savings on complete Muhurtham gold packages.</p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-xl border border-[#E8DFC0] shadow-2xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#F3EAD3] text-[#581923] flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#241716]">Bespoke Artisan Customization</h3>
              <p className="text-xs text-[#73655C] mt-0.5">Tailor necklaces, waist belts, and bangles to your saree fabric and neckline.</p>
            </div>
          </div>
        </div>

        {/* Bridal Product Listing */}
        <div id="bridal-products" className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#241716]">Bridal Jewellery Catalog</h2>
              <p className="text-xs text-[#7A6E65] mt-0.5">Individual bridal pieces ready for showcase and reserving.</p>
            </div>
            <button
              onClick={() => navigate('/jewellery?category=Gold')}
              className="text-xs font-semibold text-[#581923] hover:underline cursor-pointer"
            >
              View Full Gold Range &rarr;
            </button>
          </div>

          {isLoading ? (
            <ProductGridSkeleton
              count={6}
              columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              aspect="aspect-4/3"
              label="Curating Temple Bridal Jewellery..."
            />
          ) : apiError ? (
            <div className="bg-white rounded-xl p-12 text-center border border-[#DECDBB] my-8">
              <h3 className="text-xl font-bold text-[#8C1D28]">{apiError}</h3>
              <p className="text-xs text-[#7A6E65] mt-1">Please verify your server connection or try again later.</p>
            </div>
          ) : bridalProducts.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-[#DECDBB] my-8">
              <h3 className="text-xl font-bold text-[#241716]">No products available yet.</h3>
              <p className="text-xs text-[#7A6E65] mt-1">New bridal designs will be showcased here as soon as they are added to the vault inventory.</p>
            </div>
          ) : (
          <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 my-8">
            {bridalProducts.map((item) => (
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
    </div>
  );
}
