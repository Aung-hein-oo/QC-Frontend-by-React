import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  color: string;
  icon: React.ElementType;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color, icon: Icon }) => {
  const colorValue = color.split('-')[1];
  
  return (
    <div className="bg-white rounded-xl border p-5">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`bg-${colorValue}-100 p-3 rounded-lg`}>
          <Icon className={`text-${colorValue}-600`} size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;