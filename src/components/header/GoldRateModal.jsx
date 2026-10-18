import React, { useState } from 'react';
import { X, TrendingUp, Sparkles, Check, Edit2, RefreshCw, ShieldCheck, AlertCircle, Info } from 'lucide-react';

export default function GoldRateModal({
  isOpen,
  onClose,
  rates,
  status = 'unconfigured_indicative',
  isLoading = false,
  error = null,
  disclaimer = '',
  onRefresh = () => {},
  onUpdateRates = () => {}
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempGold22k, setTempGold22k] = useState(rates.gold22k || '6,742');
  const [tempGold24k, setTempGold24k] = useState(rates.gold24k || '7,355');
  const [tempSilver1g, setTempSilver1g] = useState(rates.silver1g || '94.50');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateRates({
      ...rates,
      gold22k: tempGold22k,
      gold24k: tempGold24k,
      silver1g: tempSilver1g,
      lastUpdated: 'Updated by Showroom Staff'
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'live':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVE SPOT BENCHMARK
          </span>
        );
      case 'live_cached':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            CACHED MARKET RATE
          </span>
        );
      case 'stale_fallback':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            OFFLINE / STALE DATA
          </span>
        );
      case 'unconfigured_indicative':
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-[#F3EAD3] text-[#7A5826] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#DFCDB7]">
            <Info className="w-3 h-3 text-[#8C6D2D]" />
            INDICATIVE BENCHMARK (KEY UNCONFIGURED)
          </span>
        );
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gold-rate-title"
    >
      <div 
        className="bg-[#FAF7F2] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E8DFC0] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#581923] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#E6C37A]/20 flex items-center justify-center text-[#E6C37A]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 id="gold-rate-title" className="text-lg font-bold">Today’s Board Rate</h3>
              <p className="text-[11px] text-[#E6C37A]">Vedha Radha Thanga Maaligai &bull; Chennai Benchmark</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close rate details dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
          
          {/* Status & Last Updated Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EAE2D5] text-xs">
            <div>{getStatusBadge()}</div>
            <div className="text-[11px] text-[#7A6E65] font-mono flex items-center gap-1">
              <span>Last updated:</span>
              <strong className="text-[#3D332D]">{rates.lastUpdated || 'Today'}</strong>
            </div>
          </div>

          {/* Rate Cards */}
          {!isEditing ? (
            <div className="space-y-3">
              
              {/* 22K Gold Rate Card (Main Jewellery Benchmark) */}
              <div className="p-4 rounded-xl bg-white border-2 border-[#D4AF37]/60 shadow-xs flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#C5A059]" />
                    <span className="text-base font-bold text-[#241716]">22K Jewellery Gold</span>
                    <span className="text-[10px] font-bold bg-[#FAF2DF] text-[#7A5826] px-1.5 py-0.2 rounded border border-[#E8D6B0]">
                      BIS 916
                    </span>
                  </div>
                  <span className="text-xs text-[#7A6E65] block mt-0.5">
                    Standard Hallmark Indian Jewellery Purity (91.67%)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-[#581923]">₹ {rates.gold22k}</span>
                  <span className="text-[10.5px] text-[#7A6E65] block font-mono">/ 1 gram</span>
                </div>
              </div>

              {/* 24K Pure Gold Rate Card */}
              <div className="p-3.5 rounded-xl bg-white border border-[#E8DFC0] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E5C278]" />
                    <span className="text-sm font-bold text-[#241716]">24K Pure Gold</span>
                    <span className="text-[10px] bg-neutral-100 text-neutral-700 px-1.5 py-0.2 rounded">99.9% Bullion</span>
                  </div>
                  <span className="text-[11px] text-[#7A6E65] block">Spot Benchmark Gold Ingot</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-[#351218]">₹ {rates.gold24k || '7,355'}</span>
                  <span className="text-[10px] text-[#7A6E65] block font-mono">/ 1 gram</span>
                </div>
              </div>

              {/* 18K Gold Card */}
              {rates.gold18k && (
                <div className="p-3.5 rounded-xl bg-white border border-[#E8DFC0] flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#DECDBB]" />
                      <span className="text-sm font-bold text-[#241716]">18K Diamond Jewellery Gold</span>
                    </div>
                    <span className="text-[11px] text-[#7A6E65] block">75.0% Fine Purity</span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold text-[#351218]">₹ {rates.gold18k}</span>
                    <span className="text-[10px] text-[#7A6E65] block font-mono">/ 1 gram</span>
                  </div>
                </div>
              )}

              {/* 92.5 Pure Silver Rate Card */}
              <div className="p-4 rounded-xl bg-white border border-[#E8DFC0] shadow-xs flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#A89F91]" />
                    <span className="text-base font-bold text-[#241716]">92.5 Pure Silver</span>
                    <span className="text-[10px] font-bold bg-neutral-100 text-neutral-700 px-1.5 py-0.2 rounded border border-neutral-300">
                      Sterling
                    </span>
                  </div>
                  <span className="text-xs text-[#7A6E65] block mt-0.5">
                    Fine Silver Jewellery, Anklets & Pooja Articles
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-[#48161E]">₹ {rates.silver1g}</span>
                  <span className="text-[10.5px] text-[#7A6E65] block font-mono">/ 1 gram</span>
                </div>
              </div>

              {savedSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Showroom board rates updated successfully!</span>
                </div>
              )}

              {/* Unit Conversion & Transparency Note */}
              <div className="bg-[#FAF4E8] rounded-xl p-3.5 border border-[#EADDCE] text-xs space-y-1.5 text-[#5C4F44]">
                <div className="font-semibold text-[#581923] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#8C6D2D]" />
                  <span>Calculation & Conversion Methodology:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  &bull; Rates are calculated from international spot prices where <strong>1 Troy Ounce = 31.1035 grams</strong>.<br />
                  &bull; 22K rate is derived at exact BIS standard purity: <strong>24K × (22 / 24)</strong>.<br />
                  &bull; Silver rate represents 92.5% assayed fine silver.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onRefresh}
                  disabled={isLoading}
                  className="flex-1 bg-white hover:bg-[#F3EAD3] border border-[#DECDBB] text-[#581923] py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#8C6D2D]' : ''}`} />
                  <span>{isLoading ? 'Fetching Live Rates...' : 'Refresh Live Rates'}</span>
                </button>

                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 border border-[#581923] text-[#581923] hover:bg-[#581923] hover:text-white py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Staff Manual Override</span>
                </button>
              </div>
            </div>
          ) : (
            /* Staff Manual Edit Form */
            <form onSubmit={handleSave} className="space-y-4 my-2">
              <p className="text-xs text-[#63574F]">
                Staff Control: Override today’s daily showroom board rate displayed across the site header.
              </p>

              <div>
                <label className="block text-xs font-semibold text-[#241716] mb-1">
                  22K Gold (₹ per gram)
                </label>
                <input
                  type="text"
                  value={tempGold22k}
                  onChange={(e) => setTempGold22k(e.target.value)}
                  className="w-full bg-white border border-[#DECDBB] rounded-lg px-3 py-2 text-xs text-[#241716] focus:outline-none focus:border-[#581923]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#241716] mb-1">
                  24K Gold (₹ per gram)
                </label>
                <input
                  type="text"
                  value={tempGold24k}
                  onChange={(e) => setTempGold24k(e.target.value)}
                  className="w-full bg-white border border-[#DECDBB] rounded-lg px-3 py-2 text-xs text-[#241716] focus:outline-none focus:border-[#581923]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#241716] mb-1">
                  92.5 Silver (₹ per gram)
                </label>
                <input
                  type="text"
                  value={tempSilver1g}
                  onChange={(e) => setTempSilver1g(e.target.value)}
                  className="w-full bg-white border border-[#DECDBB] rounded-lg px-3 py-2 text-xs text-[#241716] focus:outline-none focus:border-[#581923]"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 border border-[#DECDBB] text-[#554A42] py-2 rounded-lg text-xs hover:bg-[#F3EAD3]/40 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#581923] text-white py-2 rounded-lg text-xs font-semibold hover:bg-[#431219] cursor-pointer"
                >
                  Save Showroom Rates
                </button>
              </div>
            </form>
          )}

          {/* Legal Disclaimer */}
          <p className="text-[10.5px] text-center text-[#9C8F85] pt-2">
            * Note: These rates serve as indicative market guidelines. Final billing includes making charges and applicable 3% GST.
          </p>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#F5EFE6] border-t border-[#E3DACB] flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#581923] hover:bg-[#431219] text-white px-5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
