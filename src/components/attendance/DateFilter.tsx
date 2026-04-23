import { Calendar, X } from 'lucide-react';

type DateFilterProps = {
  selectedDate: string;
  onDateChange: (date: string) => void;
  // show: boolean;
};

export const DateFilter = ({ selectedDate, onDateChange}: DateFilterProps) => {
  // if (!show) return null;
  
  return (
    <div className="mb-4 inline-block bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border-l-4 border-blue-700 border">
      <div className="px-3 py-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Calendar size={16} className="text-blue-600" />
            <span className="text-xs font-medium text-gray-700">Search:</span>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-40 px-2.5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
          />
          {selectedDate && (
            <button
              onClick={() => onDateChange('')}
              className="flex items-center gap-1 px-2 py-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X size={12} />
              Clear
            </button>
          )}
        </div>
        
        {/* Selected date indicator */}
        {selectedDate && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500">Showing:</span>
              <span className="font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};