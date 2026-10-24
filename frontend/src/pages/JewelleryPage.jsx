import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { storefrontClient } from '../api/storefrontProductsClient';
import { Sparkles, Filter, ChevronRight, ShieldCheck, Heart, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function JewelleryPage({
  searchQuery = '',
  onViewProduct = () => {},
  onAddToCart = () => {},
  onAddToWishlist = () => {},
  wishlistItems = []
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialCategory = searchParams.get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('featured');
  const [dbProducts, setDbProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setApiError(null);

    storefrontClient.getStorefrontProducts({ page_size: 200 })
      .then(res => {
        if (!isMounted) return;
        if (res.success) {
          setDbProducts(res.items);
        } else {
          setApiError(res.error || 'Failed to load products');
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setApiError('Unable to connect to product server');
        setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const handleTabClick = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  // Filter products
  const filteredProducts = dbProducts.filter(item => {
    // Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matches = item.name.toLowerCase().includes(q) ||
        (item.details && item.details.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q));
      if (!matches) return false;
    }

    // Category filter
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Gold') return item.category?.toLowerCase().includes('gold');
    if (selectedCategory === 'Silver') return item.category?.toLowerCase().includes('silver');
    if (selectedCategory === 'Necklaces') return item.subCategory?.toLowerCase().includes('necklace') || item.name.toLowerCase().includes('necklace') || item.name.toLowerCase().includes('mala') || item.name.toLowerCase().includes('haram');
    if (selectedCategory === 'Bangles') return item.subCategory?.toLowerCase().includes('bangle') || item.name.toLowerCase().includes('bangle') || item.name.toLowerCase().includes('bracelet');
    if (selectedCategory === 'Anklets') return item.subCategory?.toLowerCase().includes('anklet') || item.name.toLowerCase().includes('anklet') || item.name.toLowerCase().includes('payal');
    if (selectedCategory === 'Pooja Articles') return item.subCategory?.toLowerCase().includes('pooja') || item.category?.toLowerCase().includes('article') || item.name.toLowerCase().includes('pooja');
    return item.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.numericPrice - b.numericPrice;
    if (sortBy === 'price-high') return b.numericPrice - a.numericPrice;
    return 0; // featured default
  });

  const getBadgeStyle = (badgeType) => {
    switch (badgeType) {
      case 'in-stock':
        return 'bg-[#DCF0DF] text-[#1E5C2D] border-[#C1E3C6]';
      case 'one-piece':
        return 'bg-[#FEF3D6] text-[#855B09] border-[#F4E0A5]';
      case 'reserved':
        return 'bg-[#FBE4E7] text-[#731E2A] border-[#F2C2C9]';
      default:
        return 'bg-[#F2ECE4] text-[#554A42] border-[#E3D9CD]';
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8 sm:py-12 border-b border-[#EAE2D5]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#7A6E65] mb-4">
          <button onClick={() => navigate('/')} className="hover:text-[#581923] cursor-pointer">Home</button>
          <ChevronRight className="w-3.5 h-3.5 text-[#B38E46]" />
          <span className="font-semibold text-[#581923]">Fine Jewellery Collection</span>
        </div>

        {/* Page Header Banner */}
        <div className="bg-gradient-to-r from-[#4A161E] via-[#5C1D27] to-[#3D0E15] text-[#FAF6EE] rounded-2xl p-6 sm:p-10 mb-8 border border-[#7A2A37] shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block text-[11px] uppercase tracking-[0.25em] text-[#E6C37A] font-semibold mb-2">
              Authentic BIS Hallmarked Jewellery
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Fine Gold & 92.5 Silver Jewellery
            </h1>
            <p className="text-xs sm:text-sm text-[#E6D4D6] mt-2 leading-relaxed">
              Explore our master-crafted South Indian bridal necklaces, antique temple kadas, filigree anklets, and divine sterling silver pooja articles. Every piece comes with lifetime purity assurance.
            </p>
          </div>
          {/* Decorative motif */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 text-[#B8924B]/15 pointer-events-none">
            <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
              <circle cx="50" cy="50" r="45" />
            </svg>
          </div>
        </div>

        {/* Category Filters Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-[#DECDBB]">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { id: 'All', label: 'All Jewellery' },
              { id: 'Gold', label: '22K Gold' },
              { id: 'Silver', label: '92.5 Sterling Silver' },
              { id: 'Necklaces', label: 'Necklaces & Harams' },
              { id: 'Bangles', label: 'Bangles & Kadas' },
              { id: 'Anklets', label: 'Silver Anklets' },
              { id: 'Pooja Articles', label: 'Pooja Articles' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-[#581923] text-white shadow-xs'
                    : 'bg-white text-[#4A403A] hover:bg-[#F3EAD3] border border-[#DECDBB]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown & Product Count */}
          <div className="flex items-center gap-3 shrink-0 self-end lg:self-auto text-xs">
            <span className="text-[#7A6E65]">Showing {sortedProducts.length} designs</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#DECDBB] rounded-lg px-3 py-1.5 text-xs text-[#2C1D18] focus:outline-none focus:border-[#581923]"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

        </div>

        {/* Products Grid */}
        {apiError ? (
          <div className="bg-[#FAF8F5] rounded-xl p-12 text-center border border-[#DECDBB] my-8">
            <h3 className="font-serif text-xl font-bold text-[#8C1D28]">{apiError}</h3>
            <p className="text-xs text-[#7A6E65] mt-1">Please verify your server connection or try again later.</p>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="bg-[#FAF8F5] rounded-xl p-12 text-center border border-[#DECDBB] my-8">
            <h3 className="font-serif text-xl font-bold text-[#241716]">No products available yet.</h3>
            <p className="text-xs text-[#7A6E65] mt-1">Try selecting another category or clearing your search filters.</p>
            <button
              onClick={() => handleTabClick('All')}
              className="mt-4 inline-flex items-center gap-1.5 bg-[#581923] text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Show All Designs</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
            {sortedProducts.map((item) => {
              const isWishlisted = wishlistItems.some(w => w.id === item.id);
              return (
                <div
                  key={item.id}
                  className="bg-[#FAF8F5] rounded-xl border border-[#E8DFC0] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Thumbnail Image Container */}
                  <div className="relative aspect-4/3 overflow-hidden bg-[#EFE8DC]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/product_gold_chain.jpg';
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold border ${getBadgeStyle(item.badgeType)}`}>
                        {item.badge}
                      </span>
                    </div>

                    {/* Wishlist Button Overlay */}
                    <button
                      onClick={() => onAddToWishlist(item)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-[#581923] shadow-md transition-transform active:scale-95 cursor-pointer"
                      title={isWishlisted ? "Item in Wishlist" : "Add to Wishlist"}
                      aria-label="Add to Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#D32F2F] text-[#D32F2F]' : ''}`} />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D2D]">
                        {item.purity || item.details}
                      </span>
                      <h3 className="font-serif text-base font-bold text-[#241716] group-hover:text-[#581923] transition-colors line-clamp-1 mt-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[#63574F] line-clamp-2 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#EAE2D5] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#7A6E65] block">Showroom Price</span>
                        <span className="font-serif text-lg font-bold text-[#48161E]">
                          {item.price}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onViewProduct(item)}
                          className="px-3 py-1.5 rounded-md border border-[#581923] text-[#581923] hover:bg-[#FAF0E1] text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => onAddToCart(item)}
                          className="px-3 py-1.5 rounded-md bg-[#581923] hover:bg-[#431219] text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
