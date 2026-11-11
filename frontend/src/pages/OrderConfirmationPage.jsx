import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  ShoppingBag, 
  Truck, 
  Sparkles, 
  CreditCard, 
  AlertCircle 
} from 'lucide-react';
import { checkoutClient } from '../api/checkoutClient';
import { initiateRazorpayPayment } from '../api/paymentClient';

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams();
  const location = useLocation();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadOrder() {
      setLoading(true);
      setError(null);

      // Look up token from route navigation state or session storage
      const token = location.state?.orderToken || sessionStorage.getItem(`vr_token_${orderNumber}`);

      const res = await checkoutClient.getOrder(orderNumber, token);
      if (!isMounted) return;

      if (res.success && res.order) {
        setOrder(res.order);
      } else {
        setError(res.error || `Unable to load details for order ${orderNumber}`);
      }
      setLoading(false);
    }

    if (orderNumber) {
      loadOrder();
    }
    return () => { isMounted = false; };
  }, [orderNumber, location.state]);

  const handlePayNow = async () => {
    if (!order) return;
    setPaying(true);
    try {
      const payRes = await checkoutClient.createPayment(order.order_number);
      if (!payRes.success || !payRes.payment) {
        alert(payRes.error || 'Failed to initialize payment gateway.');
        setPaying(false);
        return;
      }
      await initiateRazorpayPayment({
        orderData: payRes.payment,
        onSuccess: async () => {
          setPaying(false);
          const token = location.state?.orderToken || sessionStorage.getItem(`vr_token_${orderNumber}`);
          const updated = await checkoutClient.getOrder(orderNumber, token);
          if (updated.success && updated.order) {
            setOrder(updated.order);
          }
        },
        onError: (err) => {
          setPaying(false);
          alert(err.message || 'Payment not completed.');
        },
        onDismiss: () => {
          setPaying(false);
        }
      });
    } catch (err) {
      setPaying(false);
      alert(err.message || 'Payment error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FAF7F2] p-6 text-center">
        <div className="w-12 h-12 border-3 border-[#C49A45] border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-serif font-bold text-[#581923]">Retrieving Order Details</h2>
        <p className="text-sm text-[#7A6E65] mt-1">Order #{orderNumber}</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FAF7F2] p-6 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-700 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#581923]">Order Lookup Failed</h2>
        <p className="text-sm text-[#7A6E65] max-w-md mt-2">
          {error || `We could not find an order matching "${orderNumber}".`}
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 bg-[#581923] hover:bg-[#431219] text-white px-6 py-2.5 rounded text-sm font-semibold tracking-wide transition-colors"
        >
          <span>Return to Homepage</span>
        </Link>
      </div>
    );
  }

  const isPendingPayment = order.order_status?.toLowerCase().includes('pending payment') || order.payment_status?.toLowerCase() === 'pending' && order.payment_method === 'Razorpay';

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Status Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EAE2D5] shadow-sm text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 bg-emerald-100 text-emerald-700">
            {isPendingPayment ? (
              <Clock className="w-9 h-9 text-amber-600" />
            ) : (
              <CheckCircle2 className="w-9 h-9 text-emerald-700" />
            )}
          </div>

          <span className="text-xs uppercase tracking-widest font-semibold text-[#8C6D2D]">
            Vedha Radha Thangamaaligai
          </span>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#35151B] mt-1">
            {isPendingPayment ? 'Order Placed - Awaiting Payment' : 'Order Placed & Confirmed!'}
          </h1>

          <p className="text-xs sm:text-sm text-[#7A6E65] max-w-lg mx-auto mt-2 leading-relaxed">
            {isPendingPayment
              ? `Your order ${order.order_number} has been registered and is pending online gateway verification.`
              : `Thank you for your patronage. Your order ${order.order_number} has been received by our Madurai artisans and concierge.`
            }
          </p>

          <div className="inline-flex items-center gap-3 bg-[#FAF8F5] border border-[#EFE8DD] px-4 py-2 rounded-lg mt-5 text-xs text-[#4A403A]">
            <span>Order Reference: <strong className="text-[#581923] font-mono text-sm">{order.order_number}</strong></span>
            <span className="text-stone-300">|</span>
            <span>Date: <strong>{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></span>
          </div>
        </div>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer & Delivery Summary */}
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#EAE2D5] shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-[#35151B] border-b border-[#F4EFE6] pb-2.5 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#8C6D2D]" />
              <span>Recipient & Delivery Address</span>
            </h2>

            <div className="text-xs text-[#52443C] space-y-2 leading-relaxed">
              <p className="font-semibold text-sm text-[#2C2420]">{order.customer_name}</p>
              <p>{order.shipping_address}</p>
              <p>{order.city}, {order.state} - {order.pin_code}</p>
              <div className="pt-2 border-t border-[#F4EFE6] space-y-1 text-[#7A6E65]">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  <span>+91 {order.phone}</span>
                  {order.alternate_phone && <span>(Alt: +91 {order.alternate_phone})</span>}
                </p>
                {order.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{order.email}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Payment & Fulfillment Status */}
          <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#EAE2D5] shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-[#35151B] border-b border-[#F4EFE6] pb-2.5 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#8C6D2D]" />
              <span>Payment & Fulfillment Details</span>
            </h2>

            <div className="text-xs space-y-3">
              <div className="flex justify-between items-center py-1">
                <span className="text-[#7A6E65]">Payment Method:</span>
                <span className="font-semibold text-[#2C2420]">{order.payment_method}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#7A6E65]">Payment Status:</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                  order.payment_status?.toLowerCase() === 'paid'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {order.payment_status?.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#7A6E65]">Order Status:</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FAF4ED] text-[#581923] border border-[#EAE2D5]">
                  {order.order_status}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-[#F4EFE6] pt-2">
                <span className="text-[#7A6E65]">Shipping Guarantee:</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> Insured Transit
                </span>
              </div>

              {isPendingPayment && (
                <div className="pt-3 border-t border-[#F4EFE6]">
                  <button
                    onClick={handlePayNow}
                    disabled={paying}
                    className="w-full bg-[#581923] hover:bg-[#431219] text-white py-2.5 rounded-lg text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
                  >
                    <CreditCard className="w-4 h-4 text-[#F3EAD3]" />
                    <span>{paying ? 'Opening Razorpay Gateway...' : `Pay Now via Razorpay - ₹ ${(order.total_amount || 0).toLocaleString('en-IN')}`}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ordered Jewellery Pieces */}
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#EAE2D5] shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-[#35151B] border-b border-[#F4EFE6] pb-2.5 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#8C6D2D]" />
            <span>Ordered Jewellery ({order.items?.length || 1})</span>
          </h2>

          <div className="divide-y divide-[#F4EFE6]">
            {order.items?.map((item) => (
              <div key={item.id} className="py-3 flex items-center gap-4">
                <img
                  src={item.product_image || '/images/neutral_product_placeholder.svg'}
                  alt={item.product_name}
                  className="w-16 h-16 object-cover rounded bg-[#FAF7F2] border border-[#EFE8DD] shrink-0"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/neutral_product_placeholder.svg';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-[#2C2420] truncate">
                    {item.product_name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#7A6E65] mt-0.5">
                    <span>SKU: {item.product_sku}</span>
                    {item.purity && <span>• Purity: {item.purity}</span>}
                    {item.weight_grams && <span>• Gross Wt: {item.weight_grams} g</span>}
                    <span>• Qty: {item.quantity}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs sm:text-sm font-bold text-[#581923]">
                    ₹ {item.subtotal.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Totals Summary */}
          <div className="border-t border-[#EAE2D5] pt-4 space-y-2 text-xs text-[#52443C] max-w-sm ml-auto">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-medium">₹ {order.subtotal?.toLocaleString('en-IN') || '0'}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (3% Jewellery Tax):</span>
              <span className="font-medium">₹ {order.tax_amount?.toLocaleString('en-IN') || '0'}</span>
            </div>
            <div className="flex justify-between">
              <span>Insured Courier:</span>
              <span className="font-medium text-emerald-700">Complimentary</span>
            </div>
            <div className="flex justify-between items-baseline text-sm font-bold text-[#35151B] border-t border-[#EAE2D5] pt-2">
              <span>Total Paid / Payable:</span>
              <span className="text-base text-[#581923]">₹ {order.total_amount?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Back to Catalog */}
        <div className="text-center pt-4">
          <Link
            to="/gold"
            className="inline-flex items-center gap-2 bg-[#581923] hover:bg-[#431219] text-white px-6 py-2.5 rounded text-xs font-semibold tracking-wide transition-colors"
          >
            <span>Explore More Fine Jewellery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
