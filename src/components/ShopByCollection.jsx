import React from 'react';

const collectionCategories = [
  {
    id: 'gold-chains',
    title: 'Gold Chains',
    description: 'Classic styles for every occasion.',
    image: '/images/products/gold/chains.jpg',
    categoryKey: 'chains'
  },
  {
    id: 'rings',
    title: 'Rings',
    description: 'Elegant details made to treasure.',
    image: '/images/products/gold/rings.jpg',
    categoryKey: 'rings'
  },
  {
    id: 'bangles',
    title: 'Bangles',
    description: 'Timeless gold for your everyday look.',
    image: '/images/product_bangles.jpg',
    categoryKey: 'bangles'
  },
  {
    id: 'necklaces',
    title: 'Necklaces',
    description: 'Beautiful designs to complete your look.',
    image: '/images/product_necklace.jpg',
    categoryKey: 'necklaces'
  },
  {
    id: 'temple-jewellery',
    title: 'Temple Jewellery',
    description: 'Heritage-inspired statement pieces.',
    image: '/images/col_handcrafted.jpg',
    categoryKey: 'temple'
  },
  {
    id: 'silver-pooja',
    title: 'Silver Pooja',
    description: 'Meaningful silver pieces for your rituals.',
    image: '/images/col_pooja.jpg',
    categoryKey: 'silver'
  }
];

export default function ShopByCollection({ onSelectCategory }) {
  return (
    <section className="bg-[#F8F4EC] py-10 sm:py-16 lg:py-24 border-b border-[#EAE2D5] select-none">
      <div className="max-w-[1400px] mx-auto px-3.5 xs:px-6 sm:px-8 lg:px-12">
        
        {/* Top Center Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 lg:mb-14">
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-[42px] font-semibold text-[#651F2B] tracking-tight leading-tight">
            Shop by Collection
          </h2>
          <p className="font-sans text-xs sm:text-base text-[#5A4840] font-normal tracking-wide mt-1.5 sm:mt-2.5">
            Find something special for every occasion.
          </p>
          <div className="flex items-center justify-center gap-2.5 sm:gap-3 mt-2.5 sm:mt-3.5">
            <span className="w-8 sm:w-12 h-[1px] bg-[#C49A45]/45" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#C49A45]" />
            <span className="w-8 sm:w-12 h-[1px] bg-[#C49A45]/45" />
          </div>
        </div>

        {/* 3-Column by 2-Row Balanced Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-7">
          {collectionCategories.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectCategory && onSelectCategory(item.categoryKey || item.title)}
              className="group relative bg-[#FFFDF9] hover:bg-white rounded-2xl sm:rounded-full border border-[#C49A45]/35 hover:border-[#218F95] p-2.5 sm:p-3.5 lg:p-4 flex items-center gap-3 sm:gap-5 shadow-[0_2px_12px_rgba(101,31,43,0.03)] hover:shadow-[0_8px_24px_rgba(33,143,149,0.12)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Product Thumbnail on the Left */}
              <div className="w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 lg:w-[82px] lg:h-[82px] rounded-full bg-[#FAF7F2] border border-[#C49A45]/30 group-hover:border-[#218F95]/50 overflow-hidden shrink-0 flex items-center justify-center p-0.5 sm:p-1 transition-colors duration-300">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-full group-hover:scale-108 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* Title & Description on the Right */}
              <div className="flex flex-col justify-center min-w-0 pr-2 xs:pr-3 sm:pr-6">
                <h3 className="font-serif text-[15px] xs:text-[17px] sm:text-[18px] lg:text-[19px] font-bold text-[#651F2B] group-hover:text-[#218F95] transition-colors duration-200 leading-snug">
                  {item.title}
                </h3>
                <p className="font-sans text-[11px] xs:text-xs sm:text-[13px] text-[#55453E] leading-relaxed mt-0.5 font-normal line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Subtle Teal Highlight on Hover */}
              <span className="absolute right-5 w-1.5 h-1.5 rounded-full bg-[#218F95] opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:inline-block" aria-hidden="true" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
