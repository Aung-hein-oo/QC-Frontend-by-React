import React from 'react';
import { LeaveBalanceDisplay } from '../../utils/leaveBalancedHelpers';

interface LeaveBalanceTableProps {
  data: LeaveBalanceDisplay[];
  loading: boolean;
  error: string | null;
}

const LeaveBalanceTable: React.FC<LeaveBalanceTableProps> = ({
  data,
  loading,
  error,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold">
          Leave Balance Information
          {loading && <span className="ml-2 text-xs text-gray-500">(Loading...)</span>}
        </h3>
        <div className="flex gap-2">
          {error && (
            <span className="text-xs text-red-600">
              Error: {error}
            </span>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left">Leave Type</th>
              <th className="p-3 text-center">Previous</th>
              <th className="p-3 text-center">Entitle</th>
              <th className="p-3 text-center">Taken</th>
              <th className="p-3 text-center">Balance</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-t hover:bg-gray-50 transition">
                <td className="p-3 font-medium text-gray-700">{item.leaveType}</td>
                <td className="p-3 text-center text-gray-600">{item.previous}</td>
                <td className="p-3 text-center text-gray-600">{item.entitle}</td>
                <td className="p-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.taken > item.entitle * 0.8 
                      ? 'bg-red-100 text-red-700'
                      : item.taken > 0
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {item.taken}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span className={`font-semibold ${
                    item.balance < 5 
                      ? 'text-red-600'
                      : item.balance < 10
                      ? 'text-orange-600'
                      : 'text-green-600'
                  }`}>
                    {item.balance}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {data.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            No leave balance data available
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveBalanceTable;