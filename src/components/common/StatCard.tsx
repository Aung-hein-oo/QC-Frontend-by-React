// Updated StatCard component (smaller)
export const StatCard = ({ label, value, color, icon: Icon }: any) => (
  <div className="bg-white rounded-lg border p-3 hover:shadow-sm transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className={`text-xl font-bold ${color}`}>{value}</p>
      </div>
      <div className={`bg-${color.split('-')[1]}-100 p-2 rounded-lg`}>
        <Icon className={`text-${color.split('-')[1]}-600`} size={18} />
      </div>
    </div>
  </div>
);