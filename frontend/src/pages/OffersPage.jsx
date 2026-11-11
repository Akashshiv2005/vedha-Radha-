import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gift, 
  Tag, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  Copy, 
  Calendar, 
  Percent, 
  Flame, 
  Award, 
  Info, 
  X, 
  Phone,
  MessageCircle,
  MapPin,
  CheckCircle2,
  ChevronDown,
  Lock,
  Coins,
  Scale,
  Sparkle
} from 'lucide-react';

const CAMPAIGN_TABS = [
  { id: 'all', label: 'All Privileges' },
  { id: 'festive', label: 'Festive Swarna Utsav' },
  { id: 'bridal', label: 'Wedding Privileges' },
  { id: 'silver', label: 'Silver Pooja Articles' },
  { id: 'exchange', label: 'Old Gold Exchange' },
  { id: 'savings', label: 'Swarna Nidhi Scheme' }
];

const OFFERS_DATA = [
  {
    id: 'festive-50',
    category: 'festive',
    badge: 'Festive Swarna Utsav',
    discountHighlight: 'FLAT 50% OFF',
    discountSub: 'On Making Charges (V.A.)',
    title: 'Incredible 50% Off on Value Addition',
    description: 'Celebrate Deepavali and wedding milestones with a flat 50% concession on making charges (V.A.) across our entire handcrafted temple, antique nakshi, and bridal gold jewellery collections.',
    image: '/images/col_gold_2k.jpg',
    code: 'FESTIVE-50',
    expiry: 'Offer valid till 08 Nov 2026',
    eligibility: 'Applicable on all 22K BIS Hallmarked gold necklaces, harams, bangles, and jhumkas.',
    terms: [
      'Valid at both Trichy Flagship and Mylapore showrooms.',
      'Discount applies directly to the Value Addition (V.A.) component of the bill.',
      'Can be combined with 10% advance rate locking privilege.',
      'Offer valid strictly until 08th November 2026.'
    ],
    actionText: 'Explore Gold Jewellery',
    actionRoute: '/gold'
  },
  {
    id: 'bridal-waiver',
    category: 'bridal',
    badge: 'Muhurtham Wedding Special',
    discountHighlight: '0% MAKING CHARGE',
    discountSub: '100% V.A. Waiver on Bridal Sets',
    title: 'Zero Making Charges on Complete Bridal Sets',
    description: 'Enjoy 100% waiver on making charges for all 22K BIS Hallmarked Muhurtham necklaces, kasu malas, manga malais, and antique bridal haram sets for wedding season celebrations.',
    image: '/images/col_wedding_2k.jpg',
    code: 'VEDHA-BRIDAL',
    expiry: 'Valid throughout the wedding season',
    eligibility: 'Applicable on complete bridal trousseau sets and single invoice purchases above 40 grams.',
    terms: [
      'Applicable on 22K 916 BIS Hallmarked bridal sets.',
      'Complimentary velvet storage keepsake chest included.',
      'Free lifetime jewelry cleaning & inspection warranty included.'
    ],
    actionText: 'Browse Bridal Sets',
    actionRoute: '/bridal'
  },
  {
    id: 'silver-privilege',
    category: 'silver',
    badge: 'Pooja Heritage Privilege',
    discountHighlight: 'FLAT ₹500 OFF',
    discountSub: 'On 92.5 Sterling Silver',
    title: 'Flat ₹500 Off on Sacred Silver Pooja Articles',
    description: 'Receive an instant ₹500 discount on auspicious 92.5 sterling silver pooja kalash, Kamakshi vilakku lamps, ornate puja plates, and handcrafted baby anklets.',
    image: '/images/col_pooja.jpg',
    code: 'SILVER-500',
    expiry: 'Valid for Showroom & Online Orders',
    eligibility: 'Valid on minimum sterling silver purchases of ₹4,00,0.',
    terms: [
      'Certified 92.5 Sterling Silver with authenticity certificate.',
      'Instant deduction at billing counter or checkout.',
      'Valid while festive pooja stock lasts.'
    ],
    actionText: 'Browse Silver Articles',
    actionRoute: '/silver-pooja'
  },
  {
    id: 'gold-exchange',
    category: 'exchange',
    badge: 'Transparent Karatmeter Assaying',
    discountHighlight: '100% BENCHMARK',
    discountSub: '0% Melting Loss Deduction',
    title: '100% Benchmark Value on Old Gold Exchange',
    description: 'Upgrade your family heirloom gold. Get the exact benchmark market rate with zero melting loss deduction after computerized electronic karatmeter purity assaying.',
    image: '/images/coin_gold.jpg',
    code: 'EXCHANGE-MAX',
    expiry: 'Permanent Showroom Privilege',
    eligibility: 'Any gold jewellery or coins from any jeweller across India accepted.',
    terms: [
      'Transparent computerized karatmeter assaying conducted in front of you.',
      'Zero deduction on net gold purity weight.',
      'Instant adjustment against fresh 22K or diamond purchases.'
    ],
    actionText: 'Book Exchange Visit',
    actionRoute: '/contact'
  },
  {
    id: 'swarna-nidhi',
    category: 'savings',
    badge: '11-Month Gold Accumulation',
    discountHighlight: '100% BONUS',
    discountSub: '1-Month Contribution Paid by Us',
    title: 'Swarna Nidhi 11-Month Gold Advance Plan',
    description: 'Invest monthly from ₹1,000 onwards. Vedha Radha contributes a 100% bonus 12th month upon maturity along with special zero-making-charge redemption privileges.',
    image: '/images/bar_gold.jpg',
    code: 'SWARNA-NIDHI',
    expiry: 'Open for Showroom Enrollment',
    eligibility: 'Flexible monthly installments with gold weight locking options.',
    terms: [
      'Pay 11 monthly installments; 12th installment contributed by Vedha Radha.',
      'Lock gold weight monthly or accumulate cash value at benchmark rates.',
      'Redeem against any gold, diamond, or silver jewellery without deduction.'
    ],
    actionText: 'Enroll via Showroom',
    actionRoute: '/contact'
  }
];

