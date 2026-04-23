import { useState, useEffect, useCallback } from 'react';
import { StaffMember, StaffFormData, Division, Department, Team } from '../types';
import { config } from '../utils/config';

export const useStaffManagement = () => {
  const [state, setState] = useState({
    staffList: [] as StaffMember[],
    divisions: [] as Division[],
    departments: [] as Department[],
    teams: [] as Team[],
    loading: true,
    showModal: false,
    showViewModal: false,
    editingStaff: null as StaffMember | null,
    viewingStaff: null as StaffMember | null,
    isSubmitting: false,
    generatedStaffId: '',
  });

  // Helper: API request with error handling
  const apiRequest = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw error;
    }
    return options.method === 'DELETE' ? null : response.json();
  };

  // Helper: Clean object
  const clean = (data: any) => {
    const cleaned = { ...data };
    Object.keys(cleaned).forEach(key => 
      (cleaned[key] === null || cleaned[key] === undefined) && delete cleaned[key]
    );
    return cleaned;
  };

  // Fetch functions
  const fetchData = {
    staff: useCallback(async () => {
      const data = await apiRequest(`${config.apiUrl}/staff/`, { method: 'GET' });
      setState(prev => ({ ...prev, staffList: data }));
    }, []),
    
    divisions: useCallback(async () => {
      const data = await apiRequest(`${config.apiUrl}/division`, { method: 'GET' });
      setState(prev => ({ ...prev, divisions: data }));
    }, []),
    
    departments: useCallback(async () => {
      const data = await apiRequest(`${config.apiUrl}/department`, { method: 'GET' });
      setState(prev => ({ ...prev, departments: data }));
    }, []),
    
    teams: useCallback(async () => {
      const data = await apiRequest(`${config.apiUrl}/team`, { method: 'GET' });
      setState(prev => ({ ...prev, teams: data }));
    }, []),
    
    departmentsByDivision: useCallback(async (divisionId: number) => {
      const data = await apiRequest(`${config.apiUrl}/department?division_id=${divisionId}`, { method: 'GET' });
      setState(prev => ({ ...prev, departments: data }));
    }, []),
    
    teamsByDepartment: useCallback(async (departmentId: number) => {
      const data = await apiRequest(`${config.apiUrl}/team?department_id=${departmentId}`, { method: 'GET' });
      setState(prev => ({ ...prev, teams: data }));
    }, []),
  };

  // Generate staff ID
  const generateStaffId = useCallback((gender: string) => {
    if (!gender) return '';
    const prefix = gender === 'Male' ? '25' : '26';
    const sameGender = state.staffList.filter(s => s.staff_id?.startsWith(prefix));
    const numbers = sameGender.map(s => {
      const match = s.staff_id?.match(new RegExp(`^${prefix}-(\\d+)$`));
      return match ? parseInt(match[1]) : 0;
    }).filter(n => n > 0);
    const nextNum = (numbers.length ? Math.max(...numbers) + 1 : 1).toString().padStart(5, '0');
    return `${prefix}-${nextNum}`;
  }, [state.staffList]);

  // CRUD Operations
  const handleSubmit = async (formData: StaffFormData, isEdit: boolean, id?: number) => {
    setState(prev => ({ ...prev, isSubmitting: true }));
    
    console.log('=== handleSubmit Debug ===');
    console.log('isEdit:', isEdit);
    console.log('formData received:', formData);
    console.log('staff_permanent_status from form:', formData.staff_permanent_status);
    
    try {
      // FIX: Don't hardcode 'No' - use the value from formData
      const data = clean({
        ...formData,
        staff_id: !isEdit ? (formData.staff_id || state.generatedStaffId) : undefined,
        // Remove the hardcoded 'No' and use the actual value from form
        // staff_permanent_status is already in formData, so we don't need to set it again
        staff_password: formData.staff_password || 'xxxxxx',
      });
      
      // If editing and staff_permanent_status is not in formData, add it from editingStaff
      if (isEdit && !data.staff_permanent_status && state.editingStaff) {
        data.staff_permanent_status = state.editingStaff.staff_permanent_status || 'No';
      }
      
      console.log('Data being sent to API:', data);
      
      const url = isEdit ? `${config.apiUrl}/staff/${id}` : `${config.apiUrl}/staff/`;
      const method = isEdit ? 'PUT' : 'POST';
      
      const result = await apiRequest(url, { method, body: JSON.stringify(data) });
      
      console.log('API Response:', result);
      
      alert(`Staff ${isEdit ? 'updated' : 'added'} successfully`);
      setState(prev => ({ ...prev, showModal: false, generatedStaffId: '' }));
      await fetchData.staff();
      return true;
    } catch (error: any) {
      console.error('Error in handleSubmit:', error);
      const msg = error.detail?.map((e: any) => e.msg).join('\n') || error.message;
      alert(`Failed to ${isEdit ? 'update' : 'add'} staff:\n${msg}`);
      return false;
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const addStaff = (formData: StaffFormData) => handleSubmit(formData, false);
  const updateStaff = (formData: StaffFormData, id: number) => handleSubmit(formData, true, id);

  const deleteStaff = async (id: number) => {
    if (!window.confirm('Delete this staff member?')) return;
    try {
      await apiRequest(`${config.apiUrl}/staff/${id}`, { method: 'DELETE' });
      alert('Staff deleted successfully');
      await fetchData.staff();
    } catch (error: any) {
      const msg = error.detail?.map((e: any) => e.msg).join('\n') || error.message;
      alert(`Failed to delete staff:\n${msg}`);
    }
  };

  // Modal controls
  const modalControls = {
    openAdd: () => setState(prev => ({ ...prev, editingStaff: null, generatedStaffId: '', showModal: true })),
    openEdit: (staff: StaffMember) => {
      console.log('=== Opening Edit Modal ===');
      console.log('Staff data:', staff);
      console.log('Staff permanent status:', staff.staff_permanent_status);
      setState(prev => ({ ...prev, editingStaff: staff, showModal: true }));
    },
    openView: (staff: StaffMember) => setState(prev => ({ ...prev, viewingStaff: staff, showViewModal: true })),
    close: () => setState(prev => ({ 
      ...prev, 
      showModal: false, 
      showViewModal: false, 
      editingStaff: null, 
      viewingStaff: null, 
      generatedStaffId: '' 
    })),
  };

  // Initial load
  useEffect(() => {
    const init = async () => {
      setState(prev => ({ ...prev, loading: true }));
      await Promise.all([
        fetchData.staff(),
        fetchData.divisions(),
        fetchData.departments(),
        fetchData.teams(),
      ]);
      setState(prev => ({ ...prev, loading: false }));
    };
    init();
  }, []);

  return {
    // Data
    staffList: state.staffList,
    divisions: state.divisions,
    departments: state.departments,
    teams: state.teams,
    loading: state.loading,
    editingStaff: state.editingStaff,
    viewingStaff: state.viewingStaff,
    isSubmitting: state.isSubmitting,
    generatedStaffId: state.generatedStaffId,
    showModal: state.showModal,
    showViewModal: state.showViewModal,
    
    // Actions
    updateGeneratedStaffId: (gender: string) => setState(prev => ({ 
      ...prev, 
      generatedStaffId: generateStaffId(gender) 
    })),
    fetchDepartmentsByDivision: fetchData.departmentsByDivision,
    fetchTeamsByDepartment: fetchData.teamsByDepartment,
    addStaff,
    updateStaff,
    deleteStaff,
    ...modalControls,
  };
};