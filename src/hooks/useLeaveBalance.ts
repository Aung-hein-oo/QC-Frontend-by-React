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
    if (!staffId) {
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
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      };

      const [totalWdResponse, wdResponse, leaveResponse, balanceResponse] = await Promise.all([
        fetch(`${config.apiUrl}/leave-balance/total-wd/`, { headers }),
        fetch(`${config.apiUrl}/leave-balance/wd/${staffId}`, { headers }),
        fetch(`${config.apiUrl}/leave-balance/leave/${staffId}`, { headers }),
        fetch(`${config.apiUrl}/leave-balance/${staffId}`, { headers })
      ]);

      // Process total working days
      if (totalWdResponse.ok) {
        const data = await totalWdResponse.json();
        setTotalWorkingDays(data.total_working_days ?? data.totalWorkingDays);
      } else {
        throw new Error(`Failed to fetch total working days: ${totalWdResponse.statusText}`);
      }

      // Process working days
      if (wdResponse.ok) {
        const data = await wdResponse.json();
        setWorkingDays(data.working_days ?? data.workingDays);
      } else {
        throw new Error(`Failed to fetch working days: ${wdResponse.statusText}`);
      }

      // Process leave days
      if (leaveResponse.ok) {
        const data = await leaveResponse.json();
        setLeaveDays(data.total_leaves ?? data.totalLeaves ?? data.leave_days);
      } else {
        throw new Error(`Failed to fetch leave days: ${leaveResponse.statusText}`);
      }

      // Process leave balance (optional - don't throw if fails)
      if (balanceResponse.ok) {
        const data = await balanceResponse.json();
        if (data?.staff_id) {
          setLeaveBalance(data as LeaveBalance);
        }
      }

    } catch (err: any) {
      setError(err.message || 'Failed to load leave data');
      setLeaveBalance(null);
      setTotalWorkingDays(null);
      setWorkingDays(null);
      setLeaveDays(null);
    } finally {
      setLoading(false);
    }
  }, [staffId]);

  useEffect(() => {
    fetchLeaveBalance();
  }, [fetchLeaveBalance]);

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