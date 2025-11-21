import { useEffect, useState } from 'react';
import api from '../utils/api';
import { FaClipboardList, FaCheckCircle, FaExclamationCircle, FaUserTie, FaTools, FaChartBar, FaCog, FaUsers } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });
  const [distribution, setDistribution] = useState({ month: '', report: [] });
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const compStatsRes = await api.get('/admin/analytics/complaints');
      setStats(compStatsRes.data);

      const distRes = await api.get('/admin/analytics/users-served');
      setDistribution(distRes.data);

      const allCompRes = await api.get('/complaint/all');
      setComplaints(allCompRes.data);
    } catch (err) {
      console.error("Admin load error", err);
    } finally {
      setLoading(false);
    }
  };

  const resolveComplaint = async (id) => {
    try {
      await api.put(`/complaint/update/${id}`, { status: 'resolved' });
      toast.success("Complaint Marked Resolved");
      loadData();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6 animate-fade-in">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-gray-800 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <FaChartBar className="text-white text-2xl" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-800 mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Admin Analytics Dashboard
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">Monitor and manage system performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-2xl shadow-lg border border-red-100 group hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 font-bold uppercase text-xs tracking-wider mb-2">Pending Issues</p>
              <p className="text-3xl font-black text-gray-800">{stats.pending}</p>
              <p className="text-xs text-gray-500 mt-1">Requires attention</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <FaExclamationCircle className="text-red-500 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl shadow-lg border border-green-100 group hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 font-bold uppercase text-xs tracking-wider mb-2">Resolved</p>
              <p className="text-3xl font-black text-gray-800">{stats.resolved}</p>
              <p className="text-xs text-gray-500 mt-1">Completed cases</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <FaCheckCircle className="text-green-500 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl shadow-lg border border-blue-100 group hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-bold uppercase text-xs tracking-wider mb-2">Total Complaints</p>
              <p className="text-3xl font-black text-gray-800">{stats.total}</p>
              <p className="text-xs text-gray-500 mt-1">All time records</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <FaClipboardList className="text-blue-500 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Dealer Distribution Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
            <h2 className="font-bold text-gray-800 text-xl flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FaUserTie className="text-indigo-600 text-lg" />
              </div>
              Dealer Distribution Report
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">
                {distribution.month}
              </span>
              <span className="text-xs text-gray-500">
                {distribution.report.length} dealers
              </span>
            </div>
          </div>

          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-gray-50 to-indigo-50 text-gray-700 sticky top-0">
                <tr>
                  <th className="p-4 font-bold text-sm">Dealer Name</th>
                  <th className="p-4 font-bold text-sm">Status</th>
                  <th className="p-4 font-bold text-sm">Rice (Kg)</th>
                  <th className="p-4 font-bold text-sm">Wheat (Kg)</th>
                  <th className="p-4 font-bold text-sm">Sugar (Kg)</th>
                  <th className="p-4 font-bold text-sm">Oil (L)</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {distribution.report.map((row) => (
                  <tr key={row.dealerId} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-semibold text-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <FaUsers className="text-indigo-600 text-sm" />
                        </div>
                        {row.dealerName}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span
                        className={`px-3 py-2 rounded-lg text-xs font-bold ${
                          row.status === "Active"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>

                    <td className="p-4 font-medium text-gray-700">{row.distributedRiceKg}</td>
                    <td className="p-4 font-medium text-gray-700">{row.distributedWheatKg}</td>
                    <td className="p-4 font-medium text-gray-700">{row.distributedSugarKg}</td>
                    <td className="p-4 font-medium text-gray-700">{row.distributedOilL}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-orange-50">
            <h2 className="font-bold text-gray-800 text-xl flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <FaTools className="text-orange-600 text-lg" />
              </div>
              Manage Complaints
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">
                {complaints.filter(c => c.status === 'pending').length} pending
              </span>
              <span className="text-xs text-gray-500">
                Needs immediate attention
              </span>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto p-4">
            {complaints.filter(c => c.status === 'pending').length === 0 ? (
              <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-dashed border-gray-300">
                <FaCheckCircle className="text-green-400 text-4xl mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">No pending complaints!</p>
                <p className="text-gray-400 text-sm mt-1">All issues are resolved</p>
              </div>
            ) : (
              complaints.filter(c => c.status === 'pending').map((c) => (
                <div
                  key={c._id}
                  className="p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 mb-4 last:mb-0 hover:border-orange-300 transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <FaExclamationCircle className="text-red-500 text-sm" />
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg">{c.title}</h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 leading-relaxed">{c.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaUserTie className="text-gray-400" />
                          {c.userId?.name}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <FaClipboardList className="text-gray-400" />
                          {c.userId?.mobile}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => resolveComplaint(c._id)}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm px-4 py-2 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 font-semibold flex items-center gap-2 whitespace-nowrap"
                    >
                      <FaCheckCircle className="text-sm" />
                      Resolve
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;