import { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { AttendanceRecord, StaffMember } from '../../types';
import { Pagination } from '../common/Pagination';
import { useNotification } from '../common/Notification';
import { AttendanceTableHeader } from './AttendanceTableHeader';
import { StatusUpdateDropdown } from './StatusUpdateDropdown';
import { AttendanceTypeUpdateDropdown } from './AttendanceTypeUpdateDropdown';
import { AttendanceTypeBadge } from './AttendanceTypeBadge';

type AttendanceTableProps = {
  attendance: AttendanceRecord[];
  showStaffInfo: boolean;
  itemsPerPage?: number;
  currentStaff?: StaffMember | null;
  canEditRecord?: (record: AttendanceRecord) => boolean;
  onStatusUpdate?: () => void;
  onUpdateStatus?: (recordId: string, newStatus: string) => Promise<{ success: boolean; error?: string }>;
  onUpdateType?: (recordId: string, newType: string) => Promise<{ success: boolean; error?: string }>;
  updatingId?: string | null;
  updatingTypeId?: string | null;
  availableTypes?: string[];
  scrollable?: boolean;
  fixedHeader?: boolean;
};

type FilterState = {
  staff_id?: string;
  staff_name?: string;
  date?: string;
  attendance_status?: string;
  attendance_type?: string;
  remark?: string;
};

const RemarkCell = ({ remark }: { remark: string }) => {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 100;
  const needsTruncation = remark && remark.length > maxLength;
  
  if (!remark || remark === '-') return <span className="text-gray-400">-</span>;
  
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
          className="flex-shrink-0 text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1"
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          <span>{expanded ? 'See less' : 'See more'}</span>
        </button>
      )}
    </div>
  );
};

const ReadOnlyStatus = ({ status }: { status?: string }) => {
  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'leave': return 'bg-yellow-100 text-yellow-800';
      case 'half leave': return 'bg-orange-100 text-orange-800';
      case 'absence': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };
  
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {status || 'Not Marked'}
    </span>
  );
};

const ReadOnlyType = ({ type }: { type?: string }) => (
  <AttendanceTypeBadge type={type || '-'} />
);

