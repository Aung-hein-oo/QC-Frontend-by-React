// Updated AttendanceStats component with smaller cards
import { CheckCircle, Clock, XCircle, UserX } from 'lucide-react';
import { StatCard } from '../common/StatCard';

type AttendanceStatsProps = {
  present: number;
  leave: number;
  halfLeave: number;
  absence: number;
};

export const AttendanceStats = ({ present, leave, halfLeave, absence }: AttendanceStatsProps) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
    <StatCard label="Present" value={present} color="text-green-600" icon={CheckCircle} />
    <StatCard label="Leave" value={leave} color="text-red-600" icon={XCircle} />
    <StatCard label="Half Leave" value={halfLeave} color="text-amber-600" icon={Clock} />
    <StatCard label="Absence" value={absence} color="text-slate-600" icon={UserX} />
  </div>
);