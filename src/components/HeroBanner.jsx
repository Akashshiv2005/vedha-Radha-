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
        - Mobile: Full viewport height h-[calc(100dvh-85px)] removing bottom space
        - Desktop/Tablet: Balanced viewport hero height md:h-[min(calc(100vh-100px),640px)]
      */}
      <div
        className="relative w-full overflow-hidden flex items-start md:items-center justify-start h-[calc(100dvh-85px)] sm:h-[calc(100dvh-75px)] md:h-[min(calc(100vh-100px),640px)] min-h-[520px] sm:min-h-[560px] md:min-h-[480px]"
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
                  top: '-20%',
                  height: '122%',
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
        <div className="relative z-10 w-full h-full flex items-start md:items-center justify-center md:justify-start px-4 xs:px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 pointer-events-auto pt-10 xs:pt-12 sm:pt-14 md:pt-0">

          {/* Content Wrapper: Center-aligned on Mobile, Left-aligned on Desktop with subtle luxury ambient sheen */}
          <div className="w-full max-w-[350px] xs:max-w-[390px] sm:max-w-[460px] md:max-w-[440px] lg:max-w-[480px] xl:max-w-[540px] flex flex-col items-center md:items-start text-center md:text-left mx-auto md:mx-0 md:bg-gradient-to-r md:from-[#FAF7F2]/85 md:via-[#FAF7F2]/45 md:to-transparent md:p-6 md:-ml-6 md:rounded-2xl">

            {/* Top Eyebrow: VEDHA RADHA SIGNATURE COLLECTION with Gold Lotus */}
            <div className="flex flex-col items-center md:items-start gap-1.5 sm:gap-2 mb-3 xs:mb-3.5 sm:mb-4">
              <span className="font-sans text-[11px] xs:text-[12px] sm:text-[12.5px] font-semibold tracking-[0.24em] text-[#917144] uppercase">
                VEDHA RADHA SIGNATURE COLLECTION
              </span>

              {/* Delicate 5-Petal Gold Lotus Emblem */}
              <div className="flex items-center justify-center md:justify-start gap-2.5 sm:gap-3">
                <span className="w-9 sm:w-11 h-[1px] bg-[#C5A059]/60" aria-hidden="true" />
                <svg className="w-4 h-4 text-[#917144]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 4C10.5 7 10.5 11 12 15C13.5 11 13.5 7 12 4Z" />
                  <path d="M12 15C9.5 11.5 6 9.5 5 11.5C4 13.5 7.5 15.5 12 15Z" />
                  <path d="M12 15C14.5 11.5 18 9.5 19 11.5C20 13.5 16.5 15.5 12 15Z" />
                </svg>
                <span className="w-9 sm:w-11 h-[1px] bg-[#C5A059]/60" aria-hidden="true" />
              </div>
            </div>

            {/* Main Headline: A little gold. A lifetime of meaning. */}
            <h1 className="font-serif text-center md:text-left mb-3 xs:mb-3.5 sm:mb-4">
              <span className="block text-[36px] xs:text-[40px] sm:text-[46px] md:text-[46px] lg:text-[50px] xl:text-[58px] font-bold text-[#2A1D1A] leading-[1.12] tracking-tight">
                A little gold.
              </span>
              <span className="block font-normal italic font-serif text-[#3D2520] text-[36px] xs:text-[40px] sm:text-[46px] md:text-[46px] lg:text-[50px] xl:text-[58px] leading-[1.15] mt-1.5 xs:mt-2">
                A lifetime of meaning.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="font-serif text-[13.5px] xs:text-[14.5px] sm:text-[15.5px] text-[#5A453F] leading-[1.5] max-w-[300px] xs:max-w-[340px] sm:max-w-md mb-4.5 xs:mb-5.5 sm:mb-6.5 mx-auto md:mx-0">
              Temple-inspired treasures, made for your most memorable moments.
            </p>

            {/* Interactive Action Buttons */}
            <div className="flex flex-row items-center justify-center md:justify-start gap-2.5 xs:gap-3.5 sm:gap-4 w-full sm:w-auto mt-5 xs:mt-6 sm:mt-7 mb-5 xs:mb-6 sm:mb-7">

              {/* Primary Button: Shop Gold Jewellery */}
              <button
                onClick={handleShopGold}
                className="w-[142px] xs:w-[152px] sm:w-auto inline-flex items-center justify-center gap-2 bg-[#651F2B] hover:bg-[#521721] active:scale-95 text-[#F8F4EC] text-[13.5px] xs:text-[14px] sm:text-[14.5px] font-medium tracking-wide py-3 xs:py-3.5 px-4 sm:px-6 rounded-md shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer whitespace-nowrap"
                aria-label="Shop Gold Jewellery"
              >
                <span>Shop Gold</span>
                <ArrowRight className="w-4 h-4 stroke-[2]" />
              </button>

              {/* Secondary Button: Explore New Arrivals */}
              <button
                onClick={handleExploreNewArrivals}
                className="w-[142px] xs:w-[152px] sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FAF8F5] active:scale-95 text-[#2C1D18] border border-[#C5A059]/70 hover:border-[#8E6928] text-[13.5px] xs:text-[14px] sm:text-[14.5px] font-medium tracking-wide py-3 xs:py-3.5 px-4 sm:px-6 rounded-md shadow-2xs hover:shadow-sm transition-all duration-200 cursor-pointer whitespace-nowrap"
                aria-label="Explore New Arrivals"
              >
                <span>New Arrivals</span>
                <ArrowRight className="w-4 h-4 stroke-[2] text-[#8E6928]" />
              </button>

            </div>

            {/* Bottom Brand Flourish: TRADITION LIVES FOREVER */}
            <div className="flex items-center justify-center md:justify-start gap-2 w-full max-w-[260px] mx-auto md:mx-0 pt-3 xs:pt-3.5 sm:pt-4">
              <svg className="w-4 h-4 text-[#B88E3E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 4C10.5 7 10.5 11 12 15C13.5 11 13.5 7 12 4Z" />
                <path d="M12 15C9.5 11.5 6 9.5 5 11.5C4 13.5 7.5 15.5 12 15Z" />
                <path d="M12 15C14.5 11.5 18 9.5 19 11.5C20 13.5 16.5 15.5 12 15Z" />
              </svg>
              <span className="font-sans text-[9px] xs:text-[10px] sm:text-[10.5px] font-bold tracking-[0.26em] text-[#917144] uppercase">
                TRADITION LIVES FOREVER
              </span>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
