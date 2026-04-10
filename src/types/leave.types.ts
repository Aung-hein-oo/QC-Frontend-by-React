export interface LeaveRequestType {
    staff_id: string;
    start_date: string;
    end_date: string;
    leave_type: string;
    reason: string;
    approver: string[];
    leave_status?: string;
    attachment: string;
    total_leave_day: number;
    apply_date: string;
}

export interface LeaveTableRow {
    id: string;
    staffNo: string;
    staffName: string;
    leaveType: string;
    fromDate: string;
    toDate: string;
    reason: string;
    status: string;
}