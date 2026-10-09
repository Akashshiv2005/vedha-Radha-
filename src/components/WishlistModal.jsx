import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export default function WishlistModal({
  isOpen,
  onClose,
  wishlistItems = [],
  onRemoveFromWishlist = () => {},
  onMoveToBag = () => {},
  onViewProduct = () => {}
}) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wishlist-modal-title"
    >
      <div 
        className="bg-[#FAF7F2] rounded-xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E8DFC0] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#581923] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E6C37A]/20 flex items-center justify-center text-[#E6C37A]">
              <Heart className="w-4 h-4 fill-[#E6C37A]" />
            </div>
            <div>
              <h3 id="wishlist-modal-title" className="font-serif text-lg font-bold">
                My Saved Wishlist ({wishlistItems.length})
              </h3>
              <p className="text-[11px] text-[#E6C37A]">Vedha Radha Thanga Maaligai</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close wishlist dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items Content */}
        <div className="p-6 max-h-[65vh] overflow-y-auto">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#F3EAD3] text-[#8C6D2D] flex items-center justify-center mb-3">
                <Heart className="w-7 h-7" />
              </div>
              <h4 className="font-serif text-base font-bold text-[#241716]">Your wishlist is currently empty</h4>
              <p className="text-xs text-[#7A6E65] mt-1 max-w-xs mx-auto">
                Explore our fine gold & 92.5 silver collections and save your favorite heirloom pieces.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {wishlistItems.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="bg-white rounded-lg border border-[#E8DFC0] p-3.5 flex items-center justify-between gap-3 shadow-2xs hover:shadow-sm transition-all"
                >
                  <div className="w-16 h-16 rounded-md bg-[#FAF7F2] overflow-hidden shrink-0 border border-[#E8DFC0]">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-xs font-bold text-[#241716] truncate">
                      {item.name}
                    </h4>
                    <p className="text-[10.5px] text-[#7A6E65]">{item.details}</p>
                    <p className="font-serif font-bold text-xs text-[#581923] mt-0.5">
                      {item.price}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <button
                      onClick={() => onMoveToBag(item, idx)}
                      className="bg-[#581923] hover:bg-[#431219] text-white px-3 py-1.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Move to Bag</span>
                    </button>
                    <button
                      onClick={() => onRemoveFromWishlist(idx)}
                      className="text-[#9C8F85] hover:text-[#B3261E] text-[10.5px] flex items-center gap-1 p-0.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F5EFE6] border-t border-[#E3DACB] flex items-center justify-between">
          <span className="text-[11px] text-[#7A6E65]">
            100% BIS Hallmarked Purity Guaranteed
          </span>
          <button
            onClick={onClose}
            className="bg-[#581923] text-white px-4 py-1.5 rounded text-xs font-semibold hover:bg-[#431219] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
