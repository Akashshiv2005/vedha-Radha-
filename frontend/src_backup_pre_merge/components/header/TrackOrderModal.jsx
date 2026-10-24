import React, { useState } from 'react';
import { X, Package, Search, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

export default function TrackOrderModal({ isOpen, onClose }) {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);

  if (!isOpen) return null;

  const handleTrack = (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setTrackingResult({
      status: 'In Crafting & Quality Assay',
      step: 2,
      estimatedDelivery: '3 to 5 business days',
      id: orderId.toUpperCase(),
      message: 'Your selected handcrafted piece is undergoing rigorous 916 BIS hallmark purity verification and bespoke custom packaging.'
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="track-order-title"
    >
      <div 
        className="bg-[#FAF7F2] rounded-xl max-w-md w-full overflow-hidden shadow-2xl border border-[#E8DFC0] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#581923] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E6C37A]/20 flex items-center justify-center text-[#E6C37A]">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 id="track-order-title" className="font-serif text-lg font-bold">Track Your Jewellery Order</h3>
              <p className="text-[11px] text-[#E6C37A]">Vedha Radha Thanga Maaligai</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 cursor-pointer"
            aria-label="Close track order modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!trackingResult ? (
            <form onSubmit={handleTrack} className="space-y-4">
              <p className="text-xs text-[#6E5F55] leading-relaxed">
                Enter your Order Reference ID or Mobile Number to check real-time showroom dispatch and delivery status.
              </p>

              <div>
                <label className="block text-xs font-semibold text-[#241716] mb-1">
                  Order Reference ID / Receipt No.
                </label>
                <input
                  type="text"
                  placeholder="e.g. VR-2026-8849"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full bg-white border border-[#DECDBB] rounded px-3 py-2 text-xs text-[#241716] focus:outline-none focus:border-[#581923]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#241716] mb-1">
                  Registered Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98401 XXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-[#DECDBB] rounded px-3 py-2 text-xs text-[#241716] focus:outline-none focus:border-[#581923]"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="w-full bg-[#581923] hover:bg-[#431219] text-white py-2 rounded text-xs font-semibold tracking-wide transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Check Order Status</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-[#F4EFE6] rounded border border-[#E3DACB] text-xs">
                <div className="flex justify-between font-semibold text-[#241716]">
                  <span>Order: {trackingResult.id}</span>
                  <span className="text-[#581923]">{trackingResult.status}</span>
                </div>
                <p className="text-[#6E5F55] mt-2 leading-relaxed">{trackingResult.message}</p>
                <div className="mt-2 text-[11px] text-[#8C6D2D] font-medium">
                  Estimated Delivery: {trackingResult.estimatedDelivery}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setTrackingResult(null)}
                  className="flex-1 border border-[#DECDBB] text-xs py-2 rounded hover:bg-[#F3EAD3]/40 cursor-pointer"
                >
                  Track Another Order
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-[#581923] text-white text-xs py-2 rounded font-semibold hover:bg-[#431219] cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
