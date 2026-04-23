// Updated AttendanceHomepage - Fix dropdown visibility
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Calendar, User } from 'lucide-react';
import { useAttendance } from '../hooks/useAttendance';
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
    refreshAttendance,
    updateAttendanceStatus,
    updateAttendanceType,
    updatingId,
    updatingTypeId,
    availableTypes,
    canEditRecord
  } = useAttendance();

  // Store staff data in localStorage when it's loaded
  useEffect(() => {
    if (staff && staff.staff_id) {
      console.log('Staff position loaded:', {
        staff_id: staff.staff_id,
        staff_name: staff.staff_name,
        staff_position: staff.staff_position,
        team_id: staff.team_id,
        department_id: staff.department_id,
        division_id: staff.division_id
      });
      
      const storedStaff = localStorage.getItem('staff');
      const parsedStoredStaff = storedStaff ? JSON.parse(storedStaff) : null;
      
      if (!parsedStoredStaff || parsedStoredStaff.staff_id !== staff.staff_id) {
        localStorage.setItem('staff', JSON.stringify(staff));
        console.log('Staff data stored in localStorage:', staff);
      } else if (parsedStoredStaff.staff_position !== staff.staff_position) {
        const updatedStaff = { ...parsedStoredStaff, ...staff };
        localStorage.setItem('staff', JSON.stringify(updatedStaff));
        console.log('Staff position updated in localStorage:', {
          old_position: parsedStoredStaff.staff_position,
          new_position: staff.staff_position
        });
      }
    }
  }, [staff]);

  const stats = {
    present: attendance.filter(a => a.attendance_status?.toLowerCase() === 'present').length,
    leave: attendance.filter(a => a.attendance_status?.toLowerCase() === 'leave').length,
    halfLeave: attendance.filter(a => a.attendance_status?.toLowerCase() === 'half leave').length,
    absence: attendance.filter(a => a.attendance_status?.toLowerCase() === 'absence').length,
  };

  const userScope = staff ? getScope(staff.staff_position) : 'self';
  const showFullTable = userScope !== 'self';
  const isAdmin = staff?.staff_position === 'Admin';
  
  console.log('AttendanceHomepage - Position check:', {
    staff_position: staff?.staff_position,
    userScope: userScope,
    showFullTable: showFullTable,
    isAdmin: isAdmin,
    totalAttendanceRecords: attendance.length
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      showNotification('Please login to continue.', 'warning');
      navigate('/');
    }
  }, [navigate, showNotification]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="animate-spin w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full mx-auto mb-2"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (!staff) return null;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 overflow-hidden">
      <header className="bg-white/95 backdrop-blur-sm border-b shadow-sm flex-shrink-0 z-20 relative">
        <div className="w-full px-4 py-3 flex justify-between items-center">
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

      <main className="flex-1 min-h-0 overflow-hidden px-4 py-4">
        <div className="h-full flex flex-col gap-4">
          {/* Date Filter and Stats Cards on same row */}
          <div className="flex-shrink-0 flex items-start gap-4">
            <div className="flex-shrink-0">
              <DateFilter 
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />
            </div>
            <div className="flex-1 min-w-0">
              <AttendanceStats 
                present={stats.present}
                leave={stats.leave}
                halfLeave={stats.halfLeave}
                absence={stats.absence}
              />
            </div>
          </div>

          {/* Table Container with fixed header and scrollable body */}
          <div className="flex-1 min-h-0 bg-white rounded-xl border shadow-sm flex flex-col overflow-hidden">
            <AttendanceTable 
              attendance={attendance}
              showStaffInfo={showFullTable}
              currentStaff={staff}
              canEditRecord={canEditRecord}
              onStatusUpdate={refreshAttendance}
              onUpdateStatus={updateAttendanceStatus}
              onUpdateType={updateAttendanceType}
              updatingId={updatingId}
              updatingTypeId={updatingTypeId}
              availableTypes={availableTypes}
              scrollable={true}
              fixedHeader={true}
            />
          </div>
          
          {/* Footer */}
          <div className="flex-shrink-0 text-xs text-center text-gray-500 border-t pt-4">
            © 2026 Attendance Management System by MODOS. All rights reserved.
          </div>
        </div>
      </main>
    </div>
  );
};

export default AttendanceHomepage;