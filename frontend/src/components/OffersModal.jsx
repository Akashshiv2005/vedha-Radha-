import React from 'react';
import { X, Gift, ArrowRight } from 'lucide-react';

export default function OffersModal({ isOpen, onClose, onExploreOffers }) {
  if (!isOpen) return null;

  const offers = [
    {
      id: 1,
      badge: 'Festive Special',
      title: '0% Making Charge on Bridal Gold Sets',
      description: 'Exclusive on 22K Hallmarked Muhurtham necklaces and antique temple haram collections.',
      code: 'VEDHA-BRIDAL',
      expiry: 'Valid this festive season'
    },
    {
      id: 2,
      badge: 'Silver Privilege',
      title: 'Flat ₹500 Off on 92.5 Sterling Silver',
      description: 'Applicable on traditional silver pooja articles, silver lamps, and crafted anklets above ₹4,000.',
      code: 'SILVER-500',
      expiry: 'Showroom & Online'
    },
    {
      id: 3,
      badge: 'Old Gold Exchange',
      title: '100% Value Guarantee on Old Gold',
      description: 'Exchange your existing gold jewellery at exact prevailing market benchmark rates with zero deduction on purity.',
      code: 'EXCHANGE-MAX',
      expiry: 'Ongoing in Showroom'
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="offers-modal-title"
    >
      <div 
        className="bg-[#FAF7F2] rounded-xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E8DFC0] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#581923] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E6C37A]/20 flex items-center justify-center text-[#E6C37A]">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <h3 id="offers-modal-title" className="font-serif text-lg font-bold">Showroom & Festive Offers</h3>
              <p className="text-[11px] text-[#E6C37A]">Vedha Radha Thanga Maaligai</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close offers dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Offers List */}
        <div className="p-6 space-y-3.5 max-h-[70vh] overflow-y-auto">
          {offers.map((offer) => (
            <div 
              key={offer.id}
              className="p-4 rounded-lg bg-white border border-[#E8DFC0] hover:border-[#B8924B] shadow-xs transition-all flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F3EAD3] text-[#7A5826] border border-[#E2D4B7]">
                  {offer.badge}
                </span>
                <span className="text-[10.5px] text-[#8C7A6B]">
                  {offer.expiry}
                </span>
              </div>

              <h4 className="font-serif font-bold text-sm text-[#241716] mt-2">
                {offer.title}
              </h4>
              <p className="text-xs text-[#63574F] mt-1 leading-relaxed">
                {offer.description}
              </p>

              <div className="mt-3 pt-2.5 border-t border-[#F0E8DC] flex items-center justify-between">
                <span className="text-[11px] font-mono font-semibold text-[#581923] bg-[#FAF4E8] px-2.5 py-0.5 rounded border border-[#EADBBD]">
                  Code: {offer.code}
                </span>
                <button
                  onClick={() => {
                    onClose();
                    if (onExploreOffers) onExploreOffers();
                  }}
                  className="text-xs font-semibold text-[#581923] hover:text-[#8C6D2D] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Explore Eligible Pieces</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F5EFE6] border-t border-[#E3DACB] flex items-center justify-between">
          <span className="text-[11px] text-[#7A6E65]">
            * Offers redeemable online & at Mylapore showroom.
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
