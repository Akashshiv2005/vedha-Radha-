import React from 'react';
import { ArrowRight } from 'lucide-react';
import { collections } from '../data/products';

export default function ShopByCollection({ onSelectCategory }) {
  return (
    <section className="bg-[#FAF7F2] py-8 sm:py-10 border-b border-[#EAE2D5]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-5 sm:mb-6">
          <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-[#241716] tracking-tight">
            Shop by collection
          </h2>
          <span className="text-xs sm:text-[13px] text-[#73655C] font-sans">
            Discover jewellery for every occasion
          </span>
        </div>

        {/* 4 Collection Photo Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {collections.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectCategory(item.name)}
              className="group relative h-36 sm:h-44 md:h-48 lg:h-52 rounded-lg overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 border border-[#E8DFC0]/60 bg-[#2C1D18]"
            >
              {/* Background Image */}
              <img
                src={item.image}
                alt={`${item.name} Jewellery Collection`}
                className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                loading="lazy"
              />

              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-300" />

              {/* Title & Arrow */}
              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between text-white z-10">
                <span className="font-serif text-base sm:text-lg lg:text-xl font-medium tracking-wide drop-shadow-sm group-hover:text-[#F3E6CB] transition-colors">
                  {item.name}
                </span>
                <ArrowRight className="w-4 h-4 text-white/90 group-hover:text-[#F3E6CB] group-hover:translate-x-1 transition-all duration-200" />
              </div>

              {/* Top Accent Border on Hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
