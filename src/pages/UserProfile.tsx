import { Calendar, User } from 'lucide-react';
import { CheckCircle, Clock, XCircle, ArrowLeft, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserProfile: React.FC = () => {
    const navigate = useNavigate();

    const StatCard = ({ label, value, color, icon: Icon }: any) => (
        <div className="bg-white rounded-xl border p-5">
            <div className="flex justify-between">
                <div>
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className={`text-2xl font-bold ${color}`}>{value}</p>
                </div>
                <div className={`bg-${color.split('-')[1]}-100 p-3 rounded-lg`}>
                    <Icon className={`text-${color.split('-')[1]}-600`} size={24} />
                </div>
            </div>
        </div>
    );

    //   const handleLeaveRequest = () => {
    //     navigate('/leave');
    //   };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">

            {/* HEADER */}
            <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">

                    <div className="flex items-center gap-2">
                        <Calendar className="text-blue-600" size={28} />
                        <h1 className="text-xl font-semibold">AMS</h1>
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                            Employee
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <User size={18} />
                        <span className="font-medium">Nway</span>
                        <span className="text-xs text-slate-400">26-00318</span>
                    </div>

                </div>
            </header>

            {/* MAIN */}
            <main className="max-w-7xl mx-auto px-4 py-6">
                {/* Back Button */}
                {/* TOP ACTION BAR */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

                    {/* LEFT: Back Button */}
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Dashboard
                    </button>

                    {/* RIGHT: Action Buttons */}
                    <div className="flex gap-3">
                        <button onClick={() => navigate('/leave')}
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium">
                            <FileText size={16} />
                            Leave Request
                        </button>
                    </div>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* LEFT PROFILE */}
                    <div className="lg:col-span-3 flex justify-center">
                        <div className="bg-white p-6 rounded-xl shadow-sm w-full max-w-sm mx-auto">

                            {/* Profile Image */}
                            <div className="flex flex-col items-center">
                                {/* <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                                    <span className="text-gray-500 text-sm">Photo</span>
                                </div> */}
                                <img
                                    src="/female.jpg"
                                    alt="Profile"
                                    className="w-28 h-28 rounded-full object-cover mb-3"
                                />
                                <h2 className="text-lg font-semibold text-slate-800">
                                    Nway Nandar Myint
                                </h2>
                                <p className="text-sm text-slate-500">Programmer</p>
                            </div>

                            {/* Divider */}
                            <div className="border-t my-4"></div>

                            {/* Staff Info */}
                            <div className="text-sm space-y-3">

                                <div className="flex justify-between">
                                    <span className="text-slate-500">Staff No</span>
                                    <span className="font-medium text-slate-800">26-00318</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-slate-500">Department</span>
                                    <span className="font-medium text-slate-800">MODOS</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-slate-500">Service Year</span>
                                    <span className="font-medium text-slate-800">1 year</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-slate-500">Appointment Date</span>
                                    <span className="font-medium text-slate-800">15/08/2024</span>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* RIGHT CONTENT */}
                    <div className="lg:col-span-9 space-y-6">
                        {/* ATTENDANCE CARDS */}
                        <div>
                            <h2 className="text-lg font-semibold mb-3">Attendance Information</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <StatCard label="Working day pr Month" value="6" color="text-green-600" icon={CheckCircle} />
                                <StatCard label="Leave pr Month" value="3" color="text-red-600" icon={XCircle} />
                                <StatCard label="Half Leave pr Month" value="2" color="text-amber-600" icon={Clock} />
                            </div>

                        </div>

                        {/* TABLE */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <h3 className="p-4 font-semibold border-b">
                                Leave Balance Information
                            </h3>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">

                                    <thead className="bg-blue-600 text-white">
                                        <tr>
                                            <th className="p-2 text-left">Leave Type</th>
                                            <th className="p-2">Previous</th>
                                            <th className="p-2">Entitle</th>
                                            <th className="p-2">Taken</th>
                                            <th className="p-2">Balance</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr className="border-t">
                                            <td className="p-2">Casual Leave</td>
                                            <td className="text-center">0</td>
                                            <td className="text-center">6</td>
                                            <td className="text-center">3</td>
                                            <td className="text-center">3</td>
                                        </tr>

                                        <tr className="border-t">
                                            <td className="p-2">Earn Leave</td>
                                            <td className="text-center">0</td>
                                            <td className="text-center">5.8</td>
                                            <td className="text-center">0</td>
                                            <td className="text-center">5.8</td>
                                        </tr>

                                        <tr className="border-t">
                                            <td className="p-2">Medical Leave</td>
                                            <td className="text-center">0</td>
                                            <td className="text-center">30</td>
                                            <td className="text-center">0</td>
                                            <td className="text-center">30</td>
                                        </tr>
                                        <tr className="border-t">
                                            <td className="p-2">Married Leave</td>
                                            <td className="text-center">0</td>
                                            <td className="text-center">30</td>
                                            <td className="text-center">0</td>
                                            <td className="text-center">30</td>
                                        </tr>
                                        <tr className="border-t">
                                            <td className="p-2">Maternity Leave</td>
                                            <td className="text-center">0</td>
                                            <td className="text-center">30</td>
                                            <td className="text-center">0</td>
                                            <td className="text-center">30</td>
                                        </tr>
                                        <tr className="border-t">
                                            <td className="p-2">Leave With Pay</td>
                                            <td className="text-center">0</td>
                                            <td className="text-center">30</td>
                                            <td className="text-center">0</td>
                                            <td className="text-center">30</td>
                                        </tr>
                                    </tbody>

                                </table>
                            </div>
                        </div>

                    </div>
                </div>

                {/* FOOTER */}
                <div className="mt-10 text-xs text-center text-slate-400 border-t pt-6">
                    © 2026 Attendance Management System by MODOS. All rights reserved.
                </div>

            </main>
        </div>
    );
};

export default UserProfile;