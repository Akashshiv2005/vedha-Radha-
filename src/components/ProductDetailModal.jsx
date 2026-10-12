import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductDetailModal({ product, onClose, onAddToCart }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Reset active image index whenever a new product is selected
  useEffect(() => {
    setActiveImageIndex(0);
  }, [product?.id]);

  if (!product) return null;

  const imageList = (product.images && product.images.length > 0)
    ? product.images
    : (product.image ? [product.image] : []);

  const currentImage = imageList[activeImageIndex] || product.image;

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-[#FAF7F2] rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#E8DFC0] relative animate-scaleUp my-auto max-h-[92vh] overflow-y-auto cursor-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-30 bg-white/90 hover:bg-white text-[#4A403A] hover:text-[#581923] p-2 rounded-full shadow-md transition-colors cursor-pointer border border-[#EAE2D5]"
          aria-label="Close product details modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Interactive 3-View Product Gallery Showcase */}
          <div className="bg-[#FAF6EE] p-4 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#EAE2D5]">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white border border-[#E8DFC0] flex items-center justify-center shadow-xs">
              <img
                src={currentImage}
                alt={`${product.name} - View ${activeImageIndex + 1}`}
                className="w-full h-full object-contain p-2 transition-all duration-300"
              />

              {/* Status Badge */}
              {product.badge && (
                <div className="absolute top-3 left-3">
                  <span className="bg-[#FAF7F2]/95 backdrop-blur-xs text-[#581923] text-xs font-semibold px-2.5 py-1 rounded-full border border-[#DECDBB] shadow-2xs">
                    {product.badge}
                  </span>
                </div>
              )}

              {/* View Index Indicator */}
              {imageList.length > 1 && (
                <div className="absolute top-3 right-3">
                  <span className="bg-[#241716]/80 text-[#E5C278] text-[11px] font-medium px-2 py-0.5 rounded-md backdrop-blur-xs">
                    {activeImageIndex + 1} / {imageList.length}
                  </span>
                </div>
              )}

              {/* Prev / Next Carousel Controls */}
              {imageList.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-[#4A403A] hover:text-[#581923] shadow-md border border-[#EAE2D5] transition-transform active:scale-95 cursor-pointer"
                    aria-label="Previous image view"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-[#4A403A] hover:text-[#581923] shadow-md border border-[#EAE2D5] transition-transform active:scale-95 cursor-pointer"
                    aria-label="Next image view"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Navigation Row */}
            {imageList.length > 1 && (
              <div className="flex items-center justify-center gap-2.5 mt-3.5 pt-2">
                {imageList.map((imgSrc, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer bg-white ${
                      activeImageIndex === idx
                        ? 'border-[#581923] shadow-sm scale-105 ring-2 ring-[#581923]/20'
                        : 'border-[#E8DFC0] hover:border-[#8C6D2D] opacity-75 hover:opacity-100'
                    }`}
                    aria-label={`Switch to image view ${idx + 1}`}
                  >
                    <img
                      src={imgSrc}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-semibold text-center py-0.5 leading-none">
                      {idx === 0 ? 'Front' : idx === 1 ? 'Angle' : 'Detail'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Details & Specifications */}
          <div className="p-5 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[11px] uppercase tracking-widest text-[#8C6D2D] font-bold">
                  {product.category} Jewellery
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F4EFE6] text-[#63574F] capitalize">
                  {product.subType ? product.subType.replace(/-/g, ' ') : product.subCategory}
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#241716] mt-1 leading-snug">
                {product.name}
              </h3>
              
              <div className="mt-2 text-xl font-serif font-bold text-[#581923]">
                {product.price}
              </div>

              <p className="mt-3 text-xs sm:text-[13px] text-[#554A42] leading-relaxed">
                {product.description}
              </p>

              {/* Specifications table */}
              <div className="mt-4 pt-3 border-t border-[#E3DACB] space-y-2 text-xs text-[#4A403A]">
                <div className="flex justify-between py-0.5">
                  <span className="text-[#7A6E65]">Purity & Hallmark:</span>
                  <span className="font-semibold text-[#241716] text-right">{product.purity || product.details}</span>
                </div>
                {product.weight && (
                  <div className="flex justify-between py-0.5">
                    <span className="text-[#7A6E65]">Gross Weight:</span>
                    <span className="font-semibold text-[#241716]">{product.weight}</span>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex justify-between py-0.5">
                    <span className="text-[#7A6E65]">Dimensions:</span>
                    <span className="font-semibold text-[#241716] text-right">{product.dimensions}</span>
                  </div>
                )}
                {product.craftsmanship && (
                  <div className="flex justify-between py-0.5">
                    <span className="text-[#7A6E65]">Craftsmanship:</span>
                    <span className="font-semibold text-[#241716] text-right">{product.craftsmanship}</span>
                  </div>
                )}
                {product.certification && (
                  <div className="flex justify-between py-0.5">
                    <span className="text-[#7A6E65]">Certification:</span>
                    <span className="font-semibold text-[#241716] text-right">{product.certification}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-[#E3DACB] flex flex-col gap-2">
              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="w-full bg-[#581923] hover:bg-[#431219] text-white py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-colors duration-200 cursor-pointer text-center shadow-md flex items-center justify-center gap-2"
              >
                <span>Reserve Piece / Add to Bag</span>
              </button>
              
              <p className="text-[11px] text-center text-[#7A6E65] flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8C6D2D]" />
                <span>100% BIS 916 Hallmarked &bull; Lifetime Showroom Guarantee</span>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
