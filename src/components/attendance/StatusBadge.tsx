import { CheckCircle, Clock, XCircle } from 'lucide-react';

export const StatusBadge = ({ status }: { status: string }) => {
  const config: any = {
    'present': { icon: CheckCircle, text: 'Present', color: 'green' },
    'leave': { icon: XCircle, text: 'Leave', color: 'red' },
    'half leave': { icon: Clock, text: 'Half Leave', color: 'amber' },
  };
  const { icon: Icon, text, color } = config[status?.toLowerCase()] || 
    { icon: Clock, text: status || 'Unknown', color: 'gray' };

  const colorClasses = {
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    amber: 'bg-amber-100 text-amber-700',
    gray: 'bg-gray-100 text-gray-700',
  };
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${colorClasses[color as keyof typeof colorClasses]}`}>
      <Icon size={14} />
      {text}
    </span>
  );
};