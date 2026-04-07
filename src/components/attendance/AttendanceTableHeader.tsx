import React from 'react';
import { X } from 'lucide-react';

type FilterState = {
  staff_id?: string;
  staff_name?: string;
  date?: string;
  attendance_status?: string;
  attendance_type?: string;
  remark?: string;
};

interface AttendanceTableHeaderProps {
  showStaffInfo: boolean;
  filters: FilterState;
  onFilterChange: (column: string, value: string) => void;
  onClearFilter: (column: string) => void;
}

const filterColumns = [
  { key: 'staff_id', label: 'Staff ID', showWhen: true },
  { key: 'staff_name', label: 'Name', showWhen: true },
  { key: 'date', label: 'Date', showWhen: true, placeholder: 'YYYY-MM-DD' },
  { key: 'attendance_status', label: 'Status', showWhen: true, isSelect: true },
  { key: 'attendance_type', label: 'Type', showWhen: true },
  { key: 'remark', label: 'Remark', showWhen: true },
];

const statusOptions = ['Present', 'Half Leave', 'Leave', 'Absence'];

export const AttendanceTableHeader: React.FC<AttendanceTableHeaderProps> = ({
  showStaffInfo,
  filters,
  onFilterChange,
  onClearFilter,
}) => {
  return (
    <thead className="bg-gray-50 border-b">
      <tr>
        {showStaffInfo && (
          <th className="px-6 py-4 text-left text-sm font-semibold">
            <div className="flex flex-col gap-2">
              <span>Staff ID</span>
              <div className="relative">
                <input
                  type="text"
                  value={filters.staff_id || ''}
                  onChange={(e) => onFilterChange('staff_id', e.target.value)}
                  className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {filters.staff_id && (
                  <button
                    onClick={() => onClearFilter('staff_id')}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
          </th>
        )}
        
        {showStaffInfo && (
          <th className="px-6 py-4 text-left text-sm font-semibold">
            <div className="flex flex-col gap-2">
              <span>Name</span>
              <div className="relative">
                <input
                  type="text"
                  value={filters.staff_name || ''}
                  onChange={(e) => onFilterChange('staff_name', e.target.value)}
                  className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {filters.staff_name && (
                  <button
                    onClick={() => onClearFilter('staff_name')}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
          </th>
        )}
        
        <th className="px-6 py-4 text-left text-sm font-semibold">
          <div className="flex flex-col gap-2">
            <span>Date</span>
            <div className="relative">
              <input
                type="text"
                value={filters.date || ''}
                onChange={(e) => onFilterChange('date', e.target.value)}
                className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="YYYY-MM-DD"
              />
              {filters.date && (
                <button
                  onClick={() => onClearFilter('date')}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        </th>
        
        <th className="px-6 py-4 text-left text-sm font-semibold">
          <div className="flex flex-col gap-2">
            <span>Status</span>
            <div className="relative">
              <select
                value={filters.attendance_status || ''}
                onChange={(e) => onFilterChange('attendance_status', e.target.value)}
                className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="">All</option>
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {filters.attendance_status && (
                <button
                  onClick={() => onClearFilter('attendance_status')}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        </th>
        
        <th className="px-6 py-4 text-left text-sm font-semibold">
          <div className="flex flex-col gap-2">
            <span>Type</span>
            <div className="relative">
              <input
                type="text"
                value={filters.attendance_type || ''}
                onChange={(e) => onFilterChange('attendance_type', e.target.value)}
                className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {filters.attendance_type && (
                <button
                  onClick={() => onClearFilter('attendance_type')}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        </th>
        
        <th className="px-6 py-4 text-left text-sm font-semibold">
          <div className="flex flex-col gap-2">
            <span>Remark</span>
            <div className="relative">
              <input
                type="text"
                value={filters.remark || ''}
                onChange={(e) => onFilterChange('remark', e.target.value)}
                className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {filters.remark && (
                <button
                  onClick={() => onClearFilter('remark')}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        </th>
      </tr>
    </thead>
  );
};