import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { goldCategories } from '../data/categoryData';

export default function CategoryShortcutRow() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Check scroll position to show/hide arrow buttons
  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      checkScroll();
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveCategory(null);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveCategory(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (cat) => {
    if (cat.subcategories && cat.subcategories.length > 0) {
      setActiveCategory(prev => prev?.id === cat.id ? null : cat);
    } else {
      setActiveCategory(null);
      navigate(cat.path);
    }
  };

  return (
    <section className="relative w-full bg-[#FAF7F2] border-b border-[#EAE2D5] py-4 sm:py-6 shadow-xs select-none">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 relative" ref={dropdownRef}>
        
        {/* Desktop Previous Scroll Control */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll('left')}
            className="hidden md:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 items-center justify-center rounded-full bg-white/95 border border-[#DECDBB] text-[#581923] shadow-md hover:bg-[#F3EAD3] hover:scale-105 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#581923]/30"
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
        )}

        {/* Horizontal Scrollable Category Track */}
        <div 
          ref={scrollContainerRef}
          className="flex items-center gap-4 sm:gap-6 lg:gap-8 overflow-x-auto scrollbar-none py-2 px-1 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          role="region"
          aria-label="Jewellery Category Shortcuts"
        >
          {goldCategories.map((cat) => {
            const hasSub = cat.subcategories && cat.subcategories.length > 0;
            const isOpen = activeCategory?.id === cat.id;

            return (
              <div key={cat.id} className="relative shrink-0 flex flex-col items-center">
                <button
                  onClick={() => handleCategoryClick(cat)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCategoryClick(cat);
                    }
                  }}
                  aria-expanded={hasSub ? isOpen : undefined}
                  aria-haspopup={hasSub ? "true" : undefined}
                  className="group flex flex-col items-center gap-2 focus:outline-none cursor-pointer"
                >
                  {/* Circular Image Thumbnail with Luxury Gold Rim */}
                  <div className={`relative w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-full p-[2.5px] transition-all duration-300 ${
                    isOpen 
                      ? 'bg-gradient-to-tr from-[#581923] via-[#C5A059] to-[#581923] shadow-md scale-105' 
                      : 'bg-gradient-to-tr from-[#C5A059]/40 via-[#E8DFC0] to-[#C5A059]/40 hover:from-[#581923] hover:to-[#C5A059] hover:shadow-md hover:scale-105'
                  }`}>
                    <div className="w-full h-full rounded-full overflow-hidden bg-[#FAF6EE] border border-white/60">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Category Title & Dropdown Chevron Indicator */}
                  <div className="flex items-center gap-1 text-center">
                    <span className={`text-xs sm:text-[13px] font-medium tracking-wide whitespace-nowrap transition-colors ${
                      isOpen ? 'text-[#581923] font-bold' : 'text-[#3A2E28] group-hover:text-[#581923]'
                    }`}>
                      {cat.name}
                    </span>
                    {hasSub && (
                      <ChevronDown className={`w-3.5 h-3.5 text-[#8C6D2D] transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#581923]' : 'group-hover:translate-y-0.5'
                      }`} />
                    )}
                  </div>
                </button>

                {/* Dropdown Popover Menu for Subcategories */}
                {isOpen && hasSub && (
                  <div 
                    className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-56 sm:w-64 bg-[#FAF7F2] rounded-xl shadow-2xl border border-[#DECDBB] p-3 z-40 animate-fadeIn text-xs"
                    role="menu"
                    aria-label={`${cat.name} subcategories`}
                  >
                    <div className="px-2.5 py-1.5 font-bold text-[#8C6D2D] border-b border-[#EAE2D5] text-[11px] uppercase tracking-wider flex items-center justify-between">
                      <span>{cat.name} Styles</span>
                      <span className="text-[10px] text-[#7A6E65] font-normal">{cat.subcategories.length} Types</span>
                    </div>

                    <div className="space-y-1 mt-1.5">
                      {cat.subcategories.map((sub) => (
                        <button
                          key={sub.name}
                          onClick={() => {
                            setActiveCategory(null);
                            navigate(sub.path);
                          }}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-[#F3EAD3] text-[#3A2E28] hover:text-[#581923] transition-colors flex items-center justify-between group cursor-pointer"
                          role="menuitem"
                        >
                          <span className="font-medium text-xs">{sub.name}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-[#A8988B] group-hover:text-[#581923] group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      ))}

                      {/* View All Subcategory Direct Link */}
                      <button
                        onClick={() => {
                          setActiveCategory(null);
                          navigate(cat.path);
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-lg font-bold text-[#581923] hover:bg-[#F3EAD3] border-t border-[#EAE2D5] mt-1 transition-colors flex items-center justify-between cursor-pointer"
                        role="menuitem"
                      >
                        <span>View All {cat.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#581923]" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Desktop Next Scroll Control */}
        {showRightArrow && (
          <button
            onClick={() => handleScroll('right')}
            className="hidden md:flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 items-center justify-center rounded-full bg-white/95 border border-[#DECDBB] text-[#581923] shadow-md hover:bg-[#F3EAD3] hover:scale-105 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#581923]/30"
            aria-label="Scroll categories right"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.2]" />
          </button>
        )}

      </div>
    </section>
  );
}
