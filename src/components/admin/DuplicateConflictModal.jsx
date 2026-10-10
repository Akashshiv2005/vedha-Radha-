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
      <div className="bg-white border border-gray-200 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-admin-error text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[12px] font-admin-body font-medium bg-white/20 px-2.5 py-0.5 rounded text-white inline-block">
                Showroom Duplicate-Sale Safeguard
              </span>
              <h3 className="text-[22px] font-admin-heading font-semibold text-white mt-1 leading-tight">
                Duplicate Booking Prevented
              </h3>
            </div>
          </div>
          <button 
            onClick={() => setConflictModalData(null)}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-admin-main">
          {/* Safeguard Alert Notice */}
          <div className="bg-admin-error-bg border border-admin-error/30 p-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-admin-error flex-shrink-0 mt-0.5" />
            <div className="text-[13px] font-admin-body leading-relaxed text-admin-main">
              <p className="font-semibold text-[14px] mb-1 text-admin-error font-admin-body">{reason}</p>
              <p>
                Because this is a <strong className="underline">1-of-1 Handcrafted Unique Piece</strong>, our system strictly blocks parallel online reservations or conflicting showroom claims to prevent duplicate sales.
              </p>
            </div>
          </div>

          {/* Product Snapshot */}
          <div className="bg-[#F5F6F8] border border-gray-200 rounded-xl p-3.5 flex items-center gap-4">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-16 h-16 object-cover rounded-lg border border-gray-200 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-admin-mono px-2 py-0.5 bg-admin-primary text-white rounded font-medium">
                  {product.sku}
                </span>
                <span className="text-[12px] font-medium text-admin-error bg-admin-error-bg px-2 py-0.5 rounded capitalize font-admin-body">
                  Status: {product.status.replace('_', ' ')}
                </span>
              </div>
              <h4 className="text-[14px] font-semibold text-admin-main truncate mt-1 font-admin-body">
                {product.name}
              </h4>
              <p className="text-[14px] text-gray-700 font-admin-heading font-semibold mt-0.5">
                {product.price} • {product.grossWeight}
              </p>
            </div>
          </div>

          {/* Active Hold Details (if reserved) */}
          {activeHolder ? (
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-2">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-admin-primary font-admin-body">
                  <Lock className="w-3.5 h-3.5 text-admin-gold" />
                  <span>Existing Active Holder</span>
                </div>
                <span className="text-[12px] font-admin-mono text-gray-600 font-medium">
                  {activeHolder.orderNumber}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[13px] font-admin-body pt-1">
                <div>
                  <span className="text-gray-500 block text-[12px] font-medium font-admin-body">Customer</span>
                  <span className="font-semibold text-admin-main">{activeHolder.customerName}</span>
                  <span className="block text-gray-500 text-[12px] font-admin-body">{activeHolder.phone}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[12px] font-medium font-admin-body">Hold Status</span>
                  <span className="font-semibold text-admin-pending capitalize">
                    {activeHolder.status.replace('_', ' ')}
                  </span>
                  {activeHolder.holdExpiresAt && (
                    <span className="block text-[12px] text-admin-error font-medium font-admin-mono">
                      Expires: {new Date(activeHolder.holdExpiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({new Date(activeHolder.holdExpiresAt).toLocaleDateString()})
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-[13px] font-admin-body text-gray-600">
              <p className="font-semibold text-admin-main">Showroom Sold Record</p>
              <p className="text-[12px] text-gray-500 mt-0.5">
                This item was billed directly at the showroom counter. It has been marked sold and taken off the inventory floor.
              </p>
            </div>
          )}

          {/* Attempted Action Summary */}
          {attemptedBy && (
            <div className="text-[13px] font-admin-body bg-[#FFF5DF] border border-admin-pending/30 p-3 rounded-xl text-admin-main">
              <span className="font-semibold text-admin-pending text-[12px] block mb-0.5 font-admin-body">
                Attempted Customer Request
              </span>
              <p>
                Incoming request by <strong>{attemptedBy.customerName}</strong> ({attemptedBy.phone}) was stopped to protect the active client hold.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-[#F5F6F8] px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <span className="text-[12px] text-gray-500 font-admin-body italic">
            Safeguard Engine Active • Zero duplicate risk
          </span>
          <button
            onClick={() => setConflictModalData(null)}
            className="px-5 py-2.5 rounded-xl bg-admin-primary hover:bg-admin-primary-hover text-white font-semibold text-[14px] font-admin-body shadow transition flex items-center gap-1.5"
          >
            <span>Maintain Existing Hold</span>
            <ArrowRight className="w-3.5 h-3.5 text-admin-gold" />
          </button>
        </div>
      </div>
    </div>
  );
}
