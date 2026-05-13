import { StaffMember } from '../types';

// Define approver positions and their scope
export const APPROVER_POSITIONS: Record<string, {
  scope: 'all' | 'division' | 'department' | 'team' | 'custom';
  customFilter?: (currentUser: StaffMember, targetStaff: StaffMember) => boolean;
}> = {
  "Admin": { scope: "all" },
  "Chairman": { scope: "all" },
  "CEO": { scope: "all" },
  "Vice President": { scope: "all" },
  "Director": { scope: "all" },
  "General Manager": { scope: "all" },
  "Deputy General Manager": { scope: "all" }, // Now has full access like Admin
  "Senior Executive Manager": { scope: "department" },
  "Executive Manager": { scope: "department" },
  "Manager": { scope: "team" },
  "Senior Project Manager": { scope: "team" },
  "Project Manager": { scope: "team" },
  "Deputy Project Manager": { scope: "team" },
};

// Helper function to check if a position has approval authority
export const isApprover = (position: string): boolean => {
  return position in APPROVER_POSITIONS;
};

// Helper function to get approval scope for a position
export const getApproverScope = (position: string): string => {
  return APPROVER_POSITIONS[position]?.scope || "self";
};

// Helper function to check if current user can approve a specific staff member's leave
export const canApproveLeave = (
  currentUser: StaffMember,
  targetStaff: StaffMember
): boolean => {
  const approverConfig = APPROVER_POSITIONS[currentUser.staff_position];
  
  if (!approverConfig) return false;

  switch (approverConfig.scope) {
    case "all":
      return true;
      
    case "division":
      return currentUser.division_id === targetStaff.division_id &&
             currentUser.division_id !== undefined;
             
    case "department":
      return currentUser.department_id === targetStaff.department_id &&
             currentUser.department_id !== undefined;
             
    case "team":
      return currentUser.team_id === targetStaff.team_id &&
             currentUser.team_id !== undefined;
             
    case "custom":
      return approverConfig.customFilter ? 
             approverConfig.customFilter(currentUser, targetStaff) : 
             false;
             
    default:
      return false;
  }
};

// Helper to get all staff members that current user can approve
export const getApprovableStaffIds = (
  currentUser: StaffMember,
  allStaffList: StaffMember[]
): Set<string> => {
  const approveStaffIds = new Set<string>();
  
  allStaffList.forEach(staff => {
    if (canApproveLeave(currentUser, staff)) {
      approveStaffIds.add(staff.staff_id);
    }
  });
  
  return approveStaffIds;
};