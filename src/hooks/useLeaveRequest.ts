import { useState } from 'react';
import { LeaveRequestType } from '../types/leave.types';
import { API_URL, ATTACHMENT_REQUIRED_TYPES } from '../utils/leave.constants';
import { calculateTotalLeaveDays, getTodayDate } from '../utils/leave.utils';

export const useLeaveRequest = (initialStaffId: string) => {
    const [formData, setFormData] = useState<LeaveRequestType>({
        staff_id: initialStaffId,
        start_date: '',
        end_date: '',
        leave_type: '',
        reason: '',
        approver: [],
        leave_status: '',
        attachment: '',
        total_leave_day: 0,
        apply_date: getTodayDate(),
    });
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            
            if (name === 'leave_type' && !ATTACHMENT_REQUIRED_TYPES.includes(value)) {
                updated.attachment = '';
            }
            
            updated.total_leave_day = calculateTotalLeaveDays(
                updated.start_date, 
                updated.end_date, 
                updated.leave_status
            );
            
            return updated;
        });
        
        setError('');
    };

    const handleCheckboxChange = (approverId: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            approver: checked 
                ? [...prev.approver, approverId]
                : prev.approver.filter(id => id !== approverId)
        }));
    };

    const handleFileChange = (fileName: string) => {
        setFormData(prev => ({ ...prev, attachment: fileName }));
    };

    const validateForm = (): boolean => {
        if (!formData.start_date || !formData.end_date || !formData.leave_type || !formData.reason) {
            setError('Please fill in all fields');
            return false;
        }
        
        if (new Date(formData.start_date) > new Date(formData.end_date)) {
            setError('Start date cannot be after end date');
            return false;
        }
        
        return true;
    };

    const submitLeaveRequest = async () => {
        if (!validateForm()) return false;
        
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/leave-requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            
            if (res.ok) return true;
            
            const errData = await res.json();
            setError(errData.message || 'Error');
            return false;
        } catch {
            setError('Network error');
            return false;
        }
    };

    return {
        formData,
        error,
        handleInputChange,
        handleCheckboxChange,
        handleFileChange,
        submitLeaveRequest,
        setFormData,
        setError
    };
};