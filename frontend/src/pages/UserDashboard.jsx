import { useEffect, useState, useRef } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FaBoxOpen, FaQrcode, FaLeaf, FaTint, FaDownload, FaIdCard, FaHistory, FaCalendarCheck } from 'react-icons/fa';
import Chatbot from '../components/Chatbot';
import NotificationList from '../components/NotificationList';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const UserDashboard = () => {
  const { user } = useAuth();
  const [qrCode, setQrCode] = useState(null);
  const [loadingQr, setLoadingQr] = useState(true);
  
  const passbookRef = useRef();

  useEffect(() => {
    const fetchQr = async () => {
      try {
        const res = await api.get('/qr/my-qr');
        setQrCode(res.data.qrCode);
      } catch (err) {
        console.error("Failed to load QR", err);
      } finally {
        setLoadingQr(false);
      }
    };
    fetchQr();
  }, []);

  const regenerateQR = async () => {
    if(!window.confirm("Generate new QR code? The old one will stop working.")) return;
    setLoadingQr(true);
    try {
      const res = await api.post('/qr/generate');
      setQrCode(res.data.qrCode);
      toast.success("New QR Generated!");
    } catch (err) {
      toast.error("Failed to generate QR");
    } finally {
      setLoadingQr(false);
    }
  };

  const downloadPassbook = async () => {
    const input = passbookRef.current;
    if (!input) {
        toast.error("Passbook template not found");
        return;
    }

    try {
      const canvas = await html2canvas(input, { 
          scale: 2, 
          useCORS: true,
          allowTaint: true,
          logging: true 
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`RationPassbook_${user.rationCardNumber}.pdf`);
      toast.success("Passbook Downloaded!");
    } catch (err) {
      console.error("PDF Generation Error:", err);
      toast.error("Failed to download passbook");
    }
  };

  if (!user) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6 animate-fade-in">
      <NotificationList />
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-800 mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Welcome, {user.name}!
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">Here is your ration status for this month</p>
        </div>
        
        <button 
          onClick={downloadPassbook}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 sm:px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 font-bold text-sm sm:text-base w-full lg:w-auto justify-center"
        >
          <FaDownload className="text-lg" /> Download Passbook
        </button>
      </div>

      {/* === HIDDEN PASSBOOK TEMPLATE === */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div ref={passbookRef} className="p-8 bg-white border-4 border-indigo-900 w-[800px] mx-auto font-serif text-gray-900">
          <div className="bg-indigo-900 text-white p-4 text-center mb-6">
             <h1 className="text-3xl font-bold uppercase tracking-widest">RationX Digital Passbook</h1>
             <p className="text-sm">Public Distribution System - Official Document</p>
          </div>
          <div className="flex gap-8">
            <div className="w-1/3 flex flex-col items-center border-r-2 border-gray-200 pr-6">
              <div className="w-40 h-40 border-4 border-gray-800 mb-4 flex items-center justify-center bg-gray-50">
                 {qrCode ? <img src={qrCode} alt="QR" className="w-full h-full object-cover" /> : "QR"}
              </div>
              <p className="text-center text-xs text-gray-500">Scan to verify details</p>
              <div className="mt-6 text-center">
                <p className="font-bold text-lg text-indigo-900">{user.rationCardNumber}</p>
                <p className="text-xs uppercase tracking-wide text-gray-500">Card Number</p>
              </div>
            </div>
            <div className="w-2/3 space-y-4">
               <div className="border-b pb-2">
                 <span className="text-gray-500 text-sm uppercase block">Beneficiary Name</span>
                 <span className="text-xl font-bold">{user.name}</span>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="border-b pb-2">
                   <span className="text-gray-500 text-sm uppercase block">Mobile Number</span>
                   <span className="text-lg font-bold">{user.mobile}</span>
                 </div>
                 <div className="border-b pb-2">
                   <span className="text-gray-500 text-sm uppercase block">Family Members</span>
                   <span className="text-lg font-bold">{user.familyMembers}</span>
                 </div>
               </div>
               <div className="border-b pb-2">
                 <span className="text-gray-500 text-sm uppercase block">Registered Address</span>
                 <span className="text-lg font-bold leading-tight">
                   {user.address?.line1}, {user.address?.city}, {user.address?.state} - {user.address?.pincode}
                 </span>
               </div>
               <div className="bg-gray-100 p-4 rounded mt-4">
                 <h3 className="font-bold text-indigo-900 border-b border-gray-300 pb-1 mb-2 uppercase text-sm">Monthly Entitlement</h3>
                 <div className="grid grid-cols-4 gap-2 text-sm">
                    <div className="text-center"><span className="block font-bold">{user.entitlement?.riceKg || 5} Kg</span><span className="text-xs">Rice</span></div>
                    <div className="text-center"><span className="block font-bold">{user.entitlement?.wheatKg || 5} Kg</span><span className="text-xs">Wheat</span></div>
                    <div className="text-center"><span className="block font-bold">{user.entitlement?.sugarKg || 1} Kg</span><span className="text-xs">Sugar</span></div>
                    <div className="text-center"><span className="block font-bold">{user.entitlement?.oilL || 1} L</span><span className="text-xs">Oil</span></div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Profile Info Card */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 lg:col-span-2 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 bg-gradient-to-br from-indigo-500 to-purple-500 p-4 rounded-bl-2xl text-white">
             <FaIdCard className="text-xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <FaIdCard className="text-indigo-600 text-lg" />
            </div>
            Beneficiary Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 group-hover:border-indigo-200 transition-colors">
              <p className="text-gray-500 text-xs uppercase font-semibold mb-2">Full Name</p>
              <p className="font-bold text-gray-800 text-lg">{user.name}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 group-hover:border-indigo-200 transition-colors">
              <p className="text-gray-500 text-xs uppercase font-semibold mb-2">Ration Card No.</p>
              <p className="font-bold text-gray-800 text-lg">{user.rationCardNumber}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 group-hover:border-indigo-200 transition-colors">
              <p className="text-gray-500 text-xs uppercase font-semibold mb-2">Mobile</p>
              <p className="font-bold text-gray-800 text-lg">{user.mobile}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 group-hover:border-indigo-200 transition-colors">
              <p className="text-gray-500 text-xs uppercase font-semibold mb-2">Family Members</p>
              <p className="font-bold text-gray-800 text-lg">{user.familyMembers}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 group-hover:border-indigo-200 transition-colors md:col-span-2">
              <p className="text-gray-500 text-xs uppercase font-semibold mb-2">Address</p>
              <p className="font-bold text-gray-800 leading-relaxed">{user.address?.line1}, {user.address?.city}, {user.address?.state} - {user.address?.pincode}</p>
            </div>
          </div>
        </div>

        {/* Quota Card */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 group hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FaBoxOpen className="text-green-600 text-lg" />
            </div>
            Remaining Quota
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 group-hover:border-green-300 transition-colors">
              <span className="flex items-center gap-3 text-gray-700 font-medium"><FaLeaf className="text-green-500 text-lg"/> Rice</span>
              <span className="font-bold text-xl text-green-700">{user.remainingQuota?.riceKg || 0} Kg</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200 group-hover:border-amber-300 transition-colors">
              <span className="flex items-center gap-3 text-gray-700 font-medium"><FaLeaf className="text-yellow-600 text-lg"/> Wheat</span>
              <span className="font-bold text-xl text-amber-700">{user.remainingQuota?.wheatKg || 0} Kg</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 group-hover:border-blue-300 transition-colors">
              <span className="flex items-center gap-3 text-gray-700 font-medium"><FaBoxOpen className="text-gray-500 text-lg"/> Sugar</span>
              <span className="font-bold text-xl text-blue-700">{user.remainingQuota?.sugarKg || 0} Kg</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 group-hover:border-orange-300 transition-colors">
              <span className="flex items-center gap-3 text-gray-700 font-medium"><FaTint className="text-yellow-500 text-lg"/> Oil</span>
              <span className="font-bold text-xl text-orange-700">{user.remainingQuota?.oilL || 0} L</span>
            </div>
          </div>
        </div>

        {/* QR Card */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center group hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaQrcode className="text-purple-600 text-lg" />
            </div>
            Your Ration ID
          </h2>
          <div className="bg-gradient-to-br from-gray-50 to-purple-50 p-6 rounded-xl border-2 border-dashed border-gray-300 group-hover:border-purple-400 transition-colors mb-4">
            {loadingQr ? (
              <div className="w-48 h-48 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : qrCode ? (
              <img src={qrCode} alt="User QR Code" className="w-48 h-48 object-contain rounded-lg" />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-red-500 font-medium">
                QR Not Available
              </div>
            )}
          </div>
          <div className="mt-4 flex flex-col gap-3 w-full px-4">
            <p className="text-sm text-gray-500 font-medium">ID: {user.rationCardNumber}</p>
            <button 
              onClick={regenerateQR} 
              className="text-sm text-purple-600 hover:text-purple-800 font-medium hover:underline transition-colors duration-300"
            >
              Regenerate QR Code
            </button>
          </div>
        </div>

        {/* History Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 lg:col-span-2 group hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaHistory className="text-blue-600 text-lg" />
            </div>
            Last Collection History
          </h2>
          
          {user.lastDistributionMonth ? (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-xl flex items-start gap-6 group-hover:border-green-600 transition-colors">
              <div className="text-4xl text-green-500 bg-white p-3 rounded-xl shadow-sm">
                <FaCalendarCheck />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-green-800 text-lg mb-2">Ration Collected Successfully</h3>
                <p className="text-green-700 font-medium mb-4">
                  Month: <span className="font-bold">{user.lastDistributionMonth}</span>
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-white px-4 py-3 rounded-lg border border-green-200 text-center shadow-sm">
                    <span className="block font-bold text-green-700 text-lg">{user.entitlement?.riceKg || 5}kg</span>
                    <span className="text-xs text-gray-600 font-medium">Rice</span>
                  </div>
                  <div className="bg-white px-4 py-3 rounded-lg border border-green-200 text-center shadow-sm">
                    <span className="block font-bold text-green-700 text-lg">{user.entitlement?.wheatKg || 5}kg</span>
                    <span className="text-xs text-gray-600 font-medium">Wheat</span>
                  </div>
                  <div className="bg-white px-4 py-3 rounded-lg border border-green-200 text-center shadow-sm">
                    <span className="block font-bold text-green-700 text-lg">{user.entitlement?.sugarKg || 1}kg</span>
                    <span className="text-xs text-gray-600 font-medium">Sugar</span>
                  </div>
                  <div className="bg-white px-4 py-3 rounded-lg border border-green-200 text-center shadow-sm">
                    <span className="block font-bold text-green-700 text-lg">{user.entitlement?.oilL || 1}L</span>
                    <span className="text-xs text-gray-600 font-medium">Oil</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-l-4 border-gray-400 p-8 text-center rounded-xl">
              <div className="text-gray-400 text-4xl mb-4">
                <FaCalendarCheck />
              </div>
              <p className="text-gray-500 text-lg font-medium">No ration collected yet for the current period</p>
            </div>
          )}
        </div>
      </div>
      
      <Chatbot />
    </div>
  );
};

export default UserDashboard;