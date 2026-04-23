import React from 'react';
import { CheckCircle, Clock, XCircle, Calendar as CalendarIcon } from 'lucide-react';
import StatCard from './StatCard';

interface AttendanceStatsCardsProps {
  workingDays: number;
  leaveDays: number;
  halfLeaveDays: number;
}

const AttendanceStatsCards: React.FC<AttendanceStatsCardsProps> = ({
  workingDays,
  leaveDays,
  halfLeaveDays,
}) => {
  const stats = [
    { label: 'Working Days', value: workingDays.toString(), color: 'text-green-600', icon: CheckCircle },
    { label: 'Leave Days', value: leaveDays.toString(), color: 'text-red-600', icon: XCircle },
    { label: 'Half Leave Days', value: halfLeaveDays.toString(), color: 'text-amber-600', icon: Clock },
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