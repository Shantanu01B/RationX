import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FaCalendarAlt, FaInfoCircle, FaBan, FaUsers, FaCheckCircle, FaStore } from 'react-icons/fa';

const SlotBooking = () => {
  const { user } = useAuth();
  const [dealers, setDealers] = useState([]);
  const [selectedDealer, setSelectedDealer] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [myBooking, setMyBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // NEW: State to store slot counts
  const [slotCounts, setSlotCounts] = useState({}); 
  const MAX_CAPACITY = 10; // Match this with your backend limit [cite: 871]

  const [isBlocked, setIsBlocked] = useState(false);

  const slots = ["09:00-10:00", "10:00-11:00", "11:00-12:00", "14:00-15:00", "15:00-16:00", "16:00-17:00"];

  useEffect(() => {
    fetchMyBooking();
    fetchDealers();
  }, []);

  // NEW: Fetch availability whenever Date or Dealer changes
  useEffect(() => {
    if (selectedDealer && date) {
      fetchAvailability();
    }
    
    // Check Ration Collection status
    if (user?.lastDistributionMonth && date) {
      const selectedMonth = date.substring(0, 7);
      if (selectedMonth === user.lastDistributionMonth) {
        setIsBlocked(true);
      } else {
        setIsBlocked(false);
      }
    }
  }, [date, selectedDealer, user]);

  const fetchAvailability = async () => {
    try {
      // Call the new endpoint we just created
      const res = await api.get(`/slot/check-availability?dealerId=${selectedDealer}&date=${date}`);
      setSlotCounts(res.data);
    } catch (err) {
      console.error("Failed to fetch availability");
    }
  };

  const fetchDealers = async () => {
    try {
      const res = await api.get('/slot/all-dealers'); 
      setDealers(res.data.dealers || []);
    } catch (err) {
      console.warn("Could not fetch dealers.");
    }
  };

  const fetchMyBooking = async () => {
    try {
      const res = await api.get('/slot/my-slot');
      if (res.data && !res.data.msg) {
        setMyBooking(res.data);
      }
    } catch (err) {}
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (isBlocked) {
      toast.error(`Ration already collected for ${user.lastDistributionMonth}.`);
      return;
    }

    setLoading(true);
    try {
      await api.post('/slot/book', {
        dealerId: selectedDealer,
        date,
        timeSlot
      });
      toast.success("Slot Booked Successfully!");
      fetchMyBooking();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Booking Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FaCalendarAlt className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-800 mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Ration Slot Booking
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">Book your convenient time slot for ration collection</p>
        </div>

        {user?.lastDistributionMonth && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-700 flex items-center gap-3 font-medium">
            <FaInfoCircle className="text-blue-500 text-lg flex-shrink-0" /> 
            <span>Last Ration Collected: <b className="font-bold">{user.lastDistributionMonth}</b></span>
          </div>
        )}

        {myBooking ? (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 text-center shadow-lg">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
              <FaCheckCircle className="text-white text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-3">Slot Confirmed!</h2>
            <p className="text-gray-700 text-lg mb-4">Your ration collection slot is booked for:</p>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100 mb-4">
              <p className="text-3xl font-black text-gray-800 mb-2">{myBooking.date}</p>
              <p className="text-xl font-bold text-green-700 bg-green-50 py-2 px-4 rounded-lg inline-block">
                {myBooking.timeSlot}
              </p>
            </div>
            <div className="text-sm text-gray-600 bg-white/50 py-2 px-4 rounded-lg inline-block">
              <FaStore className="inline mr-2 text-gray-500" />
              Dealer: {myBooking.dealerId?.name || "Main Dealer"}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
            <form onSubmit={handleBook} className="space-y-6">
              
              {/* Dealer Selection */}
              <div className="space-y-2">
                <label className="block text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <FaStore className="text-indigo-600" />
                  </div>
                  Select Dealer
                </label>
                <select 
                  className="w-full border border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 bg-gray-50 text-gray-700 font-medium"
                  value={selectedDealer}
                  onChange={(e) => setSelectedDealer(e.target.value)}
                  required
                >
                  <option value="">-- Choose Dealer Shop --</option>
                  {dealers.map(d => (
                    <option key={d._id} value={d._id}>{d.name} ({d.shopNumber || 'Shop'})</option>
                  ))}
                </select>
              </div>

              {/* Date Selection */}
              <div className="space-y-2">
                <label className="block text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaCalendarAlt className="text-blue-600" />
                  </div>
                  Select Date
                </label>
                <input 
                  type="date" 
                  className={`w-full border p-4 rounded-xl focus:outline-none transition-all duration-300 font-medium ${
                    isBlocked 
                      ? 'border-red-300 bg-red-50 text-red-700 focus:ring-2 focus:ring-red-500' 
                      : 'border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent'
                  }`}
                  value={date}
                  min={new Date().toISOString().split('T')[0]} 
                  onChange={(e) => setDate(e.target.value)}
                  required 
                />
                {isBlocked && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2 flex items-center gap-3">
                    <FaBan className="text-red-500 text-lg flex-shrink-0" />
                    <p className="text-red-700 font-medium text-sm">
                      Ration already collected for this month. Please select a different date.
                    </p>
                  </div>
                )}
              </div>

              {/* Time Slots with Live Availability */}
              {date && selectedDealer && (
                <div className="space-y-2">
                  <label className="block text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <FaUsers className="text-green-600" />
                    </div>
                    Select Time Slot
                  </label>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {slots.map(slot => {
                      const bookedCount = slotCounts[slot] || 0;
                      const isFull = bookedCount >= MAX_CAPACITY;
                      const availableSlots = MAX_CAPACITY - bookedCount;
                      
                      return (
                        <button
                          type="button"
                          key={slot}
                          disabled={isBlocked || isFull}
                          onClick={() => setTimeSlot(slot)}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 relative group ${
                            timeSlot === slot 
                              ? 'bg-gradient-to-r from-primary to-secondary text-white border-transparent shadow-lg scale-105' 
                              : isBlocked || isFull
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
                                : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-primary hover:shadow-md'
                          }`}
                        >
                          <span className="block font-bold text-base mb-1">{slot}</span>
                          
                          {/* Availability Indicator */}
                          <span className={`text-xs font-semibold flex items-center justify-center gap-1 ${
                            isFull 
                              ? 'text-red-500' 
                              : timeSlot === slot
                                ? 'text-white/90'
                                : 'text-green-600'
                          }`}>
                            {isFull ? (
                              <span className="flex items-center gap-1">
                                <FaBan size={10}/> FULL
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <FaUsers size={10}/> {availableSlots} slots left
                              </span>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <input type="hidden" required value={timeSlot} />
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading || isBlocked || !timeSlot} 
                className={`w-full font-bold py-4 rounded-xl transition-all duration-300 shadow-lg ${
                  loading || isBlocked || !timeSlot
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-gradient-to-r from-secondary to-emerald-600 text-white hover:shadow-xl transform hover:-translate-y-1'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Booking Your Slot...</span>
                  </div>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotBooking;