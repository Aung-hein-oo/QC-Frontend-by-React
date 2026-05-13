import { useState, useEffect, useCallback } from "react";
import { config } from "../utils/config";
import { useAttendance } from '../hooks/useAttendance';
import { canApproveLeave } from "../utils/approverRules";

export const useLeaveApprove = () => {
    const [leaveList, setLeaveList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { allStaffList, staff } = useAttendance();

    const fetchLeave = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        // If we don't have current user yet, wait
        if (!staff) {
            setLoading(false);
            return;
        }

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
                
                // Create a mapping of staff_id to staff object for quick lookup
                const staffMap = new Map();
                allStaffList?.forEach((staffMember: any) => {
                    staffMap.set(staffMember.staff_id, staffMember);
                });

                // Check if current user has "all" access (Admin, Deputy General Manager, etc.)
                const hasAllAccess = staff.staff_position === 'Admin' || 
                                    staff.staff_position === 'Deputy General Manager' ||
                                    staff.staff_position === 'Chairman' ||
                                    staff.staff_position === 'CEO' ||
                                    staff.staff_position === 'Vice President' ||
                                    staff.staff_position === 'Director' ||
                                    staff.staff_position === 'General Manager';

                let filteredList = [];

                if (hasAllAccess) {
                    // For users with all access, show ALL pending leave forms
                    filteredList = rawList.filter((item: any) => {
                        const isPending = item.form_status?.toLowerCase() === "pending";
                        return isPending;
                    });
                } else {
                    // For other users, filter based on approval rules
                    filteredList = rawList.filter((item: any) => {
                        const isPending = item.form_status?.toLowerCase() === "pending";
                        
                        if (!isPending) return false;
                        
                        // Get the staff member who requested leave
                        const requestStaff = staffMap.get(item.staff_id);
                        if (!requestStaff) return false;
                        
                        // Check if current user can approve this staff member's leave
                        const canApprove = canApproveLeave(staff, requestStaff);
                        
                        return canApprove;
                    });
                }

                setLeaveList(filteredList);
            } else {
                console.error("Failed to fetch leave forms");
                setLeaveList([]);
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setLeaveList([]);
        } finally {
            setLoading(false);
        }
    }, [allStaffList, staff]);

    useEffect(() => {
        // Wait for staff and allStaffList to be loaded before fetching
        if (staff && allStaffList && allStaffList.length > 0) {
            fetchLeave();
        }
    }, [fetchLeave, staff, allStaffList]);

    // Refresh function that can be called after updates
    const refreshLeave = useCallback(() => {
        if (staff && allStaffList && allStaffList.length > 0) {
            fetchLeave();
        }
    }, [fetchLeave, staff, allStaffList]);

    return { leaveList, loading, refreshLeave };
};