import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 'polki-ruby-choker',
    subBrand: 'ROYAL MUHURTHAM COLLECTION',
    titleLine1: 'Royal Polki & Ruby',
    titleLine2: 'Bridal Choker',
    hasSwoosh: true,
    tagline: 'Pure 22K Gold Handcrafted for Sacred Celebrations.',
    description: 'Opulent handcrafted Polki and Burmese ruby bridal choker with twin peacock motifs, paired with matching antique jhumkas on royal maroon velvet.',
    primaryBtn: 'Explore Bridal Sets',
    primaryPath: '/bridal',
    secondaryBtn: 'Shop Gold',
    secondaryPath: '/gold',
    badge: '916 BIS Hallmarked 22K Gold',
    artisanNote: 'Trichy Flagship Showcase',
    bgImage: '/images/hero_luxury_indian_gold_display.png',
    imgPosition: 'object-[78%_center]',
    gradientFrom: 'from-[#1A0508]/40 via-transparent to-transparent',
    badgesList: [
      { type: 'diamond', label1: 'Burmese', label2: 'Rubies' },
      { type: 'lotus', label1: 'Uncut Polki', label2: 'Craft' },
      { type: 'shield', label1: '22K BIS', label2: 'Hallmarked' }
    ]
  },
  {
    id: 'lakshmi-temple-haram',
    subBrand: 'SACRED TEMPLE CRAFT',
    titleLine1: 'Lakshmi Temple',
    titleLine2: 'Grand Haram',
    hasSwoosh: true,
    tagline: 'Centuries of Divine Devotion Cast in Pure Gold.',
    description: 'Consecrated Goddess Lakshmi nakshi haram adorned with auspicious peacocks, rubies, and emeralds, displayed on a heritage carved teakwood chest with temple bells.',
    primaryBtn: 'View Temple Craft',
    primaryPath: '/temple-heritage',
    secondaryBtn: 'Explore Collections',
    secondaryPath: '/collections',
    badge: 'Hand-Chased Antique Nakshi',
    artisanNote: 'Temple Goldsmith Heritage',
    bgImage: '/images/hero_opulent_temple_jewelry_still_life.png',
    imgPosition: 'object-[82%_center]',
    gradientFrom: 'from-[#1A0508]/40 via-transparent to-transparent',
    badgesList: [
      { type: 'lotus', label1: 'Goddess', label2: 'Lakshmi' },
      { type: 'diamond', label1: 'Antique', label2: 'Nakshi Work' },
      { type: 'shield', label1: '22K Pure', label2: 'Temple Gold' }
    ]
  },
  {
    id: 'diamonds-suite',
    subBrand: 'HAUTE JOAILLERIE ATELIER',
    titleLine1: 'Celestial Sapphire',
    titleLine2: 'Diamond Suite',
    hasSwoosh: false,
    tagline: 'Certified Natural Diamonds. Vivid Ceylon Sapphires.',
    description: 'A cascading collar of brilliant-cut diamonds and auspicious peacocks framing a royal Ceylon sapphire drop, paired with matching diamond pearl jhumkas.',
    primaryBtn: 'Explore Diamonds',
    primaryPath: '/diamonds',
    secondaryBtn: 'View Solitaires',
    secondaryPath: '/diamonds',
    badge: 'IGI & GIA Certified Diamonds',
    artisanNote: 'Flawless Cut & Clarity',
    bgImage: '/images/hero_slide_diamond_sapphire.png',
    imgPosition: 'object-[82%_center]',
    gradientFrom: 'from-[#050D1D]/75 via-[#050D1D]/35 to-transparent',
    badgesList: [
      { type: 'diamond', label1: 'Natural', label2: 'Diamonds' },
      { type: 'lotus', label1: 'Ceylon', label2: 'Sapphire' },
      { type: 'shield', label1: 'IGI & GIA', label2: 'Certified' }
    ]
  }
];

