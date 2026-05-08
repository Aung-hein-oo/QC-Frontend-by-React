import { useState, useEffect, useCallback } from "react";
import { config } from "../utils/config";
import { useAttendance } from '../hooks//useAttendance';

export const useLeaveApprove = () => {
    const [leaveList, setLeaveList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { allStaffList } = useAttendance();

    const fetchLeave = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        setLoading(true);
        try {
            const response = await fetch(`${config.apiUrl}/leave-form/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const data = await response.json();
                const rawList = Array.isArray(data) ? data : data.data || [];
                
                // 1. Create a Set of valid staff IDs for faster lookup
                const validStaffIds = new Set(allStaffList?.map(s => s.staff_id));

                // 2. Filter: Status is pending AND staff_id exists in allStaffList
                const filteredList = rawList.filter((item: any) => {
                    const isPending = item.form_status?.toLowerCase() === "pending";
                    const isMyStaff = validStaffIds.has(item.staff_id);
                    
                    return isPending && isMyStaff;
                });

                setLeaveList(filteredList);
            }
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, [allStaffList]); // ✅ Add allStaffList to dependencies

    useEffect(() => {
        // Only fetch if allStaffList is loaded to ensure filtering works correctly
        if (allStaffList && allStaffList.length > 0) {
            fetchLeave();
        }
    }, [fetchLeave, allStaffList]);

    return { leaveList, loading, refreshLeave: fetchLeave };
};