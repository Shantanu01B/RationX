import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { FaUserShield, FaSearch, FaBan, FaCheckCircle, FaUsers, FaCog, FaUser, FaStore } from 'react-icons/fa';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/all-users');
      setUsers(res.data.users || []);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async (mobile, name) => {
    if (!window.confirm(`Promote ${name} (${mobile}) to Admin?`)) return;
    try {
      await api.post('/admin/promote-admin', { mobile });
      toast.success("User Promoted to Admin!");
      fetchUsers();
    } catch (err) {
      toast.error("Promotion failed");
    }
  };

  const handleToggleStatus = async (userId, currentStatus, userName) => {
    const action = currentStatus ? "Deactivate" : "Activate";
    if (!window.confirm(`Are you sure you want to ${action} ${userName}?`)) return;

    try {
      await api.post('/admin/toggle-status', { userId });
      toast.success(`User ${action}d Successfully`);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  // Search Filter
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.mobile.includes(searchTerm) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Count users by role
  const userCounts = {
    total: users.length,
    active: users.filter(u => u.isActive !== false).length,
    inactive: users.filter(u => u.isActive === false).length,
    admins: users.filter(u => u.role === 'admin').length,
    dealers: users.filter(u => u.role === 'dealer').length,
    users: users.filter(u => u.role === 'user').length
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <FaUserShield className="text-purple-500" />;
      case 'dealer': return <FaStore className="text-green-500" />;
      default: return <FaUser className="text-blue-500" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'from-purple-500 to-pink-500';
      case 'dealer': return 'from-green-500 to-emerald-500';
      default: return 'from-blue-500 to-cyan-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6 animate-fade-in">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <FaUsers className="text-white text-2xl" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-800 mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          User Management
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">Manage all system users and permissions</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 text-center">
          <div className="text-2xl font-black text-gray-800">{userCounts.total}</div>
          <div className="text-xs text-gray-500 font-medium">Total Users</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-green-100 text-center">
          <div className="text-2xl font-black text-green-600">{userCounts.active}</div>
          <div className="text-xs text-green-600 font-medium">Active</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-red-100 text-center">
          <div className="text-2xl font-black text-red-600">{userCounts.inactive}</div>
          <div className="text-xs text-red-600 font-medium">Inactive</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-purple-100 text-center">
          <div className="text-2xl font-black text-purple-600">{userCounts.admins}</div>
          <div className="text-xs text-purple-600 font-medium">Admins</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-green-100 text-center">
          <div className="text-2xl font-black text-green-600">{userCounts.dealers}</div>
          <div className="text-xs text-green-600 font-medium">Dealers</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-blue-100 text-center">
          <div className="text-2xl font-black text-blue-600">{userCounts.users}</div>
          <div className="text-xs text-blue-600 font-medium">Users</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 mb-6 group hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-blue-100 rounded-xl flex items-center justify-center">
            <FaSearch className="text-gray-400 text-lg" />
          </div>
          <input 
            type="text" 
            placeholder="Search by name, mobile, or role..." 
            className="w-full outline-none text-gray-700 placeholder-gray-400 text-lg font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-indigo-50">
          <h2 className="font-bold text-gray-800 text-xl flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <FaCog className="text-indigo-600 text-lg" />
            </div>
            All System Users
            <span className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">
              {filteredUsers.length} users
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50 text-gray-700 sticky top-0">
                <tr>
                  <th className="p-4 font-bold text-sm">User Details</th>
                  <th className="p-4 font-bold text-sm">Role</th>
                  <th className="p-4 font-bold text-sm">Status</th>
                  <th className="p-4 font-bold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className={`hover:bg-gray-50 transition-colors ${u.isActive === false ? 'bg-red-50 hover:bg-red-100' : ''}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-blue-100 rounded-xl flex items-center justify-center">
                          {getRoleIcon(u.role)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-lg">{u.name}</p>
                          <p className="text-sm text-gray-500">{u.mobile}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold bg-gradient-to-r ${getRoleColor(u.role)} text-white`}>
                        {getRoleIcon(u.role)}
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    
                    <td className="p-4">
                      {u.isActive === false ? (
                        <span className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-bold border border-red-200">
                          <FaBan className="text-red-500" /> Inactive
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-bold border border-green-200">
                          <FaCheckCircle className="text-green-500" /> Active
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleToggleStatus(u._id, u.isActive !== false, u.name)}
                          className={`px-4 py-2 rounded-lg text-sm font-bold text-white transition-all duration-300 hover:shadow-lg ${
                            u.isActive === false 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' 
                              : 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'
                          }`}
                        >
                          {u.isActive === false ? "Activate" : "Deactivate"}
                        </button>

                        {u.role === 'user' && (
                          <button 
                            onClick={() => handlePromote(u.mobile, u.name)}
                            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-pink-600"
                          >
                            <FaUserShield className="text-sm" />
                            Promote
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredUsers.length === 0 && (
          <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50">
            <FaSearch className="text-gray-400 text-4xl mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No users found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;