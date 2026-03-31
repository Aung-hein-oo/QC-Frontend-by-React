import { useState } from 'react';
import { AttendanceRecord } from '../../types';
import { StatusBadge } from './StatusBadge';
import { X } from 'lucide-react';
import { Pagination } from '../common/Pagination';

type AttendanceTableProps = {
  attendance: AttendanceRecord[];
  showStaffInfo: boolean;
  itemsPerPage?: number;
};

type FilterState = {
  staff_id?: string;
  staff_name?: string;
  date?: string;
  attendance_status?: string;
  attendance_type?: string;
  remark?: string;
};

export const AttendanceTable = ({ attendance, showStaffInfo, itemsPerPage: initialItemsPerPage = 25 }: AttendanceTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [filters, setFilters] = useState<FilterState>({});
  
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };
  
  const filteredAttendance = attendance.filter(record => {
    if (filters.staff_id && !record.staff_id?.toLowerCase().includes(filters.staff_id.toLowerCase())) return false;
    if (filters.staff_name && !record.staff?.staff_name?.toLowerCase().includes(filters.staff_name.toLowerCase())) return false;
    if (filters.date && !record.date.includes(filters.date)) return false;
    if (filters.attendance_status && record.attendance_status !== filters.attendance_status) return false;
    if (filters.attendance_type && !record.attendance_type?.toLowerCase().includes(filters.attendance_type.toLowerCase())) return false;
    if (filters.remark && !record.remark?.toLowerCase().includes(filters.remark.toLowerCase())) return false;
    return true;
  });
  
  const totalItems = filteredAttendance.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredAttendance.slice(startIndex, startIndex + itemsPerPage);
  
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
  
  if (attendance.length === 0) {
    return <div className="text-center py-12 text-gray-500">No attendance records found</div>;
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
        <table className="w-full">
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
                        onChange={(e) => handleFilterChange('staff_id', e.target.value)}
                        className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
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
              )}
              {showStaffInfo && (
              <th className="px-6 py-4 text-left text-sm font-semibold">
                <div className="flex flex-col gap-2">
                  <span>Name</span>
                  <div className="relative">
                    <input
                      type="text"
                      value={filters.staff_name || ''}
                      onChange={(e) => handleFilterChange('staff_name', e.target.value)}
                      className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
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
              )}
              <th className="px-6 py-4 text-left text-sm font-semibold">
                <div className="flex flex-col gap-2">
                  <span>Date</span>
                  <div className="relative">
                    <input
                      type="text"
                      value={filters.date || ''}
                      onChange={(e) => handleFilterChange('date', e.target.value)}
                      className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {filters.date && (
                      <button
                        onClick={() => clearFilter('date')}
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
                      onChange={(e) => handleFilterChange('attendance_status', e.target.value)}
                      className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                    >
                      <option value="">All</option>
                      <option value="Present">Present</option>
                      <option value="Half Leave">Half Leave</option>
                      <option value="Leave">Leave</option>
                      <option value="Absence">Absence</option>
                    </select>
                    {filters.attendance_status && (
                      <button
                        onClick={() => clearFilter('attendance_status')}
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
                      onChange={(e) => handleFilterChange('attendance_type', e.target.value)}
                      className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {filters.attendance_type && (
                      <button
                        onClick={() => clearFilter('attendance_type')}
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
                      onChange={(e) => handleFilterChange('remark', e.target.value)}
                      className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {filters.remark && (
                      <button
                        onClick={() => clearFilter('remark')}
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
          <tbody className="divide-y">
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={showStaffInfo ? 5 : 4} className="px-6 py-12 text-center text-gray-500">
                  No matching records found
                </td>
              </tr>
            ) : (
              currentItems.map(record => (
                <tr key={record.id} className="hover:bg-gray-50">
                  {showStaffInfo && <td className="px-6 py-4 text-sm font-mono">{record.staff_id}</td>}
                  {showStaffInfo && <td className="px-6 py-4 text-sm font-mono">{record.staff?.staff_name}</td>}
                  <td className="px-6 py-4 text-sm">{record.date}</td>
                  <td className="px-6 py-4"><StatusBadge status={record.attendance_status} /></td>
                  <td className="px-6 py-4 text-sm">{record.attendance_type || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{record.remark || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {attendance.length > 0 && (
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