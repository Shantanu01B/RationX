import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane, FaTimes } from 'react-icons/fa';
import api from '../utils/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: "Hello! I am the RationX Assistant. Ask me about your quota or next distribution date." }
  ]);
  const [loading, setLoading] = useState(false);
  
  // Auto-scroll to bottom of chat
  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isOpen]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // 1. Add user message to UI immediately
    const userMsg = message;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setMessage('');
    setLoading(true);

    try {
      // 2. Send to Backend (POST /api/chat)
      const res = await api.post('/chat', { message: userMsg });
      
      // 3. Add AI response to UI
      setChatHistory(prev => [...prev, { role: 'ai', text: res.data.reply }]);
    } catch (error) {
      console.error(error);
      setChatHistory(prev => [...prev, { role: 'ai', text: "Sorry, I'm having trouble connecting to the server." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      
      {/* The Chat Window (Only shows if isOpen is true) */}
      {isOpen && (
        <div className="bg-white w-80 h-96 rounded-xl shadow-2xl border border-gray-200 flex flex-col mb-4 animate-fade-in overflow-hidden">
          
          {/* Header */}
          <div className="bg-primary text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FaRobot />
              <span className="font-bold">RationX AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-gray-200">
              <FaTimes />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
            {chatHistory.map((msg, idx) => (
              <div 
                key={idx} 
                className={`max-w-[85%] p-3 rounded-lg text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white ml-auto rounded-tr-none' 
                    : 'bg-white text-gray-800 mr-auto rounded-tl-none border'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="text-xs text-gray-500 italic ml-2">Typing...</div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={sendMessage} className="p-3 bg-white border-t flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about quota..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-secondary text-white p-2 rounded-full hover:bg-emerald-600 transition disabled:opacity-50"
            >
              <FaPaperPlane size={14} />
            </button>
          </form>
        </div>
      )}

      {/* The Floating Button (Toggle) */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="bg-primary text-white p-4 rounded-full shadow-lg hover:scale-110 transition duration-200 flex items-center justify-center"
      >
        {isOpen ? <FaTimes size={24} /> : <FaRobot size={24} />}
      </button>

    </div>
  );
};

export default Chatbot;