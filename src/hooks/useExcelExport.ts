import { useState, useCallback } from 'react';
import { useNotification } from '../components/common/Notification';
import { config } from '../utils/config';

interface ExportOptions {
  date?: string;
  startDate?: string;
  endDate?: string;
  divisionId?: string;
  departmentId?: string;
  teamId?: string;
}

export const useExcelExport = () => {
  const [exporting, setExporting] = useState(false);
  const { showNotification } = useNotification();

  // Generate a meaningful filename based on export options
  const generateFilename = (options: ExportOptions): string => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    
    if (options.date) {
      return `Attendance_Report_${options.date}.xlsx`;
    }
    
    if (options.startDate && options.endDate) {
      return `Attendance_Report_${options.startDate}_to_${options.endDate}.xlsx`;
    }
    
    return `Attendance_Report_${timestamp}.xlsx`;
  };

  const exportAttendance = useCallback(async (options: ExportOptions = {}) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      showNotification('Please login to continue.', 'warning');
      return false;
    }

    setExporting(true);

    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (options.date) params.append('date', options.date);
      if (options.startDate) params.append('start_date', options.startDate);
      if (options.endDate) params.append('end_date', options.endDate);
      if (options.divisionId) params.append('division_id', options.divisionId);
      if (options.departmentId) params.append('department_id', options.departmentId);
      if (options.teamId) params.append('team_id', options.teamId);

      const queryString = params.toString();
      const url = `${config.apiUrl}/bcp/${queryString ? `?${queryString}` : ''}`;

      // Make the API request
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Export failed with status: ${response.status}`);
      }

      // Generate filename based on export options
      const filename = generateFilename(options);
      
      console.log('Generated filename:', filename);

      // Get the blob data
      const blob = await response.blob();
      
      // Create download link
      const url_blob = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url_blob;
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(url_blob);
      
      showNotification('Excel report exported successfully!', 'success');
      return true;
      
    } catch (error) {
      console.error('Export failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to export Excel report';
      showNotification(errorMessage, 'error');
      return false;
    } finally {
      setExporting(false);
    }
  }, [showNotification]);

  const exportWithDateRange = useCallback(async (startDate: string, endDate: string) => {
    return await exportAttendance({ startDate, endDate });
  }, [exportAttendance]);

  const exportWithFilters = useCallback(async (filters: {
    date?: string;
    startDate?: string;
    endDate?: string;
    divisionId?: string;
    departmentId?: string;
    teamId?: string;
  }) => {
    return await exportAttendance(filters);
  }, [exportAttendance]);

  return {
    exportAttendance,
    exportWithDateRange,
    exportWithFilters,
    exporting,
  };
};