import React from 'react';
import { Sparkles } from 'lucide-react';

export function ProductCardSkeleton({ aspect = 'aspect-square' }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8DFC0]/80 overflow-hidden shadow-xs flex flex-col justify-between transition-all duration-300">
      {/* Image container skeleton */}
      <div className={`relative ${aspect} overflow-hidden bg-[#FAF6EE] animate-shimmer flex items-center justify-center`}>
        {/* Subtle decorative emblem */}
        <div className="w-12 h-12 rounded-full border border-[#D5C29D]/30 flex items-center justify-center opacity-40">
          <Sparkles className="w-6 h-6 text-[#8C6D2D]/50" />
        </div>
        
        {/* Top badges placeholders */}
        <div className="absolute top-3 left-3 w-16 h-5 rounded-full bg-white/70 animate-shimmer-subtle shadow-2xs" />
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/70 animate-shimmer-subtle shadow-2xs" />
      </div>

      {/* Card Content placeholder */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div className="space-y-2">
          {/* Subtitle / Department */}
          <div className="h-3 w-1/3 rounded bg-[#ECE3D0] animate-shimmer" />
          
          {/* Product Title (2 lines) */}
          <div className="h-4 w-4/5 rounded bg-[#ECE3D0] animate-shimmer" />
          <div className="h-4 w-3/5 rounded bg-[#ECE3D0] animate-shimmer" />
          
          {/* Hallmark / purity badge */}
          <div className="pt-1">
            <div className="h-4 w-28 rounded-full bg-[#ECE3D0] animate-shimmer" />
          </div>
        </div>

        {/* Pricing & CTA buttons row */}
        <div className="pt-3 border-t border-[#F2ECE1] flex items-center justify-between gap-2">
          {/* Price placeholder */}
          <div className="space-y-1">
            <div className="h-5 w-24 rounded bg-[#ECE3D0] animate-shimmer" />
            <div className="h-2.5 w-16 rounded bg-[#ECE3D0] animate-shimmer" />
          </div>

          {/* Action buttons placeholder */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-16 rounded-lg bg-[#ECE3D0] animate-shimmer" />
            <div className="h-8 w-16 rounded-lg bg-[#581923]/20 animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({
  count = 6,
  columns = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  aspect = 'aspect-square',
  label = 'Loading handcrafted collection...'
}) {
  return (
    <div className="my-8 w-full" data-testid="product-grid-skeleton">
      {/* Subtle Luxury Loading Header */}
      <div className="flex items-center justify-center gap-2.5 py-3 mb-6 bg-gradient-to-r from-[#FAF6EE] via-[#F3EBD8]/60 to-[#FAF6EE] rounded-xl border border-[#E8DFC0]/70 text-[#8C6D2D]">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A059] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#8C6D2D]" />
        </span>
        <span className="text-xs font-semibold tracking-wide uppercase text-[#581923]">
          {label}
        </span>
      </div>

      {/* Grid of Skeleton Cards */}
      <div className={`grid ${columns} gap-6`}>
        {Array.from({ length: count }).map((_, idx) => (
          <ProductCardSkeleton key={idx} aspect={aspect} />
        ))}
      </div>
    </div>
  );
}

export default ProductGridSkeleton;
