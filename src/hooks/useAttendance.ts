import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { StaffMember, AttendanceRecord } from '../types';
import { getScope, canEditAttendance } from '../utils/positionRules';
import { config } from '../utils/config';

export const useAttendance = () => {
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [allStaffList, setAllStaffList] = useState<StaffMember[]>([]);
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
      setAllStaffList(staffList);
      
      const current = staffList.find((s: StaffMember) => s.staff_id === staffId);
      if (!current) throw new Error('Staff not found');
      setStaff(current);
      
      // Log position for debugging
      console.log('Current user position:', current.staff_position);
      console.log('Current user scope:', getScope(current.staff_position));
      
      // Fetch all attendance
      const attRes = await fetch(`${config.apiUrl}/attendance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const attData = await attRes.json();
      const rawAttendance = Array.isArray(attData) ? attData : attData.data || [];
      const allAttendance: AttendanceRecord[] = rawAttendance.map((record: any) => ({
        ...record, 
        staff_name: record.staff?.staff_name || 'Unknown',
        staff: record.staff || staffList.find((s: StaffMember) => s.staff_id === record.staff_id)
      }));
      
      // Filter based on position scope
      const scope = getScope(current.staff_position);
      let filtered: AttendanceRecord[] = [];
      
      console.log('Filtering attendance with scope:', scope, 'for position:', current.staff_position);
      
      if (scope === 'all') {
        // Admin/Chairman/CEO/Director/General Manager - see all
        filtered = allAttendance;
        console.log('All scope - showing all records:', filtered.length);
      } else if (scope === 'division') {
        // Deputy General Manager - see their division
        filtered = allAttendance.filter((r: AttendanceRecord) => {
          const recordStaff = staffList.find((s: StaffMember) => s.staff_id === r.staff_id);
          return recordStaff?.division_id === current.division_id;
        });
        console.log('Division scope - showing records for division:', current.division_id, 'count:', filtered.length);
      } else if (scope === 'department') {
        // Senior Executive Manager/Executive Manager - see their department
        filtered = allAttendance.filter((r: AttendanceRecord) => {
          const recordStaff = staffList.find((s: StaffMember) => s.staff_id === r.staff_id);
          return recordStaff?.department_id === current.department_id;
        });
        console.log('Department scope - showing records for department:', current.department_id, 'count:', filtered.length);
      } else if (scope === 'team') {
        // Manager/Project Manager - see their team
        filtered = allAttendance.filter((r: AttendanceRecord) => {
          const recordStaff = staffList.find((s: StaffMember) => s.staff_id === r.staff_id);
          return recordStaff?.team_id === current.team_id;
        });
        console.log('Team scope - showing records for team:', current.team_id, 'count:', filtered.length);
      } else {
        // Self only - regular staff
        filtered = allAttendance.filter((r: AttendanceRecord) => r.staff_id === staffId);
        console.log('Self scope - showing only own records:', filtered.length);
      }
      
      console.log(`Filtered ${filtered.length} records out of ${allAttendance.length} total`);
      setAttendance(filtered);
    } catch (err) {
      console.error(err);
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Check if user can edit a specific attendance record
  const canEditRecord = useCallback((record: AttendanceRecord): boolean => {
    if (!staff) return false;
    
    return canEditAttendance(staff, record, allStaffList);
  }, [staff, allStaffList]);

  // Update attendance status
  const updateAttendanceStatus = useCallback(async (recordId: string, newStatus: string): Promise<{ success: boolean; error?: string }> => {
    const token = localStorage.getItem('token');
    if (!token) {
      return { success: false, error: 'Please login to continue.' };
    }

    // Find the record to check permissions
    const recordToUpdate = attendance.find(r => String(r.id) === recordId);
    if (recordToUpdate && !canEditRecord(recordToUpdate)) {
      return { success: false, error: 'You do not have permission to edit this record.' };
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
  }, [fetchData, attendance, canEditRecord]);

  // Update attendance type
  const updateAttendanceType = useCallback(async (recordId: string, newType: string): Promise<{ success: boolean; error?: string }> => {
    const token = localStorage.getItem('token');
    if (!token) {
      return { success: false, error: 'Please login to continue.' };
    }

    // Find the record to check permissions
    const recordToUpdate = attendance.find(r => String(r.id) === recordId);
    if (recordToUpdate && !canEditRecord(recordToUpdate)) {
      return { success: false, error: 'You do not have permission to edit this record.' };
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
  }, [fetchData, attendance, canEditRecord]);

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

  // const canFilterByDate = staff ? getScope(staff.staff_position) !== 'self' : false;

  return {
    staff,
    attendance: filteredByDate,
    allAttendance: attendance,
    loading,
    selectedDate,
    setSelectedDate,
    // canFilterByDate,
    refreshAttendance,
    updateAttendanceStatus,
    updateAttendanceType,
    updatingId,
    updatingTypeId,
    availableTypes,
    availableStatuses,
    canEditRecord,
    allStaffList,
  };
};