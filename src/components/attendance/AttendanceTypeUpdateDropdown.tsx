import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Check, X, AlertCircle, Edit2, ChevronDown } from 'lucide-react';
import { AttendanceTypeBadge } from './AttendanceTypeBadge';
import './StatusUpdateDropdown.css'; // Reuse the same CSS

interface AttendanceTypeUpdateDropdownProps {
  recordId: string;
  currentType: string | undefined;
  isAdmin: boolean;
  isUpdating: boolean;
  showDropdown: boolean;
  availableTypes: string[];
  onTypeClick: (recordId: string) => void;
  onTypeConfirm: (recordId: string, newType: string) => void;
}

const DROPDOWN_CONFIG = { height: 400, width: 280, padding: 10 };

export const AttendanceTypeUpdateDropdown: React.FC<AttendanceTypeUpdateDropdownProps> = ({
  recordId,
  currentType,
  isAdmin,
  isUpdating,
  showDropdown,
  availableTypes,
  onTypeClick,
  onTypeConfirm,
}) => {
  const [modal, setModal] = useState<{ show: boolean; type: string | null }>({ show: false, type: null });
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0 });
  const [animation, setAnimation] = useState<'entering' | 'visible' | 'exiting'>('entering');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updateDropdownPosition = () => {
    if (!showDropdown || !buttonRef.current) return;
    
    requestAnimationFrame(() => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const { height, width, padding } = DROPDOWN_CONFIG;
      const { innerHeight, innerWidth } = window;
      
      const spaceBelow = innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const top = spaceBelow < height + padding && spaceAbove >= height + padding 
        ? rect.top - height 
        : spaceBelow < height + padding 
          ? Math.max(padding, innerHeight - height - padding)
          : rect.bottom;
      
      const left = Math.min(Math.max(rect.left, padding), innerWidth - width - padding);
      
      setDropdownCoords({ top, left });
      requestAnimationFrame(() => setDropdownVisible(true));
    });
  };

  useLayoutEffect(() => {
    if (showDropdown) {
      setDropdownVisible(false);
      const timeoutId = setTimeout(updateDropdownPosition, 0);
      window.addEventListener('scroll', updateDropdownPosition, true);
      window.addEventListener('resize', updateDropdownPosition);
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('scroll', updateDropdownPosition, true);
        window.removeEventListener('resize', updateDropdownPosition);
      };
    }
    setDropdownVisible(false);
  }, [showDropdown]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showDropdown && dropdownRef.current && !dropdownRef.current.contains(e.target as Node) && 
          buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        onTypeClick(recordId);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown, recordId, onTypeClick]);

  const handleTypeSelect = (type: string) => {
    if (type === currentType) {
      onTypeClick(recordId);
      return;
    }
    setModal({ show: true, type });
    setAnimation('entering');
    requestAnimationFrame(() => requestAnimationFrame(() => setAnimation('visible')));
  };

  const closeModal = (confirm = false) => {
    setAnimation('exiting');
    setTimeout(() => {
      if (confirm && modal.type) {
        onTypeConfirm(recordId, modal.type);
      }
      setModal({ show: false, type: null });
      setAnimation('entering');
      if (!confirm) onTypeClick(recordId);
    }, 200);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modal.show) closeModal(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [modal.show]);

  if (!isAdmin) return <AttendanceTypeBadge type={currentType || '-'} />;

  // Group types for better organization
  const workTypes = availableTypes.filter(t => t === 'WFO' || t === 'WFH');
  const leaveTypes = availableTypes.filter(t => t !== 'WFO' && t !== 'WFH');

  return (
    <>
      <div className="relative inline-flex items-center gap-2" ref={buttonRef}>
        <div className="min-w-[120px]">
          <AttendanceTypeBadge type={currentType || '-'} />
        </div>
        <button
          onClick={() => onTypeClick(recordId)}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors flex-shrink-0 cursor-pointer"
          title="Change type"
        >
          <Edit2 size={14} className="text-gray-500 hover:text-blue-600" />
        </button>
        
        {showDropdown && (
          <div 
            ref={dropdownRef}
            className={`dropdown-container ${dropdownVisible ? 'visible' : ''}`}
            style={{ top: dropdownCoords.top, left: dropdownCoords.left, width: DROPDOWN_CONFIG.width }}
          >
            <div className="p-3 border-b bg-gradient-to-r from-gray-50 to-white sticky top-0">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Change Attendance Type</p>
            </div>
            <div className="py-1 max-h-[360px] overflow-y-auto">
              {workTypes.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-1.5">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Work Type</p>
                  </div>
                  {workTypes.map(type => (
                    <TypeOption
                      key={type}
                      type={type}
                      currentType={currentType}
                      isUpdating={isUpdating}
                      onSelect={handleTypeSelect}
                    />
                  ))}
                </div>
              )}
              
              {leaveTypes.length > 0 && (
                <div>
                  <div className="px-4 py-1.5">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Leave Type</p>
                  </div>
                  {leaveTypes.map(type => (
                    <TypeOption
                      key={type}
                      type={type}
                      currentType={currentType}
                      isUpdating={isUpdating}
                      onSelect={handleTypeSelect}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {isUpdating && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded">
            <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
          </div>
        )}
      </div>

      {modal.show && modal.type && (
        <div className={`modal-container ${animation === 'visible' ? 'visible' : ''} ${animation === 'exiting' ? 'exiting' : ''}`}>
          <div className="modal-backdrop" onClick={() => closeModal(false)} />
          <div className="modal-content">
            <div className="flex justify-between items-center p-5 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <AlertCircle size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Confirm Type Change</h3>
                  <p className="text-sm text-gray-500">Update attendance type</p>
                </div>
              </div>
              <button onClick={() => closeModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-5">
              <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-3">You are about to change:</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">Current:</span>
                    <AttendanceTypeBadge type={currentType || '-'} />
                  </div>
                  <span className="text-gray-400 text-xl">→</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">New:</span>
                    <AttendanceTypeBadge type={modal.type} />
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
                <button onClick={() => closeModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
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

// Helper component for type options
const TypeOption: React.FC<{
  type: string;
  currentType: string | undefined;
  isUpdating: boolean;
  onSelect: (type: string) => void;
}> = ({ type, currentType, isUpdating, onSelect }) => {
  const isCurrent = type === currentType;
  
  return (
    <button
      onClick={() => onSelect(type)}
      disabled={isUpdating || isCurrent}
      className={`w-full text-left px-4 py-2.5 transition-all duration-150 group ${
        !isCurrent && !isUpdating ? 'hover:bg-gray-50' : ''
      } ${isCurrent ? 'bg-gray-50 cursor-default' : ''} ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="flex items-center justify-between">
        <AttendanceTypeBadge type={type} />
        {isCurrent && (
          <div className="flex items-center gap-1">
            <Check size={14} className="text-green-600" />
            <span className="text-xs text-gray-500">Current</span>
          </div>
        )}
      </div>
    </button>
  );
};