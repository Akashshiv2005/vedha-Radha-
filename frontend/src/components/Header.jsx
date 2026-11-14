import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Search,
  Heart,
  ShoppingBag,
  Calendar,
  ChevronDown,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import BookAppointmentModal from './BookAppointmentModal';
import TrackOrderModal from './header/TrackOrderModal';
import GoldRateModal from './header/GoldRateModal';
import { usePreciousRates } from '../hooks/usePreciousRates';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import {
  collectionsNavItems
} from '../data/navigationData';

export default function Header({
  searchQuery = '',
  setSearchQuery = () => {},
  cartCount = 0,
  wishlistCount = 0,
  onOpenCart = () => {},
  onOpenAccount = () => {},
  onOpenWishlist = () => {}
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { customer, isAuthenticated } = useCustomerAuth();

  const {
    rates,
    status,
    isLoading,
    disclaimer
  } = usePreciousRates();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'collections' | 'jewellery' | 'about' | null
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isGoldRateModalOpen, setIsGoldRateModalOpen] = useState(false);
  const [isContactInView, setIsContactInView] = useState(false);

  const dropdownRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const searchInputRef = useRef(null);

  const currentPath = location.pathname;
  const isContact = currentPath === '/contact' || (currentPath === '/' && isContactInView);
  const isHome = currentPath === '/' && !isContact;
  const isBridal = currentPath === '/bridal' || currentPath.startsWith('/bridal');
  const isDiamonds = currentPath === '/diamonds' || currentPath === '/diamond';
  const isCollections = currentPath.startsWith('/collections');
  const isSilverPooja = currentPath === '/silver-pooja' || currentPath.startsWith('/silver-pooja');
  const isJewellery = (currentPath.startsWith('/gold') || currentPath.startsWith('/jewellery') || currentPath === '/coins-bars' || (currentPath.startsWith('/silver') && !isSilverPooja));
  const isOffers = currentPath === '/offers' || currentPath.startsWith('/offers');
  const isAbout = currentPath === '/about' || currentPath === '/jewellery-care' || currentPath === '/temple-heritage';

  const scrollToContactSection = () => {
    const el = document.getElementById('contact-concierge');
    if (el) {
      const headerOffset = 90;
      const targetY = Math.round(el.getBoundingClientRect().top + window.pageYOffset - headerOffset);
      window.scrollTo({
        top: Math.max(0, targetY),
        behavior: 'smooth'
      });
      return true;
    }
    return false;
  };

  const handleContactClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (mobileMenuOpen) setMobileMenuOpen(false);

    setIsContactInView(true);

    if (location.pathname === '/') {
      scrollToContactSection();
      if (window.location.hash !== '#contact-concierge') {
        navigate('/#contact-concierge', { replace: true });
      }
    } else {
      navigate('/#contact-concierge');
    }
  };

  const handleHomeClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (mobileMenuOpen) setMobileMenuOpen(false);

    setIsContactInView(false);

    if (location.pathname === '/') {
      if (window.location.hash) {
        navigate('/', { replace: true });
      }
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      navigate('/');
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // High-performance IntersectionObserver to detect Contact section in view without scroll listener reflows
  useEffect(() => {
    if (location.pathname !== '/') {
      setIsContactInView(false);
      return;
    }

    const el = document.getElementById('contact-concierge');
    if (!el) {
      setIsContactInView(false);
      return;
    }

    if (location.hash === '#contact-concierge') {
      setIsContactInView(true);
      setTimeout(() => {
        scrollToContactSection();
      }, 100);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        setIsContactInView(inView);
        if (inView) {
          if (window.location.hash !== '#contact-concierge') {
            window.history.replaceState(null, '', '/#contact-concierge');
          }
        } else {
          if (window.location.hash === '#contact-concierge') {
            window.history.replaceState(null, '', window.location.pathname);
          }
        }
      },
      {
        rootMargin: '-90px 0px -40% 0px',
        threshold: 0.05
      }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [location.pathname, location.hash]);

  const getNavLinkClass = (isActive) =>
    `px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
      isActive
        ? 'bg-[#540B16] text-[#FAF5EE] shadow-[0_2px_8px_rgba(84,11,22,0.35)]'
        : 'text-[#2C221E] hover:text-[#581923] hover:bg-[#F6EFE6]'
    }`;

  const handleMouseEnter = (menu) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  // Close dropdowns on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setIsSearchOpen(false);
  }, [location.pathname, location.search]);

  // Focus search input when open
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/gold');
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full select-none font-sans bg-[#FAF7F2]">
      {/* ========================================================================= */}
      {/* 1. TOP UTILITY STRIP (Deep Maroon #4E0C16)                                */}
      {/* ========================================================================= */}
      <div className="bg-[#4E0C16] text-[#EAD8D8] text-[11px] sm:text-[12px] border-b border-[#631422] px-3 sm:px-6 lg:px-8 py-1.5">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-3">
          
          {/* Left: Location & Contact Phone */}
          <div className="flex items-center gap-2 sm:gap-4 text-[#F4EBE8] text-xs font-normal">
            <div className="flex items-center gap-1.5 hover:text-white transition-colors">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span className="tracking-wide">Trichy, Tamil Nadu</span>
            </div>
            <span className="text-[#842737] hidden xs:inline">|</span>
            <a
              href="tel:+919876543210"
              className="hidden xs:flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span>+91 98765 43210</span>
            </a>
          </div>

          {/* Center: Benchmark Rate Pill (Responsive) */}
          <div className="hidden md:flex items-center justify-center">
            <button
              onClick={() => setIsGoldRateModalOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#3B070F] text-[#F3EAD3] border border-[#D4AF37]/50 text-[11px] hover:border-[#D4AF37] transition-all cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Gold (22K): <strong>₹{rates.gold22k}/g</strong></span>
              <span className="text-[#842737]">|</span>
              <span>Silver: <strong>₹{rates.silver1g}/g</strong></span>
            </button>
          </div>

          {/* Right: Track Order | Wishlist | Login / Sign Up */}
          <div className="flex items-center gap-2.5 sm:gap-4 text-xs text-[#EAD8D8]">
            <button
              onClick={() => setIsTrackOrderOpen(true)}
              className="hover:text-white transition-colors cursor-pointer text-[11.5px] sm:text-xs"
            >
              Track Order
            </button>
            <span className="text-[#842737]">|</span>
            <button
              onClick={onOpenWishlist}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-[11.5px] sm:text-xs"
            >
              <Heart className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="bg-[#D4AF37] text-[#4E0C16] text-[9.5px] font-bold px-1.5 rounded-full ml-0.5">
                  {wishlistCount}
                </span>
              )}
            </button>
            <span className="text-[#842737]">|</span>
            <button
              onClick={onOpenAccount}
              className="hover:text-white transition-colors cursor-pointer font-medium text-[11.5px] sm:text-xs"
            >
              {isAuthenticated ? (customer?.customer_name?.split(' ')[0] || 'My Account') : 'Login / Sign Up'}
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ROYAL HERITAGE NAV RIBBON WITH RUBY DROPLET & ORNATE CORNERS           */}
      {/* ========================================================================= */}
      <div className="relative w-full bg-gradient-to-b from-[#FFF5DE] via-[#FFF9EE] to-[#F7EAC7] border-b border-[#CCA44C] shadow-[0_4px_24px_rgba(202,164,76,0.18)]">
        
        {/* Top Inner Golden Highlight Line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-[#CCA44C] via-[#FCE39E] to-[#CCA44C] pointer-events-none" />

        {/* Left Ornate Maroon Corner with Golden Filigree Blossom */}
        <div className="absolute top-0 left-0 pointer-events-none hidden xl:block z-20">
          <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none">
            <defs>
              <linearGradient id="cornerMaroonL" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#43070E" />
                <stop offset="65%" stopColor="#540B16" />
                <stop offset="100%" stopColor="#6B1020" />
              </linearGradient>
              <linearGradient id="leafGoldL" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF2B8" />
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#A07818" />
              </linearGradient>
            </defs>
            {/* Corner Maroon Shield */}
            <path d="M0 0 H50 C38 10 25 24 17 38 C13 44 8 49 0 54 V0 Z" fill="url(#cornerMaroonL)" />
            {/* Double Golden Inset Arc */}
            <path d="M52 0 C40 11 27 25 19 40 C15 46 10 51 0 56" stroke="url(#leafGoldL)" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M56 0 C44 12 31 27 23 42 C19 48 14 53 2 58" stroke="url(#leafGoldL)" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />
            {/* Golden Floral Blossom & Vines */}
            <circle cx="16" cy="16" r="2.2" fill="url(#leafGoldL)" />
            <path d="M16 10 C17.2 12.5 17.2 13.5 16 14 C14.8 13.5 14.8 12.5 16 10 Z" fill="url(#leafGoldL)" />
            <path d="M16 22 C17.2 19.5 17.2 18.5 16 18 C14.8 18.5 14.8 19.5 16 22 Z" fill="url(#leafGoldL)" />
            <path d="M10 16 C12.5 14.8 13.5 14.8 14 16 C13.5 17.2 12.5 17.2 10 16 Z" fill="url(#leafGoldL)" />
            <path d="M22 16 C19.5 14.8 18.5 14.8 18 16 C18.5 17.2 19.5 17.2 22 16 Z" fill="url(#leafGoldL)" />
            <path d="M12 12 C13.5 13 14 13.8 14.2 14.5 C13.5 14.5 12.8 14 12 12 Z" fill="url(#leafGoldL)" />
            <path d="M20 12 C18.5 13 18 13.8 17.8 14.5 C18.5 14.5 19.2 14 20 12 Z" fill="url(#leafGoldL)" />
            {/* Botanical Tendrils */}
            <path d="M8 8 C10 11 12 11 14 10" stroke="url(#leafGoldL)" strokeWidth="0.9" fill="none" />
            <path d="M8 24 C10 21 12 21 14 22" stroke="url(#leafGoldL)" strokeWidth="0.9" fill="none" />
            <circle cx="7" cy="8" r="1.1" fill="url(#leafGoldL)" />
            <circle cx="7" cy="24" r="1.1" fill="url(#leafGoldL)" />
            <circle cx="28" cy="7" r="1.2" fill="url(#leafGoldL)" />
            {/* Terminal Golden Curl below corner */}
            <path d="M0 56 C6 54 11 58 12 62 C12.5 64 11 66 9 65 C7 64 7 62 9 61" stroke="url(#leafGoldL)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </svg>
        </div>

        {/* Right Ornate Maroon Corner with Golden Filigree Blossom (Mirrored) */}
        <div className="absolute top-0 right-0 pointer-events-none hidden xl:block z-20 scale-x-[-1]">
          <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none">
            <defs>
              <linearGradient id="cornerMaroonR" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#43070E" />
                <stop offset="65%" stopColor="#540B16" />
                <stop offset="100%" stopColor="#6B1020" />
              </linearGradient>
              <linearGradient id="leafGoldR" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF2B8" />
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#A07818" />
              </linearGradient>
            </defs>
            <path d="M0 0 H50 C38 10 25 24 17 38 C13 44 8 49 0 54 V0 Z" fill="url(#cornerMaroonR)" />
            <path d="M52 0 C40 11 27 25 19 40 C15 46 10 51 0 56" stroke="url(#leafGoldR)" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M56 0 C44 12 31 27 23 42 C19 48 14 53 2 58" stroke="url(#leafGoldR)" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />
            <circle cx="16" cy="16" r="2.2" fill="url(#leafGoldR)" />
            <path d="M16 10 C17.2 12.5 17.2 13.5 16 14 C14.8 13.5 14.8 12.5 16 10 Z" fill="url(#leafGoldR)" />
            <path d="M16 22 C17.2 19.5 17.2 18.5 16 18 C14.8 18.5 14.8 19.5 16 22 Z" fill="url(#leafGoldR)" />
            <path d="M10 16 C12.5 14.8 13.5 14.8 14 16 C13.5 17.2 12.5 17.2 10 16 Z" fill="url(#leafGoldR)" />
            <path d="M22 16 C19.5 14.8 18.5 14.8 18 16 C18.5 17.2 19.5 17.2 22 16 Z" fill="url(#leafGoldR)" />
            <path d="M12 12 C13.5 13 14 13.8 14.2 14.5 C13.5 14.5 12.8 14 12 12 Z" fill="url(#leafGoldR)" />
            <path d="M20 12 C18.5 13 18 13.8 17.8 14.5 C18.5 14.5 19.2 14 20 12 Z" fill="url(#leafGoldR)" />
            <path d="M8 8 C10 11 12 11 14 10" stroke="url(#leafGoldR)" strokeWidth="0.9" fill="none" />
            <path d="M8 24 C10 21 12 21 14 22" stroke="url(#leafGoldR)" strokeWidth="0.9" fill="none" />
            <circle cx="7" cy="8" r="1.1" fill="url(#leafGoldR)" />
            <circle cx="7" cy="24" r="1.1" fill="url(#leafGoldR)" />
            <circle cx="28" cy="7" r="1.2" fill="url(#leafGoldR)" />
            <path d="M0 56 C6 54 11 58 12 62 C12.5 64 11 66 9 65 C7 64 7 62 9 61" stroke="url(#leafGoldR)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </svg>
        </div>

        {/* Main Ribbon Content Container */}
        <div className="relative max-w-[1440px] mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 xl:px-14 py-1 sm:py-1.5 flex items-center justify-between gap-2 sm:gap-4 overflow-visible">

            {/* Left: Mobile Hamburger + Brand Logo */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 xl:pl-4">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-1.5 -ml-1 text-[#4E0C16] hover:bg-[#F6EFE6] rounded-lg transition-colors cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Official Brand Logo (Sleek Compact Size) */}
              <Link to="/" onClick={handleHomeClick} className="flex items-center gap-2 group cursor-pointer py-0.5">
                <img 
                  src="/images/vedha_radha_official_logo.png" 
                  alt="Vedha Radha Thangha Maalighai" 
                  className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
            </div>

            {/* Delicate Golden Divider Line between Brand and Nav */}
            <div className="hidden lg:block h-6 w-[1px] bg-[#CCA44C]/60 mx-1 xl:mx-2 shrink-0" />

            {/* Center: Desktop Navigation Bar with exact typography & layout */}
            <nav
              ref={dropdownRef}
              className="hidden lg:flex items-center gap-2 xl:gap-3.5 text-[13px] xl:text-[13.5px] font-medium text-[#2C221E]"
              aria-label="Main Navigation"
            >
              {/* Home */}
              <div className="relative inline-flex items-center">
                <Link
                  to="/"
                  onClick={handleHomeClick}
                  className={getNavLinkClass(isHome)}
                >
                  Home
                </Link>
                {isHome && (
                  <span 
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#540B16] pointer-events-none z-10" 
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Collections ⌵ */}
              <div
                className="relative inline-flex items-center"
                onMouseEnter={() => handleMouseEnter('collections')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => navigate('/collections')}
                  className={getNavLinkClass(isCollections)}
                >
                  <span>Collections</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isCollections ? 'text-[#FAF5EE]' : activeDropdown === 'collections' ? 'rotate-180 text-[#581923]' : 'text-[#CCA44C]'}`} />
                </button>
                {isCollections && (
                  <span 
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#540B16] pointer-events-none z-10" 
                    aria-hidden="true"
                  />
                )}

                {activeDropdown === 'collections' && (
                  <div className="absolute top-full left-0 mt-3 w-72 bg-[#FAF7F2] rounded-2xl shadow-xl border border-[#DECDBB] p-3 z-50 animate-fadeIn text-xs">
                    <div className="px-3 py-1.5 font-bold text-[#8C6D2D] border-b border-[#EAE2D5] text-[11px] uppercase tracking-wider">
                      Curated Collections
                    </div>
                    <div className="space-y-1 mt-2">
                      {collectionsNavItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-white transition-all text-[#2C2420] hover:text-[#581923]"
                        >
                          <span className="font-medium">{item.name}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Jewellery ⌵ */}
              <div
                className="relative inline-flex items-center"
                onMouseEnter={() => handleMouseEnter('jewellery')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => navigate('/gold')}
                  className={getNavLinkClass(isJewellery)}
                >
                  <span>Jewellery</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isJewellery ? 'text-[#FAF5EE]' : activeDropdown === 'jewellery' ? 'rotate-180 text-[#581923]' : 'text-[#CCA44C]'}`} />
                </button>
                {isJewellery && (
                  <span 
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#540B16] pointer-events-none z-10" 
                    aria-hidden="true"
                  />
                )}

                {activeDropdown === 'jewellery' && (
                  <div className="absolute top-full left-0 mt-3 w-64 bg-[#FAF7F2] rounded-2xl shadow-xl border border-[#DECDBB] p-3 z-50 animate-fadeIn text-xs space-y-1">
                    <Link
                      to="/gold"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-white font-medium text-[#2C2420] hover:text-[#581923]"
                    >
                      <span>22K Gold Jewellery</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
                    </Link>
                    <Link
                      to="/diamonds"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-white font-medium text-[#2C2420] hover:text-[#581923]"
                    >
                      <span className="flex items-center gap-1.5">
                        <span>Certified Diamonds</span>
                        <span className="text-[9px] text-[#A57822] bg-[#FAF3E5] px-1.5 py-0.2 rounded font-bold">Natural</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
                    </Link>
                    <Link
                      to="/silver"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-white font-medium text-[#2C2420] hover:text-[#581923]"
                    >
                      <span>92.5 Fine Silver</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
                    </Link>
                    <Link
                      to="/coins-bars"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-white font-medium text-[#2C2420] hover:text-[#581923]"
                    >
                      <span>Coins &amp; Bars (999.9)</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
                    </Link>
                    <Link
                      to="/collections/wedding"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-white font-medium text-[#2C2420] hover:text-[#581923]"
                    >
                      <span>Temple Heritage Jewellery</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Diamonds */}
              <div className="relative inline-flex items-center">
                <Link
                  to="/diamonds"
                  className={getNavLinkClass(isDiamonds)}
                >
                  <span>Diamonds</span>
                </Link>
                {isDiamonds && (
                  <span 
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#540B16] pointer-events-none z-10" 
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Bridal */}
              <div className="relative inline-flex items-center">
                <Link
                  to="/bridal"
                  className={getNavLinkClass(isBridal)}
                >
                  <span>Bridal</span>
                </Link>
                {isBridal && (
                  <span 
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#540B16] pointer-events-none z-10" 
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Silver Pooja */}
              <div className="relative inline-flex items-center">
                <Link
                  to="/silver-pooja"
                  className={getNavLinkClass(isSilverPooja)}
                >
                  <span>Silver Pooja</span>
                </Link>
                {isSilverPooja && (
                  <span 
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#540B16] pointer-events-none z-10" 
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Offers */}
              <div className="relative inline-flex items-center">
                <Link
                  to="/offers"
                  className={getNavLinkClass(isOffers)}
                >
                  <span>Offers</span>
                </Link>
                {isOffers && (
                  <span 
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#540B16] pointer-events-none z-10" 
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* About */}
              <div className="relative inline-flex items-center">
                <Link
                  to="/about"
                  className={getNavLinkClass(isAbout)}
                >
                  <span>About</span>
                </Link>
                {isAbout && (
                  <span 
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#540B16] pointer-events-none z-10" 
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Contact - Smoothly goes to Home page Contact Concierge section */}
              <div className="relative inline-flex items-center">
                <a
                  href="/#contact-concierge"
                  onClick={handleContactClick}
                  className={getNavLinkClass(isContact)}
                >
                  <span>Contact</span>
                </a>
                {isContact && (
                  <span 
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#540B16] pointer-events-none z-10" 
                    aria-hidden="true"
                  />
                )}
              </div>
            </nav>

            {/* Delicate Golden Divider Line between Nav and Right Tools */}
            <div className="hidden lg:block h-6 w-[1px] bg-[#CCA44C]/60 mx-1 xl:mx-2 shrink-0" />

            {/* Right: Search, Cart Icon & Maroon Book Appointment CTA Button */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0 xl:pr-4">
              {/* Search Icon */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-1.5 text-[#2C221E] hover:text-[#581923] hover:bg-[#F6EFE6] rounded-full transition-colors cursor-pointer"
                title="Search Collection"
                aria-label="Search Collection"
              >
                <Search className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[1.85]" />
              </button>

              {/* Shopping Bag with Red Circular Badge matching design */}
              <button
                onClick={onOpenCart}
                className="relative p-1.5 text-[#2C221E] hover:text-[#581923] hover:bg-[#F6EFE6] rounded-full transition-colors cursor-pointer"
                title="View Cart"
                aria-label={`Cart containing ${cartCount} items`}
              >
                <ShoppingBag className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[1.85]" />
                <span className="absolute -top-1 -right-1 bg-[#8C1D2A] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none shadow-xs border border-white">
                  {cartCount}
                </span>
              </button>

              {/* Book Appointment CTA Button (Exact Maroon Pill Button with Calendar Icon) */}
              <button
                onClick={() => setIsAppointmentOpen(true)}
                className="inline-flex items-center gap-2 bg-[#540B16] hover:bg-[#43070E] active:scale-95 text-[#FAF7F2] px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer whitespace-nowrap border border-[#D4AF37]/50"
              >
                <Calendar className="w-3.5 h-3.5 text-[#E5C578] stroke-[2]" />
                <span className="hidden xs:inline">Book Appointment</span>
                <span className="xs:hidden">Book</span>
              </button>
            </div>

          </div>

        {/* Search Overlay dropdown */}
        {isSearchOpen && (
          <div className="max-w-[1440px] mx-auto border-t border-[#EAE2D5] mt-2 pt-3 animate-fadeIn">
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#8C6D2D] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search gold necklaces, diamond rings, silver pooja items..."
                  className="w-full bg-white border border-[#DECDBB] rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#581923]"
                />
              </div>
              <button
                type="submit"
                className="bg-[#581923] text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="text-xs text-[#7A6E65] hover:text-[#581923] px-2 py-2 cursor-pointer"
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. MOBILE NAVIGATION DRAWER                                               */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-start animate-fadeIn lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="bg-[#FAF7F2] w-[85%] max-w-sm h-full shadow-2xl flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Drawer Top */}
              <div className="p-4 bg-[#4E0C16] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 text-[#D4AF37]">
                    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                      <path d="M50 12 C44 28 32 46 16 60 C26 68 38 72 50 72 C62 72 74 68 84 60 C68 46 56 28 50 12 Z" fill="#D4AF37" />
                      <circle cx="50" cy="48" r="3" fill="#4E0C16" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-serif font-bold text-base block leading-tight">VEDHA RADHA</span>
                    <span className="text-[8px] text-[#D4AF37] tracking-widest uppercase">Signature Collection</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-full text-white/80 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Appointment CTA */}
              <div className="p-3 bg-[#FAF3E3] border-b border-[#E8DFC0]">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsAppointmentOpen(true);
                  }}
                  className="w-full bg-[#581923] text-white py-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-2 shadow-sm border border-[#D4AF37]/40"
                >
                  <Calendar className="w-4 h-4 text-[#D4AF37]" />
                  <span>Book Appointment in Showroom</span>
                </button>
              </div>

              {/* Mobile Links */}
              <div className="p-4 space-y-1 text-xs font-medium text-[#2C1D18]">
                <Link
                  to="/"
                  onClick={handleHomeClick}
                  className={`block px-3 py-2.5 rounded-lg transition-colors ${
                    isHome ? 'bg-[#540B16] text-[#FAF5EE] font-semibold' : 'hover:bg-white'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/collections"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg transition-colors ${
                    isCollections ? 'bg-[#540B16] text-[#FAF5EE] font-semibold' : 'hover:bg-white'
                  }`}
                >
                  Collections
                </Link>
                <Link
                  to="/gold"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg transition-colors ${
                    isJewellery ? 'bg-[#540B16] text-[#FAF5EE] font-semibold' : 'hover:bg-white'
                  }`}
                >
                  Jewellery
                </Link>
                <Link
                  to="/diamonds"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between ${
                    isDiamonds ? 'bg-[#540B16] text-[#FAF5EE] font-semibold' : 'hover:bg-white'
                  }`}
                >
                  <span>Diamonds</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${isDiamonds ? 'bg-[#FAF3E5] text-[#540B16] border-white' : 'text-[#A57822] bg-[#FAF3E5] border-[#E8C77D]'}`}>Natural</span>
                </Link>
                <Link
                  to="/bridal"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg transition-colors ${
                    isBridal ? 'bg-[#540B16] text-[#FAF5EE] font-semibold' : 'hover:bg-white'
                  }`}
                >
                  Bridal
                </Link>
                <Link
                  to="/silver-pooja"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg transition-colors ${
                    isSilverPooja ? 'bg-[#540B16] text-[#FAF5EE] font-semibold' : 'hover:bg-white'
                  }`}
                >
                  Silver Pooja
                </Link>
                <Link
                  to="/offers"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg transition-colors ${
                    isOffers ? 'bg-[#540B16] text-[#FAF5EE] font-semibold' : 'hover:bg-white'
                  }`}
                >
                  Offers
                </Link>
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg transition-colors ${
                    isAbout ? 'bg-[#540B16] text-[#FAF5EE] font-semibold' : 'hover:bg-white'
                  }`}
                >
                  About
                </Link>
                <a
                  href="/#contact-concierge"
                  onClick={handleContactClick}
                  className={`block px-3 py-2.5 rounded-lg transition-colors ${
                    isContact ? 'bg-[#540B16] text-[#FAF5EE] font-semibold' : 'hover:bg-white'
                  }`}
                >
                  Contact
                </a>
              </div>
            </div>

            {/* Bottom info */}
            <div className="p-4 border-t border-[#EAE2D5] text-xs text-[#7A6E65] space-y-2">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#581923]" />
                <span>Trichy &bull; Tamil Nadu</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#581923]" />
                <span>+91 98765 43210</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Shared Modals */}
      <BookAppointmentModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
      />
      <TrackOrderModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
      />
      <GoldRateModal
        isOpen={isGoldRateModalOpen}
        onClose={() => setIsGoldRateModalOpen(false)}
        rates={rates}
        status={status}
        isLoading={isLoading}
        disclaimer={disclaimer}
      />
    </header>
  );
}
