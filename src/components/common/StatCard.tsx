export const StatCard = ({ label, value, color, icon: Icon }: any) => (
  <div className="bg-white rounded-lg border p-1.5 hover:shadow-sm transition-shadow min-w-[80px] sm:min-w-[100px] md:min-w-[120px] lg:min-w-[380px]">
    <div className="flex flex-row sm:flex-col items-center gap-2 sm:gap-1 text-left sm:text-center">
      <div className={`bg-${color.split('-')[1]}-50 p-1 rounded-md flex-shrink-0`}>
        <Icon className={`${color} opacity-80`} size={12} />
      </div>
      <div className="flex-1">
        <p className="text-[9px] sm:text-[10px] text-gray-500 font-medium uppercase tracking-wider">{label}</p>
        <p className={`text-sm sm:text-base font-bold ${color}`}>{value}</p>
      </div>
    </div>
  </div>
);