// utils/positionRules.ts
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

// Hierarchy levels for permission checking
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

export const canEditAttendance = (
  currentUser: StaffMember,
  record: AttendanceRecord,
  allStaff: StaffMember[]
): boolean => {
  // Admin can edit everything
  if (currentUser.staff_position === 'Admin') {
    console.log('Admin permission granted for record:', record.id);
    return true;
  }

  // Find the staff member who owns this record
  const recordStaff = record.staff 
    ? allStaff.find(s => s.staff_id === record.staff_id) 
    : allStaff.find(s => s.staff_id === record.staff_id);
    
  if (!recordStaff) {
    console.log('Record staff not found for record:', record.id);
    return false;
  }

  // Users can edit their own records
  if (currentUser.staff_id === recordStaff.staff_id) {
    console.log('Self edit permission granted for record:', record.id);
    return true;
  }

  const currentUserLevel = POSITION_HIERARCHY[currentUser.staff_position] || 0;
  const recordStaffLevel = POSITION_HIERARCHY[recordStaff.staff_position] || 0;

  // Higher level users can edit lower level users' records
  if (currentUserLevel > recordStaffLevel) {
    // Check organization hierarchy based on position level
    const currentUserScope = getScope(currentUser.staff_position);
    
    switch (currentUserScope) {
      case 'all':
        console.log('All scope edit permission granted for record:', record.id);
        return true;
      case 'division':
        // Compare division_id as numbers
        const canEditDivision = currentUser.division_id === recordStaff.division_id;
        if (canEditDivision) {
          console.log('Division scope edit permission granted for record:', record.id);
        }
        return canEditDivision;
      case 'department':
        // Compare department_id as numbers
        const canEditDept = currentUser.department_id === recordStaff.department_id;
        if (canEditDept) {
          console.log('Department scope edit permission granted for record:', record.id);
        }
        return canEditDept;
      case 'team':
        // Compare team_id as numbers
        const canEditTeam = currentUser.team_id === recordStaff.team_id;
        if (canEditTeam) {
          console.log('Team scope edit permission granted for record:', record.id);
        }
        return canEditTeam;
      default:
        console.log('No edit permission for record:', record.id);
        return false;
    }
  }

  console.log('Insufficient hierarchy level for edit permission:', {
    currentUser: currentUser.staff_position,
    currentUserLevel,
    recordStaff: recordStaff.staff_position,
    recordStaffLevel
  });
  
  return false;
};