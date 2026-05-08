import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStaffManagement } from '../hooks/useStaffManagement';
import AdminHeader from '../components/admin/AdminHeader';
import StaffTable from '../components/admin/StaffTable';
import StaffModal from '../components/admin/StaffModal';
import ViewStaffModal from '../components/admin/ViewStaffModal';
import { useNotification } from '../components/common/Notification';
import '../assets/css/admin-header.css'; // Import the CSS fix from assets folder

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const {
    staffList,
    divisions,
    departments,
    teams,
    loading,
    showModal,
    showViewModal,
    editingStaff,
    viewingStaff,
    isSubmitting,
    generatedStaffId,
    updateGeneratedStaffId,
    fetchDepartmentsByDivision,
    fetchTeamsByDepartment,
    addStaff,
    updateStaff,
    deleteStaff,
    openAdd: openAddModal,
    openEdit: openEditModal,
    openView: openViewModal,
    close: closeModals,
  } = useStaffManagement();

  // Get current user from localStorage
  const getStoredUser = React.useCallback(() => {
    try {
      const storedStaff = localStorage.getItem('staff');
      if (storedStaff) {
        return JSON.parse(storedStaff);
      }
    } catch (error) {
      console.error('Error parsing staff data:', error);
    }
    return null;
  }, []);

  const currentUser = getStoredUser();
  const isAdmin = currentUser?.staff_position === 'Admin';

  // Redirect non-admin users
  React.useEffect(() => {
    if (!loading) {
      // Check token first
      const token = localStorage.getItem('token');
      if (!token) {
        showNotification('Please login to access the admin dashboard.', 'error');
        setTimeout(() => navigate('/'), 1500);
        return;
      }

      // Then check if user is admin
      if (!isAdmin) {
        showNotification(
          `Access Denied: ${currentUser?.staff_position || 'User'} users do not have permission to access the admin dashboard.`,
          'error'
        );
        setTimeout(() => navigate('/dashboard'), 1500);
        return;
      }
    }
  }, [isAdmin, currentUser, loading, navigate, showNotification]);

  const handleSubmit = async (formData: any) => {
    if (editingStaff) {
      await updateStaff(formData, editingStaff.id);
    } else {
      await addStaff(formData);
    }
  };

  const handleExcelImport = () => {
    showNotification('Excel import functionality will be implemented soon', 'info');
  };

  const handleHolidayImport = () => {
    showNotification('Holiday import functionality will be implemented soon', 'info');
  };

  const handleDivisionChange = async (divisionId: number) => {
    await fetchDepartmentsByDivision(divisionId);
  };

  const handleDepartmentChange = async (departmentId: number) => {
    await fetchTeamsByDepartment(departmentId);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="animate-spin w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full mx-auto mb-2"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated or not admin (redirect will happen in useEffect)
  if (!currentUser || !isAdmin) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 overflow-hidden main-container-fix">
      <AdminHeader 
        onAddStaff={openAddModal}
        onImportExcel={handleExcelImport}
        onAddHoliday={handleHolidayImport}
      />

      <main className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full flex flex-col px-4 py-4">
          {/* Table Container - Full Width with fixed header and scrollable body */}
          <div className="flex-1 min-h-0 bg-white rounded-xl border shadow-sm flex flex-col overflow-visible table-container-fix">
            <StaffTable 
              staffList={staffList}
              onView={openViewModal}
              onEdit={openEditModal}
              onDelete={deleteStaff}
              scrollable={true}
              fixedHeader={true}
            />
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 mt-4 text-xs text-center text-gray-500 border-t pt-4">
            © 2026 Attendance Management System by MODOS. All rights reserved.
          </div>
        </div>
      </main>

      <StaffModal
        isOpen={showModal}
        editingStaff={editingStaff}
        isSubmitting={isSubmitting}
        generatedStaffId={generatedStaffId}
        divisions={divisions}
        departments={departments}
        teams={teams}
        onClose={closeModals}
        onSubmit={handleSubmit}
        onGenderChange={updateGeneratedStaffId}
        onDivisionChange={handleDivisionChange}
        onDepartmentChange={handleDepartmentChange}
      />

      <ViewStaffModal 
        isOpen={showViewModal}
        staff={viewingStaff}
        onClose={closeModals}
        onEdit={() => viewingStaff && openEditModal(viewingStaff)}
      />
    </div>
  );
};

export default AdminDashboard;