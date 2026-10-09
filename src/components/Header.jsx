import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Truck, 
  ShieldCheck, 
  Phone, 
  Globe, 
  ChevronDown, 
  ChevronRight, 
  X, 
  Search, 
  User, 
  Heart, 
  ShoppingBag, 
  TrendingUp,
  Sparkles,
  Coins
} from 'lucide-react';
import GoldRateModal from './header/GoldRateModal';
import { usePreciousRates } from '../hooks/usePreciousRates';
import { 
  coinsBarsNavItems, 
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

  // Precious metal rates
  const { 
    rates, 
    status, 
    isLoading, 
    isLive, 
    isStale, 
    disclaimer, 
    refreshRates, 
    updateManualRates 
  } = usePreciousRates();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'gold' | 'silver' | 'coins-bars' | 'collections' | null
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isGoldRateModalOpen, setIsGoldRateModalOpen] = useState(false);
  const [language, setLanguage] = useState('English');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState(null);

  // Active route tracking
  const currentPath = location.pathname;
  const isHome = currentPath === '/';
  const isGold = currentPath.startsWith('/gold');
  const isSilver = currentPath.startsWith('/silver');
  const isCoinsBars = currentPath.startsWith('/coins-bars');
  const isNewArrivals = currentPath === '/new-arrivals';
  const isCollections = currentPath.startsWith('/collections');

  const dropdownRef = useRef(null);
  const langRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const searchInputRef = useRef(null);

  const handleMouseEnter = (menu) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const handleKeyDownMenu = (e, menu, route) => {
    if (e.key === 'Enter') {
      navigate(route);
      setActiveDropdown(null);
    } else if (e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveDropdown(prev => prev === menu ? null : menu);
    }
  };

  // Close dropdowns on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setIsSearchOpen(false);
        setLangDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close mobile drawer and search on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setIsSearchOpen(false);
  }, [location.pathname, location.search]);

  // Focus search input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/gold`);
      setIsSearchOpen(false);
    }
  };

  const handleTagSearch = (tag, path = '/gold') => {
    setSearchQuery(tag);
    navigate(path);
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full select-none font-sans shadow-xs">
      
      {/* ========================================================================= */}
      {/* 1. TOP UTILITY BAR (Deep Maroon Row)                                      */}
      {/* ========================================================================= */}
      <div className="bg-[#3B1117] text-[#EAD8D8] text-[11px] sm:text-[11.5px] border-b border-[#521B24] px-3 sm:px-8 py-1.5">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-2 lg:gap-4 flex-wrap lg:flex-nowrap">
          
          {/* Left: Free Shipping */}
          <div className="flex items-center gap-2 shrink-0">
            <Truck className="w-3.5 h-3.5 text-[#E5C278] shrink-0" aria-hidden="true" />
            <span className="tracking-wide text-[#EAD8D8] font-normal">
              Free Shipping on Orders Above ₹5,000
            </span>
          </div>

          <div className="hidden lg:block h-3.5 w-px bg-[#692F39] shrink-0" />

          {/* Center: Live Benchmark Gold & Silver Rate Pill */}
          <div className="flex items-center justify-center my-0.5 sm:my-0 mx-auto lg:mx-0">
            <button
              onClick={() => setIsGoldRateModalOpen(true)}
              className="relative inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-3.5 py-1 rounded-full bg-gradient-to-r from-[#FFF4DF] via-[#FDF0D5] to-[#F7E1B5] text-[#2C1D18] border border-[#D4AF37]/80 shadow-[0_0_12px_rgba(212,175,55,0.25)] hover:shadow-[0_0_16px_rgba(212,175,55,0.5)] hover:scale-[1.01] transition-all duration-200 cursor-pointer group"
              title={`Click for multi-purity rates & conversion details. ${disclaimer}`}
              aria-label={`Today's 22K Gold: ₹${rates.gold22k}/g, Silver: ₹${rates.silver1g}/g. Last updated ${rates.lastUpdated}.`}
            >
              {/* Gold Bars Icon */}
              <div className="text-[#9E7324] shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M4 10L7 4H17L20 10H4Z" opacity="0.85" />
                  <path d="M2 11H22V13L20 19H4L2 13V11Z" />
                  <rect x="7" y="14" width="10" height="2" rx="1" fill="#FFF4DF" opacity="0.5" />
                </svg>
              </div>

              {/* Gold Rate */}
              <div className="flex items-center gap-1">
                <span className="font-normal text-[10px] sm:text-[11px] text-[#554133]">
                  Gold (22K):
                </span>
                <span className="font-bold text-[11px] sm:text-[11.5px] text-[#1F1511]">
                  ₹{rates.gold22k} <span className="font-normal text-[9.5px] text-[#695444]">/g</span>
                </span>
              </div>

              <span className="text-[#C5A059]/70 font-light">|</span>

              {/* Silver Rate */}
              <div className="flex items-center gap-1">
                <span className="font-normal text-[10px] sm:text-[11px] text-[#554133]">
                  Silver:
                </span>
                <span className="font-bold text-[11px] sm:text-[11.5px] text-[#1F1511]">
                  ₹{rates.silver1g} <span className="font-normal text-[9.5px] text-[#695444]">/g</span>
                </span>
              </div>

              {/* Daily Change Indicator */}
              {rates.change && (
                <span className={`text-[9.5px] font-semibold flex items-center gap-0.5 px-1.5 py-0.2 rounded-full hidden sm:inline-flex ${
                  rates.isUp ? 'bg-emerald-100/90 text-[#167034] border border-emerald-200' : 'bg-red-100/90 text-red-700 border border-red-200'
                }`}>
                  <span>{rates.isUp ? '↑' : '↓'}</span> {rates.change}
                </span>
              )}

              {/* Status Dot */}
              <span 
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  isLive ? 'bg-emerald-600 animate-pulse' : isStale ? 'bg-amber-600' : 'bg-[#9E7324]'
                }`} 
                title={isLive ? 'Live spot rate' : isStale ? 'Cached rate' : 'Indicative benchmark'}
              />

              <ChevronRight className="w-3 h-3 text-[#9E7324] group-hover:translate-x-0.5 transition-transform shrink-0" aria-hidden="true" />
            </button>
          </div>

          <div className="hidden lg:block h-3.5 w-px bg-[#692F39] shrink-0" />

          {/* Right: Hallmark + Showroom Phone + Language Selector */}
          <div className="hidden lg:flex items-center gap-3.5 xl:gap-4.5 text-[11px] text-[#EAD8D8] shrink-0">
            
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E5C278] shrink-0" aria-hidden="true" />
              <span className="tracking-wide">100% Hallmark Gold</span>
            </div>

            <div className="h-3.5 w-px bg-[#692F39] shrink-0" />

            <a 
              href="tel:+914428341999" 
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
              title="Call Mylapore Showroom"
            >
              <Phone className="w-3.5 h-3.5 text-[#E5C278] shrink-0" aria-hidden="true" />
              <span>+91 44 2834 1999</span>
            </a>

            <div className="h-3.5 w-px bg-[#692F39] shrink-0" />

            {/* Staff Admin Portal Link */}
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E5C278]/20 hover:bg-[#E5C278]/30 text-[#E5C278] border border-[#E5C278]/40 font-semibold text-[10.5px] transition"
              title="Open Staff Admin & Reservation Management"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Staff Admin</span>
            </Link>

            <div className="h-3.5 w-px bg-[#692F39] shrink-0" />

            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 hover:text-white cursor-pointer py-0.5 focus:outline-none focus:ring-1 focus:ring-[#E5C278]/50 rounded"
                aria-expanded={langDropdownOpen}
                aria-haspopup="true"
                aria-label={`Select Language, currently ${language}`}
              >
                <Globe className="w-3.5 h-3.5 text-[#E5C278] shrink-0" aria-hidden="true" />
                <span>{language}</span>
                <ChevronDown className={`w-3 h-3 text-[#E5C278] transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>

              {langDropdownOpen && (
                <div 
                  className="absolute right-0 top-full mt-1.5 bg-[#FAF7F2] text-[#2C1D18] rounded-md shadow-xl border border-[#DECDBB] py-1 w-32 z-50 text-xs animate-fadeIn"
                  role="menu"
                  aria-label="Languages"
                >
                  {['English', 'தமிழ் (Tamil)', 'తెలుగు (Telugu)', 'हिन्दी (Hindi)'].map((l) => {
                    const shortName = l.split(' ')[0];
                    const isSelected = language === shortName;
                    return (
                      <button
                        key={l}
                        onClick={() => {
                          setLanguage(shortName);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 hover:bg-[#F3EAD3] text-[11px] transition-colors ${
                          isSelected ? 'font-bold text-[#581923] bg-[#F3EAD3]/70' : 'text-[#3D332D]'
                        }`}
                        role="menuitem"
                      >
                        {l}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN NAVIGATION ROW (Warm Ivory Row with New Navigation Structure)      */}
      {/* ========================================================================= */}
      <div className="bg-[#FAF7F2] border-b border-[#E8DFC0]/90 py-3 sm:py-3.5 px-4 sm:px-8 relative">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Brand Logo & Wordmark */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            
            {/* Vedha Radha Logo & Wordmark */}
            <Link 
              to="/" 
              className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer"
              aria-label="Vedha Radha Thanga Maaligai Homepage"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 text-[#B8924B] shrink-0 transition-transform duration-300 group-hover:scale-105">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xs">
                  <path d="M50 10 C42 32 30 50 18 64 C28 72 40 76 50 76 C60 76 72 72 82 64 C70 50 58 32 50 10 Z" stroke="#B8924B" strokeWidth="2.5" fill="#FAF6EE" />
                  <path d="M50 18 C46 36 40 52 50 70 C60 52 54 36 50 18 Z" fill="#C5A059" stroke="#947130" strokeWidth="1.5" />
                  <path d="M50 70 C34 66 22 52 24 38 C34 46 44 56 50 70 Z" stroke="#B8924B" strokeWidth="2" fill="#E6D3A3" />
                  <path d="M50 70 C66 66 78 52 76 38 C66 46 56 56 50 70 Z" stroke="#B8924B" strokeWidth="2" fill="#E6D3A3" />
                  <path d="M30 76 C40 84 60 84 70 76 C62 88 38 88 30 76 Z" fill="#B8924B" />
                  <circle cx="50" cy="50" r="3" fill="#581923" />
                </svg>
              </div>

              <div className="flex flex-col justify-center">
                <span className="font-serif text-[21px] sm:text-[24px] font-bold text-[#241716] leading-none tracking-tight group-hover:text-[#581923] transition-colors">
                  Vedha Radha
                </span>
                <span className="font-sans text-[8.5px] sm:text-[9.5px] font-semibold tracking-[0.28em] text-[#7A6252] uppercase mt-1">
                  THANGAMAALIGAI
                </span>
              </div>
            </Link>

          </div>

          {/* Center: Main Navigation: Home | Gold | Silver | Coins & Bars ▼ | New Arrivals | Collections ▼ */}
          <nav 
            ref={dropdownRef}
            className="hidden xl:flex items-center gap-6 2xl:gap-8 text-[13.5px] font-medium text-[#3A2E28]"
            aria-label="Main Navigation"
          >
            {/* 0. HOME */}
            <Link
              to="/"
              className={`relative py-1 transition-colors cursor-pointer focus:outline-none ${
                isHome ? 'text-[#581923] font-semibold' : 'hover:text-[#581923]'
              }`}
            >
              <span>Home</span>
              {isHome && (
                <span className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-[#C5A059] rounded-full" />
              )}
            </Link>

            {/* 1. GOLD */}
            <Link
              to="/gold"
              className={`relative py-1 transition-colors cursor-pointer focus:outline-none ${
                isGold ? 'text-[#581923] font-semibold' : 'hover:text-[#581923]'
              }`}
            >
              <span>Gold</span>
              {isGold && (
                <span className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-[#C5A059] rounded-full" />
              )}
            </Link>

            {/* 2. SILVER */}
            <Link
              to="/silver"
              className={`relative py-1 transition-colors cursor-pointer focus:outline-none ${
                isSilver ? 'text-[#581923] font-semibold' : 'hover:text-[#581923]'
              }`}
            >
              <span>Silver</span>
              {isSilver && (
                <span className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-[#C5A059] rounded-full" />
              )}
            </Link>

            {/* 3. COINS & BARS ▼ */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('coins-bars')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => navigate('/coins-bars')}
                onKeyDown={(e) => handleKeyDownMenu(e, 'coins-bars', '/coins-bars')}
                aria-expanded={activeDropdown === 'coins-bars'}
                aria-haspopup="true"
                className={`flex items-center gap-1 py-1 transition-colors cursor-pointer focus:outline-none ${
                  isCoinsBars || activeDropdown === 'coins-bars'
                    ? 'text-[#581923] font-semibold' 
                    : 'hover:text-[#581923]'
                }`}
              >
                <span>Coins & Bars</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#8C6D2D] transition-transform duration-200 ${activeDropdown === 'coins-bars' ? 'rotate-180 text-[#581923]' : ''}`} />
              </button>

              {isCoinsBars && (
                <span className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-[#C5A059] rounded-full" />
              )}

              {/* Coins & Bars Dropdown Content */}
              {activeDropdown === 'coins-bars' && (
                <div 
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#DECDBB] p-3 z-50 animate-fadeIn text-xs"
                  role="menu"
                  aria-label="Coins and Bars Menu"
                >
                  <div className="px-2.5 py-1.5 font-serif font-bold text-[#8C6D2D] border-b border-[#EAE2D5] text-[11px] uppercase tracking-wider flex items-center justify-between">
                    <span>Bullion & Investment</span>
                    <span className="text-[10px] text-[#7A6E65] font-semibold bg-[#EFE7D8] px-1.5 py-0.5 rounded">999.9 Fine</span>
                  </div>
                  <div className="space-y-1 mt-1.5">
                    {coinsBarsNavItems.filter(item => !item.isAll).map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setActiveDropdown(null)}
                        className="group w-full text-left p-2 rounded-xl hover:bg-white border border-transparent hover:border-[#EAE2D5] transition-all flex items-center justify-between shadow-none hover:shadow-2xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#581923]/30"
                        role="menuitem"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-lg overflow-hidden bg-white border border-[#EAE2D5] shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                          <div className="min-w-0">
                            <span className="font-serif text-[12.5px] font-semibold text-[#2C2420] group-hover:text-[#581923] transition-colors block truncate">
                              {item.name}
                            </span>
                            <span className="text-[10.5px] text-[#7A6E65] block truncate">
                              {item.count}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[#B38E46] group-hover:text-[#581923] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                      </Link>
                    ))}

                    <Link
                      to="/coins-bars"
                      onClick={() => setActiveDropdown(null)}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-white font-bold text-[#581923] hover:text-[#3B1117] border-t border-[#EAE2D5] mt-1 transition-all flex items-center justify-between group cursor-pointer"
                      role="menuitem"
                    >
                      <span className="text-xs">View All Coins & Bars</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#581923] group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 4. NEW ARRIVALS */}
            <Link
              to="/new-arrivals"
              className={`relative py-1 transition-colors cursor-pointer focus:outline-none ${
                isNewArrivals ? 'text-[#241716] font-semibold' : 'hover:text-[#581923]'
              }`}
            >
              <span className="flex items-center gap-1">
                <span>New Arrivals</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              </span>
              {isNewArrivals && (
                <span className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-[#C5A059] rounded-full" />
              )}
            </Link>

            {/* 5. COLLECTIONS ▼ */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('collections')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => navigate('/collections')}
                onKeyDown={(e) => handleKeyDownMenu(e, 'collections', '/collections')}
                aria-expanded={activeDropdown === 'collections'}
                aria-haspopup="true"
                className={`flex items-center gap-1 py-1 transition-colors cursor-pointer focus:outline-none ${
                  isCollections || activeDropdown === 'collections'
                    ? 'text-[#581923] font-semibold' 
                    : 'hover:text-[#581923]'
                }`}
              >
                <span>Collections</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#8C6D2D] transition-transform duration-200 ${activeDropdown === 'collections' ? 'rotate-180 text-[#581923]' : ''}`} />
              </button>

              {isCollections && (
                <span className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-[#C5A059] rounded-full" />
              )}

              {/* Collections Image-Led Mega Menu Dropdown */}
              {activeDropdown === 'collections' && (
                <div 
                  className="absolute top-full right-0 lg:-right-24 xl:-right-16 mt-3 w-[92vw] max-w-[680px] bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#DECDBB] p-5 sm:p-6 z-50 animate-fadeIn text-xs"
                  role="menu"
                  aria-label="Collections Mega Menu"
                >
                  {/* 6 Collection Image-Led Cards Grid (3 cols x 2 rows) */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                    {collectionsNavItems.filter(item => !item.isAll).map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setActiveDropdown(null)}
                        className="group bg-white rounded-xl border border-[#EAE2D5] hover:border-[#581923]/40 p-3 transition-all duration-300 flex flex-col items-center text-center shadow-2xs hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#581923]/20"
                        role="menuitem"
                      >
                        <div className="w-full aspect-square rounded-lg overflow-hidden bg-[#FAF6EE] border border-[#EAE2D5] relative mb-2.5">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                        <span className="font-serif text-[13px] sm:text-[13.5px] font-semibold text-[#2C2420] group-hover:text-[#581923] transition-colors line-clamp-1">
                          {item.name}
                        </span>
                      </Link>
                    ))}
                  </div>

                  {/* Pale-Ivory Promotional Strip */}
                  <div className="mt-4 bg-[#F4EDE2]/80 rounded-xl p-3.5 border border-[#DECDBB] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Small jewellery collage preview */}
                      <div className="flex -space-x-2 shrink-0 overflow-hidden py-0.5">
                        <img 
                          src="/images/col_wedding.jpg" 
                          alt="Signature Collection" 
                          className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-xs" 
                        />
                        <img 
                          src="/images/col_girls.jpg" 
                          alt="Signature Collection" 
                          className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-xs" 
                        />
                        <img 
                          src="/images/col_silver_idol.jpg" 
                          alt="Signature Collection" 
                          className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-xs" 
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-serif text-[13px] sm:text-[13.5px] font-bold text-[#2C2420] leading-tight truncate">
                          Curated Collections — Just for You.
                        </h4>
                        <p className="text-[11px] sm:text-[11.5px] text-[#7A6E65] truncate mt-0.5">
                          Discover Our Signature Designs.
                        </p>
                      </div>
                    </div>

                    <Link
                      to="/collections"
                      onClick={() => setActiveDropdown(null)}
                      className="shrink-0 border border-[#581923] text-[#581923] hover:bg-[#581923] hover:text-white px-4 py-1.5 rounded-full font-semibold text-[11.5px] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#581923]/30"
                    >
                      View All
                    </Link>
                  </div>
                </div>
              )}
            </div>

          </nav>

          {/* Right: Fine-line Search, Account, Wishlist, Shopping-Bag Icons */}
          <div className="flex items-center gap-2.5 sm:gap-4 text-[#2C1D18]">
            
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:text-[#581923] rounded-full hover:bg-[#F3EAD3]/60 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#581923]/30"
              aria-label="Search jewellery collection"
              title="Search collection"
            >
              <Search className="w-5 h-5 stroke-[1.75]" />
            </button>

            <button
              onClick={onOpenAccount}
              className="p-2 hover:text-[#581923] rounded-full hover:bg-[#F3EAD3]/60 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#581923]/30"
              aria-label="My Account and Privilege Club"
              title="Vedha Radha Privilege Club"
            >
              <User className="w-5 h-5 stroke-[1.75]" />
            </button>

            <button
              onClick={onOpenWishlist}
              className="relative p-2 hover:text-[#581923] rounded-full hover:bg-[#F3EAD3]/60 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#581923]/30"
              aria-label={`Wishlist containing ${wishlistCount} saved items`}
              title={`Saved Wishlist (${wishlistCount})`}
            >
              <Heart className="w-5 h-5 stroke-[1.75]" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#D32F2F] text-white text-[9.5px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-scaleIn">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenCart}
              className="relative p-2 hover:text-[#581923] rounded-full hover:bg-[#F3EAD3]/60 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#581923]/30"
              aria-label={`Shopping bag containing ${cartCount} items`}
              title={`Shopping Bag (${cartCount})`}
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#D32F2F] text-white text-[9.5px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-scaleIn">
                  {cartCount}
                </span>
              )}
            </button>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE SEARCH OVERLAY                                                */}
        {/* ========================================================================= */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#FAF7F2] border-b border-[#DECDBB] shadow-xl p-4 sm:p-5 animate-fadeIn z-40">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto space-y-3">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-[#8C6D2D] absolute left-3.5 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 22K gold necklaces, 92.5 silver anklets, gold coins, pooja articles..."
                  className="w-full bg-white border border-[#DECDBB] focus:border-[#581923] rounded-lg px-4 py-2.5 pl-10 text-xs sm:text-sm text-[#2C1D18] focus:outline-none shadow-xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-20 text-xs text-[#7A6E65] hover:text-[#581923] p-1 cursor-pointer"
                    aria-label="Clear search"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="submit"
                  className="ml-2 bg-[#581923] hover:bg-[#431219] text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="ml-2 text-xs text-[#7A6E65] hover:text-[#581923] px-2 py-2 cursor-pointer"
                >
                  Close
                </button>
              </div>

              {/* Quick Search Tags */}
              <div className="flex items-center gap-2 flex-wrap text-xs text-[#7A6E65] pt-1">
                <span className="font-semibold text-[#581923] text-[11px]">Popular Searches:</span>
                {[
                  { tag: 'Gold Necklaces', path: '/gold/necklaces' },
                  { tag: 'Silver Anklets', path: '/silver/anklets' },
                  { tag: 'Gold Coins', path: '/coins-bars/gold-coins' },
                  { tag: 'Silver Pooja Items', path: '/silver/pooja-items' },
                  { tag: 'Bridal Jewellery', path: '/gold/bridal-jewellery' }
                ].map((item) => (
                  <button
                    key={item.tag}
                    type="button"
                    onClick={() => handleTagSearch(item.tag, item.path)}
                    className="px-2.5 py-1 bg-white hover:bg-[#F3EAD3] text-[#3D332D] hover:text-[#581923] rounded-full border border-[#DECDBB] text-[11px] transition-colors cursor-pointer"
                  >
                    {item.tag}
                  </button>
                ))}
              </div>
            </form>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MOBILE NAVIGATION DRAWER (Full Synchronization with New Navigation)       */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-start animate-fadeIn xl:hidden">
          <div 
            className="bg-[#FAF7F2] w-full max-w-sm h-full shadow-2xl flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            <div>
              {/* Drawer Top Header */}
              <div className="p-4 bg-[#3B1117] text-white flex items-center justify-between border-b border-[#521B24]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 text-[#B8924B]">
                    <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                      <path d="M50 18 C46 36 40 52 50 70 C60 52 54 36 50 18 Z" fill="#C5A059" />
                      <path d="M50 70 C34 66 22 52 24 38 C34 46 44 56 50 70 Z" fill="#E6D3A3" />
                      <path d="M50 70 C66 66 78 52 76 38 C66 46 56 56 50 70 Z" fill="#E6D3A3" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-serif text-base font-bold text-white leading-tight block">Vedha Radha</span>
                    <span className="text-[9px] text-[#E5C278] tracking-widest uppercase">Thanga Maaligai</span>
                  </div>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
                  aria-label="Close navigation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Rate Strip */}
              <div className="p-3 bg-[#FAF3E3] border-b border-[#E8DFC0] flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-[#581923]">
                    <TrendingUp className="w-3.5 h-3.5 text-[#8C6D2D]" />
                    <span className="font-bold text-[11px]">22K Gold: ₹{rates.gold22k}/g</span>
                  </div>
                  <div className="text-[10px] text-[#695444] font-mono pl-5">
                    Silver: ₹{rates.silver1g}/g &bull; {rates.lastUpdated}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsGoldRateModalOpen(true);
                  }}
                  className="text-[10.5px] bg-[#581923] text-white px-2.5 py-1 rounded font-semibold hover:bg-[#431219]"
                >
                  Details
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <div className="p-4 space-y-1 text-xs font-medium text-[#2C1D18]">
                
                {/* 0. Home */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-md transition-colors ${
                    isHome ? 'bg-[#581923] text-white font-semibold' : 'hover:bg-[#F3EAD3]'
                  }`}
                >
                  Home
                </button>

                {/* 1. Gold */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/gold');
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-md transition-colors ${
                    isGold ? 'bg-[#581923] text-white font-semibold' : 'hover:bg-[#F3EAD3]'
                  }`}
                >
                  Gold
                </button>

                {/* 2. Silver */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/silver');
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-md transition-colors ${
                    isSilver ? 'bg-[#581923] text-white font-semibold' : 'hover:bg-[#F3EAD3]'
                  }`}
                >
                  Silver
                </button>

                {/* 3. Coins & Bars Accordion */}
                <div className="border border-[#E8DFC0] rounded-md overflow-hidden my-1">
                  <button
                    onClick={() => setMobileAccordion(mobileAccordion === 'coins-bars' ? null : 'coins-bars')}
                    className="w-full flex items-center justify-between px-3 py-2.5 bg-[#FAF8F5] text-[#3A2E28] font-semibold"
                  >
                    <span className={isCoinsBars ? 'text-[#581923] font-bold' : ''}>Coins & Bars</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#8C6D2D] transition-transform ${mobileAccordion === 'coins-bars' ? 'rotate-180' : ''}`} />
                  </button>

                  {mobileAccordion === 'coins-bars' && (
                    <div className="p-2.5 bg-white space-y-1.5 border-t border-[#E8DFC0]">
                      {coinsBarsNavItems.filter(item => !item.isAll).map(item => (
                        <button
                          key={item.name}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            navigate(item.path);
                          }}
                          className="w-full text-left p-2 rounded-lg hover:bg-[#FAF8F5] border border-transparent hover:border-[#EAE2D5] transition-colors flex items-center justify-between group cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-8 h-8 rounded-md object-cover border border-[#EAE2D5] shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="font-semibold text-xs text-[#241716] block truncate">
                                {item.name}
                              </span>
                              <span className="text-[10px] text-[#7A6E65] block truncate">
                                {item.count}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-[#8C6D2D]" />
                        </button>
                      ))}

                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate('/coins-bars');
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg font-bold text-xs text-[#581923] bg-[#FAF3E3] hover:bg-[#F3EAD3] border border-[#E8DFC0] transition-colors flex items-center justify-between mt-1 cursor-pointer"
                      >
                        <span>View All Coins & Bars</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#581923]" />
                      </button>
                    </div>
                  )}
                </div>

                {/* 4. New Arrivals */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/new-arrivals');
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-md transition-colors ${
                    isNewArrivals ? 'bg-[#581923] text-white font-semibold' : 'hover:bg-[#F3EAD3]'
                  }`}
                >
                  New Arrivals
                </button>

                {/* 5. Collections Accordion */}
                <div className="border border-[#E8DFC0] rounded-md overflow-hidden my-1">
                  <button
                    onClick={() => setMobileAccordion(mobileAccordion === 'collections' ? null : 'collections')}
                    className="w-full flex items-center justify-between px-3 py-2.5 bg-[#FAF8F5] text-[#3A2E28] font-semibold"
                  >
                    <span className={isCollections ? 'text-[#581923] font-bold' : ''}>Collections</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#8C6D2D] transition-transform ${mobileAccordion === 'collections' ? 'rotate-180' : ''}`} />
                  </button>

                  {mobileAccordion === 'collections' && (
                    <div className="p-3 bg-white space-y-3 border-t border-[#E8DFC0]">
                      <div className="grid grid-cols-2 gap-2">
                        {collectionsNavItems.filter(item => !item.isAll).map(item => (
                          <button
                            key={item.name}
                            onClick={() => {
                              setMobileMenuOpen(false);
                              navigate(item.path);
                            }}
                            className="w-full text-left p-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EAD3] border border-[#EAE2D5] transition-colors flex flex-col items-center text-center gap-1.5 group cursor-pointer"
                          >
                            <div className="w-full aspect-square rounded-lg overflow-hidden bg-white border border-[#EAE2D5]">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                loading="lazy"
                              />
                            </div>
                            <span className="font-semibold text-[11.5px] text-[#241716] block truncate w-full">
                              {item.name}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Mobile Curated Promo Strip */}
                      <div className="bg-[#FAF3E3] rounded-xl p-2.5 border border-[#E8DFC0] flex items-center justify-between gap-2">
                        <div className="min-w-0 text-left">
                          <span className="font-serif font-bold text-xs text-[#2C2420] block truncate">
                            Curated Collections
                          </span>
                          <span className="text-[10px] text-[#7A6E65] block truncate">
                            Discover Signature Designs
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            navigate('/collections');
                          }}
                          className="shrink-0 border border-[#581923] text-[#581923] hover:bg-[#581923] hover:text-white px-3 py-1 rounded-full font-semibold text-[10.5px] transition-colors"
                        >
                          View All
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Mobile Drawer Bottom Info */}
            <div className="p-4 bg-[#FAF8F5] border-t border-[#EAE2D5] space-y-2 text-center text-xs text-[#7A6E65]">
              <div className="flex items-center justify-center gap-1.5 text-[#581923] font-semibold">
                <Phone className="w-3.5 h-3.5 text-[#8C6D2D]" />
                <a href="tel:+914428341999">+91 44 2834 1999</a>
              </div>
              <p className="text-[10.5px]">48, South Mada Street, Mylapore, Chennai</p>
              <div className="flex items-center justify-center gap-1 text-[#8C6D2D] text-[10px] font-medium pt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Hallmarked 916 Gold Guaranteed</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Gold Rate Modal */}
      <GoldRateModal
        isOpen={isGoldRateModalOpen}
        onClose={() => setIsGoldRateModalOpen(false)}
        rates={rates}
        status={status}
        isLoading={isLoading}
        disclaimer={disclaimer}
        onRefresh={refreshRates}
        onUpdateRates={updateManualRates}
      />

    </header>
  );
}
