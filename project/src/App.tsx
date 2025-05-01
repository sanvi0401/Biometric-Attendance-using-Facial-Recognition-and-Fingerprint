import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import AdminLayout from './components/layouts/AdminLayout';
import EmployeeManagement from './pages/admin/EmployeeManagement';
import AttendanceReports from './pages/admin/AttendanceReports';
import Settings from './pages/admin/Settings';
import UserProfile from './pages/UserProfile';
import EmployeeLayout from './components/layouts/EmployeeLayout';
import CheckIn from './pages/employee/CheckIn';
import AttendanceHistory from './pages/employee/AttendanceHistory';

// Protected route component
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Admin routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="employees" element={<EmployeeManagement />} />
        <Route path="reports" element={<AttendanceReports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>
      
      {/* Employee routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="check-in" element={<CheckIn />} />
        <Route path="history" element={<AttendanceHistory />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;