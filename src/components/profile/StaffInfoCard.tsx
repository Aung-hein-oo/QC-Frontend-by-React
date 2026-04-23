import React from 'react';
import { StaffMember } from '../../types';
import ProfileImage from './ProfileImage';
import { User, Mail, Users, Building2, MapPin, Briefcase } from 'lucide-react';

interface StaffInfoCardProps {
  staff: StaffMember;
}

const StaffInfoCard: React.FC<StaffInfoCardProps> = ({ staff }) => {
  // Helper function to get team name
  const getTeamName = () => {
    if (staff.team?.team_name) {
      return staff.team.team_name;
    }
    return staff.team_id ? `Team ID: ${staff.team_id}` : 'Not Assigned';
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
    return 'Not Assigned';
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
    return 'Not Assigned';
  };

  // Format floor display
  const getFloorDisplay = () => {
    if (!staff.floor) return 'Not Specified';
    if (staff.floor.match(/\d+(st|nd|rd|th)/i)) {
      return staff.floor;
    }
    const floorNum = parseInt(staff.floor);
    if (isNaN(floorNum)) return staff.floor;
    
    if (floorNum === 1) return `${floorNum}st Floor`;
    if (floorNum === 2) return `${floorNum}nd Floor`;
    if (floorNum === 3) return `${floorNum}rd Floor`;
    return `${floorNum}th Floor`;
  };

  const infoRows = [
    { label: 'Staff ID', value: staff.staff_id, icon: User },
    { label: 'Team', value: getTeamName(), icon: Users },
    { label: 'Department', value: getDepartmentName(), icon: Building2 },
    { label: 'Division', value: getDivisionName(), icon: MapPin },
    { label: 'Gender', value: staff.gender || 'Not Specified', icon: User },
    { label: 'Floor', value: getFloorDisplay(), icon: MapPin },
    { label: 'Email', value: staff.staff_mail || 'Not Provided', icon: Mail },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <ProfileImage 
          staffId={staff.staff_id}
          gender={staff.gender}
          staffName={staff.staff_name}
        />
        
        <div className="text-center mt-3">
          <p className="text-sm text-blue-600 font-medium mt-1">{staff.staff_position}</p>
        </div>
        
        <div className="border-t my-4"></div>
        
        <div className="space-y-3">
          {infoRows.map((row, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <row.icon size={16} className="text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs text-gray-500 block">{row.label}</span>
                <span className="text-sm font-medium text-gray-800 break-words block">
                  {row.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffInfoCard;