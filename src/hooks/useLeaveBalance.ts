import { useState, useEffect, useCallback } from 'react';
import { LeaveBalance, MaleLeaveBalance, FemaleLeaveBalance } from '../types';

interface UseLeaveBalanceReturn {
  leaveBalance: LeaveBalance | null;
  loading: boolean;
  error: string | null;
  refreshLeaveBalance: () => Promise<void>;
}

export const useLeaveBalance = (staffId: string | undefined): UseLeaveBalanceReturn => {
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaveBalance = useCallback(async () => {
    if (!staffId) {
      setLeaveBalance(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://192.168.250.1:8065/leave-balance/${staffId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch leave balance: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Validate and set the leave balance data
      if (data && data.staff_id) {
        setLeaveBalance(data as LeaveBalance);
      } else {
        throw new Error('Invalid leave balance data received');
      }
    } catch (err: any) {
      console.error('Error fetching leave balance:', err);
      setError(err.message || 'Failed to load leave balance data');
      // Set default values if API fails
      setLeaveBalance(null);
    } finally {
      setLoading(false);
    }
  }, [staffId]);

  useEffect(() => {
    fetchLeaveBalance();
  }, [fetchLeaveBalance]);

  return {
    leaveBalance,
    loading,
    error,
    refreshLeaveBalance: fetchLeaveBalance,
  };
};