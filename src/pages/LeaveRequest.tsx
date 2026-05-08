import React, { useState } from 'react';
import { useAttendance } from '../hooks/useAttendance';
import { useLeaveRequest } from '../hooks/useLeaveRequest';
import { useLeaveData } from '../hooks/useLeaveData';
import { LeaveTable } from '../components/leaveform/LeaveTable';
import { LeaveModal } from '../components/leaveform/LeaveModal';
import { DeleteModal } from '../components/leaveform/DeleteModal';
import Header from '../components/profile/Header';
import { LeaveTableRow } from '../types/leave.types';
import { config } from '../utils/config';
import { useStaffManagement } from '../hooks/useStaffManagement';

const LeaveRequest: React.FC = () => {
    const { staff } = useAttendance();

    const { staffList } = useStaffManagement();
    // Fetch and filter leave records
    const { leaveRecords, loading, refreshLeave } = useLeaveData(staff?.staff_id);

    // 3. Setup leave request logic
    const {
        formData,
        error,
        handleInputChange,
        handleCheckboxChange,
        handleFileChange,
        submitLeaveRequest,
        setFormData
    } = useLeaveRequest(staff?.staff_id || "");

    const [showModal, setShowModal] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [selectedRow, setSelectedRow] = useState<LeaveTableRow | null>(null);
    const [showDelete, setShowDelete] = useState(false);

    // Map API fields to Table format
    const tableData: LeaveTableRow[] = leaveRecords.map((item) => ({
        id: item.leave_form_id.toString(),
        staffNo: item.staff_id,
        staffName: staff?.staff_name || 'My Record',
        leaveType: item.leave_type,
        fromDate: item.req_leave_date_from,
        toDate: item.req_leave_date_to,
        reason: item.reason,
        status: item.form_status,
        total: item.total_leave_day,
        approved_by: item.approved_by || [],
    }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await submitLeaveRequest();
        if (success) {
            setShowModal(false);
            setShowUpdate(false);
            refreshLeave();
        }
    };

    const handleEdit = (row: LeaveTableRow) => {
        // 1. Create a helper to map the display text to your specific constant values
    const mapLabelToValue = (label: string) => {
        const cleanLabel = label.toLowerCase().trim();
        
        // Manual mapping for the "special" camelCase values in your LEAVE_TYPES
        if (cleanLabel.includes('health')) return 'healthCare';
        if (cleanLabel.includes('with pay') && !cleanLabel.includes('without')) return 'withPay';
        if (cleanLabel.includes('without')) return 'without';
        if (cleanLabel.includes('casual')) return 'casual';
        if (cleanLabel.includes('earn')) return 'earn';
        if (cleanLabel.includes('married')) return 'married';
        if (cleanLabel.includes('maternity')) return 'maternity';
        if (cleanLabel.includes('paternity')) return 'paternity';
        if (cleanLabel.includes('medical')) return 'medical';
        
        return cleanLabel; // Fallback
    };
        setFormData((prev: any) => ({
            ...prev,
            staff_id: row.staffNo,
            req_leave_date_from: row.fromDate,
            req_leave_date_to: row.toDate,
            leave_type: mapLabelToValue(row.leaveType),
            reason: row.reason,
            total_leave_day: row.total,
            leave_form_id: parseInt(row.id),
            approved_by: row.approved_by,
        }));

        setShowUpdate(true);
    };

    const handleDelete = (row: LeaveTableRow) => {
        setSelectedRow(row);   // ✅ no error
        setShowDelete(true);
    };

    if (!staff || loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="animate-pulse text-gray-500 font-medium">Loading Leave Records...</div>
            </div>
        );
    }

    const confirmDelete = async () => {
        if (!selectedRow) return;

        try {
            const res = await fetch(`${config.apiUrl}/leave-form/${selectedRow.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (res.ok) {
                alert("Delete request successfully!");

                setShowDelete(false);
                setSelectedRow(null);
                refreshLeave(); // 🔥 refresh table

            } else {
                const err = await res.json();
                console.error("Delete failed:", err);
            }
        } catch (err) {
            console.error("Network error:", err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
            <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
                <Header />
            </header>

            <main className="flex-1 min-h-0 overflow-hidden px-6 py-8">
                {/* Page Header Container */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Leave Request</h1>
                        <p className="text-slate-500 mt-1 italic">Manage and request staff leave applications</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Optional: Add a search or filter icon button here later */}
                        <button
                            onClick={() => {
                                setFormData((prev: any) => ({ ...prev, leave_form_id: 0 }));
                                setShowModal(true);
                            }}
                            className="group flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all active:scale-95 text-sm font-bold shadow-lg shadow-blue-200"
                        >
                            {/* Plus Icon */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 transition-transform group-hover:rotate-90"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                            </svg>
                            ADD 
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <LeaveTable data={tableData} onEdit={handleEdit} onDelete={handleDelete} staffList={staffList || []} />
                </div>

                <LeaveModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleSubmit}
                    formData={formData}
                    onInputChange={handleInputChange}
                    onCheckboxChange={handleCheckboxChange}
                    onFileChange={handleFileChange}
                    error={error}
                    title="Submit Leave Request"
                    submitButtonText="Submit"
                />

                <LeaveModal
                    isOpen={showUpdate}
                    onClose={() => setShowUpdate(false)}
                    onSubmit={handleSubmit}
                    formData={formData}
                    onInputChange={handleInputChange}
                    onCheckboxChange={handleCheckboxChange}
                    onFileChange={handleFileChange}
                    error={error}
                    title="Update Leave Request"
                    submitButtonText="Update"
                />

                <DeleteModal
                    isOpen={showDelete}
                    onClose={() => {
                        setShowDelete(false);
                        setSelectedRow(null);
                    }}
                    onConfirm={confirmDelete} // 🔥 THIS IS KEY
                />

                <div className="mt-6 text-xs text-center text-slate-400 border-t pt-6">
                    © 2026 Attendance Management System by <span className="font-bold text-slate-500">MODOS</span>. All rights reserved.
                </div>
            </main>
        </div>
    );
};

export default LeaveRequest;