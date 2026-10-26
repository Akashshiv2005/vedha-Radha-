import React, { useState } from 'react';
import { MapPin, Info, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DeliveryCheck() {
  const [pincode, setPincode] = useState('');
  const [feedback, setFeedback] = useState(null);

  const handleCheck = (e) => {
    e.preventDefault();
    if (!pincode.trim()) {
      setFeedback({
        type: 'warning',
        text: 'Please enter a 6-digit postal pincode.'
      });
      return;
    }

    // Demo response matching exact requirement
    setFeedback({
      type: 'info',
      text: 'Please contact the showroom to confirm delivery for this pincode.'
    });
  };

  return (
    <footer className="bg-[#FAF7F2] py-4 sm:py-5 text-xs text-[#4A403A]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Left: Location Pin + Check Delivery Form */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-2 shrink-0">
              <MapPin className="w-4 h-4 text-[#581923] shrink-0" />
              <span className="font-sans font-medium text-[#2C2420] text-xs sm:text-[13px] whitespace-nowrap">
                Check delivery to your area
              </span>
            </div>

            <form onSubmit={handleCheck} className="flex items-center gap-1.5 w-full sm:w-auto">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => {
                  setPincode(e.target.value.replace(/\D/g, ''));
                  if (feedback) setFeedback(null);
                }}
                placeholder="Enter pincode (e.g. 600001)"
                className="bg-[#F5EFE6]/70 border border-[#DECDBB] rounded px-3 py-1.5 text-xs text-[#2C2420] placeholder-[#9C8F85] focus:outline-none focus:border-[#581923] focus:bg-white w-full sm:w-48 transition-all"
              />
              <button
                type="submit"
                className="bg-[#581923] hover:bg-[#431219] text-white text-xs font-medium px-4 py-1.5 rounded transition-colors duration-200 cursor-pointer shrink-0"
              >
                Check
              </button>
            </form>
          </div>

          {/* Right: Info Disclaimer */}
          <div className="flex items-center gap-2 text-[11.5px] sm:text-xs text-[#63574F] bg-[#F4EDE2]/50 px-3 py-1.5 rounded border border-[#E8DFC0]/50 w-full lg:w-auto justify-center lg:justify-start">
            <Info className="w-3.5 h-3.5 text-[#8C6D2D] shrink-0" />
            <span className="leading-tight">
              Unique handcrafted pieces are held during checkout to prevent double-selling.
            </span>
          </div>

        </div>

        {/* Demo response notification */}
        {feedback && (
          <div className="mt-3 p-2.5 rounded bg-[#F8F1E5] border border-[#DFCDB7] flex items-center justify-between text-xs text-[#523C27] max-w-xl animate-fadeIn">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#8C6D2D] shrink-0" />
              <span>{feedback.text}</span>
            </div>
            <button 
              onClick={() => setFeedback(null)} 
              className="text-[#8C6D2D] hover:text-[#581923] font-bold ml-3 text-xs"
            >
              ✕
            </button>
          </div>
        )}

      </div>
    </footer>
  );
}
