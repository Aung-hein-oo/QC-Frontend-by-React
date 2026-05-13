// InlineRemarkEdit.tsx (Alternative with full expansion)
import { useState } from 'react';
import { Edit2, Check, X, ChevronDown, ChevronUp } from 'lucide-react';

type InlineRemarkEditProps = {
  remark: string;
  isEditing: boolean;
  isUpdating: boolean;
  onSave: (newRemark: string) => Promise<void>;
  onCancel: () => void;
  onEdit: () => void;
};

export const InlineRemarkEdit = ({ 
  remark, 
  isEditing, 
  isUpdating, 
  onSave, 
  onCancel, 
  onEdit 
}: InlineRemarkEditProps) => {
  const [tempRemark, setTempRemark] = useState(remark);
  const [expanded, setExpanded] = useState(false);
  const maxLength = 100;
  
  const displayRemark = remark || '-';
  const needsTruncation = displayRemark !== '-' && displayRemark.length > maxLength;

  if (isEditing) {
    return (
      <div className="flex items-start gap-2">
        <textarea
          value={tempRemark}
          onChange={(e) => setTempRemark(e.target.value)}
          className="text-sm border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          rows={3}
          placeholder="Add a remark..."
          autoFocus
          disabled={isUpdating}
        />
        <div className="flex gap-1">
          <button
            onClick={() => onSave(tempRemark)}
            disabled={isUpdating}
            className="p-1 text-green-600 hover:text-green-700 disabled:opacity-50"
          >
            <Check size={16} />
          </button>
          <button
            onClick={onCancel}
            disabled={isUpdating}
            className="p-1 text-red-600 hover:text-red-700 disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  // Show full remark when expanded, truncated when collapsed
  const displayedText = expanded ? displayRemark : 
    (needsTruncation ? `${displayRemark.slice(0, maxLength)}...` : displayRemark);

  return (
    <div className="group">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <div className="text-sm text-gray-600 break-words whitespace-pre-wrap">
            {displayedText}
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
          {needsTruncation && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {expanded ? (
                <>
                  <ChevronUp size={14} />
                  <span>See less</span>
                </>
              ) : (
                <>
                  <ChevronDown size={14} />
                  <span>See more</span>
                </>
              )}
            </button>
          )}
          <button
            onClick={onEdit}
            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-blue-600 transition-opacity"
            title="Edit remark"
          >
            <Edit2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};