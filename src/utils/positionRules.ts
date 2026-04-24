import { StaffMember, AttendanceRecord } from '../types';

export const POSITION_RULES: Record<string, string> = {
  "Admin": "all",
  "Chairman": "all",
  "CEO": "all",
  "Vice President": "all",
  "Director": "all",
  "General Manager": "all",
  "Deputy General Manager": "division",
  "Senior Executive Manager": "department",
  "Executive Manager": "department",
  "Manager": "team",
  "Senior Project Manager": "team",
  "Project Manager": "team",
  "Deputy Project Manager": "team",
};

export const getScope = (position: string): string => {
  return POSITION_RULES[position] || "self";
};

const POSITION_HIERARCHY: Record<string, number> = {
  "Admin": 10,
  "Chairman": 9,
  "CEO": 8,
  "Vice President": 7,
  "Director": 6,
  "General Manager": 5,
  "Deputy General Manager": 4,
  "Senior Executive Manager": 3,
  "Executive Manager": 3,
  "Manager": 2,
  "Senior Project Manager": 2,
  "Project Manager": 2,
  "Deputy Project Manager": 2,
};

const VIEW_ONLY_POSITIONS = [
  "Senior Project Lead",
  "Project Lead",
  "Senior Software Engineer-1",
  "Senior Software Engineer-2",
  "Software Engineer",
  "Software Development Trainer",
  "Team Leader",
  "Technical Leader",
  "Senior Programmer",
  "Programmer",
  "Junior Programmer"
];

export const canEditAttendance = (
  currentUser: StaffMember,
  record: AttendanceRecord,
  allStaff: StaffMember[]
): boolean => {
  // Admin can edit everything
  if (currentUser.staff_position === 'Admin') return true;

  // View-only positions cannot edit anything
  if (VIEW_ONLY_POSITIONS.includes(currentUser.staff_position)) return false;

  // Find the staff member who owns this record
  let recordStaff: StaffMember | undefined;
  
  if (record.staff) {
    recordStaff = allStaff.find(s => s.staff_id === record.staff_id) || record.staff;
  } else {
    recordStaff = allStaff.find(s => s.staff_id === record.staff_id);
  }
  
  if (!recordStaff) return false;

  // Users can edit their own records
  if (currentUser.staff_id === recordStaff.staff_id) return true;

  const currentUserScope = getScope(currentUser.staff_position);
  
  // Self scope users cannot edit others
  if (currentUserScope === 'self') return false;

  const currentUserLevel = POSITION_HIERARCHY[currentUser.staff_position] || 0;
  const recordStaffLevel = POSITION_HIERARCHY[recordStaff.staff_position] || 0;

  // Must be higher level to edit others
  if (currentUserLevel <= recordStaffLevel) return false;

  // Check organization scope with null checks
  switch (currentUserScope) {
    case 'all':
      return true;
    case 'division':
      // Check if both have division_id and they match
      return currentUser.division_id !== undefined && 
             recordStaff.division_id !== undefined &&
             currentUser.division_id === recordStaff.division_id;
    case 'department':
      return currentUser.department_id !== undefined && 
             recordStaff.department_id !== undefined &&
             currentUser.department_id === recordStaff.department_id;
    case 'team':
      return currentUser.team_id !== undefined && 
             recordStaff.team_id !== undefined &&
             currentUser.team_id === recordStaff.team_id;
    default:
      return false;
  }
};