export default function OffersPage() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('all');
  const [copiedCode, setCopiedCode] = useState(null);
  const [showLearnMoreModal, setShowLearnMoreModal] = useState(false);
  const [expandedOfferId, setExpandedOfferId] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const filteredOffers = selectedTab === 'all' 
    ? OFFERS_DATA 
    : OFFERS_DATA.filter(item => item.category === selectedTab);

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-6 sm:py-10 border-b border-[#EAE2D5] relative overflow-hidden">
      
      {/* Subtle Architectural Temple Pillar Watermarks */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.06] select-none">
        <div className="absolute left-0 top-0 bottom-0 w-44 bg-gradient-to-r from-[#4A1019] to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-44 bg-gradient-to-l from-[#4A1019] to-transparent" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#7A6E65] mb-6">
          <button onClick={() => navigate('/')} className="hover:text-[#581923] cursor-pointer transition-colors">Home</button>
          <ChevronRight className="w-3.5 h-3.5 text-[#B38E46]" />
          <span className="font-semibold text-[#581923]">Showroom &amp; Festive Privileges</span>
        </div>

        {/* =========================================================================
            FEATURED HERO CAMPAIGN SHOWCASE
            Opulent Royal Velvet & Gold Presentation with 4 Highlight Seal Badges
        ========================================================================= */}
        <section className="bg-gradient-to-br from-[#FFFDF9] via-[#FAF5EB] to-[#FFFDF9] rounded-[32px] border-2 border-[#D4AF37]/50 shadow-[0_20px_50px_rgba(74,16,25,0.08)] overflow-hidden mb-10 relative">
          
          {/* Top Decorative Gold Arch Trim */}
          <div className="h-2 w-full bg-gradient-to-r from-[#A57822] via-[#FCEB9C] to-[#A57822]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            {/* LEFT COLUMN: Festive Campaign Creative Poster with Gilded Frame */}
            <div className="lg:col-span-5 p-5 sm:p-7 lg:p-9 flex items-center justify-center">
              <div className="relative group max-w-[480px] w-full rounded-2xl overflow-hidden shadow-[0_16px_36px_rgba(74,16,25,0.22)] border-2 border-[#D4AF37]">
                
                {/* Campaign Poster Image with Zoom on Hover */}
                <img 
                  src="/images/festive_campaign_poster.jpg" 
                  alt="Vedha Radha Festive Swarna Utsav Offer Campaign" 
                  className="w-full h-auto object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                />
                
                {/* Festive corner royal badge */}
                <div className="absolute top-3.5 left-3.5 bg-gradient-to-r from-[#4A1019] to-[#30050D] text-[#FFF2B0] px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase border border-[#E5C278]/60 shadow-lg flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FCEB9C]" />
                  <span>Auspicious Utsav Privilege</span>
                </div>

                {/* Subtle Gold Corner Ornaments */}
                <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded bg-black/60 backdrop-blur-xs text-[10px] text-[#E8C77D] font-mono border border-[#E8C77D]/40">
                  Trichy &amp; Mylapore
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Editorial Typography, Details & Action Buttons */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
              
              {/* Brand Campaign Header */}
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4A1019]/10 text-[#4A1019] border border-[#4A1019]/25 text-xs font-bold tracking-widest uppercase">
                  <Gift className="w-3.5 h-3.5 text-[#A57822]" />
                  <span>Vedha Radha Signature Festival</span>
                </div>

                <h1 
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-bold text-[#241716] tracking-tight leading-[1.12]"
                >
                  VEDHA RADHA<br />
                  <span className="bg-gradient-to-r from-[#4A1019] via-[#8A1528] to-[#4A1019] bg-clip-text text-transparent">
                    FESTIVE SWARNA UTSAV
                  </span>
                </h1>

                {/* Validity Date */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#7A6E65] pt-0.5 font-medium">
                  <Calendar className="w-4 h-4 text-[#A57822]" />
                  <span>Date : Auspicious Season Offers Valid Till 08 Nov 2026</span>
                </div>
              </div>

              {/* Campaign Narrative */}
              <p className="text-xs sm:text-sm text-[#554942] leading-relaxed mt-3.5 font-normal max-w-2xl">
                Celebrate Diwali, Akshaya milestones, and the grand wedding season with privileged concessions on 100% BIS 916 hallmarked pure gold, consecrated temple repousse jewellery, certified diamonds, and sacred silver pooja articles.
              </p>

              {/* 4 Grand Benefits Checklist Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 pt-4 border-t border-[#EFE7DA]">
                
                {/* Tile 1 */}
                <div className="p-3 rounded-xl bg-[#FFFDF9] border border-[#DECDBB] shadow-2xs flex items-start gap-3 hover:border-[#D4AF37] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#4A1019] text-[#FFF2B0] flex items-center justify-center shrink-0 shadow-xs">
                    <Percent className="w-4 h-4 text-[#FCEB9C]" />
                  </div>
                  <div>
                    <span className="block font-bold text-xs sm:text-[13px] text-[#4A1019]">Flat 50% Off V.A.</span>
                    <span className="block text-[11px] text-[#6B5A4E] leading-tight mt-0.5">On making charges across all 22K gold jewellery</span>
                  </div>
                </div>

                {/* Tile 2 */}
                <div className="p-3 rounded-xl bg-[#FFFDF9] border border-[#DECDBB] shadow-2xs flex items-start gap-3 hover:border-[#D4AF37] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#4A1019] text-[#FFF2B0] flex items-center justify-center shrink-0 shadow-xs">
                    <Scale className="w-4 h-4 text-[#FCEB9C]" />
                  </div>
                  <div>
                    <span className="block font-bold text-xs sm:text-[13px] text-[#4A1019]">0% Melting Deduction</span>
                    <span className="block text-[11px] text-[#6B5A4E] leading-tight mt-0.5">100% benchmark value on old gold from any jeweller</span>
                  </div>
                </div>

                {/* Tile 3 */}
                <div className="p-3 rounded-xl bg-[#FFFDF9] border border-[#DECDBB] shadow-2xs flex items-start gap-3 hover:border-[#D4AF37] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#4A1019] text-[#FFF2B0] flex items-center justify-center shrink-0 shadow-xs">
                    <Lock className="w-4 h-4 text-[#FCEB9C]" />
                  </div>
                  <div>
                    <span className="block font-bold text-xs sm:text-[13px] text-[#4A1019]">10% Advance Rate Lock</span>
                    <span className="block text-[11px] text-[#6B5A4E] leading-tight mt-0.5">Shield your order from wedding season gold spikes</span>
                  </div>
                </div>

                {/* Tile 4 */}
                <div className="p-3 rounded-xl bg-[#FFFDF9] border border-[#DECDBB] shadow-2xs flex items-start gap-3 hover:border-[#D4AF37] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#4A1019] text-[#FFF2B0] flex items-center justify-center shrink-0 shadow-xs">
                    <Coins className="w-4 h-4 text-[#FCEB9C]" />
                  </div>
                  <div>
                    <span className="block font-bold text-xs sm:text-[13px] text-[#4A1019]">Free 999 Gold Coin</span>
                    <span className="block text-[11px] text-[#6B5A4E] leading-tight mt-0.5">Complimentary 24K pure coin on orders &gt; ₹2,00,000</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-3.5 mt-6 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLearnMoreModal(true)}
                  className="bg-gradient-to-r from-[#4A1019] via-[#3B0710] to-[#28040A] hover:from-[#5C1521] hover:to-[#38060F] text-white px-7 py-3 rounded-full text-xs sm:text-sm font-bold shadow-md hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer border border-[#C99A38]"
                >
                  Learn More Privileges
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/contact')}
                  className="bg-[#FFFDF9] hover:bg-[#FAF3E8] border border-[#C99A38] text-[#4A1019] px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-2xs"
                >
                  Book Showroom Visit
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy('FESTIVE-50')}
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#4A1019] hover:text-[#28040A] px-4 py-2.5 rounded-full bg-[#FFFDF9] border border-[#DECDBB] hover:border-[#C99A38] cursor-pointer shadow-2xs transition-all"
                  title="Copy coupon code"
                >
                  <Copy className="w-3.5 h-3.5 text-[#A57822]" />
                  <span>{copiedCode === 'FESTIVE-50' ? 'Copied code FESTIVE-50! ✓' : 'Code: FESTIVE-50'}</span>
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* =========================================================================
            AUSPICIOUS GOLD RATE PROTECTION BANNER
        ========================================================================= */}
        <section className="bg-gradient-to-r from-[#3B0710] via-[#4A1019] to-[#28040A] rounded-2xl p-4 sm:p-5 border border-[#C99A38]/50 shadow-md mb-10 text-white flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#FAF3E5] text-[#4A1019] flex items-center justify-center shrink-0 shadow-sm border border-[#E8C77D]">
              <Sparkles className="w-5 h-5 text-[#8C6D2D]" />
            </div>
            <div>
              <span className="block font-serif font-bold text-sm sm:text-base text-[#FCEB9C]">
                Auspicious Muhurtham Gold Rate Protection Guarantee
              </span>
              <span className="block text-xs sm:text-[13px] text-[#EDE4D5] mt-0.5">
                Lock today's benchmark gold rate at <strong>₹13,210/g</strong> with just 10% advance. If gold rates fall on delivery day, you pay the lower rate!
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/contact')}
            className="bg-gradient-to-r from-[#C99A38] via-[#E8C77D] to-[#B38E46] text-[#241716] font-bold text-xs px-5 py-2.5 rounded-full shrink-0 shadow-md hover:brightness-105 transition-all cursor-pointer whitespace-nowrap"
          >
            Lock Rate with 10% Advance →
          </button>
        </section>

        {/* =========================================================================
            CAMPAIGN FILTER TABS
        ========================================================================= */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#A57822] text-xs">✦</span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#A57822] font-serif">Curated Offers</span>
              <span className="text-[#A57822] text-xs">✦</span>
            </div>
            <h2 
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              className="text-2xl sm:text-3xl font-bold text-[#241716] tracking-tight"
            >
              All Available Showroom Privileges
            </h2>
            <p className="text-xs text-[#7A6E65] mt-0.5">
              Showing {filteredOffers.length} exclusive privileges for festival and bridal jewellery connoisseurs.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CAMPAIGN_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedTab === tab.id
                    ? 'bg-[#4A1019] text-white border border-[#C99A38] shadow-sm'
                    : 'bg-[#FFFDF9] text-[#554942] border border-[#DECDBB] hover:bg-[#FAF3E8]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* =========================================================================
            OFFERS VOUCHER CARDS GRID
            Designed as Royal Treasury Passes with Jewellery Imagery & Perforated Notches
        ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 mb-14">
          {filteredOffers.map((offer) => (
            <div 
              key={offer.id}
              className="bg-[#FFFDF9] rounded-[24px] border border-[#DECDBB] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Top Regal Accent Strip */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#4A1019] via-[#C99A38] to-[#4A1019]" />

              <div className="p-6 sm:p-7">
                
                {/* Top Row: Category Badge & Validity */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-[#FAF3E5] text-[#4A1019] border border-[#E8C77D]">
                    <Sparkles className="w-3 h-3 text-[#C99A38]" />
                    <span>{offer.badge}</span>
                  </span>
                  <span className="text-xs text-[#8C7A6B] flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#B38E46]" />
                    <span>{offer.expiry}</span>
                  </span>
                </div>

                {/* Main Card Content: Image Preview & Discount Hero Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center mb-4">
                  
                  {/* Left: Jewellery Preview Thumbnail */}
                  <div className="sm:col-span-4 h-32 sm:h-36 rounded-2xl overflow-hidden border border-[#DECDBB] bg-[#240408] relative shadow-inner">
                    <img 
                      src={offer.image} 
                      alt={offer.title} 
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 select-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Right: Golden Discount Callout Banner */}
                  <div className="sm:col-span-8 p-4 rounded-2xl bg-gradient-to-br from-[#FAF3E5] via-[#FFFDF9] to-[#FAF3E5] border border-[#E8C77D] shadow-2xs flex flex-col justify-center">
                    <span className="text-xs font-bold text-[#8C6D2D] uppercase tracking-wider">
                      Privilege Voucher
                    </span>
                    <span className="text-2xl sm:text-[26px] font-black text-[#4A1019] tracking-tight leading-tight mt-0.5 font-serif">
                      {offer.discountHighlight}
                    </span>
                    <span className="text-xs font-medium text-[#6B5A4E] mt-1">
                      {offer.discountSub}
                    </span>
                  </div>

                </div>

                {/* Offer Title & Narrative */}
                <h3 
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  className="text-lg sm:text-xl font-bold text-[#241716] leading-snug"
                >
                  {offer.title}
                </h3>
                
                <p className="text-xs sm:text-[13px] text-[#5C4F4A] mt-2 leading-relaxed">
                  {offer.description}
                </p>

                {/* Eligibility Notice */}
                <div className="mt-3.5 bg-[#FAF5EB] p-3 rounded-xl border border-[#DECDBB] text-[11px] text-[#6B5A4E] flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#8C6D2D] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#241716]">Eligibility:</strong> {offer.eligibility}
                  </div>
                </div>

                {/* Expandable Terms Accordion */}
                {offer.terms && (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => setExpandedOfferId(expandedOfferId === offer.id ? null : offer.id)}
                      className="text-[11px] font-semibold text-[#4A1019] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Info className="w-3 h-3 text-[#A57822]" />
                      <span>{expandedOfferId === offer.id ? 'Hide Terms &amp; Conditions' : 'View Terms &amp; Conditions'}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${expandedOfferId === offer.id ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {expandedOfferId === offer.id && (
                      <ul className="mt-2 space-y-1 pl-4 list-disc text-[11px] text-[#6B5A4E] bg-[#FAF5EB] p-3 rounded-xl border border-[#DECDBB]">
                        {offer.terms.map((t, idx) => (
                          <li key={idx}>{t}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Perforated Coupon Divider with Notches */}
              <div className="relative border-t border-dashed border-[#DECDBB] my-1">
                {/* Left Cutout Circle */}
                <div className="w-5 h-5 rounded-full bg-[#FAF7F2] border-r border-[#DECDBB] absolute -left-2.5 -top-2.5" />
                {/* Right Cutout Circle */}
                <div className="w-5 h-5 rounded-full bg-[#FAF7F2] border-l border-[#DECDBB] absolute -right-2.5 -top-2.5" />
              </div>

              {/* Bottom Actions: Coupon Code Token & CTA */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-[#FAF3E5]/50 via-[#FFFDF9] to-[#FAF3E5]/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Code Copy Pill */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#FFFDF9] border border-[#C99A38] rounded-full shadow-2xs">
                    <Tag className="w-3.5 h-3.5 text-[#A57822]" />
                    <span className="text-xs font-mono font-bold text-[#4A1019] tracking-wider">
                      {offer.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(offer.code)}
                      className="p-1 text-[#7A6E65] hover:text-[#4A1019] rounded cursor-pointer transition-colors"
                      title="Copy coupon code"
                    >
                      {copiedCode === offer.code ? (
                        <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Copied!
                        </span>
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Action Route CTA */}
                <button
                  type="button"
                  onClick={() => navigate(offer.actionRoute)}
                  className="bg-gradient-to-r from-[#4A1019] via-[#3B0710] to-[#28040A] hover:from-[#5C1521] hover:to-[#38060F] text-white px-5 py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.02] border border-[#C99A38]"
                >
                  <span>{offer.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FCEB9C]" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* =========================================================================
            HOW TO REDEEM & PERSONAL CONCIERGE ASSISTANCE
        ========================================================================= */}
        <section className="bg-gradient-to-br from-[#FFFDF9] via-[#FAF3E8] to-[#FFFDF9] rounded-[28px] p-6 sm:p-10 border-2 border-[#D4AF37]/50 shadow-md mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 flex items-start gap-4 sm:gap-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4A1019] to-[#28040A] text-[#FFF2B0] flex items-center justify-center shrink-0 shadow-md border border-[#C99A38]">
                <ShieldCheck className="w-7 h-7 text-[#FCEB9C]" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#A57822] font-serif">Seamless Experience</span>
                <h3 
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  className="text-xl sm:text-2xl font-bold text-[#241716]"
                >
                  How to Redeem Your Privilege at Showroom
                </h3>
                <p className="text-xs sm:text-sm text-[#5C4F4A] leading-relaxed max-w-2xl">
                  Simply present your voucher code or this webpage to our showroom jewelers at the billing desk in our Trichy Flagship or Mylapore Showrooms. Concessions are calculated and applied directly to the net Value Addition (V.A.) before billing.
                </p>
                <div className="flex flex-wrap items-center gap-5 pt-2 text-xs text-[#7A6E65]">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#4A1019]" />
                    <span className="font-medium text-[#241716]">Trichy Flagship &amp; Mylapore Showrooms</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-[#4A1019]" />
                    <span className="font-medium text-[#241716]">+91 98765 43210</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
              <button
                type="button"
                onClick={() => navigate('/contact')}
                className="bg-gradient-to-r from-[#4A1019] via-[#3B0710] to-[#28040A] hover:from-[#5C1521] hover:to-[#38060F] text-white px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-center transition-all cursor-pointer shadow-md border border-[#C99A38]"
              >
                Book Personal Bridal Consultation
              </button>
              
              <a
                href="https://wa.me/919876543210?text=Hello%20Vedha%20Radha%20team,%20I%20would%20like%20to%20inquire%20about%20the%20Festive%20Swarna%20Utsav%20offers."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Showroom Concierge</span>
              </a>
            </div>

          </div>
        </section>

      </div>

      {/* =========================================================================
          LEARN MORE MODAL
      ========================================================================= */}
      <AnimatePresence>
        {showLearnMoreModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="bg-[#FFFDF9] rounded-[32px] max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-[#D4AF37] shadow-2xl p-6 sm:p-8 relative"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowLearnMoreModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-[#7A6E65] hover:text-[#241716] hover:bg-[#FAF4ED] transition-colors cursor-pointer"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="pr-8 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4A1019] bg-[#4A1019]/10 px-3.5 py-1 rounded-full border border-[#4A1019]/20">
                  Campaign Overview &amp; Guidelines
                </span>
                <h3 
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  className="text-2xl sm:text-3xl font-bold text-[#241716] mt-2.5"
                >
                  Vedha Radha Festive Swarna Utsav
                </h3>
                <p className="text-xs text-[#7A6E65] mt-1">
                  Valid from 09th Oct 2026 to 08th Nov 2026 across all Vedha Radha showrooms.
                </p>
              </div>

              {/* Campaign Highlights in Modal */}
              <div className="space-y-3.5 text-xs sm:text-[13px] text-[#554942] leading-relaxed">
                <div className="bg-[#FAF3E5] p-4 rounded-2xl border border-[#E8C77D]">
                  <h4 className="font-bold text-[#4A1019] text-sm mb-1">
                    1. 50% Concession on Value Addition (V.A.)
                  </h4>
                  <p>
                    Customers enjoy an instant 50% reduction on the making charges (V.A.) across our entire showcase of 22K hallmarked antique choker sets, Chola harams, bangles, and bridal collections.
                  </p>
                </div>

                <div className="bg-[#FAF3E5] p-4 rounded-2xl border border-[#E8C77D]">
                  <h4 className="font-bold text-[#4A1019] text-sm mb-1">
                    2. 100% Old Gold Exchange Value
                  </h4>
                  <p>
                    Bring your old gold jewellery manufactured by any jeweller. We provide transparent electronic karatmeter purity testing with 0% deduction on net purity weight.
                  </p>
                </div>

                <div className="bg-[#FAF3E5] p-4 rounded-2xl border border-[#E8C77D]">
                  <h4 className="font-bold text-[#4A1019] text-sm mb-1">
                    3. 10% Advance Gold Rate Protection
                  </h4>
                  <p>
                    Worried about fluctuating market gold prices? Book your dream wedding jewellery with just 10% advance deposit. If gold prices drop at billing, you pay the lower price; if prices rise, you pay the locked rate.
                  </p>
                </div>
              </div>

              {/* Modal Footer CTA */}
              <div className="mt-8 pt-5 border-t border-[#DECDBB] flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => {
                    handleCopy('FESTIVE-50');
                    setShowLearnMoreModal(false);
                  }}
                  className="w-full sm:w-auto bg-gradient-to-r from-[#4A1019] to-[#28040A] text-white px-6 py-2.5 rounded-full text-xs font-bold cursor-pointer text-center border border-[#C99A38]"
                >
                  Copy Promo Code &amp; Claim
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLearnMoreModal(false);
                    navigate('/contact');
                  }}
                  className="w-full sm:w-auto border border-[#DECDBB] text-[#554942] hover:bg-[#FAF4ED] px-6 py-2.5 rounded-full text-xs font-semibold cursor-pointer text-center"
                >
                  Book Showroom Consultation
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
