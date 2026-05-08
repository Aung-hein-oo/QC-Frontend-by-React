import { CheckCircle, XCircle, User, Calendar, Download } from 'lucide-react';
import { useState } from 'react';
import Header from '../components/profile/Header';
import { useLeaveApprove } from '../hooks/useLeaveApprove';
import { config } from '../utils/config';
import { Pagination } from '../components/common/Pagination';
import { useAttendance } from '../hooks//useAttendance';

const LeaveApprove: React.FC = () => {
    const { leaveList, loading, refreshLeave } = useLeaveApprove();
    const [showConfirm, setShowConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false); // ✅ New State for Success
    const [actionType, setActionType] = useState("");
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const { allStaffList } = useAttendance();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const totalItems = leaveList.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = leaveList.slice(startIndex, startIndex + itemsPerPage);
    const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

    const handleAction = async () => {
        if (!selectedRow || !selectedRow.leave_form_id) return;
        const token = localStorage.getItem("token");

        try {
            const url = `${config.apiUrl}/leave-form/${selectedRow.leave_form_id}/status`;
            const res = await fetch(url, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "accept": "application/json"
                },
                body: JSON.stringify({ form_status: actionType })
            });

            if (res.ok) {
                await refreshLeave();
                setShowConfirm(false);
                setShowSuccess(true); // ✅ Show Success Modal

                // Auto-close success modal after 2 seconds
                setTimeout(() => setShowSuccess(false), 2500);
            } else {
                const errorData = await res.json().catch(() => ({}));
                alert(`Error: ${errorData.detail || "Failed to update status"}`);
            }
        } catch (err) {
            alert("Network error occurred.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <Header />
            </header>

            <main className="flex-1 min-h-0 overflow-hidden px-6 py-8">
                {/* ... (Keep your existing TOP FRAME and TABLE as is) ... */}

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Leave Manage</h1>
                        <p className="text-slate-500 mt-1 italic">Review and manage employee leave Requests</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-black shadow-xl shadow-slate-200/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Employee</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">LeaveType</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Reason</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Duration</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">TotalDuration</th>
                                    <th className="px-6 py-5 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">Decision</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan={5} className="p-20 text-center text-slate-400 animate-pulse">Loading...</td></tr>
                                ) : totalItems === 0 ? (
                                    <tr><td colSpan={5} className="p-20 text-center text-slate-300 italic font-medium">No pending requests to display.</td></tr>
                                ) : (
                                    paginatedData.map((row, idx) => {
                                        const isThisRowExpanded = expandedRowId === row.leave_form_id;
                                        return (
                                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 transition-colors">
                                                            <User size={18} />
                                                        </div>
                                                        <div>
                                                            {/* Find the name from allStaffList using the ID */}
                                                            <div className="font-bold text-slate-700">
                                                                {allStaffList?.find(s => s.staff_id === row.staff_id)?.staff_name || row.staff_name || "Unknown"}
                                                            </div>
                                                            <div className="text-[11px] font-mono text-slate-400">ID: {row.staff_id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="inline-flex w-fit px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-black uppercase border border-blue-100">
                                                            {row.leave_type}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col gap-1">
                                                        <p className={`text-sm text-slate-400 italic transition-all duration-200 ${isThisRowExpanded ? "whitespace-normal" : "line-clamp-1 max-w-[200px]"
                                                            }`}>
                                                            {row.reason}
                                                        </p>
                                                        {row.reason?.length > 30 && (
                                                            <button
                                                                onClick={() => setExpandedRowId(isThisRowExpanded ? null : row.leave_form_id)}
                                                                className="text-[10px] text-indigo-500 font-bold hover:text-indigo-700 mt-0.5 underline decoration-dotted text-left"
                                                            >
                                                                {isThisRowExpanded ? "Show Less" : "See More"}
                                                            </button>
                                                        )}
                                                    </div>
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
                                                        <span>{row.total_leave_day}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => { setSelectedRow(row); setActionType("approved"); setShowConfirm(true); }}
                                                            className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100"
                                                        >
                                                            APPROVE
                                                        </button>
                                                        <button
                                                            onClick={() => { setSelectedRow(row); setActionType("rejected"); setShowConfirm(true); }}
                                                            className="px-4 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-600 hover:text-white transition-all border border-rose-100"
                                                        >
                                                            REJECT
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
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

                <div className="mt-6 text-xs text-center text-slate-400 border-t pt-6">
                    © 2026 Attendance Management System by <span className="font-bold text-slate-500">MODOS</span>. All rights reserved.
                </div>
            </main>

            {/* 1. CONFIRMATION MODAL */}
            {showConfirm && (
                <div className="fixed inset-0 flex items-start justify-center bg-black/20 pt-20 z-50">
                    {/* Backdrop - Click to close */}
                    <div
                        className="flex justify-end gap-3"
                        onClick={() => setShowConfirm(false)}
                    />

                    {/* Modal Card */}
                    <div className="bg-white rounded-xl shadow-xl w-80 p-5 animate-fade-in text-center">

                        {/* Status Icon */}
                        <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${actionType?.toLowerCase() === "approve" || actionType?.toLowerCase() === "approved"
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-rose-100 text-rose-600"
                            }`}>
                            {actionType?.toLowerCase() === "approve" || actionType?.toLowerCase() === "approved" ? (
                                <CheckCircle size={32} />
                            ) : (
                                <XCircle size={32} />
                            )}
                        </div>

                        {/* Content */}
                        <h2 className="text-lg font-black text-slate-800 text-center">Are you sure?</h2>
                        <p className="text-slate-500 text-sm mt-2 mb-6 italic leading-relaxed text-center">
                            You are about to <span className={`font-bold ${actionType?.toLowerCase() === "approve" || actionType?.toLowerCase() === "approved"
                                ? "text-emerald-600" : "text-rose-600"
                                }`}>
                                {actionType}
                            </span> the leave request.<br />
                        </p>
                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="py-3 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-colors uppercase text-[11px] tracking-wider"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    handleAction(); // Your logic function
                                    setShowConfirm(false);
                                }}
                                className={`py-3 text-white font-black rounded-2xl shadow-lg transition-all active:scale-95 uppercase text-[11px] tracking-wider ${actionType?.toLowerCase() === "approve" || actionType?.toLowerCase() === "approved"
                                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                                    : "bg-rose-600 hover:bg-rose-700 shadow-rose-200"
                                    }`}
                            >
                                {actionType}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* 2. ✅ SUCCESS MODAL */}
            {showSuccess && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-emerald-900/20 backdrop-blur-[2px]" />
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xs p-8 text-center animate-in zoom-in slide-in-from-bottom-4 duration-300">
                        <div className="mx-auto w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-200">
                            <CheckCircle size={48} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Success!</h2>
                        <p className="text-slate-500 text-sm mt-2 font-medium">
                            The leave request has been successfully <span className="text-emerald-600 font-bold uppercase">{actionType}</span>.
                        </p>
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="mt-8 w-full py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveApprove;