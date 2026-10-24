import React from 'react';
import { User, ShoppingBag, Menu, X, Sparkles } from 'lucide-react';

export default function BrandRow({
  cartCount,
  onOpenCart,
  onOpenAccount,
  mobileMenuOpen,
  setMobileMenuOpen
}) {
  return (
    <div className="bg-[#FAF7F2] border-b border-[#EAE2D5] py-3.5 sm:py-4 px-4 sm:px-8">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
        
        {/* Left Placeholder / Mobile Menu Toggle (keeps brand centered on desktop) */}
        <div className="flex items-center gap-2 lg:w-48">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-[#48161E] hover:bg-[#F3EAD3]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#581923]"
            aria-label="Toggle mobile navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Center: Brand Emblem, Shop Name & Tagline */}
        <a 
          href="#" 
          className="flex flex-col items-center text-center group cursor-pointer"
          aria-label="Vedha Radha Thanga Maaligai Home"
        >
          {/* Gold Floral / Temple Emblem */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 text-[#B38E46] transition-transform duration-300 group-hover:scale-105 mb-0.5">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xs">
              <path d="M50 8 C30 25 15 45 15 65 C15 82 30 92 50 92 C70 92 85 82 85 65 C85 45 70 25 50 8 Z" stroke="#B38E46" strokeWidth="2" strokeOpacity="0.3" fill="#F4EFE6" fillOpacity="0.5" />
              <path d="M50 15 C45 35 38 52 50 72 C62 52 55 35 50 15 Z" fill="#C5A059" stroke="#8C6D2D" strokeWidth="1.5" />
              <path d="M50 72 C32 68 22 55 24 40 C34 46 44 58 50 72 Z" fill="#D7BA72" stroke="#8C6D2D" strokeWidth="1.2" />
              <path d="M50 72 C68 68 78 55 76 40 C66 46 56 58 50 72 Z" fill="#D7BA72" stroke="#8C6D2D" strokeWidth="1.2" />
              <path d="M50 72 C26 78 18 68 18 58 C28 58 40 64 50 72 Z" fill="#B38E46" stroke="#735724" strokeWidth="1" />
              <path d="M50 72 C74 78 82 68 82 58 C72 58 60 64 50 72 Z" fill="#B38E46" stroke="#735724" strokeWidth="1" />
              <circle cx="50" cy="14" r="3" fill="#735724" />
              <path d="M30 76 C40 82 60 82 70 76 C65 85 35 85 30 76 Z" fill="#8C6D2D" />
              <circle cx="50" cy="52" r="2.5" fill="#581923" />
            </svg>
          </div>

          {/* Shop Name */}
          <span className="font-serif text-[21px] sm:text-[25px] md:text-[27px] font-bold tracking-tight text-[#48161E] group-hover:text-[#581923] transition-colors leading-tight">
            Vedha Radha Thanga Maaligai
          </span>

          {/* Tagline */}
          <span className="text-[8.5px] sm:text-[9.5px] font-medium tracking-[0.28em] text-[#8C6D2D] uppercase mt-0.5">
            GOLD &bull; SILVER &bull; FOR EVERY GENERATION
          </span>
        </a>

        {/* Right: Account & Cart Controls */}
        <div className="flex items-center justify-end gap-3 sm:gap-4 lg:w-48">
          {/* Account Icon */}
          <button
            onClick={onOpenAccount}
            className="flex items-center gap-1.5 p-1.5 text-[#48161E] hover:text-[#8C6D2D] rounded-full hover:bg-[#F3EAD3]/40 transition-colors cursor-pointer group"
            aria-label="My Account and Privilege Club"
            title="Account & Sign-In"
          >
            <User className="w-5 h-5 stroke-[1.75]" />
            <span className="hidden sm:inline text-xs font-medium text-[#48161E] group-hover:text-[#8C6D2D]">
              Sign In
            </span>
          </button>

          {/* Cart Icon with Counter Badge */}
          <button
            onClick={onOpenCart}
            className="relative p-1.5 text-[#48161E] hover:text-[#8C6D2D] rounded-full hover:bg-[#F3EAD3]/40 transition-colors cursor-pointer group"
            aria-label={`Shopping bag containing ${cartCount} items`}
            title="Reserved Jewellery Bag"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
            <span className="absolute -top-0.5 -right-0.5 bg-[#581923] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              {cartCount}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}
