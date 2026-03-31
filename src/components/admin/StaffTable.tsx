import React, { useState } from 'react';
import { User, Eye, Edit, Trash2, X } from 'lucide-react';
import { StaffMember } from '../../types';
import { Pagination } from '../common/Pagination';

interface StaffTableProps {
  staffList: StaffMember[];
  onView: (staff: StaffMember) => void;
  onEdit: (staff: StaffMember) => void;
  onDelete: (staffId: string) => void;
  itemsPerPage?: number;
}

type FilterState = {
  staff_id?: string;
  staff_name?: string;
  staff_position?: string;
  staff_mail?: string;
  team?: string;
};

const StaffTable: React.FC<StaffTableProps> = ({ 
  staffList, 
  onView, 
  onEdit, 
  onDelete,
  itemsPerPage: initialItemsPerPage = 25 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [filters, setFilters] = useState<FilterState>({});
  
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };
  
  const filteredStaff = staffList.filter(staff => {
    if (filters.staff_id && !staff.staff_id?.toLowerCase().includes(filters.staff_id.toLowerCase())) return false;
    if (filters.staff_name && !staff.staff_name?.toLowerCase().includes(filters.staff_name.toLowerCase())) return false;
    if (filters.staff_position && !staff.staff_position?.toLowerCase().includes(filters.staff_position.toLowerCase())) return false;
    if (filters.staff_mail && !staff.staff_mail?.toLowerCase().includes(filters.staff_mail.toLowerCase())) return false;
    if (filters.team && !staff.team?.toLowerCase().includes(filters.team.toLowerCase())) return false;
    return true;
  });
  
  const totalItems = filteredStaff.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredStaff.slice(startIndex, startIndex + itemsPerPage);
  
  const goToPage = (page: number) => setCurrentPage(page);
  
  const handleFilterChange = (column: string, value: string) => {
    setFilters(prev => ({ ...prev, [column]: value || undefined }));
    setCurrentPage(1);
  };
  
  const clearFilter = (column: string) => {
    setFilters(prev => ({ ...prev, [column]: undefined }));
    setCurrentPage(1);
  };
  
  const clearAllFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };
  
  const hasActiveFilters = Object.values(filters).some(Boolean);
  
  if (staffList.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No staff members found. Click "Add New Staff" to create one.
      </div>
    );
  }

  return (
    <div>
      {hasActiveFilters && (
        <div className="flex justify-end mb-4">
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            <X size={16} />
            Reset
          </button>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-white-600 to-white-700 text-black">
            <tr>
              <th className="p-3 text-left">
                <div className="flex flex-col gap-2">
                  <span>Staff ID</span>
                  <div className="relative">
                    <input
                      type="text"
                      value={filters.staff_id || ''}
                      onChange={(e) => handleFilterChange('staff_id', e.target.value)}
                      className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
                    />
                    {filters.staff_id && (
                      <button
                        onClick={() => clearFilter('staff_id')}
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </th>
              <th className="p-3 text-left">
                <div className="flex flex-col gap-2">
                  <span>Name</span>
                  <div className="relative">
                    <input
                      type="text"
                      value={filters.staff_name || ''}
                      onChange={(e) => handleFilterChange('staff_name', e.target.value)}
                      className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
                    />
                    {filters.staff_name && (
                      <button
                        onClick={() => clearFilter('staff_name')}
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </th>
              <th className="p-3 text-left">
                <div className="flex flex-col gap-2">
                  <span>Position</span>
                  <div className="relative">
                    <input
                      type="text"
                      value={filters.staff_position || ''}
                      onChange={(e) => handleFilterChange('staff_position', e.target.value)}
                      className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
                    />
                    {filters.staff_position && (
                      <button
                        onClick={() => clearFilter('staff_position')}
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </th>
              <th className="p-3 text-left">
                <div className="flex flex-col gap-2">
                  <span>Email</span>
                  <div className="relative">
                    <input
                      type="text"
                      value={filters.staff_mail || ''}
                      onChange={(e) => handleFilterChange('staff_mail', e.target.value)}
                      className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
                    />
                    {filters.staff_mail && (
                      <button
                        onClick={() => clearFilter('staff_mail')}
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </th>
              <th className="p-3 text-left">
                <div className="flex flex-col gap-2">
                  <span>Team</span>
                  <div className="relative">
                    <input
                      type="text"
                      value={filters.team || ''}
                      onChange={(e) => handleFilterChange('team', e.target.value)}
                      className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
                    />
                    {filters.team && (
                      <button
                        onClick={() => clearFilter('team')}
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  No matching staff members found
                </td>
              </tr>
            ) : (
              currentItems.map((staff, index) => (
                <tr key={staff.staff_id} className={`border-t ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50`}>
                  <td className="p-3 font-medium">{staff.staff_id}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User size={14} className="text-blue-600" />
                      </div>
                      <span>{staff.staff_name}</span>
                    </div>
                  </td>
                  <td className="p-3">{staff.staff_position}</td>
                  <td className="p-3">{staff.staff_mail}</td>
                  <td className="p-3">{staff.team || '-'}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onView(staff)}
                        className="p-1.5 text-green-600 hover:bg-green-100 rounded"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => onEdit(staff)}
                        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(staff.staff_id)}
                        className="p-1.5 text-red-600 hover:bg-red-100 rounded"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {staffList.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          startIndex={startIndex}
          onPageChange={goToPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          showFilteredBadge={true}
          isFiltered={hasActiveFilters}
        />
      )}
    </div>
  );
};

export default StaffTable;