import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Crown } from 'lucide-react';

// Ornate Golden Filigree Corner Scrollwork matching reference
function OrnateCornerFiligree({ className = "w-16 h-16" }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" stroke="#E5C158" strokeWidth="1.75">
      <path d="M4 76V24C4 12.9543 12.9543 4 24 4H76" strokeLinecap="round" />
      <path d="M10 76V26C10 17.1634 17.1634 10 26 10H76" strokeOpacity="0.6" strokeLinecap="round" />
      <circle cx="24" cy="24" r="5" stroke="#DFBF72" strokeWidth="1.5" />
      <path d="M24 19C26.7614 19 29 21.2386 29 24" stroke="#DFBF72" strokeWidth="1.5" />
      <path d="M4 38C12 38 16 46 16 54" strokeOpacity="0.5" />
      <path d="M38 4C38 12 46 16 54 16" strokeOpacity="0.5" />
      <circle cx="4" cy="4" r="2.5" fill="#E5C158" />
    </svg>
  );
}

// Custom Heritage SVGs for the Category Card Plinths
function GoldCrownIcon({ className = "w-4.5 h-4.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 18h18M4 18l2-10 5 5 5-7 5 12" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="7" r="1.2" fill="#E5C278" />
      <circle cx="11" cy="12" r="1.2" fill="#E5C278" />
      <circle cx="16" cy="5" r="1.2" fill="#E5C278" />
      <circle cx="21" cy="7" r="1.2" fill="#E5C278" />
    </svg>
  );
}

function DiamondGemIcon({ className = "w-4.5 h-4.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 3h12l4 7-10 11L2 10l4-7z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 10h20M12 21L7.5 10M12 21l4.5-11M6 3l1.5 7M18 3l-1.5 7M12 3v7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TempleGopuramIcon({ className = "w-4.5 h-4.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 2v3M9 5h6M7 8h10M5 12h14M4 17h16M3 21h18" strokeLinecap="round" />
      <path d="M10 21v-4a2 2 0 0 1 4 0v4" fill="#E5C278" fillOpacity="0.3" strokeLinecap="round" />
      <path d="M7 8l-2 13M17 8l2 13" strokeLinecap="round" />
      <circle cx="12" cy="2" r="1" fill="#E5C278" />
    </svg>
  );
}

function BanglesKadasIcon({ className = "w-4.5 h-4.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <ellipse cx="9" cy="12" rx="5.5" ry="6.5" transform="rotate(-15 9 12)" />
      <ellipse cx="15" cy="12" rx="5.5" ry="6.5" transform="rotate(15 15 12)" />
      <path d="M9 7c1 1.5 2 3.5 2 5s-1 3.5-2 5" strokeDasharray="1.5 1.5" />
    </svg>
  );
}

function JhumkaEarringsIcon({ className = "w-4.5 h-4.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="7" cy="5" r="1.8" fill="#E5C278" fillOpacity="0.4" />
      <path d="M7 7v2M4.5 13.5c0-2 1.2-3.5 2.5-3.5s2.5 1.5 2.5 3.5H4.5z" strokeLinecap="round" />
      <circle cx="5" cy="16" r="0.75" fill="#E5C278" />
      <circle cx="7" cy="16" r="0.75" fill="#E5C278" />
      <circle cx="9" cy="16" r="0.75" fill="#E5C278" />
      <circle cx="17" cy="5" r="1.8" fill="#E5C278" fillOpacity="0.4" />
      <path d="M17 7v2M14.5 13.5c0-2 1.2-3.5 2.5-3.5s2.5 1.5 2.5 3.5h-5z" strokeLinecap="round" />
      <circle cx="15" cy="16" r="0.75" fill="#E5C278" />
      <circle cx="17" cy="16" r="0.75" fill="#E5C278" />
      <circle cx="19" cy="16" r="0.75" fill="#E5C278" />
    </svg>
  );
}

function SilverKalashIcon({ className = "w-4.5 h-4.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 2c-1.8 1.8-2.8 3.5-2.8 4.5 0 1.2 1.2 2 2.8 2s2.8-.8 2.8-2c0-1-1-2.7-2.8-4.5z" fill="#E5C278" fillOpacity="0.5" />
      <path d="M8 8.5h8M7 10h10M6 13.5c0 2.8 2.5 4.8 6 4.8s6-2 6-4.8c0-1.8-1.5-2.8-3-2.8H9c-1.5 0-3 1-3 2.8z" strokeLinecap="round" />
      <path d="M9 18.3v2h6v-2" strokeLinecap="round" />
    </svg>
  );
}

