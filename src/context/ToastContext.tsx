import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (title: string, message?: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((title: string, message?: string, type: ToastType = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          let Icon = Info;
          let borderClass = 'border-stone-200';
          let iconColor = 'text-stone-700';

          if (toast.type === 'success') {
            Icon = CheckCircle2;
            borderClass = 'border-emerald-200 bg-emerald-50/90';
            iconColor = 'text-emerald-700';
          } else if (toast.type === 'error') {
            Icon = AlertCircle;
            borderClass = 'border-rose-200 bg-rose-50/90';
            iconColor = 'text-rose-700';
          } else if (toast.type === 'warning') {
            Icon = AlertTriangle;
            borderClass = 'border-amber-200 bg-amber-50/90';
            iconColor = 'text-amber-700';
          } else {
            borderClass = 'border-stone-200 bg-white/95';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-3.5 rounded-lg border shadow-sm backdrop-blur-sm transition-all duration-200 flex items-start gap-3 ${borderClass}`}
            >
              <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${iconColor}`} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-stone-900 leading-tight">{toast.title}</div>
                {toast.message && <div className="text-[11px] text-stone-600 mt-0.5 leading-snug">{toast.message}</div>}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-stone-400 hover:text-stone-700 transition-colors p-0.5"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
