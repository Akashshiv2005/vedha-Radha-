import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Award, Heart, Sparkles, MapPin, Phone, ChevronRight, Clock, Users, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const navigate = useNavigate();

  const pillars = [
    {
      icon: ShieldCheck,
      title: '100% BIS 916 Hallmark',
      description: 'Every gold ornament undergoes laser assaying and bears the official Bureau of Indian Standards hallmark for uncompromising purity.'
    },
    {
      icon: Award,
      title: 'Four Generations of Mastery',
      description: 'Preserving ancient South Indian repoussé, nakshi, and filigree techniques perfected by hereditary master goldsmiths.'
    },
    {
      icon: Heart,
      title: 'Devotional Purity & Trust',
      description: 'From sacred temple jewels to wedding trousseaus, we treat each creation as an auspicious family heirloom.'
    },
    {
      icon: Users,
      title: 'Transparent Ethical Pricing',
      description: 'Exact weight breakdown, zero hidden wastage deductions, and prevailing showroom board rates guaranteed.'
    }
  ];

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8 sm:py-12 border-b border-[#EAE2D5]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-[#7A6E65] mb-4">
          <button onClick={() => navigate('/')} className="hover:text-[#581923] cursor-pointer">Home</button>
          <ChevronRight className="w-3.5 h-3.5 text-[#B38E46]" />
          <span className="font-semibold text-[#581923]">About Us & Heritage</span>
        </div>

        {/* Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden mb-12 border border-[#E8DFC0] shadow-xl">
          <div className="aspect-21/9 min-h-[320px] relative">
            <img 
              src="/images/hero_panoramic.jpg" 
              alt="Vedha Radha Heritage Showroom" 
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#2C0A10]/95 via-[#48141C]/80 to-transparent flex items-center p-6 sm:p-12">
              <div className="max-w-xl text-white space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#E6C37A] block">
                  Heritage Since 1952 &bull; Mylapore, Chennai
                </span>
                <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                  The Legacy of Vedha Radha
                </h1>
                <p className="text-xs sm:text-sm text-[#EAD8D8] leading-relaxed">
                  For over seven decades, Vedha Radha Thanga Maaligai has stood as a sanctuary of South Indian jewelry craftsmanship, blending sacred temple artistry with enduring purity.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Story Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-16">
          <div className="space-y-4 text-xs sm:text-sm text-[#4A3E38] leading-relaxed">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C6D2D] block">
              Our Journey
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#241716] leading-snug">
              Crafting Heirloom Memories for Every Generation
            </h2>
            <p>
              Founded in the heart of historic Mylapore near the sacred Kapaleeshwarar Temple, Vedha Radha Thanga Maaligai was established with a singular devotion: to craft gold and silver jewelry that carries divine blessings, generational artistry, and guaranteed hallmark purity.
            </p>
            <p>
              What started as an artisanal goldsmith atelier catering to traditional Chennai families has evolved into a premier destination for bridal trousseau, temple art revivals, and 92.5 sterling silver articles, all while retaining the warm, personal concierge experience our patrons cherish.
            </p>
            <div className="pt-2 flex gap-4">
              <button
                onClick={() => navigate('/jewellery')}
                className="bg-[#581923] hover:bg-[#431219] text-white px-5 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Explore Jewellery Range
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="border border-[#581923] text-[#581923] hover:bg-[#FAF0E1] px-5 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Visit Flagship Showroom
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl overflow-hidden shadow-sm border border-[#E8DFC0] aspect-4/5">
              <img src="/images/col_gold.jpg" alt="Master Goldsmithing" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-xl overflow-hidden shadow-sm border border-[#E8DFC0] aspect-4/5 translate-y-6">
              <img src="/images/col_handcrafted.jpg" alt="Temple Jewellery Art" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* 4 Pillars of Trust */}
        <div className="mb-16">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C6D2D]">Our Foundation</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#241716] mt-1">
              The Four Pillars of Vedha Radha
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="bg-white rounded-xl border border-[#E8DFC0] p-6 shadow-2xs text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#F3EAD3] text-[#581923] flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#241716] mb-1.5">{p.title}</h3>
                  <p className="text-xs text-[#73655C] leading-relaxed">{p.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Flagship Mylapore Showroom Details */}
        <div className="bg-[#FAF3E6] rounded-2xl p-6 sm:p-10 border border-[#E5D5BA] flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#8C6D2D] bg-[#F7ECD8] px-3 py-1 rounded-full">
              Flagship Destination
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#241716]">
              Visit Our Heritage Mylapore Showroom
            </h3>
            <p className="text-xs sm:text-sm text-[#63574F] leading-relaxed">
              Step into our landmark showroom in Mylapore to experience the weight, luster, and artistry of our jewels in person with our senior bridal consultants.
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-[#4A3E38] pt-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#581923]" />
                48, South Mada Street, Mylapore, Chennai - 600004
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#581923]" />
                Open 7 Days: 9:30 AM &ndash; 8:30 PM
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/contact')}
            className="bg-[#581923] hover:bg-[#431219] text-white px-6 py-3 rounded-lg text-xs font-semibold whitespace-nowrap shadow-md transition-colors cursor-pointer"
          >
            Showroom Directions & Contact
          </button>
        </div>

      </div>
    </div>
  );
}
