import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, User, Building2, Users, Flag, Loader } from "lucide-react";
import { useAttendance } from "../../hooks/useAttendance";
import { useOrganization } from "../../hooks/useOrganization";
import { useNotification } from '../common/Notification';
import Dropdown from "./Dropdown";
import LogoutConfirmModal from "./LogoutConfirmModal";

const Header: React.FC = () => {
    const navigate = useNavigate();
    const { staff } = useAttendance();
    const { showNotification } = useNotification();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    
    const { 
        organizationLabel, 
        organizationName, 
        loading: orgLoading,
        hasOrganization,
        scope
    } = useOrganization(
        staff?.staff_position, 
        staff?.division_id, 
        staff?.department_id, 
        staff?.team_id
    );
    
    if (!staff) return null;

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
        setShowLogoutModal(false);
        showNotification('You have been successfully logged out.', 'success');
    };

    const getOrgIcon = () => {
        switch (scope) {
            case 'division': return <Flag size={16} className="text-blue-600" />;
            case 'department': return <Building2 size={16} className="text-green-600" />;
            case 'team': return <Users size={16} className="text-purple-600" />;
            default: return null;
        }
    };

    const isAdmin = staff?.staff_position === 'Admin';
    const userScope = staff ? (() => {
        // Simple scope check - you can import getScope if needed
        if (staff.staff_position === 'Admin') return 'all';
        if (['General Manager', 'Deputy General Manager'].includes(staff.staff_position)) return 'division';
        return 'self';
    })() : 'self';
    const canExport = userScope !== 'self';

    return (
        <>
            <div className="w-full px-4 py-3 flex justify-between items-center bg-white/95 backdrop-blur-sm border-b shadow-sm">
                <div className="flex items-center gap-3">
                    <div onClick={() => navigate('/dashboard')} className="flex items-center gap-2 cursor-pointer">
                        <Calendar className="text-blue-600" size={28} />
                        <h1 className="text-xl font-semibold text-gray-800">AMS</h1>
                    </div>
                    
                    {/* Organization Info beside AMS title */}
                    {hasOrganization && !orgLoading && organizationName && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded-md">
                            {getOrgIcon()}
                            <span className="text-lg text-gray-600">{organizationLabel}:</span>
                            <span className="text-lg font-medium text-gray-800">{organizationName}</span>
                        </div>
                    )}
                    
                    {orgLoading && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded-md">
                            <Loader size={14} className="text-blue-600 animate-spin" />
                            <span className="text-xs text-gray-500">Loading...</span>
                        </div>
                    )}
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
                    <Dropdown 
                        isAdmin={isAdmin}
                        canExport={canExport}
                        onLogoutClick={() => setShowLogoutModal(true)}
                    />
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