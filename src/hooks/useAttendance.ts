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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
  };
};