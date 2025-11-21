import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import NotificationList from '../components/NotificationList';
import { FaHistory, FaBox, FaCalendarCheck, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';

const DealerDashboard = () => {
  const { user } = useAuth();
  const [stock, setStock] = useState(null);
  const [scannedUser, setScannedUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [slots, setSlots] = useState([]);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef(null);

  // Fetch stock, history, and slots
  const fetchStock = async () => {
    try {
      const res = await api.get('/dealer-stock/my-stock');
      setStock(res.data.stock);
    } catch (err) {
      console.error("Stock error", err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get('/dealer-stock/history');
      setHistory(res.data || []);
    } catch (err) {
      console.error("History error", err);
    }
  };

  const fetchSlots = async () => {
    if (!user || !user._id) return;
    try {
      const res = await api.get(`/slot/dealer/${user._id}`);
      setSlots(res.data || []);
    } catch (err) {
      console.error("Slots error", err);
    }
  };

  useEffect(() => {
    fetchStock();
    fetchHistory();
    fetchSlots();
  }, []);

  // QR Scan handlers
  const startScanner = () => {
    if (scanning) return;
    setScanning(true);

    const html5QrcodeScanner = new Html5Qrcode("reader");
    scannerRef.current = html5QrcodeScanner;

    html5QrcodeScanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      async (decodedText) => {
        await handleScanVerify(decodedText);
        html5QrcodeScanner.stop();
        setScanning(false);
      },
      (error) => {}
    ).catch(err => {
      toast.error("Failed to start scanner: " + err);
      setScanning(false);
    });
  };

  const handleScanVerify = async (scannedData) => {
    try {
      const res = await api.post('/qr/scan', { scannedData });
      setScannedUser(res.data.user);
      toast.success("User Verified: " + res.data.user.name);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Invalid QR Code");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Html5Qrcode.scanFile(file, true)
      .then(decodedText => handleScanVerify(decodedText))
      .catch(err => toast.error("Failed to scan image QR"));
  };

  const resetScanner = () => {
    setScannedUser(null);
  };

  // Handle distribution
  const handleDistribute = async () => {
    if (!scannedUser) return;
    try {
      const body = {
        userId: scannedUser.id,
        riceKg: scannedUser.remainingQuota.riceKg,
        wheatKg: scannedUser.remainingQuota.wheatKg,
        sugarKg: scannedUser.remainingQuota.sugarKg,
        oilL: scannedUser.remainingQuota.oilL,
      };
      await api.post('/dealer-stock/distribute', body);
      toast.success("Distribution Successful!");
      setScannedUser(null);
      fetchStock();
      fetchHistory();
      fetchSlots();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Distribution Failed");
    }
  };

  const getStatus = (slotDate, userLastMonth) => {
    const slotMonth = slotDate.substring(0, 7);
    return userLastMonth === slotMonth ? 'collected' : 'pending';
  };

  return (
    <div className="container mx-auto p-6 pb-20">
      <NotificationList />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dealer Dashboard</h1>

      {/* Stock Overview */}
      <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 mb-8 shadow-sm">
        <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
          <FaBox /> Shop Stock
        </h2>
        {stock ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded text-center shadow-sm">
              <div className="text-sm text-gray-500">Rice</div>
              <div className="text-xl font-bold">{stock.riceKg} kg</div>
            </div>
            <div className="bg-white p-3 rounded text-center shadow-sm">
              <div className="text-sm text-gray-500">Wheat</div>
              <div className="text-xl font-bold">{stock.wheatKg} kg</div>
            </div>
            <div className="bg-white p-3 rounded text-center shadow-sm">
              <div className="text-sm text-gray-500">Sugar</div>
              <div className="text-xl font-bold">{stock.sugarKg} kg</div>
            </div>
            <div className="bg-white p-3 rounded text-center shadow-sm">
              <div className="text-sm text-gray-500">Oil</div>
              <div className="text-xl font-bold">{stock.oilL} L</div>
            </div>
          </div>
        ) : (
          <p className="text-red-500 italic">No stock assigned for this month.</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Scanner */}
        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <h3 className="font-bold text-lg mb-4">Scan User QR</h3>
          {!scannedUser ? (
            <div className="space-y-4">
              <div id="reader" className="w-full h-64"></div>
              <button
                onClick={startScanner}
                className="w-full bg-primary text-white py-2 rounded-lg font-bold hover:bg-primary-dark"
                disabled={scanning}
              >
                {scanning ? "Scanning..." : "Start Scanner"}
              </button>
              <label className="block mt-2">
                <span className="text-sm font-medium text-gray-700">Or Upload QR Image:</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-1 block w-full text-sm text-gray-500"
                />
              </label>
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded space-y-4">
              <p className="text-green-600 font-bold text-lg">Scan Completed</p>
              <p>{scannedUser.name}</p>
              <button
                onClick={resetScanner}
                className="mt-4 w-full bg-secondary text-white py-2 rounded-lg font-bold hover:bg-emerald-600"
              >
                Scan Another
              </button>
            </div>
          )}
        </div>

        {/* Action Panel */}
        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <h3 className="font-bold text-lg mb-4">Action Panel</h3>
          {scannedUser ? (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-green-50 p-4 rounded border border-green-200">
                <h4 className="font-bold text-green-800 text-lg">{scannedUser.name}</h4>
                <p className="text-sm text-gray-600">Mobile: {scannedUser.mobile}</p>
              </div>
              <div>
                <h5 className="font-semibold text-gray-700 mb-2">Ration to Distribute:</h5>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between border-b pb-1"><span>Rice</span> <b>{scannedUser.remainingQuota.riceKg} kg</b></li>
                  <li className="flex justify-between border-b pb-1"><span>Wheat</span> <b>{scannedUser.remainingQuota.wheatKg} kg</b></li>
                  <li className="flex justify-between border-b pb-1"><span>Sugar</span> <b>{scannedUser.remainingQuota.sugarKg} kg</b></li>
                  <li className="flex justify-between border-b pb-1"><span>Oil</span> <b>{scannedUser.remainingQuota.oilL} L</b></li>
                </ul>
              </div>
              <button
                onClick={handleDistribute}
                className="w-full bg-secondary text-white py-3 rounded-lg font-bold hover:bg-emerald-600 transition shadow-md"
              >
                Confirm & Distribute
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
              <p>Waiting for scan...</p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Schedule */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-100 mb-8">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <FaCalendarCheck /> Booking Schedule
        </h3>
        {slots.length === 0 ? (
          <p className="text-gray-500 italic">No bookings found for upcoming dates.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-600 sticky top-0">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Beneficiary</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {slots.map((slot) => {
                  const status = getStatus(slot.date, slot.userId?.lastDistributionMonth);
                  return (
                    <tr key={slot._id} className="hover:bg-gray-50">
                      <td className="p-3">{slot.date}</td>
                      <td className="p-3 font-bold text-gray-700">{slot.timeSlot}</td>
                      <td className="p-3">
                        <p className="font-medium">{slot.userId?.name || "Unknown"}</p>
                        <p className="text-xs text-gray-500">{slot.userId?.mobile}</p>
                      </td>
                      <td className="p-3">
                        {status === 'collected' ? (
                          <span className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold w-fit">
                            <FaCheckCircle /> Collected
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold w-fit">
                            <FaHourglassHalf /> Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Distribution History */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <FaHistory /> Distribution Logs
        </h3>
        {history.length === 0 ? (
          <p className="text-gray-500 italic">No records found.</p>
        ) : (
          <div className="overflow-x-auto max-h-60 overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-3">Time</th>
                  <th className="p-3">Beneficiary</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {history.map((txn) => (
                  <tr key={txn._id}>
                    <td className="p-3 text-gray-500">{new Date(txn.date).toLocaleString()}</td>
                    <td className="p-3 font-medium">{txn.userId?.name}</td>
                    <td className="p-3 text-xs text-gray-600">
                      Rice: {txn.items.riceKg}kg, Wheat: {txn.items.wheatKg}kg
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealerDashboard;
