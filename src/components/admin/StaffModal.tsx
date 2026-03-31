import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { StaffMember } from '../../types';

interface StaffModalProps {
  isOpen: boolean;
  editingStaff: StaffMember | null;
  isSubmitting: boolean;
  generatedStaffId?: string;
  onClose: () => void;
  onSubmit: (formData: Partial<StaffMember>) => Promise<void>;
  onGenderChange?: (gender: string) => void;
}

const StaffModal: React.FC<StaffModalProps> = ({
  isOpen,
  editingStaff,
  isSubmitting,
  generatedStaffId = '',
  onClose,
  onSubmit,
  onGenderChange,
}) => {
  const [formData, setFormData] = useState<Partial<StaffMember>>({
    staff_id: '',
    staff_name: '',
    staff_position: '',
    staff_mail: '',
    gender: '',
    floor: '',
    division: '',
    department: '',
    team: '',
  });

  useEffect(() => {
    if (editingStaff) {
      setFormData(editingStaff);
    } else {
      setFormData({
        staff_id: generatedStaffId,
        staff_name: '',
        staff_position: '',
        staff_mail: '',
        gender: '',
        floor: '',
        division: '',
        department: '',
        team: '',
      });
    }
  }, [editingStaff, generatedStaffId]);

  const handleGenderChange = (gender: string) => {
    setFormData({ ...formData, gender });
    if (onGenderChange) {
      onGenderChange(gender);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // For new staff, ensure staff_id is set
    if (!editingStaff && !formData.staff_id) {
      alert('Staff ID is being generated. Please select a gender first.');
      return;
    }
    
    await onSubmit(formData);
  };

  if (!isOpen) return null;

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Staff ID *
                </label>
                <input
                  type="text"
                  required
                  value={formData.staff_id || ''}
                  readOnly={!editingStaff}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    !editingStaff ? 'bg-gray-50 text-gray-600' : ''
                  }`}
                  disabled={!!editingStaff || isSubmitting}
                  placeholder={!editingStaff ? '' : ''}
                />
                {!editingStaff && !formData.staff_id && (
                  <p className="text-xs text-gray-500 mt-1">
                    Staff ID will be auto-generated when you select gender
                  </p>
                )}
                {!editingStaff && formData.staff_id && (
                  <p className="text-xs text-green-600 mt-1">
                    Staff ID: {formData.staff_id}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Staff Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.staff_name || ''}
                  onChange={(e) => setFormData({ ...formData, staff_name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position *
                </label>
                <input
                  type="text"
                  required
                  value={formData.staff_position || ''}
                  onChange={(e) => setFormData({ ...formData, staff_position: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.staff_mail || ''}
                  onChange={(e) => setFormData({ ...formData, staff_mail: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <select
                  required
                  value={formData.gender || ''}
                  onChange={(e) => handleGenderChange(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isSubmitting || !!editingStaff}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {editingStaff && (
                  <p className="text-xs text-gray-500 mt-1">
                    Gender cannot be changed after creation
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Floor *
                </label>
                <select
                  required
                  value={formData.floor || ''}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isSubmitting}
                >
                  <option value="">Select Floor</option>
                  <option value="2nd Floor">2nd Floor</option>
                  <option value="3rd Floor">3rd Floor</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Division
                </label>
                <input
                  type="text"
                  value={formData.division || ''}
                  onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department || ''}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team
                </label>
                <input
                  type="text"
                  value={formData.team || ''}
                  onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting || (!editingStaff && !formData.gender)}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    {editingStaff ? 'Updating...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    {editingStaff ? 'Update' : 'Save'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StaffModal;