import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  action?: string;
  actionLabel?: string; // New: custom label for the action (e.g., "Added", "Updated", "Approved")
  actionColor?: string;
  customMessage?: string; // New: completely custom message instead of auto-generated
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  action,
  actionLabel,
  actionColor = 'emerald',
  customMessage,
}) => {
  if (!isOpen) return null;

  const getActionColorClasses = () => {
    switch (actionColor) {
      case 'emerald':
        return 'bg-emerald-500 shadow-emerald-200';
      case 'blue':
        return 'bg-blue-500 shadow-blue-200';
      case 'green':
        return 'bg-green-500 shadow-green-200';
      case 'rose':
        return 'bg-rose-500 shadow-rose-200';
      default:
        return 'bg-emerald-500 shadow-emerald-200';
    }
  };

  // Generate default message if not provided
  const getDefaultMessage = () => {
    if (customMessage) return customMessage;
    if (message) return message;
    if (action && actionLabel) {
      return `The item has been successfully ${actionLabel.toLowerCase()}.`;
    }
    return undefined;
  };

  const displayMessage = getDefaultMessage();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-emerald-900/20 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xs p-8 text-center animate-in zoom-in slide-in-from-bottom-4 duration-300">
        <div className={`mx-auto w-20 h-20 ${getActionColorClasses()} rounded-full flex items-center justify-center mb-6 shadow-lg`}>
          <CheckCircle size={48} className="text-white" />
        </div>
        
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h2>
        
        {displayMessage && (
          <p className="text-slate-500 text-sm mt-2 font-medium">{displayMessage}</p>
        )}
        
        {action && actionLabel && !displayMessage && (
          <p className="text-slate-500 text-sm mt-2 font-medium">
            The request has been successfully{' '}
            <span className={`text-${actionColor}-600 font-bold uppercase`}>{actionLabel}</span>.
          </p>
        )}
        
        <button
          onClick={onClose}
          className="mt-8 w-full py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg"
        >
          Got it
        </button>
      </div>
    </div>
  );
};