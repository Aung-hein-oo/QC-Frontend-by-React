import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus, Upload, Calendar1, ChevronDown, ChevronRight, LogOut, User, X, AlertCircle, LayoutDashboard } from 'lucide-react';
import '../../assets/css/admin-header.css';

// Simplified loading toast component
const ImportLoadingToast = ({ title, progress, color }: { title: string; progress: number; color: string }) => (
  <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-5 duration-300">
    <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden w-80">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <div className={`w-4 h-4 border-2 border-${color}-200 border-t-${color}-600 rounded-full animate-spin`}></div>
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <span className="font-semibold text-gray-800 text-sm">{title}</span>
              <span className="ml-2 text-xs font-medium text-gray-500">{progress}%</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Processing your file...</p>
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 bg-${color}-500`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  </div>
);

// Simplified logout modal
const LogoutConfirmModal = ({ isOpen, onConfirm, onCancel }: { isOpen: boolean; onConfirm: () => void; onCancel: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
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
          <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded-lg">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-5">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">Are you sure you want to logout?</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">
              Stay Logged In
            </button>
            <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-2">
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
  const [showMenu, setShowMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showMenu && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        right: window.innerWidth - rect.right
      });
    }
  }, [showMenu]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const MenuButton = ({ onClick, icon, text, disabled, loading, progress, color }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <div className={`w-4 h-4 border-2 border-${color}-200 border-t-${color}-600 rounded-full animate-spin`}></div>
          <span>Importing {progress}%</span>
        </>
      ) : (
        <>
          {icon}
          <span>{text}</span>
        </>
      )}
    </button>
  );

  return (
    <>
      <header className="bg-white/95 backdrop-blur-sm border-b shadow-sm flex-shrink-0 admin-header-fix">
        <div className="w-full px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="text-blue-600" size={28} />
            <h1 className="text-xl font-semibold text-gray-800">AMS Admin</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div ref={menuRef} className="relative">
              <button
                ref={buttonRef}
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm"
                disabled={importing || importingHoliday}
              >
                <User size={16} />
                Menu
                {showMenu ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
              </button>

              {showMenu && !importing && !importingHoliday && (
                <div 
                  className="fixed bg-white border rounded-lg shadow-lg overflow-hidden"
                  style={{ top: `${position.top}px`, right: `${position.right}px`, width: '208px' }}
                >
                  <div className="py-1">
                    <button onClick={() => { navigate('/dashboard'); setShowMenu(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100">
                      <LayoutDashboard size={16} className="text-green-600" />
                      <span>Dashboard</span>
                    </button>
                  </div>

                  <hr className="my-1" />

                  <div className="py-1">
                    <div className="px-4 py-1 text-xs text-gray-500 uppercase">Management</div>
                    
                    <button onClick={() => { onAddStaff(); setShowMenu(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100">
                      <Plus size={16} className="text-green-600" />
                      <span>Add New Staff</span>
                    </button>
                    
                    <MenuButton
                      onClick={onImportExcel}
                      icon={<Upload size={16} className="text-blue-600" />}
                      text="Import Staff"
                      disabled={importing}
                      loading={importing}
                      progress={importProgress}
                      color="blue"
                    />
                    
                    <MenuButton
                      onClick={onAddHoliday}
                      icon={<Calendar1 size={16} className="text-orange-600" />}
                      text="Add Holiday"
                      disabled={importingHoliday}
                      loading={importingHoliday}
                      progress={holidayImportProgress}
                      color="orange"
                    />
                  </div>

                  <hr className="my-1" />

                  <div className="py-1">
                    <button onClick={() => { setShowMenu(false); setShowLogoutModal(true); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
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

      {importing && <ImportLoadingToast title="Importing Staff Data" progress={importProgress} color="blue" />}
      {importingHoliday && <ImportLoadingToast title="Importing Holidays" progress={holidayImportProgress} color="orange" />}
    </>
  );
};

export default AdminHeader;