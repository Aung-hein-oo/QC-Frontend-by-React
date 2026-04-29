import { useState, useEffect } from 'react';
import { LeaveRequestType } from '../types/leave.types';
import { config } from '../utils/config';
import { LEAVE_TYPES, ATTACHMENT_REQUIRED_TYPES } from '../utils/leave.constants';
import { calculateTotalLeaveDays, getTodayDate } from '../utils/leave.utils';
import { StaffMember } from '../types/index';

export const useLeaveRequest = (initialStaffId: string) => {
    useEffect(() => {
        if (initialStaffId) {
            setFormData(prev => ({
                ...prev,
                staff_id: initialStaffId
            }));
        }
    }, [initialStaffId]);

    const [formData, setFormData] = useState<LeaveRequestType>({
        staff_id: initialStaffId,
        req_leave_date_from: '',
        req_leave_date_to: '',
        leave_type: '',
        reason: '',
        approved_by: [],
        leave_status: '',
        attachment: '',
        total_leave_day: 0,
        apply_date: getTodayDate(),
        form_status: 'pending',
    });
    const [error, setError] = useState('')
    const [editId, setEditId] = useState<number | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const updated = { ...prev, [name]: value };

            if (name === 'leave_type' && !ATTACHMENT_REQUIRED_TYPES.includes(value)) {
                updated.attachment = '';
            }

            if (name === "leave_status") {
                updated.total_leave_day = value === "half" ? 0.5 : 1.0;
            }

            updated.total_leave_day = calculateTotalLeaveDays(
                updated.req_leave_date_from,
                updated.req_leave_date_to,
                updated.leave_status
            );

            return updated;
        });

        setError('');
    };

    const handleCheckboxChange = (approved_byId: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            approved_by: checked
                ? [...prev.approved_by, approved_byId]
                : prev.approved_by.filter(id => id !== approved_byId)
        }));
    };

    const handleFileChange = (fileName: string) => {
        setFormData(prev => ({ ...prev, attachment: fileName }));
    };

    const validateForm = (): boolean => {
        if (!formData.req_leave_date_from || !formData.req_leave_date_to || !formData.leave_type || !formData.reason) {
            setError('Please fill in all required fields');
            return false;
        }

        if (new Date(formData.req_leave_date_from) > new Date(formData.req_leave_date_to)) {
            setError('Start date cannot be after end date');
            return false;
        }

        return true;
    };

    const submitLeaveRequest = async () => {
        if (!validateForm()) return false;

        const selectedLeave = LEAVE_TYPES.find(
            type => type.value === formData.leave_type
        );

        const apiPayload = {
            leave_form_id: (formData as any).leave_form_id,
            staff_id: formData.staff_id,
            req_leave_date_from: formData.req_leave_date_from,
            req_leave_date_to: formData.req_leave_date_to,
            total_leave_day: String(formData.total_leave_day),
            leave_type: selectedLeave?.label || "",
            attachment: formData.attachment ? formData.attachment : null,
            reason: formData.reason,
            approved_by: formData.approved_by,
        };

        try {
            const isEdit = !!(formData as any).leave_form_id;

            const url = isEdit
                ? `${config.apiUrl}/leave-form/${(formData as any).leave_form_id}`
                : `${config.apiUrl}/leave-form/`;

            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(apiPayload)
            });

            const data = await res.json();

            if (res.ok) {
                alert(isEdit ? "Leave Updated Successfully!" : "Leave Submitted Successfully!");
                setError('');
                return true;
            }

            setError(data.message || 'Submission failed');
            return false;

        } catch (err) {
            setError("Network error");
            return false;
        }
    };
    const [staffList, setStaffList] = useState<StaffMember[]>([]);
    
        useEffect(() => {
            fetch(`${config.apiUrl}/staff/`)
                .then(res => res.json())
                .then(data => setStaffList(data));
        }, []);
    
        const getApproverName = (id: string | number) => {
            const user = staffList.find((s: any) => s.id == id);
            return user ? user.staff_name : id;
        };
    

    return {
        formData,
        error,
        handleInputChange,
        handleCheckboxChange,
        handleFileChange,
        submitLeaveRequest,
        setFormData,
        setError,
        setEditId,
        getApproverName
    };
};