import { Calendar, CheckCircle, Clock, XCircle, UserX } from 'lucide-react';
import { StatCard } from '../common/StatCard';

type AttendanceStatsProps = {
  total: number;
  present: number;
  leave: number;
  halfLeave: number;
  absence: number;
};

export const AttendanceStats = ({ total, present, leave, halfLeave, absence }: AttendanceStatsProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
    <StatCard label="Total" value={total} color="text-blue-600" icon={Calendar} />
    <StatCard label="Present" value={present} color="text-green-600" icon={CheckCircle} />
    <StatCard label="Leave" value={leave} color="text-red-600" icon={XCircle} />
    <StatCard label="Half Leave" value={halfLeave} color="text-amber-600" icon={Clock} />
    <StatCard label="Absence" value={absence} color="text-purple-600" icon={UserX} />
  </div>
);