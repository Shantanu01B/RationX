import { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { FaBell } from 'react-icons/fa';

const AdminNotifications = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [visibleTo, setVisibleTo] = useState(['user', 'dealer']);
  const [loading, setLoading] = useState(false);

  const handlePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/notification', { // 
        title,
        message,
        visibleTo
      });
      toast.success("Notification Posted Successfully!");
      setTitle('');
      setMessage('');
    } catch (err) {
      toast.error("Failed to post notification");
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = (role) => {
    if (visibleTo.includes(role)) {
      setVisibleTo(visibleTo.filter(r => r !== role));
    } else {
      setVisibleTo([...visibleTo, role]);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <FaBell className="text-yellow-500" /> Post Notification
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-lg border">
        <form onSubmit={handlePost} className="space-y-5">
          <div>
            <label className="block font-bold text-gray-700">Title</label>
            <input 
              type="text" 
              className="w-full border p-3 rounded mt-1 focus:ring-2 focus:ring-primary outline-none"
              placeholder="e.g., Stock Arriving Tomorrow"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block font-bold text-gray-700">Message</label>
            <textarea 
              className="w-full border p-3 rounded mt-1 focus:ring-2 focus:ring-primary outline-none h-32"
              placeholder="Enter detailed message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-2">Visible To:</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={visibleTo.includes('user')} 
                  onChange={() => toggleVisibility('user')}
                  className="w-5 h-5 text-primary"
                />
                <span className="text-gray-800">Users</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={visibleTo.includes('dealer')} 
                  onChange={() => toggleVisibility('dealer')}
                  className="w-5 h-5 text-primary"
                />
                <span className="text-gray-800">Dealers</span>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-3 rounded hover:bg-indigo-700 transition"
          >
            {loading ? "Posting..." : "Send Notification"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminNotifications;