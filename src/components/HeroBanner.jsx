import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function HeroBanner({ onExploreClick }) {
  const navigate = useNavigate();

  const handleExplore = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      navigate('/collections');
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#F8F4EC] border-b border-[#EAE2D5]">
      
      {/* 16:9 Desktop Aspect Ratio Container */}
      <div className="relative w-full aspect-[16/9] min-h-[480px] sm:min-h-[560px] md:min-h-[640px] max-h-[960px] flex flex-col justify-between">
        
        {/* User's Exact 16:9 Photographic Hero Image Asset */}
        <img
          src="/images/vedha_radha_hero.jpg"
          alt="Vedha Radha - Tradition, together. South Indian 22K temple gold jewellery and 925 sterling silver pooja pieces on an ivory stone platform"
          className="absolute inset-0 w-full h-full object-cover object-center select-none"
          loading="eager"
        />

        {/* Hero Copy Placed in Upper Center with Generous Whitespace */}
        <div className="relative z-10 w-full max-w-3xl mx-auto px-4 pt-8 sm:pt-12 md:pt-16 lg:pt-20 text-center flex flex-col items-center">
          
          {/* Headline: “Tradition, together.” */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-normal text-[#2A1F1B] leading-[1.14] tracking-tight">
            Tradition, together.
          </h1>

          {/* Supporting line: “Gold jewellery and silver pooja pieces for meaningful moments.” */}
          <p className="mt-2 sm:mt-2.5 md:mt-3 font-sans text-xs sm:text-sm md:text-[15px] lg:text-base text-[#4E413B] leading-relaxed max-w-lg">
            Gold jewellery and silver pooja pieces for meaningful moments.
          </p>

          {/* Call to Action: “Explore All Collections” */}
          <div className="mt-3.5 sm:mt-4 md:mt-5">
            <button
              onClick={handleExplore}
              className="inline-flex items-center gap-2 bg-[#F8F4EC]/95 hover:bg-white text-[#2A1F1B] hover:text-[#651F2B] border border-[#2A1F1B]/35 hover:border-[#651F2B] text-xs sm:text-sm font-medium tracking-wide px-5 sm:px-7 py-2 sm:py-2.5 rounded-full shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group active:scale-95"
              aria-label="Explore All Collections"
            >
              <span>Explore All Collections</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C49A45] group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>

        </div>

        {/* Bottom Spacer preserving clear view of the unified ivory stone platform */}
        <div className="relative z-10 w-full pb-4 sm:pb-6 pointer-events-none" />

      </div>

    </section>
  );
}
