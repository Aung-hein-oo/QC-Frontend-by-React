import { useState } from "react";
import { Lock, Eye, EyeOff, KeyRound, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAttendance } from '../hooks/useAttendance';
import { config } from '../utils/config';
import bcrypt from "bcryptjs";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { staff } = useAttendance(); // Get current logged-in staff info
  
  const [loading, setLoading] = useState(false);
  const [oldPasswordError, setOldPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState({ old: false, new: false, confirm: false });
  
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const toggleShow = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Reset the "Incorrect Password" error when user starts typing again
    if (name === "old_password") {
      setOldPasswordError(false);
    }
  };

  const passwordsMatch = formData.new_password && formData.confirm_password && 
    formData.new_password === formData.confirm_password;
  
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
const isNewPasswordValid = passwordRegex.test(formData.new_password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staff) return;

    // 1. Decrypt/Compare Old Password on Frontend
    // We assume 'staff_password' in the staff object is the encrypted hash from DB
    const hashedDbPassword = (staff as any).staff_password;

    if (!hashedDbPassword) {
      console.error("Password hash not found in staff record.");
      return;
    }

    const isMatch = bcrypt.compareSync(formData.old_password, hashedDbPassword);

    if (!isMatch) {
      setOldPasswordError(true);
      return; // Stop here if old password is wrong
    }

    // 2. Proceed with Update if Match found
    setLoading(true);

    try {
      const updatePayload = {
        staff_name: staff.staff_name,
        staff_position: staff.staff_position,
        staff_permanent_status: staff.staff_permanent_status,
        gender: staff.gender,
        floor: staff.floor,
        staff_mail: staff.staff_mail,
        staff_password: formData.new_password, // Send new plain text (Backend hashes this)
        team_id: staff.team_id,
        department_id: staff.department_id,
        division_id: staff.division_id
      };

      const res = await fetch(`${config.apiUrl}/staff/${staff.id || (staff as any).staff_id}`, {
        method: "PUT", // Standard for updates
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatePayload),
      });

      if (res.ok) {
        alert("Password updated successfully!");
        navigate("/profile");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to update record on server.");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
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
                className={`w-full border rounded-lg pl-9 pr-9 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                    oldPasswordError ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => toggleShow("old")}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword.old ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {oldPasswordError && (
              <p className="text-xs mt-1 text-red-500 flex items-center gap-1 animate-pulse">
                <X size={12} /> Failed to update password. Please check your old password.
              </p>
            )}
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
                  formData.new_password && !isNewPasswordValid ? "border-red-500" : "border-gray-300"
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
                <X size={12} /> At least 8 characters, with letters, numbers, and symbols.
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
                  formData.confirm_password && passwordsMatch ? "border-green-500" : "border-gray-300"
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
              disabled={loading || !passwordsMatch || !isNewPasswordValid || !formData.old_password}
              className={`w-full py-2 rounded-lg font-medium transition-all ${
                !loading && passwordsMatch && isNewPasswordValid && formData.old_password
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-95"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
            <button 
              type="button" 
              onClick={() => navigate(-1)} 
              className="w-full border border-gray-300 hover:bg-gray-100 py-2 rounded-lg font-medium transition text-gray-600"
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