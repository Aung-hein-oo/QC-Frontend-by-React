import { useState, useEffect } from 'react';
import { API_URL } from '../utils/leave.constants';

export const useStaffData = (userId: string) => {
    const [staffId, setStaffId] = useState('');

    useEffect(() => {
        const fetchStaffDetails = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`${API_URL}/staff/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStaffId(data.staff_id);
                }
            } catch (err) {
                console.error(err);
            }
        };
        
        if (userId) fetchStaffDetails();
    }, [userId]);

    return { staffId };
};