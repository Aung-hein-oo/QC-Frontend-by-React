import React from 'react';
import { StaffFormData, Division, Department, Team } from '../../types';

interface StaffFormFieldsProps {
  formData: StaffFormData;
  editingStaff: any;
  isSubmitting: boolean;
  divisions: Division[];
  filteredDepartments: Department[];
  filteredTeams: Team[];
  onFormChange: (updates: Partial<StaffFormData>) => void;
  onGenderChange: (gender: string) => void;
  onDivisionChange: (divisionId: number | undefined) => void;
  onDepartmentChange: (departmentId: number | undefined) => void;
}

export const StaffFormFields: React.FC<StaffFormFieldsProps> = ({
  formData,
  editingStaff,
  isSubmitting,
  divisions,
  filteredDepartments,
  filteredTeams,
  onFormChange,
  onGenderChange,
  onDivisionChange,
  onDepartmentChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Staff ID Field */}
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
        />
        {!editingStaff && !formData.staff_id && (
          <p className="text-xs text-gray-500 mt-1">
            Staff ID will be auto-generated when you select gender
          </p>
        )}
        {!editingStaff && formData.staff_id && (
          <p className="text-xs text-green-600 mt-1">✓ Available</p>
        )}
      </div>
      
      {/* Staff Name Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Staff Name *
        </label>
        <input
          type="text"
          required
          value={formData.staff_name || ''}
          onChange={(e) => onFormChange({ staff_name: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isSubmitting}
        />
      </div>
      
      {/* Position Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Position *
        </label>
        <input
          type="text"
          required
          value={formData.staff_position || ''}
          onChange={(e) => onFormChange({ staff_position: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isSubmitting}
        />
      </div>
      
      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          required
          value={formData.staff_mail || ''}
          onChange={(e) => onFormChange({ staff_mail: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isSubmitting}
        />
      </div>
      
      {/* Gender Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gender *
        </label>
        <select
          required
          value={formData.gender || ''}
          onChange={(e) => onGenderChange(e.target.value)}
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
      
      {/* Floor Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Floor *
        </label>
        <select
          required
          value={formData.floor || ''}
          onChange={(e) => onFormChange({ floor: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isSubmitting}
        >
          <option value="">Select Floor</option>
          <option value="2nd Floor">2nd Floor</option>
          <option value="3rd Floor">3rd Floor</option>
        </select>
      </div>
      
      {/* Division Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Division
        </label>
        <select
          value={formData.division_id ?? ''}
          onChange={(e) => {
            const value = e.target.value;
            onDivisionChange(value ? Number(value) : undefined);
          }}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isSubmitting}
        >
          <option value="">Select Division</option>
          {divisions.map(division => (
            <option key={division.id} value={division.id}>
              {division.div_name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Department Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Department
        </label>
        <select
          value={formData.department_id ?? ''}
          onChange={(e) => {
            const value = e.target.value;
            onDepartmentChange(value ? Number(value) : undefined);
          }}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            !formData.division_id ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
          }`}
          disabled={!formData.division_id || isSubmitting}
        >
          <option value="">Select Department</option>
          {filteredDepartments.map(department => (
            <option key={department.id} value={department.id}>
              {department.dept_name}
            </option>
          ))}
        </select>
        {formData.division_id && filteredDepartments.length === 0 && (
          <p className="text-xs text-gray-500 mt-1">
            No departments found for this division
          </p>
        )}
      </div>
      
      {/* Team Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Team
        </label>
        <select
          value={formData.team_id ?? ''}
          onChange={(e) => {
            const value = e.target.value;
            onFormChange({ team_id: value ? Number(value) : undefined });
          }}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            !formData.department_id ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
          }`}
          disabled={!formData.department_id || isSubmitting}
        >
          <option value="">Select Team</option>
          {filteredTeams.map(team => (
            <option key={team.id} value={team.id}>
              {team.team_name}
            </option>
          ))}
        </select>
        {formData.department_id && filteredTeams.length === 0 && (
          <p className="text-xs text-gray-500 mt-1">
            No teams found for this department
          </p>
        )}
      </div>
    </div>
  );
};