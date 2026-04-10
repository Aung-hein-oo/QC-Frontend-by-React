import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-start justify-center bg-black/20 pt-20 z-50">
            <div className="bg-white rounded-xl shadow-xl w-96 p-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-red-100 p-2 rounded-full">
                        <AlertTriangle className="text-red-600 w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800">
                        Confirm Delete
                    </h2>
                </div>
                <p className="text-sm text-slate-600 mb-6">
                    Are you sure you want to delete this record? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};