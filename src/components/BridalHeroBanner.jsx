import React from 'react';

export default function BridalHeroBanner({ onExploreClick }) {
  return (
    <section className="bg-[#FAF7F2] py-6 sm:py-10 lg:py-12 border-b border-[#EAE2D5] select-none">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Wide Bridal Banner Container */}
        <div className="relative w-full aspect-auto sm:aspect-[21/9] min-h-[300px] xs:min-h-[330px] sm:min-h-[380px] lg:min-h-[440px] rounded-2xl overflow-hidden border border-[#C49A45]/40 shadow-[0_12px_36px_rgba(101,31,43,0.12)] bg-[#450F18]">
          
          {/* Background Image: Rich Maroon Silk, Diagonal Temple Jewellery on Carved Wood, Teal Silk Accent */}
          <img
            src="/images/bridal_hero_clean.jpg"
            alt="South Indian bridal temple jewellery collection on rich maroon silk"
            className="absolute inset-0 w-full h-full object-cover object-right sm:object-center"
            loading="eager"
          />

          {/* Gentle vignette/gradient on the left to ensure crisp, effortless legibility for text */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#380911]/95 via-[#450F18]/90 sm:via-[#450F18]/80 to-[#450F18]/60 sm:to-transparent pointer-events-none" />

          {/* Left-Aligned Copy Block */}
          <div className="relative z-10 h-full flex flex-col justify-center px-4 xs:px-6 sm:px-10 lg:px-16 xl:px-20 max-w-xl lg:max-w-2xl py-6 xs:py-8 sm:py-10">
            
            {/* Eyebrow: Gold hairline rule with uppercase gold text */}
            <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3.5 mb-2 xs:mb-2.5 sm:mb-4">
              <span className="h-[1px] w-6 xs:w-8 sm:w-12 bg-[#C49A45]"></span>
              <span className="text-[#C49A45] text-[9.5px] xs:text-[10.5px] sm:text-xs font-semibold tracking-[0.2em] sm:tracking-[0.24em] uppercase font-sans">
                BRIDAL COLLECTION
              </span>
            </div>

            {/* Headline: Elegant Serif in Ivory with generous line-height */}
            <h2 className="font-serif text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-[44px] xl:text-[48px] font-normal text-[#F8F4EC] leading-[1.2] sm:leading-[1.28] tracking-tight">
              Where Every Bride<br />
              Becomes a Tradition
            </h2>

            {/* Supporting Text: Soft Ivory with generous margin and line-height */}
            <p className="text-[#F8F4EC]/90 font-sans text-[11.5px] xs:text-xs sm:text-sm lg:text-[15px] font-normal leading-[1.55] sm:leading-[1.8] mt-2 xs:mt-2.5 sm:mt-4 max-w-md sm:max-w-lg">
              Heirloom-inspired gold jewellery, designed to shine through sacred rituals and timeless celebrations.
            </p>

            {/* CTA Button */}
            <div className="mt-3.5 xs:mt-4.5 sm:mt-7">
              <button
                type="button"
                onClick={onExploreClick}
                className="group inline-flex items-center justify-center px-4 xs:px-6 sm:px-8 py-2 xs:py-2.5 sm:py-3.5 rounded border border-[#C49A45] bg-[#3B0B14]/40 hover:bg-[#651F2B] hover:border-[#E5C278] text-[#F8F4EC] hover:text-white transition-all duration-300 shadow-sm cursor-pointer min-h-[38px] xs:min-h-[42px]"
              >
                <span className="text-[10px] xs:text-[11px] sm:text-[11.5px] font-medium tracking-[0.2em] uppercase font-sans">
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
