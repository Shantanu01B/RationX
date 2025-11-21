import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FaUserShield, FaLock, FaUser } from 'react-icons/fa';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Matches backend 
      const res = await api.post('/admin/auth/login', { username, password });
      
      // Note: Backend returns { token, admin: { id, username } }
      // We normalize this to match our app's user structure
      const adminUser = {
        ...res.data.admin,
        role: 'admin',
        name: res.data.admin.username // Map username to name for Navbar display
      };

      login(res.data.token, adminUser);
      toast.success("Admin Access Granted");
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Invalid Admin Credentials");
    } finally {
      setLoading(false);
    }
  };

  // Quick fill demo credentials
  const fillDemoCredentials = () => {
    setUsername('admin');
    setPassword('admin123');
    toast.info('Demo credentials filled!', { autoClose: 2000 });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 py-4">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="relative inline-block mb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center mx-auto shadow-lg">
              <FaUserShield className="text-2xl text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1">
            Admin Portal
          </h2>
          <p className="text-gray-500 text-xs font-medium">Authorized Personnel Only</p>
          <div className="w-16 h-0.5 bg-gradient-to-r from-gray-900 to-gray-700 rounded-full mx-auto mt-2"></div>
        </div>

        {/* Demo Credentials with Quick Fill Button */}
        <div className="mb-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-gray-700 text-xs">Demo Admin Credentials</p>
            <button
              onClick={fillDemoCredentials}
              className="bg-gray-800 hover:bg-gray-900 text-white text-xs py-1 px-3 rounded-md transition-all duration-200 font-medium border border-gray-700 hover:shadow-sm"
            >
              Quick Fill
            </button>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Username:</span>
              <span className="font-medium">admin</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Password:</span>
              <span className="font-medium">admin123</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400 text-sm" />
              </div>
              <input 
                type="text" 
                className="w-full border border-gray-200 p-3 pl-9 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300 bg-gray-50 placeholder-gray-400 text-sm"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400 text-sm" />
              </div>
              <input 
                type="password" 
                className="w-full border border-gray-200 p-3 pl-9 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-300 bg-gray-50 placeholder-gray-400 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-gray-900 to-gray-700 text-white p-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center space-x-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Authenticating...</span>
                </>
              ) : (
                <>
                  <FaUserShield className="text-sm" />
                  <span className="text-sm">Secure Login</span>
                </>
              )}
            </div>
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-4 p-2 bg-red-50 border border-red-100 rounded-lg text-center">
          <p className="text-xs text-red-600 font-medium">
            ⚠️ Restricted Access - Unauthorized attempts are prohibited
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;