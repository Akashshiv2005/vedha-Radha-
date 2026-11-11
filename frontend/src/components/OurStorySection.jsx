import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OurStorySection() {
  const navigate = useNavigate();

  return (
    <section className="bg-[#FAF7F2] py-12 sm:py-16 select-none">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Panoramic Banner Card */}
        <motion.div 
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl overflow-hidden shadow-lg border border-[#DECDBB] min-h-[300px] lg:min-h-[340px] grid grid-cols-1 lg:grid-cols-12 bg-gradient-to-r from-[#FAF3E6] via-[#FAF5EE] to-[#F5ECE0]"
        >
          
          {/* Left: High-Res Flagship Showroom Photograph (5 cols on lg) */}
          <div className="lg:col-span-5 relative min-h-[220px] sm:min-h-[280px] lg:min-h-full overflow-hidden">
            <img
              src="/images/generated/luxury_showroom_exterior.jpg"
              alt="Vedha Radha Flagship Showroom in Trichy"
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
              loading="lazy"
            />
            {/* Subtle gradient blending into the right container */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#FAF3E6]/60 hidden lg:block pointer-events-none" />
          </div>

          {/* Right: Story Typography with Temple Gopuram & Lotus art (7 cols on lg) */}
          <div className="lg:col-span-7 relative p-6 sm:p-10 lg:p-14 flex flex-col justify-center text-left">
            
            {/* Background Temple Gopuram & Lotus Line-Art Watermark */}
            <div className="absolute right-4 bottom-2 opacity-15 pointer-events-none w-48 h-48 sm:w-64 sm:h-64 text-[#917144]">
              <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
                {/* Stylized Gopuram / Temple motif */}
                <path d="M50 5 L55 20 L45 20 Z" />
                <path d="M40 22 H60 V30 H40 Z" />
                <path d="M35 32 H65 V42 H35 Z" />
                <path d="M30 44 H70 V56 H30 Z" />
                <path d="M25 58 H75 V72 H25 Z" />
                <path d="M20 74 H80 V92 H20 Z" />
              </svg>
            </div>

            <div className="relative z-10 max-w-lg">
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#917144] font-semibold mb-1.5 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>OUR STORY</span>
              </motion.span>

              <h3 
                style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#4E0C16] leading-tight"
              >
                A Trusted Name in Fine Jewellery
              </h3>

              <p className="text-xs sm:text-sm text-[#4A3D36] mt-3 leading-relaxed font-normal">
                Blending traditional craftsmanship with contemporary designs, Vedha Radha has been a part of your celebrations since 2010. Handcrafted with devotion in Trichy, Tamil Nadu.
              </p>

              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  onClick={() => navigate('/about')}
                  className="btn-shine-sweep inline-flex items-center gap-2 bg-[#581923] hover:bg-[#431219] text-[#FAF7F2] px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <span>Know More</span>
                  <ArrowRight className="w-4 h-4 text-[#D4AF37] stroke-[2.2]" />
                </button>
              </div>
            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}
