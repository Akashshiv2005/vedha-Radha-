import React from 'react';
import { Instagram, ArrowUpRight, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const INSTA_IMAGES = [
  { id: 1, image: '/images/product_necklace.jpg', alt: 'Gold Heritage Necklace', likes: '1.2k' },
  { id: 2, image: '/images/product_gold_earrings.jpg', alt: 'Traditional Gold Jhumkas', likes: '840' },
  { id: 3, image: '/images/generated/diamond_solitaire_luxe.jpg', alt: 'Solitaire Diamond Ring', likes: '2.4k' },
  { id: 4, image: '/images/product_bangles.jpg', alt: 'Royal Gold Bangles', likes: '970' },
  { id: 5, image: '/images/generated/temple_ganesha_art.jpg', alt: 'Temple Ganesha Gold Art', likes: '1.8k' },
  { id: 6, image: '/images/generated/bridal_showcase.jpg', alt: 'Bridal Heritage Saree & Jewellery', likes: '3.1k' },
  { id: 7, image: '/images/generated/silver_pooja_kalash.jpg', alt: 'Silver Pooja Articles', likes: '760' },
];

export default function InstagramFeed() {
  return (
    <section className="bg-[#FAF7F2] pt-8 pb-14 select-none">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Title on Left, Instagram handle on Right */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6"
        >
          <div className="flex items-center gap-3">
            <span className="w-6 h-[1.5px] bg-[#C5A059]" />
            <h2 
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#4E0C16] tracking-tight"
            >
              Follow Us on Instagram
            </h2>
          </div>

          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#FAF3E6] to-[#F5ECE0] border border-[#DECDBB] hover:border-[#D4AF37] text-xs sm:text-sm font-semibold text-[#8C1B33] hover:text-[#581923] transition-all duration-300 shadow-xs hover:shadow-md group cursor-pointer"
          >
            <Instagram className="w-4 h-4 text-[#8C1B33] group-hover:scale-115 transition-transform" />
            <span>@vedharadha_jewellers</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#C5A059] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>

        {/* 7-Image Gallery Row with Staggered Motion */}
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2.5 sm:gap-3">
          {INSTA_IMAGES.map((item, idx) => (
            <motion.a
              key={item.id}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden bg-[#FAF6EE] border border-[#EAE2D5] hover:border-[#D4AF37] shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer block"
            >
              <img
                src={item.image}
                alt={item.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                decoding="async"
              />
              {/* Instagram Hover Icon & Likes Overlay */}
              <div className="absolute inset-0 bg-[#3B070F]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white gap-1.5 p-2">
                <Instagram className="w-6 h-6 text-[#FAF6EE] transform group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-medium text-[#FAF6EE] flex items-center gap-1">
                  <Heart className="w-3 h-3 text-[#E87373] fill-current" />
                  {item.likes}
                </span>
              </div>
            </motion.a>
          ))}
        </div>

      </div>
    </section>
  );
}
