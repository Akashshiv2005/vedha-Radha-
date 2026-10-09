import React from 'react';
import { X, Check, ShieldCheck, Sparkles, Award, MapPin } from 'lucide-react';

export default function ProductDetailModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-[#FAF7F2] rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E8DFC0] relative animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 bg-white/80 hover:bg-white text-[#4A403A] hover:text-[#581923] p-1.5 rounded-full shadow-xs transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Image showcase */}
          <div className="bg-[#EDE5D8] relative p-6 flex items-center justify-center min-h-[260px] md:min-h-[380px]">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-72 w-full object-contain drop-shadow-md rounded-md"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-[#FAF7F2]/90 backdrop-blur-xs text-[#581923] text-xs font-semibold px-2.5 py-1 rounded border border-[#DECDBB]">
                {product.badge}
              </span>
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#8C6D2D] font-semibold">
                {product.category} Jewellery
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#241716] mt-1 leading-snug">
                {product.name}
              </h3>
              
              <div className="mt-2 text-lg sm:text-xl font-serif font-bold text-[#581923]">
                {product.price}
              </div>

              <p className="mt-3 text-xs sm:text-[13px] text-[#554A42] leading-relaxed">
                {product.description}
              </p>

              {/* Specifications table */}
              <div className="mt-4 pt-3 border-t border-[#E3DACB] space-y-1.5 text-xs text-[#4A403A]">
                <div className="flex justify-between py-0.5">
                  <span className="text-[#7A6E65]">Purity & Hallmark:</span>
                  <span className="font-medium text-[#241716] text-right">{product.purity}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-[#7A6E65]">Gross Weight:</span>
                  <span className="font-medium text-[#241716]">{product.weight}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-[#7A6E65]">Dimensions:</span>
                  <span className="font-medium text-[#241716]">{product.dimensions}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-[#7A6E65]">Art Style:</span>
                  <span className="font-medium text-[#241716]">{product.craftsmanship}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-[#E3DACB] flex flex-col gap-2">
              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="w-full bg-[#581923] hover:bg-[#431219] text-white py-2.5 px-4 rounded text-xs font-semibold tracking-wide transition-colors duration-200 cursor-pointer text-center shadow-xs"
              >
                Reserve Piece / Add to Bag
              </button>
              
              <p className="text-[11px] text-center text-[#7A6E65] flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B38E46]" />
                Held exclusively for you during checkout
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
