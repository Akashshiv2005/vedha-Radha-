import React from 'react';
import { X, Trash2, ShieldCheck, Lock, ArrowRight } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cartItems, onRemoveItem, onClearCart }) {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((acc, item) => acc + (item.numericPrice || 0), 0);

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fadeIn cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-[#FAF7F2] w-[88%] sm:w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-[#EAE2D5] animate-slideLeft cursor-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAE2D5] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg font-bold text-[#48161E]">Reserved Jewellery</h3>
            <span className="text-xs bg-[#581923] text-white px-2 py-0.5 rounded-full font-medium">
              {cartItems.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#4A403A] hover:text-[#581923] hover:bg-[#EAE2D5]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-serif text-base text-[#6E6056]">Your reservation bag is currently empty.</p>
              <p className="text-xs text-[#9C8F85] mt-1">Explore our collections and reserve your unique piece.</p>
            </div>
          ) : (
            <>
              <div className="bg-[#F8F2E8] p-3 rounded-md border border-[#E5D7C5] flex items-center gap-2 text-xs text-[#7A5826]">
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#8C6D2D]" />
                <span>Selected pieces are held exclusively for 15 minutes to guarantee availability.</span>
              </div>

              {cartItems.map((item, idx) => (
                <div 
                  key={`${item.id}-${idx}`}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#E8DFC0] shadow-2xs"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded bg-[#F4EFE6] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-xs sm:text-[13px] font-bold text-[#241716] truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-[#7A6E65]">{item.details}</p>
                    <p className="text-xs font-serif font-bold text-[#581923] mt-1">{item.price}</p>
                  </div>
                  <button
                    onClick={() => onRemoveItem(idx)}
                    className="text-[#9C8F85] hover:text-[#581923] p-1.5 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#EAE2D5] bg-[#FAF8F5] space-y-3">
            <div className="flex justify-between items-center text-sm font-semibold text-[#241716]">
              <span>Estimated Total:</span>
              <span className="font-serif text-base text-[#581923]">
                ₹ {totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
            
            <button
              onClick={() => alert('Demo notice: Checkout and order reservation is simulated for demo purposes. Please visit our Chennai showroom or contact our concierge.')}
              className="w-full bg-[#581923] hover:bg-[#431219] text-white py-2.5 rounded text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Proceed to Showroom Reservation</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
