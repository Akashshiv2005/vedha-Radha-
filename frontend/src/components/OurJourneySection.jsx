import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Compass, HeartHandshake, Sparkles, ChevronRight } from 'lucide-react';

const MILESTONES = [
  {
    id: '2010',
    year: '2010',
    title: 'The Beginning',
    description: 'A humble start with a vision to offer pure and traditional jewellery.',
    category: 'Traditional Gold & Antique Craft',
    jewelryImage: '/images/about/journey_react/jewel_2010.png',
    jewelryAlt: 'Antique 22K Gold Bangle with Gemstones & Jasmine',
    svgX: 153,
    svgY: 322,
    percentX: 15.3,
    // Jewelry sits above the ribbon wave
    jewelryStyle: {
      left: '15.3%',
      top: '46%',
      transform: 'translate(-50%, -100%)',
      width: '18%',
      maxWidth: '220px'
    },
    // Text card sits directly below the ruby node in the cream parchment
    cardStyle: {
      left: '15.3%',
      top: '67%',
      transform: 'translateX(-50%)',
      width: '18%',
      maxWidth: '200px'
    },
    details: 'Founded with a modest atelier in Tiruchirappalli, guided by an unwavering commitment to BIS 916 hallmarked pure gold and timeless South Indian temple craft.'
  },
  {
    id: '2014',
    year: '2014',
    title: 'Expanding Roots',
    description: 'Grew with the love and trust of our customers in Trichy.',
    category: 'Heritage Temple Adornments',
    jewelryImage: '/images/about/journey_react/jewel_2014.png',
    jewelryAlt: 'Royal Antique Temple Jhumkas with Pearls',
    svgX: 330,
    svgY: 308,
    percentX: 33.0,
    jewelryStyle: {
      left: '33.0%',
      top: '59%',
      transform: 'translate(-50%, -100%)',
      width: '13%',
      maxWidth: '150px'
    },
    cardStyle: {
      left: '33.0%',
      top: '65%',
      transform: 'translateX(-50%)',
      width: '18%',
      maxWidth: '200px'
    },
    details: 'As patronage grew across the Kaveri delta, our artisan repertoire expanded to handcrafted nakshi temple jhumkas and bespoke wedding collections.'
  },
  {
    id: '2018',
    year: '2018',
    title: 'A Trusted Name',
    description: 'Became a preferred destination for wedding and family jewellery.',
    category: 'Signature Muhurtham Sets',
    jewelryImage: '/images/about/journey_react/jewel_2018.png',
    jewelryAlt: 'Goddess Lakshmi Nakshi Temple Choker',
    svgX: 521,
    svgY: 291,
    percentX: 52.1,
    jewelryStyle: {
      left: '52.1%',
      top: '55%',
      transform: 'translate(-50%, -100%)',
      width: '17%',
      maxWidth: '190px'
    },
    cardStyle: {
      left: '52.1%',
      top: '62%',
      transform: 'translateX(-50%)',
      width: '18%',
      maxWidth: '200px'
    },
    details: 'Recognized as the premier destination for traditional Tamil wedding trousseaus, consecrated temple jewels, and certified heirloom creations.'
  },
  {
    id: '2022',
    year: '2022',
    title: 'Embracing Modernity',
    description: 'Introduced contemporary designs while staying true to our heritage.',
    category: 'Certified Natural Diamonds',
    jewelryImage: '/images/about/journey_react/jewel_2022.png',
    jewelryAlt: 'Contemporary Diamond Teardrop Earrings',
    svgX: 710,
    svgY: 249,
    percentX: 71.0,
    jewelryStyle: {
      left: '71.0%',
      top: '47%',
      transform: 'translate(-50%, -100%)',
      width: '12%',
      maxWidth: '140px'
    },
    cardStyle: {
      left: '71.0%',
      top: '53%',
      transform: 'translateX(-50%)',
      width: '18%',
      maxWidth: '200px'
    },
    details: 'Unveiled certified solitaire diamond lines, vivid gemstone suites, and versatile modern silhouettes tailored for the contemporary global Indian.'
  },
  {
    id: '2026',
    year: '2026',
    title: 'A Stronger Legacy',
    description: 'Continuing our journey with innovation, purity and timeless designs for generations to come.',
    category: 'Heirloom High Jewellery',
    jewelryImage: '/images/about/journey_react/jewel_2026.png',
    jewelryAlt: 'High-Jewellery Diamond & Vivid Emerald Garland',
    svgX: 893,
    svgY: 209,
    percentX: 89.3,
    jewelryStyle: {
      left: '89.3%',
      top: '39%',
      transform: 'translate(-50%, -100%)',
      width: '20%',
      maxWidth: '225px'
    },
    cardStyle: {
      left: '89.3%',
      top: '45%',
      transform: 'translateX(-50%)',
      width: '18%',
      maxWidth: '200px'
    },
    details: 'Looking toward the future with our state-of-the-art flagship experience, immersive digital showcases, and ethical generational craftsmanship.'
  }
];

