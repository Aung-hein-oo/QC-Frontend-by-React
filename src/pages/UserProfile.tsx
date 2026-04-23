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
        <div className="h-screen flex flex-col bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 overflow-hidden">
            <header className="bg-white/80 backdrop-blur-sm border-b shadow-sm flex-shrink-0">
                <Header />
            </header>
            
            <main className="flex-1 min-h-0 overflow-hidden">
                <div className="h-full flex flex-col px-4 py-4">
                    {/* Calendar Picker - Fixed at top */}
                    <div className="flex-shrink-0 mb-4">
                        <div className="flex justify-end">
                            <CalendarPicker />
                        </div>
                    </div>
                    
                    {/* Scrollable Content Area - Full Width */}
                    <div className="flex-1 min-h-0 overflow-y-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-4">
                            {/* LEFT PROFILE - Full width on mobile, 3 cols on desktop */}
                            <div className="lg:col-span-3">
                                <StaffInfoCard staff={staff} />
                            </div>

                            {/* RIGHT CONTENT - Takes remaining space */}
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
                    </div>

                    {/* Footer - Fixed at bottom */}
                    <div className="flex-shrink-0 mt-4 text-xs text-center text-gray-500 border-t pt-4">
                        © 2026 Attendance Management System by MODOS. All rights reserved.
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserProfile;