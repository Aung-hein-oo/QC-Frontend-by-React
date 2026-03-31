import React from 'react';
// import { useNavigate } from 'react-router-dom';
import { useStaffManagement } from '../hooks/useStaffManagement';
import AdminHeader from '../components/admin/AdminHeader';
import StaffTable from '../components/admin/StaffTable';
import StaffModal from '../components/admin/StaffModal';
import ActionsBar from '../components/admin/ActionsBar';
import ViewStaffModal from '../components/admin/ViewStaffModal';

const AdminDashboard: React.FC = () => {
//   const navigate = useNavigate();
  const {
    staffList,
    loading,
    showModal,
    showViewModal,
    editingStaff,
    viewingStaff,
    isSubmitting,
    generatedStaffId,
    updateGeneratedStaffId,
    addStaff,
    updateStaff,
    deleteStaff,
    openAddModal,
    openEditModal,
    openViewModal,
    closeModals,
  } = useStaffManagement();

  const handleSubmit = async (formData: any) => {
    if (editingStaff) {
      await updateStaff(formData, editingStaff.staff_id);
    } else {
      await addStaff(formData);
    }
  };

  const handleExcelImport = () => {
    alert('Excel import functionality will be implemented soon');
  };

  const handleExcelExport = () => {
    alert('Excel export functionality will be implemented soon');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-cyan-100/30 to-cyan-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-300 via-teal-300 to-teal-300">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Actions Bar - Now above the table */}
        <ActionsBar 
          onAddStaff={openAddModal}
          onImportExcel={handleExcelImport}
          onExportExcel={handleExcelExport}
        />

        {/* Staff Table */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <StaffTable 
            staffList={staffList}
            onView={openViewModal}
            onEdit={openEditModal}
            onDelete={deleteStaff}
          />
        </div>

        <div className="mt-6 text-xs text-center text-gray-500 border-t pt-6">
          © 2026 Attendance Management System by MODOS. All rights reserved.
        </div>
      </main>

      <StaffModal 
        isOpen={showModal}
        editingStaff={editingStaff}
        isSubmitting={isSubmitting}
        generatedStaffId={generatedStaffId}
        onClose={closeModals}
        onSubmit={handleSubmit}
        onGenderChange={updateGeneratedStaffId}
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