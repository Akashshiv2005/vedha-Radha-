import React from 'react';
import { MapPin, ChevronDown } from 'lucide-react';

export default function AnnouncementBar({ onOpenShowroom }) {
  return (
    <div className="bg-[#581923] text-[#F3E6E8] text-[11px] sm:text-[12px] font-sans py-1.5 px-4 sm:px-8 border-b border-[#6E2430]">
      <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-4">
        {/* Left message */}
        <div className="flex items-center gap-1.5 tracking-wide text-center sm:text-left opacity-95">
          <MapPin className="w-3.5 h-3.5 text-[#E6C37A] shrink-0" />
          <span>
            Trusted by families since generations <span className="mx-1.5 opacity-60">|</span> Quality. Purity. Lasting Value.
          </span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3 sm:gap-4 tracking-wide text-[11px] sm:text-[12px] opacity-90">
          <button 
            onClick={onOpenShowroom} 
            className="hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Our Showroom
          </button>
          <span className="opacity-40">|</span>
          <button 
            onClick={() => alert('Vedha Radha Concierge & Support: +91 44 2834 1999 (Available 9:30 AM - 8:30 PM IST)')} 
            className="hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Customer Support
          </button>
          <span className="opacity-40">|</span>
          <div className="flex items-center gap-0.5 cursor-pointer hover:text-white transition-colors">
            <span>EN</span>
            <ChevronDown className="w-3 h-3 text-[#E6C37A]" />
          </div>
        </div>
      </div>
    </div>
  );
}
