import { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { AttendanceRecord } from '../../types';
import { Pagination } from '../common/Pagination';
import { useNotification } from '../common/Notification';
import { config } from '../../utils/config';
import { AttendanceTableHeader } from './AttendanceTableHeader';
import { StatusUpdateDropdown } from './StatusUpdateDropdown';

type AttendanceTableProps = {
  attendance: AttendanceRecord[];
  showStaffInfo: boolean;
  itemsPerPage?: number;
  isAdmin?: boolean;
  onStatusUpdate?: () => void;
};

type FilterState = {
  staff_id?: string;
  staff_name?: string;
  date?: string;
  attendance_status?: string;
  attendance_type?: string;
  remark?: string;
};

// Helper component for remark cell
const RemarkCell = ({ remark }: { remark: string }) => {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 100;
  const needsTruncation = remark && remark.length > maxLength;
  
  if (!remark || remark === '-') {
    return <span className="text-gray-400">-</span>;
  }
  
  return (
    <div className="flex items-start gap-2">
      <div className="flex-1">
        <span className="text-sm text-gray-600 break-words">
          {expanded ? remark : `${remark.slice(0, maxLength)}${needsTruncation ? '...' : ''}`}
        </span>
      </div>
      {needsTruncation && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-shrink-0 text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1 transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp size={14} />
              <span>See less</span>
            </>
          ) : (
            <>
              <ChevronDown size={14} />
              <span>See more</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export const AttendanceTable = ({ 
  attendance, 
  showStaffInfo, 
  itemsPerPage: initialItemsPerPage = 25,
  isAdmin = false,
  onStatusUpdate 
}: AttendanceTableProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialItemsPerPage);
  const [filters, setFilters] = useState<FilterState>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const { showNotification } = useNotification();

  // Filter records
  const filteredRecords = attendance.filter(record => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      if (key === 'attendance_status') return record.attendance_status === value;
      if (key === 'date') return record.date.includes(value);
      if (key === 'staff_id') return record.staff_id?.toLowerCase().includes(value.toLowerCase());
      if (key === 'staff_name') return record.staff?.staff_name?.toLowerCase().includes(value.toLowerCase());
      if (key === 'attendance_type') return record.attendance_type?.toLowerCase().includes(value.toLowerCase());
      if (key === 'remark') return record.remark?.toLowerCase().includes(value.toLowerCase());
      return true;
    });
  });

  // Pagination
  const totalItems = filteredRecords.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedRecords = filteredRecords.slice((page - 1) * pageSize, page * pageSize);

  // Filter handlers
  const setFilter = (column: string, value: string) => {
    setFilters(prev => ({ ...prev, [column]: value || undefined }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setPage(1);
  };

  const hasFilters = Object.values(filters).some(Boolean);

  // Status update handler
  const updateStatus = async (recordId: string, newStatus: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      showNotification('Please login to continue.', 'error');
      return;
    }

    setUpdatingId(recordId);
    
    try {
      const response = await fetch(`${config.apiUrl}/attendance/${recordId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ attendance_status: newStatus }),
      });

      if (response.ok) {
        showNotification(`✓ Status updated to "${newStatus}"`, 'success');
        await onStatusUpdate?.();
        setOpenDropdownId(null);
      } else {
        const error = await response.json();
        showNotification(error.message || 'Failed to update status', 'error');
      }
    } catch (error) {
      showNotification('Failed to update status. Please try again.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  if (!attendance.length) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <div className="text-4xl mb-2">📋</div>
        <div className="text-gray-500">No attendance records found</div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {hasFilters && (
        <div className="flex justify-end">
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X size={16} />
            Reset Filters
          </button>
        </div>
      )}
      
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full">
          <AttendanceTableHeader
            showStaffInfo={showStaffInfo}
            filters={filters}
            onFilterChange={setFilter}
            onClearFilter={(col) => setFilter(col, '')}
          />
          
          <tbody className="divide-y divide-gray-100">
            {!paginatedRecords.length ? (
              <tr>
                <td colSpan={showStaffInfo ? 6 : 5} className="px-6 py-12 text-center text-gray-500">
                  No matching records found
                </td>
              </tr>
            ) : (
              paginatedRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  {showStaffInfo && (
                    <>
                      <td className="px-6 py-3 text-sm font-mono text-gray-600">{record.staff_id}</td>
                      <td className="px-6 py-3 text-sm font-medium text-gray-800">{record.staff?.staff_name}</td>
                    </>
                  )}
                  <td className="px-6 py-3 text-sm text-gray-600">{record.date}</td>
                  <td className="px-6 py-3">
                    <StatusUpdateDropdown
                      recordId={String(record.id)}
                      currentStatus={record.attendance_status}
                      isAdmin={isAdmin}
                      isUpdating={updatingId === String(record.id)}
                      showDropdown={openDropdownId === String(record.id)}
                      onStatusClick={(id) => setOpenDropdownId(openDropdownId === id ? null : id)}
                      onStatusConfirm={updateStatus}
                    />
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">{record.attendance_type || '-'}</td>
                  <td className="px-6 py-3 min-w-[250px] max-w-[300px]">
                    <RemarkCell remark={record.remark || '-'} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {attendance.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={pageSize}
          startIndex={(page - 1) * pageSize}
          onPageChange={setPage}
          onItemsPerPageChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          showFilteredBadge
          isFiltered={hasFilters}
        />
      )}
    </div>
  );
};