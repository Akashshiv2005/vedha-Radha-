import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Sparkles, ShieldCheck, ArrowRight, Calendar, Palette, Scale, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WhyChooseUs() {
  const navigate = useNavigate();

  const bridalPillars = [
    {
      id: 'private-salon',
      icon: Crown,
      badge: 'Exclusive Flagship Salon',
      title: 'Private Suite & Trousseau Styling',
      desc: 'An intimate one-on-one styling suite in our flagship Thillai Nagar boutique. Experience full bridal trials, matching Kasu Harams, Vankis, and Nakshi Chokers directly against your wedding Kanchipuram silks.',
      features: ['Dedicated Bridal Consultant', 'Silk Saree Color Matching', 'Complete Muhurtham Suite Trial'],
      path: '/contact'
    },
    {
      id: 'custom-craft',
      icon: Palette,
      badge: 'Fourth-Generation Goldsmiths',
      title: 'Custom Nakshi & Heirloom Casting',
      desc: 'Collaborate directly with our master karigars to hand-sketch and hand-chase one-of-a-kind antique 22K temple masterpieces engraved with your sacred family deity and Ashtalakshmi motifs.',
      features: ['Personalized Design Sketching', 'Consecrated Temple Motifs', 'Pure 22K BIS 916 Hallmark'],
      path: '/temple-heritage'
    },
    {
      id: 'gold-exchange',
      icon: Scale,
      badge: 'Zero Deduction Policy',
      title: 'Transparent Laser Gold Exchange',
      desc: 'Upgrade ancestral heirlooms with non-destructive German XRF laser Karatmeter testing. Enjoy 100% weight-for-weight pure gold valuation tested transparently before your eyes with zero deduction.',
      features: ['Non-Destructive XRF Testing', 'Full Market Weight Valuation', '0% Making Charge on Select Sets'],
      path: '/jewellery-care'
    }
  ];

  return (
    <section className="bg-gradient-to-b from-[#FAF7F2] via-[#FFFDF9] to-[#FAF7F2] py-14 sm:py-20 border-t border-b border-[#EAE2D5] select-none">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF3E6] border border-[#DECDBB] mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#8C6D2D] font-semibold">
              ROYAL ATELIER & PRIVATE SALON
            </span>
          </div>

          <h2 
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#4E0C16] tracking-tight leading-snug"
          >
            Bespoke Muhurtham Styling & Private Bridal Salon
          </h2>
          
          <p className="text-xs sm:text-sm text-[#73655C] mt-2 font-normal leading-relaxed">
            Curating Sacred Trousseaus with Fourth-Generation Hereditary Goldsmiths in Trichy, Tamil Nadu.
          </p>
        </motion.div>

        {/* 3 Opulent Bridal Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
          {bridalPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: idx * 0.12 }}
                onClick={() => navigate(pillar.path)}
                className="group relative bg-[#FFFDF9] hover:bg-white rounded-3xl border border-[#EAE2D5] hover:border-[#D4AF37] p-6 sm:p-7 flex flex-col justify-between shadow-[0_4px_20px_rgba(78,12,22,0.03)] hover:shadow-[0_12px_32px_rgba(78,12,22,0.08)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Subtle golden corner glow on hover */}
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#D4AF37]/10 rounded-full blur-xl group-hover:bg-[#D4AF37]/20 transition-colors pointer-events-none" />

                <div>
                  {/* Top Bar: Icon & Pill Badge */}
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FAF3E6] to-[#F2E5D0] border border-[#D4AF37]/40 text-[#581923] flex items-center justify-center group-hover:bg-[#581923] group-hover:text-white transition-colors duration-300 shadow-xs">
                      <Icon className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <span className="text-[10.5px] font-semibold text-[#8C6D2D] bg-[#FAF5EB] px-3 py-1 rounded-full border border-[#E8DFC8]">
                      {pillar.badge}
                    </span>
                  </div>

                  {/* Heading */}
                  <h3 
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    className="text-lg sm:text-xl font-bold text-[#2A1810] group-hover:text-[#4E0C16] transition-colors leading-snug mb-2.5"
                  >
                    {pillar.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-[13px] text-[#63554C] font-light leading-relaxed mb-5">
                    {pillar.desc}
                  </p>

                  {/* Feature Checklist */}
                  <div className="space-y-2 pt-3 border-t border-[#F2EAE0]">
                    {pillar.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs text-[#4A3D36]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                        <span className="font-normal">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Link */}
                <div className="mt-6 pt-4 border-t border-[#F2EAE0] flex items-center justify-between text-xs font-semibold text-[#581923] group-hover:text-[#8C1B33]">
                  <span>Discover Experience</span>
                  <div className="w-7 h-7 rounded-full bg-[#FAF5EB] group-hover:bg-[#581923] text-[#8C6D2D] group-hover:text-white flex items-center justify-center transition-all duration-300 shrink-0">
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Booking CTA Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 sm:mt-14 rounded-2xl bg-gradient-to-r from-[#3B070F] via-[#4E0C16] to-[#3B070F] p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-[#D4AF37]/30"
        >
          <div className="text-center md:text-left">
            <span className="text-[11px] font-semibold text-[#D4AF37] uppercase tracking-[0.2em] block mb-1">
              SACRED CELEBRATION ASSISTANCE
            </span>
            <h4 
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              className="text-xl sm:text-2xl font-bold leading-tight"
            >
              Planning Your Muhurtham or Auspicious Occasion?
            </h4>
            <p className="text-xs sm:text-sm text-[#F0E6E6] font-light mt-1 max-w-xl">
              Reserve your private styling appointment at our Thillai Nagar salon with master bridal consultants.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/contact')}
              className="btn-shine-sweep inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] via-[#E5C058] to-[#C59B27] hover:brightness-110 text-[#241716] font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 stroke-[2.2]" />
              <span>Book Private Bridal Salon</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/bridal')}
              className="inline-flex items-center gap-1.5 bg-[#581923]/80 hover:bg-[#581923] border border-[#D4AF37]/60 text-white font-medium text-xs sm:text-sm px-5 py-3 rounded-xl transition-all cursor-pointer shadow-xs hover:border-[#D4AF37]"
            >
              <span>Explore Bridal Sets</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
