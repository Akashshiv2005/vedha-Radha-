import React, { useState, useEffect, useRef } from 'react';
import { Heart, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProductUrl } from '../utils/productSlug';

// Curated 16 top masterpieces alternating Gold and Diamond collections
export const NEW_ARRIVALS_SHOWCASE = [
  // 1. Gold Choker
  {
    id: 'prod-arr-1',
    sku: 'VR-G-NCK-142',
    name: 'Antique Temple Lakshmi Floral Choker',
    categoryTag: 'Necklace Set',
    fullName: 'Antique Temple Lakshmi Floral Choker',
    category: 'Gold',
    subCategory: 'Necklaces',
    isDiamond: false,
    image: '/images/new-arrivals/new-arrival-antique-temple-necklace-luxe.jpg',
    velvetBg: 'bg-[#200408]',
    price: '₹ 1,42,500'
  },
  // 2. Diamond Solitaire
  {
    id: 'dia-solitaire-01',
    sku: 'VR-DIA-RNG-01',
    name: 'Celestial Solitaire 1.25 Carat Diamond Engagement Ring',
    categoryTag: 'Diamond Ring',
    fullName: 'Celestial Solitaire 1.25 Carat Diamond Ring',
    category: 'Diamond',
    subCategory: 'Rings',
    isDiamond: true,
    image: '/images/generated/diamond_solitaire_luxe.jpg',
    velvetBg: 'bg-[#091222]',
    price: '₹ 1,85,000'
  },
  // 3. Gold Jhumkas
  {
    id: 'prod-arr-2',
    sku: 'VR-G-EAR-205',
    name: 'Heritage Chettinad Royal Bell Jhumkas',
    categoryTag: 'Bridal Earrings',
    fullName: 'Heritage Chettinad Royal Bell Jhumkas',
    category: 'Gold',
    subCategory: 'Earrings',
    isDiamond: false,
    image: '/images/new-arrivals/new-arrival-chettinad-bell-jhumkas-luxe.jpg',
    velvetBg: 'bg-[#200408]',
    price: '₹ 48,900'
  },
  // 4. Diamond Tennis Bracelet
  {
    id: 'dia-bracelet-03',
    sku: 'VR-DIA-BRC-03',
    name: 'Celestial Infinity Diamond Tennis Bracelet',
    categoryTag: 'Tennis Bracelet',
    fullName: 'Celestial Infinity Diamond Tennis Bracelet',
    category: 'Diamond',
    subCategory: 'Bracelets',
    isDiamond: true,
    image: '/images/diamonds/diamond_tennis_bracelet.jpg',
    velvetBg: 'bg-[#091222]',
    price: '₹ 3,40,000'
  },
  // 5. Gold Bangles
  {
    id: 'prod-arr-4',
    sku: 'VR-G-BNG-312',
    name: 'Royal Heritage 22K Solid Gold Kadas',
    categoryTag: 'Gold Bangles',
    fullName: 'Royal Heritage 22K Solid Gold Kadas',
    category: 'Gold',
    subCategory: 'Bangles',
    isDiamond: false,
    image: '/images/new-arrivals/new-arrival-solid-antique-gold-kadas-luxe.jpg',
    velvetBg: 'bg-[#200408]',
    price: '₹ 2,18,000'
  },
  // 6. Diamond Chandelier Earrings
  {
    id: 'dia-earrings-04',
    sku: 'VR-DIA-EAR-04',
    name: 'Royal Chandrika Diamond Halo Chandelier Earrings',
    categoryTag: 'Diamond Drops',
    fullName: 'Royal Chandrika Diamond Halo Chandelier Earrings',
    category: 'Diamond',
    subCategory: 'Earrings',
    isDiamond: true,
    image: '/images/diamonds/diamond_chandelier_earrings.jpg',
    velvetBg: 'bg-[#091222]',
    price: '₹ 2,15,000'
  },
  // 7. Gold Temple Pendant
  {
    id: 'prod-arr-5',
    sku: 'VR-G-PDT-409',
    name: 'Goddess Lakshmi Sacred Temple Gold Pendant',
    categoryTag: 'Temple Pendant',
    fullName: 'Goddess Lakshmi Sacred Temple Gold Pendant',
    category: 'Gold',
    subCategory: 'Pendants',
    isDiamond: false,
    image: '/images/new-arrivals/new-arrival-temple-lakshmi-pendant-luxe.jpg',
    velvetBg: 'bg-[#200408]',
    price: '₹ 92,300'
  },
  // 8. Diamond Choker Suite
  {
    id: 'dia-necklace-02',
    sku: 'VR-DIA-NCK-02',
    name: 'Imperial Royal Diamond & Sapphire Cascade Choker',
    categoryTag: 'Diamond Choker',
    fullName: 'Imperial Royal Diamond & Sapphire Cascade Choker',
    category: 'Diamond',
    subCategory: 'Necklaces',
    isDiamond: true,
    image: '/images/plate_04_celestial_diamond_suite_pristine.jpg',
    velvetBg: 'bg-[#091222]',
    price: '₹ 4,85,000'
  },
  // 9. Gold Collar Choker
  {
    id: 'new-arrival-exclusive-temple-choker-04',
    sku: 'VR-G-EXC-TC04',
    name: 'Exclusive Nakshi Temple Arch 22K Gold Collar Choker',
    categoryTag: 'Temple Choker',
    fullName: 'Exclusive Nakshi Temple Arch 22K Gold Collar Choker',
    category: 'Gold',
    subCategory: 'Necklaces',
    isDiamond: false,
    image: '/images/new-arrivals/new-arrival-exclusive-temple-choker-01.jpg',
    velvetBg: 'bg-[#200408]',
    price: '₹ 1,78,000'
  },
  // 10. Diamond Eternity Band
  {
    id: 'dia-ring-05',
    sku: 'VR-DIA-RNG-05',
    name: 'Eternal Brilliance Diamond Eternity Band',
    categoryTag: 'Eternity Band',
    fullName: 'Eternal Brilliance Diamond Eternity Band',
    category: 'Diamond',
    subCategory: 'Rings',
    isDiamond: true,
    image: '/images/diamonds/diamond_eternity_band.jpg',
    velvetBg: 'bg-[#091222]',
    price: '₹ 98,000'
  },
  // 11. Gold Chandbali Earrings
  {
    id: 'new-arrival-exclusive-peacock-earrings-01',
    sku: 'VR-G-EXC-PE01',
    name: 'Exclusive Peacock Cascade Gold Chandbali Earrings',
    categoryTag: 'Peacock Chandbali',
    fullName: 'Exclusive Peacock Cascade Gold Chandbali Earrings',
    category: 'Gold',
    subCategory: 'Earrings',
    isDiamond: false,
    image: '/images/new-arrivals/new-arrival-exclusive-peacock-earrings-01.jpg',
    velvetBg: 'bg-[#200408]',
    price: '₹ 64,500'
  },
  // 12. Diamond Openable Kada
  {
    id: 'dia-bangle-07',
    sku: 'VR-DIA-BNG-07',
    name: 'Regal Sovereign Openable Diamond Kada',
    categoryTag: 'Diamond Kada',
    fullName: 'Regal Sovereign Openable Diamond Kada',
    category: 'Diamond',
    subCategory: 'Bangles',
    isDiamond: true,
    image: '/images/diamonds/diamond_kada_bangle.jpg',
    velvetBg: 'bg-[#091222]',
    price: '₹ 3,95,000'
  },
  // 13. Gold Fluted Kada
  {
    id: 'new-arrival-exclusive-gokhru-kada-03',
    sku: 'VR-G-EXC-GK03',
    name: 'Exclusive Royal Gokhru Fluted 22K Gold Kada',
    categoryTag: 'Gokhru Kada',
    fullName: 'Exclusive Royal Gokhru Fluted 22K Gold Kada',
    category: 'Gold',
    subCategory: 'Bangles',
    isDiamond: false,
    image: '/images/new-arrivals/new-arrival-exclusive-gokhru-kada-01.jpg',
    velvetBg: 'bg-[#200408]',
    price: '₹ 1,32,000'
  },
  // 14. Diamond Halo Pendant
  {
    id: 'dia-pendant-06',
    sku: 'VR-DIA-PDT-06',
    name: 'Aura Floral Solitaire Diamond Halo Pendant',
    categoryTag: 'Diamond Pendant',
    fullName: 'Aura Floral Solitaire Diamond Halo Pendant',
    category: 'Diamond',
    subCategory: 'Pendants',
    isDiamond: true,
    image: '/images/diamonds/diamond_halo_pendant.jpg',
    velvetBg: 'bg-[#091222]',
    price: '₹ 1,58,000'
  },
  // 15. Gold Bridal Vaddanam
  {
    id: 'new-arrival-exclusive-nakshi-vaddanam-09',
    sku: 'VR-G-EXC-NV09',
    name: 'Exclusive Gajalakshmi Royal Nakshi Bridal Vaddanam',
    categoryTag: 'Bridal Vaddanam',
    fullName: 'Exclusive Gajalakshmi Royal Nakshi Bridal Vaddanam',
    category: 'Gold',
    subCategory: 'Vaddanams',
    isDiamond: false,
    image: '/images/new-arrivals/new-arrival-exclusive-nakshi-vaddanam-01.jpg',
    velvetBg: 'bg-[#200408]',
    price: '₹ 5,20,000'
  },
  // 16. Diamond Waterfall Haram
  {
    id: 'dia-necklace-08',
    sku: 'VR-DIA-NCK-08',
    name: "Queen's Heritage Imperial Diamond Waterfall Haram",
    categoryTag: 'Diamond Haram',
    fullName: "Queen's Heritage Imperial Diamond Waterfall Haram",
    category: 'Diamond',
    subCategory: 'Necklaces',
    isDiamond: true,
    image: '/images/diamonds/diamond_bridal_necklace.jpg',
    velvetBg: 'bg-[#091222]',
    price: '₹ 7,50,000'
  }
];

