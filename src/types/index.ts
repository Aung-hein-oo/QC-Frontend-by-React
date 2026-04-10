// Team type
export type Team = {
  team_id: string;
  team_name: string;
  dept_id: number;
  id: number;
};

// Department type
export type Department = {
  dept_id: string;
  dept_name: string;
  div_id: number;
  id: number;
};

// Division type
export type Division = {
  div_id: string;
  div_name: string;
  id: number;
};

// Staff Member type matching backend response
export interface StaffMember {
  id: number;
  staff_id: string;
  staff_name: string;
  staff_position: string;
  staff_permanent_status?: string;
  gender: string;
  floor: string;
  staff_mail: string;
  staff_password?: string;
  team_id?: number;
  department_id?: number;
  division_id?: number;
  team?: Team;
  department?: Department;
  division?: Division;
}

// Form data for adding/editing staff
export interface StaffFormData {
  staff_id?: string;
  staff_name: string;
  staff_position: string;
  staff_mail: string;
  gender: string;
  floor: string;
  division_id?: number;
  department_id?: number;
  team_id?: number;
}

export type AttendanceRecord = {
  id: number;
  staff_id: string;
  date: string;
  attendance_status: string;
  attendance_type?: string;
  remark?: string;
  staff?: {
    staff_name: string;
    staff_position: string;
  };
};

export interface BaseLeaveBalance {
  staff_id: string;
  cascual_leave: number;
  family_funeral_health_leave: number;
  leave_with_pay: number;
  leave_without_pay: number;
  married_leave: number;
  medical_leave: number;
  id: number;
}

// Male leave balance (with paternity leave)
export interface MaleLeaveBalance extends BaseLeaveBalance {
  parternity_leave: number;
  maternity_leave?: never;
}

// Female leave balance (with maternity leave)
export interface FemaleLeaveBalance extends BaseLeaveBalance {
  parternity_leave?: never;
  maternity_leave: number;
}

// Union type for leave balance
export type LeaveBalance = MaleLeaveBalance | FemaleLeaveBalance;

export interface FormData extends Partial<StaffMember> {}