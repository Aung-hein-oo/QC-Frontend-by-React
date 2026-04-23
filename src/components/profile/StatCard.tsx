import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  color: string;
  icon: LucideIcon;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color, icon: Icon }) => {
  // Extract color class without 'text-' for background
  const bgColor = color.replace('text-', 'bg-').replace('600', '50');
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`${bgColor} p-3 rounded-full`}>
          <Icon size={24} className={color} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;