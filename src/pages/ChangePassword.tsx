import { useState } from "react";
import { Lock, Eye, EyeOff, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (formData.new_password !== formData.confirm_password) {
      alert("Password not match");
      return;
    }

    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border p-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <KeyRound className="text-blue-600" size={22} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Change Password
            </h2>
            <p className="text-xs text-gray-500">
              Update your account password
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Old Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Old Password
            </label>

            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                type={showOld ? "text" : "password"}
                name="old_password"
                value={formData.old_password}
                onChange={handleChange}
                required
                className="w-full border rounded-lg pl-9 pr-9 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <span
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              >
                {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>

            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                type={showNew ? "text" : "password"}
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                required
                className="w-full border rounded-lg pl-9 pr-9 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <span
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>

            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                type={showConfirm ? "text" : "password"}
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
                className="w-full border rounded-lg pl-9 pr-9 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <span
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-3">

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
            >
              Update Password
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full border border-gray-300 hover:bg-gray-50 py-2 rounded-lg font-medium transition"
            >
              Cancel
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default ChangePassword;