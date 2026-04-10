import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAttendance } from '../hooks/useAttendance';
import { useStaffData } from '../hooks/useStaffData';
import { useLeaveRequest } from '../hooks/useLeaveRequest';
import { LeaveTable } from '../components/leaveform/LeaveTable';
import { LeaveModal } from '../components/leaveform/LeaveModal';
import { DeleteModal } from '../components/leaveform/DeleteModal';
import Header from '../components/profile/Header';
import { LeaveTableRow } from '../types/leave.types';

const LeaveRequest: React.FC = () => {
    const navigate = useNavigate();
    const { staff } = useAttendance();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const { staffId } = useStaffData(user.user_id);
    const { formData, error, handleInputChange, handleCheckboxChange, handleFileChange, submitLeaveRequest, setFormData } = useLeaveRequest(staffId);
    
    const [showModal, setShowModal] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    // Mock data - replace with actual API call
    const tableData: LeaveTableRow[] = [
        {
            id: '1',
            staffNo: '26-00318',
            staffName: 'Nway',
            leaveType: 'Casual',
            fromDate: '2026-03-15',
            toDate: '2026-03-15',
            reason: 'Sick',
            status: 'Pending..'
        },
        // Add more rows as needed
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await submitLeaveRequest();
        if (success) {
            setShowModal(false);
            // Refresh data here
        }
    };

    const handleEdit = (row: LeaveTableRow) => {
        // Populate formData with row data for editing
        setFormData(prev => ({
            ...prev,
            // Map row data to form fields
        }));
        setShowUpdate(true);
    };

    if (!staff) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
            <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
                <Header />
            </header>

            <main className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex justify-end mb-6">
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                            ADD
                        </button>
                        <button
                            onClick={() => setShowDelete(true)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                            Delete
                        </button>
                    </div>
                </div>

                <LeaveTable data={tableData} onEdit={handleEdit} />

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
                    onClose={() => setShowDelete(false)}
                    onConfirm={() => {
                        console.log("Deleted");
                        setShowDelete(false);
                    }}
                />

                <div className="mt-6 text-xs text-center text-slate-400 border-t pt-6">
                    © 2026 Attendance Management System by MODOS. All rights reserved.
                </div>
            </main>
        </div>
    );
};

export default LeaveRequest;