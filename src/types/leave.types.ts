export interface LeaveRequestType {
    staff_id: string;
    req_leave_date_from: string;
    req_leave_date_to: string;
    leave_type: string;
    reason: string;
    approved_by: string[];
    leave_status?: string;
    attachment: string;
    total_leave_day: number;
    apply_date: string;
    form_status: string;
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
    total: string;
    approved_by: string[];
}
