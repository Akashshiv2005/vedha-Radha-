import React, { useEffect, useRef } from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';

export default function NavDropdown({
  isOpen,
  onClose,
  items,
  title,
  subtitle,
  accentColor = '#581923',
  onSelectItem
}) {
  const dropdownRef = useRef(null);

  // Close on Escape or click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[460px] bg-[#FAF7F2] rounded-lg shadow-xl border border-[#E8DFC0] p-4 z-50 animate-fadeIn"
      role="menu"
      aria-label={`${title} Subcategories`}
    >
      {/* Dropdown Header */}
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#EAE2D5]">
        <div>
          <span className="text-sm font-bold text-[#241716] block">{title} Collection</span>
          <span className="text-[10.5px] text-[#7A6E65]">{subtitle}</span>
        </div>
        <div className="flex items-center gap-1 text-[10.5px] text-[#8C6D2D] font-medium bg-[#F3EAD3]/60 px-2 py-0.5 rounded">
          <Sparkles className="w-3 h-3 text-[#B38E46]" />
          <span>BIS 916 Hallmarked</span>
        </div>
      </div>

      {/* Grid of category links */}
      <div className="grid grid-cols-2 gap-1.5">
        {items.map((item, idx) => {
          if (item.isAll) {
            return (
              <div key={item.name} className="col-span-2 mt-2 pt-2 border-t border-[#EAE2D5]">
                <button
                  onClick={() => {
                    if (onSelectItem) onSelectItem(item);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded bg-[#581923] text-white hover:bg-[#431219] text-xs font-semibold tracking-wide transition-all group cursor-pointer shadow-2xs"
                  role="menuitem"
                >
                  <span>{item.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          }

          return (
            <button
              key={item.name}
              onClick={() => {
                if (onSelectItem) onSelectItem(item);
                onClose();
              }}
              className={`flex items-center justify-between p-2 rounded text-left transition-all group cursor-pointer ${
                item.highlight 
                  ? 'bg-[#F4ECE0] hover:bg-[#EFE3D3] text-[#581923] font-semibold' 
                  : 'hover:bg-[#F4EFE6] text-[#3D332D] hover:text-[#581923]'
              }`}
              role="menuitem"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-xs font-medium">{item.name}</span>
              </div>
              <span className="text-[10px] text-[#9C8F85] group-hover:text-[#7A6E65]">
                {item.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
