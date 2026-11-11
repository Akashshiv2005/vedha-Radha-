import React from 'react';
import { Gem, Award, RefreshCw, Truck, ShieldCheck } from 'lucide-react';

export default function AssuranceStrip() {
  const assurances = [
    {
      id: 'hallmark',
      icon: Gem,
      title: 'BIS Hallmarked',
      subtitle: 'Purity Assured',
    },
    {
      id: 'certified',
      icon: Award,
      title: 'Certified Jewellery',
      subtitle: 'Quality You Trust',
    },
    {
      id: 'exchange',
      icon: RefreshCw,
      title: 'Easy Exchange',
      subtitle: 'Hassle-Free',
    },
    {
      id: 'delivery',
      icon: Truck,
      title: 'Secure Delivery',
      subtitle: 'Across India',
    },
    {
      id: 'trusted',
      icon: ShieldCheck,
      title: 'Trusted Since 2010',
      subtitle: 'Timeless Integrity',
    },
  ];

  return (
    <section className="relative z-20 -mt-2 sm:-mt-3 w-full select-none">
      {/* Royal Heritage Plaque Ribbon - Full Bleed Width Utilizing Entire Screen Space */}
      <div className="relative w-full bg-gradient-to-b from-[#FFF4DD] via-[#FFF9EE] to-[#F7E9C7] border-y-2 border-[#C69A38] shadow-[0_8px_30px_rgba(198,154,56,0.28)] py-3 sm:py-3.5 px-3 sm:px-6 xl:px-12 overflow-visible">
        
        {/* Top & Bottom Inner Golden Highlight Accent Lines running edge to edge */}
        <div className="absolute top-[2px] inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/80 to-transparent pointer-events-none" />
        <div className="absolute bottom-[2px] inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/80 to-transparent pointer-events-none" />

        {/* Top Center Golden Diamond Stud with Ruby Core */}
        <div className="absolute -top-[7px] left-1/2 -translate-x-1/2 pointer-events-none z-20 flex items-center justify-center">
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 drop-shadow-xs" fill="none">
            <path d="M8 0 L15 8 L8 16 L1 8 Z" fill="#CCA44C" stroke="#FFE29A" strokeWidth="0.8" />
            <circle cx="8" cy="8" r="2.2" fill="#8B0018" />
            <circle cx="8" cy="8" r="0.75" fill="#FFFFFF" opacity="0.85" />
          </svg>
        </div>

        {/* Bottom Center Golden Diamond Stud with Ruby Core */}
        <div className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 pointer-events-none z-20 flex items-center justify-center">
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 drop-shadow-xs" fill="none">
            <path d="M8 0 L15 8 L8 16 L1 8 Z" fill="#CCA44C" stroke="#FFE29A" strokeWidth="0.8" />
            <circle cx="8" cy="8" r="2.2" fill="#8B0018" />
            <circle cx="8" cy="8" r="0.75" fill="#FFFFFF" opacity="0.85" />
          </svg>
        </div>

        {/* Left Ornate Maroon Corner with Golden Filigree (Flush to left screen edge) */}
        <div className="absolute top-0 left-0 pointer-events-none hidden xl:block z-10">
          <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none">
            <defs>
              <linearGradient id="cornerMaroonAssuranceL" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#43070E" />
                <stop offset="70%" stopColor="#540B16" />
                <stop offset="100%" stopColor="#6B1020" />
              </linearGradient>
              <linearGradient id="leafGoldAssuranceL" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF2B8" />
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#A07818" />
              </linearGradient>
            </defs>
            <path d="M0 0 H36 C28 8 18 18 12 28 C9 33 6 38 0 44 V0 Z" fill="url(#cornerMaroonAssuranceL)" />
            <path d="M38 0 C30 9 20 20 14 30 C10 35 7 40 0 46" stroke="url(#leafGoldAssuranceL)" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="12" cy="12" r="1.6" fill="url(#leafGoldAssuranceL)" />
            <path d="M12 7 C13 9 13 10 12 10.5 C11 10 11 9 12 7 Z" fill="url(#leafGoldAssuranceL)" />
            <path d="M12 17 C13 15 13 14 12 13.5 C11 14 11 15 12 17 Z" fill="url(#leafGoldAssuranceL)" />
            <path d="M7 12 C9 11 10 11 10.5 12 C10 13 9 13 7 12 Z" fill="url(#leafGoldAssuranceL)" />
            <path d="M17 12 C15 11 14 11 13.5 12 C14 13 15 13 17 12 Z" fill="url(#leafGoldAssuranceL)" />
          </svg>
        </div>

        {/* Right Ornate Maroon Corner with Golden Filigree (Flush to right screen edge) */}
        <div className="absolute top-0 right-0 pointer-events-none hidden xl:block z-10 scale-x-[-1]">
          <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none">
            <defs>
              <linearGradient id="cornerMaroonAssuranceR" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#43070E" />
                <stop offset="70%" stopColor="#540B16" />
                <stop offset="100%" stopColor="#6B1020" />
              </linearGradient>
              <linearGradient id="leafGoldAssuranceR" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF2B8" />
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#A07818" />
              </linearGradient>
            </defs>
            <path d="M0 0 H36 C28 8 18 18 12 28 C9 33 6 38 0 44 V0 Z" fill="url(#cornerMaroonAssuranceR)" />
            <path d="M38 0 C30 9 20 20 14 30 C10 35 7 40 0 46" stroke="url(#leafGoldAssuranceR)" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="12" cy="12" r="1.6" fill="url(#leafGoldAssuranceR)" />
            <path d="M12 7 C13 9 13 10 12 10.5 C11 10 11 9 12 7 Z" fill="url(#leafGoldAssuranceR)" />
            <path d="M12 17 C13 15 13 14 12 13.5 C11 14 11 15 12 17 Z" fill="url(#leafGoldAssuranceR)" />
            <path d="M7 12 C9 11 10 11 10.5 12 C10 13 9 13 7 12 Z" fill="url(#leafGoldAssuranceR)" />
            <path d="M17 12 C15 11 14 11 13.5 12 C14 13 15 13 17 12 Z" fill="url(#leafGoldAssuranceR)" />
          </svg>
        </div>

        {/* 5 Assurances Row - Generously Spaced Utilizing Left & Right Space */}
        <div className="max-w-[1680px] mx-auto flex flex-wrap lg:flex-nowrap items-center justify-between gap-3 sm:gap-4 md:gap-6 px-2 sm:px-6 xl:px-12">
          {assurances.map((item, idx) => {
            const Icon = item.icon;
            return (
              <React.Fragment key={item.id}>
                {/* Assurance Card */}
                <div className="flex items-center gap-3 sm:gap-3.5 flex-1 min-w-[180px] sm:min-w-[210px] justify-start lg:justify-center group">
                  
                  {/* Fluted Royal Maroon Medallion Seal */}
                  <div className="relative w-11 h-11 sm:w-12 sm:h-12 shrink-0 flex items-center justify-center transition-transform group-hover:scale-105">
                    {/* Scalloped Medallion SVG */}
                    <svg viewBox="0 0 48 48" className="absolute inset-0 w-full h-full drop-shadow-sm" fill="none">
                      <defs>
                        <radialGradient id={`sealGradFull-${idx}`} cx="40%" cy="35%" r="70%">
                          <stop offset="0%" stopColor="#681220" />
                          <stop offset="65%" stopColor="#4A0812" />
                          <stop offset="100%" stopColor="#2E040B" />
                        </radialGradient>
                      </defs>
                      {/* 12-lobed scalloped perimeter */}
                      <path
                        d="M24 2 C26 2 27.5 4 29.5 4 C31.5 4 33 2.5 35 3.5 C37 4.5 37.5 6.5 39.5 8 C41.5 9.5 43.5 10 44.5 12 C45.5 14 44.5 16 45 18 C45.5 20 47.5 21.5 47.5 24 C47.5 26.5 45.5 28 45 30 C44.5 32 45.5 34 44.5 36 C43.5 38 41.5 38.5 39.5 40 C37.5 41.5 37 43.5 35 44.5 C33 45.5 31.5 44 29.5 44 C27.5 44 26 46 24 46 C22 46 20.5 44 18.5 44 C16.5 44 15 45.5 13 44.5 C11 43.5 10.5 41.5 8.5 40 C6.5 38.5 4.5 38 3.5 36 C2.5 34 3.5 32 3 30 C2.5 28 0.5 26.5 0.5 24 C0.5 21.5 2.5 20 3 18 C3.5 16 2.5 14 3.5 12 C4.5 10 6.5 9.5 8.5 8 C10.5 6.5 11 4.5 13 3.5 C15 2.5 16.5 4 18.5 4 C20.5 4 22 2 24 2 Z"
                        fill={`url(#sealGradFull-${idx})`}
                        stroke="#D4AF37"
                        strokeWidth="1.2"
                      />
                      <circle cx="24" cy="24" r="17" stroke="#CCA44C" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
                    </svg>

                    {/* Radiant Golden Icon */}
                    <Icon className="relative z-10 w-5 h-5 text-[#FFDC73] stroke-[1.85]" />
                  </div>

                  {/* Typography matching reference */}
                  <div className="min-w-0">
                    <h4 
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      className="text-[13px] sm:text-[14px] xl:text-[14.5px] font-bold text-[#540B16] leading-tight truncate tracking-tight"
                    >
                      {item.title}
                    </h4>
                    <p className="text-[11px] sm:text-[11.5px] text-[#7A6A65] font-sans font-medium mt-0.5 truncate">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                {/* Delicate Golden 4-point Diamond Star Divider */}
                {idx < assurances.length - 1 && (
                  <div className="hidden lg:flex items-center justify-center px-1 text-[#CCA44C] shrink-0" aria-hidden="true">
                    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="currentColor">
                      <path d="M8 1 L9.5 6.5 L15 8 L9.5 9.5 L8 15 L6.5 9.5 L1 8 L6.5 6.5 Z" />
                      <circle cx="8" cy="8" r="1.2" fill="#FFF2B8" />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

      </div>
    </section>
  );
}
