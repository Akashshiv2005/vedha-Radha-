import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ArrowRight, Instagram, Facebook, Youtube, Send, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#4E0C16] text-[#EAD8D8] pt-14 pb-8 border-t border-[#6B1424] font-sans select-none">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 pb-12 border-b border-[#6B1424]">
          
          {/* Column 1: Brand & Bio (Spans 4 cols on lg) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 text-[#D4AF37]">
                <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-xs">
                  <path d="M50 12 C44 28 32 46 16 60 C26 68 38 72 50 72 C62 72 74 68 84 60 C68 46 56 28 50 12 Z" fill="#D4AF37" opacity="0.9" />
                  <path d="M50 20 C46 36 38 52 50 68 C62 52 54 36 50 20 Z" fill="#B8860B" />
                  <path d="M50 68 C34 62 24 50 26 38 C34 46 44 56 50 68 Z" fill="#E5C058" />
                  <path d="M50 68 C66 62 76 50 74 38 C66 46 56 56 50 68 Z" fill="#E5C058" />
                  <circle cx="50" cy="48" r="3" fill="#4E0C16" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold text-white tracking-tight leading-none">
                  VEDHA RADHA
                </span>
                <span className="text-[7.5px] font-sans font-semibold tracking-[0.2em] text-[#D4AF37] uppercase mt-0.5">
                  SIGNATURE COLLECTION
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-[13px] text-[#D9C4C4] leading-relaxed max-w-sm font-light">
              A trusted name in fine jewellery, bringing timeless designs and quality craftsmanship for every celebration.
            </p>

            <p className="text-[11px] text-[#A6888E] pt-2">
              &copy; {new Date().getFullYear()} Vedha Radha Signature Collection. All Rights Reserved.
            </p>
          </div>

          {/* Column 2: Quick Links (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase text-[12px] text-[#D4AF37]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-[#EAD8D8]">
              <li>
                <Link to="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-[#D4AF37] transition-colors">Collections</Link>
              </li>
              <li>
                <Link to="/temple-heritage" className="hover:text-[#D4AF37] transition-colors">Temple Heritage</Link>
              </li>
              <li>
                <Link to="/diamonds" className="hover:text-[#D4AF37] transition-colors">Solitaire Diamonds</Link>
              </li>
              <li>
                <Link to="/bridal" className="hover:text-[#D4AF37] transition-colors">Bridal Grandeur</Link>
              </li>
              <li>
                <Link to="/silver-pooja" className="hover:text-[#D4AF37] transition-colors">Silver Pooja</Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-[#D4AF37] transition-colors">Special Offers</Link>
              </li>
              <li>
                <Link to="/#contact-concierge" className="hover:text-[#D4AF37] transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase text-[12px] text-[#D4AF37]">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-[#EAD8D8]">
              <li>
                <Link to="/contact" className="hover:text-[#D4AF37] transition-colors">FAQs</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#D4AF37] transition-colors">Shipping &amp; Delivery</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#D4AF37] transition-colors">Exchange &amp; Returns</Link>
              </li>
              <li>
                <Link to="/jewellery-care" className="hover:text-[#D4AF37] transition-colors">Jewellery Care Guide</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#D4AF37] transition-colors">Terms &amp; Conditions</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Get In Touch (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase text-[12px] text-[#D4AF37]">
              Get In Touch
            </h4>
            <div className="space-y-2.5 text-xs text-[#EAD8D8]">
              <a href="tel:+919876543210" className="flex items-start gap-2 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>+91 98765 43210</span>
              </a>
              <a href="mailto:support@vedharadha.com" className="flex items-start gap-2 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="break-all">support@vedharadha.com</span>
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="leading-snug">
                  No. 12, Thillai Nagar Main Road, Trichy &ndash; 620 018, Tamil Nadu.
                </span>
              </div>
            </div>
          </div>

          {/* Column 5: Stay Updated (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase text-[12px] text-[#D4AF37]">
              Stay Updated
            </h4>
            <p className="text-xs text-[#D9C4C4] font-light leading-snug">
              Get new arrivals, offers and exclusive collections.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white text-[#2C2420] text-xs px-3 py-2 pr-9 rounded-md placeholder-[#8A7A72] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                />
                <button
                  type="submit"
                  className="absolute right-1 w-7 h-7 rounded bg-[#D4AF37] hover:bg-[#C59B27] text-[#2A1810] flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Subscribe to newsletter"
                >
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
              {subscribed && (
                <div className="flex items-center gap-1.5 text-[11px] text-[#A6E3B8]">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Subscribed successfully!</span>
                </div>
              )}
            </form>

            {/* Social Icons Row */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#3B070F] border border-[#6B1424] hover:border-[#D4AF37] text-[#EAD8D8] hover:text-[#D4AF37] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#3B070F] border border-[#6B1424] hover:border-[#D4AF37] text-[#EAD8D8] hover:text-[#D4AF37] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#3B070F] border border-[#6B1424] hover:border-[#D4AF37] text-[#EAD8D8] hover:text-[#D4AF37] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://www.pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#3B070F] border border-[#6B1424] hover:border-[#D4AF37] text-[#EAD8D8] hover:text-[#D4AF37] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Pinterest"
              >
                {/* Pinterest SVG */}
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.365-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#A6888E]">
          <div>
            <span>Vedha Radha Signature Collection &bull; Trichy &bull; Mylapore, Chennai</span>
          </div>
          <div>
            <span>Designed &amp; Developed by </span>
            <a
              href="https://www.izonetech.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D4AF37] font-semibold hover:underline transition-colors"
            >
              Izone Technologies
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

