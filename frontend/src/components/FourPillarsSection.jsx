import React from 'react';
import { motion } from 'framer-motion';

const PILLARS = [
  {
    id: 'hallmark',
    titleLine1: '100% BIS 916',
    titleLine2: 'Hallmark',
    description:
      'Your trust begins with purity. Our gold jewellery carries the official BIS 916 hallmark, assuring certified quality.',
    renderIcon: () => (
      <svg viewBox="0 0 60 60" className="w-12 h-12" fill="none">
        <polygon
          points="30,6 52,36 8,36"
          stroke="#FFEAA7"
          strokeWidth="3.2"
          strokeLinejoin="round"
          fill="rgba(255, 234, 167, 0.18)"
        />
        <circle cx="30" cy="24" r="3.2" fill="#FFEAA7" />
        <text
          x="30"
          y="48"
          textAnchor="middle"
          fill="#FFEAA7"
          fontSize="9.5"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="1.2"
        >
          BIS 916
        </text>
      </svg>
    )
  },
  {
    id: 'mastery',
    titleLine1: 'Four Generations',
    titleLine2: 'of Mastery',
    description:
      'A heritage of craftsmanship passed down through four generations, preserving traditional South Indian techniques like repousse, nakshi and filigree.',
    renderIcon: () => (
      <svg viewBox="0 0 60 60" className="w-11 h-11" fill="none">
        {/* Hammer 1 */}
        <g transform="rotate(45 30 30)">
          <rect x="18" y="13" width="24" height="7" rx="1.5" fill="#FFEAA7" stroke="#D4AF37" strokeWidth="0.8" />
          <rect x="28" y="20" width="4" height="26" rx="2" fill="#FFEAA7" />
          <circle cx="30" cy="46" r="2.2" fill="#FFEAA7" />
        </g>
        {/* Hammer 2 */}
        <g transform="rotate(-45 30 30)">
          <rect x="18" y="13" width="24" height="7" rx="1.5" fill="#FFEAA7" stroke="#D4AF37" strokeWidth="0.8" />
          <rect x="28" y="20" width="4" height="26" rx="2" fill="#FFEAA7" />
          <circle cx="30" cy="46" r="2.2" fill="#FFEAA7" />
        </g>
      </svg>
    )
  },
  {
    id: 'purity',
    titleLine1: 'Devotional',
    titleLine2: 'Purity & Trust',
    description:
      "From sacred temple jewels to wedding trousseaus, we create jewellery for life's most meaningful and auspicious occasions.",
    renderIcon: () => (
      <svg viewBox="0 0 60 60" className="w-11 h-11" fill="none">
        {/* Outer Flame */}
        <path
          d="M30,8 C33,13 37.5,18 37.5,23 C37.5,27.5 34.2,30.5 30,30.5 C25.8,30.5 22.5,27.5 22.5,23 C22.5,18 27,13 30,8 Z"
          fill="#FFEAA7"
        />
        {/* Inner Flame Core */}
        <path
          d="M30,14 C31.5,17 34,20 34,23 C34,25.5 32.2,27 30,27 C27.8,27 26,25.5 26,23 C26,20 28.5,17 30,14 Z"
          fill="#FFF9E6"
        />
        {/* Diya Bowl */}
        <path
          d="M13,32 C17.5,39 42.5,39 47,32 C47,36 41.5,43 36,44 L24,44 C18.5,43 13,36 13,32 Z"
          fill="#FFEAA7"
          stroke="#D4AF37"
          strokeWidth="1"
        />
        {/* Pedestal Base */}
        <path d="M22,44 L38,44 L41,49 L19,49 Z" fill="#FFEAA7" />
      </svg>
    )
  },
  {
    id: 'pricing',
    titleLine1: 'Transparent &',
    titleLine2: 'Ethical Pricing',
    description:
      'Complete clarity in every purchase — with exact weight breakdowns, clearly explained making charges and prevailing showroom gold rates, with no hidden deductions.',
    renderIcon: () => (
      <svg viewBox="0 0 60 60" className="w-11 h-11" fill="none">
        {/* Center Pillar */}
        <line x1="30" y1="12" x2="30" y2="47" stroke="#FFEAA7" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="30" cy="12" r="3" fill="#FFEAA7" />
        {/* Base */}
        <path d="M21,47 L39,47 L42,51 L18,51 Z" fill="#FFEAA7" />
        {/* Balance Crossbeam */}
        <line x1="13" y1="18" x2="47" y2="18" stroke="#FFEAA7" strokeWidth="2.4" strokeLinecap="round" />
        {/* Left Pan Cords & Dish */}
        <line x1="14" y1="18" x2="9" y2="30" stroke="#FFEAA7" strokeWidth="1.2" />
        <line x1="14" y1="18" x2="19" y2="30" stroke="#FFEAA7" strokeWidth="1.2" />
        <path d="M7,30 Q14,35.5 21,30 Z" fill="#FFEAA7" />
        {/* Right Pan Cords & Dish */}
        <line x1="46" y1="18" x2="41" y2="30" stroke="#FFEAA7" strokeWidth="1.2" />
        <line x1="46" y1="18" x2="51" y2="30" stroke="#FFEAA7" strokeWidth="1.2" />
        <path d="M39,30 Q46,35.5 53,30 Z" fill="#FFEAA7" />
      </svg>
    )
  }
];

