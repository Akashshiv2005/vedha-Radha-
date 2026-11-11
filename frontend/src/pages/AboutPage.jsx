import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, MapPin, Phone, ShieldCheck } from 'lucide-react';
import AboutHeroSection from '../components/AboutHeroSection';
import OurJourney from '../components/OurJourney';
import FourPillarsSection from '../components/FourPillarsSection';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#2C2420] font-serif selection:bg-[#B38E46]/20">
      
      {/* ========================================================================= */}
      {/* 1. PANORAMIC ABOUT US HERO SECTION (Exact Match to Design)                */}
      {/* ========================================================================= */}
      <AboutHeroSection />

      {/* ========================================================================= */}
      {/* 2. OUR JOURNEY: A LEGACY OF TRUST & CRAFTSMANSHIP (Full-Width Panorama)   */}
      {/* ========================================================================= */}
      <div className="w-full">
        <OurJourney />
      </div>

      {/* ========================================================================= */}
      {/* 3. OUR FOUNDATION: THE FOUR PILLARS OF VEDHA RADHA (Wide Luxury Showcase) */}
      {/* ========================================================================= */}
      <div className="w-full max-w-[1680px] mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4">
        <div className="relative rounded-3xl shadow-2xl border-2 border-[#D8C7A5] overflow-hidden">
          <FourPillarsSection />
        </div>
      </div>

      <div className="max-w-[1360px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        {/* ========================================================================= */}
        {/* MAIN LUXURY INFOGRAPHIC POSTER CONTAINER                                 */}
        {/* ========================================================================= */}
        <div className="relative bg-[#FAF5EB] rounded-3xl shadow-2xl border border-[#D8C7A5] overflow-hidden">

          {/* ======================================================================= */}
          {/* 5. OUR PROMISE: ROYAL MAROON BANNER WITH TEMPLE GOPURAM & VILAKKU       */}
          {/* ======================================================================= */}
          <div className="relative bg-gradient-to-r from-[#380710] via-[#480B16] to-[#250308] text-white py-12 sm:py-16 px-6 sm:px-12 overflow-hidden border-t-2 border-[#D4AF37]">
            
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E5C378] to-transparent"></div>

            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              
              {/* Left Side: Temple Gopuram Silhouette Illustration */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center opacity-85">
                <img 
                  src="/images/about/temple_gopuram.png" 
                  alt="Tiruchirappalli Temple Heritage"
                  className="max-h-full max-w-full object-contain filter drop-shadow-[0_4px_12px_rgba(229,195,120,0.3)] brightness-125"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/hero_arch_temple_showcase.png';
                  }}
                />
              </div>

              {/* Center: The Sacred Brand Promise */}
              <div className="text-center space-y-3 flex-1">
                <div className="flex items-center justify-center gap-3">
                  <div className="h-[1px] w-6 bg-[#E5C378]/60"></div>
                  <span className="text-[11px] uppercase tracking-[0.3em] text-[#E5C378] font-sans font-semibold">
                    Our Promise
                  </span>
                  <div className="h-[1px] w-6 bg-[#E5C378]/60"></div>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8E7] via-[#F8DEAA] to-[#E5C378] leading-tight">
                  Every Ornament Tells a Story.<br className="hidden sm:inline" />
                  Every Relationship Deserves Trust.
                </h3>

                <div className="flex items-center justify-center gap-2 pt-1 text-[#E5C378]">
                  <div className="h-[1px] w-10 bg-[#D4AF37]/50"></div>
                  <div className="w-1.5 h-1.5 rotate-45 bg-[#E5C378]"></div>
                  <div className="h-[1px] w-10 bg-[#D4AF37]/50"></div>
                </div>

                <p className="text-xs sm:text-sm text-[#F0DFD1] font-sans tracking-wide font-light">
                  Vedha Radha Thanga Maaligai &mdash; Where Heritage Meets Trust.
                </p>

                <div className="pt-3 flex flex-wrap gap-3 justify-center font-sans">
                  <button
                    onClick={() => navigate('/contact')}
                    className="bg-[#D4AF37] hover:bg-[#E5C378] text-[#3B0710] font-bold text-xs px-6 py-2.5 rounded-full shadow-lg transition-colors cursor-pointer"
                  >
                    Visit Trichy Showroom
                  </button>
                  <button
                    onClick={() => navigate('/jewellery')}
                    className="border border-[#E5C378]/60 hover:bg-white/10 text-[#FFF3DC] text-xs px-6 py-2.5 rounded-full transition-colors cursor-pointer"
                  >
                    Browse Collections
                  </button>
                </div>
              </div>

              {/* Right Side: Traditional Brass Kuthu Vilakku Motif */}
              <div className="w-20 h-24 sm:w-24 sm:h-28 shrink-0 flex items-center justify-center opacity-85">
                <svg viewBox="0 0 64 96" fill="none" className="w-full h-full text-[#E5C378] filter drop-shadow-[0_2px_8px_rgba(255,224,130,0.5)]">
                  <path d="M32 6C34 10 37 14 37 18C37 21 34.8 23 32 23C29.2 23 27 21 27 18C27 14 30 10 32 6Z" fill="#FFF5DC" />
                  <path d="M32 9C33.5 12 35 14 35 17C35 19 33.7 20.5 32 20.5C30.3 20.5 29 19 29 17C29 14 30.5 12 32 9Z" fill="#FFB74D" />
                  <path d="M32 23V28" stroke="currentColor" strokeWidth="2.5" />
                  <path d="M18 28C18 35 46 35 46 28H18Z" fill="currentColor" />
                  <ellipse cx="32" cy="28" rx="14" ry="2.5" fill="#FFE082" />
                  <path d="M30 33V75H34V33H30Z" fill="currentColor" />
                  <circle cx="32" cy="42" r="4" fill="#FFE082" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="32" cy="58" r="5" fill="#FFE082" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M22 75H42L46 84H18L22 75Z" fill="currentColor" />
                  <rect x="14" y="84" width="36" height="4" rx="1" fill="#FFE082" stroke="currentColor" strokeWidth="1" />
                </svg>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
