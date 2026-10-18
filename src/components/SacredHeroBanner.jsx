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
    <section className="bg-[#FAF7F2] py-6 sm:py-10 lg:py-12 border-b border-[#EAE2D5] select-none">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Container */}
        <div className="relative w-full aspect-auto sm:aspect-[21/9] min-h-[340px] xs:min-h-[370px] sm:min-h-[380px] lg:min-h-[440px] rounded-2xl overflow-hidden border border-[#C49A45]/30 shadow-[0_16px_40px_rgba(101,31,43,0.18)] bg-[#651F2B] flex flex-col justify-end sm:block">
          
          {/* Base Photographic Layer: Silver idols on maroon velvet on left, pure maroon field on right */}
          <img
            src="/images/sacred_silver_idols_clean.png"
            alt="Sacred Collection - Handcrafted pure silver Vinayagar, Lakshmi, and Murugan idols on deep maroon velvet"
            className="absolute inset-0 w-full h-full object-cover object-[11%_center] sm:object-left md:object-center pointer-events-none"
            loading="eager"
          />

          {/* Smooth blend overlay: reduced opacity on mobile letting silver idols show through clearly with soft bottom vignette for text legibility. Tablet & desktop remain original rich blend. */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-[#450F18]/40 via-45% to-transparent sm:bg-gradient-to-r sm:from-[#651F2B]/90 sm:via-[#651F2B]/75 md:from-transparent md:via-[#651F2B]/40 md:to-[#651F2B] pointer-events-none" />

          {/* Subtle restrained teal #218F95 ambiance accent on the right boundary */}
          <div className="absolute -right-24 -top-24 w-96 h-96 bg-[#218F95]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Text & CTA Block: Bottom & Center-aligned on Mobile, Vertically Centered & Right-aligned on Desktop */}
          <div className="relative z-10 sm:h-full flex flex-col justify-end sm:justify-center items-center md:items-start text-center md:text-left sm:ml-auto w-full md:w-[48%] lg:w-[44%] px-4 xs:px-6 sm:px-10 lg:pr-16 xl:pr-20 pb-5 xs:pb-6 pt-12 sm:py-10">
            
            {/* Eyebrow: Antique Gold #C49A45 with generous bottom margin */}
            <div className="flex items-center justify-center md:justify-start gap-2 xs:gap-2.5 sm:gap-3 mb-1 xs:mb-1.5 sm:mb-4">
              {/* Optional restrained teal #218F95 micro-pip */}
              <span className="w-1.5 h-1.5 rounded-full bg-[#218F95]/80 inline-block"></span>
              <span className="text-[#C49A45] text-[8.5px] xs:text-[9.5px] sm:text-xs font-semibold tracking-[0.22em] sm:tracking-[0.26em] uppercase font-sans">
                SACRED COLLECTION
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#218F95]/80 inline-block md:hidden"></span>
            </div>

            {/* Headline: Warm Ivory #F8F4EC serif with generous spacing */}
            <h2 className="text-[19px] xs:text-[21px] sm:text-3xl md:text-4xl lg:text-[46px] xl:text-[52px] font-normal text-[#F8F4EC] leading-[1.2] sm:leading-[1.24] tracking-normal mb-1 xs:mb-1.5 sm:mb-4">
              Silver Idols
            </h2>

            {/* Description: Warm Ivory #F8F4EC with open leading and ample bottom margin */}
            <p className="text-[#F8F4EC]/90 sm:font-sans text-[10px] xs:text-[11px] sm:text-sm lg:text-[15px] font-normal leading-[1.45] sm:leading-[1.8] max-w-xs xs:max-w-sm sm:max-w-md mx-auto md:mx-0 mb-2.5 xs:mb-3.5 sm:mb-7">
              Sacred idols crafted in fine silver, designed to elevate every sacred space.
            </p>

            {/* CTA Button */}
            <div className="flex justify-center md:justify-start w-full md:w-auto">
              <button
                type="button"
                onClick={onExploreClick}
                className="group inline-flex items-center justify-center px-4 xs:px-5 sm:px-9 py-1.5 xs:py-2 sm:py-3.5 rounded-lg sm:rounded-xl border border-[#C49A45] bg-[#651F2B]/60 hover:bg-[#651F2B] hover:border-[#E5C278] text-[#F8F4EC] transition-all duration-300 shadow-sm hover:shadow-[0_4px_16px_rgba(196,154,69,0.25)] cursor-pointer active:scale-[0.98] min-h-[34px] xs:min-h-[36px] sm:min-h-[42px]"
              >
                <span className="text-[9px] xs:text-[10px] sm:text-[11.5px] font-medium tracking-[0.22em] uppercase font-sans">
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
