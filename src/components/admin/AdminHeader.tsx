// Update AdminHeader.tsx with better loading animation

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus, Upload, Calendar1, ChevronDown, ChevronRight, LogOut, User, X, AlertCircle, LayoutDashboard, Loader } from 'lucide-react';
import '../../assets/css/admin-header.css';

// Add these styles to the component or your global CSS
const loadingStyles = `
  @keyframes pulse-ring {
    0% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    100% {
      transform: scale(1.2);
      opacity: 0;
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  @keyframes spin-slow {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes bounce-dot {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-4px);
    }
  }

  @keyframes slide-in {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .loading-spinner-sm {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(59, 130, 246, 0.2);
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin-slow 0.8s linear infinite;
    position: relative;
  }

  .loading-spinner-sm::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    border: 2px solid transparent;
    border-top-color: #2563eb;
    opacity: 0.5;
    animation: spin-slow 1.2s linear infinite reverse;
  }

  .loading-pulse-sm {
    position: relative;
  }

  .loading-pulse-sm::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    background: rgba(59, 130, 246, 0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: pulse-ring 1.2s ease-out infinite;
  }

  .loading-shimmer-sm {
    background: linear-gradient(
      90deg,
      rgba(59, 130, 246, 0) 0%,
      rgba(59, 130, 246, 0.15) 50%,
      rgba(59, 130, 246, 0) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s ease-in-out infinite;
  }

  .loading-dots-sm {
    display: inline-flex;
    gap: 3px;
    margin-left: 4px;
  }

  .loading-dots-sm span {
    width: 3px;
    height: 3px;
    background-color: #3b82f6;
    border-radius: 50%;
    display: inline-block;
    animation: bounce-dot 0.6s ease-in-out infinite;
  }

  .loading-dots-sm span:nth-child(1) {
    animation-delay: 0s;
  }

  .loading-dots-sm span:nth-child(2) {
    animation-delay: 0.15s;
  }

  .loading-dots-sm span:nth-child(3) {
    animation-delay: 0.3s;
  }

  .loading-progress-bar {
    height: 2px;
    background: linear-gradient(90deg, #3b82f6, #60a5fa, #3b82f6);
    background-size: 200% 100%;
    animation: shimmer 1.5s ease-in-out infinite;
    border-radius: 2px;
    transition: width 0.3s ease;
  }
`;

// Inject styles if not already present
if (typeof document !== 'undefined') {
  if (!document.querySelector('#admin-loading-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'admin-loading-styles';
    styleSheet.textContent = loadingStyles;
    document.head.appendChild(styleSheet);
  }
}

// Loading toast component for staff import progress
const ImportLoadingToast = ({ progress }: { progress: number }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-5 duration-300">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden w-80">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="loading-spinner-sm"></div>
              <div className="loading-pulse-sm absolute inset-0"></div>
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <span className="font-semibold text-gray-800 text-sm">Importing Staff Data</span>
                <div className="loading-dots-sm">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Please wait while we process your file</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Processing</span>
              <span className="font-medium text-blue-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="loading-progress-bar h-full rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mt-3 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Reading Excel file...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading toast component for holiday import progress
const HolidayImportLoadingToast = ({ progress }: { progress: number }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-5 duration-300">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden w-80">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="loading-spinner-sm"></div>
              <div className="loading-pulse-sm absolute inset-0"></div>
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <span className="font-semibold text-gray-800 text-sm">Importing Holidays</span>
                <div className="loading-dots-sm">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Please wait while we process your holiday file</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Processing</span>
              <span className="font-medium text-orange-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="loading-progress-bar h-full rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mt-3 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
              <span>Reading Excel file...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  onAddHoliday: () => void;
  importing?: boolean;
  importProgress?: number;
  importingHoliday?: boolean;
  holidayImportProgress?: number;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  onAddStaff, 
  onImportExcel, 
  onAddHoliday,
  importing = false,
  importProgress = 0,
  importingHoliday = false,
  holidayImportProgress = 0
}) => {
  const navigate = useNavigate();
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const menuDropdownRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });

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

  // Update dropdown position when opened
  useEffect(() => {
    if (showMenuDropdown && menuButtonRef.current) {
      const rect = menuButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        right: window.innerWidth - rect.right
      });
    }
  }, [showMenuDropdown]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    setShowLogoutModal(false);
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-sm border-b shadow-sm flex-shrink-0 admin-header-fix">
        <div className="w-full px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="text-blue-600" size={28} />
            <h1 className="text-xl font-semibold text-gray-800">AMS Admin</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Single Menu Dropdown - Combines Navigation and Management */}
            <div ref={menuDropdownRef} className="relative admin-container-fix">
              <button
                ref={menuButtonRef}
                onClick={() => setShowMenuDropdown(!showMenuDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
                disabled={importing || importingHoliday}
              >
                <User size={16} />
                Menu
                {showMenuDropdown ? (
                  <ChevronRight size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>

              {showMenuDropdown && !importing && !importingHoliday && (
                <div 
                  className="admin-dropdown-fix dropdown-hardware-accelerated"
                  style={{
                    position: 'fixed',
                    top: `${dropdownPosition.top}px`,
                    right: `${dropdownPosition.right}px`,
                    width: '208px',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    overflow: 'hidden'
                  }}
                >
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
                      disabled={importing}
                      className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                    >
                      {importing ? (
                        <>
                          <div className="relative w-4 h-4 flex-shrink-0">
                            <div className="loading-spinner-sm"></div>
                            <div className="loading-pulse-sm absolute inset-0"></div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className="font-medium">Importing</span>
                              <div className="loading-dots-sm">
                                <span></span>
                                <span></span>
                                <span></span>
                              </div>
                            </div>
                            <div className="loading-shimmer-sm w-full h-0.5 rounded-full mt-1"></div>
                          </div>
                          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {importProgress}%
                          </span>
                        </>
                      ) : (
                        <>
                          <Upload size={16} className="text-blue-600" />
                          <span>Import Staff</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => {
                        onAddHoliday();
                        setShowMenuDropdown(false);
                      }}
                      disabled={importingHoliday}
                      className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                    >
                      {importingHoliday ? (
                        <>
                          <div className="relative w-4 h-4 flex-shrink-0">
                            <div className="loading-spinner-sm"></div>
                            <div className="loading-pulse-sm absolute inset-0"></div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className="font-medium">Importing Holidays</span>
                              <div className="loading-dots-sm">
                                <span></span>
                                <span></span>
                                <span></span>
                              </div>
                            </div>
                            <div className="loading-shimmer-sm w-full h-0.5 rounded-full mt-1"></div>
                          </div>
                          <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                            {holidayImportProgress}%
                          </span>
                        </>
                      ) : (
                        <>
                          <Calendar1 size={16} className="text-orange-600" />
                          <span>Add Holiday</span>
                        </>
                      )}
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

      {/* Floating Import Loading Toasts */}
      {importing && <ImportLoadingToast progress={importProgress} />}
      {importingHoliday && <HolidayImportLoadingToast progress={holidayImportProgress} />}
    </>
  );
};

export default AdminHeader;