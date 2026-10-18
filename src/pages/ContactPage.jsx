import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Calendar, CheckCircle2, ChevronRight, MessageSquare, Send } from 'lucide-react';

export default function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Bridal Consultation',
    date: '',
    notes: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        phone: '',
        email: '',
        service: 'Bridal Consultation',
        date: '',
        notes: ''
      });
    }, 4000);
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8 sm:py-12 border-b border-[#EAE2D5]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-[#7A6E65] mb-4">
          <button onClick={() => navigate('/')} className="hover:text-[#581923] cursor-pointer">Home</button>
          <ChevronRight className="w-3.5 h-3.5 text-[#B38E46]" />
          <span className="font-semibold text-[#581923]">Contact & Showroom</span>
        </div>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#8C6D2D]">We Are Here For You</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#241716] mt-1">
            Contact & Showroom Concierge
          </h1>
          <p className="text-xs sm:text-sm text-[#73655C] mt-2 leading-relaxed">
            Reach out to our master jewelers or book a dedicated private preview at our landmark Mylapore flagship showroom.
          </p>
        </div>

        {/* Contact Grid: Details + Appointment Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Left: Showroom Info Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Showroom Address */}
            <div className="bg-white rounded-xl border border-[#E8DFC0] p-5 shadow-2xs">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#F3EAD3] text-[#581923] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#241716]">Mylapore Flagship Showroom</h3>
                  <p className="text-xs text-[#63574F] mt-1 leading-relaxed">
                    48, South Mada Street, Mylapore,<br />
                    Chennai, Tamil Nadu &ndash; 600004
                  </p>
                  <span className="inline-block mt-2 text-[11px] text-[#8C6D2D] font-semibold">
                    Near Kapaleeshwarar Temple Tank
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Phone & WhatsApp */}
            <div className="bg-white rounded-xl border border-[#E8DFC0] p-5 shadow-2xs">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#F3EAD3] text-[#581923] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#241716]">Direct Concierge & Orders</h3>
                  <p className="text-xs text-[#63574F]">
                    Phone: <a href="tel:+914428341999" className="text-[#581923] font-semibold hover:underline">+91 44 2834 1999</a>
                  </p>
                  <p className="text-xs text-[#63574F]">
                    Mobile / WhatsApp: <a href="tel:+919840123456" className="text-[#581923] font-semibold hover:underline">+91 98401 23456</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Timings */}
            <div className="bg-white rounded-xl border border-[#E8DFC0] p-5 shadow-2xs">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#F3EAD3] text-[#581923] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#241716]">Showroom Timings</h3>
                  <p className="text-xs text-[#63574F] mt-1">
                    Monday to Sunday (All 7 Days)
                  </p>
                  <p className="text-xs font-semibold text-[#581923] mt-0.5">
                    9:30 AM &ndash; 8:30 PM (IST)
                  </p>
                </div>
              </div>
            </div>

            {/* Email Inquiries */}
            <div className="bg-white rounded-xl border border-[#E8DFC0] p-5 shadow-2xs">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#F3EAD3] text-[#581923] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#241716]">Email Inquiries</h3>
                  <p className="text-xs text-[#63574F] mt-1">
                    <a href="mailto:care@vedharadhajewellery.com" className="text-[#581923] font-semibold hover:underline">
                      care@vedharadhajewellery.com
                    </a>
                  </p>
                  <p className="text-[11px] text-[#7A6E65] mt-0.5">Replies within 2 business hours</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right: Booking Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-[#E8DFC0] p-6 sm:p-8 shadow-xs">
              <div className="mb-6">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#8C6D2D] bg-[#FAF3E6] px-2.5 py-0.5 rounded">
                  VIP Appointment
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#241716] mt-2">
                  Book a Dedicated Showroom Appointment
                </h2>
                <p className="text-xs text-[#63574F] mt-1">
                  Reserve private time with our senior bridal consultants to explore wedding sets, custom designs, or old gold evaluation.
                </p>
              </div>

              {isSubmitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2 animate-fadeIn">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="text-base font-bold text-emerald-900">
                    Appointment Requested Successfully!
                  </h3>
                  <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                    Thank you! Our concierge will contact you shortly to confirm your private appointment at our Mylapore showroom.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#241716] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Smt. Radha Ramanathan"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-[#FAF7F2] border border-[#DECDBB] focus:border-[#581923] rounded-lg px-3.5 py-2 text-xs text-[#2C1D18] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#241716] mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98401 23456"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-[#FAF7F2] border border-[#DECDBB] focus:border-[#581923] rounded-lg px-3.5 py-2 text-xs text-[#2C1D18] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#241716] mb-1">
                        Service Required
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({...formData, service: e.target.value})}
                        className="w-full bg-[#FAF7F2] border border-[#DECDBB] focus:border-[#581923] rounded-lg px-3 py-2 text-xs text-[#2C1D18] focus:outline-none"
                      >
                        <option value="Bridal Consultation">Bridal Trousseau Consultation</option>
                        <option value="Custom Gold Design">Custom Gold / Temple Jewellery</option>
                        <option value="Silver Articles">Silver Pooja & Auspicious Articles</option>
                        <option value="Old Gold Exchange">100% Old Gold Exchange Assessment</option>
                        <option value="General Visit">Showroom Walk-in Visit</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#241716] mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full bg-[#FAF7F2] border border-[#DECDBB] focus:border-[#581923] rounded-lg px-3.5 py-2 text-xs text-[#2C1D18] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#241716] mb-1">
                      Notes or Specific Requirements
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Mention any specific necklace length, budget range, or bridal dates..."
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className="w-full bg-[#FAF7F2] border border-[#DECDBB] focus:border-[#581923] rounded-lg px-3.5 py-2 text-xs text-[#2C1D18] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#581923] hover:bg-[#431219] text-white py-3 rounded-lg text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>Confirm Showroom Appointment</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
