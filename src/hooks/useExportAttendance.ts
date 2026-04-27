import { useCallback, useState } from 'react';
import { useNotification } from '../components/common/Notification';
import { config } from '../utils/config';

interface ExportFilters {
  startDate?: string;
  endDate?: string;
  division_id?: string;
  department_id?: string;
  team_id?: string;
  staff_id?: string;
}

export const useExport = () => {
  const { showNotification } = useNotification();
  const [exporting, setExporting] = useState(false);

  const exportAttendance = useCallback(async (filters: ExportFilters = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
      showNotification('Please login to continue.', 'warning');
      return false;
    }

    setExporting(true);
    
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (filters.startDate) queryParams.append('start_date', filters.startDate);
      if (filters.endDate) queryParams.append('end_date', filters.endDate);
      if (filters.division_id) queryParams.append('division_id', filters.division_id);
      if (filters.department_id) queryParams.append('department_id', filters.department_id);
      if (filters.team_id) queryParams.append('team_id', filters.team_id);
      if (filters.staff_id) queryParams.append('staff_id', filters.staff_id);
      
      const queryString = queryParams.toString();
      const url = `${config.apiUrl}/attendance/export${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to export attendance data');
      }

      // Get the filename from content-disposition header
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'attendance_report.xlsx';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename\*=utf-8''(.+)/);
        if (filenameMatch) {
          filename = decodeURIComponent(filenameMatch[1]);
        } else {
          const simpleMatch = contentDisposition.match(/filename=(.+)/);
          if (simpleMatch) {
            filename = simpleMatch[1].replace(/['"]/g, '');
          }
        }
      }

      // Create blob and trigger download
      const blob = await response.blob();
      const url_blob = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url_blob;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url_blob);
      
      showNotification('Export completed successfully!', 'success');
      return true;
      
    } catch (error) {
      console.error('Export error:', error);
      showNotification(
        error instanceof Error ? error.message : 'Failed to export attendance data',
        'error'
      );
      return false;
    } finally {
      setExporting(false);
    }
  }, [showNotification]);

  return {
    exportAttendance,
    exporting,
  };
};