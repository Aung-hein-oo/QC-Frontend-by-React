import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStaffManagement } from '../hooks/useStaffManagement';
import AdminHeader from '../components/admin/AdminHeader';
import StaffTable from '../components/admin/StaffTable';
import StaffModal from '../components/admin/StaffModal';
import ViewStaffModal from '../components/admin/ViewStaffModal';
import { useNotification } from '../components/common/Notification';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { SuccessModal } from '../components/common/SuccessModal';
import { useModals } from '../hooks/useModals';
import '../assets/css/admin-header.css';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { confirmModal, successModal, showConfirm, closeConfirm, showSuccess, closeSuccess } = useModals();
  
  const {
    staffList,
    divisions,
    departments,
    teams,
    importStaffExcel,
    importHolidayExcel,
    loading,
    showModal,
    showViewModal,
    editingStaff,
    viewingStaff,
    isSubmitting,
    generatedStaffId,
    importingHoliday,
    holidayImportProgress,
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

  const currentUser = React.useMemo(() => {
    try {
      const storedStaff = localStorage.getItem('staff');
      return storedStaff ? JSON.parse(storedStaff) : null;
    } catch (error) {
      console.error('Error parsing staff data:', error);
      return null;
    }
  }, []);

  const isAdmin = currentUser?.staff_position === 'Admin';

  React.useEffect(() => {
    if (!loading) {
      const token = localStorage.getItem('token');
      if (!token) {
        showNotification('Please login to access the admin dashboard.', 'error');
        setTimeout(() => navigate('/'), 1500);
        return;
      }

      if (!isAdmin) {
        showNotification(
          `Access Denied: ${currentUser?.staff_position || 'User'} users do not have permission.`,
          'error'
        );
        setTimeout(() => navigate('/dashboard'), 1500);
        return;
      }
    }
  }, [isAdmin, currentUser, loading, navigate, showNotification]);

  const handleSubmit = async (formData: any) => {
    if (editingStaff) {
      const success = await updateStaff(formData, editingStaff.staff_id);
      if (success) {
        showSuccess(
          'Staff Updated',
          `${formData.staff_name} has been successfully updated.`,
          'Updated',
          'blue'
        );
      }
    } else {
      const success = await addStaff(formData);
      if (success) {
        showSuccess(
          'Staff Added',
          `${formData.staff_name} has been successfully added to the system.`,
          'Added',
          'emerald'
        );
      }
    }
  };

  const handleDeleteStaff = (staffId: string) => {
    const staffToDelete = staffList.find(s => s.staff_id === staffId);
    
    showConfirm(
      'Delete Staff Member',
      `Are you sure you want to delete ${staffToDelete?.staff_name || 'this staff member'}? This action cannot be undone.`,
      async () => {
       await deleteStaff(staffId);
          showSuccess(
            'Staff Deleted',
            `${staffToDelete?.staff_name || 'Staff member'} has been successfully deleted.`,
            'Deleted',
            'rose'
          );
      },
      'Delete',
      'Cancel',
      'warning'
    );
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const holidayFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const success = await importStaffExcel(file);
      if (success) {
        showSuccess(
          'Import Successful',
          'Staff data has been successfully imported from Excel.',
          'Imported',
          'emerald'
        );
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        showConfirm(
          'Import Failed',
          'There was an error importing the staff data. Please check the file format and try again.',
          () => Promise.resolve(),
          'OK',
          '',
          'error',
          false
        );
      }
    }
  };

  const handleHolidayFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const success = await importHolidayExcel(file);
      if (success) {
        showSuccess(
          'Holiday Import Successful',
          'Holiday data has been successfully imported from Excel.',
          'Imported',
          'emerald'
        );
        if (holidayFileInputRef.current) {
          holidayFileInputRef.current.value = '';
        }
      } else {
        showConfirm(
          'Import Failed',
          'There was an error importing the holiday data. Please check the file format and try again.',
          () => Promise.resolve(),
          'OK',
          '',
          'error',
          false
        );
      }
    }
  };

  const handleExcelImport = () => {
    fileInputRef.current?.click();
  };

  const handleHolidayImport = () => {
    holidayFileInputRef.current?.click();
  };

  const handleDivisionChange = async (divisionId: number) => {
    await fetchDepartmentsByDivision(divisionId);
  };

  const handleDepartmentChange = async (departmentId: number) => {
    await fetchTeamsByDepartment(departmentId);
  };

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

  if (!currentUser || !isAdmin) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 overflow-hidden main-container-fix">
      {/* Staff file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".xlsx, .xls" 
        className="hidden" 
      />
      
      {/* Holiday file input */}
      <input 
        type="file" 
        ref={holidayFileInputRef} 
        onChange={handleHolidayFileChange} 
        accept=".xlsx, .xls" 
        className="hidden" 
      />
      
      <AdminHeader 
        onAddStaff={openAddModal}
        onImportExcel={handleExcelImport}
        onAddHoliday={handleHolidayImport}
        importing={isSubmitting}
        importProgress={0}
        importingHoliday={importingHoliday}
        holidayImportProgress={holidayImportProgress}
      />

      <main className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full flex flex-col px-4 py-4">
          <div className="flex-1 min-h-0 bg-white rounded-xl border shadow-sm flex flex-col overflow-visible table-container-fix">
            <StaffTable 
              staffList={staffList}
              onView={openViewModal}
              onEdit={openEditModal}
              onDelete={handleDeleteStaff}
              scrollable={true}
              fixedHeader={true}
            />
          </div>

          <div className="flex-shrink-0 mt-4 text-xs text-center text-gray-500 border-t pt-4">
            © 2026 Attendance Management System by <span className="font-bold text-slate-500">MODOS</span>. All rights reserved.
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

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmModal.onConfirm}
        type={confirmModal.type}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        showCancel={confirmModal.showCancel}
        isLoading={confirmModal.isLoading}
      />

      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={closeSuccess}
        title={successModal.title}
        message={successModal.message}
        action={successModal.action}
        actionColor={successModal.actionColor}
      />
    </div>
  );
};

export default AdminDashboard;