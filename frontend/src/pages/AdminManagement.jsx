import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { FaUserTie, FaBoxOpen, FaList, FaStore, FaPlus, FaUsers, FaWarehouse } from 'react-icons/fa';

const AdminManagement = () => {
  const [activeTab, setActiveTab] = useState('dealer'); // dealer | stock | list
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dealer Form
  const [dName, setDName] = useState('');
  const [dMobile, setDMobile] = useState('');
  const [dShop, setDShop] = useState('');

  // Stock Form
  const [sDealerId, setSDealerId] = useState('');
  const [stockData, setStockData] = useState({
    riceKg: 0,
    wheatKg: 0,
    sugarKg: 0,
    oilL: 0,
  });

  useEffect(() => {
    fetchDealers();
  }, []);

  const fetchDealers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/all-dealers');
      setDealers(res.data.dealers || []);
    } catch {
      console.log("Failed to load dealers");
    } finally {
      setLoading(false);
    }
  };

  // Create Dealer
  const handleCreateDealer = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/create-dealer', {
        name: dName,
        mobile: dMobile,
        shopNumber: dShop,
        address: "Local Shop"
      });

      toast.success("Dealer Created Successfully");
      setDName(''); 
      setDMobile(''); 
      setDShop('');
      fetchDealers();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error creating dealer");
    }
  };

  // Add Stock
  const handleAddStock = async (e) => {
    e.preventDefault();
    try {
      await api.post('/dealer-stock/add-stock', {
        dealerId: sDealerId,
        stock: stockData
      });

      toast.success("Stock Added Successfully");
      setStockData({ riceKg: 0, wheatKg: 0, sugarKg: 0, oilL: 0 });
      setSDealerId('');
    } catch (err) {
      toast.error(err.response?.data?.msg || "Stock already added this month?");
    }
  };

  const tabs = [
    { id: 'dealer', label: 'Create Dealer', icon: FaUserTie },
    { id: 'stock', label: 'Add Stock', icon: FaBoxOpen },
    { id: 'list', label: 'View Dealers', icon: FaList }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6 animate-fade-in">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <FaWarehouse className="text-white text-2xl" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-800 mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Admin Management
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">Manage dealers and stock allocation</p>
      </div>

      {/* Enhanced Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2 mb-8 max-w-4xl mx-auto">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl font-bold transition-all duration-300 flex-1 min-w-[200px] justify-center ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className={`text-lg ${activeTab === tab.id ? 'text-white' : 'text-gray-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Box */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 max-w-4xl mx-auto group hover:shadow-2xl transition-all duration-300">
        
        {/* Create Dealer Form */}
        {activeTab === 'dealer' && (
          <form onSubmit={handleCreateDealer} className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <FaUserTie className="text-indigo-600 text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-800">Register New Dealer</h2>
                <p className="text-gray-600 text-sm">Add a new dealer to the system</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Dealer Name</label>
                <input
                  type="text"
                  placeholder="Enter dealer full name"
                  required
                  className="w-full border border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-gray-50"
                  value={dName}
                  onChange={(e) => setDName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Mobile Number</label>
                <input
                  type="text"
                  placeholder="Enter 10-digit mobile"
                  required
                  className="w-full border border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-gray-50"
                  value={dMobile}
                  onChange={(e) => setDMobile(e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-bold text-gray-700">Shop Number / License</label>
                <input
                  type="text"
                  placeholder="Enter shop number or license ID"
                  required
                  className="w-full border border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-gray-50"
                  value={dShop}
                  onChange={(e) => setDShop(e.target.value)}
                />
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3">
              <FaPlus className="text-lg" />
              Create Dealer Account
            </button>
          </form>
        )}

        {/* Add Stock Form */}
        {activeTab === 'stock' && (
          <form onSubmit={handleAddStock} className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FaBoxOpen className="text-green-600 text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-800">Add Monthly Stock</h2>
                <p className="text-gray-600 text-sm">Allocate stock to dealers for distribution</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Select Dealer</label>
                <select
                  className="w-full border border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 text-gray-700 font-medium"
                  required
                  value={sDealerId}
                  onChange={(e) => setSDealerId(e.target.value)}
                >
                  <option value="">-- Select Dealer --</option>
                  {dealers.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name} ({d.mobile}) - {d.shopNumber || 'No Shop'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 text-center">Rice (Kg)</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 text-center font-bold text-lg"
                    value={stockData.riceKg}
                    onChange={(e) => setStockData({ ...stockData, riceKg: +e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 text-center">Wheat (Kg)</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 text-center font-bold text-lg"
                    value={stockData.wheatKg}
                    onChange={(e) => setStockData({ ...stockData, wheatKg: +e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 text-center">Sugar (Kg)</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 text-center font-bold text-lg"
                    value={stockData.sugarKg}
                    onChange={(e) => setStockData({ ...stockData, sugarKg: +e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 text-center">Oil (L)</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 text-center font-bold text-lg"
                    value={stockData.oilL}
                    onChange={(e) => setStockData({ ...stockData, oilL: +e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3">
              <FaBoxOpen className="text-lg" />
              Add Stock Allocation
            </button>
          </form>
        )}

        {/* Dealer List Table */}
        {activeTab === 'list' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-800">Registered Dealers</h2>
                <p className="text-gray-600 text-sm">{dealers.length} dealers in system</p>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500 font-medium">Loading dealers...</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left">
                  <thead className="bg-gradient-to-r from-gray-50 to-blue-50 text-gray-700">
                    <tr>
                      <th className="p-4 font-bold text-sm">Dealer Details</th>
                      <th className="p-4 font-bold text-sm">Shop Number</th>
                      <th className="p-4 font-bold text-sm">Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {dealers.length === 0 ? (
                      <tr>
                        <td className="p-8 text-center text-gray-500" colSpan="3">
                          <FaStore className="text-4xl text-gray-300 mx-auto mb-3" />
                          <p className="text-lg font-medium text-gray-400">No dealers registered yet</p>
                          <p className="text-sm text-gray-400 mt-1">Create your first dealer using the "Create Dealer" tab</p>
                        </td>
                      </tr>
                    ) : (
                      dealers.map((d) => (
                        <tr key={d._id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                <FaUserTie className="text-indigo-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800 text-lg">{d.name}</p>
                                <p className="text-sm text-gray-500">Dealer Account</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-bold">
                              {d.shopNumber || 'Not Set'}
                            </span>
                          </td>
                          <td className="p-4">
                            <p className="font-medium text-gray-800">{d.mobile}</p>
                            <p className="text-xs text-gray-500">Mobile</p>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManagement;