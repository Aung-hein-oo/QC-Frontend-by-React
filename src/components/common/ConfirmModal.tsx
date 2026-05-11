import React from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export type ConfirmModalType = 'success' | 'error' | 'warning' | 'info';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  type?: ConfirmModalType;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  isLoading?: boolean;
}

const getTypeStyles = (type: ConfirmModalType) => {
  switch (type) {
    case 'success':
      return {
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
        buttonBg: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200',
        icon: CheckCircle,
      };
    case 'error':
      return {
        iconBg: 'bg-rose-100',
        iconColor: 'text-rose-600',
        buttonBg: 'bg-rose-600 hover:bg-rose-700 shadow-rose-200',
        icon: XCircle,
      };
    case 'warning':
      return {
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        buttonBg: 'bg-amber-600 hover:bg-amber-700 shadow-amber-200',
        icon: AlertTriangle,
      };
    case 'info':
      return {
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        buttonBg: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200',
        icon: CheckCircle,
      };
    default:
      return {
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
        buttonBg: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200',
        icon: CheckCircle,
      };
  }
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type = 'info',
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  showCancel = true,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const styles = getTypeStyles(type);
  const Icon = styles.icon;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-black/20 pt-20 z-50">
      <div className="bg-white rounded-xl shadow-xl w-80 p-5 animate-fade-in text-center">
        <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${styles.iconBg} ${styles.iconColor}`}>
          <Icon size={32} />
        </div>
        
        <h2 className="text-lg font-black text-slate-800 text-center">{title}</h2>
        
        {message && (
          <p className="text-slate-500 text-sm mt-2 mb-6 italic leading-relaxed text-center">
            {message}
          </p>
        )}
        
        <div className="grid grid-cols-2 gap-2">
          {showCancel && (
            <button
              onClick={onClose}
              disabled={isLoading}
              className="py-3 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-colors uppercase text-[11px] tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`py-3 text-white font-black rounded-2xl shadow-lg transition-all active:scale-95 uppercase text-[11px] tracking-wider disabled:opacity-50 disabled:cursor-not-allowed ${styles.buttonBg}`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};