function RoyalChainsIcon({ className = "w-4.5 h-4.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M8 8l8 8M16 8l-8 8" strokeLinecap="round" />
      <circle cx="12" cy="7" r="2.5" />
      <circle cx="12" cy="17" r="2.5" />
    </svg>
  );
}

function NakshiLocketIcon({ className = "w-4.5 h-4.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="5" r="1.8" />
      <path d="M12 7v2.5M7 14c0-2.8 2.2-4.5 5-4.5s5 1.7 5 4.5-2.2 5.5-5 5.5-5-2.7-5-5.5z" fill="#E5C278" fillOpacity="0.25" strokeLinecap="round" />
      <circle cx="12" cy="14" r="2" fill="#E5C278" />
    </svg>
  );
}

// 8 Featured Categories with authentic high-definition product photography
const CATEGORIES = [
  {
    id: 'gold',
    name: 'Gold',
    subtext: 'Collection',
    image: '/images/luxury_gold_necklace_bust_showcase.jpg',
    path: '/gold',
    categoryKey: 'gold',
    Icon: GoldCrownIcon
  },
  {
    id: 'diamond',
    name: 'Diamond',
    subtext: 'Collection',
    image: '/images/generated/diamond_solitaire_luxe.jpg',
    path: '/diamonds',
    categoryKey: 'diamond',
    Icon: DiamondGemIcon
  },
  {
    id: 'temple',
    name: 'Temple',
    subtext: 'Collection',
    image: '/images/generated/temple_ganesha_art.jpg',
    path: '/temple-heritage',
    categoryKey: 'temple',
    Icon: TempleGopuramIcon
  },
  {
    id: 'bangles',
    name: 'Bangles',
    subtext: 'Collection',
    image: '/images/products/gold/gold-new-arrival-mayil-kada-bangle-01.jpg',
    path: '/gold/bangles',
    categoryKey: 'bangles',
    Icon: BanglesKadasIcon
  },
  {
    id: 'earrings',
    name: 'Earrings',
    subtext: 'Collection',
    image: '/images/products/gold/gold-new-arrival-kalyani-jhumka-01.jpg',
    path: '/gold/earrings',
    categoryKey: 'earrings',
    Icon: JhumkaEarringsIcon
  },
  {
    id: 'silver-pooja',
    name: 'Silver Pooja',
    subtext: 'Collection',
    image: '/images/products/silver/silver-new-arrival-ashtalakshmi-kalash-01.jpg',
    path: '/silver-pooja',
    categoryKey: 'silver',
    Icon: SilverKalashIcon
  },
  {
    id: 'chains',
    name: 'Chains',
    subtext: 'Collection',
    image: '/images/products/gold/gold-new-arrival-nawabi-rope-chain-01.jpg',
    path: '/gold/chains',
    categoryKey: 'chains',
    Icon: RoyalChainsIcon
  },
  {
    id: 'pendants',
    name: 'Pendants',
    subtext: 'Collection',
    image: '/images/products/gold/gold-new-arrival-kamakshi-locket-01.jpg',
    path: '/gold/pendants',
    categoryKey: 'pendants',
    Icon: NakshiLocketIcon
  }
];

