import { useNavigate } from 'react-router-dom';
import { useAttendance } from '../hooks/useAttendance';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import Header from '../components/profile/Header';

const LeaveApprove: React.FC = () => {
    const navigate = useNavigate();
    const { staff } = useAttendance();
    const [showConfirm, setShowConfirm] = useState(false);
    const [actionType, setActionType] = useState("");
    if (!staff) return null;


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">

            {/* HEADER */}
            <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
                <Header />
            </header>

            <main className="max-w-7xl mx-auto px-4 py-6">
                {/* TOP BAR */}
                <div className="flex justify-between mb-6">
                </div>

                {/* TABLE (UNCHANGED) */}
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    {['', 'StaffNO', 'StaffName', 'LeaveType', 'FromDate', 'ToDate', 'Reason', 'Actions', 'Attachment'].map(h => (
                                        <th key={h} className="px-6 py-4 text-left text-sm font-semibold">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                <tr>
                                    <td className="px-4 py-3 w-10 text-center">
                                        <input type="checkbox" />
                                    </td>
                                    <td className="px-6 py-4">26-00318</td>
                                    <td className="px-6 py-4">Nway</td>
                                    <td className="px-6 py-4">Casual</td>
                                    <td className="px-6 py-4">2026-03-15</td>
                                    <td className="px-6 py-4">2026-03-15</td>
                                    <td className="px-6 py-4">Family Funeral or Health Care Leave Family Funeral or Health Care Leave</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {/* Approve */}
                                            <button
                                                onClick={() => {
                                                    setActionType("Approve");
                                                    setShowConfirm(true);
                                                }}
                                                className="flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition text-sm"
                                            >
                                                Approve
                                            </button>

                                            {/* Reject */}
                                            <button
                                                onClick={() => {
                                                    setActionType("Reject");
                                                    setShowConfirm(true);
                                                }}
                                                className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm"
                                            >
                                                Reject
                                            </button>

                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <a
                                            href="/path/to/file.txt"
                                            download
                                            className="text-blue-600 hover:text-blue-800 underline"
                                        >
                                            Download
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                {showConfirm && (
                    <div className="fixed inset-0 flex items-start justify-center bg-black/20 pt-20 z-50">
                        <div className="bg-white rounded-xl shadow-xl w-96 p-6 animate-fade-in">

                            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                {actionType === "Approve" ? (
                                    <>
                                        <CheckCircle className="text-green-600" size={20} />
                                        Confirm Approve
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="text-red-600" size={20} />
                                        Confirm Reject
                                    </>
                                )}
                            </h2>

                            <p className="text-sm text-gray-600 mb-6">
                                Are you sure you want to {actionType} this leave request?
                            </p>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={() => {
                                        console.log(actionType);
                                        setShowConfirm(false);
                                    }}
                                    className={`px-4 py-2 text-white rounded-lg text-sm ${actionType === "Approve"
                                        ? "bg-green-600 hover:bg-green-700"
                                        : "bg-red-600 hover:bg-red-700"
                                        }`}
                                >
                                    {actionType}
                                </button>
                            </div>

                        </div>
                    </div>
                )}
                <div className="mt-6 text-xs text-center text-slate-400 border-t pt-6">
                    © 2026 Attendance Management System by MODOS. All rights reserved.
                </div>
            </main>
        </div>
    );
};

export default LeaveApprove;