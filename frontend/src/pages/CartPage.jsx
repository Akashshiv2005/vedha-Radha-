import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  Tag, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { cartClient } from '../api/cartClient.js';
import { getProductUrl } from '../utils/productSlug.js';

export default function CartPage({ onCartUpdated = () => {} }) {
  const navigate = useNavigate();

  // State
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [cart, setCart] = useState({
    items: [],
    itemCount: 0,
    subtotal: 0,
    couponDiscount: 0,
    tax: 0,
    deliveryCharge: 0,
    cartTotal: 0,
    appliedCouponCode: null,
    couponDetails: null,
  });

  // Coupon input state
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState(null); // { type: 'success' | 'error', message: string }
  const [statusNotice, setStatusNotice] = useState(null);

  const fetchCartData = useCallback(async (showNotice = null) => {
    try {
      const res = await cartClient.getCart();
      if (res.success) {
        setCart({
          items: res.items || [],
          itemCount: res.itemCount || 0,
          subtotal: res.subtotal || 0,
          couponDiscount: res.couponDiscount || 0,
          tax: res.tax || 0,
          deliveryCharge: res.deliveryCharge || 0,
          cartTotal: res.cartTotal || res.totalAmount || 0,
          appliedCouponCode: res.appliedCouponCode || null,
          couponDetails: res.couponDetails || null,
        });
        if (res.appliedCouponCode) {
          setCouponInput(res.appliedCouponCode);
        }
        onCartUpdated(res.items);
      }
      if (showNotice) {
        setStatusNotice(showNotice);
        setTimeout(() => setStatusNotice(null), 4000);
      }
    } catch (err) {
      console.warn('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
      setActionLoading(false);
    }
  }, [onCartUpdated]);

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  // Handle quantity modification
  const handleUpdateQuantity = async (itemId, currentQty, delta, isUnique) => {
    if (isUnique && delta > 0) {
      setCouponFeedback({
        type: 'error',
        message: 'This authentic handcrafted jewellery piece is unique. Only 1 piece is available.',
      });
      setTimeout(() => setCouponFeedback(null), 4000);
      return;
    }

    const newQty = currentQty + delta;
    if (newQty < 1) {
      // Removing item if quantity dropped below 1
      handleRemoveItem(itemId);
      return;
    }

    setActionLoading(true);
    setCouponFeedback(null);
    try {
      const res = await cartClient.updateQuantity(itemId, newQty);
      if (res.success) {
        setCart({
          items: res.items || [],
          itemCount: res.itemCount || 0,
          subtotal: res.subtotal || 0,
          couponDiscount: res.couponDiscount || 0,
          tax: res.tax || 0,
          deliveryCharge: res.deliveryCharge || 0,
          cartTotal: res.cartTotal || res.totalAmount || 0,
          appliedCouponCode: res.appliedCouponCode || null,
          couponDetails: res.couponDetails || null,
        });
        onCartUpdated(res.items);
      } else {
        setCouponFeedback({
          type: 'error',
          message: res.error || 'Failed to update quantity.',
        });
      }
    } catch {
      setCouponFeedback({ type: 'error', message: 'Network error updating quantity.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle removing single item
  const handleRemoveItem = async (itemId) => {
    setActionLoading(true);
    setCouponFeedback(null);
    try {
      const res = await cartClient.removeItem(itemId);
      if (res.success) {
        setCart({
          items: res.items || [],
          itemCount: res.itemCount || 0,
          subtotal: res.subtotal || 0,
          couponDiscount: res.couponDiscount || 0,
          tax: res.tax || 0,
          deliveryCharge: res.deliveryCharge || 0,
          cartTotal: res.cartTotal || res.totalAmount || 0,
          appliedCouponCode: res.appliedCouponCode || null,
          couponDetails: res.couponDetails || null,
        });
        onCartUpdated(res.items);
        setStatusNotice('Item removed from cart.');
        setTimeout(() => setStatusNotice(null), 3500);
      } else {
        setCouponFeedback({
          type: 'error',
          message: res.error || 'Failed to remove item.',
        });
      }
    } catch {
      setCouponFeedback({ type: 'error', message: 'Network error removing item.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle applying coupon code
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponFeedback({ type: 'error', message: 'Please enter a coupon code.' });
      return;
    }

    setActionLoading(true);
    setCouponFeedback(null);
    try {
      const res = await cartClient.applyCoupon(code);
      if (res.success) {
        setCart({
          items: res.items || [],
          itemCount: res.itemCount || 0,
          subtotal: res.subtotal || 0,
          couponDiscount: res.couponDiscount || 0,
          tax: res.tax || 0,
          deliveryCharge: res.deliveryCharge || 0,
          cartTotal: res.cartTotal || res.totalAmount || 0,
          appliedCouponCode: res.appliedCouponCode || null,
          couponDetails: res.couponDetails || null,
        });
        onCartUpdated(res.items);
        setCouponFeedback({
          type: 'success',
          message: `Coupon "${code}" applied successfully! You saved ₹${Number(res.couponDiscount || 0).toLocaleString('en-IN')}.`,
        });
      } else {
        setCouponFeedback({
          type: 'error',
          message: res.error || 'Invalid or ineligible coupon code.',
        });
      }
    } catch {
      setCouponFeedback({ type: 'error', message: 'Network error applying coupon code.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle removing coupon code
  const handleRemoveCoupon = async () => {
    setActionLoading(true);
    setCouponFeedback(null);
    try {
      const res = await cartClient.removeCoupon();
      if (res.success) {
        setCart({
          items: res.items || [],
          itemCount: res.itemCount || 0,
          subtotal: res.subtotal || 0,
          couponDiscount: 0,
          tax: res.tax || 0,
          deliveryCharge: res.deliveryCharge || 0,
          cartTotal: res.cartTotal || res.totalAmount || 0,
          appliedCouponCode: null,
          couponDetails: null,
        });
        setCouponInput('');
        onCartUpdated(res.items);
        setCouponFeedback({
          type: 'success',
          message: 'Coupon code removed.',
        });
        setTimeout(() => setCouponFeedback(null), 3000);
      } else {
        setCouponFeedback({
          type: 'error',
          message: res.error || 'Failed to remove coupon.',
        });
      }
    } catch {
      setCouponFeedback({ type: 'error', message: 'Network error removing coupon.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle manual "UPDATE CART" click
  const handleUpdateCart = async () => {
    setActionLoading(true);
    setCouponFeedback(null);
    await fetchCartData('Cart updated with latest live jewellery bullion rates.');
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FAF7F2] p-6">
        <div className="w-12 h-12 border-3 border-[#C49A45]/30 border-t-[#581923] rounded-full animate-spin mb-4" />
        <p className="text-[#581923] font-serif tracking-wider text-sm font-medium">
          Loading your Shopping Cart...
        </p>
      </div>
    );
  }

  const hasItems = cart.items && cart.items.length > 0;

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#8C7A70]">
          <Link to="/" className="hover:text-[#581923] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#3A2D25] font-semibold">Shopping Cart</span>
        </nav>

        {/* Status Notifications */}
        {statusNotice && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-md flex items-center gap-2 text-xs sm:text-sm animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{statusNotice}</span>
          </div>
        )}

        {couponFeedback && (
          <div 
            className={`px-4 py-3 rounded-md flex items-center gap-2 text-xs sm:text-sm animate-fadeIn ${
              couponFeedback.type === 'success' 
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}
          >
            {couponFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <span>{couponFeedback.message}</span>
          </div>
        )}

        {!hasItems ? (
          /* Empty Cart State */
          <div className="bg-white border border-[#EAE2D5] rounded-xl p-8 sm:p-16 text-center space-y-5 shadow-xs">
            <div className="w-16 h-16 bg-[#F5EFE6] text-[#8C6D2D] rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-serif font-bold text-[#3A2D25]">
                Your Shopping Cart is Empty
              </h2>
              <p className="text-sm text-[#7A6E65] max-w-md mx-auto">
                Discover our signature hallmarked gold and sterling silver collections to add exquisite jewellery to your cart.
              </p>
            </div>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/gold"
                className="inline-flex items-center gap-2 bg-[#581923] hover:bg-[#431219] text-white px-6 py-3 rounded text-xs font-semibold tracking-wider uppercase transition-colors"
              >
                <span>Explore Gold</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/silver"
                className="inline-flex items-center gap-2 bg-[#FAF7F2] hover:bg-[#F3ECE4] text-[#3A2D25] border border-[#D5C7B7] px-6 py-3 rounded text-xs font-semibold tracking-wider uppercase transition-colors"
              >
                <span>Explore Silver</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Cart Content Matching Reference Image 3 */
          <div className="space-y-10">
            {/* Page Heading matching Reference Image 3 */}
            <div className="border-b border-[#EAE2D5] pb-4">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1613] tracking-tight">
                Cart Summary
              </h1>
            </div>

            {/* Product Table Container */}
            <div className="bg-white border border-[#EAE2D5] rounded-lg shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#EAE2D5] text-[#2C2420] text-xs sm:text-sm font-semibold bg-[#FAF8F5]">
                      <th className="py-4 px-3 sm:px-4 w-12 text-center" aria-label="Remove item"></th>
                      <th className="py-4 px-3 sm:px-4">Product</th>
                      <th className="py-4 px-3 sm:px-4 text-center sm:text-left">Price</th>
                      <th className="py-4 px-3 sm:px-4 text-center">Quantity</th>
                      <th className="py-4 px-3 sm:px-6 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE2D5] text-sm">
                    {cart.items.map((item, idx) => {
                      const itemSubtotal = item.itemSubtotal || (item.numericPrice * item.quantity);
                      const isUniqueLocked = Boolean(item.isUnique);

                      return (
                        <tr 
                          key={item.id ? `${item.id}-${idx}` : `item-${idx}`} 
                          className="hover:bg-[#FCFAF7] transition-colors"
                        >
                          {/* Column 1: Red 'x' Remove Icon matching Reference Image 3 */}
                          <td className="py-5 px-3 sm:px-4 text-center align-middle">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={actionLoading}
                              className="text-[#DC2626] hover:text-[#991B1B] text-xl font-bold leading-none p-1 rounded hover:bg-rose-50 transition-colors cursor-pointer inline-flex items-center justify-center w-7 h-7"
                              title={`Remove ${item.name}`}
                              aria-label={`Remove ${item.name}`}
                            >
                              ×
                            </button>
                          </td>

                          {/* Column 2: Product Thumbnail & Name */}
                          <td className="py-5 px-3 sm:px-4 align-middle">
                            <div className="flex items-center gap-3 sm:gap-4">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded bg-[#F4EFE6] border border-[#EAE2D5] shrink-0"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/images/neutral_product_placeholder.svg';
                                }}
                              />
                              <div className="min-w-0 space-y-1">
                                <Link
                                  to={getProductUrl(item)}
                                  className="font-medium text-[#2C2420] hover:text-[#581923] text-sm sm:text-base line-clamp-2 transition-colors"
                                >
                                  {item.name}
                                </Link>
                                <div className="flex flex-wrap items-center gap-2 text-xs text-[#8C7A70]">
                                  {item.sku && <span>SKU: {item.sku}</span>}
                                  {isUniqueLocked && (
                                    <span className="bg-[#FAF3EA] text-[#8C6D2D] border border-[#E8DFC0] text-[10px] px-2 py-0.5 rounded-full font-medium">
                                      Unique Piece (Qty: 1)
                                    </span>
                                  )}
                                  {item.priceChanged && (
                                    <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] px-1.5 py-0.2 rounded font-medium">
                                      Rate Updated
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Column 3: Price in Bold matching Reference Image 3 */}
                          <td className="py-5 px-3 sm:px-4 align-middle whitespace-nowrap text-center sm:text-left">
                            <span className="font-bold text-[#2D1C59] sm:text-[#241716] text-sm sm:text-base">
                              ₹{item.numericPrice.toLocaleString('en-IN')}
                            </span>
                          </td>

                          {/* Column 4: Quantity Control [-  qty  +] matching Reference Image 3 */}
                          <td className="py-5 px-3 sm:px-4 align-middle text-center whitespace-nowrap">
                            <div className="inline-flex items-center bg-[#F5F5F5] border border-[#E0E0E0] rounded">
                              <button
                                type="button"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity, -1, isUniqueLocked)}
                                disabled={actionLoading}
                                className="w-8 h-8 flex items-center justify-center text-[#555] hover:text-black hover:bg-[#EBEBEB] transition-colors cursor-pointer disabled:opacity-50 text-sm font-bold"
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span className="w-9 text-center text-xs sm:text-sm font-semibold text-[#2C2420] select-none">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity, 1, isUniqueLocked)}
                                disabled={actionLoading || isUniqueLocked}
                                className={`w-8 h-8 flex items-center justify-center text-[#555] text-sm font-bold transition-colors ${
                                  isUniqueLocked 
                                    ? 'opacity-30 cursor-not-allowed bg-transparent' 
                                    : 'hover:text-black hover:bg-[#EBEBEB] cursor-pointer'
                                }`}
                                title={isUniqueLocked ? 'Unique authentic piece: maximum quantity is 1' : 'Increase quantity'}
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          {/* Column 5: Subtotal in Bold matching Reference Image 3 */}
                          <td className="py-5 px-3 sm:px-6 align-middle text-right whitespace-nowrap">
                            <span className="font-bold text-[#2D1C59] sm:text-[#581923] text-sm sm:text-base">
                              ₹{itemSubtotal.toLocaleString('en-IN')}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Below Table Row matching Reference Image 3 */}
              <div className="p-4 sm:p-5 bg-white border-t border-[#EAE2D5] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                {/* Coupon Code Input & Apply Button */}
                <form 
                  onSubmit={handleApplyCoupon} 
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-md w-full"
                >
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Coupon code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      disabled={actionLoading}
                      className="w-full border border-[#D5C7B7] bg-[#FAF8F5] px-3.5 py-2.5 text-xs sm:text-sm rounded text-[#2C2420] placeholder-[#9C8F85] focus:outline-none focus:border-[#BA8369] focus:bg-white transition-colors uppercase font-mono tracking-wider"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="bg-[#BA8369] hover:bg-[#A87259] text-white px-5 py-2.5 rounded text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer text-center shrink-0 disabled:opacity-50"
                  >
                    APPLY COUPON
                  </button>
                </form>

                {/* Right Action: UPDATE CART matching Reference Image 3 */}
                <div className="flex items-center justify-end gap-3 pt-2 md:pt-0">
                  <button
                    type="button"
                    onClick={handleUpdateCart}
                    disabled={actionLoading}
                    className="text-xs font-bold tracking-wider uppercase text-[#1C1613] hover:text-[#581923] underline decoration-1 underline-offset-4 cursor-pointer transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${actionLoading ? 'animate-spin' : ''}`} />
                    <span>UPDATE CART</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Active Coupon Badge if Applied */}
            {cart.appliedCouponCode && (
              <div className="bg-[#FAF4ED] border border-[#E5D7C5] p-3.5 rounded-lg flex items-center justify-between gap-3 text-xs sm:text-sm text-[#4A392F]">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#BA8369]" />
                  <span>
                    Promotional coupon <strong>{cart.appliedCouponCode}</strong> applied (You save ₹{cart.couponDiscount.toLocaleString('en-IN')})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  disabled={actionLoading}
                  className="text-[#DC2626] hover:text-[#991B1B] text-xs font-bold underline cursor-pointer"
                >
                  Remove Coupon
                </button>
              </div>
            )}

            {/* Cart Summary & Checkout Totals Container */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Trust Badges & Complimentary Services */}
              <div className="lg:col-span-7 bg-[#FAF8F5] border border-[#EAE2D5] rounded-lg p-5 sm:p-6 space-y-4">
                <h3 className="text-sm font-serif font-bold text-[#3A2D25] tracking-wide uppercase flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C49A45]" />
                  <span>The Vedha Radha Guarantee</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#6B5C52]">
                  <div className="flex items-start gap-2.5 p-2 bg-white rounded border border-[#EDE4D8]">
                    <ShieldCheck className="w-5 h-5 text-[#581923] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#2C2420]">100% BIS Hallmarked</p>
                      <p className="text-[11px] text-[#8C7A70]">HUID engraved authentic assay certification.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 bg-white rounded border border-[#EDE4D8]">
                    <Truck className="w-5 h-5 text-[#581923] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#2C2420]">Complimentary Insured Shipping</p>
                      <p className="text-[11px] text-[#8C7A70]">Sealed, tamper-evident armored courier.</p>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-[#8C7A70] leading-relaxed">
                  Prices are updated real-time adhering strictly to government assay benchmark rates. Every order is covered by our full transit guarantee.
                </p>
              </div>

              {/* Right Column: Order Totals & Action Buttons */}
              <div className="lg:col-span-5 bg-white border border-[#EAE2D5] rounded-lg p-5 sm:p-6 shadow-xs space-y-5">
                <h3 className="text-lg font-serif font-bold text-[#1C1613] pb-3 border-b border-[#EAE2D5]">
                  Cart Totals
                </h3>

                <div className="space-y-3 text-xs sm:text-sm text-[#4A3D36]">
                  {/* Subtotal */}
                  <div className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#1C1613]">
                      ₹{cart.subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Coupon Discount if applied */}
                  {cart.couponDiscount > 0 && (
                    <div className="flex justify-between items-center text-emerald-700 font-medium">
                      <span>Coupon Discount ({cart.appliedCouponCode})</span>
                      <span>- ₹{cart.couponDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {/* Applicable Taxes (GST 3%) */}
                  <div className="flex justify-between items-center">
                    <span>Applicable GST (3%)</span>
                    <span className="font-semibold text-[#1C1613]">
                      ₹{cart.tax.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between items-center">
                    <span>Insured Delivery</span>
                    <span className="font-semibold text-emerald-700">
                      {cart.deliveryCharge === 0 ? 'Complimentary' : `₹${cart.deliveryCharge.toLocaleString('en-IN')}`}
                    </span>
                  </div>

                  {/* Final Total */}
                  <div className="pt-3 border-t border-[#EAE2D5] flex justify-between items-center text-sm sm:text-base font-bold text-[#1C1613]">
                    <span>Total Payable</span>
                    <span className="text-lg sm:text-xl font-bold text-[#581923]">
                      ₹{cart.cartTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Primary & Secondary Action Buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/checkout')}
                    disabled={actionLoading}
                    className="w-full bg-[#581923] hover:bg-[#431219] text-white py-3.5 px-4 rounded text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md active:scale-[0.99] disabled:opacity-50"
                  >
                    <span>PROCEED TO CHECKOUT</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <Link
                    to="/gold"
                    className="w-full bg-[#FAF7F2] hover:bg-[#F3ECE4] text-[#3A2D25] border border-[#D5C7B7] py-3 px-4 rounded text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors text-center"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>CONTINUE SHOPPING</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

