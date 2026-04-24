import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FileText, LogOut, UserCircle, Key, ChevronDown, ChevronRight, User, Shield, X, AlertCircle, LayoutDashboard, Download } from "lucide-react";
import { useAttendance } from "../../hooks/useAttendance";
import { useNotification } from '../common/Notification';

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

interface DropdownProps {
  isAdmin?: boolean;
  canExport?: boolean;
  onExport?: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({ isAdmin = false, canExport = false, onExport }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { staff } = useAttendance();
    const { showNotification } = useNotification();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleAdminClick = () => {
        if (isAdmin) {
            navigate('/admin');
        } else {
            showNotification('Access denied. Only Admin users can access the management site.', 'error');
        }
        setShowDropdown(false);
    };

    const handleExport = () => {
        if (onExport) {
            onExport();
        }
        setShowDropdown(false);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
        setShowLogoutModal(false);
        showNotification('You have been successfully logged out.', 'success');
    };

    // Check if current path is dashboard or home
    const isOnDashboard = location.pathname === '/dashboard' || location.pathname === '/';

    if (!staff) return null;

    return (
        <div ref={dropdownRef} className="relative z-30">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
            >
                <User size={16} />
                Menu
                {showDropdown ? (
                    <ChevronRight size={16} />
                ) : (
                    <ChevronDown size={16} />
                )}
            </button>

            {/* Dropdown with higher z-index and proper positioning */}
            {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                    {/* Dashboard button - only shown when not on dashboard */}
                    {!isOnDashboard && (
                        <>
                            <button
                                onClick={() => {
                                    navigate("/dashboard");
                                    setShowDropdown(false);
                                }}
                                className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors"
                            >
                                <LayoutDashboard size={16} className="text-green-600" />
                                <span>Dashboard</span>
                                <span className="ml-auto text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">Home</span>
                            </button>
                            <hr className="my-1" />
                        </>
                    )}

                    {/* Export button - only shown for users with export permission */}
                    {canExport && (
                        <>
                            <button
                                onClick={handleExport}
                                className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors"
                            >
                                <Download size={16} className="text-green-600" />
                                <span>Export Excel</span>
                                <span className="ml-auto text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">Report</span>
                            </button>
                            <hr className="my-1" />
                        </>
                    )}

                    {/* Admin button - only shown for admin users */}
                    {isAdmin && (
                        <>
                            <button
                                onClick={handleAdminClick}
                                className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors"
                            >
                                <Shield size={16} className="text-blue-600" />
                                <span>Admin</span>
                                <span className="ml-auto text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Admin</span>
                            </button>
                            <hr className="my-1" />
                        </>
                    )}

                    {!isAdmin && (
                        <button
                            onClick={() => {
                                navigate("/user_profile");
                                setShowDropdown(false);
                            }}
                            className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors"
                        >
                            <UserCircle size={16} />
                            My Profile
                        </button>
                    )}

                    {!isAdmin && (
                    <button
                        onClick={() => {
                            navigate("/leave");
                            setShowDropdown(false);
                        }}
                        className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors"
                    >
                        <FileText size={16} />
                        Leave Request
                    </button>
                    )}

                    {/* Leave Approve - only for staff IDs starting with 25 */}
                    {staff.staff_id?.startsWith("25") && (
                        <button
                            onClick={() => {
                                navigate("/leave_approve");
                                setShowDropdown(false);
                            }}
                            className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors"
                        >
                            <FileText size={16} />
                            Leave Approve
                        </button>
                    )}

                    <button
                        onClick={() => {
                            navigate("/change_password");
                            setShowDropdown(false);
                        }}
                        className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors"
                    >
                        <Key size={16} />
                        Change Password
                    </button>

                    <hr className="my-1" />

                    <button
                        onClick={() => {
                            setShowDropdown(false);
                            setShowLogoutModal(true);
                        }}
                        className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            )}

            <LogoutConfirmModal 
                isOpen={showLogoutModal}
                onConfirm={handleLogout}
                onCancel={() => setShowLogoutModal(false)}
            />
        </div>
    );
};

export default Dropdown;