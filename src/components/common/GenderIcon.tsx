import { User, Mars, Venus } from 'lucide-react';

export const GenderIcon = ({ gender }: { gender?: string }) => {
  const genderLower = gender?.toLowerCase();
  
  if (genderLower === 'male') {
    return (
      <span className="inline-flex items-center gap-1">
        <Mars size={14} className="text-blue-500" />
        <span>Male</span>
      </span>
    );
  }
  
  if (genderLower === 'female') {
    return (
      <span className="inline-flex items-center gap-1">
        <Venus size={14} className="text-pink-500" />
        <span>Female</span>
      </span>
    );
  }
  
  return (
    <span className="inline-flex items-center gap-1">
      <User size={14} className="text-gray-500" />
      <span>{gender || 'N/A'}</span>
    </span>
  );
};