export default function OurJourneySection() {
  const [activeId, setActiveId] = useState('2018');
  const [hoveredId, setHoveredId] = useState(null);

  const activeMilestone = MILESTONES.find(m => m.id === activeId) || MILESTONES[2];

  return (
    <section className="relative w-full overflow-hidden bg-[#FAF5EB] font-serif select-none">
      
      {/* ===================================================================== */}
      {/* MAIN PANORAMIC DISPLAY (Pure React DOM + Layered SVG Canvas)          */}
      {/* ===================================================================== */}
      <div className="relative w-full overflow-hidden shadow-2xl border-y-2 border-[#D8C7A5]">

        {/* 2:1 Panoramic Aspect Canvas */}
        <div className="relative w-full aspect-[2/1] min-h-[600px] max-h-[850px] bg-gradient-to-b from-[#4A0813] via-[#33040B] to-[#1E0105] overflow-hidden">
          
          {/* LAYER 0: UPPER MAROON VELVET SILK HIGHLIGHTS */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(165,21,40,0.4)_0%,transparent_75%)] pointer-events-none z-0" />
          <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-[#250207]/90 via-[#250207]/40 to-transparent pointer-events-none z-0" />

          {/* LAYER 1: SVG CANVAS (Lower Parchment Base + Golden Ribbon Wave) */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-[1]">
            <svg 
              viewBox="0 0 1000 500" 
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <defs>
                {/* Cream Parchment Gradient */}
                <linearGradient id="creamParchmentGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FBF7EE" />
                  <stop offset="35%" stopColor="#F6EFE2" />
                  <stop offset="100%" stopColor="#E8DAC7" />
                </linearGradient>

                {/* Golden Ribbon Multi-Stop Metallic Gradient */}
                <linearGradient id="goldRibbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#C99B3B" />
                  <stop offset="15%" stopColor="#FDEAB3" />
                  <stop offset="35%" stopColor="#DAA84D" />
                  <stop offset="50%" stopColor="#FFF4D0" />
                  <stop offset="70%" stopColor="#C39238" />
                  <stop offset="85%" stopColor="#FFE8A3" />
                  <stop offset="100%" stopColor="#B68527" />
                </linearGradient>

                {/* Golden Specular Highlight */}
                <linearGradient id="goldCoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFFBE6" stopOpacity="0.75" />
                  <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#FFFBE6" stopOpacity="0.75" />
                </linearGradient>

                {/* Ribbon Drop Shadow */}
                <filter id="ribbonShadow" x="-10%" y="-20%" width="120%" height="150%">
                  <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#35060C" floodOpacity="0.45" />
                </filter>
              </defs>

              {/* Lower Cream Parchment Fill */}
              <path 
                d="M 0,380 C 60,360 100,328 153,322 C 210,314 270,302 330,308 C 390,314 460,300 521,291 C 585,282 650,265 710,249 C 775,232 835,218 893,209 C 935,202 970,175 1000,140 L 1000,500 L 0,500 Z"
                fill="url(#creamParchmentGrad)"
              />

              {/* 3D Bronze Ribbon Underlay */}
              <path 
                d="M 0,380 C 60,360 100,328 153,322 C 210,314 270,302 330,308 C 390,314 460,300 521,291 C 585,282 650,265 710,249 C 775,232 835,218 893,209 C 935,202 970,175 1000,140"
                fill="none"
                stroke="#68420E"
                strokeWidth="11"
                strokeLinecap="round"
                transform="translate(0, 3)"
                opacity="0.6"
              />

              {/* Golden Ribbon Main Stroke */}
              <path 
                d="M 0,380 C 60,360 100,328 153,322 C 210,314 270,302 330,308 C 390,314 460,300 521,291 C 585,282 650,265 710,249 C 775,232 835,218 893,209 C 935,202 970,175 1000,140"
                fill="none"
                stroke="url(#goldRibbonGrad)"
                strokeWidth="8.5"
                strokeLinecap="round"
                filter="url(#ribbonShadow)"
              />

              {/* Specular Core Stroke */}
              <path 
                d="M 0,380 C 60,360 100,328 153,322 C 210,314 270,302 330,308 C 390,314 460,300 521,291 C 585,282 650,265 710,249 C 775,232 835,218 893,209 C 935,202 970,175 1000,140"
                fill="none"
                stroke="url(#goldCoreGrad)"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* LAYER 2: LEFT TEMPLE PILLAR & SACRED DEEPAM LAMP */}
          <div className="absolute top-0 left-0 w-[22%] max-w-[280px] h-[65%] pointer-events-none z-[10] select-none">
            <img 
              src="/images/about/journey_react/pillar_lamp_clean.png" 
              alt="Temple Pillar & Sacred Vilakku Deepam"
              className="w-full h-full object-contain object-left-top filter drop-shadow-[0_8px_24px_rgba(0,0,0,0.65)]"
            />
          </div>

          {/* LAYER 3: BOTTOM-RIGHT SOUTH INDIAN TEMPLE GOPURAM WATERMARK */}
          <div className="absolute right-0 bottom-0 w-[42%] max-w-[520px] h-[38%] pointer-events-none z-[10] opacity-85 select-none">
            <img 
              src="/images/about/journey_react/temple_gopuram_blended.png" 
              alt="Sri Ranganathaswamy Temple Mandapam & Gopuram Architecture"
              className="w-full h-full object-contain object-right-bottom"
            />
          </div>

          {/* LAYER 4: BOTTOM MAROON SILK DRAPE WAVE */}
          <div className="absolute left-0 bottom-0 w-[55%] max-w-[700px] h-[22%] pointer-events-none z-[10] select-none">
            <img 
              src="/images/about/journey_react/bottom_wave_blended.png" 
              alt="Royal Maroon Silk Drapery Wave"
              className="w-full h-full object-contain object-left-bottom"
            />
          </div>

          {/* LAYER 5: TOP HEADER IN REAL TYPOGRAPHY */}
          <div className="absolute top-4 sm:top-7 inset-x-0 text-center z-[30] pointer-events-none px-4">
            
            {/* Traditional Golden Lotus Glyph */}
            <div className="flex items-center justify-center gap-3 mb-1">
              <div className="h-[1px] w-8 sm:w-14 bg-gradient-to-r from-transparent via-[#E5C78A]/70 to-[#E5C78A]" />
              <svg viewBox="0 0 40 24" fill="none" className="w-7 h-4 sm:w-9 sm:h-5 text-[#FFEAA7]">
                <path 
                  d="M20 2C20 2 23 8 23 13C23 17.5 21 21 20 22C19 21 17 17.5 17 13C17 8 20 2 20 2Z" 
                  fill="#FFEAA7" 
                  opacity="0.9"
                />
                <path 
                  d="M20 12C23 7 28 6 31 8C33 9.5 33.5 13 32 16C30.5 19 25 21 20 22C25 21 30.5 19 32 16" 
                  stroke="#FFEAA7" 
                  strokeWidth="1.3" 
                  strokeLinecap="round"
                />
                <path 
                  d="M20 12C17 7 12 6 9 8C7 9.5 6.5 13 8 16C9.5 19 15 21 20 22C15 21 9.5 19 8 16" 
                  stroke="#FFEAA7" 
                  strokeWidth="1.3" 
                  strokeLinecap="round"
                />
                <circle cx="20" cy="22" r="1.5" fill="#FFEAA7" />
              </svg>
              <div className="h-[1px] w-8 sm:w-14 bg-gradient-to-l from-transparent via-[#E5C78A]/70 to-[#E5C78A]" />
            </div>

            {/* Title: "Our Journey" */}
            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-[54px] text-[#F9ECDA] font-normal tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
              Our Journey
            </h2>

            {/* Subtitle: "A Legacy of Trust & Craftsmanship" */}
            <h3 className="font-serif italic text-sm sm:text-xl md:text-2xl text-[#E5C78A] font-normal mt-0.5 sm:mt-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
              A Legacy of Trust &amp; Craftsmanship
            </h3>

            {/* Generational Tagline */}
            <p className="font-sans text-[10.5px] sm:text-xs md:text-[13px] text-[#F3E2CC]/85 max-w-lg mx-auto mt-1 sm:mt-1.5 leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              A remarkable journey that began with a passion for fine jewellery, now cherished across generations.
            </p>

            {/* Separator */}
            <div className="flex items-center justify-center gap-1.5 mt-1 sm:mt-2 opacity-80">
              <span className="w-1 h-1 rounded-full bg-[#E5C78A]" />
              <div className="h-[1px] w-8 bg-[#E5C78A]/50" />
              <span className="w-1.5 h-1.5 rotate-45 border border-[#FFEAA7] bg-[#4A0813]" />
              <div className="h-[1px] w-8 bg-[#E5C78A]/50" />
              <span className="w-1 h-1 rounded-full bg-[#E5C78A]" />
            </div>
          </div>

          {/* LAYER 6: THE 5 ISOLATED TRANSPARENT JEWELLERY PIECES */}
          <div className="absolute inset-0 z-[20] pointer-events-none">
            {MILESTONES.map((m) => {
              const isSelected = activeId === m.id;
              const isHovered = hoveredId === m.id;

              return (
                <div
                  key={`jewel-${m.id}`}
                  className="absolute pointer-events-auto cursor-pointer transition-all duration-300"
                  style={m.jewelryStyle}
                  onClick={() => setActiveId(m.id)}
                  onMouseEnter={() => setHoveredId(m.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <motion.div
                    animate={{
                      scale: isSelected ? 1.08 : isHovered ? 1.05 : 1,
                      y: isSelected ? -6 : isHovered ? -3 : 0
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="relative w-full h-full flex items-center justify-center"
                  >
                    <img 
                      src={m.jewelryImage} 
                      alt={m.jewelryAlt}
                      className="w-full h-auto object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.85)]"
                    />
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* LAYER 7: INTERACTIVE RUBY CABOCHON NODES ON THE GOLDEN RIBBON */}
          <div className="absolute inset-0 z-[25] pointer-events-none">
            {MILESTONES.map((m) => {
              const isSelected = activeId === m.id;
              const isHovered = hoveredId === m.id;

              const nodeLeft = `${(m.svgX / 1000) * 100}%`;
              const nodeTop = `${(m.svgY / 500) * 100}%`;

              return (
                <div
                  key={`node-${m.id}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer pointer-events-auto"
                  style={{ left: nodeLeft, top: nodeTop }}
                  onClick={() => setActiveId(m.id)}
                  onMouseEnter={() => setHoveredId(m.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Milestone ${m.year}: ${m.title}`}
                >
                  {/* Glowing Radar Halo */}
                  <div className={`absolute -inset-2.5 rounded-full transition-opacity duration-300 ${isSelected || isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="absolute inset-0 rounded-full bg-[#FFEAA7] animate-ping opacity-75" />
                    <span className="absolute inset-0 rounded-full bg-[#E22B45] opacity-50 blur-sm" />
                  </div>

                  {/* Golden Bezel + Ruby Gemstone Pin */}
                  <div className={`relative w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                    isSelected 
                      ? 'scale-125 ring-2 ring-[#FFF2C6] ring-offset-2 ring-offset-[#3E060E]' 
                      : isHovered 
                        ? 'scale-110 ring-1 ring-[#FFF2C6]' 
                        : 'scale-95 hover:scale-105'
                  }`}>
                    {/* Outer Gold Bezel */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFF4D0] via-[#DFB358] to-[#6E4E13] p-[2px] shadow-md">
                      {/* Deep Crimson Ruby Cabochon */}
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-[#E22B45] via-[#A80F24] to-[#40020A] flex items-center justify-center relative overflow-hidden">
                        {/* Specular White Spark */}
                        <div className="absolute top-0.5 left-1 w-1.5 h-1 bg-white/80 rounded-full blur-[0.2px]" />
                        <span className="w-1 h-1 rounded-full bg-[#FFEAA7] shadow-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* LAYER 8: REAL TYPOGRAPHY MILESTONE CARDS (Sitting in the Cream Parchment) */}
          <div className="absolute inset-0 z-[30] pointer-events-none">
            {MILESTONES.map((m) => {
              const isSelected = activeId === m.id;
              const isHovered = hoveredId === m.id;

              return (
                <div
                  key={`card-${m.id}`}
                  className="absolute text-center pointer-events-auto cursor-pointer transition-all duration-200"
                  style={m.cardStyle}
                  onClick={() => setActiveId(m.id)}
                  onMouseEnter={() => setHoveredId(m.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className={`transition-transform duration-200 ${isSelected ? '-translate-y-1' : isHovered ? '-translate-y-0.5' : ''}`}>
                    {/* Year */}
                    <div className="font-serif font-bold text-xl sm:text-2xl md:text-3xl lg:text-[34px] leading-tight text-[#4A0A14] tracking-tight">
                      {m.year}
                    </div>

                    {/* Floral Flourish Divider */}
                    <div className="flex items-center justify-center gap-1.5 my-0.5 sm:my-1 opacity-70">
                      <div className="h-[1px] w-3.5 bg-[#8C6D2D]/60" />
                      <span className="text-xs text-[#8C6D2D] leading-none">❦</span>
                      <div className="h-[1px] w-3.5 bg-[#8C6D2D]/60" />
                    </div>

                    {/* Title */}
                    <div className="font-serif font-bold text-xs sm:text-sm md:text-base text-[#4A0A14] leading-snug">
                      {m.title}
                    </div>

                    {/* Description */}
                    <p className="font-sans text-[10px] sm:text-xs md:text-[12.5px] text-[#554033] leading-relaxed mt-0.5 sm:mt-1 line-clamp-3">
                      {m.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* ===================================================================== */}
      {/* EXPANDED ACTIVE CHAPTER SPOTLIGHT ACCORDION / NARRATIVE CARD          */}
      {/* ===================================================================== */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#2F060D] via-[#430A14] to-[#250308] border-2 border-[#E5C378]/50 p-5 sm:p-8 text-[#FAF5EE] shadow-2xl relative overflow-hidden">
          
          {/* Filigree Radial Glow */}
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-80 h-80 rounded-full bg-[#E5C378]/10 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
            
            {/* Left: Jewellery Focus Frame */}
            <div className="md:col-span-4 flex justify-center">
              <div className="relative w-full max-w-[260px] aspect-square rounded-2xl bg-gradient-to-b from-[#1C0307] to-[#0D0104] p-4 border border-[#E5C378]/50 shadow-2xl flex items-center justify-center group">
                <img 
                  src={activeMilestone.jewelryImage} 
                  alt={activeMilestone.jewelryAlt}
                  className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.85)] group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#581923]/95 border border-[#E5C378]/70 text-[10px] font-sans font-bold text-[#FFEAA7] tracking-wider uppercase shadow-md">
                  {activeMilestone.year} Milestone
                </div>
              </div>
            </div>

            {/* Right: Narrative Detail */}
            <div className="md:col-span-8 font-sans">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFEAA7] shadow-[0_0_8px_#FFEAA7]" />
                <span className="text-xs uppercase tracking-[0.25em] text-[#FFEAA7] font-bold">
                  {activeMilestone.category}
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#FFF4DE] font-normal mb-1">
                {activeMilestone.year} &bull; {activeMilestone.title}
              </h3>

              <p className="text-sm sm:text-base text-[#F7DEB0] italic font-serif mb-3">
                "{activeMilestone.description}"
              </p>

              <p className="text-xs sm:text-sm text-[#E6D4C3] leading-relaxed mb-5 max-w-2xl">
                {activeMilestone.details}
              </p>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#FFEAA7]">
                <span className="inline-flex items-center gap-1.5 bg-[#400812]/80 px-3 py-1.5 rounded-lg border border-[#E5C378]/30">
                  <Award className="w-4 h-4 text-[#FFEAA7]" />
                  <span>100% BIS 916 Hallmarked Pure Gold</span>
                </span>
                <span className="inline-flex items-center gap-1.5 bg-[#400812]/80 px-3 py-1.5 rounded-lg border border-[#E5C378]/30">
                  <HeartHandshake className="w-4 h-4 text-[#FFEAA7]" />
                  <span>Generations of Patron Trust in Trichy</span>
                </span>
                <span className="inline-flex items-center gap-1.5 bg-[#400812]/80 px-3 py-1.5 rounded-lg border border-[#E5C378]/30">
                  <Compass className="w-4 h-4 text-[#FFEAA7]" />
                  <span>Handcrafted Sacred Nakshi Heritage</span>
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
}
