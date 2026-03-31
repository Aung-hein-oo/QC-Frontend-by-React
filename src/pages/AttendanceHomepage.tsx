import { useNavigate } from 'react-router-dom';
import { Calendar, User, LogOut, FileText } from 'lucide-react';
import { useAttendance } from '../hooks/useAttendance';
import { GenderIcon } from '../components/common/GenderIcon';
import { AttendanceStats } from '../components/attendance/AttendanceStats';
import { AttendanceTable } from '../components/attendance/AttendanceTable';
import { DateFilter } from '../components/attendance/DateFilter';
import { getScope } from '../utils/positionRules';

const AttendanceHomepage = () => {
  const navigate = useNavigate();
  const { staff, attendance, loading, selectedDate, setSelectedDate, canFilterByDate } = useAttendance();

  const stats = {
    total: attendance.length,
    present: attendance.filter(a => a.attendance_status?.toLowerCase() === 'present').length,
    leave: attendance.filter(a => a.attendance_status?.toLowerCase() === 'leave').length,
    halfLeave: attendance.filter(a => a.attendance_status?.toLowerCase() === 'half leave').length,
    absence: attendance.filter(a => a.attendance_status?.toLowerCase() === 'absence').length,
  };

  const showFullTable = staff ? getScope(staff.staff_position) === 'all' : false;
  const title = showFullTable ? 'All Attendance Records' : 'My Attendance Records';

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
            {showFullTable && (
            <button 
              onClick={() => navigate('/admin')} 
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm"
            >
              <User size={16} />
              Manage
            </button>
            )}
            <button 
              onClick={() => navigate('/user_profile')} 
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm"
            >
              <FileText size={16} />
              Profile
            </button>
            <button 
              onClick={() => { localStorage.clear(); navigate('/'); }} 
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
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