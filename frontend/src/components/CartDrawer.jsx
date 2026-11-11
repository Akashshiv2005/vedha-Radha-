import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { cartClient } from '../api/cartClient.js';
import { getProductUrl } from '../utils/productSlug.js';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems = [],
  onRemoveItem = () => {},
  onUpdateQuantity = null,
  onClearCart = () => {},
  totalAmount = 0,
}) {
  const navigate = useNavigate();
  const [updatingId, setUpdatingId] = useState(null);

  if (!isOpen) return null;

  const totalItemCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const calculatedTotal = totalAmount > 0
    ? totalAmount
    : cartItems.reduce((acc, item) => acc + (item.numericPrice || 0) * (item.quantity || 1), 0);

  const handleQuantityChange = async (item, delta) => {
    const currentQty = Number(item.quantity || 1);
    const newQty = currentQty + delta;
    if (newQty < 1) return;

    if (item.isUnique && delta > 0) return;

    if (item.stockQuantity && newQty > item.stockQuantity) {
      alert(`Only ${item.stockQuantity} piece(s) available in inventory.`);
      return;
    }

    setUpdatingId(item.id);
    try {
      if (onUpdateQuantity) {
        await onUpdateQuantity(item, newQty);
      } else {
        const res = await cartClient.updateQuantity(item.id, newQty);
        if (!res.success && res.error) {
          alert(res.error);
        }
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleViewCart = () => {
    onClose();
    navigate('/cart');
  };

  const handleProceedCheckout = () => {
    onClose();
    navigate('/checkout');
  };

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
            <h3 className="text-lg font-serif font-bold text-[#48161E]">Shopping Cart</h3>
            <span className="text-xs bg-[#581923] text-white px-2 py-0.5 rounded-full font-medium">
              {totalItemCount}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#4A403A] hover:text-[#581923] hover:bg-[#EAE2D5] cursor-pointer transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3">
              <div className="w-12 h-12 bg-[#F3ECE4] text-[#8C6D2D] rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-base font-medium text-[#6E6056]">Your shopping cart is currently empty.</p>
              <p className="text-xs text-[#9C8F85] max-w-xs mx-auto">
                Explore our hallmarked gold and silver collections to add authentic handcrafted jewellery.
              </p>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div 
                key={item.id ? `${item.id}-${idx}` : `item-${idx}`}
                className="flex items-start gap-3 p-3 bg-white rounded-lg border border-[#E8DFC0] shadow-2xs hover:border-[#D4AF37]/50 transition-colors"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  onClick={() => {
                    const url = getProductUrl(item);
                    if (url) {
                      navigate(url);
                      onClose();
                    }
                  }}
                  className="w-16 h-16 object-cover rounded bg-[#F4EFE6] shrink-0 border border-[#EFE8DD] mt-0.5 cursor-pointer hover:opacity-90 transition-opacity"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/neutral_product_placeholder.svg';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 
                      onClick={() => {
                        const url = getProductUrl(item);
                        if (url) {
                          navigate(url);
                          onClose();
                        }
                      }}
                      className="text-xs sm:text-[13px] font-bold text-[#241716] truncate pr-1 cursor-pointer hover:text-[#581923] transition-colors"
                    >
                      {item.name}
                    </h4>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item, idx)}
                      className="text-[#9C8F85] hover:text-[#581923] p-1 transition-colors cursor-pointer rounded hover:bg-[#F9F5F0] shrink-0 -mr-1 -mt-1"
                      title="Remove item"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-[11px] text-[#7A6E65] truncate">{item.details}</p>

                  <div className="flex items-center justify-between gap-2 mt-2 pt-1.5 border-t border-[#F5EFE6]">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#581923]">
                        ₹ {((item.numericPrice || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-[10px] text-[#8C7A70]">
                          (₹ {(item.numericPrice || 0).toLocaleString('en-IN')} each)
                        </p>
                      )}
                      {item.priceChanged && (
                        <span className="text-[9.5px] bg-amber-50 text-amber-800 border border-amber-200 px-1 py-0.2 rounded font-medium inline-block mt-0.5">
                          Updated rate
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.isUnique && (
                        <span className="text-[9.5px] bg-[#FAF3EA] text-[#8C6D2D] border border-[#E8DFC0] px-1.5 py-0.5 rounded font-medium whitespace-nowrap">
                          Unique Item
                        </span>
                      )}

                      {/* Compact quantity stepper: − 1 + */}
                      <div 
                        className={`inline-flex items-center bg-[#F7F4EF] border border-[#E2D9CC] rounded ${
                          item.isUnique ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item, -1)}
                          disabled={item.isUnique || (item.quantity || 1) <= 1 || updatingId === item.id}
                          className="w-6 h-6 flex items-center justify-center text-xs font-bold text-[#4A403A] hover:text-[#581923] hover:bg-[#EBE4D8] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors select-none"
                          title={item.isUnique ? 'Unique authentic piece: fixed quantity of 1' : 'Decrease quantity'}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-xs font-semibold text-[#241716] select-none">
                          {item.quantity || 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item, 1)}
                          disabled={
                            item.isUnique || 
                            (item.stockQuantity && (item.quantity || 1) >= item.stockQuantity) ||
                            updatingId === item.id
                          }
                          className="w-6 h-6 flex items-center justify-center text-xs font-bold text-[#4A403A] hover:text-[#581923] hover:bg-[#EBE4D8] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors select-none"
                          title={
                            item.isUnique 
                              ? 'Unique authentic piece: fixed quantity of 1' 
                              : (item.stockQuantity && (item.quantity || 1) >= item.stockQuantity)
                                ? `Maximum available stock (${item.stockQuantity}) reached`
                                : 'Increase quantity'
                          }
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#EAE2D5] bg-[#FAF8F5] space-y-4">
            <div className="flex justify-between items-center text-sm font-semibold text-[#241716]">
              <span className="text-[#1A1A1A] text-lg font-serif">Subtotal:</span>
              <span className="text-xl font-bold text-[#1A1A1A]">
                ₹ {calculatedTotal.toLocaleString('en-IN')}
              </span>
            </div>
            
            {/* Dual action buttons matching Reference Image 2: VIEW CART and CHECKOUT */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={handleViewCart}
                className="w-full bg-[#1F1F1F] hover:bg-black text-white py-3.5 px-3 rounded text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer text-center shadow-xs active:scale-[0.99]"
              >
                VIEW CART
              </button>
              <button
                type="button"
                onClick={handleProceedCheckout}
                className="w-full bg-[#BA8369] hover:bg-[#A87259] text-white py-3.5 px-3 rounded text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer text-center shadow-xs active:scale-[0.99]"
              >
                CHECKOUT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
