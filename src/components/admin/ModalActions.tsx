import React from 'react';
import { Save } from 'lucide-react';

interface ModalActionsProps {
  isSubmitting: boolean;
  editingStaff: any;
  onCancel: () => void;
  isSubmitDisabled?: boolean;
}

export const ModalActions: React.FC<ModalActionsProps> = ({
  isSubmitting,
  editingStaff,
  onCancel,
  isSubmitDisabled = false,
}) => {
  return (
    <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
        disabled={isSubmitting}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isSubmitting || isSubmitDisabled}
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
            {editingStaff ? 'Updating...' : 'Saving...'}
          </>
        ) : (
          <>
            <Save size={18} />
            {editingStaff ? 'Update' : 'Save'}
          </>
        )}
      </button>
    </div>
  );
};