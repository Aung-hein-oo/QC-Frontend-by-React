export type StaffData = {
  id: number;
  staff_id: string;
  staff_name: string;
  staff_position: string;
  gender: string;
  floor: string;
  staff_mail: string;
  team_id: number;
};

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

export interface StaffMember {
  staff_id: string;
  staff_name: string;
  staff_position: string;
  staff_mail: string;
  gender: string;
  floor: string;
  division?: string;
  department?: string;
  team?: string;
  // appointment_date?: string;
  // service_years?: number;
}

export interface FormData extends Partial<StaffMember> {}