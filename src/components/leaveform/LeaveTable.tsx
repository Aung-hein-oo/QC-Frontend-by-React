import React from 'react';
import { Pencil } from 'lucide-react';
import { LeaveTableRow } from '../../types/leave.types';

interface LeaveTableProps {
    data: LeaveTableRow[];
    onEdit: (row: LeaveTableRow) => void;
}

export const LeaveTable: React.FC<LeaveTableProps> = ({ data, onEdit }) => {
    return (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            {['', 'StaffNO', 'StaffName', 'LeaveType', 'FromDate', 'ToDate', 'Reason', 'Status', 'Actions'].map(h => (
                                <th key={h} className="px-6 py-4 text-left text-sm font-semibold">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {data.map((row, idx) => (
                            <tr key={idx}>
                                <td className="px-4 py-3 w-10 text-center">
                                    <input type="checkbox" />
                                </td>
                                <td className="px-6 py-4">{row.staffNo}</td>
                                <td className="px-6 py-4">{row.staffName}</td>
                                <td className="px-6 py-4">{row.leaveType}</td>
                                <td className="px-6 py-4">{row.fromDate}</td>
                                <td className="px-6 py-4">{row.toDate}</td>
                                <td className="px-6 py-4">{row.reason}</td>
                                <td className="px-6 py-4">{row.status}</td>
                                <td className="px-6 py-4">
                                    <button 
                                        onClick={() => onEdit(row)}
                                        className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm"
                                    >
                                        <Pencil size={16} />
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};