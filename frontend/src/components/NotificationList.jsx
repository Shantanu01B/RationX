import { useEffect, useState } from 'react';
import api from '../utils/api';
import { FaBullhorn } from 'react-icons/fa';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await api.get('/notification'); // 
        setNotifications(res.data.notifications || []);
      } catch (err) {
        console.error("Failed to load notifications");
      }
    };
    fetchNotifs();
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div className="mb-8 animate-fade-in">
      <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
        <FaBullhorn className="text-orange-500" /> Announcements
      </h3>
      <div className="space-y-3">
        {notifications.map((note) => (
          <div key={note._id} className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded shadow-sm">
            <h4 className="font-bold text-orange-800">{note.title}</h4>
            <p className="text-sm text-gray-700 mt-1">{note.message}</p>
            <span className="text-xs text-gray-400 mt-2 block">
              {new Date(note.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationList;