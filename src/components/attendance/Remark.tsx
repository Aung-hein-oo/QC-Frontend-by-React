import React, { useState, useEffect } from 'react';
import { Edit2, Loader2, X, AlertCircle } from 'lucide-react'; // Added AlertCircle

interface RemarkProps {
  recordId: string;
  isAdmin: boolean;
  isUpdating: boolean;
  staffId?: string | number;
  currentRemark?: string | null;
  onSave?: (reason: string) => void; // Added onSave prop to actually use the data
}

export const RemarkItem: React.FC<RemarkProps> = ({ 
  recordId, 
  isUpdating, 
  currentRemark,
  onSave
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null); // New error state

  useEffect(() => {
    if (isOpen) {
      setReason(currentRemark && currentRemark !== '-' ? currentRemark : "");
      setError(null); // Reset error when opening
    }
  }, [isOpen, currentRemark]);

  const handleConfirm = () => {
    const trimmedReason = reason.trim();
    
    if (!trimmedReason) {
      setError("Please fill a reason before saving.");
      return;
    }

    // If valid, clear error and proceed
    setError(null);
    if (onSave) onSave(trimmedReason);
    setIsOpen(false);
  };

  return (
    <>
      {/* 1. TRIGGER BUTTON */}
      <div className="flex justify-end items-center min-h-[32px] ml-auto">
        {isUpdating ? (
          <Loader2 size={14} className="animate-spin text-blue-500" />
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-blue-600"
            title="Edit remark"
          >
            <Edit2 size={14} />
          </button>
        )}
      </div>

      {/* 2. MODAL BOX OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 ">
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onKeyDown={(e) => e.key === 'Escape' && setIsOpen(false)}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-gray-800">Edit Remark</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for change / Remark
              </label>
              
              <textarea
                autoFocus
                rows={4}
                className={`w-full border rounded-lg p-3 text-sm outline-none transition-all ${
                  error 
                    ? "border-red-500 focus:ring-2 focus:ring-red-200" 
                    : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                }`}
                placeholder="Type your reason here..."
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError(null); // Clear error while typing
                }}
              />

              {/* IN-MODAL ERROR MESSAGE */}
              {error && (
                <div className="mt-3 flex items-center gap-2 text-red-600 text-sm animate-in slide-in-from-top-1">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};