import React, { useState, useMemo } from 'react';
import { Pencil, Inbox, Trash2 } from 'lucide-react';
import { LeaveTableRow } from '../../types/leave.types';
import { Pagination } from '../common/Pagination';
import { StaffMember } from '../../types';

interface LeaveTableProps {
    data: LeaveTableRow[];
    onEdit: (row: LeaveTableRow) => void;
    onDelete: (row: LeaveTableRow) => void;
    staffList: StaffMember[];
}

export const LeaveTable: React.FC<LeaveTableProps> = ({ data, onEdit, onDelete, staffList }) => {
    // 1. Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    console.log("Current Staff List Data:", staffList);

    // 2. Calculate Processed Data
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;

    // Slice the data for the current view
    const currentTableData = useMemo(() => {
        return data.slice(startIndex, startIndex + itemsPerPage);
    }, [data, startIndex, itemsPerPage]);

    const getStatusStyles = (status: string) => {
        const s = status.toLowerCase();
        if (s.includes('pending')) return 'bg-yellow-100 text-yellow-700';
        if (s.includes('approved')) return 'bg-green-100 text-green-700';
        if (s.includes('reject')) return 'bg-red-100 text-red-700';
        return 'bg-slate-100 text-slate-700 '; // Default fallback
    };

    return (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden"> {/* Added wrapper to separate table and pagination */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            {['Staff NO', 'Staff Name', 'Leave Type', 'From Date', 'To Date', 'Total Leave', 'Reason', 'Status', 'ApproveBy', 'Actions'].map(h => (
                                <th key={h} className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {currentTableData.length > 0 ? (
                            currentTableData.map((row, idx) => (
                                <tr key={row.id || idx} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{row.staffNo}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{row.staffName}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium uppercase">
                                            {row.leaveType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{row.fromDate}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{row.toDate}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{row.total}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate" title={row.reason}>
                                        {row.reason}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyles(row.status)}`}>
                                            {row.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{row.approved_by}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex items-center gap-2">

                                            {row.status?.toUpperCase() === "PENDING" && (
                                                <>
                                                    {/* EDIT BUTTON */}
                                                    <button
                                                        onClick={() => onEdit(row)}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 text-xs font-semibold"
                                                    >
                                                        <Pencil size={14} />
                                                    </button>

                                                    {/* DELETE BUTTON */}
                                                    <button
                                                        onClick={() => onDelete(row)}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200 text-xs font-semibold"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </>
                                            )}

                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="px-4 py-10 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                        <Inbox size={30} className="mb-2 opacity-20" />
                                        <p className="text-lg font-medium">No leave records found</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </div>

            {/* 3. Pagination Component */}
            {data.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    startIndex={startIndex}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={(newSize) => {
                        setItemsPerPage(newSize);
                        setCurrentPage(1);
                    }}
                    showFilteredBadge={false} // Adjust based on your filter logic
                    isFiltered={false}
                />
            )}
        </div>
    );
};