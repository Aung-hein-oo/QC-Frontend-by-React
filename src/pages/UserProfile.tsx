import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAttendance } from '../hooks/useAttendance';
import { useLeaveBalance } from '../hooks/useLeaveBalance';
import { formatLeaveBalanceData } from '../utils/leaveBalancedHelpers';
import Header from '../components/profile/Header';
import CalendarPicker from '../components/profile/CalendarPicker';
import StaffInfoCard from '../components/profile/StaffInfoCard';
import AttendanceStatsCards from '../components/profile/AttendanceStatsCards';
import LeaveBalanceTable from '../components/profile/LeaveBalanceTable';

const UserProfile: React.FC = () => {
    const navigate = useNavigate();
    const { staff } = useAttendance();
    
    const { 
        leaveBalance, 
        loading: leaveLoading, 
        error: leaveError, 
    } = useLeaveBalance(staff?.staff_id);
    
    if (!staff) return null;

    const leaveBalanceData = formatLeaveBalanceData(leaveBalance, staff.gender);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
            <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
                <Header />
            </header>
            
            <main className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <CalendarPicker />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* LEFT PROFILE */}
                    <div className="lg:col-span-3 flex justify-center">
                        <StaffInfoCard staff={staff} />
                    </div>

                    {/* RIGHT CONTENT */}
                    <div className="lg:col-span-9 space-y-6">
                        <AttendanceStatsCards 
                            workingDays={6}
                            leaveDays={3}
                            halfLeaveDays={2}
                        />

                        <LeaveBalanceTable 
                            data={leaveBalanceData}
                            loading={leaveLoading}
                            error={leaveError}
                        />
                    </div>
                </div>

                <div className="mt-10 text-xs text-center text-slate-400 border-t pt-6">
                    © 2026 Attendance Management System by MODOS. All rights reserved.
                </div>
            </main>
        </div>
    );
};

export default UserProfile;