import React from 'react';
import { useNavigate } from 'react-router-dom';
import { storefrontClient } from '../api/storefrontProductsClient';
import { ProductGridSkeleton } from '../components/common/ProductCardSkeleton';
import { Sparkles, Heart, ShoppingBag, Calendar, CheckCircle2, ChevronRight, PhoneCall, Award } from 'lucide-react';

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

  const bridalSets = [
    {
      title: 'Muhurtham Grand Set',
      pieces: 'Lakshmi Haram + Choker + Vanki + Jhumkas',
      goldWeight: '120g &ndash; 180g (Customizable)',
      highlight: '0% Making Charge on Selected Items',
      image: '/images/col_bridal.jpg'
    },
    {
      title: 'Chettinad Heritage Set',
      pieces: 'Manga Malai + Antique Oddiyanam + Kadas',
      goldWeight: '95g &ndash; 140g (Customizable)',
      highlight: 'Pure Hand-Chased Temple Art',
      image: '/images/col_handcrafted.jpg'
    },
    {
      title: 'Contemporary Reception Set',
      pieces: 'Diamond & Kemp Choker + Royal Bangles',
      goldWeight: '80g &ndash; 110g (Customizable)',
      highlight: 'BIS Hallmarked Natural Gemstones',
      image: '/images/product_necklace.jpg'
    }
  ];

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8 sm:py-12 border-b border-[#EAE2D5]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-[#7A6E65] mb-4">
          <button onClick={() => navigate('/')} className="hover:text-[#581923] cursor-pointer">Home</button>
          <ChevronRight className="w-3.5 h-3.5 text-[#B38E46]" />
          <span className="font-semibold text-[#581923]">Bridal Trousseau</span>
        </div>

        {/* Wide Desktop Bridal Collection Hero Banner */}
        <div className="mb-10">
          <div className="relative w-full aspect-[21/9] min-h-[360px] sm:min-h-[420px] lg:min-h-[460px] rounded-2xl overflow-hidden border border-[#C49A45]/40 shadow-[0_12px_36px_rgba(101,31,43,0.12)] bg-[#450F18]">
            <img
              src="/images/bridal_hero_clean.jpg"
              alt="South Indian bridal temple jewellery collection on rich maroon silk"
              className="absolute inset-0 w-full h-full object-cover object-right sm:object-center"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#380911]/90 via-[#450F18]/60 to-transparent pointer-events-none" />
            <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-20 max-w-xl lg:max-w-2xl py-8">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <span className="h-[1px] w-8 sm:w-10 bg-[#C49A45]"></span>
                <span className="text-[#C49A45] text-[10.5px] sm:text-xs font-semibold tracking-[0.22em] uppercase font-sans">
                  BRIDAL COLLECTION
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-normal text-[#F8F4EC] leading-[1.16] tracking-tight">
                Where Every Bride<br />
                Becomes a Tradition
              </h1>
              <p className="text-[#F8F4EC]/90 font-sans text-xs sm:text-sm lg:text-[14.5px] font-normal leading-relaxed mt-3 sm:mt-4 max-w-md sm:max-w-lg">
                Heirloom-inspired gold jewellery, designed to shine through sacred rituals and timeless celebrations.
              </p>
              <div className="mt-6 sm:mt-7">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('bridal-products');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group inline-flex items-center justify-center px-5 sm:px-7 py-2.5 sm:py-3 rounded border border-[#C49A45] bg-[#3B0B14]/40 hover:bg-[#651F2B] hover:border-[#E5C278] text-[#F8F4EC] hover:text-white transition-all duration-300 shadow-sm cursor-pointer"
                >
                  <span className="text-[10.5px] sm:text-[11.5px] font-medium tracking-[0.2em] uppercase font-sans">
                    EXPLORE COLLECTION
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

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

        {/* Featured Bridal Sets */}
        <div className="mb-12">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C6D2D]">Curated Packages</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#241716] mt-1">
              Signature Wedding Sets
            </h2>
            <p className="text-xs text-[#73655C] mt-1">
              Pre-matched heritage combinations for wedding ceremonies, reception, and traditional rituals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bridalSets.map((set, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-[#E8DFC0] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                <div className="aspect-16/10 overflow-hidden bg-[#ECE4D8]">
                  <img src={set.image} alt={set.title} className="w-full h-full object-cover object-center" />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#8C6D2D] uppercase tracking-wider bg-[#F8F2E6] px-2 py-0.5 rounded">
                      {set.highlight}
                    </span>
                    <h3 className="text-lg font-bold text-[#241716] mt-2">{set.title}</h3>
                    <p className="text-xs text-[#4A403A] mt-1 font-medium">{set.pieces}</p>
                    <p className="text-[11px] text-[#7A6E65] mt-1 font-mono">Approx. Weight: {set.goldWeight}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#F0E8DC]">
                    <button
                      onClick={() => navigate('/contact')}
                      className="w-full bg-[#581923] hover:bg-[#431219] text-white py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Inquire / Book Try-On
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bridalProducts.map((item) => {
              const isWishlisted = wishlistItems.some(w => w.id === item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-[#E8DFC0] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-[#EFE8DC]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/product_gold_chain.jpg';
                      }}
                    />
                    <button
                      onClick={() => onAddToWishlist(item)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-[#581923] shadow-md cursor-pointer"
                      title="Save to Bridal Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#D32F2F] text-[#D32F2F]' : ''}`} />
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10.5px] font-bold text-[#8C6D2D] uppercase tracking-wider">{item.details}</span>
                      <h3 className="text-base font-bold text-[#241716] mt-1">{item.name}</h3>
                      <p className="text-xs text-[#63574F] line-clamp-2 mt-1">{item.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#EAE2D5] flex items-center justify-between">
                      <span className="text-lg font-bold text-[#48161E]">{item.price}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onViewProduct(item)}
                          className="px-3 py-1.5 rounded-md border border-[#581923] text-[#581923] hover:bg-[#FAF0E1] text-xs font-semibold cursor-pointer"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => onAddToCart(item)}
                          className="px-3 py-1.5 rounded-md bg-[#581923] text-white hover:bg-[#431219] text-xs font-semibold flex items-center gap-1 cursor-pointer"
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
          )}
        </div>

      </div>
    </div>
  );
}
