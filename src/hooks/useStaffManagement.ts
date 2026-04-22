import { useState, useEffect } from 'react';
import { StaffMember, StaffFormData, Division, Department, Team } from '../types';
import { config } from '../utils/config';

export const useStaffManagement = () => {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [viewingStaff, setViewingStaff] = useState<StaffMember | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedStaffId, setGeneratedStaffId] = useState<string>('');

  const fetchStaffList = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiUrl}/staff/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setStaffList(data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const fetchDivisions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiUrl}/division`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setDivisions(data);
    } catch (error) {
      console.error('Error fetching divisions:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiUrl}/department`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiUrl}/team`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setTeams(data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  // Fetch departments based on selected division
  const fetchDepartmentsByDivision = async (divisionId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiUrl}/department?division_id=${divisionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments by division:', error);
    }
  };

  // Fetch teams based on selected department
  const fetchTeamsByDepartment = async (departmentId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiUrl}/team?department_id=${departmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setTeams(data);
    } catch (error) {
      console.error('Error fetching teams by department:', error);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchStaffList(),
        fetchDivisions(),
        fetchDepartments(),
        fetchTeams(),
      ]);
      setLoading(false);
    };
    fetchAllData();
  }, []);

  // Function to generate the next staff ID based on gender
  const generateStaffId = (gender: string): string => {
    const prefix = gender === 'Male' ? '25' : '26';
    
    const sameGenderStaff = staffList.filter(staff => 
      staff.staff_id && staff.staff_id.startsWith(prefix)
    );
    
    const existingNumbers = sameGenderStaff
      .map(staff => {
        const match = staff.staff_id?.match(new RegExp(`^${prefix}-(\\d+)$`));
        return match ? parseInt(match[1]) : 0;
      })
      .filter(num => num > 0);
    
    const nextNumber = existingNumbers.length > 0 
      ? Math.max(...existingNumbers) + 1 
      : 1;
    
    const formattedNumber = nextNumber.toString().padStart(5, '0');
    
    return `${prefix}-${formattedNumber}`;
  };

  const updateGeneratedStaffId = (gender: string) => {
    if (gender && gender !== '') {
      const newStaffId = generateStaffId(gender);
      setGeneratedStaffId(newStaffId);
    } else {
      setGeneratedStaffId('');
    }
  };

  const addStaff = async (formData: StaffFormData) => {
    setIsSubmitting(true);
    try {
      const staffData = {
        ...formData,
        staff_id: formData.staff_id || generatedStaffId,
      };
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiUrl}/staff/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(staffData),
      });
      
      if (response.ok) {
        alert('Staff added successfully');
        setShowModal(false);
        await fetchStaffList();
        return true;
      } else {
        const errorData = await response.json();
        alert(`Failed to add staff: ${errorData.message || 'Unknown error'}`);
        return false;
      }
    } catch (error) {
      console.error('Error adding staff:', error);
      alert('Error adding staff member');
      return false;
    } finally {
      setIsSubmitting(false);
      setGeneratedStaffId('');
    }
  };

  const updateStaff = async (formData: StaffFormData, staffDatabaseId: string) => {
  console.log('=== UPDATE STAFF FUNCTION CALLED ===');
  console.log('Received staffDatabaseId:', staffDatabaseId);
  console.log('Type of staffDatabaseId:', typeof staffDatabaseId);
  console.log('Form data being sent:', formData);
  
  setIsSubmitting(true);
  try {
    const token = localStorage.getItem('token');
    const url = `${config.apiUrl}/staff/${staffDatabaseId}`;
    console.log('PUT Request URL:', url);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    console.log('Response status:', response.status);
    console.log('Response OK:', response.ok);
    
    if (response.ok) {
      const responseData = await response.json();
      console.log('Update successful:', responseData);
      alert('Staff updated successfully');
      setShowModal(false);
      await fetchStaffList();
      return true;
    } else {
      const errorData = await response.json();
      console.error('Update failed with error:', errorData);
      // Log the detailed validation errors
      if (errorData.detail && Array.isArray(errorData.detail)) {
        console.error('Validation errors:');
        errorData.detail.forEach((err: any, index: number) => {
          console.error(`Error ${index + 1}:`, err);
          if (err.loc) console.error('  Location:', err.loc);
          if (err.msg) console.error('  Message:', err.msg);
          if (err.type) console.error('  Type:', err.type);
        });
        alert(`Failed to update staff:\n${errorData.detail.map((err: any) => err.msg).join('\n')}`);
      } else {
        alert(`Failed to update staff: ${errorData.message || 'Unknown error'}`);
      }
      return false;
    }
  } catch (error) {
    console.error('Error updating staff:', error);
    alert('Error updating staff member');
    return false;
  } finally {
    setIsSubmitting(false);
  }
};

  const deleteStaff = async (staffDatabaseId: string) => {
    console.log('=== DELETE STAFF FUNCTION CALLED ===');
    console.log('Received staffDatabaseId:', staffDatabaseId);
    console.log('Type of staffDatabaseId:', typeof staffDatabaseId);
    
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        const token = localStorage.getItem('token');
        const url = `${config.apiUrl}/staff/${staffDatabaseId}`;
        console.log('DELETE Request URL:', url);
        
        const response = await fetch(url, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Response status:', response.status);
        console.log('Response OK:', response.ok);
        
        if (response.ok) {
          console.log('Delete successful');
          alert('Staff member deleted successfully');
          await fetchStaffList();
        } else {
          const errorData = await response.json();
          console.error('Delete failed:', errorData);
          alert('Failed to delete staff member');
        }
      } catch (error) {
        console.error('Error deleting staff:', error);
        alert('Error deleting staff member');
      }
    } else {
      console.log('Delete cancelled by user');
    }
  };

  const openAddModal = () => {
    setEditingStaff(null);
    setGeneratedStaffId('');
    setShowModal(true);
  };

  const openEditModal = (staff: StaffMember) => {
    console.log('=== OPEN EDIT MODAL ===');
    console.log('Staff object:', staff);
    console.log('Staff database ID (staff.id):', staff.id);
    console.log('Staff custom ID (staff.staff_id):', staff.staff_id);
    setEditingStaff(staff);
    setShowModal(true);
  };

  const openViewModal = (staff: StaffMember) => {
    setViewingStaff(staff);
    setShowViewModal(true);
  };

  const closeModals = () => {
    setShowModal(false);
    setShowViewModal(false);
    setEditingStaff(null);
    setViewingStaff(null);
    setGeneratedStaffId('');
  };

  return {
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
    openAddModal,
    openEditModal,
    openViewModal,
    closeModals,
  };
};