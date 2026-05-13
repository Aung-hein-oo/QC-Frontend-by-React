import React, { useState, useMemo } from 'react';
import { User, Calendar, Inbox, ChevronDown, ChevronUp, Shield, Briefcase } from 'lucide-react';
import Header from '../components/profile/Header';
import { useLeaveApprove } from '../hooks/useLeaveApprove';
import { config } from '../utils/config';
import { Pagination } from '../components/common/Pagination';
import { useAttendance } from '../hooks/useAttendance';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { SuccessModal } from '../components/common/SuccessModal';
import { useModals } from '../hooks/useModals';
import { getApproverScope } from '../utils/approverRules';

const ReasonCell = ({ reason }: { reason: string }) => {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 100;
  const needsTruncation = reason && reason.length > maxLength;
  
  if (!reason) return <span className="text-gray-400">-</span>;
  
  return (
    <div className="flex items-start gap-2">
      <div className="flex-1">
        <span className="text-sm text-gray-600 break-words">
          {expanded ? reason : `${reason.slice(0, maxLength)}${needsTruncation ? '...' : ''}`}
        </span>
      </div>
      {needsTruncation && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-shrink-0 text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1"
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          <span>{expanded ? 'See less' : 'See more'}</span>
        </button>
      )}
    </div>
  );
};

