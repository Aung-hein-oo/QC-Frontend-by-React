import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, User } from "lucide-react";
import { useAttendance } from "../../hooks/useAttendance";
import { useNotification } from '../common/Notification';
import Dropdown from "./Dropdown";
import LogoutConfirmModal from "./LogoutConfirmModal";

const Header: React.FC = () => {
    const navigate = useNavigate();
    const { staff } = useAttendance();
    const { showNotification } = useNotification();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    
    if (!staff) return null;

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
        setShowLogoutModal(false);
        showNotification('You have been successfully logged out.', 'success');
    };

    return (
        <>
            <div className="w-full px-4 py-3 flex justify-between items-center">
                <div onClick={() => navigate('/dashboard')} className="flex items-center gap-2 cursor-pointer">
                    <Calendar className="text-blue-600" size={28} />
                    <h1 className="text-xl font-semibold text-gray-800">AMS</h1>
                </div>
                <div className="flex items-center gap-4">
                    {/* User Info */}
                    <div className="flex flex-col items-end gap-0.5">
                        <div className="flex items-center gap-2">
                            <User size={18} className="text-gray-500" />
                            <span className="font-medium text-gray-700">{staff.staff_name}</span>
                            <span className="text-xs text-gray-400">({staff.staff_id})</span>
                        </div>
                        <div className="px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs ml-6">
                            {staff.staff_position}
                        </div>
                    </div>
                    {/* Profile Dropdown */}
                    <Dropdown onLogoutClick={() => setShowLogoutModal(true)} />
                </div>
            </div>

            {/* Logout Modal */}
            <LogoutConfirmModal 
                isOpen={showLogoutModal}
                onConfirm={handleLogout}
                onCancel={() => setShowLogoutModal(false)}
            />
        </>
    );
};

export default Header;