import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FileText, LogOut, UserCircle, Key, ChevronDown, ChevronRight, User, Shield, LayoutDashboard, Download, Loader } from "lucide-react";
import { useAttendance } from "../../hooks/useAttendance";
import { useNotification } from '../common/Notification';
import { useExcelExport } from "../../hooks/useExcelExport";

interface DropdownProps {
  isAdmin?: boolean;
  canExport?: boolean;
  selectedDate?: string;
  onLogoutClick?: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({ 
  isAdmin = false, 
  canExport = false, 
  selectedDate,
  onLogoutClick 
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { staff } = useAttendance();
    const { showNotification } = useNotification();
    const { exportAttendance, exporting } = useExcelExport();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    const handleExport = async () => {
        setShowDropdown(false);
        
        // If a specific date is selected, export only that date
        if (selectedDate) {
            await exportAttendance({ date: selectedDate });
        } else {
            // Otherwise export current month
            const today = new Date();
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            
            const startDate = firstDay.toISOString().split('T')[0];
            const endDate = lastDay.toISOString().split('T')[0];
            
            await exportAttendance({ startDate, endDate });
        }
    };

    const handleLogoutClick = () => {
        setShowDropdown(false);
        if (onLogoutClick) {
            onLogoutClick();
        }
    };

    // Check if current path is dashboard or home
    const isOnDashboard = location.pathname === '/dashboard' || location.pathname === '/';

    if (!staff) return null;

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
                disabled={exporting}
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
                                disabled={exporting}
                                className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {exporting ? (
                                    <>
                                        <Loader size={16} className="text-green-600 animate-spin" />
                                        <span>Exporting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Download size={16} className="text-green-600" />
                                        <span>Export Excel</span>
                                        <span className="ml-auto text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">Report</span>
                                    </>
                                )}
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
                        onClick={handleLogoutClick}
                        className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dropdown;