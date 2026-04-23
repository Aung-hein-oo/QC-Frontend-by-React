import React, { useState, useMemo } from 'react';
import { User, Eye, Edit, Trash2, X } from 'lucide-react';
import { StaffMember } from '../../types';
import { Pagination } from '../common/Pagination';

interface StaffTableProps {
  staffList: StaffMember[];
  onView: (staff: StaffMember) => void;
  onEdit: (staff: StaffMember) => void;
  onDelete: (staffId: number) => void;
  itemsPerPage?: number;
  scrollable?: boolean;
  fixedHeader?: boolean;
}

type FilterState = {
  staff_id?: string;
  staff_name?: string;
  staff_position?: string;
  staff_mail?: string;
  team?: string;
};

const filterableColumns: (keyof FilterState)[] = ['staff_id', 'staff_name', 'staff_position', 'staff_mail', 'team'];

// Helper function to check if ID has special prefix
const hasSpecialPrefix = (staffId: string): boolean => {
  return staffId?.startsWith('25-') || staffId?.startsWith('26-');
};

const StaffTable: React.FC<StaffTableProps> = ({ 
  staffList, 
  onView, 
  onEdit, 
  onDelete,
  itemsPerPage: initialItemsPerPage = 25,
  scrollable = false,
  fixedHeader = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [filters, setFilters] = useState<FilterState>({});

  // Memoized filtered and sorted data
  const processedStaff = useMemo(() => {
    // Apply filters
    const filtered = staffList.filter(staff => {
      if (filters.staff_id && !staff.staff_id?.toLowerCase().includes(filters.staff_id.toLowerCase())) return false;
      if (filters.staff_name && !staff.staff_name?.toLowerCase().includes(filters.staff_name.toLowerCase())) return false;
      if (filters.staff_position && !staff.staff_position?.toLowerCase().includes(filters.staff_position.toLowerCase())) return false;
      if (filters.staff_mail && !staff.staff_mail?.toLowerCase().includes(filters.staff_mail.toLowerCase())) return false;
      if (filters.team && !staff.team?.team_name?.toLowerCase().includes(filters.team.toLowerCase())) return false;
      return true;
    });

    // Apply sorting: team alphabetically, then staff ID with special handling for 25- and 26-
    return [...filtered].sort((a, b) => {
      // First sort by team
      const teamCompare = (a.team?.team_name || '').localeCompare(b.team?.team_name || '');
      if (teamCompare !== 0) return teamCompare;
      
      // Then sort by ID with special handling
      const idA = a.staff_id || '';
      const idB = b.staff_id || '';
      
      const hasSpecialA = hasSpecialPrefix(idA);
      const hasSpecialB = hasSpecialPrefix(idB);
      
      // If one has special prefix and the other doesn't, special prefixes come last
      if (hasSpecialA !== hasSpecialB) {
        return hasSpecialA ? 1 : -1;
      }
      
      // Both have special prefixes or both don't
      if (hasSpecialA && hasSpecialB) {
        // Extract the number after the prefix and compare
        const numA = parseInt(idA.substring(3), 10);
        const numB = parseInt(idB.substring(3), 10);
        return numA - numB;
      }
      
      // Regular numeric sorting for IDs without prefixes
      const numA = parseInt(idA, 10);
      const numB = parseInt(idB, 10);
      return isNaN(numA) || isNaN(numB) 
        ? idA.localeCompare(idB)
        : numA - numB;
    });
  }, [staffList, filters]);

  // Pagination calculations
  const totalPages = Math.ceil(processedStaff.length / itemsPerPage);
  const paginatedStaff = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedStaff.slice(start, start + itemsPerPage);
  }, [processedStaff, currentPage, itemsPerPage]);

  const hasActiveFilters = Object.values(filters).some(Boolean);

  const handleFilterChange = (column: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [column]: value || undefined }));
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  if (staffList.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No staff members found. Click "Add New Staff" to create one.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Filter Bar */}
      {hasActiveFilters && (
        <div className="flex justify-end px-4 py-2 flex-shrink-0 border-b">
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X size={16} />
            Reset Filters
          </button>
        </div>
      )}
      
      {/* Scrollable Table Container */}
      <div className={`flex-1 min-h-0 ${scrollable ? 'overflow-auto' : 'overflow-x-auto'}`}>
        <div className="min-w-full inline-block align-middle">
          <table className="min-w-full">
            <thead className={`bg-gray-50 border-b ${fixedHeader ? 'sticky top-0 z-10' : ''}`}>
              <tr>
                {filterableColumns.map(column => (
                  <th key={column} className="px-6 py-4 text-left text-sm font-semibold bg-gray-50">
                    <div className="flex flex-col gap-2">
                      <span>{column.replace('staff_', '').replace('_', ' ').toUpperCase()}</span>
                      <div className="relative">
                        <input
                          type="text"
                          value={filters[column] || ''}
                          onChange={(e) => handleFilterChange(column, e.target.value)}
                          className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
                        />
                        {filters[column] && (
                          <button
                            onClick={() => handleFilterChange(column, '')}
                            className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </th>
                ))}
                <th className="px-6 py-4 text-center text-sm font-semibold bg-gray-50">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedStaff.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No matching staff members found
                  </td>
                </tr>
              ) : (
                paginatedStaff.map((staff, index) => (
                  <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-sm font-mono text-gray-600">{staff.staff_id}</td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-800">{staff.staff_name}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{staff.staff_position}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{staff.staff_mail || '-'}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{staff.team?.team_name || '-'}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <ActionButton icon={Eye} onClick={() => onView(staff)} color="green" title="View Details" />
                        <ActionButton icon={Edit} onClick={() => onEdit(staff)} color="blue" title="Edit" />
                        <ActionButton icon={Trash2} onClick={() => onDelete(staff.id)} color="red" title="Delete" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Fixed Pagination */}
      {staffList.length > 0 && (
        <div className="flex-shrink-0 border-t bg-white">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={processedStaff.length}
            itemsPerPage={itemsPerPage}
            startIndex={(currentPage - 1) * itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(newSize) => {
              setItemsPerPage(newSize);
              setCurrentPage(1);
            }}
            showFilteredBadge={true}
            isFiltered={hasActiveFilters}
          />
        </div>
      )}
    </div>
  );
};

// Helper component for action buttons
const ActionButton: React.FC<{
  icon: React.ElementType;
  onClick: () => void;
  color: string;
  title: string;
}> = ({ icon: Icon, onClick, color, title }) => (
  <button
    onClick={onClick}
    className={`p-1.5 text-${color}-600 hover:bg-${color}-100 rounded transition-colors`}
    title={title}
  >
    <Icon size={16} />
  </button>
);

export default StaffTable;