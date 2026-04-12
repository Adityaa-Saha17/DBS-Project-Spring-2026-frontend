import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Auth
import Login from './pages/auth/Login';
import Settings from './pages/auth/Settings';

// Student
import BookList from './pages/student/BookList';
import BookDetail from './pages/student/BookDetail';
import Cart from './pages/student/Cart';
import MyOrders from './pages/student/MyOrders';
import Tickets from './pages/student/Tickets';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';

// Support & SuperAdmin
import SupportDashboard from './pages/support/SupportDashboard';
import StaffManagement from './pages/superadmin/StaffManagement';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Student Routes */}
          <Route path="/catalog" element={<ProtectedRoute allowedRoles={['student']}><BookList /></ProtectedRoute>} />
          <Route path="/book/:id" element={<ProtectedRoute allowedRoles={['student']}><BookDetail /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute allowedRoles={['student']}><Cart /></ProtectedRoute>} />
          <Route path="/my-orders" element={<ProtectedRoute allowedRoles={['student']}><MyOrders /></ProtectedRoute>} />
          <Route path="/tickets" element={<ProtectedRoute allowedRoles={['student']}><Tickets /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>} />

          {/* Support & SuperAdmin Routes */}
          <Route path="/support" element={<ProtectedRoute allowedRoles={['support']}><SupportDashboard /></ProtectedRoute>} />
          <Route path="/superadmin" element={<ProtectedRoute allowedRoles={['superadmin']}><StaffManagement /></ProtectedRoute>} />
          
          {/* Shared Routes */}
          <Route path="/settings" element={<ProtectedRoute allowedRoles={['student', 'admin', 'support', 'superadmin']}><Settings /></ProtectedRoute>} />
          <Route path="/unauthorized" element={<div className="p-20 text-center text-2xl font-bold">Access Denied. You do not have permission.</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;