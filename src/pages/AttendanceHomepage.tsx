import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Calendar, User } from 'lucide-react';
import { useAttendance } from '../hooks/useAttendance';
import { GenderIcon } from '../components/common/GenderIcon';
import { AttendanceStats } from '../components/attendance/AttendanceStats';
import { AttendanceTable } from '../components/attendance/AttendanceTable';
import { DateFilter } from '../components/attendance/DateFilter';
import { getScope } from '../utils/positionRules';
import { useNotification } from '../components/common/Notification';
import Dropdown from "../components/profile/Dropdown";


const AttendanceHomepage = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { 
  staff, 
  attendance, 
  loading, 
  selectedDate, 
  setSelectedDate, 
  canFilterByDate, 
  refreshAttendance,
  updateAttendanceStatus,
  updateAttendanceType,
  updatingId,
  updatingTypeId,
  availableTypes
} = useAttendance();

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
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gary-200 to-gray-300 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="animate-spin w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full mx-auto mb-2"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (!staff) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <header className="bg-white/95 backdrop-blur-sm border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
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
            
            <Dropdown isAdmin={isAdmin} />
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
            onUpdateStatus={updateAttendanceStatus}
            onUpdateType={updateAttendanceType}
            updatingId={updatingId}
            updatingTypeId={updatingTypeId}
            availableTypes={availableTypes}
          />
        </div>

        <div className="mt-6 text-xs text-center text-gray-500 border-t pt-6">
          © 2026 Attendance Management System by MODOS. All rights reserved.
        </div>
      </main>
    </div>
  );
};

export default AttendanceHomepage;