import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Tag, Sparkles, Check, ArrowRight, Clock, ShieldCheck, ChevronRight, Copy } from 'lucide-react';

export default function OffersPage() {
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const offers = [
    {
      id: 1,
      badge: 'Festive Wedding Special',
      title: '0% Making Charge on Bridal Gold Sets',
      description: 'Enjoy 100% waiver on making charges for all 22K BIS Hallmarked Muhurtham necklaces, kasu malas, and antique bridal haram sets.',
      code: 'VEDHA-BRIDAL',
      expiry: 'Valid throughout the wedding season',
      eligibility: 'Applicable on complete bridal sets and purchases above 40 grams',
      actionText: 'Browse Bridal Sets',
      actionRoute: '/bridal'
    },
    {
      id: 2,
      badge: 'Silver Privilege',
      title: 'Flat ₹500 Off on 92.5 Sterling Silver',
      description: 'Receive an instant ₹500 discount on auspicious silver pooja articles, traditional vilakku / lamps, and handcrafted anklets.',
      code: 'SILVER-500',
      expiry: 'Valid for Online & Mylapore Showroom',
      eligibility: 'Valid on min. silver purchase of ₹4,000',
      actionText: 'Browse Silver Articles',
      actionRoute: '/jewellery?category=Silver'
    },
    {
      id: 3,
      badge: 'Transparent Exchange',
      title: '100% Value Guarantee on Old Gold Exchange',
      description: 'Upgrade your existing family jewellery. Get the exact benchmark market rate with 0% deduction on gold purity after electronic karatmeter assaying.',
      code: 'EXCHANGE-MAX',
      expiry: 'Permanent Showroom Privilege',
      eligibility: 'Any gold jewellery from any jeweler accepted',
      actionText: 'Book Showroom Visit',
      actionRoute: '/contact'
    },
    {
      id: 4,
      badge: 'Savings Scheme',
      title: 'Swarna Nidhi 11-Month Gold Advance Plan',
      description: 'Invest monthly from ₹1,000 onwards. Vedha Radha contributes a 100% bonus month at maturity along with special making charge discounts.',
      code: 'SWARNA-NIDHI',
      expiry: 'Open for Enrollment',
      eligibility: 'Flexible monthly installments with gold weight locking',
      actionText: 'Enroll via Showroom',
      actionRoute: '/contact'
    }
  ];

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8 sm:py-12 border-b border-[#EAE2D5]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-[#7A6E65] mb-4">
          <button onClick={() => navigate('/')} className="hover:text-[#581923] cursor-pointer">Home</button>
          <ChevronRight className="w-3.5 h-3.5 text-[#B38E46]" />
          <span className="font-semibold text-[#581923]">Showroom & Festive Offers</span>
        </div>

        {/* Hero Header */}
        <div className="bg-gradient-to-r from-[#4A161E] via-[#5C1D27] to-[#3D0E15] text-[#FAF6EE] rounded-2xl p-6 sm:p-10 mb-10 border border-[#7A2A37] shadow-lg relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5C278]/20 border border-[#E5C278]/40 text-[#F5DFAB] text-[11px] font-semibold uppercase tracking-wider mb-3">
              <Gift className="w-3.5 h-3.5 text-[#E5C278]" />
              Limited-Time Showroom Benefits
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Exclusive Showroom & Festive Offers
            </h1>
            <p className="text-xs sm:text-sm text-[#E6D4D6] mt-2 leading-relaxed">
              Celebrate your special family occasions with our festive concessions, zero-making-charge wedding privileges, and transparent exchange guarantees at Vedha Radha Thanga Maaligai.
            </p>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {offers.map((offer) => (
            <div 
              key={offer.id}
              className="bg-white rounded-2xl border border-[#E8DFC0] p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F3EAD3] text-[#7A5826] border border-[#E2D4B7]">
                    {offer.badge}
                  </span>
                  <span className="text-xs text-[#8C7A6B] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#B38E46]" />
                    <span>{offer.expiry}</span>
                  </span>
                </div>

                <h2 className="font-serif text-xl font-bold text-[#241716]">
                  {offer.title}
                </h2>
                <p className="text-xs sm:text-[13px] text-[#554942] mt-2 leading-relaxed">
                  {offer.description}
                </p>

                <div className="mt-3 bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EAE2D5] text-[11px] text-[#7A6E65]">
                  <strong className="text-[#3D332D]">Eligibility:</strong> {offer.eligibility}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#F0E8DC] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#581923] bg-[#FAF4E8] px-3 py-1 rounded border border-[#EADBBD]">
                    {offer.code}
                  </span>
                  <button
                    onClick={() => handleCopy(offer.code)}
                    className="p-1.5 text-[#7A6E65] hover:text-[#581923] rounded hover:bg-[#F3EAD3] transition-colors cursor-pointer"
                    title="Copy promo code"
                  >
                    {copiedCode === offer.code ? (
                      <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-0.5">
                        <Check className="w-3.5 h-3.5" /> Copied!
                      </span>
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <button
                  onClick={() => navigate(offer.actionRoute)}
                  className="bg-[#581923] hover:bg-[#431219] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>{offer.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Showroom Redemption Assurance */}
        <div className="bg-[#F6EFE4] rounded-2xl p-6 sm:p-8 border border-[#E3DACB] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#581923] text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#E6C37A]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#241716]">How to Redeem in Showroom</h3>
              <p className="text-xs text-[#63574F] mt-1 max-w-xl">
                Simply quote the offer code at the billing counter in our Mylapore showroom or present it during your bespoke bridal consultation for instant application.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/contact')}
            className="bg-[#581923] hover:bg-[#431219] text-white px-6 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer"
          >
            Visit Mylapore Showroom
          </button>
        </div>

      </div>
    </div>
  );
}
