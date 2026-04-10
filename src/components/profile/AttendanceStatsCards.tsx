import React from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
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
  // You can make these dynamic based on API data
  const stats = [
    { label: 'Working day per Month', value: workingDays.toString(), color: 'text-green-600', icon: CheckCircle },
    { label: 'Leave per Month', value: leaveDays.toString(), color: 'text-red-600', icon: XCircle },
    { label: 'Half Leave per Month', value: halfLeaveDays.toString(), color: 'text-amber-600', icon: Clock },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Attendance Information</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default AttendanceStatsCards;