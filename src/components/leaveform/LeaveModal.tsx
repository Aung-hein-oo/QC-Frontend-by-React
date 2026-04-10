import React from 'react';
import { X, Send } from 'lucide-react';
import { LeaveForm } from './LeaveForm';
import { LeaveRequestType } from '../../types/leave.types';

interface LeaveModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    formData: LeaveRequestType;
    onInputChange: (e: React.ChangeEvent<any>) => void;
    onCheckboxChange: (approverId: string, checked: boolean) => void;
    onFileChange: (fileName: string) => void;
    error: string;
    title: string;
    submitButtonText: string;
}

export const LeaveModal: React.FC<LeaveModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    formData,
    onInputChange,
    onCheckboxChange,
    onFileChange,
    error,
    title,
    submitButtonText
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-3xl">
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="border-b px-6 py-4 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold">{title}</h2>
                            <p className="text-slate-500 mt-1">
                                Please complete the form below to submit your leave request.
                            </p>
                        </div>
                        <button onClick={onClose}>
                            <X className="text-slate-500 hover:text-red-500" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={onSubmit} className="p-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-6">
                                <X className="text-red-500 mt-0.5" size={18} />
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        <LeaveForm
                            formData={formData}
                            onInputChange={onInputChange}
                            onCheckboxChange={onCheckboxChange}
                            onFileChange={onFileChange}
                        />

                        {/* Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors"
                            >
                                <Send size={15} />
                                <span>{submitButtonText}</span>
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2.5 border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};