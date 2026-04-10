import { StaffMember } from '../types';

export const getTeamName = (staff: StaffMember): string => {
  if (staff.team?.team_name) {
    return staff.team.team_name;
  }
  return staff.team_id ? `Team ID: ${staff.team_id}` : 'Not Assigned';
};

export const getDepartmentName = (staff: StaffMember): string => {
  if (staff.department?.dept_name) {
    return staff.department.dept_name;
  }
  if (staff.department_id) {
    return `Department ID: ${staff.department_id}`;
  }
  if (staff.team?.dept_id) {
    return `Department ID: ${staff.team.dept_id}`;
  }
  return 'Not Assigned';
};

export const getDivisionName = (staff: StaffMember): string => {
  if (staff.division?.div_name) {
    return staff.division.div_name;
  }
  if (staff.division_id) {
    return `Division ID: ${staff.division_id}`;
  }
  if (staff.department?.div_id) {
    return `Division ID: ${staff.department.div_id}`;
  }
  return 'Not Assigned';
};

export const getFloorDisplay = (floor?: string): string => {
  if (!floor) return 'Not Assigned';
  if (floor.match(/\d+(st|nd|rd|th)/i)) {
    return floor;
  }
  const floorNum = parseInt(floor);
  if (isNaN(floorNum)) return floor;
  
  if (floorNum === 1) return `${floorNum}st`;
  if (floorNum === 2) return `${floorNum}nd`;
  if (floorNum === 3) return `${floorNum}rd`;
  return `${floorNum}th`;
};