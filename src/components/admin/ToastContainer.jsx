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
        let borderClass = 'border-admin-success/40 bg-admin-success-bg text-admin-main';
        let Icon = CheckCircle2;
        let iconColor = 'text-admin-success';

        if (toast.type === 'error') {
          borderClass = 'border-admin-error/40 bg-admin-error-bg text-admin-main';
          Icon = XCircle;
          iconColor = 'text-admin-error';
        } else if (toast.type === 'warning') {
          borderClass = 'border-admin-pending/40 bg-admin-pending-bg text-admin-main';
          Icon = AlertTriangle;
          iconColor = 'text-admin-pending';
        } else if (toast.type === 'info') {
          borderClass = 'border-admin-info/40 bg-admin-info-bg text-admin-main';
          Icon = Info;
          iconColor = 'text-admin-info';
        } else {
          borderClass = 'border-admin-success/40 bg-admin-success-bg text-admin-main';
          Icon = CheckCircle2;
          iconColor = 'text-admin-success';
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
              <h4 className="text-[13px] font-semibold font-admin-body mb-0.5 text-admin-main">
                {toast.title}
              </h4>
              <p className="text-[12px] font-admin-body leading-relaxed text-admin-main/80">
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
              className="absolute bottom-0 left-0 h-0.5 bg-admin-gold/50 w-full animate-pulse" 
            />
          </div>
        );
      })}
    </div>
  );
}
