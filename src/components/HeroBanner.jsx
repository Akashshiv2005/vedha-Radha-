import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function HeroBanner({ onExploreClick }) {
  return (
    <section className="relative w-full overflow-hidden bg-[#EFE8DC] border-b border-[#DECDBB]/50">
      
      {/* 16:9 Aspect Ratio Container / Responsive Desktop Mockup */}
      <div className="relative w-full aspect-[16/9] min-h-[520px] max-h-[860px] flex flex-col justify-between">
        
        {/* Background Gallery Image: Architectural Sandstone with Peacock-Teal Insets & Tiered Stone Plinths */}
        <img
          src="/images/gallery_hero.jpg"
          alt="Veda Radha Thangamaaligai Jewellery Gallery - South Indian Temple Necklace, Jhumka Earrings and Antique Bangles on Stone Plinths"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          loading="eager"
        />

        {/* Soft Ambient Directional Lighting Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none" />

        {/* Centered Hero Copy placed in Upper-Center above the Jewellery Products */}
        <div className="relative z-10 w-full max-w-3xl mx-auto px-4 pt-8 sm:pt-12 md:pt-14 lg:pt-16 text-center flex flex-col items-center">
          
          {/* Eyebrow */}
          <span className="font-sans text-[10px] sm:text-[11px] md:text-[12px] font-medium tracking-[0.26em] text-[#916E34] uppercase">
            THE ART OF SOUTH INDIAN JEWELLERY
          </span>

          {/* Champagne Gold Lotus Line Divider Motif */}
          <div className="flex items-center justify-center gap-2.5 my-1.5 sm:my-2 text-[#B38E46]">
            <span className="w-8 sm:w-12 h-[1px] bg-[#C5A059]/70" />
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#B38E46] shrink-0" viewBox="0 0 24 24">
              <path d="M12 4C12 4 9.5 7.5 9.5 10C9.5 11.5 10.5 12.5 12 12.5C13.5 12.5 14.5 11.5 14.5 10C14.5 7.5 12 4 12 4Z" opacity="0.9" />
              <path d="M12 12.5C9.5 12.5 7 10 7 10C7 12 8.5 14 10.5 14.5C9 14.8 7 15.8 7 17.5C7 19 8.5 20.5 12 20.5C15.5 20.5 17 19 17 17.5C17 15.8 15 14.8 13.5 14.5C15.5 14 17 12 17 10C17 10 14.5 12.5 12 12.5Z" />
            </svg>
            <span className="w-8 sm:w-12 h-[1px] bg-[#C5A059]/70" />
          </div>

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-[44px] lg:text-[50px] font-normal text-[#0E3834] leading-[1.12] tracking-tight">
            A legacy, cast in gold.
          </h1>

          {/* Supporting Text */}
          <p className="mt-1.5 sm:mt-2 font-serif sm:font-sans italic sm:not-italic text-xs sm:text-[14px] md:text-[15px] text-[#4F645E] leading-relaxed max-w-lg">
            Discover treasured designs for the moments you keep.
          </p>

          {/* Deep Peacock-Teal Call to Action Button */}
          <div className="mt-4 sm:mt-5">
            <button
              onClick={onExploreClick}
              className="inline-flex items-center gap-2 bg-[#0E3D3A] hover:bg-[#072826] text-[#FAF8F5] text-xs sm:text-[13px] font-medium tracking-wide px-5 sm:px-6 py-2 sm:py-2.5 rounded-[2px] shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <span>Explore the Collection</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>

        </div>

        {/* Bottom spacer to preserve view of jewellery products on tiered plinths */}
        <div className="relative z-10 w-full pb-4 pointer-events-none" />

      </div>

    </section>
  );
}
