import React from 'react';
import { StaffMember } from '../../types';
import ProfileImage from './ProfileImage';

interface StaffInfoCardProps {
  staff: StaffMember;
}

const StaffInfoCard: React.FC<StaffInfoCardProps> = ({ staff }) => {
  // Helper function to get team name
  const getTeamName = () => {
    if (staff.team?.team_name) {
      return staff.team.team_name;
    }
    return staff.team_id ? `Team ID: ${staff.team_id}` : ' - ';
  };

  // Helper function to get department name
  const getDepartmentName = () => {
    if (staff.department?.dept_name) {
      return staff.department.dept_name;
    }
    if (staff.department_id) {
      return `Department ID: ${staff.department_id}`;
    }
    if (staff.team?.dept_id) {
      return `Department ID: ${staff.team.dept_id}`;
    }
    return ' - ';
  };

  // Helper function to get division name
  const getDivisionName = () => {
    if (staff.division?.div_name) {
      return staff.division.div_name;
    }
    if (staff.division_id) {
      return `Division ID: ${staff.division_id}`;
    }
    if (staff.department?.div_id) {
      return `Division ID: ${staff.department.div_id}`;
    }
    return ' - ';
  };

  // Format floor display
  const getFloorDisplay = () => {
    if (!staff.floor) return ' - ';
    if (staff.floor.match(/\d+(st|nd|rd|th)/i)) {
      return staff.floor;
    }
    const floorNum = parseInt(staff.floor);
    if (isNaN(floorNum)) return staff.floor;
    
    if (floorNum === 1) return `${floorNum}st`;
    if (floorNum === 2) return `${floorNum}nd`;
    if (floorNum === 3) return `${floorNum}rd`;
    return `${floorNum}th`;
  };

  const infoRows = [
    { label: 'Staff No', value: staff.staff_id },
    { label: 'Team', value: getTeamName() },
    { label: 'Department', value: getDepartmentName() },
    { label: 'Division', value: getDivisionName() },
    { label: 'Gender', value: staff.gender || 'Not Specified' },
    { label: 'Floor', value: getFloorDisplay() },
    { label: 'Mail', value: staff.staff_mail || 'Not Provided' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm w-full max-w-sm mx-auto">
      <ProfileImage 
        staffId={staff.staff_id}
        gender={staff.gender}
        staffName={staff.staff_name}
      />
      
      <p className="text-sm text-slate-500 text-center mt-1">{staff.staff_position}</p>
      
      <div className="border-t my-4"></div>
      
      <div className="text-sm space-y-3">
        {infoRows.map((row, index) => (
          <div key={index} className="flex gap-3">
            <div className="w-[100px] flex-shrink-0">
              <span className="text-slate-500">{row.label}</span>
            </div>
            <div className="flex-shrink-0">
              <span className="text-slate-500">:</span>
            </div>
            <div className="flex-1 min-w-0"> {/* Added min-w-0 to allow shrinking */}
              <span className="font-medium text-slate-800 break-words whitespace-normal">
                {row.value}
              </span>
            </div>
          </div>
        ))}
        
        {staff.staff_permanent_status && (
          <div className="flex gap-3">
            <div className="w-[100px] flex-shrink-0">
              <span className="text-slate-500">Status</span>
            </div>
            <div className="flex-shrink-0">
              <span className="text-slate-500">:</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-medium text-slate-800 break-words whitespace-normal">
                {staff.staff_permanent_status}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffInfoCard;