import React, { useState, useEffect, useRef } from 'react';
import { Star, MapPin, Check, ChevronLeft, ChevronRight, Users, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const STORIES = [
  {
    id: 1,
    name: 'Vigneshwaran S.',
    gender: 'male',
    image: '/images/patrons/patron_male_1.jpg',
    role: 'Anniversary Celebration • Trichy',
    rating: 5,
    purchase: 'Ceylon Sapphire & Haute Diamond Suite',
    purchaseIcon: 'diamond',
    quote: 'Professional, courteous, and their certified solitaires exceeded every expectation. The Ceylon sapphire necklace for our anniversary took my wife’s breath away. Truly a masterclass in fine jewellery!'
  },
  {
    id: 2,
    name: 'Meenakshi Sundaram',
    gender: 'female',
    image: '/images/patrons/patron_female_1.jpg',
    role: 'Griha Pravesham • Srirangam',
    rating: 5,
    purchase: 'Pure 92.5 Sterling Silver Kalash Set',
    purchaseIcon: 'silver',
    quote: 'For our home’s Griha Pravesham in Srirangam, we purchased the sacred sterling silver Kalash set. The exquisite temple engravings and 92.5 hallmark stamp are divine. They have our permanent trust.'
  },
  {
    id: 3,
    name: 'Nandhini Krishnakumar',
    gender: 'female',
    image: '/images/patrons/patron_female_2.jpg',
    role: 'Heirloom Collector • Chennai',
    rating: 5,
    purchase: 'Solid 22K Veera Simha Antique Kadas',
    purchaseIcon: 'bangle',
    quote: 'The design team transformed our ancestral heritage concept into stunning, wearable 22k solid filigree bangles. Transparent BIS 916 laser testing and insured delivery right to our doorstep in Chennai!'
  },
  {
    id: 4,
    name: 'Priya Ramachandran',
    gender: 'female',
    image: '/images/patrons/patron_female_3.jpg',
    role: 'Muhurtham Bride • Trichy',
    rating: 5,
    purchase: '22K Sacred Muhurtham Kasu Haram',
    purchaseIcon: 'necklace',
    quote: 'The Nakshi Kasu Haram for my wedding was absolutely breathtaking! The antique finish, authentic hallmarking and devotional purity truly captured the sacred essence of our Muhurtham.'
  },
  {
    id: 5,
    name: 'Rajesh & Deepa V.',
    gender: 'couple',
    image: '/images/patrons/patron_couple_1.jpg',
    role: 'Solitaire Engagement • Madurai',
    rating: 5,
    purchase: 'Celestial Solitaire 1.25ct Diamond Ring',
    purchaseIcon: 'diamond',
    quote: 'We wanted an exceptional GIA certified diamond ring for our engagement. Vedha Radha provided complete digital optical certification and impeccable craftsmanship. Exceptional experience!'
  },
  {
    id: 6,
    name: 'K. Soundararajan',
    gender: 'male',
    image: '/images/patrons/patron_male_2.jpg',
    role: 'Temple Seva • Thanjavur',
    rating: 5,
    purchase: 'Antique Nakshi Temple Arch Choker',
    purchaseIcon: 'necklace',
    quote: 'Handcrafted gold temple jewels with authentic divine sanctity. Their heirloom nakshi repoussé work reflects the true Thanjavur architectural legacy. Incomparable devotion and purity.'
  },
  {
    id: 7,
    name: 'Smt. Rajeshwari V.',
    gender: 'female',
    image: '/images/patrons/patron_female_4.jpg',
    role: 'Kalyana Muhurtham • Trichy',
    rating: 5,
    purchase: '22K Antique Lakshmi Mango Mala',
    purchaseIcon: 'necklace',
    quote: 'Pure divine perfection! The bridal consultants gave us unmatched personal guidance, ensuring our traditional South Indian muhurtham set was customized to absolute royal grace.'
  },
  {
    id: 8,
    name: 'Dr. Anand & Shalini',
    gender: 'couple',
    image: '/images/patrons/patron_couple_2.jpg',
    role: 'Diamond Vows • Coimbatore',
    rating: 5,
    purchase: 'Eternity Oval Solitaire Diamond Ring',
    purchaseIcon: 'diamond',
    quote: 'From cut optical symmetry to laser inscription verification, Vedha Radha’s diamond clarity and ethical transparency made our engagement milestone truly unforgettable!'
  },
  {
    id: 9,
    name: 'Gomathi Sundaresan',
    gender: 'female',
    image: '/images/patrons/patron_female_5.jpg',
    role: 'Shashti Poorthi • Thanjavur',
    rating: 5,
    purchase: 'Sacred 22K Solid Gold Kaasu Haram',
    purchaseIcon: 'necklace',
    quote: 'The craftsmanship on the Goddess Lakshmi coins reflects ancient Chola temple sanctity. Every link has weight, richness, and BIS 916 purity that our family will treasure for generations.'
  },
  {
    id: 10,
    name: 'Karthik Narayanan',
    gender: 'male',
    image: '/images/patrons/patron_male_3.jpg',
    role: 'Akshaya Tritiya • Madurai',
    rating: 5,
    purchase: 'Auspicious 999 Fine Gold Sovereign',
    purchaseIcon: 'necklace',
    quote: 'Seamless private preview, hallmarked purity certificate, and insured express delivery to Madurai. The highest standard of authentic Indian goldsmith heritage!'
  },
  {
    id: 11,
    name: 'Lakshmi Prasanna',
    gender: 'female',
    image: '/images/patrons/patron_female_6.jpg',
    role: 'Bridal Heirloom • Bangalore',
    rating: 5,
    purchase: 'Heritage Polki Uncut Diamond Choker',
    purchaseIcon: 'diamond',
    quote: 'The heritage polki choker with Zambian emerald drops was the centerpiece of our daughter’s wedding in Bangalore. Unmatched regal brilliance and hallmarked integrity!'
  },
  {
    id: 12,
    name: 'Suresh Ramanathan',
    gender: 'male',
    image: '/images/patrons/patron_male_4.jpg',
    role: 'Navaratri Celebration • Salem',
    rating: 5,
    purchase: '22K Veera Simha Navaratna Bangle',
    purchaseIcon: 'bangle',
    quote: 'Authentic 9-gem astrological alignment and hand-carved lion head motifs. The BIS 916 laser purity testing in front of us gave 100% confidence. Lifetime customers!'
  },
  {
    id: 13,
    name: 'Ananya Sridhar',
    gender: 'female',
    image: '/images/patrons/patron_female_7.jpg',
    role: 'Classical Arangetram • Chennai',
    rating: 5,
    purchase: 'Padmavathi Nakshi Kemp Temple Haram',
    purchaseIcon: 'necklace',
    quote: 'For my daughter’s Bharatanatyam Arangetram, the antique ruby kemp ornaments and dancing peacock haram were praised by all master musicians. Blessed divine craftsmanship.'
  },
  {
    id: 14,
    name: 'Balaji & Archana',
    gender: 'couple',
    image: '/images/patrons/patron_couple_3.jpg',
    role: 'Silver Jubilee • Tirunelveli',
    rating: 5,
    purchase: 'Platinum & 1.5ct Solitaire Twin Bands',
    purchaseIcon: 'diamond',
    quote: 'Celebrating 25 years of marriage with custom laser-inscribed platinum bands and Hearts & Arrows diamonds. The private showroom hospitality in Trichy was exemplary.'
  },
  {
    id: 15,
    name: 'Kavitha Murugesan',
    gender: 'female',
    image: '/images/patrons/patron_female_8.jpg',
    role: 'Kamakshi Pooja • Karur',
    rating: 5,
    purchase: 'Pure 92.5 Silver Annapoorani & Vilakku',
    purchaseIcon: 'silver',
    quote: 'The solid sterling silver Kamakshi deepam and Annapoorani vigraham illuminate our daily pooja with divine aura. Exceptional weight, hallmark guarantee, and pious finish.'
  },
  {
    id: 16,
    name: 'R. Padmanabhan',
    gender: 'male',
    image: '/images/patrons/patron_male_5.jpg',
    role: 'Tradition & Heritage • Srirangam',
    rating: 5,
    purchase: 'Solid 22K Navaratna Temple Kada',
    purchaseIcon: 'bangle',
    quote: 'The handcrafted repoussé work with sacred navaratna stones reflects pure temple architectural dignity. The certified BIS hallmark gives absolute peace of mind.'
  },
  {
    id: 17,
    name: 'Sowmya Venkatraman',
    gender: 'female',
    image: '/images/patrons/patron_female_9.jpg',
    role: 'Muhurtham Bride • Erode',
    rating: 5,
    purchase: 'Kemp Stone Temple Vaddanam',
    purchaseIcon: 'necklace',
    quote: 'The handcrafted Gajalakshmi waist belt completed my traditional bridal silk saree look with divine magnificence. Our family heirloom for upcoming generations!'
  },
  {
    id: 18,
    name: 'Dr. Murugan & Revathi',
    gender: 'couple',
    image: '/images/patrons/patron_couple_4.jpg',
    role: 'Anniversary Milestone • Vellore',
    rating: 5,
    purchase: 'GIA Triple Excellent Solitaire Suite',
    purchaseIcon: 'diamond',
    quote: 'Impeccable optical light performance and laser-engraved certification. Vedha Radha’s transparent digital grading made selecting our diamond truly joyful.'
  },
  {
    id: 19,
    name: 'Sivakami Achi',
    gender: 'female',
    image: '/images/patrons/patron_female_10.jpg',
    role: 'Heritage Collector • Chettinad',
    rating: 5,
    purchase: '22K Antique Mango Malai Choker',
    purchaseIcon: 'necklace',
    quote: 'Reminds me of ancestral Chettinad royal jewels. Hand-carved mango motifs, natural ruby accents, and deep heritage antique polish of the highest order.'
  },
  {
    id: 20,
    name: 'Rengarajan Swaminathan',
    gender: 'male',
    image: '/images/patrons/patron_male_6.jpg',
    role: 'Devasthanam Seva • Kumbakonam',
    rating: 5,
    purchase: 'Pure 999 Silver Pooja Urli & Kalash',
    purchaseIcon: 'silver',
    quote: 'Purchased for our family temple consecration. Sacred iconography, heavy gauge 99.9% pure silver, and prompt doorstep insured delivery to Kumbakonam.'
  },
  {
    id: 21,
    name: 'Gayathri Sundar',
    gender: 'female',
    image: '/images/patrons/patron_female_11.jpg',
    role: 'Diwali Celebration • Chennai',
    rating: 5,
    purchase: 'Peacock Jhumkas & Polki Choker',
    purchaseIcon: 'diamond',
    quote: 'The dancing peacock jhumkas with hanging seed pearls are an absolute showstopper! Lightweight comfort with magnificent imperial festive presence.'
  },
  {
    id: 22,
    name: 'V. Chandrasekar',
    gender: 'male',
    image: '/images/patrons/patron_male_7.jpg',
    role: 'Sacred Vows • Dindigul',
    rating: 5,
    purchase: '22K Solid Rudraksha Gold Chain',
    purchaseIcon: 'necklace',
    quote: 'Natural Panchamukhi Rudraksha beads encased in 22K hallmarked gold wire caps. Flawless artisan work that carries divine blessings and enduring strength.'
  },
  {
    id: 23,
    name: 'Divya & Harish',
    gender: 'couple',
    image: '/images/patrons/patron_couple_5.jpg',
    role: 'Engagement Duo • Coimbatore',
    rating: 5,
    purchase: 'Rose Gold & Platinum Couple Rings',
    purchaseIcon: 'diamond',
    quote: 'Modern dual-tone finish with brilliant natural solitaire diamonds. The customized inner ring engraving and luxury packaging made our day unforgettable.'
  },
  {
    id: 24,
    name: 'Subbulakshmi Ammal',
    gender: 'female',
    image: '/images/patrons/patron_female_12.jpg',
    role: 'Kalyanam Elder • Madurai',
    rating: 5,
    purchase: 'Sacred Lakshmi Kaasu Malai',
    purchaseIcon: 'necklace',
    quote: 'Authentic temple kasu haram where each coin features crisp Lakshmi embossing and antique matte finish. Traditional craftsmanship preserved in its purest form.'
  },
  {
    id: 25,
    name: 'Ganesan Nambi',
    gender: 'male',
    image: '/images/patrons/patron_male_8.jpg',
    role: 'Bullion Investor • Tirunelveli',
    rating: 5,
    purchase: '24K 999.9 Pure Gold Minted Bar',
    purchaseIcon: 'necklace',
    quote: 'Transparent live bullion rate, tamper-proof certipack card, and instant purity certificate. Vedha Radha is our family’s gold standard for wealth preservation.'
  }
];

function PatronAvatar({ image, name, gender = 'female' }) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full p-[2px] bg-gradient-to-tr from-[#D4AF37] via-[#FFF3D6] to-[#A57822] shadow-[0_3px_10px_rgba(212,175,55,0.35)] shrink-0 group-hover:scale-108 transition-all duration-300">
      <div className="w-full h-full rounded-full bg-gradient-to-b from-[#FFFDF9] via-[#FAF2E4] to-[#F1E0C5] flex items-center justify-center border border-[#D4AF37]/50 shadow-inner overflow-hidden">
        {image && !hasError ? (
          <img
            src={image}
            alt={name || 'Customer'}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover object-top"
            loading="lazy"
          />
        ) : gender === 'female' ? (
          <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="12" r="8" fill="#24070D" />
            <circle cx="24" cy="11" r="3.8" fill="#24070D" />
            <circle cx="23" cy="7.5" r="1.3" fill="#FFFDF9" stroke="#E2C980" strokeWidth="0.3" />
            <circle cx="25.5" cy="9" r="1.3" fill="#FFFDF9" stroke="#E2C980" strokeWidth="0.3" />
            <circle cx="26.5" cy="11.5" r="1.3" fill="#FFFDF9" stroke="#E2C980" strokeWidth="0.3" />
            <path d="M18 8.5 C14.5 8.5 12.5 11.5 12.5 15 C12.5 19 15 21.2 18 21.2 C21 21.2 23.5 19 23.5 15 C23.5 11.5 21.5 8.5 18 8.5 Z" fill="#D99B6A" />
            <circle cx="18" cy="13" r="1.2" fill="#B91C1C" stroke="#FCEB9C" strokeWidth="0.35" />
            <path d="M7 36 C7 27 11 23 18 23 C25 23 29 27 29 36 Z" fill="#680D1D" />
            <path d="M9 36 L21 24" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : gender === 'couple' ? (
          <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none">
            <circle cx="13.5" cy="11.5" r="5" fill="#24070D" />
            <path d="M13.5 8.5 C11 8.5 9.5 10.8 9.5 13.5 C9.5 16.5 11.5 18.2 13.5 18.2 C15.5 18.2 17.5 16.5 17.5 13.5 Z" fill="#D99B6A" />
            <path d="M6 36 C6 27.5 9 24 14 24 L17.5 36 Z" fill="#2C0C12" />
            <circle cx="22.5" cy="13" r="4.8" fill="#24070D" />
            <path d="M22.5 10.5 C20.2 10.5 19 12.5 19 14.8 C19 17.5 20.8 19 22.5 19 Z" fill="#D99B6A" />
            <circle cx="22.5" cy="13" r="1" fill="#B91C1C" />
            <path d="M17 36 L18.5 25.5 C21 24.5 24 25.5 30 36 Z" fill="#680D1D" />
          </svg>
        ) : (
          <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="11.5" r="7.5" fill="#24070D" />
            <path d="M18 8 C14.5 8 12.5 11 12.5 14.8 C12.5 19 15 21.5 18 21.5 C21 21.5 23.5 19 23.5 14.8 Z" fill="#D99B6A" />
            <circle cx="18" cy="12.4" r="0.75" fill="#B91C1C" />
            <path d="M7 36 C7 27 11 23 18 23 C25 23 29 27 29 36 Z" fill="#360810" />
            <path d="M15 23.5 L18 26.5 L21 23.5" stroke="#D4AF37" strokeWidth="1.4" fill="none" />
          </svg>
        )}
      </div>
    </div>
  );
}

function PurchaseIconBadge({ type }) {
  if (type === 'diamond') {
    return (
      <svg className="w-4 h-4 text-[#D4AF37] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 3h12l4 7-10 11L2 10l4-7z" />
        <path d="M2 10h20" />
      </svg>
    );
  }
  if (type === 'silver') {
    return (
      <span className="text-sm text-[#B8860B]">🏺</span>
    );
  }
  if (type === 'bangle') {
    return (
      <svg className="w-4 h-4 text-[#D4AF37] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" strokeDasharray="2 2" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 text-[#D4AF37] shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function StoryCard({ item, idx }) {
  return (
    <motion.div
      key={`${item.id}-${idx}`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.015 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="relative min-h-[260px] sm:min-h-[270px] lg:min-h-[275px] pt-7 sm:pt-8 pb-5 sm:pb-6 px-6 sm:px-7 flex flex-col justify-between group cursor-default"
    >
      {/* 1. RADIANT GOLD AURA GLOW BEHIND CARD */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37]/25 via-[#FCEB9C]/40 to-[#AA8222]/25 rounded-[22px] blur-md opacity-35 group-hover:opacity-100 group-hover:blur-xl transition-all duration-500 pointer-events-none" />

      {/* 2. SVG AUTHENTIC TEMPLE OGEE ARCH CREST + NOTCHED CONCAVE CORNER DOUBLE GOLD FRAME */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_6px_22px_rgba(212,175,55,0.22)] group-hover:drop-shadow-[0_14px_34px_rgba(212,175,55,0.48)] transition-all duration-300" 
        preserveAspectRatio="none" 
        viewBox="0 0 540 260"
      >
        <defs>
          <linearGradient id={`gold-border-arch-${item.id}-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DFBF72" />
            <stop offset="35%" stopColor="#FFF2D1" />
            <stop offset="70%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#AA8222" />
          </linearGradient>
          <linearGradient id={`card-bg-arch-${item.id}-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#FFFDF9" />
            <stop offset="100%" stopColor="#FAF2E4" />
          </linearGradient>
        </defs>

        {/* Outer Temple Ogee Arch Shape (Concave Corners + Center Gopuram Peak) */}
        <path 
          d="M 22 18 
             L 195 18 
             C 235 18, 255 3, 270 1 
             C 285 3, 305 18, 345 18 
             L 518 18 
             A 18 18 0 0 0 538 36 
             L 538 244 
             A 14 14 0 0 0 524 258 
             L 16 258 
             A 14 14 0 0 0 2 244 
             L 2 36 
             A 18 18 0 0 0 22 18 Z" 
          fill={`url(#card-bg-arch-${item.id}-${idx})`}
          stroke={`url(#gold-border-arch-${item.id}-${idx})`}
          strokeWidth="2.4" 
        />

        {/* Inner Fine Gold Inset Line with Matching Ogee Contour */}
        <path 
          d="M 26 22 
             L 195 22 
             C 235 22, 255 7, 270 5 
             C 285 7, 305 22, 345 22 
             L 514 22 
             A 14 14 0 0 0 533 40 
             L 533 240 
             A 12 12 0 0 0 521 253 
             L 19 253 
             A 12 12 0 0 0 7 240 
             L 7 40 
             A 14 14 0 0 0 26 22 Z" 
          fill="none" 
          stroke="#D4AF37" 
          strokeWidth="0.85" 
          opacity="0.75" 
        />

        {/* Golden Temple Lotus Finial at Central Arch Peak */}
        <path d="M270 -2 C267 2, 268 5, 270 7 C272 5, 273 2, 270 -2 Z" fill="#D4AF37" />
        <circle cx="270" cy="7" r="1.5" fill="#FCEB9C" />
      </svg>

      {/* Card Interior Content */}
      <div className="relative z-10 flex flex-col justify-between flex-1">
        
        {/* Top Section: Avatar + Name + Stars */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-2.5">
            
            {/* Avatar & Name Details */}
            <div className="flex items-center gap-3.5 min-w-0">
              <PatronAvatar image={item.image} name={item.name} gender={item.gender} />
              
              <div className="min-w-0">
                <h3 
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  className="text-[15.5px] sm:text-[17px] font-bold text-[#3B0710] leading-snug truncate group-hover:text-[#6A1220] transition-colors"
                >
                  {item.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs sm:text-[12.5px] text-[#7A5A40] mt-0.5 font-medium truncate">
                  <MapPin className="w-3 h-3 text-[#B8860B] shrink-0 fill-[#B8860B]" />
                  <span className="truncate">{item.role}</span>
                </div>
              </div>
            </div>

            {/* 5 Solid Golden Stars */}
            <div className="flex items-center gap-1 text-[#F59E0B] shrink-0 pt-1">
              {[...Array(item.rating)].map((_, sIdx) => (
                <Star key={sIdx} className="w-4 h-4 sm:w-[17px] sm:h-[17px] fill-current drop-shadow-xs" />
              ))}
            </div>
          </div>

          {/* Testimonial Quote with Gold Quotation Marks */}
          <div className="my-2.5 pl-0.5">
            <p 
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              className="text-[13.5px] sm:text-[14.5px] lg:text-[15px] text-[#2C1810] leading-[1.62] italic line-clamp-3"
            >
              <span className="text-[#C99A38] not-italic font-bold text-base sm:text-lg mr-0.5">“</span>
              {item.quote}
              <span className="text-[#C99A38] not-italic font-bold text-base sm:text-lg ml-0.5">”</span>
            </p>
          </div>
        </div>

        {/* Bottom Badges Row: Product Pill + Verified */}
        <div className="mt-3 pt-1 flex items-center justify-between gap-2.5 text-xs sm:text-[12px]">
          {/* Left: Product Purchased Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF9EE] border border-[#E0C58A] shadow-2xs max-w-[70%] truncate group-hover:border-[#D4AF37] transition-colors">
            <PurchaseIconBadge type={item.purchaseIcon} />
            <span className="font-semibold text-[#5C1D24] text-[11.5px] sm:text-xs truncate">
              {item.purchase}
            </span>
          </div>

          {/* Right: Verified Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] font-semibold text-[#15803D] shrink-0 shadow-2xs text-[11px] sm:text-xs">
            <Check className="w-2.5 h-2.5 stroke-[3]" />
            <span>Verified</span>
          </div>
        </div>

      </div>

    </motion.div>
  );
}

export default function CustomerReviews() {
  const [startIndex, setStartIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // 5 cards shown simultaneously on desktop (3 on top row, 2 centered below)
  // Stepping by VISIBLE_COUNT (5) ensures fresh reviews every cycle without repetition
  const VISIBLE_COUNT = 5;
  const totalPages = Math.ceil(STORIES.length / VISIBLE_COUNT); // 5 distinct pages of 5 cards = 25 reviews
  const currentPage = Math.floor(startIndex / VISIBLE_COUNT);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: '100px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isPaused || !isVisible) return;
    const timer = setInterval(() => {
      setStartIndex((prev) => (prev + VISIBLE_COUNT >= STORIES.length ? 0 : prev + VISIBLE_COUNT));
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, isVisible]);

  const handlePrev = () => {
    setStartIndex((prev) => (prev - VISIBLE_COUNT < 0 ? (totalPages - 1) * VISIBLE_COUNT : prev - VISIBLE_COUNT));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev + VISIBLE_COUNT >= STORIES.length ? 0 : prev + VISIBLE_COUNT));
  };

  // 5 completely distinct stories for each page
  const visibleStories = STORIES.slice(startIndex, startIndex + VISIBLE_COUNT);

  return (
    <section 
      ref={sectionRef}
      className="relative bg-gradient-to-b from-[#FAF4EB] via-[#F6ECE0] to-[#EFE2D2] text-[#2C1810] pt-6 sm:pt-8 pb-7 sm:pb-9 select-none w-full overflow-hidden border-t border-[#D4AF37]/40"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      
      {/* =========================================================================
          1. PALACE TEMPLE ARCHWAY & HANGING BELLS (Curving Upward to Avoid Title)
         ========================================================================= */}

      {/* Top Grand Palace Scalloped Arch Framing with 24K Gold Trim */}
      <div className="absolute top-0 inset-x-0 h-10 sm:h-14 pointer-events-none z-0">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full h-full" preserveAspectRatio="none">
          {/* Royal Maroon Drape peaking upward in the center (no overlap with title) */}
          <path d="M0 0 L1440 0 L1440 38 C1160 34 900 8 720 8 C540 8 280 34 0 38 Z" fill="#420812" opacity="0.95" />
          <path d="M0 38 C280 34 540 8 720 8 C900 8 1160 34 1440 38" stroke="#D4AF37" strokeWidth="2.5" />
          <path d="M0 34 C280 30 540 5 720 5 C900 5 1160 30 1440 34" stroke="#FCEB9C" strokeWidth="0.9" opacity="0.8" />
        </svg>
      </div>

      {/* LEFT PROPS: Hanging Temple Bells */}
      <div className="absolute top-0 left-4 sm:left-10 pointer-events-none z-10 hidden sm:flex items-start gap-3">
        {/* Bell 1 (Long chain) */}
        <div className="flex flex-col items-center">
          <div className="w-[1.5px] h-14 sm:h-20 bg-gradient-to-b from-[#A57822] via-[#E5C278] to-[#C99A38]" />
          <svg viewBox="0 0 36 36" className="w-6 h-6 sm:w-7 sm:h-7 text-[#D4AF37] drop-shadow-md">
            <path d="M18 4 C14 4, 10 12, 8 20 C6 26, 6 28, 18 28 C30 28, 30 26, 28 20 C26 12, 22 4, 18 4 Z" fill="#D4AF37" stroke="#A57822" strokeWidth="1" />
            <circle cx="18" cy="30" r="2.5" fill="#B38E46" />
          </svg>
        </div>
        {/* Bell 2 (Short chain) */}
        <div className="flex flex-col items-center">
          <div className="w-[1.5px] h-8 sm:h-12 bg-gradient-to-b from-[#A57822] via-[#E5C278] to-[#C99A38]" />
          <svg viewBox="0 0 36 36" className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37] drop-shadow-md">
            <path d="M18 4 C14 4, 10 12, 8 20 C6 26, 6 28, 18 28 C30 28, 30 26, 28 20 C26 12, 22 4, 18 4 Z" fill="#D4AF37" stroke="#A57822" strokeWidth="1" />
            <circle cx="18" cy="30" r="2" fill="#B38E46" />
          </svg>
        </div>
      </div>

      {/* RIGHT PROPS: Hanging Temple Bells */}
      <div className="absolute top-0 right-4 sm:right-10 pointer-events-none z-10 hidden sm:flex items-start gap-3">
        {/* Bell 1 (Short chain) */}
        <div className="flex flex-col items-center">
          <div className="w-[1.5px] h-8 sm:h-12 bg-gradient-to-b from-[#A57822] via-[#E5C278] to-[#C99A38]" />
          <svg viewBox="0 0 36 36" className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37] drop-shadow-md">
            <path d="M18 4 C14 4, 10 12, 8 20 C6 26, 6 28, 18 28 C30 28, 30 26, 28 20 C26 12, 22 4, 18 4 Z" fill="#D4AF37" stroke="#A57822" strokeWidth="1" />
            <circle cx="18" cy="30" r="2" fill="#B38E46" />
          </svg>
        </div>
        {/* Bell 2 (Long chain) */}
        <div className="flex flex-col items-center">
          <div className="w-[1.5px] h-14 sm:h-20 bg-gradient-to-b from-[#A57822] via-[#E5C278] to-[#C99A38]" />
          <svg viewBox="0 0 36 36" className="w-6 h-6 sm:w-7 sm:h-7 text-[#D4AF37] drop-shadow-md">
            <path d="M18 4 C14 4, 10 12, 8 20 C6 26, 6 28, 18 28 C30 28, 30 26, 28 20 C26 12, 22 4, 18 4 Z" fill="#D4AF37" stroke="#A57822" strokeWidth="1" />
            <circle cx="18" cy="30" r="2.5" fill="#B38E46" />
          </svg>
        </div>
      </div>

      {/* =========================================================================
          2. SECTION HEADER WITH GOLDEN LOTUS EMBLEM (Compact & Crystal Clear)
         ========================================================================= */}
      <div className="max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-6 relative z-20">
        
        <div className="text-center max-w-xl mx-auto mb-4 sm:mb-5">
          {/* Golden Lotus Blossom Emblem */}
          <div className="flex justify-center mb-1">
            <svg viewBox="0 0 60 36" fill="none" className="w-8 h-5 text-[#D4AF37] drop-shadow-xs">
              <path d="M30 4 C27 16 18 24 6 28 C16 30 24 28 30 25 C36 28 44 30 54 28 C42 24 33 16 30 4 Z" fill="#D4AF37" />
              <path d="M30 9 C26 18 20 23 12 26 C18 27 24 26 30 24 C36 26 42 27 48 26 C40 23 34 18 30 9 Z" fill="#FCEB9C" opacity="0.85" />
              <circle cx="30" cy="27" r="2" fill="#D4AF37" />
            </svg>
          </div>

          {/* Eyebrow: — CUSTOMER STORIES — */}
          <div className="flex items-center justify-center gap-2.5 mb-0.5">
            <span className="w-8 sm:w-12 h-[1.5px] bg-[#C99A38]" />
            <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-[0.22em] text-[#8C6512]">
              CUSTOMER STORIES
            </span>
            <span className="w-8 sm:w-12 h-[1.5px] bg-[#C99A38]" />
          </div>

          {/* Headline */}
          <h2 
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
            className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#4E0C16] tracking-tight leading-tight"
          >
            What Our Customers Say
          </h2>

          {/* Subtitle */}
          <p className="text-[11px] sm:text-xs text-[#6E5D53] font-normal tracking-wide mt-0.5">
            Real experiences from our valued customers
          </p>
        </div>

        {/* =========================================================================
            3. CARDS: 3 ON TOP, 2 BELOW CENTERED (Spacious & Legible)
           ========================================================================= */}
        <div className="relative px-3 sm:px-6">
          
          {/* Top Row: 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 max-w-[1360px] mx-auto">
            {visibleStories.slice(0, 3).map((item, idx) => (
              <StoryCard key={`${item.id}-${startIndex}-${idx}`} item={item} idx={idx} />
            ))}
          </div>

          {/* Bottom Row: 2 Cards Centered Below the 3 Cards Above */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 max-w-[920px] mx-auto mt-4 sm:mt-5">
            {visibleStories.slice(3, 5).map((item, idx) => (
              <StoryCard key={`${item.id}-${startIndex}-${idx + 3}`} item={item} idx={idx + 3} />
            ))}
          </div>

          {/* Left Navigation Chevron Button */}
          <button
            onClick={handlePrev}
            className="absolute -left-2 sm:-left-4 lg:  -left-5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#4E0C16] hover:bg-[#681020] text-white shadow-md hover:shadow-lg flex items-center justify-center hover:scale-108 active:scale-95 transition-all cursor-pointer z-20 border border-[#D4AF37]/50"
            aria-label="Previous Testimonials"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.4]" />
          </button>

          {/* Right Navigation Chevron Button */}
          <button
            onClick={handleNext}
            className="absolute -right-2 sm:-right-4 lg:-right-5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#4E0C16] hover:bg-[#681020] text-white shadow-md hover:shadow-lg flex items-center justify-center hover:scale-108 active:scale-95 transition-all cursor-pointer z-20 border border-[#D4AF37]/50"
            aria-label="Next Testimonials"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.4]" />
          </button>

        </div>

        {/* Pagination Indicator Dots */}
        <div className="flex items-center justify-center gap-2 mt-4 sm:mt-5 select-none">
          {Array.from({ length: totalPages }).map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => setStartIndex(dotIdx * VISIBLE_COUNT)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                currentPage === dotIdx
                  ? 'w-7 h-2.5 bg-[#4E0C16] ring-2 ring-[#D4AF37]/50 shadow-xs'
                  : 'w-2.5 h-2.5 bg-[#DEC5A0] hover:bg-[#B38E46]'
              }`}
              aria-label={`Page ${dotIdx + 1} of ${totalPages}`}
            />
          ))}
        </div>

        {/* =========================================================================
            4. FLOATING MAROON TRUST PILL BAR WITH ORNATE GOLD BRACKETS
           ========================================================================= */}
        <div className="mt-4 sm:mt-5 max-w-2xl mx-auto flex items-center justify-center gap-2">
          
          {/* Left Golden Ornamental Filigree Bracket */}
          <div className="w-6 sm:w-8 h-6 sm:h-8 flex items-center justify-center text-[#D4AF37] opacity-80 shrink-0 hidden sm:flex">
            <svg viewBox="0 0 32 32" className="w-full h-full fill-none stroke-current" strokeWidth="1.5">
              <path d="M28 16 C20 16, 12 10, 4 4 M28 16 C20 16, 12 22, 4 28" />
              <circle cx="4" cy="4" r="2" fill="currentColor" />
              <circle cx="4" cy="28" r="2" fill="currentColor" />
            </svg>
          </div>

          {/* Center Trust Pill Banner */}
          <div className="flex-1 bg-gradient-to-r from-[#4E0C16] via-[#3B0710] to-[#28040A] text-white rounded-full py-2 px-5 sm:px-8 shadow-[0_10px_25px_rgba(78,12,22,0.3)] border border-[#D4AF37]/60 flex items-center justify-around">
            
            {/* Pillar 1: Happy Customers */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 flex items-center justify-center text-[#E5C278] shrink-0">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E5C278]" />
              </div>
              <div>
                <span className="block font-bold text-xs sm:text-sm text-white leading-tight font-serif">
                  2,500+
                </span>
                <span className="block text-[9.5px] sm:text-[10.5px] text-[#EAD5BE] font-medium leading-tight">
                  Happy Customers
                </span>
              </div>
            </div>

            <div className="h-6 w-[1px] bg-gradient-to-b from-transparent via-[#D4AF37]/60 to-transparent" />

            {/* Pillar 2: Average Rating */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 flex items-center justify-center text-[#E5C278] shrink-0">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E5C278] fill-current" />
              </div>
              <div>
                <span className="block font-bold text-xs sm:text-sm text-white leading-tight font-serif">
                  4.9/5
                </span>
                <span className="block text-[9.5px] sm:text-[10.5px] text-[#EAD5BE] font-medium leading-tight">
                  Average Rating
                </span>
              </div>
            </div>

            <div className="h-6 w-[1px] bg-gradient-to-b from-transparent via-[#D4AF37]/60 to-transparent" />

            {/* Pillar 3: Verified Reviews */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 flex items-center justify-center text-[#E5C278] shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E5C278]" />
              </div>
              <div>
                <span className="block font-bold text-xs sm:text-sm text-white leading-tight font-serif">
                  100%
                </span>
                <span className="block text-[9.5px] sm:text-[10.5px] text-[#EAD5BE] font-medium leading-tight">
                  Verified Reviews
                </span>
              </div>
            </div>

          </div>

          {/* Right Golden Ornamental Filigree Bracket */}
          <div className="w-6 sm:w-8 h-6 sm:h-8 flex items-center justify-center text-[#D4AF37] opacity-80 shrink-0 hidden sm:flex scale-x-[-1]">
            <svg viewBox="0 0 32 32" className="w-full h-full fill-none stroke-current" strokeWidth="1.5">
              <path d="M28 16 C20 16, 12 10, 4 4 M28 16 C20 16, 12 22, 4 28" />
              <circle cx="4" cy="4" r="2" fill="currentColor" />
              <circle cx="4" cy="28" r="2" fill="currentColor" />
            </svg>
          </div>

        </div>

      </div>
    </section>
  );
}
