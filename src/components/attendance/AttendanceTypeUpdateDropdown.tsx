import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Check, X, AlertCircle, Edit2 } from 'lucide-react';
import { AttendanceTypeBadge } from './AttendanceTypeBadge';
import './StatusUpdateDropdown.css';

interface AttendanceTypeUpdateDropdownProps {
  recordId: string;
  currentType: string | undefined;
  isAdmin: boolean;
  isUpdating: boolean;
  showDropdown: boolean;
  availableTypes: string[];
  staffId?: string | number;
  onTypeClick: (recordId: string) => void;
  onTypeConfirm: (recordId: string, newType: string) => void;
}

const DROPDOWN_CONFIG = { height: 400, width: 280, padding: 10 };

// Helper: Get gender from staff ID (25-xxx = male, 26-xxx = female)
const getGender = (staffId?: string | number): 'male' | 'female' | null => {
  const id = String(staffId || '');
  if (id.startsWith('25-')) return 'male';
  if (id.startsWith('26-')) return 'female';
  return null;
};

// Helper: Filter types based on gender
const filterTypes = (types: string[], staffId?: string | number) => {
  const gender = getGender(staffId);
  if (gender === 'male') return types.filter(t => !['maternity leave', 'maternity'].includes(t.toLowerCase()));
  if (gender === 'female') return types.filter(t => !['paternity leave', 'paternity'].includes(t.toLowerCase()));
  return types;
};

export const AttendanceTypeUpdateDropdown: React.FC<AttendanceTypeUpdateDropdownProps> = ({
  recordId, currentType, isAdmin, isUpdating, showDropdown, availableTypes, staffId,
  onTypeClick, onTypeConfirm,
}) => {
  const [modal, setModal] = useState<{ show: boolean; type: string | null }>({ show: false, type: null });
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0 });
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredTypes = filterTypes(availableTypes, staffId);
  const workTypes = filteredTypes.filter(t => ['WFO', 'WFH'].includes(t));
  const leaveTypes = filteredTypes.filter(t => !['WFO', 'WFH'].includes(t));

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
        onTypeClick(recordId);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown, recordId, onTypeClick]);

  const handleSelect = (type: string) => {
    if (type === currentType) {
      onTypeClick(recordId);
      return;
    }
    setModal({ show: true, type });
  };

  const closeModal = (confirm: boolean) => {
    if (confirm && modal.type) onTypeConfirm(recordId, modal.type);
    setModal({ show: false, type: null });
    if (!confirm) onTypeClick(recordId);
  };

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modal.show) closeModal(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [modal.show]);

  if (!isAdmin) return <AttendanceTypeBadge type={currentType || '-'} />;

  return (
    <>
      <div className="relative inline-flex items-center gap-2" ref={buttonRef}>
        <div className="min-w-[120px]">
          <AttendanceTypeBadge type={currentType || '-'} />
        </div>
        
        <button
          onClick={() => onTypeClick(recordId)}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
          disabled={filteredTypes.length === 0}
        >
          <Edit2 size={14} className={filteredTypes.length === 0 ? 'text-gray-300' : 'text-gray-500 hover:text-blue-600'} />
        </button>
        
        {showDropdown && filteredTypes.length > 0 && (
          <div 
            ref={dropdownRef}
            className={`dropdown-container ${dropdownVisible ? 'visible' : ''}`}
            style={{ top: dropdownCoords.top, left: dropdownCoords.left, width: DROPDOWN_CONFIG.width }}
          >
            <div className="p-3 border-b bg-gray-50 sticky top-0">
              <p className="text-xs font-semibold text-gray-700">Change Attendance Type</p>
            </div>
            
            <div className="py-1 max-h-[360px] overflow-y-auto">
              {workTypes.length > 0 && (
                <>
                  <div className="px-4 py-1.5">
                    <p className="text-xs font-semibold text-gray-400">Work Type</p>
                  </div>
                  {workTypes.map(type => (
                    <TypeOption key={type} type={type} currentType={currentType} isUpdating={isUpdating} onSelect={handleSelect} />
                  ))}
                </>
              )}
              
              {leaveTypes.length > 0 && (
                <>
                  <div className="px-4 py-1.5">
                    <p className="text-xs font-semibold text-gray-400">Leave Type</p>
                  </div>
                  {leaveTypes.map(type => (
                    <TypeOption key={type} type={type} currentType={currentType} isUpdating={isUpdating} onSelect={handleSelect} />
                  ))}
                </>
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

      {/* Confirmation Modal */}
      {modal.show && modal.type && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => closeModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-5 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <AlertCircle size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Confirm Type Change</h3>
                  <p className="text-sm text-gray-500">Update attendance type</p>
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
                    <AttendanceTypeBadge type={currentType || '-'} />
                  </div>
                  <span className="text-gray-400">→</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-700">New:</span>
                    <AttendanceTypeBadge type={modal.type} />
                  </div>
                </div>
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

// Type option component
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
      className={`w-full text-left px-4 py-2.5 transition-colors ${!isCurrent && !isUpdating ? 'hover:bg-gray-50' : ''} ${isCurrent ? 'bg-gray-50 cursor-default' : ''}`}
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