import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Check, X, AlertCircle, Edit2, CheckCircle, Clock, XCircle } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import './StatusUpdateDropdown.css';

interface StatusUpdateDropdownProps {
  recordId: string;
  currentStatus: string;
  isAdmin: boolean;
  isUpdating: boolean;
  showDropdown: boolean;
  onStatusClick: (recordId: string) => void;
  onStatusConfirm: (recordId: string, newStatus: string) => void;
}

const STATUS_OPTIONS = [
  { value: 'Present', icon: CheckCircle, color: 'text-green-600 hover:bg-green-50' },
  { value: 'Half Leave', icon: Clock, color: 'text-amber-600 hover:bg-amber-50' },
  { value: 'Leave', icon: XCircle, color: 'text-red-600 hover:bg-red-50' },
  { value: 'Absence', icon: XCircle, color: 'text-gray-600 hover:bg-gray-50' }
];

const DROPDOWN_CONFIG = { height: 235, width: 220, padding: 10 };

export const StatusUpdateDropdown: React.FC<StatusUpdateDropdownProps> = ({
  recordId, currentStatus, isAdmin, isUpdating, showDropdown,
  onStatusClick, onStatusConfirm,
}) => {
  const [modal, setModal] = useState<{ show: boolean; status: string | null }>({ show: false, status: null });
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0 });
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Position dropdown
  useLayoutEffect(() => {
    if (!showDropdown || !buttonRef.current) return;
    
    const updatePosition = () => {
      const rect = buttonRef.current!.getBoundingClientRect();
      const { height, width, padding } = DROPDOWN_CONFIG;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      const top = spaceBelow < height + padding && spaceAbove >= height + padding 
        ? rect.top - height 
        : spaceBelow < height + padding 
          ? Math.max(padding, window.innerHeight - height - padding)
          : rect.bottom;
      
      const left = Math.min(Math.max(rect.left, padding), window.innerWidth - width - padding);
      
      setDropdownCoords({ top, left });
      requestAnimationFrame(() => setDropdownVisible(true));
    };

    setDropdownVisible(false);
    const timeoutId = setTimeout(updatePosition, 0);
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [showDropdown]);

  // Handle click outside
  useEffect(() => {
    if (!showDropdown) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        onStatusClick(recordId);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown, recordId, onStatusClick]);

  const handleSelect = (status: string) => {
    if (status === currentStatus) {
      onStatusClick(recordId);
      return;
    }
    setModal({ show: true, status });
  };

  const closeModal = (confirm: boolean) => {
    if (confirm && modal.status) onStatusConfirm(recordId, modal.status);
    setModal({ show: false, status: null });
    if (!confirm) onStatusClick(recordId);
  };

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modal.show) closeModal(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [modal.show]);

  if (!isAdmin) return <StatusBadge status={currentStatus} />;

  return (
    <>
      <div className="relative inline-flex items-center gap-2" ref={buttonRef}>
        <div className="min-w-[100px]">
          <StatusBadge status={currentStatus} />
        </div>
        
        <button
          onClick={() => onStatusClick(recordId)}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
        >
          <Edit2 size={14} className="text-gray-500 hover:text-blue-600" />
        </button>
        
        {showDropdown && (
          <div 
            ref={dropdownRef}
            className={`dropdown-container ${dropdownVisible ? 'visible' : ''}`}
            style={{ top: dropdownCoords.top, left: dropdownCoords.left, width: DROPDOWN_CONFIG.width }}
          >
            <div className="p-3 border-b bg-gray-50">
              <p className="text-xs font-semibold text-gray-700">Change Status</p>
            </div>
            
            <div className="py-1">
              {STATUS_OPTIONS.map(({ value: status, icon: Icon, color }) => {
                const isCurrent = status === currentStatus;
                return (
                  <button
                    key={status}
                    onClick={() => handleSelect(status)}
                    disabled={isUpdating || isCurrent}
                    className={`w-full text-left px-4 py-2.5 transition-colors ${
                      !isCurrent && !isUpdating ? color : ''
                    } ${isCurrent ? 'bg-gray-50 cursor-default' : ''} ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon size={16} className={!isCurrent && !isUpdating ? color.split(' ')[0] : 'text-gray-400'} />
                        <span className={`text-sm font-medium ${isCurrent ? 'text-gray-900' : 'text-gray-700'}`}>
                          {status}
                        </span>
                      </div>
                      {isCurrent && (
                        <div className="flex items-center gap-1">
                          <Check size={14} className="text-green-600" />
                          <span className="text-xs text-gray-500">Current</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        
        {isUpdating && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded">
            <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {modal.show && modal.status && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => closeModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-5 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <AlertCircle size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Confirm Status Change</h3>
                  <p className="text-sm text-gray-500">Update attendance status</p>
                </div>
              </div>
              <button onClick={() => closeModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-3">You are about to change:</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-700">Current:</span>
                    <StatusBadge status={currentStatus} />
                  </div>
                  <span className="text-gray-400">→</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-700">New:</span>
                    <StatusBadge status={modal.status} />
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-amber-800 flex items-center gap-2">
                  <AlertCircle size={14} />
                  This change will affect attendance records and reports
                </p>
              </div>
              
              <div className="flex gap-3">
                <button onClick={() => closeModal(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={() => closeModal(true)} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2">
                  <Check size={18} />
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};