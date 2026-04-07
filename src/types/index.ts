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
export interface FormData extends Partial<StaffMember> {}