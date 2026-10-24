import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storefrontClient } from '../api/storefrontProductsClient';
import { Sparkles, ChevronRight, Gem, Shield, Heart, ShoppingBag, Layers, Eye } from 'lucide-react';

export default function CollectionsPage({
  searchQuery = '',
  onViewProduct = () => {},
  onAddToCart = () => {},
  onAddToWishlist = () => {},
  wishlistItems = []
}) {
  const navigate = useNavigate();
  const [activeCollectionTab, setActiveCollectionTab] = useState('All');
  const [activeCardImages, setActiveCardImages] = useState({});
  const [dbProducts, setDbProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  React.useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setApiError(null);

    storefrontClient.getStorefrontProducts({ page_size: 200 })
      .then(res => {
        if (!isMounted) return;
        if (res.success) {
          setDbProducts(res.items);
        } else {
          setApiError(res.error || 'Failed to load signature collections');
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

  const collectionLines = [
    {
      id: 'wedding',
      slug: 'wedding',
      title: 'Wedding Collections',
      subtitle: 'Grand Muhurtham Trousseau & Temple Bridal Sets',
      description: 'A majestic 22K antique gold multi-strand bridal haar featuring intricately sculpted dancing Mayura peacocks, natural unheated Burmese rubies, pota emerald beads, and cascading jhumki drops.',
      image: '/images/collections/collections-wedding-exclusive-01.jpg',
      artisan: 'Chettinad Nakshi Master Guild',
      productId: 'collections-wedding-exclusive-01'
    },
    {
      id: 'baby',
      slug: 'baby',
      title: 'Baby Collections',
      subtitle: 'Auspicious First Jewels & Hypoallergenic Charms',
      description: 'A skin-safe, hypoallergenic 22K gold protective baby bangle featuring smooth rounded edges, sacred Swastik charm, protective black enamel nazar beads, and an adjustable safety clasp.',
      image: '/images/collections/collections-baby-exclusive-01.jpg',
      artisan: 'Pediatric Safety Certified Goldsmiths',
      productId: 'collections-baby-exclusive-01'
    },
    {
      id: 'mens-accessories',
      slug: 'mens-accessories',
      title: 'Men’s Accessories',
      subtitle: 'Solid 22K Gold Kadas & Fine Masculine Heirlooms',
      description: 'A commanding solid 22K gold men’s kada crowned with dual sculpted lion (Simha) heads biting a central gold ring, flanked by deeply fluted torc ridges and brushed satin panels.',
      image: '/images/collections/collections-mens-exclusive-01.jpg',
      artisan: 'Royal Armoury Goldsmiths',
      productId: 'collections-mens-exclusive-01'
    },
    {
      id: 'girls-accessories',
      slug: 'girls-accessories',
      title: 'Girls’ Accessories',
      subtitle: 'Delicate Laser-Cut Charms & Lightweight Bracelets',
      description: 'A whimsical and lightweight 22K yellow gold charm bracelet designed for girls and teens, featuring three fluttering laser-cut butterflies with pink sapphire accents and Italian rolo chain.',
      image: '/images/collections/collections-girls-exclusive-01.jpg',
      artisan: 'Modern Micro-Laser Atelier',
      productId: 'collections-girls-exclusive-01'
    },
    {
      id: 'pooja-items',
      slug: 'pooja-items',
      title: 'Pooja Items',
      subtitle: 'Sacred Temple Vessels & Chased Deepam Lamps',
      description: 'A grand five-tier ceremonial oil lamp (deepam) hand-forged in 92.5 pure sterling silver, crowned with an ornamental peacock finial, floral oil wells, and Ashtalakshmi pedestal base.',
      image: '/images/collections/collections-pooja-exclusive-01.jpg',
      artisan: 'Swamimalai Temple Silversmith Guild',
      productId: 'collections-pooja-exclusive-01'
    },
    {
      id: 'silver-idols',
      slug: 'silver-idols',
      title: 'Silver Idol',
      subtitle: 'Sacred Lost-Wax Pure 925 Solid Silver Murtis',
      description: 'A majestic solid 92.5 pure silver idol of Lord Veera Anjaneya Hanuman standing in Abhaya blessing posture on an inverted double-lotus pedestal, holding the sacred Sanjeevani mountain and Gada mace.',
      image: '/images/collections/collections-silver-idol-exclusive-01.jpg',
      artisan: 'Devalaya Iconographic Sculptors',
      productId: 'collections-silver-idol-exclusive-01'
    },
    {
      id: 'gift-collection',
      slug: 'gift-collection',
      title: 'Gift Collection',
      subtitle: 'Cherished Pure 925 Hallmarked Silver Keepsakes',
      description: 'An auspicious pure 92.5 hallmarked silver bowl and spoon presentation set in royal red velvet and satin casing, handcrafted for timeless celebrations.',
      image: '/images/collections/collections-gift-02.jpg',
      artisan: 'Vedic Uphar Silversmith Guild',
      productId: 'collections-gift-exclusive-01'
    }
  ];

  const exclusiveProductIds = collectionLines.map(c => c.productId);

  // Filter products by active collection tab & search query
  const filteredProducts = dbProducts.filter(item => {
    // Search query check
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        (item.subCategory && item.subCategory.toLowerCase().includes(q)) ||
        (item.material && item.material.toLowerCase().includes(q)) ||
        (item.purity && item.purity.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (activeCollectionTab === 'All') {
      return exclusiveProductIds.includes(item.id);
    }

    if (activeCollectionTab === 'gift-collection' || activeCollectionTab === 'Gift Collection') {
      return (
        item.collection === 'gift-collection' ||
        item.subCategory === 'Gift Collection' ||
        item.subCategorySlug === 'gift-collection' ||
        item.id.startsWith('collections-gift-')
      );
    }

    const targetLine = collectionLines.find(c => c.id === activeCollectionTab || c.title === activeCollectionTab);
    if (targetLine) {
      return item.id === targetLine.productId;
    }

    return item.collection === activeCollectionTab;
  });

  const handleCardImageSelect = (productId, imageIndex) => {
    setActiveCardImages(prev => ({
      ...prev,
      [productId]: imageIndex
    }));
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8 sm:py-12 border-b border-[#EAE2D5]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-[#7A6E65] mb-4">
          <button onClick={() => navigate('/')} className="hover:text-[#581923] cursor-pointer">Home</button>
          <ChevronRight className="w-3.5 h-3.5 text-[#B38E46]" />
          <span className="font-semibold text-[#581923]">Signature Collections</span>
        </div>

        {/* Page Title & Intro */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#8C6D2D]">Artisanal Legacy</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#241716] mt-1">
            Signature Design Collections
          </h1>
          <p className="text-xs sm:text-sm text-[#73655C] mt-2 leading-relaxed">
            Each Vedha Radha collection tells a distinct story of South Indian heritage, ancient lost-wax casting, and hallmarked precious metals perfected across seven decades.
          </p>
        </div>

        {/* 6 Curated Collection Showcases */}
        <div className="space-y-8 mb-14">
          {collectionLines.map((col, idx) => (
            <div 
              key={col.id} 
              className={`bg-white rounded-2xl border border-[#E8DFC0] overflow-hidden shadow-xs flex flex-col ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'
              } items-stretch`}
            >
              <div className="lg:w-1/2 aspect-16/10 lg:aspect-auto overflow-hidden bg-[#ECE4D8] relative">
                <img 
                  src={col.image} 
                  alt={col.title} 
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#581923]/90 text-white text-[10.5px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
                    {col.artisan}
                  </span>
                </div>
              </div>

              <div className="lg:w-1/2 p-6 sm:p-10 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-[#8C6D2D] uppercase tracking-wider">
                    {col.subtitle}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#241716]">
                    {col.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#63574F] leading-relaxed pt-1">
                    {col.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F0E8DC] flex items-center justify-between">
                  <button
                    onClick={() => {
                      setActiveCollectionTab(col.id);
                      const el = document.getElementById('collection-items');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-[#581923] hover:bg-[#431219] text-white px-5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Explore {col.title}
                  </button>
                  <span className="text-xs text-[#8C6D2D] font-medium">100% Certified 916 / 925</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Collection Products Grid */}
        <div id="collection-items" className="pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#DECDBB]">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#241716]">
                {activeCollectionTab === 'All' ? 'All Exclusive Collection Pieces' : collectionLines.find(c => c.id === activeCollectionTab)?.title || activeCollectionTab}
              </h3>
              <p className="text-xs text-[#7A6E65] mt-0.5">
                Displaying exactly 1 exclusive mastercrafted design per collection, complete with 3 verified photographic perspectives.
              </p>
            </div>

            {/* Collection Filter Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setActiveCollectionTab('All')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                  activeCollectionTab === 'All'
                    ? 'bg-[#581923] text-white shadow-xs'
                    : 'bg-white text-[#4A403A] border border-[#DECDBB] hover:bg-[#F3EAD3]'
                }`}
              >
                All Collections
              </button>
              {collectionLines.map(c => (
                <button
                  key={c.id}
                  onClick={() => setActiveCollectionTab(c.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                    activeCollectionTab === c.id
                      ? 'bg-[#581923] text-white shadow-xs'
                      : 'bg-white text-[#4A403A] border border-[#DECDBB] hover:bg-[#F3EAD3]'
                  }`}
                >
                  {c.title}
                </button>
              ))}
            </div>
          </div>

          {apiError ? (
            <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-[#E8DFC0] my-8 shadow-xs max-w-2xl mx-auto space-y-3">
              <h3 className="font-serif text-xl font-bold text-[#8C1D28]">{apiError}</h3>
              <p className="text-xs text-[#7A6E65]">Please verify your backend connection or try again later.</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-[#E8DFC0] my-8 shadow-xs max-w-2xl mx-auto space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#F3EAD3] text-[#581923] flex items-center justify-center mx-auto">
                <Sparkles className="w-7 h-7 text-[#8C6D2D]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#241716]">No products available yet.</h3>
              <p className="text-xs text-[#63574F] leading-relaxed max-w-md mx-auto">
                There are currently no items available in this signature collection. New pieces will appear here as soon as they are added.
              </p>
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((item) => {
              const isWishlisted = wishlistItems.some(w => w.id === item.id);
              const isGiftCard = item.collection === 'gift-collection' || item.subCategory === 'Gift Collection' || !!item.suitableFor;
              const images = (!isGiftCard && item.images && item.images.length > 0) ? item.images : [item.image];
              const imgIndex = activeCardImages[item.id] || 0;
              const displayImage = images[imgIndex] || item.image;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-[#E8DFC0] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-[#EFE8DC]">
                    <img
                      src={displayImage}
                      alt={`${item.name} - View ${imgIndex + 1}`}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#DCF0DF] text-[#1E5C2D] border border-[#C1E3C6]">
                        {item.badge}
                      </span>
                    </div>

                    {/* View Indicator */}
                    {images.length > 1 && (
                      <div className="absolute top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-black/60 text-[#E5C278] text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          View {imgIndex + 1} of {images.length}
                        </span>
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={() => onAddToWishlist(item)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-[#581923] shadow-md cursor-pointer"
                      title={isWishlisted ? "Item in Wishlist" : "Add to Wishlist"}
                      aria-label={isWishlisted ? "Item in Wishlist" : "Add to Wishlist"}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#D32F2F] text-[#D32F2F]' : ''}`} />
                    </button>

                    {/* 3 Thumbnails Strip */}
                    {images.length > 1 && (
                      <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1.5 px-3 py-1 bg-black/40 backdrop-blur-xs rounded-full max-w-fit mx-auto">
                        {images.map((imgSrc, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCardImageSelect(item.id, idx);
                            }}
                            className={`relative w-8 h-8 rounded-md overflow-hidden border transition-all cursor-pointer ${
                              imgIndex === idx
                                ? 'border-[#FAF7F2] ring-2 ring-[#581923] scale-110'
                                : 'border-white/50 opacity-75 hover:opacity-100'
                            }`}
                            title={`Switch to View ${idx + 1}`}
                            aria-label={`View angle ${idx + 1}`}
                          >
                            <img
                              src={imgSrc}
                              alt={`Thumbnail ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
                    <div className="space-y-2">
                      {/* Category/Purity & Weight Header Row */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D2D] bg-[#FAF3E3] px-2 py-0.5 rounded border border-[#E8DFC0]/70 truncate">
                          {item.purity || item.details || item.material}
                        </span>
                        {item.weight && (
                          <span className="text-[10.5px] font-semibold text-[#581923] bg-[#FAF0E1] px-2 py-0.5 rounded border border-[#E0D2C0] shrink-0 whitespace-nowrap">
                            {item.weight}
                          </span>
                        )}
                      </div>

                      {/* Product Title */}
                      <h3 
                        onClick={() => onViewProduct(item)}
                        className="text-[15px] sm:text-base font-bold text-[#241716] group-hover:text-[#581923] transition-colors line-clamp-2 leading-snug cursor-pointer pt-0.5"
                        title={item.name}
                      >
                        {item.name}
                      </h3>

                      {/* Product Description */}
                      <p className="text-xs text-[#63574F] line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Suitable For Label - ONLY on relevant gift collection cards */}
                      {item.suitableFor && (
                        <div className="pt-1 flex items-center gap-2">
                          <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#8C6D2D] shrink-0">
                            Suitable For:
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FAF0E1] text-[#581923] border border-[#E0D2C0]">
                            {item.suitableFor}
                          </span>
                        </div>
                      )}

                      {/* Dimensions Specs Tag */}
                      {item.dimensions && (
                        <div className="pt-0.5">
                          <span className="inline-block text-[11px] text-[#63574F] bg-[#F7F2EA] px-2.5 py-0.5 rounded border border-[#E8DFC0]/70 max-w-full truncate" title={item.dimensions}>
                            <span className="font-semibold text-[#8C6D2D] mr-1">Dimensions:</span>
                            {item.dimensions}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Pricing & CTA Controls */}
                    <div className="mt-3 pt-3 border-t border-[#EAE2D5] flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-[#7A6E65] block font-medium">Showroom Price</span>
                        <span className="text-lg font-bold text-[#48161E]">{item.price}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => onViewProduct(item)}
                          className="px-3 py-1.5 rounded-lg border border-[#581923] text-[#581923] hover:bg-[#FAF0E1] text-xs font-semibold cursor-pointer flex items-center gap-1 transition-colors"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>
                        <button
                          onClick={() => onAddToCart(item)}
                          className="px-3 py-1.5 rounded-lg bg-[#581923] text-white hover:bg-[#431219] text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
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
    </div>
  );
}
