import React, { useState } from 'react';
import { MapPin, Phone, Clock, Mail, Calendar, Send, CheckCircle2, User, Sparkles, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactConciergeSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'Bridal Trousseau Consultation',
    date: '',
    notes: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        phone: '',
        service: 'Bridal Trousseau Consultation',
        date: '',
        notes: ''
      });
    }, 4500);
  };

  return (
    <section 
      id="contact-concierge" 
      className="relative bg-gradient-to-b from-[#FAF4EB] via-[#F6ECE0] to-[#EFE2D2] text-[#2C1810] pt-16 sm:pt-20 pb-16 sm:pb-24 select-none w-full overflow-hidden border-t border-[#D4AF37]/40"
    >
      
      {/* 1. TOP-LEFT: Traditional Temple Arch with Gold Molding */}
      <div className="absolute top-0 left-0 w-48 sm:w-64 md:w-80 h-36 sm:h-48 md:h-56 pointer-events-none z-0">
        <svg viewBox="0 0 280 180" fill="none" className="w-full h-full opacity-90">
          <path d="M0 0 L0 180 C40 160 80 130 90 90 C100 50 140 10 280 0 Z" fill="#4A0E18" />
          <path d="M0 0 L0 170 C36 150 75 120 85 85 C95 45 135 8 270 0" stroke="#D4AF37" strokeWidth="3" />
          <path d="M0 0 L0 160 C32 140 70 110 80 80 C90 40 130 5 260 0" stroke="#FCEB9C" strokeWidth="1.2" opacity="0.8" />
        </svg>
      </div>

      {/* 2. TOP-RIGHT: Traditional Temple Arch with Gold Molding */}
      <div className="absolute top-0 right-0 w-48 sm:w-64 md:w-80 h-36 sm:h-48 md:h-56 pointer-events-none z-0">
        <svg viewBox="0 0 280 180" fill="none" className="w-full h-full opacity-90 scale-x-[-1]">
          <path d="M0 0 L0 180 C40 160 80 130 90 90 C100 50 140 10 280 0 Z" fill="#4A0E18" />
          <path d="M0 0 L0 170 C36 150 75 120 85 85 C95 45 135 8 270 0" stroke="#D4AF37" strokeWidth="3" />
          <path d="M0 0 L0 160 C32 140 70 110 80 80 C90 40 130 5 260 0" stroke="#FCEB9C" strokeWidth="1.2" opacity="0.8" />
        </svg>
      </div>

      {/* Hanging Brass Diya Lamp on Left */}
      <div className="absolute top-0 left-12 sm:left-20 md:left-24 pointer-events-none z-10 hidden sm:block">
        <div className="flex flex-col items-center">
          <div className="w-[1.5px] h-16 md:h-24 bg-gradient-to-b from-[#A57822] via-[#E5C278] to-[#C99A38]" />
          <div className="w-4 h-2.5 bg-[#C99A38] rounded-t-full shadow-xs" />
          <div className="relative flex items-center justify-center">
            <svg viewBox="0 0 60 40" fill="none" className="w-11 h-8 drop-shadow-[0_4px_12px_rgba(229,194,120,0.6)]">
              <path d="M10 20 C10 32 50 32 50 20 C42 22 18 22 10 20 Z" fill="#D4AF37" stroke="#A57822" strokeWidth="1" />
              <path d="M20 22 C20 28 40 28 40 22 Z" fill="#B38E46" />
              <path d="M30 32 L30 38 M28 38 L32 38" stroke="#C99A38" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M30 5 C28 11 26 14 30 20 C34 14 32 11 30 5 Z" fill="#FF9500" />
              <path d="M30 9 C29 12 28 14 30 18 C32 14 31 12 30 9 Z" fill="#FFF275" />
            </svg>
            <div className="absolute -inset-4 rounded-full bg-radial from-[#FFA500]/30 via-[#FFE5A3]/15 to-transparent blur-md pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Subtle South Indian Temple Gopuram Silhouette in Bottom Left */}
      <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-40 sm:h-52 pointer-events-none z-0 opacity-15">
        <svg viewBox="0 0 200 150" fill="none" className="w-full h-full text-[#7A5A40]">
          <path d="M40 150 L60 40 L70 40 L70 20 L80 20 L80 10 L120 10 L120 20 L130 20 L130 40 L140 40 L160 150 Z" fill="currentColor" />
          <path d="M50 150 L70 50 L130 50 L150 150" stroke="#FFF" strokeWidth="0.8" opacity="0.4" />
        </svg>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* =========================================================================
            HEADER: MATCHING EXACT REFERENCE IMAGE
           ========================================================================= */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          
          {/* Eyebrow: — GET IN TOUCH — */}
          <div className="flex items-center justify-center gap-3 mb-1">
            <span className="w-10 sm:w-16 h-[1.5px] bg-[#C99A38]" />
            <span className="text-[11px] sm:text-[12px] font-sans font-bold uppercase tracking-[0.25em] text-[#8C6512]">
              GET IN TOUCH
            </span>
            <span className="w-10 sm:w-16 h-[1.5px] bg-[#C99A38]" />
          </div>

          <div className="flex justify-center text-[#C99A38] text-xs mb-1">✦</div>

          {/* Headline */}
          <h2 
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
            className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#4E0C16] tracking-tight leading-tight"
          >
            Contact &amp; Showroom Concierge
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-[14px] text-[#6E5D53] font-normal tracking-wide mt-2 max-w-xl mx-auto">
            Reach out to our master jewelers or book a dedicated private preview at our Vedha Radha Thanga Maaligai showroom in Tiruchirappalli.
          </p>

          {/* Golden Lotus Blossom Emblem */}
          <div className="flex justify-center mt-3">
            <svg viewBox="0 0 60 36" fill="none" className="w-9 h-5 text-[#D4AF37] drop-shadow-xs">
              <path d="M30 4 C27 16 18 24 6 28 C16 30 24 28 30 25 C36 28 44 30 54 28 C42 24 33 16 30 4 Z" fill="#D4AF37" />
              <path d="M30 9 C26 18 20 23 12 26 C18 27 24 26 30 24 C36 26 42 27 48 26 C40 23 34 18 30 9 Z" fill="#FCEB9C" opacity="0.85" />
              <circle cx="30" cy="27" r="2" fill="#D4AF37" />
            </svg>
          </div>
        </div>

        {/* =========================================================================
            MAIN CONCIERGE GRID: LEFT MAROON CARD + RIGHT APPOINTMENT CARD + RIGHT BUST
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* =====================================================================
              LEFT: DEEP ROYAL MAROON CONCIERGE INFO CARD (5 Cols)
             ===================================================================== */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#45050F] via-[#35030A] to-[#250106] text-white rounded-[26px] p-6 sm:p-7 border-2 border-[#D4AF37] shadow-[0_16px_40px_rgba(78,12,22,0.35),0_4px_16px_rgba(212,175,55,0.25)] relative overflow-hidden flex flex-col justify-between">
            
            {/* Subtle inner pinstripe */}
            <div className="absolute inset-1.5 rounded-[22px] border border-[#D4AF37]/35 pointer-events-none" />

            <div className="relative z-10 space-y-5">
              
              {/* Item 1: Location */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full border border-[#D4AF37] bg-white/5 flex items-center justify-center text-[#E5C278] shrink-0 shadow-xs">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    className="text-base font-bold text-white tracking-wide"
                  >
                    Vedha Radha Thanga Maaligai
                  </h3>
                  <p className="text-xs text-[#E5D3BD] mt-1 leading-relaxed">
                    Pavalam Building, Bharathiyar Salai,<br />
                    Tiruchirappalli, Tamil Nadu 620001
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-[#D4AF37]/40 text-[10.5px] text-[#FCEB9C]">
                    <span>🏛️</span>
                    <span>Located in: St. Paul's Shopping Complex</span>
                  </div>
                </div>
              </div>

              {/* Decorative Divider with Central Diamond */}
              <div className="flex items-center gap-2 text-[#D4AF37]/50 py-0.5">
                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
                <span className="text-[10px]">❖</span>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
              </div>

              {/* Item 2: Direct Concierge & Orders */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full border border-[#D4AF37] bg-white/5 flex items-center justify-center text-[#E5C278] shrink-0 shadow-xs">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    className="text-base font-bold text-white tracking-wide"
                  >
                    Direct Concierge &amp; Orders
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#FCEB9C] font-semibold mt-1 font-mono">
                    Phone: <a href="tel:04312415112" className="hover:underline">0431 241 5112</a>
                  </p>
                  <p className="text-[11px] text-[#CBB5A0] mt-0.5">
                    WhatsApp Concierge &amp; Video Call Consultations
                  </p>
                </div>
              </div>

              {/* Decorative Divider */}
              <div className="flex items-center gap-2 text-[#D4AF37]/50 py-0.5">
                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
                <span className="text-[10px]">❖</span>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
              </div>

              {/* Item 3: Showroom Timings */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full border border-[#D4AF37] bg-white/5 flex items-center justify-center text-[#E5C278] shrink-0 shadow-xs">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    className="text-base font-bold text-white tracking-wide"
                  >
                    Showroom Timings
                  </h3>
                  <p className="text-xs text-[#E5D3BD] mt-1">
                    Monday to Sunday (All 7 Days)
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1F0206] border border-[#D4AF37]/60 text-xs font-bold text-[#FCEB9C] font-mono shadow-inner">
                    <span>📅</span>
                    <span>9:30 AM &ndash; 8:30 PM (IST)</span>
                  </div>
                </div>
              </div>

              {/* Decorative Divider */}
              <div className="flex items-center gap-2 text-[#D4AF37]/50 py-0.5">
                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
                <span className="text-[10px]">❖</span>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
              </div>

              {/* Item 4: Email Inquiries */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full border border-[#D4AF37] bg-white/5 flex items-center justify-center text-[#E5C278] shrink-0 shadow-xs">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    className="text-base font-bold text-white tracking-wide"
                  >
                    Email Inquiries
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#FCEB9C] mt-1 font-mono">
                    <a href="mailto:care@vedharadhajewellery.com" className="hover:underline">
                      care@vedharadhajewellery.com
                    </a>
                  </p>
                  <p className="text-[11px] text-[#CBB5A0] mt-0.5">
                    Replies within 2 business hours
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* =====================================================================
              RIGHT: CREAM/IVORY APPOINTMENT BOOKING CARD (7 Cols)
             ===================================================================== */}
          <div className="lg:col-span-7 bg-[#FFFEFC] rounded-[26px] p-6 sm:p-8 border-2 border-[#D4AF37] shadow-[0_16px_40px_rgba(78,12,22,0.12),0_4px_16px_rgba(201,154,56,0.18)] relative overflow-hidden">
            
            {/* Delicate Inner Pinstripe */}
            <div className="absolute inset-1.5 rounded-[22px] border border-[#D4AF37]/35 pointer-events-none" />

            <div className="relative z-10">
              
              {/* VIP Appointment Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4E0C16] text-[#FCEB9C] border border-[#D4AF37] text-[11px] font-bold tracking-widest uppercase shadow-sm mb-3">
                <svg className="w-3.5 h-3.5 text-[#FCEB9C] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5ZM19 19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V17H19V19Z"/>
                </svg>
                <span>VIP APPOINTMENT</span>
              </div>

              {/* Title */}
              <h3 
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                className="text-2xl sm:text-3xl font-bold text-[#4E0C16] tracking-tight leading-tight"
              >
                Book a Dedicated Showroom Appointment
              </h3>

              {/* Subtitle */}
              <p className="text-xs sm:text-[13px] text-[#6E5D53] mt-1.5 leading-relaxed">
                Reserve private time with our senior bridal consultants to explore wedding sets, custom designs, or old gold evaluation.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                
                {/* Row 1: Full Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3B0710] mb-1">
                      Full Name <span className="text-[#C93545]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A88B58]">
                        <User className="w-4 h-4" />
                      </div>
                      <input 
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Smt. Radha Ramanathan"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-[#FDF8F0] border border-[#DECDBB] rounded-xl text-xs sm:text-[13px] text-[#2C1810] placeholder:text-[#A08F83] focus:outline-none focus:border-[#4E0C16] focus:ring-1 focus:ring-[#4E0C16] transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3B0710] mb-1">
                      Phone / WhatsApp <span className="text-[#C93545]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A88B58]">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input 
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0431 241 5112"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-[#FDF8F0] border border-[#DECDBB] rounded-xl text-xs sm:text-[13px] text-[#2C1810] placeholder:text-[#A08F83] focus:outline-none focus:border-[#4E0C16] focus:ring-1 focus:ring-[#4E0C16] transition-all shadow-inner font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Service Required & Preferred Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3B0710] mb-1">
                      Service Required
                    </label>
                    <div className="relative">
                      <select 
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#FDF8F0] border border-[#DECDBB] rounded-xl text-xs sm:text-[13px] text-[#2C1810] focus:outline-none focus:border-[#4E0C16] focus:ring-1 focus:ring-[#4E0C16] transition-all shadow-inner cursor-pointer"
                      >
                        <option value="Bridal Trousseau Consultation">💎 Bridal Trousseau Consultation</option>
                        <option value="Certified Solitaire Diamond Preview">💍 Certified Solitaire Diamond Preview</option>
                        <option value="Antique Nakshi & Temple Jewellery">👑 Antique Nakshi &amp; Temple Jewellery</option>
                        <option value="Old Gold Exchange & Valuation">⚖️ Old Gold Exchange &amp; Evaluation</option>
                        <option value="Custom Bespoke Design Session">✨ Custom Bespoke Design Session</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3B0710] mb-1">
                      Preferred Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A88B58]">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <input 
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-2.5 bg-[#FDF8F0] border border-[#DECDBB] rounded-xl text-xs sm:text-[13px] text-[#2C1810] focus:outline-none focus:border-[#4E0C16] focus:ring-1 focus:ring-[#4E0C16] transition-all shadow-inner cursor-pointer font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: Notes or Specific Requirements */}
                <div>
                  <label className="block text-xs font-bold text-[#3B0710] mb-1">
                    Notes or Specific Requirements
                  </label>
                  <textarea 
                    rows="3"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Mention any specific necklace length, budget range, or bridal dates..."
                    className="w-full px-3.5 py-2.5 bg-[#FDF8F0] border border-[#DECDBB] rounded-xl text-xs sm:text-[13px] text-[#2C1810] placeholder:text-[#A08F83] focus:outline-none focus:border-[#4E0C16] focus:ring-1 focus:ring-[#4E0C16] transition-all shadow-inner resize-none"
                  />
                </div>

                {/* Submit CTA Button */}
                <button
                  type="submit"
                  disabled={isSubmitted}
                  className="w-full mt-2 py-3.5 px-8 rounded-full bg-gradient-to-r from-[#4E0C16] via-[#3B0710] to-[#28040A] hover:from-[#65101E] hover:to-[#38060F] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 border border-[#D4AF37] shadow-[0_10px_25px_rgba(78,12,22,0.35)] hover:shadow-[0_16px_35px_rgba(78,12,22,0.5)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                >
                  {isSubmitted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#86EFAC]" />
                      <span>Appointment Requested Successfully ✓</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#E5C278]" />
                      <span>Confirm Showroom Appointment</span>
                      <span className="text-[#E5C278] ml-1">&rarr;</span>
                    </>
                  )}
                </button>

              </form>

            </div>

          </div>

        </div>

        {/* =========================================================================
            FIND OUR SHOWROOM - INTERACTIVE GOOGLE MAP BANNER CARD
           ========================================================================= */}
        <div className="mt-10 sm:mt-14 rounded-[24px] sm:rounded-[28px] border-2 border-[#D4AF37]/75 overflow-hidden shadow-[0_16px_40px_rgba(78,12,22,0.18)] bg-white flex flex-col lg:flex-row items-stretch">
          
          {/* Left Panel: Deep Royal Maroon Showroom Brief */}
          <div className="w-full lg:w-[380px] xl:w-[420px] bg-gradient-to-br from-[#45050F] via-[#35030A] to-[#250106] p-7 sm:p-9 text-white relative flex flex-col justify-between shrink-0 overflow-hidden">
            
            {/* Subtle inner pinstripe */}
            <div className="absolute inset-1.5 rounded-[22px] border border-[#D4AF37]/25 pointer-events-none" />

            {/* Content Top */}
            <div className="relative z-10">
              {/* Location Pin Icon in Gold Ring */}
              <div className="w-10 h-10 rounded-full border border-[#D4AF37] bg-white/5 flex items-center justify-center text-[#E5C278] shadow-sm mb-4">
                <MapPin className="w-5 h-5 text-[#E5C278]" />
              </div>

              {/* Title */}
              <h3 
                style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
                className="text-2xl sm:text-[26px] font-bold text-white tracking-wide mb-3 leading-snug"
              >
                Find Our Showroom
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-[13.5px] text-[#E5D3BD] leading-relaxed mb-6 font-normal">
                Visit Vedha Radha Thanga Maaligai in the heart of Tiruchirappalli. Get directions, check the location, and plan your visit easily.
              </p>

              {/* CTA: Get Directions on Google Maps */}
              <a
                href="https://www.google.com/maps/dir/Vedha+Radha+Thanga+Maaligai,+Pavalam+Building,+Bharathiyar+Salai,+Tiruchirappalli,+Tamil+Nadu+620001/Vedha+Radha+Thanga+Maaligai,+Pavalam+Building,+Bharathiyar+Salai,+Tiruchirappalli,+Tamil+Nadu+620001/@10.8232704,78.6858411,14z/data=!4m13!4m12!1m5!1m1!1s0x3baaf510c943625f:0xdd6b2d67f988e178!2m2!1d78.6892312!2d10.8006859!1m5!1m1!1s0x3baaf510c943625f:0xdd6b2d67f988e178!2m2!1d78.6892312!2d10.8006859?entry=ttu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[#D4AF37] bg-white/5 hover:bg-[#D4AF37] text-[#FCEB9C] hover:text-[#35030A] font-semibold text-xs sm:text-[13px] tracking-wide transition-all shadow-md group cursor-pointer relative z-10 w-fit"
              >
                <Navigation className="w-3.5 h-3.5 rotate-45 text-[#E5C278] group-hover:text-[#35030A] transition-colors" />
                <span>Get Directions on Google Maps</span>
                <span className="text-xs text-[#E5C278] group-hover:text-[#35030A] font-bold">↗</span>
              </a>
            </div>

            {/* South Indian Temple Gopuram Line Art Watermark at Bottom */}
            <div className="absolute -bottom-1 -left-4 -right-4 pointer-events-none opacity-20 flex justify-center">
              <svg viewBox="0 0 320 180" fill="none" className="w-[340px] h-[160px] text-[#E5C278]">
                <path d="M20 180 L300 180" stroke="currentColor" strokeWidth="1.5" />
                <path d="M40 180 L55 140 L265 140 L280 180 Z" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.04" />
                <path d="M60 140 L72 105 L248 105 L260 140 Z" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.04" />
                <path d="M78 105 L90 75 L230 75 L242 105 Z" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.04" />
                <path d="M96 75 L106 50 L214 50 L224 75 Z" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.04" />
                <path d="M112 50 L120 30 L200 30 L208 50 Z" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.04" />
                <path d="M125 30 L135 15 L185 15 L195 30 Z" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.04" />
                
                <path d="M140 15 L140 6 M150 15 L150 3 M160 15 L160 2 M170 15 L170 3 M180 15 L180 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="140" cy="5" r="2" fill="currentColor" />
                <circle cx="150" cy="2.5" r="2.2" fill="currentColor" />
                <circle cx="160" cy="1.5" r="2.5" fill="currentColor" />
                <circle cx="170" cy="2.5" r="2.2" fill="currentColor" />
                <circle cx="180" cy="5" r="2" fill="currentColor" />

                <path d="M160 30 L160 180" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />
                <path d="M110 140 L110 180 M210 140 L210 180" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
                <path d="M125 105 L125 140 M195 105 L195 140" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
                
                <path d="M140 180 L140 155 C140 145 180 145 180 155 L180 180 Z" stroke="currentColor" strokeWidth="1.2" fill="#250106" />
                <path d="M145 180 L145 158 C145 150 175 150 175 158 L175 180" stroke="currentColor" strokeWidth="0.8" />
              </svg>
            </div>

          </div>

          {/* Right Panel: Embedded Interactive Google Map */}
          <div className="w-full lg:flex-1 min-h-[340px] sm:min-h-[380px] lg:min-h-[400px] relative bg-[#FAF7F2]">
            <iframe
              title="Vedha Radha Thanga Maaligai Showroom Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.995945826508!2d78.6866562758385!3d10.800685889349886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baaf510c943625f%3A0xdd6b2d67f988e178!2sVedha%20Radha%20Thanga%20Maaligai!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              className="w-full h-full min-h-[340px] sm:min-h-[380px] lg:min-h-[400px] border-0 block"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </div>

      </div>
    </section>
  );
}

