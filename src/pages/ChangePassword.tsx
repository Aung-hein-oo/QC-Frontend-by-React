import { useState } from "react";
import { Lock, Eye, EyeOff, KeyRound, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const toggleShow = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const passwordsMatch = formData.new_password && formData.confirm_password && 
    formData.new_password === formData.confirm_password;
  
  const isNewPasswordValid = formData.new_password.length >= 6;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) {
      alert("Passwords do not match");
      return;
    }
    if (!isNewPasswordValid) {
      alert("Password must be at least 6 characters");
      return;
    }
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border p-6">
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <KeyRound className="text-blue-600" size={22} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Change Password</h2>
            <p className="text-xs text-gray-500">Update your account password</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Old Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Old Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPassword.old ? "text" : "password"}
                name="old_password"
                value={formData.old_password}
                onChange={handleChange}
                required
                className="w-full border rounded-lg pl-9 pr-9 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="button"
                onClick={() => toggleShow("old")}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showPassword.old ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPassword.new ? "text" : "password"}
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                required
                className={`w-full border rounded-lg pl-9 pr-9 py-2 focus:ring-2 focus:ring-blue-500 outline-none ${
                  formData.new_password && !isNewPasswordValid ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => toggleShow("new")}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formData.new_password && !isNewPasswordValid && (
              <p className="text-xs mt-1 text-red-500 flex items-center gap-1">
                <X size={12} /> Password must be at least 6 characters
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPassword.confirm ? "text" : "password"}
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
                className={`w-full border rounded-lg pl-9 pr-9 py-2 focus:ring-2 focus:ring-blue-500 outline-none ${
                  formData.confirm_password && !passwordsMatch ? "border-red-500" : 
                  formData.confirm_password && passwordsMatch ? "border-green-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => toggleShow("confirm")}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formData.confirm_password && (
              <p className={`text-xs mt-1 flex items-center gap-1 ${
                passwordsMatch ? "text-green-600" : "text-red-500"
              }`}>
                {passwordsMatch ? (
                  <><Check size={12} /> Passwords match</>
                ) : (
                  <><X size={12} /> Passwords do not match</>
                )}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-3">
            <button 
              type="submit" 
              disabled={!passwordsMatch || !isNewPasswordValid || !formData.old_password}
              className={`w-full py-2 rounded-lg font-medium transition ${
                passwordsMatch && isNewPasswordValid && formData.old_password
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Update Password
            </button>
            <button 
              type="button" 
              onClick={() => navigate(-1)} 
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