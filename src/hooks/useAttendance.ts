import { useState, useEffect, useCallback } from 'react';

import { StaffMember, AttendanceRecord } from '../types';
import { getScope, canEditAttendance } from '../utils/positionRules';
import { config } from '../utils/config';

export const useAttendance = () => {
  
  const [allAttendance, setAllAttendance] = useState<AttendanceRecord[]>([]);
  const [allStaffList, setAllStaffList] = useState<StaffMember[]>([]);
  const [staff, setStaff] = useState<StaffMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updatingTypeId, setUpdatingTypeId] = useState<string | null>(null);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);
  
    const getAuth = () => {
      const token = localStorage.getItem('token');
      const staffId = localStorage.getItem('staff_id');
      return { token, staffId };
    };

   const fetchAttendanceOptions = useCallback(async () => {
    const { token } = getAuth();
    if (!token) return;

    try {
      const res = await fetch(`${config.apiUrl}/attendance/meta/options`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setAvailableStatuses(data.statuses || []);
        setAvailableTypes(data.types || []);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);
  
  const fetchData = useCallback(async () => {
    const { token, staffId } = getAuth();
    
    if (!token || !staffId) return;
    
    try {
      const staffRes = await fetch(`${config.apiUrl}/staff/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const staffList = await staffRes.json();
      setAllStaffList(staffList);
      
      const current = staffList.find((s: StaffMember) => s.staff_id === staffId);
      if (!current) throw new Error('Staff not found');
      setStaff(current);
      
      const attRes = await fetch(`${config.apiUrl}/attendance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const attData = await attRes.json();
      const rawAttendance = Array.isArray(attData) ? attData : attData.data || [];
      const allAttendanceRecords: AttendanceRecord[] = rawAttendance.map((record: any) => ({
        ...record, 
        staff_name: record.staff?.staff_name || 'Unknown',
        staff: record.staff || staffList.find((s: StaffMember) => s.staff_id === record.staff_id)
      }));
      
      const scope = getScope(current.staff_position);
      let filtered: AttendanceRecord[] = [];
      
      if (scope === 'all') {
        filtered = allAttendanceRecords;
      } else if (scope === 'division') {
        filtered = allAttendanceRecords.filter((r: AttendanceRecord) => {
          const recordStaff = staffList.find((s: StaffMember) => s.staff_id === r.staff_id);
          return recordStaff?.division_id === current.division_id;
        });
      } else if (scope === 'department') {
        filtered = allAttendanceRecords.filter((r: AttendanceRecord) => {
          const recordStaff = staffList.find((s: StaffMember) => s.staff_id === r.staff_id);
          return recordStaff?.department_id === current.department_id;
        });
      } else if (scope === 'team') {
        filtered = allAttendanceRecords.filter((r: AttendanceRecord) => {
          const recordStaff = staffList.find((s: StaffMember) => s.staff_id === r.staff_id);
          return recordStaff?.team_id === current.team_id;
        });
      } else {
        filtered = allAttendanceRecords.filter((r: AttendanceRecord) => r.staff_id === staffId);
      }
      
      setAllAttendance(filtered);
      // No automatic date filtering - selectedDate remains empty
    } catch (err) {
        console.error('Fetch attendance failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const canEditRecord = useCallback((record: AttendanceRecord): boolean => {
    if (!staff) return false;
    return canEditAttendance(staff, record, allStaffList);
  }, [staff, allStaffList]);

   const updateAttendanceStatus = useCallback(async (recordId: string, newStatus: string) => {
    const { token } = getAuth();
    if (!token) return { success: false };

    setUpdatingId(recordId);

    try {
      const res = await fetch(`${config.apiUrl}/attendance/${recordId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ attendance_status: newStatus })
      });

      if (!res.ok) {
        return { success: false };
      }

      //  ONLY local update
      setAllAttendance(prev =>
        prev.map(r =>
          String(r.id) === recordId
            ? { ...r, attendance_status: newStatus }
            : r
        )
      );

      return { success: true };
    } finally {
      setUpdatingId(null);
    }
  }, []);

  const updateAttendanceType = useCallback(async (recordId: string, newType: string) => {
    const { token } = getAuth();
    if (!token) return { success: false };

    setUpdatingTypeId(recordId);

    try {
      const res = await fetch(`${config.apiUrl}/attendance/${recordId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ attendance_type: newType })
      });

      if (!res.ok) {
        return { success: false };
      }

      setAllAttendance(prev =>
        prev.map(r =>
          String(r.id) === recordId
            ? { ...r, attendance_type: newType }
            : r
        )
      );

      return { success: true };
    } finally {
      setUpdatingTypeId(null);
    }
  }, []);

  useEffect(() => {
    fetchAttendanceOptions();
    fetchData();
  }, [fetchData, fetchAttendanceOptions]);

  const refreshAttendance = useCallback(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  // Apply date filter to the full dataset - no default filtering
  const filteredByDate = selectedDate
    ? allAttendance.filter(record => record.date === selectedDate)
    : allAttendance;

  return {
    staff,
    attendance: filteredByDate,
    allAttendance,
    loading,
    selectedDate,
    setSelectedDate,
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