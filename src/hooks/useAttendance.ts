import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { StaffMember, AttendanceRecord } from '../types';
import { getScope } from '../utils/positionRules';
import { config } from '../utils/config';

export const useAttendance = () => {
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [staff, setStaff] = useState<StaffMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updatingTypeId, setUpdatingTypeId] = useState<string | null>(null);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);
  
  // Fetch attendance options (statuses and types)
  const fetchAttendanceOptions = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      const response = await fetch(`${config.apiUrl}/attendance/meta/options`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAvailableStatuses(data.statuses || []);
        setAvailableTypes(data.types || []);
      }
    } catch (err) {
      console.error('Failed to fetch attendance options:', err);
    }
  }, []);
  
  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('token');
    const staffId = localStorage.getItem('staff_id');
    
    if (!token || !staffId) {
      navigate('/');
      return;
    }
    
    try {
      // Fetch staff list
      const staffRes = await fetch(`${config.apiUrl}/staff/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const staffList = await staffRes.json();
      const current = staffList.find((s: StaffMember) => s.staff_id === staffId);
      if (!current) throw new Error('Staff not found');
      setStaff(current);
      
      // Fetch all attendance
      const attRes = await fetch(`${config.apiUrl}/attendance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const attData = await attRes.json();
      const rawAttendance = Array.isArray(attData) ? attData : attData.data || [];
      const allAttendance: AttendanceRecord[] = rawAttendance.map((record: any) => ({...record, staff_name: record.staff?.staff_name || 'Unknown'}));
      
      // Filter based on position scope
      const scope = getScope(current.staff_position);
      let filtered: AttendanceRecord[] = [];
      
      if (scope === 'all') {
        filtered = allAttendance;
      } else if (scope === 'team') {
        filtered = allAttendance.filter((r: AttendanceRecord) => {
          const recordStaff = staffList.find((s: StaffMember) => s.staff_id === r.staff_id);
          return recordStaff?.team_id === current.team_id;
        });
      } else {
        filtered = allAttendance.filter((r: AttendanceRecord) => r.staff_id === staffId);
      }
      
      setAttendance(filtered);
    } catch (err) {
      console.error(err);
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Update attendance status
  const updateAttendanceStatus = useCallback(async (recordId: string, newStatus: string): Promise<{ success: boolean; error?: string }> => {
    const token = localStorage.getItem('token');
    if (!token) {
      return { success: false, error: 'Please login to continue.' };
    }

    setUpdatingId(recordId);
    
    try {
      const response = await fetch(`${config.apiUrl}/attendance/${recordId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ attendance_status: newStatus }),
      });

      if (response.ok) {
        // Refresh the attendance data after successful update
        await fetchData();
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message || 'Failed to update status' };
      }
    } catch (error) {
      return { success: false, error: 'Failed to update status. Please try again.' };
    } finally {
      setUpdatingId(null);
    }
  }, [fetchData]);

  // Update attendance type
  const updateAttendanceType = useCallback(async (recordId: string, newType: string): Promise<{ success: boolean; error?: string }> => {
    const token = localStorage.getItem('token');
    if (!token) {
      return { success: false, error: 'Please login to continue.' };
    }

    setUpdatingTypeId(recordId);
    
    try {
      const response = await fetch(`${config.apiUrl}/attendance/${recordId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ attendance_type: newType }),
      });

      if (response.ok) {
        // Refresh the attendance data after successful update
        await fetchData();
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message || 'Failed to update type' };
      }
    } catch (error) {
      return { success: false, error: 'Failed to update type. Please try again.' };
    } finally {
      setUpdatingTypeId(null);
    }
  }, [fetchData]);

  useEffect(() => {
    fetchAttendanceOptions();
    fetchData();
  }, [fetchData, fetchAttendanceOptions]);

  const refreshAttendance = useCallback(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  // Filter by date if selected
  const filteredByDate = selectedDate
    ? attendance.filter(record => record.date === selectedDate)
    : attendance;

  const canFilterByDate = staff ? getScope(staff.staff_position) === 'all' : false;

  return {
    staff,
    attendance: filteredByDate,
    allAttendance: attendance,
    loading,
    selectedDate,
    setSelectedDate,
    canFilterByDate,
    refreshAttendance,
    updateAttendanceStatus,
    updateAttendanceType,
    updatingId,
    updatingTypeId,
    availableTypes,
    availableStatuses,
  };
};