const LeaveApprove: React.FC = () => {
    const { leaveList, loading, refreshLeave } = useLeaveApprove();
    const [actionType, setActionType] = useState<"approved" | "rejected" | "">("");
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const { allStaffList, staff } = useAttendance();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
    const { confirmModal, successModal, showConfirm, closeConfirm, showSuccess, closeSuccess } = useModals();
    
    // Check if user has full access (HR/Admin level)
    const hasFullAccess = staff && (staff.staff_position === 'Admin' || 
                                    staff.staff_position === 'Deputy General Manager' ||
                                    staff.staff_position === 'Chairman' ||
                                    staff.staff_position === 'CEO' ||
                                    staff.staff_position === 'Vice President' ||
                                    staff.staff_position === 'Director' ||
                                    staff.staff_position === 'General Manager');
    
    // Get approver scope for display
    const approverScope = staff ? getApproverScope(staff.staff_position) : 'self';
    
    const sortedLeaveList = useMemo(() => {
        return [...leaveList].sort((a, b) => {
            const idA = a.leave_form_id;
            const idB = b.leave_form_id;
            return idB - idA;
        });
    }, [leaveList]);

    const totalItems = sortedLeaveList.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = sortedLeaveList.slice(startIndex, startIndex + itemsPerPage);

    const handleAction = async (row: any, type: string) => {
    if (!row || !row.leave_form_id) return;
    const token = localStorage.getItem("token");

    try {
        const url = `${config.apiUrl}/leave-form/${row.leave_form_id}/status`;
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "accept": "application/json"
            },
            body: JSON.stringify({ form_status: type })
        });

        if (res.ok) {
            await refreshLeave();
            // Close confirm modal before showing success
            closeConfirm(); 
            
            showSuccess(
                'Success!',
                undefined, // message
                type,      // action
                type === 'approved' ? 'emerald' : 'rose', // actionColor
                `The request has been successfully ${type}.` // customMessage
            );
        } else {
            const errorData = await res.json().catch(() => ({}));
            showConfirm(
                'Error',
                errorData.detail || "Failed to update status",
                () => Promise.resolve(),
                'OK',
                '',
                'error',
                false
            );
        }
    } catch (err) {
            showConfirm(
                'Network Error',
                'Failed to connect to server. Please try again.',
                () => Promise.resolve(),
                'OK',
                '',
                'error',
                false
            );
        }
    };

    const handleApprove = (row: any) => {
        setSelectedRow(row);
        setActionType("approved");
        showConfirm(
            'Confirm Approval',
            `You are about to approve this leave request this user.`,
            () => handleAction(row, "approved"), // Pass params directly here
            'Approve',
            'Cancel',
            'warning'
        );
    };

    const handleReject = (row: any) => {
        setSelectedRow(row);
        setActionType("rejected");
        showConfirm(
            'Confirm Rejection',
            `You are about to reject this leave request for user.`,
            () => handleAction(row, "rejected"), // Pass params directly here
            'Reject',
            'Cancel',
            'warning'
        );
    };

    return (
        <div className="h-screen bg-slate-50 font-sans text-slate-900 flex flex-col overflow-hidden">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm flex-shrink-0">
                <Header />
            </header>

            <main className="flex-1 min-h-0 flex flex-col px-6 py-8 overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 flex-shrink-0">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Leave Management</h1>
                        <p className="text-slate-500 mt-1">
                            Review and manage employee leave requests
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col flex-1 min-h-0 overflow-hidden">
                    <div className="flex-1 min-h-0 overflow-auto">
                        <div className="min-w-full inline-block align-middle">
                            <table className="min-w-full border-collapse">
                                <thead className="sticky top-0 z-10 bg-slate-50">
                                    <tr className="border-b border-slate-200">
                                        <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Employee</th>
                                        <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Department</th>
                                        <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Leave Type</th>
                                        <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Reason</th>
                                        <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Duration</th>
                                        <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Total Days</th>
                                        <th className="px-6 py-5 text-right text-xs font-bold text-slate-400 uppercase tracking-widest sticky right-0 bg-slate-50">Decision</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={7} className="p-20 text-center text-slate-400 animate-pulse">Loading...</td>
                                        </tr>
                                    ) : totalItems === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-10 text-center">
                                                <div className="flex flex-col items-center justify-center text-slate-400">
                                                    <Inbox size={30} className="mb-2 opacity-20" />
                                                    <p className="text-lg font-medium">No pending requests to display.</p>
                                                    <p className="text-sm mt-1">
                                                        {hasFullAccess 
                                                            ? 'All leave requests have been processed.' 
                                                            : 'You don\'t have any leave requests awaiting your approval.'}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedData.map((row, idx) => {
                                            const staffMember = allStaffList?.find(s => s.staff_id === row.staff_id);
                                            const isHRStaff = staffMember && 
                                                (staffMember.department?.dept_name === "HR/Admin" || 
                                                 staffMember.department?.dept_name === "HR" || 
                                                 staffMember.department?.dept_name === "Admin");
                                            
                                            return (
                                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 transition-colors">
                                                                <User size={18} />
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-slate-700">
                                                                    {staffMember?.staff_name || row.staff_name || "Unknown"}
                                                                </div>
                                                                <div className="text-[11px] font-mono text-slate-400">ID: {row.staff_id}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="text-sm text-slate-700">
                                                            {staffMember?.department?.dept_name || "-"}
                                                        </div>
                                                        <div className="text-xs text-slate-400 mt-0.5">
                                                            {staffMember?.staff_position || "-"}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className={`inline-flex w-fit px-2 py-0.5 rounded text-[10px] font-black uppercase border ${
                                                            row.leave_type?.toLowerCase() === 'sick' 
                                                                ? 'bg-red-50 text-red-600 border-red-100'
                                                                : row.leave_type?.toLowerCase() === 'annual'
                                                                ? 'bg-green-50 text-green-600 border-green-100'
                                                                : 'bg-blue-50 text-blue-600 border-blue-100'
                                                        }`}>
                                                            {row.leave_type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 min-w-[250px] max-w-[300px]">
                                                        <ReasonCell reason={row.reason} />
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 rounded-lg px-3 py-1.5 border border-slate-100 w-fit">
                                                            <Calendar size={14} className="text-slate-400" />
                                                            <span>{row.req_leave_date_from}</span>
                                                            <span className="text-slate-300">→</span>
                                                            <span>{row.req_leave_date_to}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 rounded-lg px-3 py-1.5 border border-slate-100 w-fit">
                                                            <span>{row.total_leave_day} day(s)</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-right sticky right-0 bg-white group-hover:bg-slate-50/50 transition-colors">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => handleApprove(row)}
                                                                className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100"
                                                            >
                                                                APPROVE
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(row)}
                                                                className="px-4 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-600 hover:text-white transition-all border border-rose-100"
                                                            >
                                                                REJECT
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    {totalItems > 0 && (
                        <div className="border-t border-slate-200 bg-white flex-shrink-0">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={totalItems}
                                itemsPerPage={itemsPerPage}
                                startIndex={startIndex}
                                onPageChange={setCurrentPage}
                                onItemsPerPageChange={(newSize) => { setItemsPerPage(newSize); setCurrentPage(1); }}
                            />
                        </div>
                    )}
                </div>

                <div className="mt-6 text-xs text-center text-slate-400 border-t pt-6 flex-shrink-0">
                    © 2026 Attendance Management System by <span className="font-bold text-slate-500">MODOS</span>. All rights reserved.
                </div>
            </main>

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirm}
                onConfirm={confirmModal.onConfirm}
                type={confirmModal.type}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                cancelText={confirmModal.cancelText}
                showCancel={confirmModal.showCancel}
                isLoading={confirmModal.isLoading}
            />

            <SuccessModal
                isOpen={successModal.isOpen}
                onClose={closeSuccess}
                title={successModal.title}
                message={successModal.message}
                action={successModal.action}
                actionColor={successModal.actionColor}
                customMessage={successModal.customMessage}
            />
        </div>
    );
};

export default LeaveApprove;