import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Calendar, User, LogOut, FileText, X, AlertCircle } from 'lucide-react';
import { useAttendance } from '../hooks/useAttendance';
import { GenderIcon } from '../components/common/GenderIcon';
import { AttendanceStats } from '../components/attendance/AttendanceStats';
import { AttendanceTable } from '../components/attendance/AttendanceTable';
import { DateFilter } from '../components/attendance/DateFilter';
import { getScope } from '../utils/positionRules';
import { useNotification } from '../components/common/Notification';

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

const AttendanceHomepage = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { staff, attendance, loading, selectedDate, setSelectedDate, canFilterByDate, refreshAttendance } = useAttendance();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Store staff data in localStorage when it's loaded
  useEffect(() => {
    if (staff && staff.staff_id) {
      // Get existing staff from localStorage
      const storedStaff = localStorage.getItem('staff');
      const parsedStoredStaff = storedStaff ? JSON.parse(storedStaff) : null;
      
      // Update localStorage if staff data has changed or doesn't exist
      if (!parsedStoredStaff || parsedStoredStaff.staff_id !== staff.staff_id) {
        localStorage.setItem('staff', JSON.stringify(staff));
        console.log('Staff data stored in localStorage:', staff);
      } else if (parsedStoredStaff.staff_position !== staff.staff_position) {
        // Update position if it changed
        const updatedStaff = { ...parsedStoredStaff, ...staff };
        localStorage.setItem('staff', JSON.stringify(updatedStaff));
        console.log('Staff position updated in localStorage');
      }
    }
  }, [staff]);

  const stats = {
    total: attendance.length,
    present: attendance.filter(a => a.attendance_status?.toLowerCase() === 'present').length,
    leave: attendance.filter(a => a.attendance_status?.toLowerCase() === 'leave').length,
    halfLeave: attendance.filter(a => a.attendance_status?.toLowerCase() === 'half leave').length,
    absence: attendance.filter(a => a.attendance_status?.toLowerCase() === 'absence').length,
  };

  const userScope = staff ? getScope(staff.staff_position) : 'self';
  const showFullTable = userScope === 'all';
  const isAdmin = staff?.staff_position === 'Admin';
  const title = showFullTable ? 'All Attendance Records' : 'My Attendance Records';

  const handleManageClick = () => {
    // Only allow admin to access the management site
    if (isAdmin) {
      navigate('/admin');
    } else {
      showNotification('Access denied. Only Admin users can access the management site.', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    setShowLogoutModal(false);
    showNotification('You have been successfully logged out.', 'success');
  };

  // Check authentication and redirect if needed
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      showNotification('Please login to continue.', 'warning');
      navigate('/');
    }
  }, [navigate, showNotification]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (!staff) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
      <header className="bg-white/95 backdrop-blur-sm border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="text-blue-600" size={28} />
            <h1 className="text-xl font-semibold text-gray-800">AMS</h1>
            <div className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
              {staff.staff_position}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User size={18} className="text-gray-500" />
              <span className="font-medium text-gray-700">{staff.staff_name}</span>
              <span className="text-xs text-gray-400">({staff.staff_id})</span>
            </div>
            
            {/* Only show Manage button for Admin users */}
            {isAdmin && (
              <button 
                onClick={handleManageClick} 
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
              >
                <User size={16} />
                Manage
              </button>
            )}
            
            <button 
              onClick={() => navigate('/user_profile')} 
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
            >
              <FileText size={16} />
              Profile
            </button>
            
            <button 
              onClick={() => setShowLogoutModal(true)} 
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="text-blue-700 mt-1">Welcome back, {staff.staff_name}!</p>
          <div className="mt-2 flex gap-4 text-sm text-gray-600">
            <span>📍 {staff.floor || 'N/A'}</span>
            <span>📧 {staff.staff_mail}</span>
            <span className="flex items-center gap-1">
              <GenderIcon gender={staff.gender} />
            </span>
          </div>
        </div>

        <DateFilter 
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          show={canFilterByDate}
        />

        <AttendanceStats {...stats} />

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <AttendanceTable 
            attendance={attendance}
            showStaffInfo={showFullTable}
            isAdmin={isAdmin}
            onStatusUpdate={refreshAttendance}
          />
        </div>

        <div className="mt-6 text-xs text-center text-gray-500 border-t pt-6">
          © 2026 Attendance Management System by MODOS. All rights reserved.
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal 
        isOpen={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  );
};

export default AttendanceHomepage;