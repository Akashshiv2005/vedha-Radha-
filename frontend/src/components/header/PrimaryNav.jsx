import React, { useState, useRef } from 'react';
import { ChevronDown, Sparkles, Hammer } from 'lucide-react';
import NavDropdown from './NavDropdown';
import { goldCategories, silverCategories } from '../../data/navigationData';

export default function PrimaryNav({
  activeNav,
  setActiveNav,
  onOpenCraftsmanshipModal,
  onOpenShowroom,
  onSelectCategory
}) {
  const [activeDropdown, setActiveDropdown] = useState(null); // 'gold' | 'silver' | null
  const hoverTimeoutRef = useRef(null);

  const handleMouseEnter = (menuType) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setActiveDropdown(menuType);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const toggleDropdown = (menuType) => {
    setActiveDropdown(prev => prev === menuType ? null : menuType);
  };

  return (
    <nav 
      className="hidden lg:block bg-[#FAF8F5] border-b border-[#EAE2D5] shadow-2xs relative z-30"
      aria-label="Main Navigation"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between">
          
          {/* Main Category Nav Links */}
          <div className="flex items-center gap-7 xl:gap-9 text-[13.5px] font-medium text-[#4A403A]">
            
            {/* 1. Home */}
            <button
              onClick={() => {
                setActiveNav('home');
                if (onSelectCategory) onSelectCategory('home');
              }}
              className={`relative py-3.5 transition-colors cursor-pointer ${
                activeNav === 'home' ? 'text-[#581923] font-semibold' : 'hover:text-[#581923]'
              }`}
            >
              <span>Home</span>
              {activeNav === 'home' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#581923] rounded-t-full" />
              )}
            </button>

            {/* 2. Gold Jewellery (With Dropdown) */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('gold')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => toggleDropdown('gold')}
                aria-expanded={activeDropdown === 'gold'}
                aria-haspopup="true"
                className={`flex items-center gap-1.5 py-3.5 transition-colors cursor-pointer ${
                  activeNav === 'gold' || activeDropdown === 'gold' 
                    ? 'text-[#581923] font-semibold' 
                    : 'hover:text-[#581923]'
                }`}
              >
                <span>Gold Jewellery</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'gold' ? 'rotate-180 text-[#581923]' : 'text-[#8C6D2D]'}`} />
              </button>

              <NavDropdown
                isOpen={activeDropdown === 'gold'}
                onClose={() => setActiveDropdown(null)}
                items={goldCategories}
                title="Gold Jewellery"
                subtitle="22K Traditional & Modern Heritage"
                onSelectItem={(item) => {
                  setActiveNav('gold');
                  if (onSelectCategory) onSelectCategory(item.name);
                }}
              />
            </div>

            {/* 3. Silver Jewellery (With Dropdown) */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('silver')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => toggleDropdown('silver')}
                aria-expanded={activeDropdown === 'silver'}
                aria-haspopup="true"
                className={`flex items-center gap-1.5 py-3.5 transition-colors cursor-pointer ${
                  activeNav === 'silver' || activeDropdown === 'silver' 
                    ? 'text-[#581923] font-semibold' 
                    : 'hover:text-[#581923]'
                }`}
              >
                <span>Silver Jewellery</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'silver' ? 'rotate-180 text-[#581923]' : 'text-[#8C6D2D]'}`} />
              </button>

              <NavDropdown
                isOpen={activeDropdown === 'silver'}
                onClose={() => setActiveDropdown(null)}
                items={silverCategories}
                title="Silver Articles & Jewellery"
                subtitle="92.5 Sterling Silver & Pooja Articles"
                onSelectItem={(item) => {
                  setActiveNav('silver');
                  if (onSelectCategory) onSelectCategory(item.name);
                }}
              />
            </div>

            {/* 4. Bridal */}
            <button
              onClick={() => {
                setActiveNav('bridal');
                if (onSelectCategory) onSelectCategory('Bridal');
              }}
              className={`relative py-3.5 transition-colors cursor-pointer ${
                activeNav === 'bridal' ? 'text-[#581923] font-semibold' : 'hover:text-[#581923]'
              }`}
            >
              <span>Bridal</span>
              {activeNav === 'bridal' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#581923] rounded-t-full" />
              )}
            </button>

            {/* 5. Handcrafted */}
            <button
              onClick={() => {
                setActiveNav('handcrafted');
                if (onSelectCategory) onSelectCategory('Handcrafted');
              }}
              className={`relative py-3.5 transition-colors cursor-pointer ${
                activeNav === 'handcrafted' ? 'text-[#581923] font-semibold' : 'hover:text-[#581923]'
              }`}
            >
              <span>Handcrafted</span>
              {activeNav === 'handcrafted' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#581923] rounded-t-full" />
              )}
            </button>

            {/* 6. About Us */}
            <button
              onClick={() => {
                setActiveNav('about');
                if (onOpenShowroom) onOpenShowroom();
              }}
              className={`relative py-3.5 transition-colors cursor-pointer ${
                activeNav === 'about' ? 'text-[#581923] font-semibold' : 'hover:text-[#581923]'
              }`}
            >
              <span>About Us</span>
              {activeNav === 'about' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#581923] rounded-t-full" />
              )}
            </button>

            {/* 7. Contact */}
            <button
              onClick={() => {
                setActiveNav('contact');
                if (onOpenShowroom) onOpenShowroom();
              }}
              className={`relative py-3.5 transition-colors cursor-pointer ${
                activeNav === 'contact' ? 'text-[#581923] font-semibold' : 'hover:text-[#581923]'
              }`}
            >
              <span>Contact</span>
              {activeNav === 'contact' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#581923] rounded-t-full" />
              )}
            </button>

          </div>

          {/* Distinct "Our Craftsmanship" Link / Button */}
          <div className="flex items-center">
            <button
              onClick={onOpenCraftsmanshipModal}
              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-[#F3EAD3] text-[#581923] hover:bg-[#581923] hover:text-white border border-[#DFCDB7] transition-all duration-200 cursor-pointer shadow-2xs group"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B38E46] group-hover:text-[#E6C37A] transition-colors" />
              <span>Our Craftsmanship</span>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}
