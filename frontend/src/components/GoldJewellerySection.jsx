import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, ChevronRight } from 'lucide-react';
import { goldCategories } from '../data/categoryData';
import { storefrontClient } from '../api/storefrontProductsClient';

export default function GoldJewellerySection({ onViewProduct }) {
  const navigate = useNavigate();
  const [dbProducts, setDbProducts] = React.useState([]);

  React.useEffect(() => {
    let isMounted = true;
    storefrontClient.getStorefrontProducts({ category: 'gold', page_size: 50 })
      .then(res => {
        if (isMounted && res.success) {
          setDbProducts(res.items);
        }
      })
      .catch(() => {});

    return () => { isMounted = false; };
  }, []);

  // Find matching product or fallback for each category
  const getCategoryProduct = (cat) => {
    return dbProducts.find(p => (
      p.category?.toLowerCase().includes('gold') &&
      (p.subCategorySlug === cat.slug || p.subCategory?.toLowerCase().includes(cat.slug) || p.subType === cat.slug)
    ));
  };

  return (
    <section className="relative w-full bg-[#FAF8F5] py-10 sm:py-16 border-b border-[#EAE2D5]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 text-[#8C6D2D] text-xs font-semibold uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Authentic 22K BIS 916 Hallmark</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#241716] tracking-tight">
              Gold Jewellery Collection
            </h2>
            <p className="text-xs sm:text-sm text-[#695D56] mt-1.5 max-w-2xl leading-relaxed">
              From majestic temple harams and antique jhumkas to daily wear pendants and chains—discover authentic 22K hallmarked masterpieces crafted with centuries of heritage.
            </p>
          </div>

          <Link
            to="/gold"
            className="inline-flex items-center gap-1.5 font-bold text-xs sm:text-sm text-[#581923] hover:text-[#3B1117] transition-colors border-b-2 border-[#C5A059] pb-0.5 group shrink-0"
          >
            <span>View All Gold</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Responsive Grid of Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {goldCategories.map((cat) => {
            const product = getCategoryProduct(cat);
            const hasSub = cat.subcategories && cat.subcategories.length > 0;

            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-[#E8DFC0] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Image Container */}
                <div 
                  className="relative aspect-4/3 overflow-hidden bg-[#FAF6EE] cursor-pointer"
                  onClick={() => navigate(cat.path)}
                >
                  <img
                    src={product?.image || cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#3B1117]/80 text-[#FAF6EE] backdrop-blur-xs border border-[#C5A059]/40 tracking-wide uppercase">
                      22K Gold
                    </span>
                  </div>

                  {product?.price && (
                    <div className="absolute bottom-3 right-3">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/95 text-[#581923] shadow-md border border-[#EAE2D5]">
                        From {product.price}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 
                        onClick={() => navigate(cat.path)}
                        className="text-lg font-bold text-[#241716] group-hover:text-[#581923] transition-colors cursor-pointer"
                      >
                        {cat.name}
                      </h3>
                      <button
                        onClick={() => navigate(cat.path)}
                        className="p-1 text-[#8C6D2D] hover:text-[#581923] cursor-pointer"
                        aria-label={`Explore ${cat.name}`}
                      >
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>

                    <p className="text-xs text-[#6E625B] line-clamp-2 mt-1 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  {/* Subcategory Pills or Direct Browse */}
                  <div>
                    {hasSub ? (
                      <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-[#F0EAE1]">
                        {cat.subcategories.slice(0, 3).map((sub) => (
                          <Link
                            key={sub.name}
                            to={sub.path}
                            className="px-2 py-0.5 rounded-md bg-[#FAF7F2] hover:bg-[#F3EAD3] text-[#4A3E38] hover:text-[#581923] text-[10.5px] font-medium border border-[#E8DFC0] transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                        {cat.subcategories.length > 3 && (
                          <Link
                            to={cat.path}
                            className="text-[10.5px] font-bold text-[#8C6D2D] hover:text-[#581923] px-1"
                          >
                            +{cat.subcategories.length - 3} more
                          </Link>
                        )}
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-[#F0EAE1] flex items-center justify-between">
                        <span className="text-[11px] text-[#8C6D2D] font-medium">Ready Stock Designs</span>
                        <Link
                          to={cat.path}
                          className="text-[11px] font-bold text-[#581923] hover:underline"
                        >
                          Explore &rarr;
                        </Link>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* Showroom Crafting Assurance Callout */}
        <div className="mt-10 sm:mt-12 p-6 rounded-2xl bg-gradient-to-r from-[#FFF9EE] via-[#FAF4E6] to-[#FFF9EE] border border-[#DECDBB] flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left shadow-xs">
          <div className="flex items-center gap-3.5 flex-col md:flex-row">
            <div className="w-12 h-12 rounded-full bg-[#581923] text-[#E5C278] flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#2C1D18]">
                Looking for Bespoke Traditional Masterpieces?
              </h4>
              <p className="text-xs text-[#695D56] mt-0.5">
                Our Mylapore goldsmiths accept custom bridal orders, temple deity harams, and heirloom gemstone settings.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/gold"
              className="bg-[#581923] hover:bg-[#431219] text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow transition-colors"
            >
              Explore All Gold
            </Link>
            <Link
              to="/contact"
              className="border border-[#581923] text-[#581923] hover:bg-[#FAF0E1] text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              Custom Order Inquiry
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
