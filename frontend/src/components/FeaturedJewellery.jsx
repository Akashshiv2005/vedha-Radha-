import React from 'react';

export default function FeaturedJewellery({ onSelectCollection }) {
  return (
    <section className="bg-[#F8F4EC] py-10 lg:py-14 border-b border-[#EAE2D5] select-none">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Top Heading Block */}
        <div className="text-center mb-8 lg:mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#651F2B] tracking-normal leading-tight">
            Featured Jewellery Collections
          </h2>

          {/* Decorative Divider: Gold lines with Teal Lotus emblem */}
          <div className="flex items-center justify-center gap-3 mt-3 mb-2">
            <span className="h-[1px] w-12 sm:w-16 bg-[#C49A45]/70"></span>
            <svg 
              className="w-5 h-5 text-[#218F95]" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              aria-hidden="true"
            >
              {/* Refined Lotus / Floral motif */}
              <path d="M12 3C11.5 5.5 10.5 8 8 10C10.5 10.5 12 12.5 12 15C12 12.5 13.5 10.5 16 10C13.5 8 12.5 5.5 12 3Z" opacity="0.95" />
              <path d="M7 11C5 12 3 14 3 17C6 17 8 15 9 13C8.2 12.2 7.5 11.5 7 11Z" opacity="0.8" />
              <path d="M17 11C19 12 21 14 21 17C18 17 16 15 15 13C15.8 12.2 16.5 11.5 17 11Z" opacity="0.8" />
              <path d="M10 17C10.5 18 11.2 19 12 19.5C12.8 19 13.5 18 14 17C12.8 17.5 11.2 17.5 10 17Z" />
            </svg>
            <span className="h-[1px] w-12 sm:w-16 bg-[#C49A45]/70"></span>
          </div>

          <p className="text-[#218F95] text-sm sm:text-base tracking-wide font-normal">
            Discover signature designs for every moment.
          </p>
        </div>

        {/* Asymmetrical Three-Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
          
          {/* Left Card: Tall Editorial Portrait (Layered Luxe) */}
          <div 
            onClick={() => onSelectCollection && onSelectCollection('Layered Luxe')}
            className="group relative w-full aspect-[4/4.5] lg:aspect-auto lg:h-full min-h-[320px] sm:min-h-[460px] lg:min-h-0 rounded-2xl overflow-hidden border border-[#C49A45] shadow-[0_6px_20px_rgba(101,31,43,0.06)] bg-[#1A1A1A] cursor-pointer"
          >
            {/* Absolute positioning prevents image from causing container height overflow */}
            <img
              src="/images/featured_layered_luxe.jpg"
              alt="Layered Luxe - South Indian woman with vivid gold earrings and bangles"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              loading="lazy"
            />

            {/* Subtle Gradient for enhanced text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/35 pointer-events-none" />

            {/* Exact Text Overlay (Upper Right) */}
            <div className="absolute top-4 xs:top-6 sm:top-8 right-4 xs:right-6 sm:right-8 text-right z-10 pointer-events-none">
              <h3 className="text-xl xs:text-2xl sm:text-3xl lg:text-[34px] font-normal text-white tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] leading-tight">
                Layered Luxe
              </h3>
              <p className="text-white/95 text-xs sm:text-[13.5px] tracking-wide mt-0.5 sm:mt-1.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
                Stack it. Style it. Own it.
              </p>
            </div>
          </div>

          {/* Right Column: Two Wide Cards Stacked Vertically */}
          <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6">
            
            {/* Upper-Right Card: Close-up Gold Necklace on Silk (Ethnic Glow) */}
            <div 
              onClick={() => onSelectCollection && onSelectCollection('Ethnic Glow')}
              className="group relative w-full aspect-[16/9] sm:aspect-[470/220] min-h-[160px] sm:min-h-[190px] rounded-2xl overflow-hidden border border-[#C49A45] shadow-[0_6px_20px_rgba(101,31,43,0.06)] bg-[#1A1A1A] cursor-pointer"
            >
              <img
                src="/images/featured_ethnic_glow.jpg"
                alt="Ethnic Glow - South Indian gold necklace on elegant silk"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Subtle Gradient for enhanced text readability */}
              <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/15 to-transparent pointer-events-none" />

              {/* Exact Text Overlay (Lower Right) */}
              <div className="absolute bottom-4 xs:bottom-5 sm:bottom-6 right-4 xs:right-6 sm:right-8 text-right z-10 pointer-events-none">
                <h3 className="text-xl xs:text-2xl sm:text-[28px] font-normal text-white tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] leading-tight">
                  Ethnic Glow
                </h3>
                <p className="text-white/95 text-xs sm:text-[13.5px] tracking-wide mt-0.5 sm:mt-1.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
                  Tradition with a twist.
                </p>
              </div>
            </div>

            {/* Lower-Right Card: Close-up Hand with Gold Ring (Everyday Icons) */}
            <div 
              onClick={() => onSelectCollection && onSelectCollection('Everyday Icons')}
              className="group relative w-full aspect-[16/9] sm:aspect-[470/220] min-h-[160px] sm:min-h-[190px] rounded-2xl overflow-hidden border border-[#C49A45] shadow-[0_6px_20px_rgba(101,31,43,0.06)] bg-[#1A1A1A] cursor-pointer"
            >
              <img
                src="/images/featured_everyday_icons.jpg"
                alt="Everyday Icons - Woman's hand wearing a refined gold ring"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Subtle Gradient for enhanced text readability */}
              <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/20 to-transparent pointer-events-none" />

              {/* Exact Text Overlay (Lower Right) */}
              <div className="absolute bottom-4 xs:bottom-5 sm:bottom-6 right-4 xs:right-6 sm:right-8 text-right z-10 pointer-events-none">
                <h3 className="text-xl xs:text-2xl sm:text-[28px] font-normal text-white tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] leading-tight">
                  Everyday Icons
                </h3>
                <p className="text-white/95 text-xs sm:text-[13.5px] tracking-wide mt-0.5 sm:mt-1.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
                  Little details. Lasting meaning.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
