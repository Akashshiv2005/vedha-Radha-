import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ContactConciergeSection from '../components/ContactConciergeSection';

export default function ContactPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#FAF4EB] min-h-screen select-none">
      {/* Top Breadcrumbs */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-6">
        <div className="flex items-center gap-2 text-xs text-[#7A6E65]">
          <button onClick={() => navigate('/')} className="hover:text-[#4E0C16] cursor-pointer">Home</button>
          <ChevronRight className="w-3.5 h-3.5 text-[#B38E46]" />
          <span className="font-semibold text-[#4E0C16]">Contact &amp; Showroom Concierge</span>
        </div>
      </div>

      {/* Main Contact & Showroom Concierge Suite */}
      <ContactConciergeSection />
    </div>
  );
}
