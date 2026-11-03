import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  ShoppingBag,
  Sparkles,
  MapPin,
  User,
  Info
} from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { checkoutClient } from '../api/checkoutClient';

export default function CheckoutPage({ onCartUpdated = () => {} }) {
  const navigate = useNavigate();
  const { customer, isAuthenticated } = useCustomerAuth();

  // Quote & loading state
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    customerName: '',
    mobileNumber: '',
    alternatePhone: '',
    email: '',
    fullAddress: '',
    city: 'Madurai',
    state: 'Tamil Nadu',
    pinCode: '',
    deliveryInstructions: '',
    paymentMethod: 'COD',
  });

  // Prefill authenticated customer profile if available
  useEffect(() => {
    if (customer) {
      setFormData(prev => ({
        ...prev,
        customerName: prev.customerName || customer.customer_name || '',
        mobileNumber: prev.mobileNumber || customer.mobile_number || '',
        alternatePhone: prev.alternatePhone || customer.alternative_mobile_number || '',
        fullAddress: prev.fullAddress || customer.full_address || '',
        pinCode: prev.pinCode || customer.pin_code || '',
      }));
    }
  }, [customer]);

  // Load quote on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchQuote() {
      setLoading(true);
      setError(null);
      const res = await checkoutClient.getQuote();
      if (!isMounted) return;
      if (res.success) {
        setQuote(res.quote);
        if (res.quote.items.length === 0) {
          setError('Your shopping cart is currently empty. Please add jewellery pieces to proceed.');
        }
      } else {
        setError(res.error || 'Failed to load checkout details');
      }
      setLoading(false);
    }
    fetchQuote();
    return () => { isMounted = false; };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!quote || quote.items.length === 0 || !quote.can_proceed) {
      alert('Please resolve cart errors before checking out.');
      return;
    }

    // Basic frontend validations
    if (!formData.customerName.trim()) {
      alert('Please provide your full name.');
      return;
    }
    if (!/^\d{10}$/.test(formData.mobileNumber.trim())) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.fullAddress.trim()) {
      alert('Please enter your complete delivery address.');
      return;
    }
    if (!formData.pinCode.trim() || formData.pinCode.trim().length < 6) {
      alert('Please enter a valid 6-digit PIN code.');
      return;
    }

    setSubmitting(true);
    setError(null);

    // Generate unique idempotency key for this order attempt
    const idempotencyKey = `vr_ord_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const payload = {
      customer: {
        customerName: formData.customerName.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        email: formData.email.trim() || null,
        alternativeMobileNumber: formData.alternatePhone.trim() || null,
      },
      delivery: {
        fullAddress: formData.fullAddress.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pinCode: formData.pinCode.trim(),
        deliveryInstructions: formData.deliveryInstructions.trim() || null,
      },
      paymentMethod: formData.paymentMethod,
      idempotencyKey,
      notes: formData.deliveryInstructions.trim() || null,
    };

    const res = await checkoutClient.placeOrder(payload);
    setSubmitting(false);

    if (res.success && res.order) {
      const placedOrder = res.order;
      if (placedOrder.order_token) {
        sessionStorage.setItem(`vr_token_${placedOrder.order_number}`, placedOrder.order_token);
      }
      onCartUpdated?.();
      navigate(`/order-confirmation/${placedOrder.order_number}`, {
        state: { orderToken: placedOrder.order_token }
      });
    } else {
      setError(res.error || 'Failed to place order. Please check availability and try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FAF7F2] p-6 text-center">
        <div className="w-12 h-12 border-3 border-[#C49A45] border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-serif font-bold text-[#581923]">Preparing Secure Checkout</h2>
        <p className="text-sm text-[#7A6E65] mt-1">Verifying hallmarked jewellery inventory & live rates...</p>
      </div>
    );
  }

  if (error && (!quote || quote.items.length === 0)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FAF7F2] p-6 text-center">
        <div className="w-16 h-16 bg-[#F5EBE1] text-[#8C6D2D] rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#581923]">Your Cart is Empty</h2>
        <p className="text-sm text-[#7A6E65] max-w-md mt-2">
          {error}
        </p>
        <Link
          to="/gold"
          className="mt-6 inline-flex items-center gap-2 bg-[#581923] hover:bg-[#431219] text-white px-6 py-2.5 rounded text-sm font-semibold tracking-wide transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore Gold Jewellery</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#7A6E65] mb-6">
          <Link to="/" className="hover:text-[#581923] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#35151B] font-medium">Checkout</span>
        </div>

        <div className="flex items-center justify-between border-b border-[#EAE2D5] pb-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#48161E]">
              Secure Checkout
            </h1>
            <p className="text-xs sm:text-sm text-[#7A6E65] mt-0.5">
              Vedha Radha Thangamaaligai — Authentic Hallmarked Jewellery
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-[#F3ECE4] text-[#8C6D2D] px-3 py-1.5 rounded-full text-xs font-medium border border-[#E5D7C5]">
            <ShieldCheck className="w-4 h-4 text-[#C49A45]" />
            <span>100% Insured Transit</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Unable to proceed with checkout</p>
              <p className="text-xs text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Customer Details, Delivery Address & Payment */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Customer Details */}
            <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#EAE2D5] shadow-2xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F4EFE6]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#581923] text-white flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <h2 className="text-base font-bold text-[#35151B]">Customer Information</h2>
                </div>
                {isAuthenticated ? (
                  <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium">
                    Signed in as {customer?.customer_name}
                  </span>
                ) : (
                  <span className="text-xs text-[#8C6D2D] bg-[#FBF7F0] border border-[#EFE8DD] px-2.5 py-0.5 rounded-full">
                    Guest Checkout
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A403A] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="Enter recipient full name"
                    required
                    className="w-full text-xs p-2.5 rounded border border-[#D5C9B8] bg-[#FAF8F5] focus:outline-hidden focus:border-[#581923] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A403A] mb-1">
                    Mobile Number (10 Digits) *
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile"
                    maxLength={10}
                    required
                    className="w-full text-xs p-2.5 rounded border border-[#D5C9B8] bg-[#FAF8F5] focus:outline-hidden focus:border-[#581923] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A403A] mb-1">
                    Alternative Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    name="alternatePhone"
                    value={formData.alternatePhone}
                    onChange={handleInputChange}
                    placeholder="Secondary contact"
                    maxLength={10}
                    className="w-full text-xs p-2.5 rounded border border-[#D5C9B8] bg-[#FAF8F5] focus:outline-hidden focus:border-[#581923] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A403A] mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="For digital invoice receipt"
                    className="w-full text-xs p-2.5 rounded border border-[#D5C9B8] bg-[#FAF8F5] focus:outline-hidden focus:border-[#581923] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Address */}
            <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#EAE2D5] shadow-2xs">
              <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-[#F4EFE6]">
                <div className="w-7 h-7 rounded-full bg-[#581923] text-white flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <h2 className="text-base font-bold text-[#35151B]">Delivery Address</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A403A] mb-1">
                    Complete Street Address *
                  </label>
                  <textarea
                    rows={2}
                    name="fullAddress"
                    value={formData.fullAddress}
                    onChange={handleInputChange}
                    placeholder="Door number, building, street, landmark..."
                    required
                    className="w-full text-xs p-2.5 rounded border border-[#D5C9B8] bg-[#FAF8F5] focus:outline-hidden focus:border-[#581923] focus:bg-white resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A403A] mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full text-xs p-2.5 rounded border border-[#D5C9B8] bg-[#FAF8F5] focus:outline-hidden focus:border-[#581923] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A403A] mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full text-xs p-2.5 rounded border border-[#D5C9B8] bg-[#FAF8F5] focus:outline-hidden focus:border-[#581923] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A403A] mb-1">
                      PIN Code (6 Digits) *
                    </label>
                    <input
                      type="text"
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleInputChange}
                      placeholder="e.g. 625001"
                      maxLength={6}
                      required
                      className="w-full text-xs p-2.5 rounded border border-[#D5C9B8] bg-[#FAF8F5] focus:outline-hidden focus:border-[#581923] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A403A] mb-1">
                    Delivery Instructions / Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="deliveryInstructions"
                    value={formData.deliveryInstructions}
                    onChange={handleInputChange}
                    placeholder="Special courier handover instructions"
                    className="w-full text-xs p-2.5 rounded border border-[#D5C9B8] bg-[#FAF8F5] focus:outline-hidden focus:border-[#581923] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Selection */}
            <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#EAE2D5] shadow-2xs">
              <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-[#F4EFE6]">
                <div className="w-7 h-7 rounded-full bg-[#581923] text-white flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <h2 className="text-base font-bold text-[#35151B]">Payment Selection</h2>
              </div>

              <div className="space-y-3">
                {quote?.available_payment_methods?.map((pm) => (
                  <label
                    key={pm.provider}
                    className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                      formData.paymentMethod === pm.provider
                        ? 'border-[#581923] bg-[#FAF4ED] ring-1 ring-[#581923]'
                        : pm.is_available
                        ? 'border-[#EAE2D5] hover:border-[#D5C9B8] bg-white'
                        : 'border-[#F0EBE3] bg-[#FBF9F6] opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={pm.provider}
                      disabled={!pm.is_available}
                      checked={formData.paymentMethod === pm.provider}
                      onChange={handleInputChange}
                      className="mt-0.5 text-[#581923] focus:ring-[#581923]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-bold text-[#2C2420]">
                          {pm.display_name}
                        </span>
                        {!pm.is_available && (
                          <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-medium">
                            Requires gateway credentials
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#7A6E65] mt-0.5">
                        {pm.message}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Placement */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#EAE2D5] shadow-2xs sticky top-24">
              <h2 className="text-base font-bold text-[#35151B] pb-3 border-b border-[#F4EFE6] flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#8C6D2D]" />
                <span>Order Summary ({quote?.item_count || 0})</span>
              </h2>

              {/* Items List */}
              <div className="divide-y divide-[#F4EFE6] max-h-60 overflow-y-auto my-3">
                {quote?.items?.map((item) => (
                  <div key={item.sku} className="py-3 flex gap-3">
                    <img
                      src={item.image || '/images/neutral_product_placeholder.svg'}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded bg-[#FAF7F2] border border-[#EFE8DD] shrink-0"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/neutral_product_placeholder.svg';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#2C2420] truncate">{item.name}</h4>
                      <p className="text-[11px] text-[#7A6E65]">SKU: {item.sku}</p>
                      {item.purity && (
                        <p className="text-[10px] text-[#8C6D2D] font-medium">{item.purity}</p>
                      )}
                      <div className="flex items-center justify-between mt-1 text-xs">
                        <span className="text-[#7A6E65]">Qty: {item.quantity}</span>
                        <span className="font-bold text-[#581923]">₹ {item.subtotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="border-t border-[#EAE2D5] pt-3 space-y-2 text-xs text-[#52443C]">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span className="font-semibold text-[#2C2420]">
                    ₹ {(quote?.subtotal || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST (3% Standard Jewellery Tax)</span>
                  <span className="font-semibold text-[#2C2420]">
                    ₹ {(quote?.tax || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Insured Express Courier</span>
                  <span className="font-semibold text-emerald-700">Complimentary</span>
                </div>
                <div className="border-t border-[#EAE2D5] pt-2 flex justify-between items-baseline text-sm font-bold text-[#35151B]">
                  <span>Total Payable:</span>
                  <span className="text-lg text-[#581923]">
                    ₹ {(quote?.total_amount || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={submitting || !quote?.can_proceed}
                className={`w-full mt-6 py-3.5 rounded text-xs font-semibold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 ${
                  submitting || !quote?.can_proceed
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    : 'bg-[#581923] hover:bg-[#431219] text-white cursor-pointer active:scale-[0.99]'
                }`}
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-[#F3EAD3]" />
                    <span>Place Order — ₹ {(quote?.total_amount || 0).toLocaleString('en-IN')}</span>
                  </>
                )}
              </button>

              <div className="mt-4 p-3 bg-[#FAF7F2] rounded-lg border border-[#EFE8DD] flex items-center gap-2.5 text-[11px] text-[#7A6E65]">
                <ShieldCheck className="w-4 h-4 text-[#C49A45] shrink-0" />
                <span>All pieces include tamper-proof assay certification & BIS hallmark guarantee.</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

