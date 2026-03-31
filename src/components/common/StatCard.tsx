export const StatCard = ({ label, value, color, icon: Icon }: any) => (
  <div className="bg-white rounded-xl border p-5 hover:shadow-md">
    <div className="flex justify-between">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
      </div>
      <div className={`bg-${color.split('-')[1]}-100 p-3 rounded-lg`}>
        <Icon className={`text-${color.split('-')[1]}-600`} size={24} />
      </div>
    </div>
  </div>
);