import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaPhone, FaIdCard, FaUsers, FaHome, FaCity, FaMapMarkerAlt, FaKey } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    rationCardNumber: '',
    familyMembers: 1,
    addressLine1: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Construct the address object as expected by backend Schema [cite: 135]
      const payload = {
        name: formData.name,
        mobile: formData.mobile,
        rationCardNumber: formData.rationCardNumber,
        familyMembers: formData.familyMembers,
        address: {
          line1: formData.addressLine1,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        }
      };

      const res = await api.post('/auth/register', payload); // 
      
      // Automatically log the user in after registration
      login(res.data.token, res.data.user);
      toast.success("Registration Successful!");
      navigate('/user/dashboard');
      
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Registration Failed (User may already exist)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
            <FaKey className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            New User Registration
          </h2>
          <p className="text-gray-500 text-sm">Create your RationX account in simple steps</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaUser className="text-primary mr-2" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    name="name" 
                    required 
                    onChange={handleChange}
                    className="w-full border border-gray-200 p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 bg-white"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Mobile Number</label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    name="mobile" 
                    required 
                    onChange={handleChange}
                    className="w-full border border-gray-200 p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 bg-white"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Ration Details Section */}
          <div className="bg-green-50 p-4 rounded-xl border border-green-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaIdCard className="text-secondary mr-2" />
              Ration Card Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Ration Card Number</label>
                <div className="relative">
                  <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    name="rationCardNumber" 
                    required 
                    onChange={handleChange}
                    className="w-full border border-gray-200 p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-300 bg-white"
                    placeholder="e.g. RC-12345678"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Family Members</label>
                <div className="relative">
                  <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="number" 
                    name="familyMembers" 
                    min="1" 
                    required 
                    onChange={handleChange}
                    className="w-full border border-gray-200 p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-300 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaHome className="text-purple-600 mr-2" />
              Address Details
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Street Address</label>
                <div className="relative">
                  <FaHome className="absolute left-3 top-4 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    name="addressLine1" 
                    placeholder="House No / Street / Area" 
                    onChange={handleChange}
                    className="w-full border border-gray-200 p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">City</label>
                  <div className="relative">
                    <FaCity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                      name="city" 
                      placeholder="City" 
                      onChange={handleChange}
                      className="w-full border border-gray-200 p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">State</label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                      name="state" 
                      placeholder="State" 
                      onChange={handleChange}
                      className="w-full border border-gray-200 p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Pincode</label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                      name="pincode" 
                      placeholder="Pincode" 
                      onChange={handleChange}
                      className="w-full border border-gray-200 p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white"
                      maxLength={6}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Account...</span>
              </div>
            ) : (
              "Register & Login"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="text-primary font-semibold hover:text-secondary transition-colors duration-300 underline hover:no-underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;