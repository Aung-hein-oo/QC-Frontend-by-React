import React, { useState, useMemo } from 'react';
import { Pencil, Inbox, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { LeaveTableRow } from '../../types/leave.types';
import { Pagination } from '../common/Pagination';

interface LeaveTableProps {
    data: LeaveTableRow[];
    onEdit: (row: LeaveTableRow) => void;
    onDelete: (row: LeaveTableRow) => void;
}

// ReasonCell component with its own state isolated
const ReasonCell = ({ reason, rowId }: { reason: string; rowId: string | number }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const maxLength = 100;
    const needsTruncation = reason && reason.length > maxLength;

    if (!reason || reason === '-') return <span className="text-gray-400">-</span>;

    // Stop propagation to prevent row clicks from interfering
    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="flex items-start gap-2">
            <div className="flex-1">
                <span className="text-sm text-gray-600 break-words">
                    {isExpanded ? reason : `${reason.slice(0, maxLength)}${needsTruncation ? '...' : ''}`}
                </span>
            </div>
            {needsTruncation && (
                <button
                    onClick={handleToggle}
                    className="flex-shrink-0 text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1 focus:outline-none"
                >
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    <span>{isExpanded ? 'See less' : 'See more'}</span>
                </button>
            )}
        </div>
    );
};

export const LeaveTable: React.FC<LeaveTableProps> = ({ data, onEdit, onDelete }) => {
    // 1. Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // 2. Calculate Processed Data
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;

    const currentTableData = useMemo(() => {
        return data.slice(startIndex, startIndex + itemsPerPage);
    }, [data, startIndex, itemsPerPage]);

    const getStatusStyles = (status: string) => {
        const s = status.toLowerCase();
        if (s.includes('pending')) return 'bg-yellow-100 text-yellow-700';
        if (s.includes('approved')) return 'bg-green-100 text-green-700';
        if (s.includes('reject')) return 'bg-red-100 text-red-700';
        return 'bg-slate-100 text-slate-700 ';
    };

    return (
        <div className="bg-white rounded-xl border shadow-sm flex flex-col" style={{ height: 'calc(100vh - 280px)', overflow: 'hidden' }}>
            {/* Scrollable Table Container */}
            <div className="flex-1 overflow-auto min-h-0">
                <div className="overflow-x-auto h-full">
                    <table className="w-full border-collapse">
                        <thead className="bg-slate-50 border-b sticky shadow-sm">
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
                                currentTableData.map((row, idx) => {
                                    const rowKey = row.id || idx;

                                    return (
                                        <tr key={rowKey} className="hover:bg-slate-50 transition-colors">
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
                                            <td className="px-6 py-4 text-sm text-slate-600 min-w-[250px] max-w-[300px]">
                                                <ReasonCell reason={row.reason} rowId={rowKey} />
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyles(row.status)}`}>
                                                    {row.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                                                {row.approved_by && row.approved_by.length > 0 ? (
                                                    row.approved_by
                                                ) : (
                                                    <span className="text-slate-200">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    {row.status?.toUpperCase() === "PENDING" && (
                                                        <>
                                                            <button
                                                                onClick={() => onEdit(row)}
                                                                className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 text-xs font-semibold"
                                                            >
                                                                <Pencil size={14} />
                                                            </button>

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
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={10} className="px-4 py-10 text-center">
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
            </div>

            {/* Pagination - Sticky at bottom */}
            {data.length > 0 && (
                <div className="border-t bg-white sticky bottom-0">
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
                        showFilteredBadge={false}
                        isFiltered={false}
                    />
                </div>
            )}
        </div>
    );
};