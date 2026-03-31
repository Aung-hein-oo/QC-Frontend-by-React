import React from 'react';
import { X, User } from 'lucide-react';
import { GenderIcon } from '../../components/common/GenderIcon';
import { StaffMember } from '../../types';

interface ViewStaffModalProps {
  isOpen: boolean;
  staff: StaffMember | null;
  onClose: () => void;
  onEdit: () => void;
}

const ViewStaffModal: React.FC<ViewStaffModalProps> = ({
  isOpen,
  staff,
  onClose,
  onEdit,
}) => {
  if (!isOpen || !staff) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <div 
          className="bg-white rounded-xl shadow-xl max-w-2xl w-full relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-xl font-semibold text-gray-800">Staff Details</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <User size={32} className="text-blue-600" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">{staff.staff_name}</h4>
                <p className="text-gray-600">{staff.staff_position}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Staff ID</label>
                <p className="text-gray-800 mt-1">{staff.staff_id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-800 mt-1">{staff.staff_mail}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Gender</label>
                <p className="text-gray-800 mt-1 flex items-center gap-1">
                  <GenderIcon gender={staff.gender} />
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Floor</label>
                <p className="text-gray-800 mt-1">{staff.floor}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Division</label>
                <p className="text-gray-800 mt-1">{staff.division || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Department</label>
                <p className="text-gray-800 mt-1">{staff.department || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Team</label>
                <p className="text-gray-800 mt-1">{staff.team || '-'}</p>
              </div>
              {/* <div>
                <label className="block text-sm font-medium text-gray-500">Appointment Date</label>
                <p className="text-gray-800 mt-1">{staff.appointment_date || '-'}</p>
              </div> */}
            </div>
          </div>
          
          <div className="flex justify-end gap-3 p-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                setTimeout(onEdit, 100);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStaffModal;