import React from 'react';

/**
 * VedhaRadhaExperience
 * Premium desktop homepage experience section for Vedha Radha.
 * Features:
 *  - Warm ivory #F8F4EC background
 *  - Centered heading & subtitle in deep maroon #651F2B
 *  - Antique gold #C49A45 hairline rules with restrained teal #218F95 botanical emblem
 *  - 6 softly rounded photo tiles (3 columns x 2 rows)
 *  - Clean captions centered below each photo tile
 */
export default function VedhaRadhaExperience({ onTileClick }) {
  const experiences = [
    {
      id: 'showroom',
      title: 'Visit Our Showroom',
      image: '/images/experience/showroom.jpg',
      alt: 'Welcoming South Indian jewellery showroom with ambient lighting and curated showcases'
    },
    {
      id: 'gold-exchange',
      title: 'Gold Exchange',
      image: '/images/experience/gold_exchange.jpg',
      alt: 'Jeweller and customer discussing a gold ornament beside a traditional jewellery scale'
    },
    {
      id: 'bridal-styling',
      title: 'Bridal Styling',
      image: '/images/experience/bridal_styling.jpg',
      alt: 'South Indian bride receiving heirloom bridal jewellery styling guidance'
    },
    {
      id: 'savings-plans',
      title: 'Gold Savings Plans',
      image: '/images/experience/gold_savings.jpg',
      alt: 'Pure gold coins and handcrafted Lakshmi pendant on ivory surface beside a ledger'
    },
    {
      id: 'stories-inspiration',
      title: 'Stories & Inspiration',
      image: '/images/experience/stories.jpg',
      alt: 'Artisanal jewellery sketchbook illustration beside traditional temple gold haram'
    },
    {
      id: 'jewellery-care',
      title: 'Jewellery Care',
      image: '/images/experience/jewellery_care.jpg',
      alt: 'Careful artisan hands gently polishing a detailed gold bangle on soft cloth'
    }
  ];

  return (
    <section className="bg-[#F8F4EC] py-10 sm:py-16 lg:py-24 border-b border-[#E8DFC0]/80 select-none">
      <div className="max-w-[1360px] mx-auto px-3.5 xs:px-6 sm:px-8 lg:px-12">
        
        {/* Section Header: Centered Heading, Ornamental Motif & Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14">
          {/* Main Heading */}
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-[44px] font-normal text-[#651F2B] tracking-tight leading-[1.15]">
            The Vedha Radha Experience
          </h2>

          {/* Center Decorative Accent: Antique Gold #C49A45 lines with Restrained Teal #218F95 lotus emblem */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 my-2.5 sm:my-4">
            <span className="h-[1px] w-8 sm:w-16 bg-[#C49A45]/70" />
            
            {/* Teal Lotus/Botanical Accent */}
            <svg 
              className="w-4 h-3.5 sm:w-5 sm:h-4 text-[#218F95] shrink-0 fill-current opacity-90" 
              viewBox="0 0 24 16" 
              aria-hidden="true"
            >
              {/* Stylized Lotus Center Petal */}
              <path d="M12 1C10.5 4.5 10.5 9 12 14C13.5 9 13.5 4.5 12 1Z" />
              {/* Left Petal */}
              <path d="M10.2 4.2C7.8 6.5 6.5 10 8.5 13.5C10 11 10.8 8 10.2 4.2Z" />
              {/* Right Petal */}
              <path d="M13.8 4.2C16.2 6.5 17.5 10 15.5 13.5C14 11 13.2 8 13.8 4.2Z" />
              {/* Outer Left Leaf */}
              <path d="M6 8C3.5 9.5 2 12.5 4.5 14C6.5 12.5 7 10.5 6 8Z" />
              {/* Outer Right Leaf */}
              <path d="M18 8C20.5 9.5 22 12.5 19.5 14C17.5 12.5 17 10.5 18 8Z" />
              {/* Delicate Base Dot */}
              <circle cx="12" cy="15" r="0.9" />
            </svg>

            <span className="h-[1px] w-8 sm:w-16 bg-[#C49A45]/70" />
          </div>

          {/* Subtitle */}
          <p className="font-serif text-xs sm:text-base lg:text-[17px] text-[#651F2B]/90 font-normal leading-relaxed">
            Thoughtful moments, guided by tradition and care.
          </p>
        </div>

        {/* 6 Photo Tiles Grid: 2 Columns on mobile, 3 Columns on Tablet/Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3.5 xs:gap-x-4 sm:gap-x-8 lg:gap-x-10 gap-y-5 xs:gap-y-6 sm:gap-y-10 lg:gap-y-12">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              onClick={() => onTileClick && onTileClick(exp.id)}
              className="group flex flex-col items-center cursor-pointer"
            >
              {/* Softly Rounded Photo Tile Container with Antique Gold Frame */}
              <div className="relative w-full aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden border border-[#C49A45]/40 bg-[#FAF7F2] shadow-[0_4px_16px_rgba(101,31,43,0.06)] group-hover:shadow-[0_12px_28px_rgba(101,31,43,0.14)] group-hover:border-[#C49A45]/80 transition-all duration-300 transform group-hover:-translate-y-1">
                
                {/* Full-Color Photo */}
                <img
                  src={exp.image}
                  alt={exp.alt}
                  className="w-full h-full object-cover object-center transform group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                  loading="lazy"
                />

                {/* Subtle luxury ambient sheen */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>

              {/* Exact Caption Centered Below Photo (Not Overlaid) */}
              <h3 className="font-serif text-xs xs:text-sm sm:text-lg lg:text-[18.5px] font-medium text-[#651F2B] text-center mt-2 xs:mt-2.5 sm:mt-4 tracking-normal group-hover:text-[#8B2637] transition-colors duration-200">
                {exp.title}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
