import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/LoginPage';
import AttendanceHomepage from './pages/AttendanceHomepage';
import UserProfile from './pages/UserProfile';
import LeaveRequest from './pages/LeaveRequest';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<Login />} />
        
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
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Redirect any unknown routes to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;