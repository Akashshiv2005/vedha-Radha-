import React from 'react';
import { 
  ShieldAlert, 
  Lock, 
  User, 
  Calendar, 
  Clock, 
  X, 
  ArrowRight, 
  AlertCircle 
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function DuplicateConflictModal() {
  const { conflictModalData, setConflictModalData } = useAdmin();

  if (!conflictModalData) return null;

  const { product, activeHolder, attemptedBy, reason } = conflictModalData;

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] border-2 border-rose-600/40 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-rose-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-800 rounded-xl">
              <ShieldAlert className="w-6 h-6 text-rose-200" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest bg-rose-800/80 px-2 py-0.5 rounded text-rose-200 font-semibold">
                Showroom Duplicate-Sale Safeguard
              </span>
              <h3 className="text-lg font-serif font-bold text-white mt-0.5">
                Duplicate Booking Prevented
              </h3>
            </div>
          </div>
          <button 
            onClick={() => setConflictModalData(null)}
            className="text-rose-200 hover:text-white p-1 rounded-lg hover:bg-rose-800/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-[#2C2420]">
          {/* Safeguard Alert Notice */}
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed text-rose-900">
              <p className="font-bold text-sm mb-1">{reason}</p>
              <p>
                Because this is a <strong className="underline">1-of-1 Handcrafted Piece</strong>, our system strictly blocks parallel online reservations or conflicting showroom claims to prevent customer disappointment.
              </p>
            </div>
          </div>

          {/* Product Snapshot */}
          <div className="bg-[#F4EFE6] border border-[#E3D9CC] rounded-xl p-3 flex items-center gap-4">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-16 h-16 object-cover rounded-lg border border-[#D5C7B3] flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#5C1D27] text-white rounded font-medium">
                  {product.sku}
                </span>
                <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                  Status: {product.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-[#1C1614] truncate mt-1">
                {product.name}
              </h4>
              <p className="text-xs text-[#7A5B20] font-medium font-serif mt-0.5">
                {product.price} • {product.grossWeight}
              </p>
            </div>
          </div>

          {/* Active Hold Details (if reserved) */}
          {activeHolder ? (
            <div className="bg-white border border-[#E3D9CC] rounded-xl p-4 shadow-sm space-y-2">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#5C1D27]">
                  <Lock className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Existing Active Holder</span>
                </div>
                <span className="text-[11px] font-mono text-gray-500">
                  {activeHolder.orderNumber}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase font-medium">Customer</span>
                  <span className="font-semibold text-gray-800">{activeHolder.customerName}</span>
                  <span className="block text-gray-500 text-[11px]">{activeHolder.phone}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase font-medium">Hold Status</span>
                  <span className="font-semibold text-amber-800 capitalize">
                    {activeHolder.status.replace('_', ' ')}
                  </span>
                  {activeHolder.holdExpiresAt && (
                    <span className="block text-[11px] text-rose-700">
                      Expires: {new Date(activeHolder.holdExpiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({new Date(activeHolder.holdExpiresAt).toLocaleDateString()})
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#E3D9CC] rounded-xl p-4 text-xs text-gray-600">
              <p className="font-medium text-gray-800">Showroom Sold Record</p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                This item was billed directly at the showroom counter. It has been marked sold and taken off the inventory floor.
              </p>
            </div>
          )}

          {/* Attempted Action Summary */}
          {attemptedBy && (
            <div className="text-xs bg-[#FAF5EE] border border-dashed border-[#C5A059] p-3 rounded-xl text-[#4A3F39]">
              <span className="font-bold text-[#7A5B20] uppercase text-[10px] block mb-0.5">
                Attempted Customer Request
              </span>
              <p>
                Incoming request by <strong>{attemptedBy.customerName}</strong> ({attemptedBy.phone}) was stopped to protect the active client hold.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-[#F0EAE1] px-6 py-4 border-t border-[#E3D9CC] flex items-center justify-between">
          <span className="text-[11px] text-gray-500 italic">
            Demo Safeguard Engine active • Zero duplicate risk
          </span>
          <button
            onClick={() => setConflictModalData(null)}
            className="px-5 py-2 rounded-xl bg-[#5C1D27] hover:bg-[#44131B] text-white font-medium text-xs shadow transition-colors flex items-center gap-1.5"
          >
            <span>Acknowledge & Maintain Existing Hold</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
