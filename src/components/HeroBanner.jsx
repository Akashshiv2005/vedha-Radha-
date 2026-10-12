import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function HeroBanner({ onExploreClick }) {
  const navigate = useNavigate();

  const handleDiscover = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      navigate('/collections');
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#651F2B] select-none flex items-center justify-center">
      
      {/* Viewport-Fitted Desktop Hero Container: Fits visible page height without vertical scrolling */}
      <div 
        className="relative w-full flex items-center justify-center overflow-hidden"
        style={{
          height: 'min(calc(100vh - 105px), 660px)',
          minHeight: '440px'
        }}
      >
        
        {/* Exact Photographic Hero Image Asset */}
        <img
          src="/images/vedha_radha_hero_reference.jpg"
          alt="Vedha Radha - South Indian temple gold jewellery and silver pooja collection on connected ivory stone platform with teal silk drapery"
          className="absolute inset-0 w-full h-full object-cover md:object-cover object-[center_35%] select-none pointer-events-none"
          loading="eager"
        />

        {/* Hero Copy: Bigger Scale & Lightly Shifted Up */}
        <div className="absolute top-[8%] sm:top-[9%] md:top-[10%] lg:top-[11%] xl:top-[12%] left-[5%] sm:left-[6%] md:left-[6.5%] lg:left-[7%] z-10 w-[88%] max-w-[320px] sm:max-w-[420px] md:max-w-[500px] lg:max-w-[580px] xl:max-w-[640px] flex flex-col items-start text-left">
          
          {/* Eyebrow with gold accent horizontal rule */}
          <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-3 lg:mb-3.5">
            <span className="w-7 sm:w-9 lg:w-11 h-[1.5px] bg-[#C5A059] shrink-0" aria-hidden="true" />
            <span className="font-sans text-[10px] sm:text-[11px] md:text-[12px] lg:text-[12.5px] font-semibold uppercase tracking-[0.24em] text-[#C5A059]">
              GOLD &amp; SILVER &bull; MADE FOR YOUR MOMENTS
            </span>
          </div>

          {/* Large prominent ivory serif headline: Bigger with tight leading */}
          <h1 className="font-serif text-[30px] sm:text-[38px] md:text-[46px] lg:text-[54px] xl:text-[62px] 2xl:text-[68px] font-semibold text-[#F8F4EC] leading-[0.98] sm:leading-[1.0] tracking-[-0.015em] mb-2.5 sm:mb-3.5 lg:mb-4">
            <span className="block">A little tradition.</span>
            <span className="block">A lot of meaning.</span>
          </h1>

          {/* Supporting text in 2 lines with elegant serif styling */}
          <p className="font-serif text-xs sm:text-sm md:text-[16px] lg:text-[17.5px] xl:text-[18.5px] text-[#EDE4D8] font-normal leading-[1.35] max-w-sm sm:max-w-md mb-6 sm:mb-8 lg:mb-10">
            <span className="block">Treasured gold and silver pieces</span>
            <span className="block">for every celebration.</span>
          </p>

          {/* Action: Rounded gold button with chevron */}
          <div className="flex items-center">
            {/* Rounded antique gold button */}
            <button
              onClick={handleDiscover}
              className="inline-flex items-center gap-2 bg-[#B88E3E] hover:bg-[#c59a45] active:scale-95 text-[#FAF7F2] font-medium text-xs sm:text-sm md:text-[14px] tracking-wide px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 rounded-full shadow-[0_4px_16px_rgba(184,142,62,0.3)] hover:shadow-[0_6px_20px_rgba(184,142,62,0.45)] transition-all duration-200 cursor-pointer"
              aria-label="Discover the Collection"
            >
              <span>Discover the Collection</span>
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </button>
          </div>

        </div>

      </div>

    </section>
  );
}
