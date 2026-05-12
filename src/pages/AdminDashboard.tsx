import React, { useRef, useState } from 'react';
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
  
  const [importingStaffExcel, setImportingStaffExcel] = useState(false);
  const [importingHolidayExcel, setImportingHolidayExcel] = useState(false);
  
  const {
    staffList, divisions, departments, teams, loading, showModal, showViewModal,
    editingStaff, viewingStaff, isSubmitting, generatedStaffId, updateGeneratedStaffId,
    fetchDepartmentsByDivision, fetchTeamsByDepartment, addStaff, updateStaff, deleteStaff,
    openAdd, openEdit, openView, close: closeModals,
    importStaffExcel, importHolidayExcel,
  } = useStaffManagement();

  const currentUser = React.useMemo(() => {
    try {
      const storedStaff = localStorage.getItem('staff');
      return storedStaff ? JSON.parse(storedStaff) : null;
    } catch {
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
        showNotification(`Access Denied: ${currentUser?.staff_position || 'User'} users do not have permission.`, 'error');
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    }
  }, [isAdmin, currentUser, loading, navigate, showNotification]);

  const handleSubmit = async (formData: any) => {
    const success = editingStaff 
      ? await updateStaff(formData, editingStaff.staff_id)
      : await addStaff(formData);
    
    if (success) {
      showSuccess(
        editingStaff ? 'Staff Updated' : 'Staff Added',
        `${formData.staff_name} has been successfully ${editingStaff ? 'updated' : 'added'}.`,
        editingStaff ? 'Updated' : 'Added',
        editingStaff ? 'blue' : 'emerald'
      );
    }
  };

  const handleDeleteStaff = (staffId: string) => {
    const staffToDelete = staffList.find(s => s.staff_id === staffId);
    showConfirm(
      'Delete Staff Member',
      `Are you sure you want to delete ${staffToDelete?.staff_name || 'this staff member'}? This action cannot be undone.`,
      async () => {
        await deleteStaff(staffId);
        showSuccess('Staff Deleted', `${staffToDelete?.staff_name} has been successfully deleted.`, 'Deleted', 'rose');
      },
      'Delete', 'Cancel', 'warning'
    );
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const holidayFileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (file: File, type: 'staff' | 'holiday') => {
    const setImporting = type === 'staff' ? setImportingStaffExcel : setImportingHolidayExcel;
    const importFn = type === 'staff' ? importStaffExcel : importHolidayExcel;
    const successMessage = type === 'staff' ? 'Staff data' : 'Holiday data';
    
    setImporting(true);
    try {
      const success = await importFn(file);
      if (success) {
        showSuccess('Import Successful', `${successMessage} has been successfully imported.`, 'Imported', 'emerald');
      } else {
        showConfirm('Import Failed', `Failed to import ${successMessage.toLowerCase()}. Check file format.`, () => {}, 'OK', '', 'error', false);
      }
    } catch {
      showConfirm('Import Failed', `Error importing ${successMessage.toLowerCase()}.`, () => {}, 'OK', '', 'error', false);
    } finally {
      setImporting(false);
      if (type === 'staff' && fileInputRef.current) fileInputRef.current.value = '';
      if (type === 'holiday' && holidayFileInputRef.current) holidayFileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImport(file, 'staff');
  };

  const handleHolidayFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImport(file, 'holiday');
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

  if (!currentUser || !isAdmin) return null;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 overflow-hidden main-container-fix">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".xlsx, .xls" className="hidden" />
      <input type="file" ref={holidayFileInputRef} onChange={handleHolidayFileChange} accept=".xlsx, .xls" className="hidden" />
      
      <AdminHeader 
        onAddStaff={openAdd}
        onImportExcel={() => fileInputRef.current?.click()}
        onAddHoliday={() => holidayFileInputRef.current?.click()}
        importing={false}
        importProgress={0}
        importingHoliday={importingHolidayExcel}
        holidayImportProgress={0}
      />

      <main className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full flex flex-col px-4 py-4">
          <div className="flex-1 min-h-0 bg-white rounded-xl border shadow-sm flex flex-col overflow-visible table-container-fix">
            <StaffTable 
              staffList={staffList}
              onView={openView}
              onEdit={openEdit}
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
        onDivisionChange={fetchDepartmentsByDivision}
        onDepartmentChange={fetchTeamsByDepartment}
      />

      <ViewStaffModal 
        isOpen={showViewModal}
        staff={viewingStaff}
        onClose={closeModals}
        onEdit={() => viewingStaff && openEdit(viewingStaff)}
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