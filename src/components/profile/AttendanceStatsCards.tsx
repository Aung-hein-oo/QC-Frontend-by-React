import React from 'react';
import { CheckCircle, Clock, XCircle, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import StatCard from './StatCard';

interface AttendanceStatsCardsProps {
  totalWorkingDays: number | null;
  workingDays: number | null;
  leaveDays: number | null;
  loading?: boolean;
  error?: string | null;
}

const AttendanceStatsCards: React.FC<AttendanceStatsCardsProps> = ({
  totalWorkingDays,
  workingDays,
  leaveDays,
  loading = false,
  error = null,
}) => {
  // Show loading state
  if (loading) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <CalendarIcon size={20} className="text-blue-600" />
          Attendance Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <CalendarIcon size={20} className="text-blue-600" />
          Attendance Summary
        </h2>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="text-red-500" size={20} />
          <div className="text-red-700 text-sm">Failed to load attendance data: {error}</div>
        </div>
      </div>
    );
  }

  const stats = [
    { 
      label: 'Total Working Days', 
      value: totalWorkingDays !== null ? totalWorkingDays.toString() : '0', 
      color: 'text-green-600', 
      icon: CheckCircle 
    },
    { 
      label: 'Working Days Completed', 
      value: workingDays !== null ? workingDays.toFixed(1) : '0.0', 
      color: 'text-amber-600', 
      icon: Clock 
    },
    { 
      label: 'Leave Days Taken', 
      value: leaveDays !== null ? leaveDays.toFixed(1) : '0.0', 
      color: 'text-red-600', 
      icon: XCircle 
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <CalendarIcon size={20} className="text-blue-600" />
        Attendance Information
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default AttendanceStatsCards;