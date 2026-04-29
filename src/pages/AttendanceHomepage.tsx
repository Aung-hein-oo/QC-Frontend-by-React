import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Calendar, User, Building2, Users, Flag, Loader } from 'lucide-react';
import { useAttendance } from '../hooks/useAttendance';
import { useOrganization } from '../hooks/useOrganization';
import { AttendanceStats } from '../components/attendance/AttendanceStats';
import { AttendanceTable } from '../components/attendance/AttendanceTable';
import { DateFilter } from '../components/attendance/DateFilter';
import { getScope } from '../utils/positionRules';
import { useNotification } from '../components/common/Notification';
import Dropdown from "../components/profile/Dropdown";
import LogoutConfirmModal from "../components/profile/LogoutConfirmModal";

const AttendanceHomepage = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
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

  useEffect(() => {
    if (staff && staff.staff_id) {
      const storedStaff = localStorage.getItem('staff');
      const parsedStoredStaff = storedStaff ? JSON.parse(storedStaff) : null;
      
      if (!parsedStoredStaff || parsedStoredStaff.staff_id !== staff.staff_id) {
        localStorage.setItem('staff', JSON.stringify(staff));
      } else if (parsedStoredStaff.staff_position !== staff.staff_position) {
        localStorage.setItem('staff', JSON.stringify({ ...parsedStoredStaff, ...staff }));
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
  const canExport = userScope !== 'self';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      showNotification('Please login to continue.', 'warning');
      navigate('/');
    }
  }, [navigate, showNotification]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    setShowLogoutModal(false);
    showNotification('You have been successfully logged out.', 'success');
  };

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

  const getOrgIcon = () => {
    switch (scope) {
      case 'division': return <Flag size={16} className="text-blue-600" />;
      case 'department': return <Building2 size={16} className="text-green-600" />;
      case 'team': return <Users size={16} className="text-purple-600" />;
      default: return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 overflow-hidden">
      <header className="bg-white/95 backdrop-blur-sm border-b shadow-sm flex-shrink-0 z-20 relative">
        <div className="w-full px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
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
            <Dropdown 
              isAdmin={isAdmin} 
              canExport={canExport}
              selectedDate={selectedDate}
              onLogoutClick={() => setShowLogoutModal(true)}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 overflow-hidden px-4 py-4">
        <div className="h-full flex flex-col gap-4">
          <div className="flex-shrink-0 flex items-start gap-4">
            <div className="flex-shrink-0">
              <DateFilter selectedDate={selectedDate} onDateChange={setSelectedDate} />
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
            />
          </div>
          
          <div className="flex-shrink-0 text-xs text-center text-gray-500 border-t pt-4">
            © 2026 Attendance Management System by MODOS. All rights reserved.
          </div>
        </div>
      </main>

      {/* Logout Modal - Rendered at the root level of the component */}
      <LogoutConfirmModal 
        isOpen={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  );
};

export default AttendanceHomepage;