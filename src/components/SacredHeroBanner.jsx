import React from 'react';

/**
 * SacredHeroBanner
 * Premium wide desktop ecommerce banner for Vedha Radha's sacred collection.
 * Composition:
 *  - Left: Polished South Indian silver idols (Lakshmi, Vinayagar, Murugan) on rich maroon velvet.
 *  - Right: Minimal, elegant typography block with deep maroon background, antique gold eyebrow,
 *           warm ivory serif headline, and refined outline CTA button.
 */
export default function SacredHeroBanner({ onExploreClick }) {
  return (
    <section className="bg-[#FAF7F2] py-8 sm:py-12 border-b border-[#EAE2D5] select-none">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Wide Desktop Banner Container (Aspect ratio ~21:9 / 2.33:1) */}
        <div className="relative w-full aspect-[21/9] min-h-[360px] sm:min-h-[420px] lg:min-h-[460px] rounded-2xl overflow-hidden border border-[#C49A45]/30 shadow-[0_16px_40px_rgba(101,31,43,0.18)] bg-[#651F2B]">
          
          {/* Base Photographic Layer: Silver idols on maroon velvet on left, pure maroon field on right */}
          <img
            src="/images/sacred_silver_idols_clean.png"
            alt="Sacred Collection - Handcrafted pure silver Vinayagar, Lakshmi, and Murugan idols on deep maroon velvet"
            className="absolute inset-0 w-full h-full object-cover object-left md:object-center pointer-events-none"
            loading="eager"
          />

          {/* Smooth blend overlay into deep maroon #651F2B for pristine contrast & typography */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#651F2B]/90 via-[#651F2B]/80 to-[#651F2B]/95 md:from-transparent md:via-[#651F2B]/40 md:to-[#651F2B] pointer-events-none" />

          {/* Subtle restrained teal #218F95 ambiance accent on the right boundary */}
          <div className="absolute -right-24 -top-24 w-96 h-96 bg-[#218F95]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Right-Aligned Text & CTA Block */}
          <div className="relative z-10 h-full flex flex-col justify-center items-start md:items-start ml-auto w-full md:w-[48%] lg:w-[44%] px-4 xs:px-6 sm:px-10 lg:pr-16 xl:pr-20 py-6 sm:py-8">
            
            {/* Eyebrow: Antique Gold #C49A45 with generous bottom margin */}
            <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-5 lg:mb-6">
              {/* Optional restrained teal #218F95 micro-pip */}
              <span className="w-1.5 h-1.5 rounded-full bg-[#218F95]/80 inline-block"></span>
              <span className="text-[#C49A45] text-[10px] sm:text-xs font-semibold tracking-[0.22em] sm:tracking-[0.26em] uppercase font-sans">
                SACRED COLLECTION
              </span>
            </div>

            {/* Headline: Warm Ivory #F8F4EC serif with generous spacing */}
            <h2 className="font-serif text-2xl xs:text-3xl sm:text-4xl lg:text-[46px] xl:text-[52px] font-normal text-[#F8F4EC] leading-[1.2] sm:leading-[1.24] tracking-normal mb-3 sm:mb-5 lg:mb-6">
              Silver Idols
            </h2>

            {/* Description: Warm Ivory #F8F4EC with open leading and ample bottom margin */}
            <p className="text-[#F8F4EC]/90 font-serif sm:font-sans text-xs sm:text-sm lg:text-[15px] font-normal leading-[1.65] sm:leading-[1.85] max-w-md mb-6 sm:mb-9 lg:mb-10">
              Sacred idols crafted in fine silver, designed to elevate every sacred space.
            </p>

            {/* CTA Button: Antique Gold outline with rounded profile */}
            <div>
              <button
                type="button"
                onClick={onExploreClick}
                className="group inline-flex items-center justify-center px-6 sm:px-9 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl border border-[#C49A45] bg-[#651F2B]/60 hover:bg-[#651F2B] hover:border-[#E5C278] text-[#F8F4EC] transition-all duration-300 shadow-sm hover:shadow-[0_4px_16px_rgba(196,154,69,0.25)] cursor-pointer active:scale-[0.98] min-h-[44px]"
              >
                <span className="text-[10.5px] sm:text-[11.5px] font-medium tracking-[0.22em] uppercase font-sans">
                  EXPLORE COLLECTION
                </span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
