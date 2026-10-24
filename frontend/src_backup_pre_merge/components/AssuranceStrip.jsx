import React from 'react';
import { ShieldCheck, Truck, PackageCheck } from 'lucide-react';

export default function AssuranceStrip() {
  const assurances = [
    {
      id: 'reservation',
      icon: ShieldCheck,
      title: 'Secure reservation',
      subtitle: 'Your selected piece is safely held during checkout',
    },
    {
      id: 'delivery',
      icon: Truck,
      title: 'Delivery availability checked at checkout',
      subtitle: 'See estimated delivery date before you pay',
    },
    {
      id: 'packaging',
      icon: PackageCheck,
      title: 'Carefully packed',
      subtitle: 'Delivered with the care your jewellery deserves',
    },
  ];

  return (
    <section className="bg-[#FAF7F2] py-5 sm:py-6 border-b border-[#EAE2D5]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E3DACB] gap-4 md:gap-0">
          
          {assurances.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id} 
                className={`flex items-start gap-3.5 ${
                  idx === 0 ? 'md:pr-6' : idx === 1 ? 'md:px-6 pt-3 md:pt-0' : 'md:pl-6 pt-3 md:pt-0'
                }`}
              >
                <div className="p-1.5 rounded-full text-[#3D332D] shrink-0 mt-0.5">
                  <Icon className="w-5 h-5 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="font-serif text-[13.5px] sm:text-[14px] font-semibold text-[#241716] leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[11.5px] sm:text-xs text-[#73655C] font-sans mt-0.5 leading-normal">
                    {item.subtitle}
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
