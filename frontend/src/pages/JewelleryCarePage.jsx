import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ShieldCheck, RefreshCw, Calendar, CheckCircle2, Award, Gem, Phone, MapPin } from 'lucide-react';

export default function JewelleryCarePage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#FAF7F2] min-h-screen select-none font-sans">
      
      {/* 1. Hero Header */}
      <section className="bg-gradient-to-r from-[#4E0C16] to-[#34070E] text-white py-16 sm:py-20 border-b border-[#D4AF37]/30 text-center">
        <div className="max-w-[1200px] mx-auto px-4">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block mb-2">
            LIFETIME PRESERVATION &bull; VALUE ASSURANCE
          </span>
          <h1 
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            className="text-3xl sm:text-5xl font-bold text-white tracking-tight"
          >
            Jewellery Care &amp; Purity Guide
          </h1>
          <p 
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            className="text-base sm:text-xl text-[#E5C058] italic mt-3 max-w-xl mx-auto font-normal"
          >
            Ensuring Your Treasured Heirlooms Shine for Generations.
          </p>
        </div>
      </section>

      {/* 2. Three Metal Care Guides */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: 22K Gold Care */}
          <div className="bg-white rounded-2xl border border-[#EBE1D3] p-6 shadow-xs hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#FAF5EB] text-[#B88E3E] flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              className="text-xl font-bold text-[#4E0C16]"
            >
              22K Gold Jewellery Care
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-[#5C5046] leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>Store each piece in separate velvet or silk-lined compartments to prevent surface abrasions.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>Avoid wearing while applying cosmetics, perfumes, or hairsprays which can cloud gold luster.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>Clean gently with lukewarm water and a soft-bristled brush, then pat dry with chamois cloth.</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Diamonds */}
          <div className="bg-white rounded-2xl border border-[#EBE1D3] p-6 shadow-xs hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#FAF5EB] text-[#18233C] flex items-center justify-center mb-4">
              <Gem className="w-6 h-6 text-[#18233C]" />
            </div>
            <h3 
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              className="text-xl font-bold text-[#18233C]"
            >
              Diamond Solitaires &amp; Rings
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-[#5C5046] leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#18233C] shrink-0 mt-0.5" />
                <span>Diamonds attract skin oils; clean weekly in mild soapy water to maintain maximum light scintillation.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#18233C] shrink-0 mt-0.5" />
                <span>Have prong settings inspected once a year to verify that stones remain tightly held.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#18233C] shrink-0 mt-0.5" />
                <span>Remove before vigorous physical exercise or handling heavy tools to protect the platinum prongs.</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Silver */}
          <div className="bg-white rounded-2xl border border-[#EBE1D3] p-6 shadow-xs hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#FAF5EB] text-[#581923] flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-[#8C6D2D]" />
            </div>
            <h3 
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              className="text-xl font-bold text-[#4E0C16]"
            >
              Silver Jewellery &amp; Pooja Items
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-[#5C5046] leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>Keep in airtight ziplock bags away from ambient moisture and direct humidity.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>Use specialized silver polishing foam or vibhuti for ritual pooja lamps; avoid abrasive scouring pads.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>Bring your silver vessels to our Trichy showroom for complimentary ultrasonic brightening anytime.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 3. Old Gold Exchange & Purity Testing */}
      <section className="bg-white py-16 border-t border-b border-[#EAE2D5]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-[11px] font-semibold tracking-widest text-[#917144] uppercase block mb-1">
                TRANSPARENT VALUATION GUARANTEE
              </span>
              <h2 
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                className="text-2xl sm:text-4xl font-bold text-[#4E0C16] tracking-tight"
              >
                Old Gold Exchange with German Karatmeter
              </h2>
              <p className="text-xs sm:text-sm text-[#5C5046] mt-4 leading-relaxed font-light">
                Upgrade your old gold ornaments into fresh contemporary or bridal designs with 100% transparent testing.
              </p>

              <div className="mt-6 space-y-3 text-xs text-[#4A3D36]">
                <div className="flex items-center gap-3 p-3 bg-[#FAF7F2] rounded-xl border border-[#EAE2D5]">
                  <span className="w-6 h-6 rounded-full bg-[#581923] text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
                  <span>Non-destructive XRF laser testing in your full view within 60 seconds.</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#FAF7F2] rounded-xl border border-[#EAE2D5]">
                  <span className="w-6 h-6 rounded-full bg-[#581923] text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
                  <span>Exact carat calculation based on live benchmark market gold rate with 0% hidden deductions.</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#FAF7F2] rounded-xl border border-[#EAE2D5]">
                  <span className="w-6 h-6 rounded-full bg-[#581923] text-white flex items-center justify-center font-bold text-xs shrink-0">3</span>
                  <span>Instant credit applied directly against your chosen new jewellery pieces.</span>
                </div>
              </div>
            </div>

            <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-2xl border border-[#DECDBB] text-center">
              <h4 
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                className="text-xl font-bold text-[#4E0C16]"
              >
                Complimentary Lifetime Spa for Your Jewellery
              </h4>
              <p className="text-xs text-[#7A6E65] mt-2 max-w-sm mx-auto">
                All Vedha Radha jewellery pieces come with lifetime complimentary ultrasonic cleaning, stone tightening, and purity assay.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/contact')}
                  className="btn-shine-sweep bg-[#581923] hover:bg-[#431219] text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Book In-Store Spa &amp; Inspection
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

