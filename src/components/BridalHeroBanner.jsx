import React from 'react';

export default function BridalHeroBanner({ onExploreClick }) {
  return (
    <section className="bg-[#FAF7F2] py-8 sm:py-12 border-b border-[#EAE2D5] select-none">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Wide Desktop Bridal Banner Container */}
        <div className="relative w-full aspect-[21/9] min-h-[380px] sm:min-h-[420px] lg:min-h-[460px] rounded-2xl overflow-hidden border border-[#C49A45]/40 shadow-[0_12px_36px_rgba(101,31,43,0.12)] bg-[#450F18]">
          
          {/* Background Image: Rich Maroon Silk, Diagonal Temple Jewellery on Carved Wood, Teal Silk Accent */}
          <img
            src="/images/bridal_hero_clean.jpg"
            alt="South Indian bridal temple jewellery collection on rich maroon silk"
            className="absolute inset-0 w-full h-full object-cover object-right sm:object-center"
            loading="eager"
          />

          {/* Gentle vignette/gradient on the left to ensure crisp, effortless legibility for text */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#380911]/90 via-[#450F18]/60 to-transparent pointer-events-none" />

          {/* Left-Aligned Copy Block */}
          <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-20 max-w-xl lg:max-w-2xl py-8">
            
            {/* Eyebrow: Gold hairline rule with uppercase gold text */}
            <div className="flex items-center gap-3.5 mb-4 sm:mb-6">
              <span className="h-[1px] w-9 sm:w-12 bg-[#C49A45]"></span>
              <span className="text-[#C49A45] text-[10.5px] sm:text-xs font-semibold tracking-[0.24em] uppercase font-sans">
                BRIDAL COLLECTION
              </span>
            </div>

            {/* Headline: Elegant Serif in Ivory with generous line-height */}
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-normal text-[#F8F4EC] leading-[1.28] sm:leading-[1.32] tracking-tight">
              Where Every Bride<br />
              Becomes a Tradition
            </h2>

            {/* Supporting Text: Soft Ivory with generous margin and line-height */}
            <p className="text-[#F8F4EC]/90 font-sans text-xs sm:text-sm lg:text-[15px] font-normal leading-[1.75] sm:leading-[1.85] mt-5 sm:mt-6 lg:mt-7 max-w-md sm:max-w-lg">
              Heirloom-inspired gold jewellery, designed to shine through sacred rituals and timeless celebrations.
            </p>

            {/* CTA Button: Generous margin-top */}
            <div className="mt-8 sm:mt-9 lg:mt-10">
              <button
                type="button"
                onClick={onExploreClick}
                className="group inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3.5 rounded border border-[#C49A45] bg-[#3B0B14]/40 hover:bg-[#651F2B] hover:border-[#E5C278] text-[#F8F4EC] hover:text-white transition-all duration-300 shadow-sm cursor-pointer"
              >
                <span className="text-[10.5px] sm:text-[11.5px] font-medium tracking-[0.2em] uppercase font-sans">
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