export default function FourPillarsSection() {
  return (
    <section className="relative w-full bg-gradient-to-b from-[#FAF5EC] via-[#FAF3E6] to-[#F5ECE0] py-9 sm:py-12 lg:py-14 px-3 sm:px-6 lg:px-8 overflow-hidden select-none">

      {/* ===================================================================== */}
      {/* SECTION HEADER (Refined Compact Luxury Height)                        */}
      {/* ===================================================================== */}
      <div className="relative max-w-3xl mx-auto text-center mb-6 sm:mb-8 z-10">
        
        {/* Official Brand Logo */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-2"
        >
          <img 
            src="/images/vedha_radha_official_logo.png" 
            alt="Vedha Radha Thangha Maalighai Crest" 
            className="h-10 sm:h-12 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.25)]"
          />
        </motion.div>

        {/* Label: — OUR FOUNDATION — */}
        <motion.div 
          initial={{ opacity: 0, y: -8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center justify-center gap-2.5 mb-1"
        >
          <div className="h-[1px] w-10 sm:w-16 bg-gradient-to-r from-transparent via-[#C5A059] to-[#8C6D2D]" />
          <span className="font-cinzel text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#8C6D2D] font-bold">
            OUR FOUNDATION
          </span>
          <div className="h-[1px] w-10 sm:w-16 bg-gradient-to-l from-transparent via-[#C5A059] to-[#8C6D2D]" />
        </motion.div>

        {/* Main Heading: The Four Pillars of Vedha Radha */}
        <motion.h2 
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full text-center font-cormorant italic text-2xl sm:text-3xl lg:text-[42px] text-[#2C2420] font-normal tracking-wide leading-tight my-0.5"
        >
          The Four Pillars of <span className="text-[#6B0F21] font-semibold">Vedha Radha</span>
        </motion.h2>

        {/* Gold Diamond Ornament Divider */}
        <motion.div 
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full flex items-center justify-center gap-2 mt-1"
        >
          <div className="h-[1px] w-10 sm:w-14 bg-[#D4AF37]/60" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37] border border-[#FFE8A3]" />
          <div className="h-[1px] w-10 sm:w-14 bg-[#D4AF37]/60" />
        </motion.div>
      </div>

      {/* ===================================================================== */}
      {/* FOUR PILLARS GRID (Expanded Card Size & Animated Text)                */}
      {/* ===================================================================== */}
      <div className="relative w-full max-w-[1640px] mx-auto z-10 px-1 sm:px-3 pb-8 sm:pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-5 lg:gap-x-7 pt-4">
          {PILLARS.map((pillar, index) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.12 * index, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col pt-10 sm:pt-11 group z-10"
            >
              {/* TOP CIRCULAR DEEP MAROON MEDALLION (Guaranteed True Center via Flex Container) */}
              <div className="absolute top-0 inset-x-0 flex justify-center z-20 pointer-events-none">
                <motion.div 
                  initial={{ scale: 0.6, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.12 * index + 0.15, type: 'spring', stiffness: 220, damping: 18 }}
                  className="pointer-events-auto"
                >
                  <div 
                    className="relative w-[70px] h-[70px] sm:w-[76px] sm:h-[76px] rounded-full p-[2.5px] border-2 border-[#D4AF37] shadow-[0_8px_20px_rgba(45,3,10,0.45),0_0_12px_rgba(212,175,55,0.35)] transition-transform duration-300 group-hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #FFE8A3 0%, #D4AF37 50%, #8C6D2D 100%)'
                    }}
                  >
                    {/* Inner Deep Maroon / Ruby Jewel Enamel Disc */}
                    <div 
                      className="w-full h-full rounded-full flex items-center justify-center border border-[#FFEAA7]/50 shadow-[inset_0_2px_6px_rgba(0,0,0,0.75)]"
                      style={{
                        background: 'radial-gradient(circle at 35% 35%, #8B1226 0%, #540A18 55%, #260208 100%)'
                      }}
                    >
                      {pillar.renderIcon()}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* CARD BODY CONTAINER (Slightly Increased Size, Generous Breathing Room) */}
              <div className="relative flex-1 rounded-[22px] bg-gradient-to-b from-[#FFFDF9] via-[#FAF4EA] to-[#F3E7D3] border-2 border-[#DBC6A3] p-5 sm:p-6 pt-14 sm:pt-16 pb-8 sm:pb-9 text-center min-h-[290px] sm:min-h-[315px] shadow-[0_12px_28px_rgba(70,40,15,0.08)] transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_20px_42px_rgba(70,40,15,0.18)] group-hover:border-[#C5A059] flex flex-col justify-between overflow-hidden">
                
                {/* Inner Delicate Gold Hairline Border */}
                <div className="absolute inset-2 border border-[#E8D7BE]/70 rounded-[16px] pointer-events-none" />

                <div>
                  {/* Pillar Title with Staggered Entrance Animation */}
                  <motion.h3 
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.12 * index + 0.22 }}
                    className="font-serif font-bold text-[17px] sm:text-[19.5px] text-[#4A0813] leading-snug tracking-tight mb-1"
                  >
                    {pillar.titleLine1} <br />
                    <span className="font-semibold">{pillar.titleLine2}</span>
                  </motion.h3>

                  {/* Delicate Gold Ornament Line */}
                  <motion.div 
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileInView={{ scaleX: 1, opacity: 0.75 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.12 * index + 0.3 }}
                    className="flex items-center justify-center gap-1.5 my-3 opacity-75 origin-center"
                  >
                    <div className="h-[1px] w-6 bg-gradient-to-r from-transparent to-[#D4AF37]" />
                    <span className="text-[7.5px] text-[#8C6D2D]">✦</span>
                    <div className="h-[1px] w-6 bg-gradient-to-l from-transparent to-[#D4AF37]" />
                  </motion.div>

                  {/* Supporting Description Text with Smooth Fade-Up Animation */}
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: 0.12 * index + 0.38 }}
                    className="font-sans text-[12px] sm:text-[13px] text-[#55453B] leading-relaxed font-normal px-1"
                  >
                    {pillar.description}
                  </motion.p>
                </div>

                {/* BOTTOM GOLD FOIL CURVED RIBBON ACCENT (Matching Reference Image) */}
                <div className="absolute bottom-0 inset-x-0 h-6 overflow-hidden rounded-b-[20px] pointer-events-none">
                  <svg viewBox="0 0 300 24" className="w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id={`goldRibbonCurl-${pillar.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#C8A45B" stopOpacity="0.05" />
                        <stop offset="35%" stopColor="#EAD29C" stopOpacity="0.4" />
                        <stop offset="70%" stopColor="#D4AF37" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#8C6D2D" stopOpacity="1" />
                      </linearGradient>
                      <linearGradient id={`goldHighlight-${pillar.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FFF9E0" stopOpacity="0" />
                        <stop offset="70%" stopColor="#FFF" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#FFE8A3" stopOpacity="0.3" />
                      </linearGradient>
                    </defs>
                    {/* Golden Curled Ribbon Swoosh */}
                    <path
                      d="M0,24 Q130,20 200,14 Q255,8 300,0 L300,24 Z"
                      fill={`url(#goldRibbonCurl-${pillar.id})`}
                    />
                    {/* Top Highlight Hairline */}
                    <path
                      d="M120,21 Q195,14 255,8 Q280,4 300,0"
                      fill="none"
                      stroke={`url(#goldHighlight-${pillar.id})`}
                      strokeWidth="1.2"
                    />
                  </svg>
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* BOTTOM FLOWING BURGUNDY DRAPERY ACCENT (Seamless Corner to Corner)     */}
      {/* ===================================================================== */}
      <div className="absolute bottom-0 inset-x-0 w-full pointer-events-none z-0 overflow-hidden leading-none">
        <svg viewBox="0 0 1440 80" className="w-full h-11 sm:h-14 block" preserveAspectRatio="none">
          <defs>
            <linearGradient id="silkDrapeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6E0F21" />
              <stop offset="45%" stopColor="#480713" />
              <stop offset="75%" stopColor="#2E030B" />
              <stop offset="100%" stopColor="#1B0105" />
            </linearGradient>
            <linearGradient id="goldTrimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFE8A3" />
              <stop offset="35%" stopColor="#D4AF37" />
              <stop offset="70%" stopColor="#F5DF9E" />
              <stop offset="100%" stopColor="#8C6D2D" />
            </linearGradient>
          </defs>
          {/* Flowing Velvet Silk Banner smoothly filling bottom corners */}
          <path
            d="M0,80 L0,62 Q320,74 620,44 Q920,12 1220,36 Q1350,46 1440,26 L1440,80 Z"
            fill="url(#silkDrapeGrad)"
          />
          {/* Gilded Top Border Trim */}
          <path
            d="M0,62 Q320,74 620,44 Q920,12 1220,36 Q1350,46 1440,26"
            fill="none"
            stroke="url(#goldTrimGrad)"
            strokeWidth="3.2"
          />
          {/* Subtle Outer Glow Line */}
          <path
            d="M0,63 Q320,75 620,45 Q920,13 1220,37 Q1350,47 1440,27"
            fill="none"
            stroke="rgba(255, 235, 170, 0.45)"
            strokeWidth="1"
          />
        </svg>
      </div>

    </section>
  );
}

