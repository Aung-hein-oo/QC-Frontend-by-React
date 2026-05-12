import { useState, useEffect, useCallback } from 'react';
import { LeaveBalance } from '../types';
import { config } from '../utils/config';

interface UseLeaveBalanceReturn {
  leaveBalance: LeaveBalance | null;
  totalWorkingDays: number | null;
  workingDays: number | null;
  leaveDays: number | null;
  loading: boolean;
  error: string | null;
  refreshLeaveBalance: () => Promise<void>;
}

export const useLeaveBalance = (staffId: string | undefined): UseLeaveBalanceReturn => {
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance | null>(null);
  const [totalWorkingDays, setTotalWorkingDays] = useState<number | null>(null);
  const [workingDays, setWorkingDays] = useState<number | null>(null);
  const [leaveDays, setLeaveDays] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaveBalance = useCallback(async () => {
    console.log('🔵 Fetching leave data for staffId:', staffId);
    
    if (!staffId) {
      console.log('⚠️ No staffId provided, resetting all states');
      setLeaveBalance(null);
      setTotalWorkingDays(null);
      setWorkingDays(null);
      setLeaveDays(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      console.log('🔑 Token available:', !!token);
      
      console.log('📡 Fetching endpoints in parallel...');
      // Fetch all endpoints in parallel
      const [totalWdResponse, wdResponse, leaveResponse, balanceResponse] = await Promise.all([
        fetch(`${config.apiUrl}/leave-balance/total-wd/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          },
        }),
        fetch(`${config.apiUrl}/leave-balance/wd/${staffId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          },
        }),
        fetch(`${config.apiUrl}/leave-balance/leave/${staffId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          },
        }),
        fetch(`${config.apiUrl}/leave-balance/${staffId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          },
        })
      ]);

      console.log('📊 Response statuses:', {
        totalWd: totalWdResponse.status,
        wd: wdResponse.status,
        leave: leaveResponse.status,
        balance: balanceResponse.status
      });

      // Process total working days (returns JSON with total_working_days field)
      if (totalWdResponse.ok) {
        const totalWdData = await totalWdResponse.json();
        console.log('📈 Total Working Days Response:', totalWdData);
        // Extract total_working_days from JSON response
        const totalWd = totalWdData.total_working_days ?? totalWdData.totalWorkingDays;
        console.log('✅ Extracted total working days:', totalWd);
        setTotalWorkingDays(typeof totalWd === 'number' ? totalWd : parseFloat(totalWd));
      } else {
        console.error('❌ Failed to fetch total working days:', totalWdResponse.statusText);
        throw new Error(`Failed to fetch total working days: ${totalWdResponse.statusText}`);
      }

      // Process working days (returns JSON with working_days field)
      if (wdResponse.ok) {
        const wdData = await wdResponse.json();
        console.log('📈 Working Days Response:', wdData);
        // Extract working_days from JSON response
        const wd = wdData.working_days ?? wdData.workingDays;
        console.log('✅ Extracted working days:', wd);
        setWorkingDays(typeof wd === 'number' ? wd : parseFloat(wd));
      } else {
        console.error('❌ Failed to fetch working days:', wdResponse.statusText);
        throw new Error(`Failed to fetch working days: ${wdResponse.statusText}`);
      }

      // Process leave days (returns JSON with total_leaves field)
      if (leaveResponse.ok) {
        const leaveData = await leaveResponse.json();
        console.log('📈 Leave Days Response:', leaveData);
        // Extract total_leaves from JSON response
        const leaves = leaveData.total_leaves ?? leaveData.totalLeaves ?? leaveData.leave_days;
        console.log('✅ Extracted leave days:', leaves);
        setLeaveDays(typeof leaves === 'number' ? leaves : parseInt(leaves));
      } else {
        console.error('❌ Failed to fetch leave days:', leaveResponse.statusText);
        throw new Error(`Failed to fetch leave days: ${leaveResponse.statusText}`);
      }

      // Process leave balance data
      if (balanceResponse.ok) {
        const balanceData = await balanceResponse.json();
        console.log('📋 Leave Balance Response:', balanceData);
        if (balanceData && balanceData.staff_id) {
          console.log('✅ Setting leave balance for staff:', balanceData.staff_id);
          setLeaveBalance(balanceData as LeaveBalance);
        } else {
          console.warn('⚠️ Invalid leave balance data received:', balanceData);
          setLeaveBalance(null);
        }
      } else {
        console.warn(`⚠️ Failed to fetch leave balance: ${balanceResponse.statusText}`);
        setLeaveBalance(null);
      }

      console.log('✅ All data fetched successfully!');
      console.log('📊 Final states:', {
        totalWorkingDays,
        workingDays,
        leaveDays,
        leaveBalance
      });

    } catch (err: any) {
      console.error('🔥 Error fetching leave data:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack
      });
      setError(err.message || 'Failed to load leave data');
      // Reset all values on error
      setLeaveBalance(null);
      setTotalWorkingDays(null);
      setWorkingDays(null);
      setLeaveDays(null);
    } finally {
      setLoading(false);
      console.log('🏁 Fetch completed, loading set to false');
    }
  }, [staffId]);

  useEffect(() => {
    console.log('🔄 useEffect triggered, calling fetchLeaveBalance');
    fetchLeaveBalance();
  }, [fetchLeaveBalance]);

  console.log('🎨 Component render state:', {
    staffId,
    loading,
    error,
    totalWorkingDays,
    workingDays,
    leaveDays,
    hasLeaveBalance: !!leaveBalance
  });

  return {
    leaveBalance,
    totalWorkingDays,
    workingDays,
    leaveDays,
    loading,
    error,
    refreshLeaveBalance: fetchLeaveBalance,
  };
};