import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus, Upload, Download, Calendar1, ChevronDown, ChevronRight, LogOut, User, Settings, X, AlertCircle, LayoutDashboard } from 'lucide-react';

// Logout Confirmation Modal Component
const LogoutConfirmModal = ({ 
  isOpen, 
  onConfirm, 
  onCancel 
}: { 
  isOpen: boolean; 
  onConfirm: () => void; 
  onCancel: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <LogOut size={20} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Confirm Logout</h3>
              <p className="text-sm text-gray-500">Sign out from your account</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-5">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-800 font-medium mb-1">Are you sure you want to logout?</p>
                <p className="text-xs text-amber-700">
                  You will need to login again to access your account and attendance records.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Stay Logged In
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AdminHeaderProps {
  onAddStaff: () => void;
  onImportExcel: () => void;
  onExportExcel: () => void;
  onAddHoliday: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onAddStaff, onImportExcel, onExportExcel, onAddHoliday }) => {
  const navigate = useNavigate();
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const menuDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuDropdownRef.current && !menuDropdownRef.current.contains(event.target as Node)) {
        setShowMenuDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    setShowLogoutModal(false);
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b shadow-sm flex-shrink-0">
      <div className="w-full px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Calendar className="text-blue-600" size={28} />
          <h1 className="text-xl font-semibold text-gray-800">AMS Admin</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Single Menu Dropdown - Combines Navigation and Management */}
          <div ref={menuDropdownRef} className="relative">
            <button
              onClick={() => setShowMenuDropdown(!showMenuDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
            >
              <User size={16} />
              Menu
              {showMenuDropdown ? (
                <ChevronRight size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>

            {showMenuDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                {/* Navigation Section */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      navigate('/dashboard');
                      setShowMenuDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                  >
                    <LayoutDashboard size={16} className="text-green-600" />
                    <span>Dashboard</span>
                    <span className="ml-auto text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">Home</span>
                  </button>
                </div>

                <hr className="my-1" />

                {/* Management Section */}
                <div className="py-1">
                  <div className="px-4 py-1 text-xs text-gray-500 uppercase tracking-wider">Management</div>
                  
                  <button
                    onClick={() => {
                      onAddStaff();
                      setShowMenuDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                  >
                    <Plus size={16} className="text-green-600" />
                    <span>Add New Staff</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      onImportExcel();
                      setShowMenuDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                  >
                    <Upload size={16} className="text-blue-600" />
                    <span>Import Excel</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      onExportExcel();
                      setShowMenuDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                  >
                    <Download size={16} className="text-purple-600" />
                    <span>Export Excel</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      onAddHoliday();
                      setShowMenuDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                  >
                    <Calendar1 size={16} className="text-orange-600" />
                    <span>Add Holiday</span>
                  </button>
                </div>

                <hr className="my-1" />

                {/* Logout Section */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowMenuDropdown(false);
                      setShowLogoutModal(true);
                    }}
                    className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <LogoutConfirmModal 
        isOpen={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </header>
  );
};

export default AdminHeader;