export default function ShopByCollection({ onSelectCategory, onSelectCollection }) {
  const navigate = useNavigate();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const scrollRef = useRef(null);
  const sectionRef = useRef(null);
  const manualPauseTimerRef = useRef(null);
  const windowScrollTimerRef = useRef(null);
  const singleSetWidthRef = useRef(0);
  const isWindowScrollingRef = useRef(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Helper to pause auto-scroll ticker during and after manual interaction
  const pauseAutoScroll = () => {
    setIsPaused(true);
    if (manualPauseTimerRef.current) clearTimeout(manualPauseTimerRef.current);
    manualPauseTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 2500);
  };

  // Only run animations when section is visible in the viewport
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: '100px' }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Measure singleSetWidth once and on window resize, preventing forced reflow on every rAF frame
  const updateCachedWidth = () => {
    const el = scrollRef.current;
    if (el) {
      singleSetWidthRef.current = el.scrollWidth / 3;
    }
  };

  // Initialize scroll position to the middle set for seamless bidirectional scrolling
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      updateCachedWidth();
      if (singleSetWidthRef.current > 0 && el.scrollLeft === 0) {
        el.scrollLeft = singleSetWidthRef.current;
      }
    }
    window.addEventListener('resize', updateCachedWidth);
    return () => window.removeEventListener('resize', updateCachedWidth);
  }, []);

  // Pause horizontal ticker while the user is actively scrolling vertically
  useEffect(() => {
    const onWindowScroll = () => {
      isWindowScrollingRef.current = true;
      if (windowScrollTimerRef.current) clearTimeout(windowScrollTimerRef.current);
      windowScrollTimerRef.current = setTimeout(() => {
        isWindowScrollingRef.current = false;
      }, 150);
    };

    window.addEventListener('scroll', onWindowScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onWindowScroll);
      if (windowScrollTimerRef.current) clearTimeout(windowScrollTimerRef.current);
    };
  }, []);

  // Smooth continuous slow-movement auto-scroll ticker (runs only when visible and not paused)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !isVisible) return;

    let animationFrameId;
    let lastTime = performance.now();

    const step = (time) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (!isPaused && !isWindowScrollingRef.current && el) {
        // Regal slow gliding speed (~32px per second)
        el.scrollLeft += 32 * Math.min(delta, 0.1);

        // Infinite wrap: maintain scroll position within middle set using cached width
        const singleSetWidth = singleSetWidthRef.current || (el.scrollWidth / 3);
        if (singleSetWidth > 0 && el.scrollLeft >= singleSetWidth * 2) {
          el.scrollLeft -= singleSetWidth;
        }
      }

      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (manualPauseTimerRef.current) clearTimeout(manualPauseTimerRef.current);
    };
  }, [isPaused, isVisible]);

  const handleScrollLeft = () => {
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

  const handleScrollRight = () => {
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

  const handleCardClick = (item, idx) => {
    setSelectedIdx(idx % CATEGORIES.length);
    if (item.path) {
      navigate(item.path);
    } else if (onSelectCategory) {
      onSelectCategory(item.categoryKey || item.name);
    } else {
      navigate('/collections');
    }
  };

  const handleBentoNav = (collName, defaultPath) => {
    if (onSelectCollection) {
      onSelectCollection(collName);
    } else {
      navigate(defaultPath);
    }
  };

  return (
    <section ref={sectionRef} className="relative bg-[#1E0509] pt-12 sm:pt-16 pb-16 sm:pb-20 select-none overflow-hidden border-b border-[#D4AF37]/30 text-white">
      
      {/* Hide scrollbar & gold text shimmer keyframes */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @keyframes goldTextShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-gold-shimmer {
          background-size: 200% auto;
          animation: goldTextShimmer 7s linear infinite;
        }
      `}</style>

      {/* =========================================================================
          1. RADIANT PALACE STAGE BACKDROP: Clean 2K royal palace stage with smooth
             royal velvet canopy in top center for 100% text readability, white jasmine
             garlands on left, and glowing carved golden jharokha & deepams on right.
         ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="/images/exclusive-collections-luxe/palace_stage_radiant_clean_v3.jpg"
          alt="Royal Indian Palace Radiant Stage"
          className="w-full h-full object-cover object-top select-none opacity-100"
          loading="lazy"
          decoding="async"
        />
        {/* Luminous warm overlay letting the radiant gold palace ambiance shine through */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#180407]/30 via-transparent to-[#180407]/45 pointer-events-none" />
      </div>

      <div className="w-full max-w-[1760px] 2xl:max-w-[1840px] mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        
        {/* =========================================================================
            2. SECTION HEADER (EXPLORE OUR EXCLUSIVE COLLECTIONS) WITH LUXURY ANIMATION
           ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 relative"
        >
          {/* Deep royal velvet radial halo ensuring 100% crystal-clear contrast */}
          <div className="absolute inset-0 max-w-xl mx-auto -inset-y-6 rounded-3xl bg-radial-gradient from-[#140206]/95 via-[#1A0308]/75 to-transparent blur-2xl pointer-events-none -z-10" />

          {/* 1. Golden Lotus Crest & Winged Flourish (Matching HeroBanner) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-2 mb-1.5"
          >
            <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-r from-transparent via-[#E5C278] to-[#E5C278]/40" />
            <svg className="w-6 h-5 text-[#E5C278] drop-shadow-[0_2px_8px_rgba(229,194,120,0.6)]" viewBox="0 0 40 24" fill="none" stroke="currentColor">
              <path d="M20 2C20 2 16 10 16 14C16 17 18 19 20 19C22 19 24 17 24 14C24 10 20 2 20 2Z" fill="currentColor" fillOpacity="0.25" strokeWidth="1.5" />
              <path d="M20 6C16 9 11 11 11 15C11 18 13.5 19.5 16 19" strokeWidth="1.5" />
              <path d="M20 6C24 9 29 11 29 15C29 18 26.5 19.5 24 19" strokeWidth="1.5" />
              <circle cx="20" cy="21" r="1.5" fill="currentColor" />
            </svg>
            <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-l from-transparent via-[#E5C278] to-[#E5C278]/40" />
          </motion.div>

          {/* 2. Overline with Delicate Arrows */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="flex items-center justify-center gap-2 mb-1.5"
          >
            <span className="w-6 sm:w-10 h-[1px] bg-gradient-to-r from-transparent to-[#F6DE8F]" />
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.3em] text-[#F6DE8F] uppercase flex items-center gap-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              <span>←</span>
              <span>EXPLORE OUR</span>
              <span>→</span>
            </span>
            <span className="w-6 sm:w-10 h-[1px] bg-gradient-to-l from-transparent to-[#F6DE8F]" />
          </motion.div>

          {/* 3. Main Title: Exclusive Collections with Gold Shimmer Animation */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1, ease: 'easeOut' }}
            className="relative inline-block my-1"
          >
            <h2 
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
              className="text-3xl sm:text-4xl lg:text-[48px] font-bold tracking-tight text-center leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]"
            >
              <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5DA] via-[#F8DE95] via-[#FFEBB5] to-[#E5C278] animate-gold-shimmer">
                Exclusive{' '}
              </span>
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E5C278] via-[#FFEBB5] via-[#F8DE95] to-[#FFF5DA] animate-gold-shimmer">
                Collections
              </span>
            </h2>
          </motion.div>

          {/* 4. Subtitle flanked by subtle laurel leaves */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="flex items-center justify-center gap-2 mt-2 text-xs sm:text-[13px] text-[#F5EDE0] tracking-[0.24em] uppercase font-medium drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
          >
            <span className="text-[#E5C278] drop-shadow-[0_0_8px_rgba(229,194,120,0.8)]">🌿</span>
            <span>TIMELESS JEWELLERY FOR EVERY OCCASION</span>
            <span className="text-[#E5C278] -scale-x-100 inline-block drop-shadow-[0_0_8px_rgba(229,194,120,0.8)]">🌿</span>
          </motion.div>
        </motion.div>

        {/* =========================================================================
            3. TOP MOVING ARCHED CATEGORY SHOWCASE (Slow Moving Animation)
           ========================================================================= */}
        <div className="relative mb-12 sm:mb-14 px-1 sm:px-3">
          
          {/* Left Circular Burgundy & Gold Arrow Button */}
          <button
            onClick={handleScrollLeft}
            onMouseEnter={() => setIsPaused(true)}
            aria-label="Previous Category"
            className="absolute -left-2 sm:-left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#360C12] text-[#F3E5AB] hover:text-white border-2 border-[#E5C278] shadow-[0_6px_22px_rgba(0,0,0,0.7)] flex items-center justify-center transition-all cursor-pointer group hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Right Circular Burgundy & Gold Arrow Button */}
          <button
            onClick={handleScrollRight}
            onMouseEnter={() => setIsPaused(true)}
            aria-label="Next Category"
            className="absolute -right-2 sm:-right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#360C12] text-[#F3E5AB] hover:text-white border-2 border-[#E5C278] shadow-[0_6px_22px_rgba(0,0,0,0.7)] flex items-center justify-center transition-all cursor-pointer group hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Moving Carousel Container with Edge Shadows */}
          <div
            className="relative w-full overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {/* Soft Edge Fade Masks */}
            <div className="absolute left-0 inset-y-0 w-8 sm:w-14 bg-gradient-to-r from-[#160307] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 inset-y-0 w-8 sm:w-14 bg-gradient-to-l from-[#160307] to-transparent z-10 pointer-events-none" />

            {/* Auto-Moving Horizontal Track with Native Touch & Smooth Scroll */}
            <div
              ref={scrollRef}
              className="flex gap-4 sm:gap-5 lg:gap-6 overflow-x-auto no-scrollbar select-none py-3 px-3 sm:px-5"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                transform: 'translateZ(0)',
                willChange: 'scroll-position'
              }}
            >
              {/* Duplicated array (3 sets) for seamless bidirectional looping */}
              {[...CATEGORIES, ...CATEGORIES, ...CATEGORIES].map((cat, idx) => {
                const isSelected = (idx % CATEGORIES.length) === selectedIdx;
                const CardIcon = cat.Icon;

                return (
                  <div
                    key={`${cat.id}-${idx}`}
                    onClick={() => handleCardClick(cat, idx)}
                    className={`group relative cursor-pointer transition-all duration-300 w-[165px] sm:w-[195px] lg:w-[225px] xl:w-[235px] shrink-0 ${
                      isSelected ? '-translate-y-2' : 'hover:-translate-y-1.5'
                    }`}
                  >
                    {/* Arch Card Container matching the reference */}
                    <div className={`relative w-full aspect-[1/1.42] rounded-t-[38px] sm:rounded-t-[46px] rounded-b-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#FFE39B] shadow-[0_12px_32px_rgba(229,194,120,0.55)] ring-2 ring-[#FFE39B]/80'
                        : 'border-[#E5C278]/60 hover:border-[#FFE39B] shadow-[0_8px_24px_rgba(0,0,0,0.6)]'
                    }`}>
                      
                      {/* Background / Photography Layer (Top ~68%) */}
                      <div className="absolute inset-x-0 top-0 h-[68%] bg-[#180407] overflow-hidden">
                        <img
                          src={cat.image}
                          alt={`${cat.name} Collection`}
                          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                          loading="lazy"
                          decoding="async"
                        />
                        {/* Top subtle shadow for arch curve definition */}
                        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
                        {/* Bottom dark gradient transition behind plinth */}
                        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#180407] to-transparent pointer-events-none" />
                      </div>

                      {/* Bottom Name Plinth (Bottom ~32%) with Vector Icon & Pure Typography */}
                      <div className={`relative z-10 mt-auto w-full pt-2 pb-3 px-1 text-center flex flex-col items-center justify-center border-t transition-all ${
                        isSelected
                          ? 'bg-gradient-to-b from-[#340710] to-[#1C0206] border-[#FFE39B]/70'
                          : 'bg-gradient-to-b from-[#20040A] to-[#120205] border-[#E5C278]/30 group-hover:bg-[#28060D]'
                      }`}>
                        {/* Golden Vector Icon */}
                        <div className="mb-1 text-[#E5C278] group-hover:scale-110 transition-transform">
                          <CardIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                        </div>

                        {/* Main Category Title */}
                        <p 
                          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                          className={`text-xs sm:text-[13.5px] font-bold tracking-tight leading-tight ${
                            isSelected ? 'text-[#FFF2D0]' : 'text-[#F3DEAB]'
                          }`}
                        >
                          {cat.name}
                        </p>

                        {/* Collection Subtitle */}
                        <p className="text-[9px] sm:text-[9.5px] tracking-[0.2em] uppercase font-light text-[#C9A96E] mt-0.5">
                          {cat.subtext}
                        </p>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Connected Golden Glowing Curved Plinth Arc */}
          <div className="relative mt-5 flex items-center justify-center">
            <div className="w-full max-w-4xl h-[2px] bg-gradient-to-r from-transparent via-[#E5C278] to-transparent shadow-[0_0_18px_rgba(229,194,120,0.85)]" />
          </div>

          {/* Centered Pagination Indicator Dots (Matching 3-Dot Pill in Reference) */}
          <div className="flex items-center justify-center gap-2 mt-3.5">
            <span className="w-6 h-1.5 rounded-full bg-[#E5C278] shadow-[0_0_8px_rgba(229,194,120,0.8)]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5C278]/40" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5C278]/40" />
          </div>

        </div>

        {/* =========================================================================
            4. CURATED PROMOTIONAL BENTO GRID (BRIDAL, TEMPLE, DIAMOND, SILVER POOJA)
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
          
          {/* -----------------------------------------------------------------------
              LEFT LARGE CARD: BRIDAL COLLECTION (5 cols on lg)
             ----------------------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            onClick={() => handleBentoNav('Bridal', '/bridal')}
            className="lg:col-span-5 relative rounded-3xl overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.6)] border-2 border-[#E5C278]/80 min-h-[380px] sm:min-h-[420px] lg:min-h-[440px] bg-gradient-to-r from-[#2A0810] via-[#20040A] to-[#120205] flex group cursor-pointer"
          >
            {/* Background Image: Indian Bride gracefully seated on the right half */}
            <div className="absolute right-0 top-0 bottom-0 w-[58%] sm:w-[60%] h-full overflow-hidden">
              <img
                src="/images/generated/bridal_showcase.jpg"
                alt="Bridal Collection - Traditional Elegance for Your Big Day"
                className="w-full h-full object-cover object-[65%_center] group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
                decoding="async"
              />
              {/* Soft gradient blend from the left maroon panel into the bride portrait */}
              <div className="absolute inset-y-0 left-0 w-24 sm:w-32 bg-gradient-to-r from-[#20040A] via-[#20040A]/80 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            </div>

            {/* Left Maroon Backdrop Panel */}
            <div className="absolute inset-y-0 left-0 w-[52%] sm:w-[48%] bg-gradient-to-r from-[#2A0810] to-[#20040A] pointer-events-none" />

            {/* Intricate Golden Filigree Corner Flourishes */}
            <div className="absolute top-3 left-3 pointer-events-none z-20">
              <OrnateCornerFiligree className="w-12 h-12 sm:w-14 sm:h-14" />
            </div>
            <div className="absolute bottom-3 left-3 -scale-y-100 pointer-events-none z-20">
              <OrnateCornerFiligree className="w-12 h-12 sm:w-14 sm:h-14" />
            </div>

            {/* Editorial Content Overlay */}
            <div className="relative z-10 h-full p-6 sm:p-8 flex flex-col justify-between text-white max-w-[62%] sm:max-w-[55%]">
              
              {/* Top Tag & Crown Emblem */}
              <div className="pt-2">
                <div className="flex items-center gap-1.5 mb-3">
                  <Crown className="w-4 h-4 text-[#E5C278]" />
                  <span className="text-[10px] sm:text-[10.5px] tracking-[0.24em] uppercase text-[#E5C278] font-bold">
                    FEATURED COLLECTION
                  </span>
                </div>

                <div className="mt-2">
                  <span 
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    className="italic text-3xl sm:text-4xl text-white font-normal block leading-tight"
                  >
                    Bridal
                  </span>
                  <span 
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    className="text-3xl sm:text-4xl text-white font-bold block leading-tight"
                  >
                    Collection
                  </span>
                </div>

                <p className="text-xs sm:text-[13px] text-[#F5E6D3] mt-3 font-light leading-relaxed">
                  Traditional Elegance for Your Big Day
                </p>
              </div>

              {/* Bottom Luxury Golden Pill Button matching reference */}
              <div className="pb-2 pt-6">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#E5C278] via-[#F6DE8F] to-[#CE992A] text-[#241716] font-bold text-xs sm:text-sm shadow-md hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
                >
                  <span>Explore Now</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>

            </div>
          </motion.div>

          {/* -----------------------------------------------------------------------
              RIGHT BENTO SUITE: TEMPLE, DIAMOND, SILVER POOJA (7 cols on lg)
             ----------------------------------------------------------------------- */}
          <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-5 justify-between">
            
            {/* Top Row: Temple Collection (Left) & Diamond Collection (Right) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 flex-1">
              
              {/* 1. TEMPLE COLLECTION */}
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' }}
                onClick={() => handleBentoNav('Temple', '/temple-heritage')}
                className="relative rounded-2xl overflow-hidden shadow-lg border border-[#E5C278]/60 bg-[#160E0B] min-h-[190px] sm:min-h-[205px] flex items-center group cursor-pointer"
              >
                {/* Full-bleed right image of Sacred Golden Ganesha */}
                <div className="absolute right-0 top-0 bottom-0 w-[54%] sm:w-[52%] h-full overflow-hidden">
                  <img
                    src="/images/generated/temple_ganesha_art.jpg"
                    alt="Temple Collection - Sacred Golden Ganesha"
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Seamless gradient fade on left */}
                  <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#160E0B] to-transparent pointer-events-none" />
                </div>

                {/* Left Text */}
                <div className="relative z-10 p-5 sm:p-6 max-w-[55%] text-white">
                  <div className="flex items-center gap-1.5 mb-1 text-[#E5C278]">
                    <span className="text-xs">🪷</span>
                  </div>
                  <h3 
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    className="text-lg sm:text-xl font-bold text-white leading-snug group-hover:text-[#F3E5AB] transition-colors"
                  >
                    Temple Collection
                  </h3>
                  <p className="text-[11px] text-[#D8C6B6] mt-1 mb-3.5 font-light leading-relaxed">
                    Divine Designs with Timeless Heritage
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E5C278] group-hover:text-[#F3DA8E] transition-colors">
                    <span>Explore Now</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.div>

              {/* 2. DIAMOND COLLECTION */}
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.18, ease: 'easeOut' }}
                onClick={() => handleBentoNav('Diamond', '/diamonds')}
                className="relative rounded-2xl overflow-hidden shadow-lg border border-[#E5C278]/60 bg-[#071224] min-h-[190px] sm:min-h-[205px] flex items-center group cursor-pointer"
              >
                {/* Full-bleed right image of brilliant solitaire diamond ring on navy satin */}
                <div className="absolute right-0 top-0 bottom-0 w-[54%] sm:w-[52%] h-full overflow-hidden">
                  <img
                    src="/images/generated/diamond_solitaire_luxe.jpg"
                    alt="Diamond Collection - Brilliant Solitaire Ring"
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Seamless gradient fade on left */}
                  <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#071224] to-transparent pointer-events-none" />
                </div>

                {/* Left Text */}
                <div className="relative z-10 p-5 sm:p-6 max-w-[55%] text-white">
                  <div className="flex items-center gap-1.5 mb-1 text-[#E5C278]">
                    <span className="text-xs">💎</span>
                  </div>
                  <h3 
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    className="text-lg sm:text-xl font-bold text-white leading-snug group-hover:text-[#F3E5AB] transition-colors"
                  >
                    Diamond Collection
                  </h3>
                  <p className="text-[11px] text-[#B8CEF0] mt-1 mb-3.5 font-light leading-relaxed">
                    Modern Brilliance with Lasting Value
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E5C278] group-hover:text-[#F3DA8E] transition-colors">
                    <span>Explore Now</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.div>

            </div>

            {/* Bottom Row: Silver Pooja Collection (Wide Card) */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.25, ease: 'easeOut' }}
              onClick={() => handleBentoNav('Silver Pooja', '/silver-pooja')}
              className="relative rounded-2xl overflow-hidden shadow-lg border border-[#E5C278]/60 bg-[#200308] min-h-[190px] sm:min-h-[205px] flex items-center group cursor-pointer"
            >
              {/* Full-bleed right image of sacred silver Kalash and burning deepam lamp */}
              <div className="absolute right-0 top-0 bottom-0 w-[55%] sm:w-[58%] h-full overflow-hidden">
                <img
                  src="/images/products/silver/silver-new-arrival-ashtalakshmi-kalash-01.jpg"
                  alt="Silver Pooja Collection - Sacred Kalash and Deepam Lamp"
                  className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
                  loading="lazy"
                  decoding="async"
                />
                {/* Seamless gradient fade on left */}
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#200308] to-transparent pointer-events-none" />
              </div>

              {/* Left Text */}
              <div className="relative z-10 p-5 sm:p-7 max-w-[50%] text-white">
                <div className="flex items-center gap-1.5 mb-1 text-[#E5C278]">
                  <span className="text-xs">🪔</span>
                </div>
                <h3 
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  className="text-lg sm:text-xl font-bold text-white leading-snug group-hover:text-[#F3E5AB] transition-colors"
                >
                  Silver Pooja Collection
                </h3>
                <p className="text-[11.5px] text-[#E5D2C8] mt-1 mb-3.5 font-light">
                  Where Purity Meets Tradition
                </p>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#E5C278]/80 bg-[#E5C278]/15 hover:bg-[#E5C278] text-[#F3E5AB] hover:text-[#25030A] text-xs font-semibold shadow-xs transition-all duration-300"
                >
                  <span>Explore Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}
