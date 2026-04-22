import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { StaffMember, Division, Department, Team, StaffFormData } from '../../types';
import { StaffFormFields } from './StaffFormFields';
import { ModalActions } from './ModalActions';

interface StaffModalProps {
  isOpen: boolean;
  editingStaff: StaffMember | null;
  isSubmitting: boolean;
  generatedStaffId?: string;
  divisions: Division[];
  departments: Department[];
  teams: Team[];
  onClose: () => void;
  onSubmit: (formData: StaffFormData) => Promise<void>;
  onGenderChange?: (gender: string) => void;
  onDivisionChange?: (divisionId: number) => void;
  onDepartmentChange?: (departmentId: number) => void;
}

const StaffModal: React.FC<StaffModalProps> = ({
  isOpen,
  editingStaff,
  isSubmitting,
  generatedStaffId = '',
  divisions,
  departments,
  teams,
  onClose,
  onSubmit,
  onGenderChange,
  onDivisionChange,
  onDepartmentChange,
}) => {
  const [formData, setFormData] = useState<StaffFormData>({
    staff_id: '',
    staff_name: '',
    staff_position: '',
    staff_mail: '',
    gender: '',
    floor: '',
    division_id: undefined,
    department_id: undefined,
    team_id: undefined,
    staff_permanent_status: '',  // Add this
    staff_password: '',          // Add this
  });

  // Initialize form when modal opens or editing staff changes
  useEffect(() => {
    if (editingStaff) {
      setFormData({
        staff_id: editingStaff.staff_id,
        staff_name: editingStaff.staff_name,
        staff_position: editingStaff.staff_position,
        staff_mail: editingStaff.staff_mail,
        gender: editingStaff.gender,
        floor: editingStaff.floor,
        division_id: editingStaff.division?.id || editingStaff.division_id,
        department_id: editingStaff.department?.id || editingStaff.department_id,
        team_id: editingStaff.team?.id || editingStaff.team_id,
        staff_permanent_status: editingStaff.staff_permanent_status || 'Permanent', // Default value
        staff_password: editingStaff.staff_password || '',
      });
    } else if (generatedStaffId) {
      setFormData(prev => ({ ...prev, staff_id: generatedStaffId, staff_permanent_status: 'Permanent', }));
    } else {
      setFormData({
        staff_id: '',
        staff_name: '',
        staff_position: '',
        staff_mail: '',
        gender: '',
        floor: '',
        division_id: undefined,
        department_id: undefined,
        team_id: undefined,
        staff_permanent_status: 'Permanent', // Default value
        staff_password: '',
      });
    }
  }, [editingStaff, generatedStaffId, isOpen]);

  const updateFormData = (updates: Partial<StaffFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleGenderChange = (gender: string) => {
    updateFormData({ gender });
    onGenderChange?.(gender);
  };

  const handleDivisionChange = (divisionId: number | undefined) => {
    updateFormData({ 
      division_id: divisionId, 
      department_id: undefined, 
      team_id: undefined 
    });
    if (divisionId) onDivisionChange?.(divisionId);
  };

  const handleDepartmentChange = (departmentId: number | undefined) => {
    updateFormData({ 
      department_id: departmentId, 
      team_id: undefined 
    });
    if (departmentId) onDepartmentChange?.(departmentId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingStaff && !formData.staff_id) {
      alert('Please select a gender to generate Staff ID first.');
      return;
    }
    
    await onSubmit(formData);
  };

  if (!isOpen) return null;

  // Filter departments and teams based on selections
  const filteredDepartments = departments.filter(
    dept => !formData.division_id || dept.div_id === formData.division_id
  );

  const filteredTeams = teams.filter(
    team => !formData.department_id || team.dept_id === formData.department_id
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full relative">
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-xl font-semibold text-gray-800">
              {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
            <StaffFormFields
              formData={formData}
              editingStaff={editingStaff}
              isSubmitting={isSubmitting}
              divisions={divisions}
              filteredDepartments={filteredDepartments}
              filteredTeams={filteredTeams}
              onFormChange={updateFormData}
              onGenderChange={handleGenderChange}
              onDivisionChange={handleDivisionChange}
              onDepartmentChange={handleDepartmentChange}
            />
            
            <ModalActions
              isSubmitting={isSubmitting}
              editingStaff={editingStaff}
              onCancel={onClose}
              isSubmitDisabled={!editingStaff && !formData.gender}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default StaffModal;