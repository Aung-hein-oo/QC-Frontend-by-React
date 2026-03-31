import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, Plus, Upload, Download, ChevronDown } from 'lucide-react';

interface ActionsBarProps {
  onAddStaff: () => void;
  onImportExcel: () => void;
  onExportExcel: () => void;
}

const ActionsBar: React.FC<ActionsBarProps> = ({ onAddStaff, onImportExcel, onExportExcel }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Staff Management</h2>
          <p className="text-blue-700 mt-1">Manage all staff members and their information</p>
        </div>
        
        <div className="flex gap-3">
          {/* Back Button */}
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          
          {/* Dropdown Button with Management Icon */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Settings size={18} />
              Manage
              <ChevronDown size={16} />
            </button>
            
            {showDropdown && (
              <>
                <div 
                  className="fixed inset-0" 
                  style={{ zIndex: 25 }}
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-30 py-1">
                  <button
                    onClick={() => {
                      onAddStaff();
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors"
                  >
                    <Plus size={16} />
                    Add New Staff
                  </button>
                  <button
                    onClick={() => {
                      onImportExcel();
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors"
                  >
                    <Upload size={16} />
                    Import Excel
                  </button>
                  <button
                    onClick={() => {
                      onExportExcel();
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors"
                  >
                    <Download size={16} />
                    Export Excel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionsBar;