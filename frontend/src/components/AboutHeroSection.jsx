import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';

const HEADLINE_SLIDES = [
  {
    line1Prefix: "A Legacy of",
    line1Accent: "Tradition.",
    line2Prefix: "A Promise of",
    line2Accent: "Trust.",
    desc: "At Vedha Radha Thanga Maaligai, jewellery is more than an ornament — it is a celebration of heritage, sacred relationships and life's most precious moments."
  },
  {
    line1Prefix: "A Heritage of",
    line1Accent: "Craftsmanship.",
    line2Prefix: "A Standard of",
    line2Accent: "Purity.",
    desc: "Handcrafted by multi-generational master goldsmiths in Trichy, preserving ancient Chola and Nayakar temple goldsmithing art for royal modern brides."
  },
  {
    line1Prefix: "A Celebration of",
    line1Accent: "Royalty.",
    line2Prefix: "A Vow of",
    line2Accent: "Perfection.",
    desc: "Every 22K temple jewel and certified diamond reflects devotional integrity, government BIS 916 hallmarking, and sacred generational trust."
  },
  {
    line1Prefix: "Four Generations of",
    line1Accent: "Mastery.",
    line2Prefix: "A Bond of",
    line2Accent: "Eternity.",
    desc: "From sacred bridal muhurtham jewels to heirloom temple necklaces, we craft lifelong family legacies that transcend time and fleeting trends."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function AboutHeroSection() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Dynamic automatic headline rotation every 4.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HEADLINE_SLIDES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const slide = HEADLINE_SLIDES[currentSlide];

  return (
    <section className="relative w-full overflow-hidden bg-[#2C060D] select-none">
      
      {/* Liquid Gold Flow & Text Shimmer Keyframes */}
      <style>{`
        @keyframes liquidGoldFlow {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        .liquid-gold-flow {
          background: linear-gradient(
            90deg,
            #D4AF37 0%,
            #FFEBB5 25%,
            #FFFDF8 40%,
            #FBE3AB 55%,
            #D4AF37 75%,
            #FFEBB5 90%,
            #D4AF37 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: liquidGoldFlow 5.5s linear infinite;
        }
        @keyframes subtleAmbience {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.06); }
        }
        .animate-ambience {
          animation: subtleAmbience 8s ease-in-out infinite;
        }
      `}</style>
      
      {/* ========================================================================= */}
      {/* 1. ORIGINAL FULL-RESOLUTION LOSSLESS MASTER (Zero Blur, Zero Overlay)     */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="/images/about/showroom_hero_wide.png" 
          alt="Vedha Radha Thanga Maaligai Heritage Temple Stage"
          className="w-full h-full object-cover object-right md:object-center select-none"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        {/* Gentle ambient golden radial glow over left text area */}
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] rounded-full bg-radial-gradient from-[#E5C378]/12 via-[#581923]/15 to-transparent blur-3xl pointer-events-none animate-ambience -z-0" />
      </div>

      {/* ========================================================================= */}
      {/* 2. FOREGROUND CONTENT: SPACIOUS, ANIMATED LUXURY TEXT & CONTROLS          */}
      {/* ========================================================================= */}
      <div className="relative z-10 max-w-[1536px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 py-14 sm:py-18 md:py-22 lg:py-26 min-h-[500px] sm:min-h-[540px] lg:min-h-[620px] xl:min-h-[660px] flex items-center">
        
        {/* Left Text Area: Perfectly spaced and animated */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full lg:w-[56%] xl:w-[50%] text-left"
        >
          
          {/* Official Vedha Radha Brand Logo */}
          <motion.div variants={itemVariants} className="pt-2 mb-3.5 sm:mb-4">
            <img 
              src="/images/vedha_radha_official_logo.png" 
              alt="Vedha Radha Thangha Maalighai Emblem" 
              className="h-16 sm:h-20 md:h-22 w-auto object-contain filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.65)] hover:scale-103 transition-transform duration-300"
            />
          </motion.div>

          {/* Label: —— ABOUT US —— */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-3 mb-3 sm:mb-4">
            <div className="h-[1px] w-6 sm:w-10 bg-gradient-to-r from-transparent to-[#D8B468]"></div>
            <span className="text-[#E5C378] text-[11px] sm:text-xs uppercase tracking-[0.3em] font-sans font-semibold drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              About Us
            </span>
            <div className="h-[1px] w-6 sm:w-10 bg-gradient-to-l from-transparent to-[#D8B468]"></div>
          </motion.div>

          {/* Interactive Dynamic Headline Carousel with Smooth AnimatePresence */}
          <div 
            className="min-h-[160px] sm:min-h-[175px] md:min-h-[190px] mb-5 sm:mb-6"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -16, filter: 'blur(4px)' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Main Headline with Proper Vertical Spacing & Liquid Gold Flow Effect */}
                <h1 className="text-3xl sm:text-4xl md:text-[42px] lg:text-[46px] xl:text-[52px] font-serif font-normal text-white leading-[1.24] sm:leading-[1.22] md:leading-[1.2] tracking-normal drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                  <span className="block">
                    {slide.line1Prefix}{' '}
                    <span className="italic font-normal liquid-gold-flow inline-block drop-shadow-[0_0_14px_rgba(229,195,120,0.4)]">
                      {slide.line1Accent}
                    </span>
                  </span>
                  <span className="block mt-1 sm:mt-1.5">
                    {slide.line2Prefix}{' '}
                    <span className="italic font-normal liquid-gold-flow inline-block drop-shadow-[0_0_14px_rgba(229,195,120,0.4)]">
                      {slide.line2Accent}
                    </span>
                  </span>
                </h1>

                {/* Subtext Description with Comfortable Breathing Room */}
                <p className="text-xs sm:text-[14px] lg:text-[15px] text-[#EFE3DB] font-sans font-light leading-relaxed max-w-xl drop-shadow-[0_1px_5px_rgba(0,0,0,0.85)] mt-3.5 sm:mt-4 min-h-[46px]">
                  {slide.desc}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Subtle Slide Indicators */}
            <div className="flex items-center gap-2 mt-3 select-none">
              {HEADLINE_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-400 cursor-pointer ${
                    currentSlide === idx 
                      ? 'w-7 bg-gradient-to-r from-[#D4AF37] to-[#FFF5DD] shadow-[0_0_8px_rgba(212,175,55,0.7)]' 
                      : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Four Trust Badges with Vertical Hairline Dividers */}
          <motion.div variants={itemVariants} className="mb-7 sm:mb-8 pt-1">
            <div className="inline-flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-0 bg-black/20 sm:bg-transparent backdrop-blur-[2px] sm:backdrop-blur-none p-2 sm:p-0 rounded-2xl border border-white/5 sm:border-none">
              
              {/* Badge 1: BIS 916 Hallmark */}
              <div className="flex flex-col items-center text-center px-3 sm:px-4 sm:first:pl-0 sm:border-r sm:border-[#C5A059]/45 group cursor-default">
                <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-[#E5C378] group-hover:scale-115 group-hover:text-[#FFF5DC] transition-all duration-300">
                  <svg viewBox="0 0 36 36" fill="none" className="w-full h-full drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    <polygon points="18,4 32,28 4,28" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" fill="rgba(229,195,120,0.15)" />
                    <polygon points="18,11 26,25 10,25" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                    <circle cx="18" cy="20.5" r="1.8" fill="currentColor" />
                  </svg>
                </div>
                <span className="text-[10.5px] sm:text-xs font-serif font-bold text-[#FFF5DC] mt-2 leading-tight tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                  BIS 916<br />Hallmark
                </span>
              </div>

              {/* Badge 2: 4 Generations of Mastery */}
              <div className="flex flex-col items-center text-center px-3 sm:px-4 sm:border-r sm:border-[#C5A059]/45 group cursor-default">
                <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-[#E5C378] group-hover:scale-115 group-hover:text-[#FFF5DC] transition-all duration-300">
                  <svg viewBox="0 0 36 36" fill="none" className="w-full h-full drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    <path d="M12 28C8.5 24 7.5 17 11.5 10M11.5 10C10.5 12.5 9.5 14.5 10.5 17.5M11.5 10C12.5 12.5 13.5 15.5 11.5 17.5M9.5 22.5C7.5 20.5 7.5 18.5 9.5 16.5M11.5 25.5C10.5 24.5 10.5 22.5 12.5 21.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M24 28C27.5 24 28.5 17 24.5 10M24.5 10C25.5 12.5 26.5 14.5 25.5 17.5M24.5 10C23.5 12.5 22.5 15.5 24.5 17.5M26.5 22.5C28.5 20.5 28.5 18.5 26.5 16.5M24.5 25.5C25.5 24.5 25.5 22.5 23.5 21.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <text x="18" y="23" textAnchor="middle" fontSize="13.5" fontWeight="bold" fill="currentColor" fontFamily="serif">4</text>
                  </svg>
                </div>
                <span className="text-[10.5px] sm:text-xs font-serif font-bold text-[#FFF5DC] mt-2 leading-tight tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                  Generations<br />of Mastery
                </span>
              </div>

              {/* Badge 3: Devotional Purity */}
              <div className="flex flex-col items-center text-center px-3 sm:px-4 sm:border-r sm:border-[#C5A059]/45 group cursor-default">
                <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-[#E5C378] group-hover:scale-115 group-hover:text-[#FFF5DC] transition-all duration-300">
                  <svg viewBox="0 0 36 36" fill="none" className="w-full h-full drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    <path d="M18 7C19.2 11.5 23.5 13.5 27 13.5C23.5 15.5 21.5 19 21.5 23.5C19.5 20.5 16.5 20.5 14.5 23.5C14.5 19 12.5 15.5 9 13.5C12.5 13.5 16.8 11.5 18 7Z" fill="currentColor" />
                    <path d="M7 23.5C10.5 26.5 25.5 26.5 29 23.5C28 27.5 20.5 29.5 18 29.5C15.5 29.5 8 27.5 7 23.5Z" stroke="currentColor" strokeWidth="1.6" fill="rgba(229,195,120,0.2)" />
                  </svg>
                </div>
                <span className="text-[10.5px] sm:text-xs font-serif font-bold text-[#FFF5DC] mt-2 leading-tight tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                  Devotional<br />Purity
                </span>
              </div>

              {/* Badge 4: Transparent Pricing */}
              <div className="flex flex-col items-center text-center px-3 sm:px-4 sm:last:pr-0 group cursor-default">
                <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-[#E5C378] group-hover:scale-115 group-hover:text-[#FFF5DC] transition-all duration-300">
                  <svg viewBox="0 0 36 36" fill="none" className="w-full h-full drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    <path d="M18 6V29M9 9.5H27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M5 18.5L9 9.5L13 18.5C13 20 11.2 21.5 9 21.5C6.8 21.5 5 20 5 18.5Z" stroke="currentColor" strokeWidth="1.6" fill="rgba(229,195,120,0.2)" />
                    <path d="M23 18.5L27 9.5L31 18.5C31 20 29.2 21.5 27 21.5C24.8 21.5 23 20 23 18.5Z" stroke="currentColor" strokeWidth="1.6" fill="rgba(229,195,120,0.2)" />
                    <path d="M14 29H22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-[10.5px] sm:text-xs font-serif font-bold text-[#FFF5DC] mt-2 leading-tight tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                  Transparent<br />Pricing
                </span>
              </div>

            </div>
          </motion.div>

          {/* Two Action Buttons with Interactive Shimmer & Flow */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3.5 sm:gap-4 font-sans">
            
            {/* Primary Gold Pill: Explore Signature Jewels */}
            <button
              onClick={() => navigate('/collections')}
              className="relative overflow-hidden bg-gradient-to-r from-[#D4AF37] via-[#E8C779] to-[#C49B31] text-[#33080F] font-bold text-xs sm:text-sm px-6 sm:px-7 py-3.5 rounded-full shadow-lg shadow-black/40 hover:brightness-110 hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer group active:scale-95"
            >
              <span className="relative z-10">Explore Signature Jewels</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 relative z-10" />
              {/* Shimmer sweep effect */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none" />
            </button>

            {/* Outlined Pill: Visit Trichy Showroom */}
            <button
              onClick={() => navigate('/contact')}
              className="border border-[#E5C378]/80 hover:border-[#FFF3DC] hover:bg-white/10 text-[#F5E6CA] hover:text-white font-medium text-xs sm:text-sm px-6 sm:px-7 py-3.5 rounded-full transition-all flex items-center gap-2 cursor-pointer group active:scale-95 shadow-md shadow-black/30 backdrop-blur-xs"
            >
              <MapPin className="w-4 h-4 text-[#E5C378] group-hover:text-[#FFF5DC] transition-colors" />
              <span>Visit Trichy Showroom</span>
            </button>

          </motion.div>

        </motion.div>

      </div>

    </section>
  );
}
