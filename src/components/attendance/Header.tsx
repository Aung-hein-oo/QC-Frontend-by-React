import { useNavigate } from "react-router-dom";
import { Calendar, User } from "lucide-react";
import { useAttendance } from "../../hooks/useAttendance";
import Dropdown from "./Dropdown";

const Header: React.FC = () => {
    const navigate = useNavigate();
    const { staff } = useAttendance();
    if (!staff) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
                    <div onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
                        <Calendar className="text-blue-600" size={28} />
                        <h1 className="text-xl font-semibold">AMS</h1>
                        <div className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                            {staff.staff_position}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* User Info */}
                        <div className="flex items-center gap-2 text-sm">
                            <User size={18} className="text-gray-500" />
                            <span className="font-medium text-gray-700">{staff.staff_name}</span>
                            <span className="text-xs text-gray-400">({staff.staff_id})</span>
                        </div>
                        {/* Profile Dropdown */}
                        <Dropdown />
                    </div>
                </div>
    );
};

export default Header;