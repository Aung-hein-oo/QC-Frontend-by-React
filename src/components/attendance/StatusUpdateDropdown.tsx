import React, { useState, useRef, useEffect } from 'react';
import { Check, X, AlertCircle, Edit2, CheckCircle, Clock, XCircle } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

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
  { value: 'Present', icon: CheckCircle, color: 'green' },
  { value: 'Half Leave', icon: Clock, color: 'amber' },
  { value: 'Leave', icon: XCircle, color: 'red' },
  { value: 'Absence', icon: XCircle, color: 'gray' }
];

const DROPDOWN_CONFIG = {
  height: 235,
  width: 220,
  padding: 10
};

export const StatusUpdateDropdown: React.FC<StatusUpdateDropdownProps> = ({
  recordId,
  currentStatus,
  isAdmin,
  isUpdating,
  showDropdown,
  onStatusClick,
  onStatusConfirm,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updateDropdownPosition = () => {
    if (!showDropdown || !buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const { height: dropdownHeight, width: dropdownWidth, padding } = DROPDOWN_CONFIG;
    const { innerHeight: viewportHeight, innerWidth: viewportWidth } = window;
    
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    
    // Calculate vertical position
    let top = rect.bottom;
    if (spaceBelow < dropdownHeight + padding && spaceAbove >= dropdownHeight + padding) {
      top = rect.top - dropdownHeight;
    } else if (spaceBelow < dropdownHeight + padding) {
      top = Math.max(padding, viewportHeight - dropdownHeight - padding);
    }
    
    // Calculate horizontal position
    let left = Math.min(
      Math.max(rect.left, padding),
      viewportWidth - dropdownWidth - padding
    );
    
    setDropdownCoords({ top, left });
  };

  useEffect(() => {
    if (showDropdown) {
      updateDropdownPosition();
      window.addEventListener('scroll', updateDropdownPosition, true);
      window.addEventListener('resize', updateDropdownPosition);
      return () => {
        window.removeEventListener('scroll', updateDropdownPosition, true);
        window.removeEventListener('resize', updateDropdownPosition);
      };
    }
  }, [showDropdown]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDropdown && dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && 
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        onStatusClick(recordId);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown, recordId, onStatusClick]);

  const handleStatusSelect = (status: string) => {
    if (status === currentStatus) {
      onStatusClick(recordId);
      return;
    }
    setSelectedStatus(status);
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    if (selectedStatus) {
      onStatusConfirm(recordId, selectedStatus);
      setShowConfirmModal(false);
      setSelectedStatus(null);
    }
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
    setSelectedStatus(null);
    onStatusClick(recordId);
  };

  if (!isAdmin) return <StatusBadge status={currentStatus} />;

  return (
    <>
      <div className="relative" ref={buttonRef}>
        <div className="flex items-center gap-2">
          <StatusBadge status={currentStatus} />
          <button
            onClick={() => onStatusClick(recordId)}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            title="Change status"
          >
            <Edit2 size={14} className="text-gray-500 hover:text-blue-600" />
          </button>
        </div>
        
        {showDropdown && (
          <div 
            ref={dropdownRef}
            className="fixed z-50 bg-white rounded-lg shadow-xl border overflow-hidden animate-in fade-in zoom-in-95 duration-100"
            style={{ top: dropdownCoords.top, left: dropdownCoords.left, width: DROPDOWN_CONFIG.width }}
          >
            <div className="p-3 border-b bg-gradient-to-r from-gray-50 to-white">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Change Status</p>
            </div>
            <div className="py-1">
              {STATUS_OPTIONS.map(({ value: status, icon: Icon, color }) => {
                const isCurrent = status === currentStatus;
                return (
                  <button
                    key={status}
                    onClick={() => handleStatusSelect(status)}
                    disabled={isUpdating || isCurrent}
                    className={`w-full text-left px-4 py-2.5 transition-all duration-150 group ${
                      !isCurrent && !isUpdating ? `hover:bg-${color}-50 hover:pl-5` : ''
                    } ${isCurrent ? 'bg-gray-50 cursor-default' : ''} ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon size={16} className={`text-${color}-600 transition-transform group-hover:scale-110`} />
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
      {showConfirmModal && selectedStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <AlertCircle size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Confirm Status Change</h3>
                  <p className="text-sm text-gray-500">Update attendance status</p>
                </div>
              </div>
              <button onClick={handleCancel} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-5">
              <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-3">You are about to change:</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">Current:</span>
                    <StatusBadge status={currentStatus} />
                  </div>
                  <span className="text-gray-400 text-xl">→</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">New:</span>
                    <StatusBadge status={selectedStatus} />
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
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
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