export const AttendanceTable = ({ 
  attendance, 
  showStaffInfo, 
  itemsPerPage: initialItemsPerPage = 25,
  currentStaff,
  canEditRecord,
  onStatusUpdate,
  onUpdateStatus,
  onUpdateType,
  updatingId: externalUpdatingId,
  updatingTypeId: externalUpdatingTypeId,
  availableTypes = [],
}: AttendanceTableProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialItemsPerPage);
  const [filters, setFilters] = useState<FilterState>({});
  const [localUpdatingId, setLocalUpdatingId] = useState<string | null>(null);
  const [localUpdatingTypeId, setLocalUpdatingTypeId] = useState<string | null>(null);
  const [openStatusDropdownId, setOpenStatusDropdownId] = useState<string | null>(null);
  const [openTypeDropdownId, setOpenTypeDropdownId] = useState<string | null>(null);
  const { showNotification } = useNotification();

  const updatingId = externalUpdatingId !== undefined ? externalUpdatingId : localUpdatingId;
  const updatingTypeId = externalUpdatingTypeId !== undefined ? externalUpdatingTypeId : localUpdatingTypeId;

  const filteredRecords = attendance.filter(record => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      if (key === 'attendance_status') return record.attendance_status === value;
      if (key === 'attendance_type') return record.attendance_type?.toLowerCase().includes(value.toLowerCase());
      if (key === 'date') return record.date.includes(value);
      if (key === 'staff_id') return record.staff_id?.toLowerCase().includes(value.toLowerCase());
      if (key === 'staff_name') return record.staff?.staff_name?.toLowerCase().includes(value.toLowerCase());
      if (key === 'remark') return record.remark?.toLowerCase().includes(value.toLowerCase());
      return true;
    });
  });

  const totalItems = filteredRecords.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedRecords = filteredRecords.slice((page - 1) * pageSize, page * pageSize);

  const setFilter = (column: string, value: string) => {
    setFilters(prev => ({ ...prev, [column]: value || undefined }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setPage(1);
  };

  const hasFilters = Object.values(filters).some(Boolean);
  
  const checkCanEdit = (record: AttendanceRecord): boolean => {
    return canEditRecord ? canEditRecord(record) : false;
  };

  const updateStatus = async (recordId: string, newStatus: string) => {
    const recordToUpdate = attendance.find(r => String(r.id) === recordId);
    if (recordToUpdate && !checkCanEdit(recordToUpdate)) {
      showNotification('You do not have permission to edit this record', 'error');
      return;
    }

    if (!onUpdateStatus) {
      showNotification('Update status function not provided', 'error');
      return;
    }

    setLocalUpdatingId(recordId);
    
    try {
      const result = await onUpdateStatus(recordId, newStatus);
      
      if (result.success) {
        showNotification(`✓ Status updated to "${newStatus}"`, 'success');
        await onStatusUpdate?.();
        setOpenStatusDropdownId(null);
      } else {
        showNotification(result.error || 'Failed to update status', 'error');
      }
    } catch (error) {
      showNotification('Failed to update status. Please try again.', 'error');
    } finally {
      setLocalUpdatingId(null);
    }
  };

  const updateType = async (recordId: string, newType: string) => {
    const recordToUpdate = attendance.find(r => String(r.id) === recordId);
    if (recordToUpdate && !checkCanEdit(recordToUpdate)) {
      showNotification('You do not have permission to edit this record', 'error');
      return;
    }

    if (!onUpdateType) {
      showNotification('Update type function not provided', 'error');
      return;
    }

    setLocalUpdatingTypeId(recordId);
    
    try {
      const result = await onUpdateType(recordId, newType);
      
      if (result.success) {
        showNotification(`✓ Type updated to "${newType}"`, 'success');
        await onStatusUpdate?.();
        setOpenTypeDropdownId(null);
      } else {
        showNotification(result.error || 'Failed to update type', 'error');
      }
    } catch (error) {
      showNotification('Failed to update type. Please try again.', 'error');
    } finally {
      setLocalUpdatingTypeId(null);
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
    <div className="h-full flex flex-col">
      {hasFilters && (
        <div className="flex justify-end px-4 py-2 flex-shrink-0 border-b">
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            <X size={16} />
            Reset Filters
          </button>
        </div>
      )}
      
      <div className="flex-1 min-h-0 overflow-auto">
        <div className="min-w-full inline-block align-middle">
          <table className="min-w-full">
            <AttendanceTableHeader
              showStaffInfo={showStaffInfo}
              filters={filters}
              onFilterChange={setFilter}
              onClearFilter={(col) => setFilter(col, '')}
              sticky={false}
            />
            
            <tbody className="divide-y divide-gray-100">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={showStaffInfo ? 6 : 5} className="px-6 py-12 text-center text-gray-500">
                    No matching records found
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((record) => {
                  const canEdit = checkCanEdit(record);
                  return (
                    <tr key={record.id} className="hover:bg-gray-50">
                      {showStaffInfo && (
                        <>
                          <td className="px-6 py-3 text-sm font-mono text-gray-600">{record.staff_id}</td>
                          <td className="px-6 py-3 text-sm font-medium text-gray-800">{record.staff?.staff_name}</td>
                        </>
                      )}
                      <td className="px-6 py-3 text-sm text-gray-600">{record.date}</td>
                      <td className="px-6 py-3">
                        {canEdit ? (
                          <StatusUpdateDropdown
                            recordId={String(record.id)}
                            currentStatus={record.attendance_status}
                            isAdmin={canEdit}
                            isUpdating={updatingId === String(record.id)}
                            showDropdown={openStatusDropdownId === String(record.id)}
                            onStatusClick={(id) => setOpenStatusDropdownId(openStatusDropdownId === id ? null : id)}
                            onStatusConfirm={updateStatus}
                          />
                        ) : (
                          <ReadOnlyStatus status={record.attendance_status} />
                        )}
                      </td>
                      <td className="px-6 py-3">
                        {canEdit ? (
                          <AttendanceTypeUpdateDropdown
                            recordId={String(record.id)}
                            currentType={record.attendance_type}
                            isAdmin={canEdit}
                            isUpdating={updatingTypeId === String(record.id)}
                            showDropdown={openTypeDropdownId === String(record.id)}
                            availableTypes={availableTypes}
                            staffId={record.staff_id}
                            onTypeClick={(id) => setOpenTypeDropdownId(openTypeDropdownId === id ? null : id)}
                            onTypeConfirm={updateType}
                          />
                        ) : (
                          <ReadOnlyType type={record.attendance_type} />
                        )}
                      </td>
                      <td className="px-6 py-3 min-w-[250px] max-w-[300px]">
                        <RemarkCell remark={record.remark || '-'} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {attendance.length > 0 && (
        <div className="flex-shrink-0 border-t bg-white">
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
        </div>
      )}
    </div>
  );
};