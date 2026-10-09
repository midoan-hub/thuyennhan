import React from 'react';
import { CheckCircle2, Coins, Flame, Award, Sparkles, Check } from 'lucide-react';

export interface ToastInfo {
  id: string;
  message: string;
  type: 'coins' | 'badge' | 'streak' | 'success' | 'info';
}

interface ToastNotificationProps {
  toasts: ToastInfo[];
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-18 right-4 z-50 flex flex-col gap-2 max-w-xs w-full pointer-events-none">
      {toasts.map(toast => {
        let icon = <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />;
        let bgClass = 'bg-white';

        if (toast.type === 'coins') {
          icon = <Coins className="w-4 h-4 text-amber-600 fill-amber-300 stroke-[2.2]" />;
          bgClass = 'bg-yellow-50';
        } else if (toast.type === 'badge') {
          icon = <Award className="w-4 h-4 text-purple-700 stroke-[2.2]" />;
          bgClass = 'bg-purple-50';
        } else if (toast.type === 'streak') {
          icon = <Flame className="w-4 h-4 text-orange-600 fill-orange-400 stroke-[2.2]" />;
          bgClass = 'bg-orange-50';
        }

        return (
          <div
            key={toast.id}
            onClick={() => onDismiss(toast.id)}
            className={`pointer-events-auto ${bgClass} p-3 rounded-2xl border-2 border-stone-850 shadow-[4px_4px_0px_0px_#292524] flex items-center gap-2.5 transition-all animate-in fade-in slide-in-from-right-4 duration-200 cursor-pointer select-none`}
          >
            <div className="shrink-0">{icon}</div>
            <p className="text-xs font-sketch font-bold text-stone-900 flex-1 leading-snug">
              {toast.message}
            </p>
          </div>
        );
      })}
    </div>
  );
};
