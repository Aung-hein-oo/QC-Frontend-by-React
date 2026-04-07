import { useState, useEffect } from 'react';
import { ArrowLeft, X, Send, AlertTriangle, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAttendance } from '../hooks/useAttendance';
import Header from '../components/attendance/Header';
const API_URL = 'http://192.168.250.1:8065';
const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
type LeaveModalType = {
    staff_id: string;
    start_date: string;
    end_date: string;
    leave_type: string;
    reason: string;
    approver: string[]
    leave_status?: string;
    attachment: string;
    total_leave_day: number;
    apply_date: string,
};
const LeaveRequest: React.FC = () => {
    const navigate = useNavigate();
    const { staff } = useAttendance();

    //const [balance] = useState<LeaveBalance[]>([]);
    const [formData, setFormData] = useState<LeaveModalType>({
        staff_id: '',
        start_date: '',
        end_date: '',
        leave_type: '',
        reason: '',
        approver: [],
        leave_status: '',
        attachment: '',
        total_leave_day: 0,
        apply_date: today,
    });

    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const attachmentRequiredTypes = ['married', 'maternity', 'medical'];
    const handleDelete = () => {
        console.log("Deleted");
        // your delete logic here
    };

    // ✅ Fetch staff info
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        const fetchStaffDetails = async () => {
            try {
                const res = await fetch(`${API_URL}/staff/${user.user_id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setFormData(prev => ({
                        ...prev,
                        staff_id: data.staff_id
                    }));
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchStaffDetails();
    }, []);

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const updated = { ...prev, [name]: value };

            // If leave_type changed to a type that does NOT require attachment, clear it
            if (name === 'leave_type' && !attachmentRequiredTypes.includes(value)) {
                updated.attachment = '';
            }

            // Only calculate no_of_day if start_date and end_date exist
            if (updated.start_date && updated.end_date) {
                const start = new Date(updated.start_date);
                const end = new Date(updated.end_date);

                const diffTime = end.getTime() - start.getTime();

                // Total days (inclusive)
                let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

                if (updated.leave_status === "half") {
                    if (diffDays === 1) {
                        // Same day → half day
                        updated.total_leave_day = 0.5;
                    } else {
                        // Multiple days → last day is half
                        updated.total_leave_day = (diffDays - 1) + 0.5;
                    }
                } else {
                    // Full leave
                    updated.total_leave_day = diffDays > 0 ? diffDays : 0;
                }

            } else {
                updated.total_leave_day = 0;
            }

            return updated;
        });

        setError('');
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!formData.start_date || !formData.end_date || !formData.leave_type || !formData.reason) {
            setError('Please fill in all fields');
            return;
        }

        if (new Date(formData.start_date) > new Date(formData.end_date)) {
            setError('Start date cannot be after end date');
            return;
        }

        try {
            const token = localStorage.getItem('token');

            const res = await fetch(`${API_URL}/leave-requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setShowModal(false); // ✅ close modal
            } else {
                const errData = await res.json();
                setError(errData.message || 'Error');
            }
        } catch {
            setError('Network error');
        }
    };

    const leaveTypes = [
        { value: 'casual', label: 'Casual Leave' },
        { value: 'earn', label: 'Earn Leave' },
        { value: 'healthCare', label: 'Family Funeral or Health Care Leave' },
        { value: 'withPay', label: 'Leave With Pay' },
        { value: 'without', label: 'Leave Without Pay' },
        { value: 'married', label: 'Married Leave' },
        { value: 'maternity', label: 'Maternity Leave' },
        { value: 'medical', label: 'Medical Leave' }
    ];

    if (!staff) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">

            {/* HEADER */}
            <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
                <Header />
            </header>

            <main className="max-w-7xl mx-auto px-4 py-6">
                {/* TOP BAR */}
                <div className="flex justify-between mb-6">
                    {/* LEFT: Back Button */}
                    <button
                        onClick={() => navigate('/user_profile')}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to UserProfile
                    </button>

                    {/* RIGHT: Action Buttons */}
                    <div className="flex justify-end gap-3">
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

                {/* TABLE (UNCHANGED) */}
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
                                <tr>
                                    <td className="px-4 py-3 w-10 text-center">
                                        <input type="checkbox" />
                                    </td>
                                    <td className="px-6 py-4">26-00318</td>
                                    <td className="px-6 py-4">Nway</td>
                                    <td className="px-6 py-4">Casual</td>
                                    <td className="px-6 py-4">2026-03-15</td>
                                    <td className="px-6 py-4">2026-03-15</td>
                                    <td className="px-6 py-4">Sick</td>
                                    <td className="px-6 py-4">Pending..</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => setShowUpdate(true)}
                                            className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm">
                                            <Pencil size={16} />
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 w-10 text-center">
                                        <input type="checkbox" />
                                    </td>
                                    <td className="px-6 py-4">26-00318</td>
                                    <td className="px-6 py-4">Nway Nandar Myint</td>
                                    <td className="px-6 py-4">Family Funeral or Health Care Leave</td>
                                    <td className="px-6 py-4">2026-03-27</td>
                                    <td className="px-6 py-4">2026-03-27</td>
                                    <td className="px-6 py-4">Sick</td>
                                    <td className="px-6 py-4">Pending..</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => setShowUpdate(true)}
                                            className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm">
                                            <Pencil size={16} />
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ADD MODAL */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                        {/* MODAL BOX (your UI inside) */}
                        <div className="w-full max-w-3xl">
                            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                                {/* HEADER */}
                                <div className="border-b px-6 py-4 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-2xl font-bold">Submit Leave Request</h2>
                                        <p className="text-slate-500 mt-1">
                                            Please complete the form below to submit your leave request.
                                        </p>
                                    </div>
                                    {/* CLOSE BUTTON */}
                                    <button onClick={() => setShowModal(false)}>
                                        <X className="text-slate-500 hover:text-red-500" />
                                    </button>
                                </div>

                                {/* FORM (UNCHANGED UI) */}
                                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                    {error && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                                            <X className="text-red-500 mt-0.5" size={18} />
                                            <p className="text-red-700 text-sm">{error}</p>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Staff ID
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.staff_id}
                                                readOnly
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Leave Type *
                                            </label>
                                            <select
                                                name="leave_type"
                                                value={formData.leave_type}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                                required
                                            >
                                                <option value="">Select leave type</option>
                                                {leaveTypes.map(type => (
                                                    <option key={type.value} value={type.value}>
                                                        {type.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Start Date *
                                            </label>
                                            <input
                                                type="date"
                                                name="start_date"
                                                value={formData.start_date}
                                                onChange={handleInputChange}
                                                // min={formData.start_date || new Date().toISOString().split("T")[0]}
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                End Date *
                                            </label>
                                            <input
                                                type="date"
                                                name="end_date"
                                                value={formData.end_date}
                                                onChange={handleInputChange}
                                                // min={formData.start_date || new Date().toISOString().split("T")[0]}
                                                min={formData.start_date ? formData.start_date : new Date().toISOString().split("T")[0]}
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                                required
                                            />
                                        </div>
                                        {/* Leave Status */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Leave Status *
                                            </label>
                                            <div className="flex gap-6">
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="radio"
                                                        name="leave_status"
                                                        value="full"
                                                        checked={formData.leave_status === 'full'}
                                                        onChange={handleInputChange}
                                                        className="text-blue-600 focus:ring-blue-500"
                                                    />
                                                    Full Day
                                                </label>
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="radio"
                                                        name="leave_status"
                                                        value="half"
                                                        checked={formData.leave_status === 'half'}
                                                        onChange={handleInputChange}
                                                        className="text-blue-600 focus:ring-blue-500"
                                                    />
                                                    Half Day
                                                </label>
                                            </div>
                                        </div>
                                        {/* Total Leave Day */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Total Leave Day
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.total_leave_day}
                                                readOnly
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Approver *
                                            </label>
                                            <div className="flex items-center gap-6">
                                                {/* Ma Kay */}
                                                <label className="flex items-center gap-2 text-sm text-slate-600">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.approver.includes('makay')}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                // add
                                                                setFormData((prev: any) => ({
                                                                    ...prev,
                                                                    approver: [...prev.approver, 'makay']
                                                                }));
                                                            } else {
                                                                // remove
                                                                setFormData((prev: any) => ({
                                                                    ...prev,
                                                                    approver: prev.approver.filter((a: string) => a !== 'makay')
                                                                }));
                                                            }
                                                        }}
                                                        className="w-4 h-4 text-blue-600 border-slate-300 rounded"
                                                    />
                                                    Ma Kay
                                                </label>
                                                {/* Ma Thae */}
                                                <label className="flex items-center gap-2 text-sm text-slate-600">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.approver.includes('mathae')}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setFormData((prev: any) => ({
                                                                    ...prev,
                                                                    approver: [...prev.approver, 'mathae']
                                                                }));
                                                            } else {
                                                                setFormData((prev: any) => ({
                                                                    ...prev,
                                                                    approver: prev.approver.filter((a: string) => a !== 'mathae')
                                                                }));
                                                            }
                                                        }}
                                                        className="w-4 h-4 text-blue-600 border-slate-300 rounded"
                                                    />
                                                    Ma Thae
                                                </label>
                                                <label className="flex items-center gap-2 text-sm text-slate-600">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.approver.includes('amthiri')}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setFormData((prev: any) => ({
                                                                    ...prev,
                                                                    approver: [...prev.approver, 'amthiri']
                                                                }));
                                                            } else {
                                                                setFormData((prev: any) => ({
                                                                    ...prev,
                                                                    approver: prev.approver.filter((a: string) => a !== 'amthiri')
                                                                }));
                                                            }
                                                        }}
                                                        className="w-4 h-4 text-blue-600 border-slate-300 rounded"
                                                    />
                                                    Ma Thiri
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Applied Date
                                            </label>
                                            <input
                                                name="apply_date"
                                                value={formData.apply_date}
                                                readOnly
                                                //onChange={handleInputChange}
                                                // min={formData.start_date || new Date().toISOString().split("T")[0]}
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed"
                                                required
                                            />
                                        </div>
                                    </div>
                                    {/* Reason */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Reason for Leave *
                                        </label>
                                        <textarea
                                            name="reason"
                                            value={formData.reason}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full px-4 py-1 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none transition resize-none"
                                            placeholder="Please provide details about your leave request..."
                                            required
                                        />
                                    </div>
                                    {/* Attachment File - only show for certain leave types */}
                                    {attachmentRequiredTypes.includes(formData.leave_type) && (
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Attachment File *
                                            </label>
                                            <input
                                                type="file"
                                                onChange={(e) =>
                                                    setFormData((prev: any) => ({
                                                        ...prev,
                                                        attachment: e.target.files && e.target.files[0] ? e.target.files[0].name : ''
                                                    }))
                                                }
                                                className="w-full text-sm text-slate-600 border border-slate-300 rounded-lg p-2"
                                                required
                                            />
                                        </div>
                                    )}
                                    {/* BUTTONS */}
                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            <Send size={15} /><span>Submit</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="px-6 py-2.5 border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* DELETE MODAL */}
                {showDelete && (
                    <div className="fixed inset-0 flex items-start justify-center bg-black/20 pt-20 z-50">
                        <div className="bg-white rounded-xl shadow-xl w-96 p-6 animate-fade-in">
                            {/* Icon + Title */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-red-100 p-2 rounded-full">
                                    <AlertTriangle className="text-red-600 w-6 h-6" />
                                </div>
                                <h2 className="text-lg font-semibold text-slate-800">
                                    Confirm Delete
                                </h2>
                            </div>
                            {/* Message */}
                            <p className="text-sm text-slate-600 mb-6">
                                Are you sure you want to delete this record? This action cannot be undone.
                            </p>
                            {/* Buttons */}
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setShowDelete(false)} className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                                    Cancel
                                </button>
                                <button onClick={handleDelete} className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Update MODAL */}
                {showUpdate && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                        {/* MODAL BOX (your UI inside) */}
                        <div className="w-full max-w-3xl">
                            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                                {/* HEADER */}
                                <div className="border-b px-6 py-4 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-2xl font-bold">Update Leave Request</h2>
                                        <p className="text-slate-500 mt-1">
                                            Please provide the required information to apply for leave.
                                        </p>
                                    </div>
                                    {/* CLOSE BUTTON */}
                                    <button onClick={() => setShowUpdate(false)}>
                                        <X className="text-slate-500 hover:text-red-500" />
                                    </button>
                                </div>

                                {/* FORM (UNCHANGED UI) */}
                                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                    {error && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                                            <X className="text-red-500 mt-0.5" size={18} />
                                            <p className="text-red-700 text-sm">{error}</p>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Staff ID
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.staff_id}
                                                readOnly
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Leave Type *
                                            </label>
                                            <select
                                                name="leave_type"
                                                value={formData.leave_type}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                                required
                                            >
                                                <option value="">Select leave type</option>
                                                {leaveTypes.map(type => (
                                                    <option key={type.value} value={type.value}>
                                                        {type.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Start Date *
                                            </label>
                                            <input
                                                type="date"
                                                name="start_date"
                                                value={formData.start_date}
                                                onChange={handleInputChange}
                                                // min={formData.start_date || new Date().toISOString().split("T")[0]}
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                End Date *
                                            </label>
                                            <input
                                                type="date"
                                                name="end_date"
                                                value={formData.end_date}
                                                onChange={handleInputChange}
                                                // min={formData.start_date || new Date().toISOString().split("T")[0]}
                                                min={formData.start_date ? formData.start_date : new Date().toISOString().split("T")[0]}
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                                required
                                            />
                                        </div>
                                        {/* Leave Status */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Leave Status *
                                            </label>
                                            <div className="flex gap-6">
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="radio"
                                                        name="leave_status"
                                                        value="full"
                                                        checked={formData.leave_status === 'full'}
                                                        onChange={handleInputChange}
                                                        className="text-blue-600 focus:ring-blue-500"
                                                    />
                                                    Full Day
                                                </label>
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="radio"
                                                        name="leave_status"
                                                        value="half"
                                                        checked={formData.leave_status === 'half'}
                                                        onChange={handleInputChange}
                                                        className="text-blue-600 focus:ring-blue-500"
                                                    />
                                                    Half Day
                                                </label>
                                            </div>
                                        </div>
                                        {/* Total Leave Day */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Total Leave Day
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.total_leave_day}
                                                readOnly
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Approver *
                                            </label>
                                            <div className="flex items-center gap-6">
                                                {/* Ma Kay */}
                                                <label className="flex items-center gap-2 text-sm text-slate-600">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.approver.includes('makay')}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                // add
                                                                setFormData((prev: any) => ({
                                                                    ...prev,
                                                                    approver: [...prev.approver, 'makay']
                                                                }));
                                                            } else {
                                                                // remove
                                                                setFormData((prev: any) => ({
                                                                    ...prev,
                                                                    approver: prev.approver.filter((a: string) => a !== 'makay')
                                                                }));
                                                            }
                                                        }}
                                                        className="w-4 h-4 text-blue-600 border-slate-300 rounded"
                                                    />
                                                    Ma Kay
                                                </label>
                                                {/* Ma Thae */}
                                                <label className="flex items-center gap-2 text-sm text-slate-600">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.approver.includes('mathae')}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setFormData((prev: any) => ({
                                                                    ...prev,
                                                                    approver: [...prev.approver, 'mathae']
                                                                }));
                                                            } else {
                                                                setFormData((prev: any) => ({
                                                                    ...prev,
                                                                    approver: prev.approver.filter((a: string) => a !== 'mathae')
                                                                }));
                                                            }
                                                        }}
                                                        className="w-4 h-4 text-blue-600 border-slate-300 rounded"
                                                    />
                                                    Ma Thae
                                                </label>
                                                <label className="flex items-center gap-2 text-sm text-slate-600">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.approver.includes('amthiri')}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setFormData((prev: any) => ({
                                                                    ...prev,
                                                                    approver: [...prev.approver, 'amthiri']
                                                                }));
                                                            } else {
                                                                setFormData((prev: any) => ({
                                                                    ...prev,
                                                                    approver: prev.approver.filter((a: string) => a !== 'amthiri')
                                                                }));
                                                            }
                                                        }}
                                                        className="w-4 h-4 text-blue-600 border-slate-300 rounded"
                                                    />
                                                    Ma Thiri
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Applied Date
                                            </label>
                                            <input
                                                name="apply_date"
                                                value={formData.apply_date}
                                                readOnly
                                                //onChange={handleInputChange}
                                                // min={formData.start_date || new Date().toISOString().split("T")[0]}
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed"
                                                required
                                            />
                                        </div>
                                    </div>
                                    {/* Reason */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Reason for Leave *
                                        </label>
                                        <textarea
                                            name="reason"
                                            value={formData.reason}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full px-4 py-1 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none transition resize-none"
                                            placeholder="Please provide details about your leave request..."
                                            required
                                        />
                                    </div>
                                    {/* Attachment File - only show for certain leave types */}
                                    {attachmentRequiredTypes.includes(formData.leave_type) && (
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Attachment File *
                                            </label>
                                            <input
                                                type="file"
                                                onChange={(e) =>
                                                    setFormData((prev: any) => ({
                                                        ...prev,
                                                        attachment: e.target.files && e.target.files[0] ? e.target.files[0].name : ''
                                                    }))
                                                }
                                                className="w-full text-sm text-slate-600 border border-slate-300 rounded-lg p-2"
                                                required
                                            />
                                        </div>
                                    )}
                                    {/* BUTTONS */}
                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            <Send size={15} /><span>Update</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowUpdate(false)}
                                            className="px-6 py-2.5 border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
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

export default LeaveRequest;