import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  Store,
  Award,
  CheckCircle2
} from 'lucide-react';
import './OurJourney.css';

// =============================================================================
// 1. DATA-DRIVEN MILESTONES CONFIGURATION (Consistent 5 Objects)
// =============================================================================
export const JOURNEY_MILESTONES = [
  {
    id: '2010',
    year: '2010',
    title: 'The Beginning',
    iconType: 'atelier',
    storyImage: '/images/journey/milestone_story_2010.png',
    description: 'Started our journey in Trichy with a simple vision — to offer pure and traditional jewellery.',
    isBurgundy: false,
    desktopWidth: '17.6%',
    maxWidth: '330px',
    nodeLeft: '15.5%',
    nodeTop: '79.0%'
  },
  {
    id: '2014',
    year: '2014',
    title: 'Expanding Roots',
    iconType: 'sprout',
    storyImage: '/images/journey/milestone_story_2014.png',
    description: 'Gained the love and trust of our customers, laying a strong foundation for growth.',
    isBurgundy: false,
    desktopWidth: '17.6%',
    maxWidth: '330px',
    nodeLeft: '33.8%',
    nodeTop: '74.6%'
  },
  {
    id: '2018',
    year: '2018',
    title: 'A Trusted Name',
    iconType: 'community',
    storyImage: '/images/journey/milestone_story_2018.png',
    description: 'Became a preferred destination for wedding and family jewellery, known for our craftsmanship and purity.',
    isBurgundy: false,
    desktopWidth: '17.6%',
    maxWidth: '330px',
    nodeLeft: '52.0%',
    nodeTop: '69.6%'
  },
  {
    id: '2022',
    year: '2022',
    title: 'Embracing Modernity',
    iconType: 'chart',
    storyImage: '/images/journey/milestone_story_2022.png',
    description: 'Introduced contemporary designs and a better shopping experience with modern facilities while preserving our heritage.',
    isBurgundy: false,
    desktopWidth: '17.6%',
    maxWidth: '330px',
    nodeLeft: '70.2%',
    nodeTop: '63.6%'
  },
  {
    id: '2026',
    year: '2026',
    title: 'A Stronger Legacy',
    iconType: 'crown',
    storyImage: '/images/journey/milestone_story_2026.png',
    description: 'Continuing our journey with innovation, timeless designs and an unwavering commitment to purity and customer trust.',
    isBurgundy: true,
    desktopWidth: '18.4%',
    maxWidth: '350px',
    nodeLeft: '88.5%',
    nodeTop: '56.0%'
  }
];

// Stats Bar Data (5 Key Heritage Metrics)
export const JOURNEY_STATS = [
  {
    id: 'stat-1',
    value: '16+',
    label: 'Years of Legacy',
    icon: Calendar
  },
  {
    id: 'stat-2',
    value: '4',
    label: 'Generations',
    icon: Users
  },
  {
    id: 'stat-3',
    value: '3',
    label: 'Showrooms in Tamil Nadu',
    icon: Store
  },
  {
    id: 'stat-4',
    value: '5000+',
    label: 'Happy Customers',
    icon: Award
  },
  {
    id: 'stat-5',
    value: '100%',
    label: 'BIS 916 Hallmarked',
    icon: CheckCircle2
  }
];

