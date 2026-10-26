import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronRight, TrendingUp, Sparkles, MapPin, Phone, PackageCheck, Search } from 'lucide-react';
import { goldCategories, silverCategories } from '../../data/navigationData';

export default function MobileNavDrawer({
  isOpen,
  onClose,
  activeNav,
  setActiveNav,
  rates,
  searchQuery,
  setSearchQuery,
  onOpenGoldRateModal,
  onOpenStoreModal,
  onOpenContactModal,
  onOpenTrackModal,
  onOpenCraftsmanshipModal,
  onSelectCategory
}) {
  const [openAccordion, setOpenAccordion] = useState('gold'); // 'gold' | 'silver' | null

  // Lock body scroll and handle Escape key when open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleAccordion = (type) => {
    setOpenAccordion(prev => prev === type ? null : type);
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex justify-start bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-[#FAF7F2] w-full max-w-sm h-full shadow-2xl flex flex-col justify-between border-r border-[#EAE2D5] overflow-y-auto animate-slideRight"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
      >
        {/* Top Header */}
        <div className="p-4 bg-[#581923] text-white flex items-center justify-between">
          <div>
            <span className="text-base font-bold block">Vedha Radha</span>
            <span className="text-[9.5px] text-[#E6C37A] tracking-wider uppercase">Thanga Maaligai</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
            aria-label="Close mobile navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar in Mobile Menu */}
        <div className="p-3.5 bg-[#FAF8F5] border-b border-[#EAE2D5]">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jewellery..."
              className="w-full bg-white border border-[#DECDBB] rounded px-3 py-2 pl-8 text-xs text-[#241716] placeholder-[#9C8F85] focus:outline-none focus:border-[#581923]"
            />
            <Search className="w-3.5 h-3.5 text-[#9C8F85] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Board Rate Bar */}
        <div className="px-4 py-2.5 bg-[#F4EDE0] border-b border-[#E8DFC0] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[#581923]">
            <TrendingUp className="w-3.5 h-3.5 text-[#8C6D2D]" />
            <span className="font-semibold text-[11px]">Board Rate:</span>
            <span className="text-[11px] text-[#241716]">22K: ₹ {rates.gold22k}</span>
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenGoldRateModal();
            }}
            className="text-[10px] bg-[#581923] text-white px-2 py-0.5 rounded cursor-pointer"
          >
            Update
          </button>
        </div>

        {/* Navigation Links with Accordions */}
        <div className="flex-1 p-4 space-y-1 text-sm font-medium text-[#3D332D]">
          
          {/* Home */}
          <button
            onClick={() => {
              setActiveNav('home');
              if (onSelectCategory) onSelectCategory('home');
              onClose();
            }}
            className={`w-full text-left px-3 py-2 rounded-md ${
              activeNav === 'home' ? 'bg-[#581923] text-white' : 'hover:bg-[#F3EAD3]/50'
            }`}
          >
            Home
          </button>

          {/* Gold Jewellery Accordion */}
          <div className="border border-[#E8DFC0]/70 rounded-md overflow-hidden my-1">
            <button
              onClick={() => toggleAccordion('gold')}
              className="w-full flex items-center justify-between px-3 py-2.5 bg-[#FAF8F5] text-[#48161E] font-semibold text-xs"
            >
              <span>Gold Jewellery</span>
              <ChevronDown className={`w-4 h-4 text-[#8C6D2D] transition-transform ${openAccordion === 'gold' ? 'rotate-180' : ''}`} />
            </button>

            {openAccordion === 'gold' && (
              <div className="p-2 bg-white space-y-1 border-t border-[#EAE2D5]">
                {goldCategories.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setActiveNav('gold');
                      if (onSelectCategory) onSelectCategory(item.name);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-[#52453E] hover:bg-[#F8F2E8] hover:text-[#581923] rounded text-left"
                  >
                    <span>{item.name}</span>
                    <span className="text-[10px] text-[#9C8F85]">{item.count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Silver Jewellery Accordion */}
          <div className="border border-[#E8DFC0]/70 rounded-md overflow-hidden my-1">
            <button
              onClick={() => toggleAccordion('silver')}
              className="w-full flex items-center justify-between px-3 py-2.5 bg-[#FAF8F5] text-[#48161E] font-semibold text-xs"
            >
              <span>Silver Jewellery & Articles</span>
              <ChevronDown className={`w-4 h-4 text-[#8C6D2D] transition-transform ${openAccordion === 'silver' ? 'rotate-180' : ''}`} />
            </button>

            {openAccordion === 'silver' && (
              <div className="p-2 bg-white space-y-1 border-t border-[#EAE2D5]">
                {silverCategories.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setActiveNav('silver');
                      if (onSelectCategory) onSelectCategory(item.name);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-[#52453E] hover:bg-[#F8F2E8] hover:text-[#581923] rounded text-left"
                  >
                    <span>{item.name}</span>
                    <span className="text-[10px] text-[#9C8F85]">{item.count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bridal */}
          <button
            onClick={() => {
              setActiveNav('bridal');
              if (onSelectCategory) onSelectCategory('Bridal');
              onClose();
            }}
            className={`w-full text-left px-3 py-2 rounded-md text-xs ${
              activeNav === 'bridal' ? 'bg-[#581923] text-white' : 'hover:bg-[#F3EAD3]/50'
            }`}
          >
            Bridal Collection
          </button>

          {/* Handcrafted */}
          <button
            onClick={() => {
              setActiveNav('handcrafted');
              if (onSelectCategory) onSelectCategory('Handcrafted');
              onClose();
            }}
            className={`w-full text-left px-3 py-2 rounded-md text-xs ${
              activeNav === 'handcrafted' ? 'bg-[#581923] text-white' : 'hover:bg-[#F3EAD3]/50'
            }`}
          >
            Handcrafted Heritage
          </button>

          {/* About Us */}
          <button
            onClick={() => {
              setActiveNav('about');
              onClose();
              if (onOpenStoreModal) onOpenStoreModal();
            }}
            className={`w-full text-left px-3 py-2 rounded-md text-xs ${
              activeNav === 'about' ? 'bg-[#581923] text-white' : 'hover:bg-[#F3EAD3]/50'
            }`}
          >
            About Us
          </button>

          {/* Contact */}
          <button
            onClick={() => {
              setActiveNav('contact');
              onClose();
              if (onOpenContactModal) onOpenContactModal();
            }}
            className={`w-full text-left px-3 py-2 rounded-md text-xs ${
              activeNav === 'contact' ? 'bg-[#581923] text-white' : 'hover:bg-[#F3EAD3]/50'
            }`}
          >
            Contact Showroom
          </button>

          {/* Our Craftsmanship Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenCraftsmanshipModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#F3EAD3] text-[#581923] border border-[#DECDBB] rounded text-xs font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B38E46]" />
              <span>Our Heritage Craftsmanship</span>
            </button>
          </div>

        </div>

        {/* Footer Quick Links */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#EAE2D5] space-y-2 text-xs text-[#6E5F55]">
          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
            <button
              onClick={() => {
                onClose();
                onOpenStoreModal();
              }}
              className="p-1.5 bg-white rounded border border-[#DECDBB] hover:text-[#581923]"
            >
              Showroom
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenContactModal();
              }}
              className="p-1.5 bg-white rounded border border-[#DECDBB] hover:text-[#581923]"
            >
              Support
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenTrackModal();
              }}
              className="p-1.5 bg-[#581923] text-white rounded font-medium"
            >
              Track Order
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
