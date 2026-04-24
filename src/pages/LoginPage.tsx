import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Lock, Eye, EyeOff } from 'lucide-react';
import { config } from '../utils/config';

// Token expiration time (24 hours in milliseconds)
const TOKEN_EXPIRY_DURATION = 24 * 60 * 60 * 1000;

// Helper function to set token with expiry
const setTokenWithExpiry = (token: string): void => {
  const expiryTime = Date.now() + TOKEN_EXPIRY_DURATION;
  localStorage.setItem('token', token);
  localStorage.setItem('tokenExpiry', expiryTime.toString());
};

// Helper function to clear all session data
const clearSession = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExpiry');
  localStorage.removeItem('staff');
  localStorage.removeItem('staff_id');
  localStorage.removeItem('attendance');
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Clear any existing session before login
  React.useEffect(() => {
    clearSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${config.apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          staff_id: staffId, 
          password: password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Set token with 24-hour expiry
        setTokenWithExpiry(data.access_token);
        localStorage.setItem('staff_id', staffId);
        
        // If your API returns user/staff data, store it as well
        if (data.staff) {
          localStorage.setItem('staff', JSON.stringify(data.staff));
        } else {
          // If user data is not returned, you might need to fetch it separately
          try {
            const userResponse = await fetch(`${config.apiUrl}/staff/${staffId}`, {
              headers: {
                'Authorization': `Bearer ${data.access_token}`
              }
            });
            if (userResponse.ok) {
              const userData = await userResponse.json();
              localStorage.setItem('staff', JSON.stringify(userData));
            }
          } catch (err) {
            console.error('Error fetching user data:', err);
          }
        }
        
        navigate('/dashboard');
      } else {
        setError(data.message || data.error || data.detail || 'Invalid Staff ID or password');
      }
    } catch (err: any) {
      setError(`Cannot connect to server at ${config.apiUrl}. Please check if server is running.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-white p-3 rounded-2xl shadow-lg mb-4 border border-gray-300">
            <Calendar className="w-12 h-12 text-blue-200" />
          </div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">AMS</h1>
          <p className="text-blue-600 text-sm">Attendance Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Welcome!!!
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Staff ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Staff ID
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-800"
                    placeholder="Enter your Staff ID"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-800"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 text-center">
              <p className="text-xs text-gray-400">
                Secure login • Powered by MODOS
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 Attendance Management System by MODOS. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;