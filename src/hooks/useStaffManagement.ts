import { useState, useEffect } from 'react';
import { StaffMember } from '../types';
import { config } from '../utils/config';

export const useStaffManagement = () => {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffList();
  }, []);

  // Function to generate the next staff ID based on gender
  const generateStaffId = (gender: string): string => {
    // Get prefix based on gender: 25 for male, 26 for female
    const prefix = gender === 'Male' ? '25' : '26';
    
    // Filter staff by gender prefix
    const sameGenderStaff = staffList.filter(staff => 
      staff.staff_id && staff.staff_id.startsWith(prefix)
    );
    
    // Get all existing numbers for this gender
    const existingNumbers = sameGenderStaff
      .map(staff => {
        const match = staff.staff_id?.match(new RegExp(`^${prefix}-(\\d+)$`));
        return match ? parseInt(match[1]) : 0;
      })
      .filter(num => num > 0);
    
    // Find the next number (max + 1, or 1 if no existing)
    const nextNumber = existingNumbers.length > 0 
      ? Math.max(...existingNumbers) + 1 
      : 1;
    
    // Format with leading zeros (6 digits total after prefix)
    const formattedNumber = nextNumber.toString().padStart(5, '0');
    
    return `${prefix}-${formattedNumber}`;
  };

  // Function to update staff ID when gender changes
  const updateGeneratedStaffId = (gender: string) => {
    if (gender && gender !== '') {
      const newStaffId = generateStaffId(gender);
      setGeneratedStaffId(newStaffId);
    } else {
      setGeneratedStaffId('');
    }
  };

  const addStaff = async (formData: Partial<StaffMember>) => {
    setIsSubmitting(true);
    try {
      // Generate staff ID based on gender if not provided
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

  const updateStaff = async (formData: Partial<StaffMember>, staffId: string) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiUrl}/staff/${staffId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        alert('Staff updated successfully');
        setShowModal(false);
        await fetchStaffList();
        return true;
      } else {
        const errorData = await response.json();
        alert(`Failed to update staff: ${errorData.message || 'Unknown error'}`);
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

  const deleteStaff = async (staffId: string) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${config.apiUrl}/staff/${staffId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          alert('Staff member deleted successfully');
          await fetchStaffList();
        } else {
          alert('Failed to delete staff member');
        }
      } catch (error) {
        console.error('Error deleting staff:', error);
        alert('Error deleting staff member');
      }
    }
  };

  const openAddModal = () => {
    setEditingStaff(null);
    setGeneratedStaffId(''); // Clear generated ID
    setShowModal(true);
  };

  const openEditModal = (staff: StaffMember) => {
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
  };
};