// Duplicated list (3 sets) for infinite seamless bidirectional smooth scrolling
const FLOW_ITEMS = [...NEW_ARRIVALS_SHOWCASE, ...NEW_ARRIVALS_SHOWCASE, ...NEW_ARRIVALS_SHOWCASE];

export default function NewArrivalsSection({ onViewProduct, onAddToCart, onAddToWishlist, wishlistItems = [] }) {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState({});
  const [isPaused, setIsPaused] = useState(false);
  const [activeDot, setActiveDot] = useState(0);

  const scrollRef = useRef(null);
  const manualPauseTimerRef = useRef(null);

  const toggleWishlist = (product) => {
    setWishlist((prev) => ({ ...prev, [product.id]: !prev[product.id] }));
    if (onAddToWishlist) onAddToWishlist(product);
  };

  const handleCardClick = (product) => {
    if (onViewProduct) {
      onViewProduct(product);
    } else {
      navigate(getProductUrl(product));
    }
  };

  // Helper to pause auto-scroll during and after manual navigation
  const pauseAutoScroll = () => {
    setIsPaused(true);
    if (manualPauseTimerRef.current) clearTimeout(manualPauseTimerRef.current);
    manualPauseTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 2500);
  };

  // Initialize scroll position to the middle set for seamless bidirectional scrolling
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      const singleSetWidth = el.scrollWidth / 3;
      if (singleSetWidth > 0 && el.scrollLeft === 0) {
        el.scrollLeft = singleSetWidth;
      }
    }
  }, []);

  // Buttery-smooth continuous flow using requestAnimationFrame
  useEffect(() => {
    let animId;
    const el = scrollRef.current;
    if (!el) return;

    let lastTime = performance.now();

    const step = (time) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (!isPaused && el) {
        el.scrollLeft += 36 * Math.min(delta, 0.1); // Continuous smooth glide (~36px/sec)
        
        // Seamless infinite wrap: maintain position within middle set
        const singleSetWidth = el.scrollWidth / 3;
        if (singleSetWidth > 0 && el.scrollLeft >= singleSetWidth * 2) {
          el.scrollLeft -= singleSetWidth;
        }

        // Update active dot (0 to 3)
        if (singleSetWidth > 0) {
          const progress = (((el.scrollLeft - singleSetWidth) % singleSetWidth + singleSetWidth) % singleSetWidth) / singleSetWidth;
          setActiveDot(Math.min(3, Math.floor(progress * 4)));
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(animId);
      if (manualPauseTimerRef.current) clearTimeout(manualPauseTimerRef.current);
    };
  }, [isPaused]);

  // Smooth Navigation Buttons
  const handlePrev = () => {
    const el = scrollRef.current;
    if (!el) return;
    pauseAutoScroll();

    const cardEl = el.querySelector('.group');
    const scrollAmount = cardEl ? (cardEl.offsetWidth + 20) * 1.5 : 320;

    const singleSetWidth = el.scrollWidth / 3;
    if (singleSetWidth > 0 && el.scrollLeft <= singleSetWidth * 0.4) {
      el.scrollLeft += singleSetWidth;
    }
    el.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  };

  const handleNext = () => {
    const el = scrollRef.current;
    if (!el) return;
    pauseAutoScroll();

    const cardEl = el.querySelector('.group');
    const scrollAmount = cardEl ? (cardEl.offsetWidth + 20) * 1.5 : 320;

    const singleSetWidth = el.scrollWidth / 3;
    if (singleSetWidth > 0 && el.scrollLeft >= singleSetWidth * 2) {
      el.scrollLeft -= singleSetWidth;
    }
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const scrollToDot = (dotIdx) => {
    const el = scrollRef.current;
    if (!el) return;
    pauseAutoScroll();
    const singleSetWidth = el.scrollWidth / 3;
    const targetScroll = singleSetWidth + (singleSetWidth / 4) * dotIdx;
    el.scrollTo({ left: targetScroll, behavior: 'smooth' });
    setActiveDot(dotIdx);
  };

  return (
    <section 
      className="relative bg-gradient-to-b from-[#35030C] via-[#240107] to-[#180104] pt-12 sm:pt-14 pb-14 sm:pb-16 select-none overflow-hidden border-y border-[#D4AF37]/35"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      
      {/* Ambient Radial Velvet Glow Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 25%, rgba(145, 14, 38, 0.45) 0%, rgba(18, 1, 4, 0.95) 100%)'
        }}
      />

      {/* 1. TOP-LEFT: Flowing Royal Maroon Silk Ribbon with 24K Gold Trim */}
      <div className="absolute top-0 left-0 w-48 sm:w-72 md:w-88 h-36 sm:h-48 md:h-56 pointer-events-none overflow-hidden z-0">
        <svg viewBox="0 0 260 170" fill="none" className="w-full h-full opacity-95">
          <path d="M-20 -20 C80 20 115 90 0 170 L-20 170 Z" fill="#4E0C16" />
          <path d="M-20 -20 C100 30 135 95 18 170" stroke="#D4AF37" strokeWidth="3" />
          <path d="M-20 -20 C115 40 155 105 32 170" stroke="#FCEB9C" strokeWidth="1.2" opacity="0.8" />
          <path d="M-20 -20 C50 15 78 75 -12 135" fill="#2E040A" />
        </svg>
      </div>

      {/* 2. BOTTOM-LEFT: Traditional Ornate Golden Mandala Wheel Flourish */}
      <div className="absolute -bottom-10 -left-10 w-44 sm:w-56 md:w-64 h-44 sm:h-56 md:h-64 pointer-events-none z-0 opacity-20">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-[#D4AF37]" stroke="currentColor" strokeWidth="1">
          <circle cx="100" cy="100" r="90" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="75" />
          <circle cx="100" cy="100" r="55" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="35" />
          {Array.from({ length: 16 }).map((_, i) => (
            <path key={i} d={`M100 100 L${100 + 85 * Math.cos((i * 22.5 * Math.PI) / 180)} ${100 + 85 * Math.sin((i * 22.5 * Math.PI) / 180)}`} />
          ))}
        </svg>
      </div>

      {/* 3. TOP-RIGHT: Traditional Ornate Golden Mandala Lace Corner */}
      <div className="absolute -top-10 -right-10 w-44 sm:w-56 md:w-64 h-44 sm:h-56 md:h-64 pointer-events-none z-0 opacity-22 hidden sm:block">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-[#D4AF37]" stroke="currentColor" strokeWidth="1">
          <circle cx="100" cy="100" r="90" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="75" />
          <circle cx="100" cy="100" r="55" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="35" />
          {Array.from({ length: 16 }).map((_, i) => (
            <path key={i} d={`M100 100 L${100 + 85 * Math.cos((i * 22.5 * Math.PI) / 180)} ${100 + 85 * Math.sin((i * 22.5 * Math.PI) / 180)}`} />
          ))}
        </svg>
      </div>

      {/* 4. BOTTOM-RIGHT: Flowing Royal Maroon Silk Ribbon with 24K Gold Trim */}
      <div className="absolute bottom-0 right-0 w-48 sm:w-72 md:w-88 h-36 sm:h-48 md:h-56 pointer-events-none overflow-hidden z-0">
        <svg viewBox="0 0 260 170" fill="none" className="w-full h-full opacity-95">
          <path d="M280 190 C180 150 145 80 260 0 L280 0 Z" fill="#4E0C16" />
          <path d="M280 190 C160 140 125 75 242 0" stroke="#D4AF37" strokeWidth="3" />
          <path d="M280 190 C145 130 105 65 228 0" stroke="#FCEB9C" strokeWidth="1.2" opacity="0.8" />
          <path d="M280 190 C210 155 182 95 272 35" fill="#2E040A" />
        </svg>
      </div>

      <div className="w-full max-w-[1760px] 2xl:max-w-[1840px] mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Golden Lotus Motif & Wings (Gleaming white/gold on royal red) */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center max-w-xl mx-auto mb-7 sm:mb-8"
        >
          {/* Golden Lotus Blossom Emblem */}
          <div className="flex justify-center mb-1.5">
            <svg viewBox="0 0 60 36" fill="none" className="w-10 h-6 text-[#D4AF37] drop-shadow-[0_2px_8px_rgba(212,175,55,0.6)]">
              <path d="M30 4 C27 16 18 24 6 28 C16 30 24 28 30 25 C36 28 44 30 54 28 C42 24 33 16 30 4 Z" fill="#D4AF37" />
              <path d="M30 9 C26 18 20 23 12 26 C18 27 24 26 30 24 C36 26 42 27 48 26 C40 23 34 18 30 9 Z" fill="#FCEB9C" opacity="0.9" />
              <circle cx="30" cy="27" r="2" fill="#FCEB9C" />
            </svg>
          </div>

          {/* Heading with Gold Wing Flourishes */}
          <div className="flex items-center justify-center gap-3.5 mb-1.5">
            <span className="w-10 sm:w-16 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-[#D4AF37]" />
            <h2 
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
              className="text-2xl sm:text-3xl lg:text-[40px] font-bold text-white tracking-tight leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
            >
              New Arrivals
            </h2>
            <span className="w-10 sm:w-16 h-[1.5px] bg-gradient-to-l from-transparent via-[#D4AF37] to-[#D4AF37]" />
          </div>

          <p className="text-xs sm:text-[13.5px] text-[#E8D5BC] font-normal tracking-wide drop-shadow-xs">
            Latest designs handpicked for you
          </p>
        </motion.div>

        {/* 4. Product Cards Continuous Flow Track (Reduced Card Height on Royal Red Background) */}
        <div className="relative px-1 sm:px-3">
          
          {/* Seamless Infinite Gliding Carousel Track */}
          <div 
            ref={scrollRef}
            className="flex items-stretch gap-4 sm:gap-5 lg:gap-6 overflow-x-auto pb-4 pt-1 px-1 scrollbar-none"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {FLOW_ITEMS.map((item, idx) => {
              const isSaved = wishlist[item.id] || wishlistItems.some((w) => w.id === item.id);
              const isDiamond = Boolean(item.isDiamond);

              return (
                <div
                  key={`${item.id}-${idx}`}
                  onClick={() => handleCardClick(item)}
                  className={`shrink-0 w-[230px] sm:w-[260px] md:w-[280px] lg:w-[300px] xl:w-[320px] bg-white rounded-[18px] sm:rounded-[20px] border-2 ${
                    isDiamond 
                      ? 'border-[#CBD5E1] hover:border-[#E2E8F0] shadow-[0_10px_28px_rgba(0,0,0,0.5),0_2px_10px_rgba(148,163,184,0.25)] hover:shadow-[0_18px_36px_rgba(0,0,0,0.6)]' 
                      : 'border-[#D4AF37] hover:border-[#FCEB9C] shadow-[0_10px_28px_rgba(0,0,0,0.5),0_2px_10px_rgba(212,175,55,0.35)] hover:shadow-[0_18px_36px_rgba(212,175,55,0.45)]'
                  } hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer`}
                >
                  
                  {/* Top Velvet Stage Display - Sleek, Reduced Height */}
                  <div className={`relative w-full h-[190px] sm:h-[205px] md:h-[215px] ${item.velvetBg} overflow-hidden rounded-t-[16px] sm:rounded-t-[18px] flex items-center justify-center p-2.5`}>
                    
                    {/* Clean Jewellery Product Image */}
                    <img 
                      src={item.image} 
                      alt={item.fullName || item.name} 
                      className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 rounded-md select-none"
                      loading="lazy"
                    />

                    {/* Top-Right Heart Outline Icon */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(item);
                      }}
                      className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full hover:bg-black/35 transition-colors cursor-pointer"
                      aria-label="Wishlist"
                      title={isSaved ? 'In Wishlist' : 'Add to Wishlist'}
                    >
                      <Heart 
                        className={`w-4 h-4 transition-colors ${
                          isSaved ? 'fill-[#E53935] text-[#E53935]' : 'text-white/90 hover:text-white stroke-[1.8]'
                        }`} 
                      />
                    </button>
                  </div>

                  {/* Bottom Champagne Plinth Bar - Clean single line matching reference */}
                  <div className="bg-gradient-to-r from-[#FFFDF9] via-[#FAF3E8] to-[#FFFDF9] px-3.5 py-2.5 sm:py-3 border-t border-[#E8DEC8] flex items-center justify-between rounded-b-[16px] sm:rounded-b-[18px]">
                    
                    {/* Crown Icon + Name */}
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                      {/* Stylized Golden Coronet Crown */}
                      <svg className="w-3.5 h-3.5 text-[#C99A38] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5ZM19 19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V17H19V19Z"/>
                      </svg>
                      <span 
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        className="text-xs sm:text-[13px] font-bold text-[#2A1015] group-hover:text-[#581923] transition-colors truncate"
                        title={item.fullName || item.name}
                      >
                        {item.categoryTag || item.name}
                      </span>
                    </div>

                    {/* Circular Shopping Bag Action Button */}
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(item);
                      }}
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#DEC5A0] hover:bg-[#B38E46] text-white flex items-center justify-center transition-colors shadow-2xs shrink-0 cursor-pointer hover:scale-105 active:scale-95"
                      title="View Details"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 stroke-[2]" />
                    </div>

                  </div>

                </div>
              );
            })}
          </div>

          {/* Left Navigation Arrow Button */}
          <button
            onClick={handlePrev}
            onMouseEnter={() => setIsPaused(true)}
            className="absolute -left-2 sm:-left-3 lg:-left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-[#4A0E18] shadow-[0_6px_22px_rgba(0,0,0,0.6)] border border-[#E8DEC8] flex items-center justify-center hover:scale-108 active:scale-95 transition-all cursor-pointer z-30"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          </button>

          {/* Right Navigation Arrow Button */}
          <button
            onClick={handleNext}
            onMouseEnter={() => setIsPaused(true)}
            className="absolute -right-2 sm:-right-3 lg:-right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-[#4A0E18] shadow-[0_6px_22px_rgba(0,0,0,0.6)] border border-[#E8DEC8] flex items-center justify-center hover:scale-108 active:scale-95 transition-all cursor-pointer z-30"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          </button>

        </div>

        {/* 5. Pagination Indicator Dots on Royal Red (Golden active pill) */}
        <div className="flex items-center justify-center gap-2 mt-7 select-none">
          {[0, 1, 2, 3].map((dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => scrollToDot(dotIdx)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                activeDot === dotIdx
                  ? 'w-6 h-2 bg-[#E5C278] shadow-[0_0_8px_rgba(229,194,120,0.8)]'
                  : 'w-2 h-2 bg-white/35 hover:bg-white/60'
              }`}
              aria-label={`Slide ${dotIdx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
