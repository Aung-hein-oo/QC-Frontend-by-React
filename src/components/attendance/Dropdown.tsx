import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, LogOut, UserCircle, Key, ChevronDown, ChevronRight } from "lucide-react";
import { useAttendance } from "../../hooks/useAttendance";

const Dropdown: React.FC = () => {
    const navigate = useNavigate();
    const { staff } = useAttendance();
    // const [showDropdown, setShowDropdown] = useState<boolean>(false);
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
    if (!staff) return null;

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
            >
                Staff Information

                {showDropdown ? (
                    <ChevronRight size={16} />
                ) : (
                    <ChevronDown size={16} />
                )}
            </button>

            {/* Dropdown */}
            {showDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <button
                        onClick={() => navigate("/user_profile")}
                        className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                        <UserCircle size={16} />
                        My Profile
                    </button>

                    <button
                        onClick={() => navigate("/leave")}
                        className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                        <FileText size={16} />
                        Leave Request
                    </button>
                    {staff.staff_id?.startsWith("25") && (
                        <button
                            onClick={() => navigate("/leave_approve")}
                            className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                            <FileText size={16} />
                            Leave Approve
                        </button>
                    )}

                    <button
                        onClick={() => navigate("/change_password")}
                        className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                        <Key size={16} />
                        Change Password
                    </button>

                    <hr />

                    <button
                        onClick={() => { localStorage.clear(); navigate("/"); }}
                        className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
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