// =============================================================================
// 2. VECTOR ICON COMPONENT FOR MILESTONE EMBLEMS
// =============================================================================
function MilestoneVectorIcon({ type, isBurgundy }) {
  const goldStroke = isBurgundy ? '#FDEAA8' : '#C8972C';
  const goldFill = isBurgundy ? '#FFE082' : '#D4AF37';

  switch (type) {
    case 'atelier':
      return (
        <svg viewBox="0 0 36 28" fill="none" className="w-8 h-6 mx-auto">
          {/* Awning Roof */}
          <path d="M4 11L9 4H27L32 11H4Z" fill={goldFill} fillOpacity="0.9" stroke={goldStroke} strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M11 4V11M18 4V11M25 4V11" stroke="#FFF" strokeWidth="1" strokeOpacity="0.7" />
          {/* Body & 4 Columns */}
          <rect x="6" y="11" width="24" height="13" fill={isBurgundy ? '#3D060F' : '#FFFDF8'} stroke={goldStroke} strokeWidth="1.2" />
          <rect x="8" y="13" width="2" height="11" fill={goldFill} />
          <rect x="14" y="13" width="2" height="11" fill={goldFill} />
          <rect x="20" y="13" width="2" height="11" fill={goldFill} />
          <rect x="26" y="13" width="2" height="11" fill={goldFill} />
          {/* Base Plinth */}
          <rect x="4" y="24" width="28" height="2" fill={goldFill} stroke={goldStroke} strokeWidth="0.8" />
        </svg>
      );
    case 'sprout':
      return (
        <svg viewBox="0 0 32 28" fill="none" className="w-8 h-6 mx-auto">
          {/* Sprout Stem */}
          <path d="M16 25V13" stroke={goldStroke} strokeWidth="1.8" strokeLinecap="round" />
          {/* Left Leaf */}
          <path d="M16 15C16 10 10 7 6 9C3 11 6 18 16 17" fill={goldFill} fillOpacity="0.9" stroke={goldStroke} strokeWidth="1" />
          {/* Right Leaf */}
          <path d="M16 15C16 10 22 7 26 9C29 11 26 18 16 17" fill={goldFill} fillOpacity="0.9" stroke={goldStroke} strokeWidth="1" />
          <circle cx="16" cy="8" r="2.2" fill={goldFill} />
        </svg>
      );
    case 'community':
      return (
        <svg viewBox="0 0 36 28" fill="none" className="w-8 h-6 mx-auto">
          {/* Center Leader Head & Shoulders */}
          <circle cx="18" cy="8" r="3.2" fill={goldFill} stroke={goldStroke} strokeWidth="0.8" />
          <path d="M12 24C12 19 14.5 17 18 17C21.5 17 24 19 24 24" fill={goldFill} fillOpacity="0.9" stroke={goldStroke} strokeWidth="1.2" strokeLinecap="round" />
          {/* Left Person */}
          <circle cx="9" cy="11" r="2.4" fill={goldFill} />
          <path d="M4 24C4 20.5 6 19 9 19C11 19 12.5 20 13 22" stroke={goldStroke} strokeWidth="1.2" strokeLinecap="round" />
          {/* Right Person */}
          <circle cx="27" cy="11" r="2.4" fill={goldFill} />
          <path d="M32 24C32 20.5 30 19 27 19C25 19 23.5 20 23 22" stroke={goldStroke} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case 'chart':
      return (
        <svg viewBox="0 0 36 28" fill="none" className="w-8 h-6 mx-auto">
          {/* 3 Rising Growth Bars */}
          <rect x="7" y="16" width="5" height="10" rx="1" fill={goldFill} stroke={goldStroke} strokeWidth="1" />
          <rect x="15" y="11" width="5" height="15" rx="1" fill={goldFill} stroke={goldStroke} strokeWidth="1" />
          <rect x="23" y="6" width="5" height="20" rx="1" fill={goldFill} stroke={goldStroke} strokeWidth="1" />
          {/* Upward Trend Line & Arrow */}
          <path d="M6 14L15 8L27 3" stroke={goldStroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M22 3H27V8" stroke={goldStroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'crown':
    default:
      return (
        <svg viewBox="0 0 40 28" fill="none" className="w-9 h-6 mx-auto">
          {/* Ornate 5-Point Crown */}
          <path d="M5 20L8 8L14 14L20 4L26 14L32 8L35 20H5Z" fill={goldFill} stroke={goldStroke} strokeWidth="1.2" strokeLinejoin="round" />
          <rect x="4" y="20" width="32" height="3" rx="1.5" fill={goldFill} stroke={goldStroke} strokeWidth="0.8" />
          {/* Crown Jewels */}
          <circle cx="20" cy="4" r="1.6" fill="#FFF" />
          <circle cx="8" cy="8" r="1.3" fill="#FFF" />
          <circle cx="32" cy="8" r="1.3" fill="#FFF" />
          <circle cx="14" cy="14" r="1" fill="#FFF" />
          <circle cx="26" cy="14" r="1" fill="#FFF" />
        </svg>
      );
  }
}

// Laurel Wreath branches for the 2026 card
function LaurelWreath({ isRight }) {
  return (
    <svg
      viewBox="0 0 16 24"
      fill="currentColor"
      className={`w-3.5 h-5 text-[#F8E7B2] ${isRight ? '-scale-x-100' : ''}`}
    >
      <path d="M12 2C10 6 7 10 5 16C4 19 4 21 5 22C4 20 4 18 5 15C7 10 10 5 12 2Z" />
      <path d="M8 5C5 7 3 9 2 11C4 11 6 9 8 7V5Z" />
      <path d="M6 10C3 12 1 14 0 16C2 16 4 14 6 12V10Z" />
      <path d="M5 16C2 18 1 20 0 22C2 22 4 20 5 18V16Z" />
    </svg>
  );
}

// =============================================================================
// 3. REUSABLE MILESTONE CARD COMPONENT (Used for all 5 Milestones)
// =============================================================================
export function MilestoneCard({
  milestone,
  index,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onLeave,
  isMobile
}) {
  const m = milestone;

  // Mobile layout card (Movable with horizontal spring drag)
  if (isMobile) {
    return (
      <motion.div
        drag="x"
        dragSnapToOrigin={true}
        dragElastic={0.2}
        whileDrag={{ scale: 1.03 }}
        className={`relative p-4 sm:p-5 text-center rounded-3xl border-2 shadow-lg transition-transform cursor-grab active:cursor-grabbing select-none ${m.isBurgundy
            ? 'bg-gradient-to-b from-[#780C1D] via-[#480813] to-[#280309] border-[#E5C78A] text-[#FFF5E6]'
            : 'bg-[#FFFDF8] border-[#D4AF37] text-[#4A0813]'
          } ${isSelected ? 'ring-2 ring-[#D4AF37]' : ''}`}
        onClick={onSelect}
      >
        {/* Top Vector Icon */}
        <div className="mb-1 flex justify-center">
          <MilestoneVectorIcon type={m.iconType} isBurgundy={m.isBurgundy} />
        </div>

        {/* Year */}
        <div className="flex items-center justify-center gap-1.5 my-1">
          {m.isBurgundy && <LaurelWreath isRight={false} />}
          <h3
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            className={`text-xl sm:text-2xl font-bold tracking-tight leading-none ${m.isBurgundy ? 'text-[#FFF2D0]' : 'text-[#4A0813]'
              }`}
          >
            {m.year}
          </h3>
          {m.isBurgundy && <LaurelWreath isRight={true} />}
        </div>

        {/* Ribbon Title Banner */}
        <div className="my-1.5 flex justify-center">
          <div className={`temple-ribbon-tag ${m.isBurgundy ? 'temple-ribbon-tag-gold' : ''}`}>
            <span className={`font-serif text-xs font-semibold tracking-wide whitespace-nowrap ${m.isBurgundy ? 'text-[#3D060F]' : 'text-[#FFF8EE]'
              }`}>
              {m.title}
            </span>
          </div>
        </div>

        {/* Milestone Story Artwork Image */}
        {m.storyImage && (
          <div className="my-2 flex justify-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-md border-2 border-[#D4AF37]/80 bg-white/20">
              <img src={m.storyImage} alt={m.title} className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        {/* Milestone Description (Rendered Only Once) */}
        <p className={`text-xs font-sans leading-relaxed px-2 font-medium mt-2 ${m.isBurgundy ? 'text-[#FCECD7]' : 'text-[#4A3B32]'
          }`}>
          {m.description}
        </p>
      </motion.div>
    );
  }

  // Desktop Ogee Temple Arch card (Stationed Centered on the Timeline Node Point, Fully Movable)
  return (
    <div
      className="absolute -translate-x-1/2 pointer-events-auto"
      style={{
        left: m.nodeLeft,
        bottom: `calc(100% - ${m.nodeTop} - 6px)`,
        width: m.desktopWidth,
        maxWidth: m.maxWidth,
        zIndex: isSelected ? 30 : isHovered ? 28 : 20
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.08 * index, ease: [0.16, 1, 0.3, 1] }}
        drag
        dragSnapToOrigin={true}
        dragElastic={0.25}
        dragTransition={{ bounceStiffness: 320, bounceDamping: 22 }}
        whileDrag={{ scale: 1.08, zIndex: 50, filter: 'drop-shadow(0 22px 36px rgba(50,15,5,0.4))' }}
        whileHover={{ scale: 1.04 }}
        className="relative w-full cursor-grab active:cursor-grabbing select-none"
        style={{ transformOrigin: 'bottom center' }}
        onClick={onSelect}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        {/* SVG Temple Arch Frame Container with Sharp Top and Sharp Bottom (Ratio: 1.25) */}
        <svg
          viewBox="0 0 240 300"
          className="w-full h-auto block filter drop-shadow-[0_12px_24px_rgba(50,20,5,0.22)]"
        >
          <defs>
            <linearGradient id={`goldBorderGrad-${m.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F8E7B2" />
              <stop offset="35%" stopColor="#E5BE53" />
              <stop offset="70%" stopColor="#A67C24" />
              <stop offset="100%" stopColor="#F3DC94" />
            </linearGradient>

            <linearGradient id={`burgundyFill-${m.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#780C1D" />
              <stop offset="50%" stopColor="#480813" />
              <stop offset="100%" stopColor="#240308" />
            </linearGradient>

            <linearGradient id={`ivoryFill-${m.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#FFFDF7" />
              <stop offset="100%" stopColor="#FAF4E8" />
            </linearGradient>
          </defs>

          {/* Outer Temple Arch Contour with Sharp Top and Sharp Bottom Cusp */}
          <path
            d="
              M 120,6
              C 114,16 96,28 70,34
              C 42,40 16,54 16,68
              L 16,244
              C 16,262 44,278 72,284
              C 96,289 114,296 120,298
              C 126,296 144,289 168,284
              C 196,278 224,262 224,244
              L 224,68
              C 224,54 198,40 170,34
              C 144,28 126,16 120,6
              Z
            "
            fill={m.isBurgundy ? `url(#burgundyFill-${m.id})` : `url(#ivoryFill-${m.id})`}
            stroke={`url(#goldBorderGrad-${m.id})`}
            strokeWidth="2.5"
          />

          {/* Inner Fine Gold Hairline Inlay with Sharp Top and Sharp Bottom */}
          <path
            d="
              M 120,12
              C 114,20 98,32 73,38
              C 46,44 22,56 22,70
              L 22,242
              C 22,258 48,272 74,277
              C 96,282 114,289 120,291
              C 126,289 144,282 166,277
              C 192,272 218,258 218,242
              L 218,70
              C 218,56 194,44 167,38
              C 142,32 126,20 120,12
              Z
            "
            fill="none"
            stroke={m.isBurgundy ? '#FDEAA8' : '#D4AF37'}
            strokeWidth="1.2"
            strokeOpacity={m.isBurgundy ? 0.8 : 0.5}
          />
        </svg>

        {/* Card Content Overlay Layer - Strict Safe Zone Inside Inner Hairline */}
        <div className="absolute top-[6%] bottom-[16%] left-[6%] right-[6%] flex flex-col items-center justify-between text-center select-none pointer-events-none overflow-hidden px-1 py-0.5">

          {/* Top Section: Arch Peak Icon & Year */}
          <div className="w-full flex flex-col items-center">
            {/* Vector Icon */}
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.08 * index }}
              className="w-full flex items-center justify-center -mb-0.5"
            >
              <MilestoneVectorIcon type={m.iconType} isBurgundy={m.isBurgundy} />
            </motion.div>

            {/* Year with Glow and Laurels */}
            <div className="flex items-center justify-center gap-1.5 my-0">
              {m.isBurgundy && (
                <motion.div
                  animate={{ rotate: isHovered ? [0, -3, 3, 0] : 0 }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <LaurelWreath isRight={false} />
                </motion.div>
              )}
              <motion.h3
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                initial={{ opacity: 0, scale: 0.88, y: 4 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.08 * index + 0.05 }}
                whileHover={{ scale: 1.06 }}
                className={`text-lg sm:text-xl lg:text-2xl font-bold tracking-tight leading-none journey-year-glow transition-transform duration-300 ${m.isBurgundy ? 'text-[#FFF2D0]' : 'text-[#4A0813]'
                  }`}
              >
                {m.year}
              </motion.h3>
              {m.isBurgundy && (
                <motion.div
                  animate={{ rotate: isHovered ? [0, 3, -3, 0] : 0 }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <LaurelWreath isRight={true} />
                </motion.div>
              )}
            </div>

            {/* Notched Ribbon Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.08 * index + 0.1 }}
              className="mt-0.5 w-full flex items-center justify-center"
            >
              <div className={`temple-ribbon-tag ${m.isBurgundy ? 'temple-ribbon-tag-gold' : ''}`}>
                <span className={`font-serif text-[9px] sm:text-[10px] lg:text-[10.5px] font-semibold tracking-wide whitespace-nowrap ${m.isBurgundy ? 'text-[#3D060F]' : 'text-[#FFF8EE]'
                  }`}>
                  {m.title}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Center Section: Milestone Story Image Artwork */}
          {m.storyImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 * index + 0.12 }}
              whileHover={{ scale: 1.06 }}
              className="my-0.5 sm:my-1 flex items-center justify-center w-full"
            >
              <div className="relative w-[68px] h-[64px] sm:w-[78px] sm:h-[74px] lg:w-[88px] lg:h-[84px] xl:w-[98px] xl:h-[92px] rounded-xl overflow-hidden shadow-md shadow-black/25 border-1.5 border-[#D4AF37]/80 hover:border-[#FFE8A3] transition-all bg-white/10 flex items-center justify-center">
                <img
                  src={m.storyImage}
                  alt={`${m.year} ${m.title}`}
                  className="w-full h-full object-cover select-none pointer-events-none"
                  loading="lazy"
                />
              </div>
            </motion.div>
          )}

          {/* Bottom Section: Milestone Description */}
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 * index + 0.15 }}
            className={`w-full px-1 text-[7.5px] sm:text-[8.5px] lg:text-[9px] xl:text-[9.5px] font-sans leading-tight text-center font-medium break-words overflow-hidden ${m.isBurgundy ? 'text-[#FCECD7]' : 'text-[#4A3B32]'
              }`}
          >
            {m.description}
          </motion.p>

        </div>
      </motion.div>
    </div>
  );
}

// =============================================================================
// 4. MAIN OUR JOURNEY COMPONENT
// =============================================================================
export default function OurJourney() {
  const [activeMilestoneId, setActiveMilestoneId] = useState('2026');
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section className="journey-section py-0 select-none">

      {/* ===================================================================== */}
      {/* DESKTOP PANORAMIC SHOWCASE (lg:block) - Matches Target Reference      */}
      {/* ===================================================================== */}
      <div className="hidden lg:block w-full">
        <div className="relative w-full overflow-hidden border-y-2 border-[#D8C7A5] shadow-xl">

          {/* Strict 2:1 Aspect Ratio Canvas (Zero Zoom/Crop Distortion) */}
          <div className="relative w-full aspect-[2/1] min-h-[580px] overflow-hidden bg-[#FAF3E5]">

            {/* Background Canvas: Golden Temple Sunrise Drapery Backdrop (z-0) */}
            <img
              src="/images/journey/golden_temple_sunrise_drapery.png"
              alt="Vedha Radha Elegant Heritage Temple Silk Backdrop"
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none z-0"
            />

            {/* TOP EDITORIAL SECTION HEADER (z-[25]) */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="absolute top-3 sm:top-5 inset-x-0 text-center z-[25] pointer-events-none px-4"
            >
              {/* Golden Insignia Lotus Emblem with Gold Lines */}
              <div className="flex items-center justify-center gap-3 mb-0.5">
                <div className="h-[1.5px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#D4AF37]" />
                <svg viewBox="0 0 40 24" fill="none" className="w-7 h-4 sm:w-8 sm:h-4.5 text-[#8C6D2D]">
                  <path
                    d="M20 2C20 2 23 8 23 13C23 17.5 21 21 20 22C19 21 17 17.5 17 13C17 8 20 2 20 2Z"
                    fill="#D4AF37"
                    opacity="0.95"
                  />
                  <path
                    d="M20 12C23 7 28 6 31 8C33 9.5 33.5 13 32 16C30.5 19 25 21 20 22C25 21 30.5 19 32 16"
                    stroke="#8C6D2D"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M20 12C17 7 12 6 9 8C7 9.5 6.5 13 8 16C9.5 19 15 21 20 22C15 21 9.5 19 8 16"
                    stroke="#8C6D2D"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <circle cx="20" cy="22" r="1.5" fill="#8C6D2D" />
                </svg>
                <div className="h-[1.5px] w-12 sm:w-16 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#D4AF37]" />
              </div>

              {/* Eyebrow: OUR JOURNEY */}
              <div className="flex items-center justify-center gap-2 mb-0.5">
                <span className="text-[10px] sm:text-[11.5px] font-sans font-bold uppercase tracking-[0.28em] text-[#8C6512]">
                  OUR JOURNEY
                </span>
              </div>

              {/* Main Heading */}
              <h2
                style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
                className="text-xl sm:text-3xl lg:text-[38px] font-bold text-[#420812] tracking-tight leading-tight mb-0.5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]"
              >
                A Legacy of Trust &amp; Craftsmanship
              </h2>

              {/* Supporting Subtitle */}
              <p className="font-sans text-[11px] sm:text-[12.5px] text-[#5C4A3E] font-medium leading-relaxed max-w-xl mx-auto drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]">
                From a humble beginning in Trichy to a trusted name in fine jewellery, our journey has been one of purity, innovation and enduring customer trust.
              </p>
            </motion.div>

            {/* SINGLE SVG BEZIER CURVE FOR THE ENTIRE GOLDEN TIMELINE (z-[10] - Behind Cards) */}
            <svg
              viewBox="0 0 1000 500"
              className="absolute inset-0 w-full h-full pointer-events-none z-[10]"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="goldenTimelineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#C6922A" />
                  <stop offset="25%" stopColor="#F5DF9E" />
                  <stop offset="50%" stopColor="#FFF2C6" />
                  <stop offset="75%" stopColor="#DFB757" />
                  <stop offset="100%" stopColor="#B37D1D" />
                </linearGradient>

                <linearGradient id="goldenTimelineHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                  <stop offset="40%" stopColor="#FFF2C6" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#9C7018" stopOpacity="0.9" />
                </linearGradient>

                <filter id="goldenTimelineShadow" x="-10%" y="-20%" width="120%" height="150%">
                  <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="rgba(50, 20, 5, 0.35)" />
                </filter>
              </defs>

              {/* Underlying Soft Tube with Shadow */}
              <path
                d="M 0,360 C 52,368 103,393 155,395 C 216,397 277,381 338,373 C 399,365 459,357 520,348 C 581,339 641,329 702,318 C 763,307 824,296 885,280 C 923,270 962,255 1000,242"
                fill="none"
                stroke="url(#goldenTimelineGrad)"
                strokeWidth="7"
                strokeLinecap="round"
                filter="url(#goldenTimelineShadow)"
              />

              {/* Scroll-Triggered Animated Specular Line */}
              <motion.path
                d="M 0,359 C 52,367 103,392 155,394 C 216,396 277,380 338,372 C 399,364 459,356 520,347 C 581,338 641,328 702,317 C 763,306 824,295 885,279 C 923,269 962,254 1000,241"
                fill="none"
                stroke="url(#goldenTimelineHighlight)"
                strokeWidth="2.2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2.2, ease: "easeInOut" }}
              />
            </svg>

            {/* 5 GLOWING GOLDEN NODE ORBS (z-[15] - Positioned Exactly on the Path) */}
            <div className="absolute inset-0 z-[15] pointer-events-none">
              {JOURNEY_MILESTONES.map((m) => {
                const isSelected = activeMilestoneId === m.id;

                return (
                  <div
                    key={`orb-${m.id}`}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer pointer-events-auto"
                    style={{ left: m.nodeLeft, top: m.nodeTop }}
                    onClick={() => setActiveMilestoneId(m.id)}
                    onMouseEnter={() => setHoveredId(m.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Milestone Year ${m.year}`}
                  >
                    {/* Glowing Pulse Aura */}
                    <div className="temple-orb-pulse" />

                    {/* 3D Sphere Orb Sitting on Path */}
                    <motion.div
                      animate={{ scale: [1, 1.12, 1] }}
                      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                      className={`temple-orb-sphere ${isSelected ? 'scale-125 ring-2 ring-[#FFF5D0]' : ''}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                    </motion.div>
                  </div>
                );
              })}
            </div>

            {/* 5 REUSABLE MILESTONE CARDS (z-[20] - Positioned In Front of Path) */}
            <div className="absolute inset-0 z-[20] pointer-events-none">
              {JOURNEY_MILESTONES.map((m, index) => (
                <MilestoneCard
                  key={`card-${m.id}`}
                  milestone={m}
                  index={index}
                  isSelected={activeMilestoneId === m.id}
                  isHovered={hoveredId === m.id}
                  onSelect={() => setActiveMilestoneId(m.id)}
                  onHover={() => setHoveredId(m.id)}
                  onLeave={() => setHoveredId(null)}
                />
              ))}
            </div>

            {/* FLOATING STATS SUMMARY BANNER BAR (z-[30] - Grid of 5 Columns, Perfectly Centered) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="absolute bottom-2.5 sm:bottom-4 left-0 right-0 mx-auto w-[94%] max-w-[1560px] z-[30]"
            >
              <div className="temple-stats-plaque px-3 sm:px-6 py-2 sm:py-2.5 grid grid-cols-5 items-center w-full">
                {JOURNEY_STATS.map((stat, idx) => {
                  const Icon = stat.icon;
                  const isLast = idx === JOURNEY_STATS.length - 1;

                  return (
                    <div
                      key={stat.id}
                      className={`flex items-center justify-center gap-1.5 sm:gap-2.5 px-1 sm:px-2 ${!isLast ? 'border-r border-[#D4AF37]/40' : ''
                        }`}
                    >
                      {/* Stat Icon */}
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#FAF3E5] to-[#F1E0B8] border border-[#D4AF37]/50 flex items-center justify-center shadow-sm flex-shrink-0">
                        <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-[#8C6512]" />
                      </div>

                      {/* Stat Text */}
                      <div className="text-left min-w-0">
                        <p
                          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                          className="text-sm sm:text-lg lg:text-xl font-bold text-[#420812] leading-none tracking-tight truncate"
                        >
                          {stat.value}
                        </p>
                        <p className="font-sans text-[8.5px] sm:text-[10px] lg:text-[11px] text-[#6A574C] font-semibold leading-tight whitespace-nowrap mt-0.5 truncate">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

          </div>

        </div>
      </div>

      {/* ===================================================================== */}
      {/* MOBILE & TABLET RESPONSIVE FLOWING TIMELINE (lg:hidden)               */}
      {/* ===================================================================== */}
      <div className="lg:hidden max-w-xl mx-auto px-4 mt-4">

        {/* Mobile Section Header */}
        <div className="text-center mb-5">
          <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#8C6512] font-bold mb-1">
            OUR JOURNEY
          </p>
          <h2
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
            className="text-2xl sm:text-3xl text-[#420812] font-bold leading-tight"
          >
            A Legacy of Trust &amp; Craftsmanship
          </h2>
          <p className="font-sans text-xs text-[#665449] mt-1 max-w-sm mx-auto">
            From a humble beginning in Trichy to a trusted name in fine jewellery, our journey has been one of purity, innovation and enduring customer trust.
          </p>
        </div>

        {/* Mobile Cards Stack using Reusable MilestoneCard */}
        <div className="journey-mobile-timeline space-y-5">
          {JOURNEY_MILESTONES.map((m, index) => {
            const isSelected = activeMilestoneId === m.id;

            return (
              <motion.div
                key={`mobile-${m.id}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.08 * index }}
                className="relative pl-6"
              >
                {/* Mobile Golden Node Indicator */}
                <div className="absolute left-[-26px] top-5 w-5 h-5 rounded-full bg-gradient-to-br from-[#FFFCE8] via-[#D4AF37] to-[#7D5915] shadow-md border-2 border-[#FAF5EB] flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>

                <MilestoneCard
                  milestone={m}
                  index={index}
                  isSelected={isSelected}
                  isHovered={false}
                  onSelect={() => setActiveMilestoneId(m.id)}
                  isMobile={true}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Stats Plaque */}
        <div className="temple-stats-plaque p-4 mt-6 grid grid-cols-2 gap-3.5">
          {JOURNEY_STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={`m-stat-${stat.id}`} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FAF3E5] to-[#F1E0B8] border border-[#D4AF37]/50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-[#8C6512]" />
                </div>
                <div>
                  <p
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    className="text-base sm:text-lg font-bold text-[#420812] leading-none"
                  >
                    {stat.value}
                  </p>
                  <p className="font-sans text-[10px] text-[#6A574C] font-semibold mt-0.5">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
}
