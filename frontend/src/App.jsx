import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import UserDashboard from './pages/UserDashboard';
import DealerDashboard from './pages/DealerDashboard';
import AdminDashboard from './pages/AdminDashboard';

import ComplaintPage from './pages/ComplaintPage';
import SlotBooking from './pages/SlotBooking';
import AdminManagement from './pages/AdminManagement';
import AdminNotifications from './pages/AdminNotifications';
import AdminUsers from './pages/AdminUsers';
import AdminLogin from './pages/AdminLogin';
import About from './pages/About'; // Import
import Contact from './pages/Contact'; // Import

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">

        {/* Navbar on all pages */}
        <Navbar />

        <div className="pt-4">
          <Routes>

            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Home />} />           {/* ⬅ Added */}
            <Route path="/register" element={<Register />} /> {/* ⬅ Added */}
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/about" element={<About />} /> {/* NEW Route */}
            <Route path="/contact" element={<Contact />} /> {/* NEW Route */}

            {/* USER ROUTES */}
            <Route
              path="/user/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route 
  path="/admin/users" 
  element={
    <ProtectedRoute role="admin">
      <AdminUsers />
    </ProtectedRoute>
  } 
/>
            <Route
              path="/user/complaints"
              element={
                <ProtectedRoute>
                  <ComplaintPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/user/book-slot"
              element={
                <ProtectedRoute>
                  <SlotBooking />
                </ProtectedRoute>
              }
            />

            {/* DEALER ROUTES */}
            <Route
              path="/dealer/dashboard"
              element={
                <ProtectedRoute>
                  <DealerDashboard />
                </ProtectedRoute>
              }
            />

            {/* ADMIN ROUTES */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/management"
              element={
                <ProtectedRoute>
                  <AdminManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/notifications"
              element={
                <ProtectedRoute>
                  <AdminNotifications />
                </ProtectedRoute>
              }
            />

          </Routes>
        </div>

        <ToastContainer position="top-right" autoClose={3000} />

      </div>
    </Router>
  );
}

export default App;
