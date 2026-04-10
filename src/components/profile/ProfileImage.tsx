import React, { useState } from 'react';
import { Pencil } from 'lucide-react';

interface ProfileImageProps {
  staffId?: string;
  gender?: string;
  staffName?: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ staffId, gender, staffName }) => {
  const [image, setImage] = useState<string | null>(null);

  const getProfileImage = () => {
    if (image) return image;
    
    if (staffId?.startsWith("25")) {
      return "/male.png";
    }
    
    if (gender?.toLowerCase() === 'male') {
      return "/male.png";
    } else if (gender?.toLowerCase() === 'female') {
      return "/female.jpg";
    }
    
    return "/female.jpg";
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && ["image/png", "image/jpeg"].includes(file.type)) {
      const preview = URL.createObjectURL(file);
      setImage(preview);
    } else {
      alert("Only PNG and JPG files are allowed");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <img
          src={getProfileImage()}
          alt={staffName || "Profile"}
          className="w-33 h-33 rounded-full object-cover mb-3 border-2 border-black-500"
        />
        <label className="absolute bottom-3 right-0 bg-blue-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-blue-700">
          <Pencil size={14} />
          <input
            type="file"
            accept=".png, .jpg, .jpeg"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
      </div>
      <h2 className="text-lg font-semibold text-slate-800">
        {staffName}
      </h2>
    </div>
  );
};

export default ProfileImage;