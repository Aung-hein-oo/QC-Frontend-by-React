import React, { useState, useMemo, useRef, useEffect } from 'react';
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
    const tableContainerRef = useRef<HTMLDivElement>(null);

    console.log("Current Staff List Data:", staffList);

    // Add serial numbers to data
    const dataWithSerialNumbers = useMemo(() => {
        return data.map((item, index) => ({
            ...item,
            serialNumber: index + 1
        }));
    }, [data]);

    // 2. Calculate Processed Data
    const totalItems = dataWithSerialNumbers.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;

    // Reset to first page when items per page changes or data length changes
    useEffect(() => {
        setCurrentPage(1);
        // Scroll to top when data changes
        if (tableContainerRef.current) {
            tableContainerRef.current.scrollTop = 0;
        }
    }, [itemsPerPage, data.length]);

    // Slice the data for the current view
    const currentTableData = useMemo(() => {
        return dataWithSerialNumbers.slice(startIndex, startIndex + itemsPerPage);
    }, [dataWithSerialNumbers, startIndex, itemsPerPage]);

    const getStatusStyles = (status: string) => {
        const s = status.toLowerCase();
        if (s.includes('pending')) return 'bg-yellow-100 text-yellow-700';
        if (s.includes('approved')) return 'bg-green-100 text-green-700';
        if (s.includes('reject')) return 'bg-red-100 text-red-700';
        return 'bg-slate-100 text-slate-700 ';
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top of table when page changes
        if (tableContainerRef.current) {
            tableContainerRef.current.scrollTop = 0;
        }
    };

    return (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col h-full">
            {/* Table Section - with relative positioning for sticky header */}
            <div 
                ref={tableContainerRef}
                className="flex-1 overflow-auto relative"
                style={{ position: 'relative' }}
            >
                <div className="relative min-w-full">
                    <table className="w-full border-collapse">
                        <thead className="bg-slate-50">
                            <tr>
                                {['#', 'Leave Type', 'From Date', 'To Date', 'Total Leave', 'Reason', 'Status', 'ApproveBy', 'Actions'].map(h => (
                                    <th 
                                        key={h} 
                                        className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider sticky top-0 bg-slate-50 z-10 shadow-sm"
                                        style={{ position: 'sticky', top: 0, backgroundColor: 'rgb(248 250 252)' }}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {currentTableData.length > 0 ? (
                                currentTableData.map((row, idx) => (
                                    <tr key={row.id || idx} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-slate-700">{row.serialNumber}</td>
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
                                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">{row.approved_by}</td>
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
            </div>

            {/* Pagination Section - Fixed at bottom with proper spacing */}
            {data.length > 0 && (
                <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        startIndex={startIndex}
                        onPageChange={handlePageChange}
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