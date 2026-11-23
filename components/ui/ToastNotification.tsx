'use client';

import React from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
}

interface ToastNotificationProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div 
      aria-live="polite" 
      aria-atomic="true"
      className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map(t => (
        <div
          key={t.id}
          role="status"
          className={`pointer-events-auto p-4 rounded-xl shadow-2xl border flex items-start space-x-3 transition-all ${
            t.type === 'success' 
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100' 
              : t.type === 'warning'
              ? 'bg-amber-950/90 border-amber-500/50 text-amber-100'
              : 'bg-indigo-950/90 border-indigo-500/50 text-indigo-100'
          }`}
        >
          {t.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />}
          {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />}
          {t.type === 'info' && <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" aria-hidden="true" />}

          <div className="flex-1 text-xs">
            <h4 className="font-bold">{t.title}</h4>
            <p className="mt-0.5 opacity-90">{t.message}</p>
          </div>

          <button
            type="button"
            onClick={() => onDismiss(t.id)}
            aria-label="Dismiss alert"
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
};
