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

  // ============================================
  // EXTRACT FILENAME FROM CONTENT-DISPOSITION
  // ============================================
  const getFilename = (
    disposition: string | null,
    fallback: string = 'download.xlsx'
  ): string => {

    if (!disposition) {
      return fallback;
    }

    try {

      // ========================================
      // RFC5987 FORMAT
      // filename*=utf-8''xxxxx
      // ========================================
      const utf8Match = disposition.match(
        /filename\*\s*=\s*(?:UTF-8''|utf-8'')?([^;]+)/i
      );

      if (utf8Match?.[1]) {

        let filename = utf8Match[1].trim();

        // Remove surrounding quotes
        filename = filename.replace(/^["']|["']$/g, '');

        return decodeURIComponent(filename);
      }

      // ========================================
      // NORMAL FORMAT
      // filename="abc.xlsx"
      // ========================================
      const normalMatch = disposition.match(
        /filename\s*=\s*["']?([^;"']+)["']?/i
      );

      if (normalMatch?.[1]) {
        return normalMatch[1].trim();
      }

    } catch (err) {
      console.error('Filename parse failed:', err);
    }

    return fallback;
  };

  // ============================================
  // DOWNLOAD FILE
  // ============================================
  const downloadBlob = (
    blob: Blob,
    filename: string
  ) => {

    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = blobUrl;
    link.download = filename;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);
  };

  // ============================================
  // EXPORT ATTENDANCE
  // ============================================
  const exportAttendance = useCallback(
    async (options: ExportOptions = {}) => {

      const token = localStorage.getItem('token');

      if (!token) {
        showNotification(
          'Please login to continue.',
          'warning'
        );
        return false;
      }

      setExporting(true);

      try {

        // ======================================
        // BUILD QUERY PARAMS
        // ======================================
        const params = new URLSearchParams();

        if (options.date) {
          params.append('date', options.date);
        }

        if (options.startDate) {
          params.append('start_date', options.startDate);
        }

        if (options.endDate) {
          params.append('end_date', options.endDate);
        }

        if (options.divisionId) {
          params.append('division_id', options.divisionId);
        }

        if (options.departmentId) {
          params.append('department_id', options.departmentId);
        }

        if (options.teamId) {
          params.append('team_id', options.teamId);
        }

        const queryString = params.toString();

        const url =
          `${config.apiUrl}/bcp/` +
          `${queryString ? `?${queryString}` : ''}`;

        // ======================================
        // API REQUEST
        // ======================================
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {

          const errorText = await response.text();

          throw new Error(
            errorText ||
            `Export failed with status: ${response.status}`
          );
        }

        // ======================================
        // GET FILENAME FROM HEADER
        // ======================================
        const filename = getFilename(
          response.headers.get('content-disposition'),
          'attendance-report.xlsx'
        );

        console.log('Downloaded filename:', filename);

        // ======================================
        // GET FILE BLOB
        // ======================================
        const blob = await response.blob();

        // ======================================
        // DOWNLOAD
        // ======================================
        downloadBlob(blob, filename);

        showNotification(
          'Excel report exported successfully!',
          'success'
        );

        return true;

      } catch (error) {

        console.error('Export failed:', error);

        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to export Excel report';

        showNotification(errorMessage, 'error');

        return false;

      } finally {

        setExporting(false);
      }
    },
    [showNotification]
  );

  // ============================================
  // EXPORT HELPERS
  // ============================================
  const exportWithDateRange = useCallback(
    async (startDate: string, endDate: string) => {

      return await exportAttendance({
        startDate,
        endDate,
      });

    },
    [exportAttendance]
  );

  const exportWithFilters = useCallback(
    async (filters: ExportOptions) => {

      return await exportAttendance(filters);

    },
    [exportAttendance]
  );

  return {
    exportAttendance,
    exportWithDateRange,
    exportWithFilters,
    exporting,
  };
};