export default function HeroBanner({ onExploreClick }) {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const SLIDE_DURATION_MS = 7500;

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [isPaused]);

  const slide = HERO_SLIDES[currentSlide];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrimary = () => {
    if (onExploreClick) onExploreClick();
    else navigate(slide.primaryPath);
  };

  const handleSecondary = () => {
    navigate(slide.secondaryPath);
  };

  return (
    <section 
      className="relative w-full overflow-hidden bg-[#24070A] select-none text-white border-b border-[#D4AF37]/30"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Container with responsive 16:9 proportional widescreen stage */}
      <div className="relative w-full min-h-[500px] sm:min-h-[540px] md:min-h-[580px] lg:min-h-[620px] xl:min-h-[650px] flex items-center">
        
        {/* Animated Background Image Layer with Pure Opacity Crossfade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
          >
            <img
              src={slide.bgImage}
              alt={`${slide.titleLine1} ${slide.titleLine2}`}
              loading="eager"
              fetchpriority="high"
              decoding="async"
              className={`w-full h-full object-cover ${slide.imgPosition || 'object-right'} select-none`}
            />
            {/* Precision left-side text backdrop gradient (leaving right-side jewellery 100% luminous & sharp) */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradientFrom || 'from-[#1A0508]/90 via-[#1A0508]/50'} via-32% to-transparent to-50% pointer-events-none`} />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* Foreground Content Layout */}
        <div className="relative z-20 max-w-[1440px] mx-auto px-4 xs:px-6 sm:px-10 lg:px-14 xl:px-20 w-full py-14 sm:py-18 lg:py-20">
          <div className="max-w-[440px] sm:max-w-[480px] lg:max-w-[500px] text-left">
            
            <AnimatePresence mode="wait">
              <motion.div 
                key={slide.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="space-y-3"
              >
                
                {/* 1. Golden Lotus Crest & Winged Flourish */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 sm:w-8 h-[1px] bg-[#D4AF37]/60" />
                  <svg className="w-6 h-5 text-[#D4AF37] drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]" viewBox="0 0 40 24" fill="none" stroke="currentColor">
                    <path d="M20 2C20 2 16 10 16 14C16 17 18 19 20 19C22 19 24 17 24 14C24 10 20 2 20 2Z" fill="currentColor" fillOpacity="0.25" strokeWidth="1.5" />
                    <path d="M20 6C16 9 11 11 11 15C11 18 13.5 19.5 16 19" strokeWidth="1.5" />
                    <path d="M20 6C24 9 29 11 29 15C29 18 26.5 19.5 24 19" strokeWidth="1.5" />
                    <circle cx="20" cy="21" r="1.5" fill="currentColor" />
                  </svg>
                  <span className="w-6 sm:w-8 h-[1px] bg-[#D4AF37]/60" />
                </div>

                {/* 2. Sub-Brand Tag with delicate side rules */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-4 h-[1px] bg-[#D4AF37]/70" />
                  <span className="text-[10.5px] sm:text-xs font-semibold tracking-[0.28em] text-[#E5C578] uppercase">
                    {slide.subBrand}
                  </span>
                  <span className="w-4 h-[1px] bg-[#D4AF37]/70" />
                </div>

                {/* 3. Main Title: Large Elegant High-Contrast Serif */}
                <div className="relative inline-block mb-2">
                  <h1 
                    style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
                    className="text-3xl xs:text-4xl sm:text-5xl lg:text-[52px] font-bold text-white tracking-tight leading-[1.08] drop-shadow-md"
                  >
                    <span className="block">{slide.titleLine1}</span>
                    <span className="block relative">
                      {slide.titleLine2}
                    </span>
                  </h1>
                </div>

                {/* 4. Italic Quote / Sub-headline in Warm Champagne Gold */}
                <p 
                  style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
                  className="italic text-base sm:text-lg lg:text-xl text-[#E5C578] font-normal leading-snug drop-shadow-sm pt-1"
                >
                  {slide.tagline}
                </p>

                {/* 5. Description */}
                <p className="text-xs sm:text-[13.5px] text-[#E8DDD0] leading-relaxed max-w-md font-light pt-1 drop-shadow-xs">
                  {slide.description}
                </p>

                {/* 6. Action Buttons */}
                <div className="flex flex-wrap items-center gap-3.5 pt-3">
                  {/* Primary Amber-Gold Pill Button */}
                  <button
                    onClick={handlePrimary}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#DDA83A] via-[#F6DE8F] to-[#CE992A] hover:brightness-105 active:scale-95 text-[#241716] font-bold text-xs sm:text-sm px-7 py-3 rounded-full shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_28px_rgba(212,175,55,0.6)] hover:scale-105 transition-all duration-300 cursor-pointer"
                  >
                    <span>{slide.primaryBtn}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>

                  {/* Secondary Maroon Outline Pill Button */}
                  <button
                    onClick={handleSecondary}
                    className="inline-flex items-center gap-2 bg-[#360C12]/80 hover:bg-[#4E101A] border border-[#E5C578]/60 hover:border-[#E5C578] text-[#FAF5EE] font-medium text-xs sm:text-sm px-6 py-3 rounded-full transition-all duration-300 cursor-pointer shadow-md hover:scale-105"
                  >
                    <span>{slide.secondaryBtn}</span>
                  </button>
                </div>

                {/* 7. Three Trust Badges (Temple Inspired, Antique Nakshi Work, 22K Pure Gold) */}
                <div className="grid grid-cols-3 gap-3 max-w-sm pt-3.5 pb-2.5 px-3.5 rounded-2xl bg-[#1A0508]/85 border border-[#D4AF37]/35 shadow-lg mt-3">
                  {slide.badgesList?.map((badge, idx) => (
                    <div key={idx} className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
                      <div className="w-7 h-7 text-[#E5C578] flex items-center justify-center">
                        {badge.type === 'lotus' && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-6 h-6">
                            <path d="M12 2C12 2 9 8 9 12C9 14.5 10.5 16 12 16C13.5 16 15 14.5 15 12C15 8 12 2 12 2Z" fill="currentColor" fillOpacity="0.2" />
                            <path d="M12 7C9 9.5 5 11 5 14.5C5 17 7 18 9 17.5C11 17 11.5 14 12 12" />
                            <path d="M12 7C15 9.5 19 11 19 14.5C19 17 17 18 15 17.5C13 17 12.5 14 12 12" />
                          </svg>
                        )}
                        {badge.type === 'diamond' && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-6 h-6">
                            <path d="M6 3H18L22 9L12 21L2 9L6 3Z" fill="currentColor" fillOpacity="0.2" />
                            <path d="M2 9H22" />
                            <path d="M12 21L8 9L10 3" />
                            <path d="M12 21L16 9L14 3" />
                          </svg>
                        )}
                        {badge.type === 'shield' && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-6 h-6">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.2" />
                            <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-[#E5D7C5] leading-tight">
                        {badge.label1}<br />{badge.label2}
                      </span>
                    </div>
                  ))}
                </div>

              </motion.div>
            </AnimatePresence>

          </div>
        </div>

        {/* Carousel Navigation Arrows with Golden Hover Glow */}
        <button
          onClick={handlePrev}
          className="absolute left-2 xs:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#240308]/90 hover:bg-[#4E0C16] border border-[#E5C578]/60 text-[#F3E5AB] flex items-center justify-center transition-all cursor-pointer z-30 shadow-xl hover:scale-110 hover:border-[#E5C578]"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 xs:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#240308]/90 hover:bg-[#4E0C16] border border-[#E5C578]/60 text-[#F3E5AB] flex items-center justify-center transition-all cursor-pointer z-30 shadow-xl hover:scale-110 hover:border-[#E5C578]"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Centered Pagination Dots (Golden Active Dot + 2 Subtle Dots matching reference) */}
        <div className="absolute bottom-8 sm:bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 bg-[#240308]/90 px-3.5 py-1 rounded-full border border-[#D4AF37]/40 shadow-lg">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className="cursor-pointer focus:outline-none transition-all p-1"
              aria-label={`Go to slide ${idx + 1}`}
            >
              <span className={`block rounded-full transition-all duration-300 ${
                idx === currentSlide
                  ? 'w-2.5 h-2.5 bg-[#DDA83A] shadow-[0_0_8px_rgba(221,168,58,0.8)]'
                  : 'w-2 h-2 bg-white/35 hover:bg-white/60'
              }`} />
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
