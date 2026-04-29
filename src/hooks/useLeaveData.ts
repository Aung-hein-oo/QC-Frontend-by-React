import { useState, useCallback, useEffect } from 'react';
import { config } from '../utils/config';

export interface RawLeaveRecord {
    staff_id: string;
    req_leave_date_from: string;
    req_leave_date_to: string;
    total_leave_day: string;
    leave_type: string;
    reason: string;
    leave_form_id: number;
    form_status: string;
    approved_by: string[]
}

// Updated parameter type to allow string | null | undefined
export const useLeaveData = (staffId: string | null | undefined) => {
    const [leaveRecords, setLeaveRecords] = useState<RawLeaveRecord[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchLeaveRecords = useCallback(async () => {
        const token = localStorage.getItem('token');
        
        // Guard: Stop if token is missing OR staffId hasn't loaded yet
        if (!token || !staffId) return;

        setLoading(true);
        try {
            const response = await fetch(`${config.apiUrl}/leave-form/`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data: RawLeaveRecord[] = await response.json();
                
                // Filter the global records to only show those belonging to THIS staff member
                const filtered = data.filter(
                    (item) => String(item.staff_id) === String(staffId)
                );
                setLeaveRecords(filtered);
            }
        } catch (err) {
            console.error('Failed to fetch leave records:', err);
        } finally {
            setLoading(false);
        }
    }, [staffId]);

    useEffect(() => {
        fetchLeaveRecords();
    }, [fetchLeaveRecords]);

    return { leaveRecords, loading, refreshLeave: fetchLeaveRecords };
};