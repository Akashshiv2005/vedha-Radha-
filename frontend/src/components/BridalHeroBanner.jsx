import React from 'react';

export default function BridalHeroBanner({ onExploreClick }) {
  return (
    <section className="bg-[#FAF7F2] py-6 sm:py-10 lg:py-12 border-b border-[#EAE2D5] select-none">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Wide Bridal Banner Container */}
        <div className="relative w-full aspect-auto sm:aspect-[21/9] min-h-[340px] xs:min-h-[370px] sm:min-h-[380px] lg:min-h-[440px] rounded-2xl overflow-hidden border border-[#C49A45]/40 shadow-[0_12px_36px_rgba(101,31,43,0.12)] bg-[#380911] flex flex-col justify-end sm:block">
          
          {/* Background Image: Rich Maroon Silk, Diagonal Temple Jewellery on Carved Wood, Teal Silk Accent */}
          <img
            src="/images/bridal_hero_clean.jpg"
            alt="South Indian bridal temple jewellery collection on rich maroon silk"
            className="absolute inset-0 w-full h-full object-cover object-[80%_center] sm:object-right md:object-center"
            loading="eager"
          />

          {/* Reduced overlay on mobile: transparent at top/center letting jewellery shine through clearly, soft bottom vignette for text legibility. Desktop remains gentle left vignette. */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-[#380911]/40 via-45% to-transparent sm:bg-gradient-to-r sm:from-[#380911]/95 sm:via-[#450F18]/80 sm:to-transparent pointer-events-none" />

          {/* Copy Block: Bottom & Center-aligned on Mobile, Vertically Centered & Left-aligned on Desktop/Tablet */}
          <div className="relative z-10 w-full sm:h-full flex flex-col justify-end sm:justify-center items-center sm:items-start text-center sm:text-left px-4 xs:px-6 sm:px-10 lg:px-16 xl:px-20 max-w-md sm:max-w-xl lg:max-w-2xl mx-auto sm:mx-0 pb-5 xs:pb-6 pt-12 sm:py-10">
            
            {/* Eyebrow: Gold hairline rule with uppercase gold text */}
            <div className="flex items-center justify-center sm:justify-start gap-2 xs:gap-2.5 sm:gap-3.5 mb-1 xs:mb-1.5 sm:mb-4">
              <span className="h-[1px] w-5 xs:w-7 sm:w-12 bg-[#C49A45]"></span>
              <span className="text-[#C49A45] text-[8.5px] xs:text-[9.5px] sm:text-xs font-semibold tracking-[0.2em] sm:tracking-[0.24em] uppercase font-sans">
                BRIDAL COLLECTION
              </span>
              <span className="h-[1px] w-5 xs:w-7 sm:hidden bg-[#C49A45]"></span>
            </div>

            {/* Headline: Elegant Serif in Ivory */}
            <h2 className="text-[17px] xs:text-[20px] sm:text-3xl md:text-4xl lg:text-[44px] xl:text-[48px] font-normal text-[#F8F4EC] leading-[1.22] sm:leading-[1.28] tracking-tight">
              Where Every Bride<br className="hidden xs:inline sm:inline" /> Becomes a Tradition
            </h2>

            {/* Supporting Text: Soft Ivory */}
            <p className="text-[#F8F4EC]/90 font-sans text-[10px] xs:text-[11px] sm:text-sm lg:text-[15px] font-normal leading-[1.45] sm:leading-[1.8] mt-1 xs:mt-1.5 sm:mt-4 max-w-xs xs:max-w-sm sm:max-w-lg mx-auto sm:mx-0">
              Heirloom-inspired gold jewellery, designed to shine through sacred rituals and timeless celebrations.
            </p>

            {/* CTA Button: Centered on mobile, Left-aligned on Desktop */}
            <div className="mt-2.5 xs:mt-3 sm:mt-7 flex justify-center sm:justify-start w-full sm:w-auto">
              <button
                type="button"
                onClick={onExploreClick}
                className="group inline-flex items-center justify-center px-4 xs:px-6 sm:px-8 py-1.5 xs:py-2 sm:py-3.5 rounded border border-[#C49A45] bg-[#3B0B14]/60 hover:bg-[#651F2B] hover:border-[#E5C278] text-[#F8F4EC] hover:text-white transition-all duration-300 shadow-sm cursor-pointer min-h-[34px] xs:min-h-[36px] sm:min-h-[42px]"
              >
                <span className="text-[9px] xs:text-[10px] sm:text-[11.5px] font-medium tracking-[0.2em] uppercase font-sans">
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
