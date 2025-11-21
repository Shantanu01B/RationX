import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for reaching out! We will get back to you shortly.");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
      <div className="container mx-auto max-w-5xl">
        
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center text-gray-800 mb-12"
        >
          Get in Touch
        </motion.h1>

        <div className="grid md:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Contact Info (Left) - Slides in from Left */}
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-primary text-white p-10 md:p-12 flex flex-col justify-center relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-900 opacity-20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
              <p className="text-indigo-100 mb-10 leading-relaxed">
                Have questions about your ration card, quota, or the app? We are here to help you 24/7.
              </p>

              <div className="space-y-8">
                <motion.div 
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-5"
                >
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-indigo-200 uppercase font-bold tracking-wider">Helpline</p>
                    <p className="text-lg font-medium">1800-123-4567</p>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-5"
                >
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-indigo-200 uppercase font-bold tracking-wider">Email Support</p>
                    <p className="text-lg font-medium">support@rationx.gov.in</p>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-5"
                >
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-indigo-200 uppercase font-bold tracking-wider">Head Office</p>
                    <p className="text-lg font-medium leading-snug">Department of Civil Supplies,<br />New Delhi, India</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form (Right) - Slides in from Right */}
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="p-10 md:p-12 bg-white"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-2 group-focus-within:text-primary transition-colors">Your Name</label>
                <input type="text" required className="w-full border border-gray-200 bg-gray-50 p-3 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" placeholder="John Doe" />
              </div>
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-2 group-focus-within:text-primary transition-colors">Email Address</label>
                <input type="email" required className="w-full border border-gray-200 bg-gray-50 p-3 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" placeholder="john@example.com" />
              </div>
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-2 group-focus-within:text-primary transition-colors">Message</label>
                <textarea required rows="4" className="w-full border border-gray-200 bg-gray-50 p-3 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none" placeholder="How can we help you?"></textarea>
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
              >
                <Send size={18} /> Send Message
              </motion.button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Contact;