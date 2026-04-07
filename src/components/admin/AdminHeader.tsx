import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, LogOut, Settings, Plus, Upload, Download, ChevronDown, ArrowLeft, Calendar1 } from 'lucide-react';

interface AdminHeaderProps {
  onAddStaff: () => void;
  onImportExcel: () => void;
  onExportExcel: () => void;
  onAddHoliday: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onAddStaff, onImportExcel, onExportExcel, onAddHoliday }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b sticky top-0 z-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Calendar className="text-blue-600" size={28} />
          <h1 className="text-xl font-semibold text-gray-800">AMS Admin</h1>
          <div className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
            Dashboard
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm"
            >
              <Settings size={18} />
              Manage
              <ChevronDown size={16} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
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
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors text-gray-700"
                  >
                    <Plus size={16} />
                    Add New Staff
                  </button>
                  <button
                    onClick={() => {
                      onImportExcel();
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors text-gray-700"
                  >
                    <Upload size={16} />
                    Import Excel
                  </button>
                  <button
                    onClick={() => {
                      onExportExcel();
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors text-gray-700"
                  >
                    <Download size={16} />
                    Export Excel
                  </button>
                  <button
                    onClick={() => {
                      onAddHoliday();
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors text-gray-700"
                  >
                    <Calendar1 size={16} />
                    Add Holiday
                  </button>
                </div>
              </>
            )}
          </div>
          
          {/* Logout Button - Gray styled */}
          <button 
            onClick={() => { 
              localStorage.clear(); 
              navigate('/'); 
            }} 
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;