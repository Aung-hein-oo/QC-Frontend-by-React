import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/LoginPage';
import AttendanceHomepage from './pages/AttendanceHomepage';
import UserProfile from './pages/UserProfile';
import LeaveRequest from './pages/LeaveRequest';
import AdminDashboard from './pages/AdminDashboard';
import { NotificationProvider, useNotification } from './components/common/Notification';
import ChangePassword from './pages/ChangePassword';
import LeaveApprove from './pages/LeaveApprove';

// Token expiration time (24 hours in milliseconds)
const TOKEN_EXPIRY_DURATION = 24 * 60 * 60 * 1000;

// Helper function to check if token is expired
const isTokenExpired = (): boolean => {
  const tokenExpiry = localStorage.getItem('tokenExpiry');
  if (!tokenExpiry) return true;
  
  const currentTime = Date.now();
  return currentTime > parseInt(tokenExpiry, 10);
};

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
  localStorage.removeItem('attendance');
};

// Protected Route Component with role checking using localStorage
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode;
  requiredPosition?: string | string[];
}> = ({ children, requiredPosition }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const { showNotification } = useNotification();
  
  // Check if token is expired
  if (token && isTokenExpired()) {
    clearSession();
    showNotification('Your session has expired. Please login again.', 'warning');
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  // Get user from localStorage
  let user = null;
  try {
    const storedStaff = localStorage.getItem('staff');
    if (storedStaff) {
      user = JSON.parse(storedStaff);
    }
  } catch (error) {
    console.error('Error parsing staff data:', error);
  }
  
  if (!token) {
    showNotification('Please login to access this page.', 'warning');
    // Save the attempted URL for redirecting after login
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  // Check if route requires specific position
  if (requiredPosition) {
    const positions = Array.isArray(requiredPosition) ? requiredPosition : [requiredPosition];
    const hasRequiredPosition = positions.includes(user?.staff_position);
    
    if (!hasRequiredPosition) {
      showNotification(
        `Access Denied: ${user?.staff_position || 'User'} do not have permission to access this page.`,
        'error'
      );
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  return <>{children}</>;
};

// Public Route Component - Redirects to dashboard if already logged in
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';
  
  // Check if token is expired before redirecting
  if (token && !isTokenExpired()) {
    // Redirect to the page they were trying to access, or dashboard
    return <Navigate to={from} replace />;
  } else if (token && isTokenExpired()) {
    // Clear expired session
    clearSession();
  }
  
  return <>{children}</>;
};

// Token expiration checker component
const TokenExpiryChecker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showNotification } = useNotification();
  const location = useLocation();
  
  React.useEffect(() => {
    // Check token expiry every minute
    const interval = setInterval(() => {
      if (localStorage.getItem('token') && isTokenExpired()) {
        clearSession();
        showNotification('Your session has expired. Please login again.', 'warning');
        // Redirect to login page
        window.location.href = '/';
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [showNotification]);
  
  return <>{children}</>;
};

function AppContent() {
  return (
    <BrowserRouter>
      <TokenExpiryChecker>
        <Routes>
          {/* Login Route - Redirects to dashboard if already logged in */}
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          
          {/* Dashboard Route (Protected) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AttendanceHomepage />
              </ProtectedRoute>
            }
          />
          
          <Route 
            path="/user_profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }  
          />
          
          <Route
            path="/leave"
            element={
              <ProtectedRoute>
                <LeaveRequest />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/change_password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/leave_approve"
            element={
              <ProtectedRoute>
                <LeaveApprove />
              </ProtectedRoute>
            }
          />
          
          {/* Admin Route - Only accessible by Admin users */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredPosition="Admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Redirect any unknown routes to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </TokenExpiryChecker>
    </BrowserRouter>
  );
}

function App() {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
}

export default App;