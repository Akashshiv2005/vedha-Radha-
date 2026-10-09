import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  X 
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useAdmin();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map(toast => {
        let borderClass = 'border-[#C5A059] bg-[#FAF7F2] text-[#2C2420]';
        let Icon = CheckCircle2;
        let iconColor = 'text-emerald-700';

        if (toast.type === 'error') {
          borderClass = 'border-rose-400 bg-[#FFF5F5] text-rose-950';
          Icon = XCircle;
          iconColor = 'text-rose-600';
        } else if (toast.type === 'warning') {
          borderClass = 'border-amber-400 bg-[#FFFBEB] text-amber-950';
          Icon = AlertTriangle;
          iconColor = 'text-amber-600';
        } else if (toast.type === 'info') {
          borderClass = 'border-sky-300 bg-[#F0F9FF] text-sky-950';
          Icon = Info;
          iconColor = 'text-sky-600';
        } else {
          borderClass = 'border-[#C5A059]/60 bg-[#FAF7F2] text-[#2C2420]';
          Icon = CheckCircle2;
          iconColor = 'text-[#5C1D27]';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto shadow-xl rounded-xl border p-4 transition-all duration-300 transform translate-y-0 opacity-100 flex items-start gap-3 relative overflow-hidden backdrop-blur-sm ${borderClass}`}
          >
            <div className={`mt-0.5 flex-shrink-0 ${iconColor}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 pr-4">
              <h4 className="text-xs font-bold uppercase tracking-wider font-sans mb-0.5">
                {toast.title}
              </h4>
              <p className="text-xs leading-relaxed text-opacity-90">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-700 p-1 rounded-md transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div 
              className="absolute bottom-0 left-0 h-0.5 bg-[#C5A059]/40 w-full animate-pulse" 
            />
          </div>
        );
      })}
    </div>
  );
}
