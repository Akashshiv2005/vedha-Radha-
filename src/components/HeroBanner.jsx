import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * ============================================================================
 * VEDHA RADHA HERO SECTION CONFIGURATION
 * 
 * Layer Architecture:
 * - 2nd Layer (z-0 / background): Full-bleed video fitting edge-to-edge without side gaps
 * - 1st Layer (z-10 / foreground): Real HTML typography and interactive buttons
 * ============================================================================
 */
export const HERO_MEDIA_CONFIG = {
  videoSrc: '/videos/vedha-radha-hero-teal-motion.mp4',
  mobileVideoSrc: '/videos/hero_video_mobile.mp4',
  //posterSrc: '/images/vedha_radha_hero_teal_clean_poster.jpg'
};

export default function HeroBanner({ onExploreClick }) {
  const navigate = useNavigate();
  const desktopVideoRef = useRef(null);
  const mobileVideoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check user OS accessibility preferences for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Ensure both desktop and mobile videos play automatically
  useEffect(() => {
    if (!prefersReducedMotion) {
      if (desktopVideoRef.current) {
        desktopVideoRef.current.play().catch(() => {});
      }
      if (mobileVideoRef.current) {
        mobileVideoRef.current.play().catch(() => {});
      }
    }
  }, [prefersReducedMotion]);

  const handleShopGold = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      navigate('/gold');
    }
  };

  const handleExploreNewArrivals = () => {
    navigate('/new-arrivals');
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#FAF7F2] select-none">

      {/* 
        Full-bleed Viewport Container:
        - 100% full width with NO left/right margins or max-width constraints
        - Mobile: Full viewport height h-[calc(100dvh-60px)] removing bottom space
        - Desktop/Tablet: Balanced viewport hero height md:h-[min(calc(100vh-100px),680px)]
      */}
      <div
        className="relative w-full overflow-hidden flex items-start md:items-center justify-start h-[calc(100dvh-60px)] md:h-[min(calc(100vh-100px),680px)] min-h-[560px] md:min-h-[500px]"
      >

        {/* ========================================================================= */}
        {/* 2ND LAYER: FULL-WIDTH BACKGROUND VIDEO (JEWELLERY MOTION & SPARKLE)       */}
        {/* ========================================================================= */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">

          {/* Static Still Poster Fallback: Visible during loading & reduced motion */}
          <img
            src={HERO_MEDIA_CONFIG.posterSrc}
            alt="Vedha Radha Signature Collection - Temple Gold Jewellery on Teal Velvet"
            className={`absolute inset-0 w-full h-full object-cover object-right md:object-center transition-opacity duration-700 select-none pointer-events-none ${videoLoaded && !prefersReducedMotion ? 'opacity-0' : 'opacity-100'
              }`}
            loading="eager"
          />

          {/* Full-bleed Video with Jewel Motion & Blinking Sparkles */}
          {!prefersReducedMotion && (
            <>
              {/* Desktop / Tablet Video (md: 768px and up) */}
              <video
                ref={desktopVideoRef}
                src={HERO_MEDIA_CONFIG.videoSrc}
                poster={HERO_MEDIA_CONFIG.posterSrc}
                autoPlay
                loop
                muted
                playsInline
                onLoadedData={() => setVideoLoaded(true)}
                className="hidden md:block absolute left-0 w-full object-cover select-none pointer-events-none transition-opacity duration-700"
                style={{
                  // Clips the top 73px (12.67%) baked navbar in the desktop video, fitting 503px hero area seamlessly
                  top: '-22%',
                  height: '125%',
                  objectPosition: 'center center'
                }}
              />

              {/* Mobile View Video (all mobile devices < 768px: dedicated 1080x1920 mobile video in full view) */}
              <video
                ref={mobileVideoRef}
                src={HERO_MEDIA_CONFIG.mobileVideoSrc}
                poster={HERO_MEDIA_CONFIG.posterSrc}
                autoPlay
                loop
                muted
                playsInline
                onLoadedData={() => setVideoLoaded(true)}
                className="block md:hidden absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none transition-opacity duration-700"
              />
            </>
          )}

        </div>

        {/* ========================================================================= */}
        {/* 1ST LAYER: REAL HTML TYPOGRAPHY, BUTTONS & BRAND FLOURISHES               */}
        {/* ========================================================================= */}
        <div className="relative z-10 w-full h-full flex items-start md:items-center justify-center md:justify-start px-4 xs:px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24 pointer-events-auto pt-7 xs:pt-9 sm:pt-12 md:pt-0">

          {/* Content Wrapper: Center-aligned on Mobile, Left-aligned on Desktop */}
          <div className="w-full max-w-[360px] xs:max-w-[400px] sm:max-w-[460px] md:max-w-[480px] lg:max-w-[540px] flex flex-col items-center md:items-start text-center md:text-left mx-auto md:mx-0">

            {/* Top Eyebrow: VEDHA RADHA SIGNATURE COLLECTION with Gold Lotus */}
            <div className="flex flex-col items-center md:items-start gap-1.5 sm:gap-2 mb-3 xs:mb-4 sm:mb-5">
              <span className="font-sans text-[10px] xs:text-[11px] sm:text-[12px] md:text-[13px] font-semibold tracking-[0.22em] xs:tracking-[0.26em] text-[#917144] uppercase">
                VEDHA RADHA SIGNATURE COLLECTION
              </span>

              {/* Delicate 5-Petal Gold Lotus Emblem */}
              <div className="flex items-center justify-center md:justify-start gap-2.5 sm:gap-3">
                <span className="w-7 sm:w-10 h-[1px] bg-[#C5A059]/60" aria-hidden="true" />
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#917144]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 4C10.5 7 10.5 11 12 15C13.5 11 13.5 7 12 4Z" />
                  <path d="M12 15C9.5 11.5 6 9.5 5 11.5C4 13.5 7.5 15.5 12 15Z" />
                  <path d="M12 15C14.5 11.5 18 9.5 19 11.5C20 13.5 16.5 15.5 12 15Z" />
                </svg>
                <span className="w-7 sm:w-10 h-[1px] bg-[#C5A059]/60" aria-hidden="true" />
              </div>
            </div>

            {/* Main Headline: A little gold. A lifetime of meaning. */}
            <h1 className="font-serif text-[28px] xs:text-[33px] sm:text-[42px] md:text-[50px] lg:text-[56px] xl:text-[60px] font-bold text-[#2A1D1A] leading-[1.12] sm:leading-[1.04] tracking-[-0.015em] mb-2.5 xs:mb-3.5 sm:mb-4">
              <span className="block text-[34px] md:text-[48px] lg:text-[56px] xl:text-[60px]">
                A little gold.
              </span>
              <span className="block font-normal italic font-serif text-[#3D2520] text-[36px] md:text-[50px] lg:text-[58px] pt-[22px] md:pt-0">
                A lifetime of meaning.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="font-serif text-[12.5px] xs:text-[13.5px] sm:text-[14.5px] md:text-[16px] text-[#5A453F] leading-[1.5] max-w-[320px] xs:max-w-sm sm:max-w-md mb-5 xs:mb-6 sm:mb-7 mx-auto md:mx-0 pt-[30px] md:pt-0">
              Temple-inspired treasures, made for your most memorable moments.
            </p>

            {/* Interactive Action Buttons - Sized to exact 123px reference */}
            <div className="flex flex-row flex-wrap items-center justify-center md:justify-start gap-2.5 xs:gap-3.5 sm:gap-4 w-auto mb-5 xs:mb-6 sm:mb-7 mt-[15px] md:mt-0">

              {/* Primary Button: Shop Gold Jewellery */}
              <button
                onClick={handleShopGold}
                className="w-[123px] sm:w-auto inline-flex items-center justify-center gap-2 bg-[#651F2B] hover:bg-[#521721] active:scale-95 text-[#F8F4EC] text-[12px] xs:text-[12.5px] sm:text-[13.5px] font-medium tracking-wide px-[18px] xs:px-5 sm:px-6 py-2.5 rounded shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer whitespace-nowrap"
                aria-label="Shop Gold Jewellery"
              >
                <span>Shop Gold</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
              </button>

              {/* Secondary Button: Explore New Arrivals */}
              <button
                onClick={handleExploreNewArrivals}
                className="w-[123px] sm:w-auto inline-flex items-center justify-center gap-2 bg-white/90 hover:bg-white active:scale-95 text-[#422C27] border border-[#B88E3E] hover:border-[#8E6928] text-[12px] xs:text-[12.5px] sm:text-[13.5px] font-medium tracking-wide px-[18px] xs:px-5 sm:px-6 py-2.5 rounded shadow-2xs hover:shadow-sm transition-all duration-200 cursor-pointer backdrop-blur-[2px] whitespace-nowrap"
                aria-label="Explore New Arrivals"
              >
                <span>New Arrivals</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2] text-[#8E6928]" />
              </button>

            </div>

            {/* Bottom Brand Flourish: TRADITION LIVES FOREVER */}
            <div className="flex items-center justify-center md:justify-start gap-2 pt-3 border-t border-[#D9C4A6]/60 w-full max-w-[240px] mx-auto md:mx-0 -mt-[17px] md:mt-0">
              <svg className="w-3.5 h-3.5 text-[#B88E3E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 4C10.5 7 10.5 11 12 15C13.5 11 13.5 7 12 4Z" />
                <path d="M12 15C9.5 11.5 6 9.5 5 11.5C4 13.5 7.5 15.5 12 15Z" />
                <path d="M12 15C14.5 11.5 18 9.5 19 11.5C20 13.5 16.5 15.5 12 15Z" />
              </svg>
              <span className="font-sans text-[8.5px] xs:text-[9.5px] sm:text-[10px] font-bold tracking-[0.24em] text-[#917144] uppercase">
                TRADITION LIVES FOREVER
              </span>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
