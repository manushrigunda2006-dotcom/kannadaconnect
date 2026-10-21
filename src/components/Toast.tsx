import React from 'react';
import type { ToastMessage } from '../types';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0 pointer-events-none"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border text-sm transition-all animate-in slide-in-from-bottom-3 duration-200 ${
              isSuccess
                ? 'bg-emerald-900 text-emerald-50 border-emerald-700'
                : isWarning
                ? 'bg-amber-900 text-amber-50 border-amber-700'
                : 'bg-stone-900 text-stone-50 border-stone-700'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-300" />}
              {isWarning && <AlertCircle className="w-5 h-5 text-amber-300" />}
              {!isSuccess && !isWarning && <Info className="w-5 h-5 text-sky-300" />}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{toast.title}</p>
              <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="shrink-0 p-1 rounded-md hover:bg-white/10 transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4 opacity-75 hover:opacity-100" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
