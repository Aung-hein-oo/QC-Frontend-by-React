import React from 'react';

interface AttendanceTypeBadgeProps {
  type: string;
}

const TYPE_COLORS: Record<string, string> = {
  'WFO': 'bg-blue-100 text-blue-800',
  'WFH': 'bg-purple-100 text-purple-800',
  'Casual Leave': 'bg-orange-100 text-orange-800',
  'Family Funeral or Health Care Leave': 'bg-indigo-100 text-indigo-800',
  'Leave With Pay': 'bg-green-100 text-green-800',
  'Leave Without Pay': 'bg-red-100 text-red-800',
  'Married Leave': 'bg-pink-100 text-pink-800',
  'Maternity Leave': 'bg-rose-100 text-rose-800',
  'Paternity Leave': 'bg-cyan-100 text-cyan-800',
  'Medical Leave': 'bg-yellow-100 text-yellow-800'
};

const DEFAULT_COLOR = 'bg-gray-100 text-gray-800';

export const AttendanceTypeBadge: React.FC<AttendanceTypeBadgeProps> = ({ type }) => {
  if (!type || type === '-') {
    return <span className="text-gray-400 text-sm">-</span>;
  }
  
  const colorClass = TYPE_COLORS[type] || DEFAULT_COLOR;
  
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {type}
    </span>
  );
};