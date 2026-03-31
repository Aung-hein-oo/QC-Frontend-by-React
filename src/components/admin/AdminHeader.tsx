import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, LogOut } from 'lucide-react';

const AdminHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b sticky top-0 z-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Calendar className="text-blue-600" size={28} />
          <h1 className="text-xl font-semibold text-gray-800">AMS Admin</h1>
          <div className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
            Dashboard
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { localStorage.clear(); navigate('/'); }} 
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;