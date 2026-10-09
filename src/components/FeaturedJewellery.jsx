import React from 'react';
import { ArrowRight } from 'lucide-react';
import { products } from '../data/products';

export default function FeaturedJewellery({ 
  searchQuery, 
  onViewDetails, 
  onViewAllClick 
}) {
  // Filter products by search query if any
  const filteredProducts = products.filter(item => {
    if (!searchQuery) return true;
    return (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
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
    <section className="bg-[#FAF7F2] py-8 sm:py-10 border-b border-[#EAE2D5]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-row items-center justify-between gap-4 mb-5 sm:mb-6">
          <h2 className="font-serif text-2xl sm:text-[26px] font-semibold text-[#241716] tracking-tight">
            Featured Jewellery
          </h2>
          <button 
            onClick={onViewAllClick}
            className="group flex items-center gap-1.5 text-xs sm:text-[13px] font-medium text-[#48161E] hover:text-[#73222E] transition-colors cursor-pointer"
          >
            <span>View all products</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-[#F6EFE6] rounded-lg p-8 text-center border border-[#E3DACB]">
            <p className="font-serif text-lg text-[#4A403A]">No jewellery matching "{searchQuery}"</p>
            <p className="text-xs text-[#7A6E65] mt-1">Try searching for Gold, Silver, Necklace, Anklet, or Bangles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            {filteredProducts.map((item) => (
              <div
                key={item.id}
                className="bg-[#FAF8F5] rounded-lg border border-[#E8DFC0]/70 p-3 sm:p-3.5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-row gap-3 sm:gap-4 items-center group"
              >
                {/* Product Image Thumbnail */}
                <div className="w-28 sm:w-32 h-28 sm:h-32 rounded-md overflow-hidden bg-[#ECE4D8] shrink-0 border border-[#E2D8C7] relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Product Details (Right side of card) */}
                <div className="flex flex-col justify-between flex-1 min-w-0 h-full py-0.5">
                  <div>
                    {/* Status Badge */}
                    <div className="flex items-center mb-1.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-medium border ${getBadgeStyle(
                          item.badgeType
                        )}`}
                      >
                        {item.badge}
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="font-serif text-[14px] sm:text-[15px] font-bold text-[#241716] leading-snug line-clamp-2 group-hover:text-[#581923] transition-colors">
                      {item.name}
                    </h3>

                    {/* Details / Metal Quality */}
                    <p className="text-[11px] sm:text-xs text-[#7A6E65] font-sans mt-0.5">
                      {item.details}
                    </p>
                  </div>

                  {/* Price and Action Button */}
                  <div className="mt-2 pt-1.5 flex flex-col gap-1.5">
                    <p className="font-serif text-sm sm:text-[15px] font-bold text-[#351218]">
                      {item.price}
                    </p>
                    <div>
                      <button
                        onClick={() => onViewDetails(item)}
                        className="w-full bg-[#581923] hover:bg-[#431219] text-[#FAF7F2] text-[11px] font-medium py-1.5 px-3 rounded shadow-xs hover:shadow transition-all duration-200 text-center cursor-pointer"
                      >
                        View Details
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
