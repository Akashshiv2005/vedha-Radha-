import React from 'react';
import { Search, TrendingUp, MapPin, Phone, PackageCheck, Edit3 } from 'lucide-react';

export default function TopUtilityStrip({
  searchQuery,
  setSearchQuery,
  rates,
  onOpenGoldRateModal,
  onOpenStoreModal,
  onOpenContactModal,
  onOpenTrackModal
}) {
  return (
    <div className="bg-[#581923] text-[#FAF7F2] text-[11px] sm:text-[11.5px] font-sans border-b border-[#6E2430] py-1.5 px-4 sm:px-8">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
        
        {/* Left: Search input field */}
        <div className="w-full md:w-64 lg:w-72 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search jewellery..."
            aria-label="Search jewellery"
            className="w-full bg-[#48141C]/80 hover:bg-[#48141C] focus:bg-[#FAF7F2] focus:text-[#241716] focus:placeholder-[#9C8F85] text-white placeholder-[#E2D2D5] rounded px-2.5 py-1 pl-7 text-[11px] border border-[#7A2A37] focus:border-[#C5A059] focus:outline-none transition-all duration-200"
          />
          <Search className="w-3 h-3 text-[#E6C37A] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white text-[10px] cursor-pointer"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Center: Today's Gold & Silver Rate Display (Configurable Placeholders) */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center text-[10.5px] sm:text-[11.5px]">
          {/* Rate Button Trigger */}
          <button
            onClick={onOpenGoldRateModal}
            className="group flex items-center gap-1.5 bg-[#48141C]/90 hover:bg-[#3D0E15] px-2.5 py-0.5 rounded border border-[#7A2A37] hover:border-[#C5A059] transition-colors cursor-pointer text-[#FCEBD2]"
            title="Click to view or configure board rates"
          >
            <TrendingUp className="w-3 h-3 text-[#E6C37A] group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-white">Today’s Board Rate:</span>
            <span className="text-[#E6C37A]">Gold 22K/g: ₹ {rates.gold22k}</span>
            <span className="opacity-40">|</span>
            <span className="text-[#EFEAE1]">Silver/g: ₹ {rates.silver1g}</span>
            <span className="text-[9.5px] bg-[#E6C37A]/20 text-[#E6C37A] px-1 py-0.2 rounded ml-1 group-hover:bg-[#E6C37A] group-hover:text-[#581923] transition-colors">
              Update rate
            </span>
          </button>
        </div>

        {/* Right: Quick Links (Store, Contact, Track Order) */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 text-[11px] opacity-95">
          <button
            onClick={onOpenStoreModal}
            className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <MapPin className="w-3 h-3 text-[#E6C37A]" />
            <span>Store</span>
          </button>
          <span className="opacity-40">|</span>
          <button
            onClick={onOpenContactModal}
            className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Phone className="w-3 h-3 text-[#E6C37A]" />
            <span>Contact</span>
          </button>
          <span className="opacity-40">|</span>
          <button
            onClick={onOpenTrackModal}
            className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer font-medium text-[#FDF0D5]"
          >
            <PackageCheck className="w-3 h-3 text-[#E6C37A]" />
            <span>Track Order</span>
          </button>
        </div>

      </div>
    </div>
  );
}
