import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { FaHistory, FaPaperPlane } from 'react-icons/fa';

const ComplaintPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [myComplaints, setMyComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch previous complaints
  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const fetchMyComplaints = async () => {
    try {
      const res = await api.get('/complaint/my'); // Matches backend source: 452
      setMyComplaints(res.data);
    } catch (err) {
      console.error("Error fetching complaints");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Submit new complaint
      await api.post('/complaint/submit', { title, description }); // Matches backend source: 413
      toast.success("Complaint Submitted");
      setTitle('');
      setDescription('');
      fetchMyComplaints(); // Refresh list
    } catch (err) {
      toast.error("Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Complaint Center</h1>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Form Section */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FaPaperPlane className="text-primary" /> File a Complaint
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Issue Title</label>
              <input 
                type="text" 
                className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-primary outline-none"
                placeholder="e.g., Ration not received"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea 
                className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-primary outline-none h-32"
                placeholder="Describe your issue in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded hover:bg-indigo-700 transition"
            >
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </form>
        </div>

        {/* History Section */}
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FaHistory className="text-gray-600" /> Your History
          </h2>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {myComplaints.length === 0 ? (
              <p className="text-gray-500 italic">No complaints filed yet.</p>
            ) : (
              myComplaints.map((comp) => (
                <div key={comp._id} className="bg-white p-3 rounded shadow-sm border-l-4 border-primary">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold">{comp.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                      comp.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {comp.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{comp.description}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(comp.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ComplaintPage;