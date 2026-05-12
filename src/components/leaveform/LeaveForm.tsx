// components/leaveform/LeaveForm.tsx

import React from 'react';
import { LEAVE_TYPES, ATTACHMENT_REQUIRED_TYPES } from '../../utils/leave.constants';
import { LeaveRequestType } from '../../types/leave.types';

interface LeaveFormProps {
    formData: LeaveRequestType;
    onInputChange: (e: React.ChangeEvent<any>) => void;
    onCheckboxChange: (approverId: string, checked: boolean) => void;
    onFileChange: (fileName: string) => void;
    approvers: Array<{ id: string; name: string }>;
    loadingApprovers?: boolean;
    isReadOnly?: boolean;
    staffGender?: string;
}

export const LeaveForm: React.FC<LeaveFormProps> = ({
    formData,
    onInputChange,
    onCheckboxChange,
    onFileChange,
    approvers,
    loadingApprovers = false,
}) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Staff ID */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Staff ID
                    </label>
                    <input
                        type="text"
                        value={formData.staff_id}
                        readOnly
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"
                    />
                </div>

                {/* Leave Type */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Leave Type *
                    </label>
                    <select
                        name="leave_type"
                        value={formData.leave_type}
                        onChange={onInputChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        required
                    >
                        <option value="">Select leave type</option>
                        {LEAVE_TYPES
                            .filter(type => {
                                if (type.value === formData.leave_type) return true;
                                const staffId = formData.staff_id || "";
                                const starts25 = staffId.startsWith("25");
                                const starts26 = staffId.startsWith("26");
                                
                                if (type.value === "maternity" && starts25) return false;
                                if (type.value === "paternity" && starts26) return false;

                                return true;
                            })
                            .map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                    </select>
                </div>

                {/* Start Date */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Start Date *
                    </label>
                    <input
                        type="date"
                        name="req_leave_date_from"
                        value={formData.req_leave_date_from}
                        onChange={onInputChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        required
                    />
                </div>

                {/* End Date */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        End Date *
                    </label>
                    <input
                        type="date"
                        name="req_leave_date_to"
                        value={formData.req_leave_date_to}
                        onChange={onInputChange}
                        min={formData.req_leave_date_from || new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        required
                    />
                </div>

                {/* Leave Status */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Leave Status *
                    </label>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="radio"
                                name="leave_status"
                                value="full"
                                checked={formData.leave_status === 'full'}
                                onChange={onInputChange}
                                className="text-blue-600 focus:ring-blue-500"
                            />
                            Full Day
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="radio"
                                name="leave_status"
                                value="half"
                                checked={formData.leave_status === 'half'}
                                onChange={onInputChange}
                                className="text-blue-600 focus:ring-blue-500"
                            />
                            Half Day
                        </label>
                    </div>
                </div>

                {/* Total Leave Day */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Total Leave Day
                    </label>
                    <input
                        type="number"
                        value={formData.total_leave_day}
                        readOnly
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed"
                    />
                </div>

                {/* Approver - Dynamic from API + Hardcoded User */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Approver(s) *
                    </label>
                    {loadingApprovers ? (
                        <div className="flex items-center gap-2 text-slate-500">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                            <span className="text-sm">Loading approvers...</span>
                        </div>
                    ) : (
                        <div className="flex flex-wrap items-center gap-6">
                            {/* Hardcoded Approver: Kay Thi Khine */}
                            <label className="flex items-center gap-2 text-sm text-slate-600 font-semibold">
                                <input
                                    type="checkbox"
                                    checked={formData.approved_by.includes('kay-thi-khine-static')}
                                    onChange={(e) => onCheckboxChange('kay-thi-khine-static', e.target.checked)}
                                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                />
                                Kay Thi Khine
                            </label>

                            {/* Dynamic Approvers from API */}
                            {approvers.map(approver => (
                                <label key={approver.id} className="flex items-center gap-2 text-sm text-slate-600 font-semibold">
                                    <input
                                        type="checkbox"
                                        checked={formData.approved_by.includes(approver.id)}
                                        onChange={(e) => onCheckboxChange(approver.id, e.target.checked)}
                                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                    />
                                    {approver.name}
                                </label>
                            ))}

                            {/* Fallback if no dynamic approvers and Kay Thi Khine isn't enough */}
                            {approvers.length === 0 && !formData.approved_by.includes('kay-thi-khine-static') && (
                                <p className="text-sm text-amber-600">Admin will approve.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Applied Date */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Applied Date
                    </label>
                    <input
                        name="apply_date"
                        value={formData.apply_date}
                        readOnly
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed"
                        required
                    />
                </div>
            </div>

            {/* Reason */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Reason for Leave *
                </label>
                <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={onInputChange}
                    rows={4}
                    className="w-full px-4 py-1 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none transition resize-none"
                    placeholder="Please provide details about your leave request..."
                    required
                />
            </div>

            {/* Attachment */}
            {ATTACHMENT_REQUIRED_TYPES.includes(formData.leave_type) && (
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Attachment File *
                    </label>
                    <input
                        type="file"
                        onChange={(e) => onFileChange(e.target.files?.[0]?.name || '')}
                        className="w-full text-sm text-slate-600 border border-slate-300 rounded-lg p-2"
                        required
                    />
                </div>
            )}
        </div>
    );
};