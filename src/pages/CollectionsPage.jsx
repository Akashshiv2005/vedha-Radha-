import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { Sparkles, ChevronRight, Gem, Shield, Heart, ShoppingBag } from 'lucide-react';

export default function CollectionsPage({
  onViewProduct = () => {},
  onAddToCart = () => {},
  onAddToWishlist = () => {},
  wishlistItems = []
}) {
  const navigate = useNavigate();
  const [activeCollectionTab, setActiveCollectionTab] = useState('All');

  const collectionLines = [
    {
      id: 'Heritage Temple Collection',
      title: 'Heritage Temple Collection',
      subtitle: 'Devotional sculpting inspired by Thanjavur & Mylapore temples',
      description: 'Sacred motifs of Goddess Lakshmi, Lord Ganesha, peacocks, and temple gopurams meticulously carved in high-relief repoussé technique using 22K pure hallmarked gold.',
      image: '/images/col_gold.jpg',
      artisan: 'Thanjavur Master Guild'
    },
    {
      id: 'Chettinad Antique Collection',
      title: 'Chettinad Antique Collection',
      subtitle: 'Aristocratic heirloom jewelry with natural unheated rubies',
      description: 'Characterized by royal matte patina finishes, geometric ruby clusters, and robust screw-lock bangles inspired by the palatial mansions of Karaikudi.',
      image: '/images/col_handcrafted.jpg',
      artisan: 'Chettinad Heritage Goldsmiths'
    },
    {
      id: '92.5 Pure Silver Articles',
      title: '92.5 Pure Silver Articles',
      subtitle: 'Sacred pooja vessels, auspicious lamps, and artisan silver payals',
      description: 'Pure 925 sterling silver crafted for household prosperity, family pujas, and everyday elegance with fine engraving and high tarnish resistance.',
      image: '/images/col_silver.jpg',
      artisan: 'Salem Silversmith Colony'
    }
  ];

  const filteredProducts = activeCollectionTab === 'All'
    ? products
    : products.filter(p => p.collection === activeCollectionTab || p.category.includes(activeCollectionTab));

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8 sm:py-12 border-b border-[#EAE2D5]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-[#7A6E65] mb-4">
          <button onClick={() => navigate('/')} className="hover:text-[#581923] cursor-pointer">Home</button>
          <ChevronRight className="w-3.5 h-3.5 text-[#B38E46]" />
          <span className="font-semibold text-[#581923]">Signature Collections</span>
        </div>

        {/* Page Title & Intro */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#8C6D2D]">Artisanal Legacy</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#241716] mt-1">
            Signature Design Collections
          </h1>
          <p className="text-xs sm:text-sm text-[#73655C] mt-2 leading-relaxed">
            Each Vedha Radha collection tells a distinct story of South Indian heritage, ancient lost-wax casting, and hallmarked precious metals perfected across seven decades.
          </p>
        </div>

        {/* Signature Collection Showcases */}
        <div className="space-y-8 mb-14">
          {collectionLines.map((col, idx) => (
            <div 
              key={col.id} 
              className={`bg-white rounded-2xl border border-[#E8DFC0] overflow-hidden shadow-xs flex flex-col ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'
              } items-stretch`}
            >
              <div className="lg:w-1/2 aspect-16/10 lg:aspect-auto overflow-hidden bg-[#ECE4D8] relative">
                <img 
                  src={col.image} 
                  alt={col.title} 
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#581923]/90 text-white text-[10.5px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
                    {col.artisan}
                  </span>
                </div>
              </div>

              <div className="lg:w-1/2 p-6 sm:p-10 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-[#8C6D2D] uppercase tracking-wider">
                    {col.subtitle}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#241716]">
                    {col.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#63574F] leading-relaxed pt-1">
                    {col.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F0E8DC] flex items-center justify-between">
                  <button
                    onClick={() => {
                      setActiveCollectionTab(col.id);
                      const el = document.getElementById('collection-items');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-[#581923] hover:bg-[#431219] text-white px-5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Explore {col.title}
                  </button>
                  <span className="text-xs text-[#8C6D2D] font-medium">100% Certified</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Collection Products Grid */}
        <div id="collection-items" className="pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#DECDBB]">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#241716]">
                {activeCollectionTab === 'All' ? 'All Collection Pieces' : activeCollectionTab}
              </h3>
              <p className="text-xs text-[#7A6E65] mt-0.5">Crafted with certified purity and hallmarked laser assaying.</p>
            </div>

            {/* Collection Filter Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setActiveCollectionTab('All')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer ${
                  activeCollectionTab === 'All'
                    ? 'bg-[#581923] text-white'
                    : 'bg-white text-[#4A403A] border border-[#DECDBB]'
                }`}
              >
                All
              </button>
              {collectionLines.map(c => (
                <button
                  key={c.id}
                  onClick={() => setActiveCollectionTab(c.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer ${
                    activeCollectionTab === c.id
                      ? 'bg-[#581923] text-white'
                      : 'bg-white text-[#4A403A] border border-[#DECDBB]'
                  }`}
                >
                  {c.title}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((item) => {
              const isWishlisted = wishlistItems.some(w => w.id === item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-[#E8DFC0] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-[#EFE8DC]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={() => onAddToWishlist(item)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-[#581923] shadow-md cursor-pointer"
                      title="Add to Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#D32F2F] text-[#D32F2F]' : ''}`} />
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D2D]">{item.craftsmanship || item.details}</span>
                      <h3 className="font-serif text-base font-bold text-[#241716] mt-1">{item.name}</h3>
                      <p className="text-xs text-[#63574F] line-clamp-2 mt-1">{item.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#EAE2D5] flex items-center justify-between">
                      <span className="font-serif text-lg font-bold text-[#48161E]">{item.price}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onViewProduct(item)}
                          className="px-3 py-1.5 rounded-md border border-[#581923] text-[#581923] hover:bg-[#FAF0E1] text-xs font-semibold cursor-pointer"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => onAddToCart(item)}
                          className="px-3 py-1.5 rounded-md bg-[#581923] text-white hover:bg-[#431219] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
