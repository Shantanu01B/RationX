import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TranslateWidget from "../components/TranslateWidget";
import { 
  User, Store, ShieldCheck, QrCode, TrendingUp, 
  MessageSquare, ArrowRight, CheckCircle, Clock, Phone,
  BarChart3, Smartphone, Headphones, Sparkles, Award,
  Shield, Zap, Users, Calendar
} from 'lucide-react';

// --- HERO SLIDER DATA ---
const slides = [
  {
    id: 1,
    title: "Smart Ration Distribution",
    desc: "Experience a transparent, efficient, and digital Public Distribution System powered by modern technology.",
    bg: "bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600",
    pattern: "from-blue-500/20 to-purple-500/20",
    icon: <Sparkles className="text-yellow-300" />
  },
  {
    id: 2,
    title: "QR-Based Security",
    desc: "Secure your entitlement with unique QR verification. No more fraud, no more impersonation.",
    bg: "bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600",
    pattern: "from-emerald-500/20 to-teal-500/20",
    icon: <Shield className="text-green-300" />
  },
  {
    id: 3,
    title: "Real-Time Tracking",
    desc: "Check your stock, book slots, and track distribution history instantly from your dashboard.",
    bg: "bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600",
    pattern: "from-purple-500/20 to-pink-500/20",
    icon: <TrendingUp className="text-pink-300" />
  }
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white overflow-hidden">
      
      {/* 1. ENHANCED HERO SECTION */}
      <div className="relative h-[400px] sm:h-[450px] md:h-[500px] overflow-hidden">
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className={`absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4 sm:px-6 ${slides[currentSlide].bg}`}
          >
            {/* Enhanced Background Effects */}
            <div className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].pattern}`}></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
            
            {/* Animated Floating Elements */}
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-10 left-5 sm:left-10 w-16 h-16 bg-white/10 rounded-full blur-xl"
            />
            <motion.div
              animate={{ 
                y: [0, 15, 0],
                rotate: [0, -5, 0]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute bottom-10 right-5 sm:right-10 w-20 h-20 bg-white/5 rounded-full blur-2xl"
            />
            
            {/* Main Content */}
            <div className="relative z-10 max-w-4xl mx-auto">
              {/* Icon Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="flex justify-center mb-4"
              >
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 border border-white/30">
                  {slides[currentSlide].icon}
                </div>
              </motion.div>

              <motion.h1 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 leading-tight tracking-tight"
              >
                {slides[currentSlide].title}
              </motion.h1>
              
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-base sm:text-lg md:text-xl max-w-2xl lg:max-w-3xl mx-auto mb-6 sm:mb-8 text-white/90 leading-relaxed font-light px-4"
              >
                {slides[currentSlide].desc}
              </motion.p>

              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4"
              >
                <Link 
                  to="/register" 
                  className="bg-white text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 group text-sm sm:text-base min-w-[140px] justify-center"
                >
                  Get Started 
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/about" 
                  className="border-2 border-white/80 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-white/10 backdrop-blur-sm transition-all duration-300 group text-sm sm:text-base min-w-[140px] text-center"
                >
                  Learn More
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Enhanced Slider Dots */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, index) => (
            <motion.button 
              key={index}
              onClick={() => setCurrentSlide(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'bg-white w-6 shadow-lg' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 2. ENHANCED LOGIN CARDS SECTION */}
      <div className="container mx-auto px-4 sm:px-6 -mt-8 sm:-mt-12 md:-mt-16 relative z-20 mb-16 sm:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto"
        >
          {[
            {
              role: "Beneficiary",
              desc: "Check quota, book slots, and view distribution history",
              icon: <User size={28} />,
              gradient: "from-blue-500 to-cyan-500",
              iconBg: "bg-blue-50",
              iconColor: "text-blue-600",
              link: "/login",
              buttonText: "User Login"
            },
            {
              role: "Dealer",
              desc: "Manage stock, scan QR codes, and distribute ration",
              icon: <Store size={28} />,
              gradient: "from-green-500 to-emerald-500",
              iconBg: "bg-green-50",
              iconColor: "text-green-600",
              link: "/login",
              buttonText: "Dealer Login"
            },
            {
              role: "Admin",
              desc: "Monitor analytics, manage dealers, and resolve complaints",
              icon: <ShieldCheck size={28} />,
              gradient: "from-purple-500 to-pink-500",
              iconBg: "bg-purple-50",
              iconColor: "text-purple-600",
              link: "/admin/login",
              buttonText: "Admin Portal"
            }
          ].map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group relative"
            >
              {/* Gradient Border */}
              <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              {/* Main Card */}
              <div className="relative bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100 group-hover:shadow-2xl transition-all duration-300 h-full">
                {/* Icon */}
                <div className={`${card.iconBg} w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={card.iconColor}>
                    {card.icon}
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3 text-center">{card.role}</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed text-center px-2">
                  {card.desc}
                </p>
                
                {/* Button */}
                <Link 
                  to={card.link}
                  className={`block w-full bg-gradient-to-r ${card.gradient} text-white py-2 sm:py-3 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 font-semibold text-sm sm:text-base text-center`}
                >
                  {card.buttonText}
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* 3. ENHANCED FEATURES SECTION */}
<div className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 py-16 sm:py-20 px-4 sm:px-6">
  <div className="container mx-auto max-w-6xl">
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12 sm:mb-16"
    >
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4"
      >
        <Award size={16} />
        Why Choose RationX?
      </motion.div>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-800 mb-3 sm:mb-4">
        Revolutionary Features
      </h2>
      <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
        Experience the future of public distribution with our cutting-edge technology platform
      </p>
    </motion.div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {[
        { 
          icon: <QrCode size={28} />, 
          title: "QR Verification", 
          desc: "Encrypted QR codes ensure secure ration distribution", 
          gradient: "from-indigo-500 to-purple-500",
          bg: "bg-gradient-to-br from-indigo-500 to-purple-500",
          iconBg: "bg-indigo-50",
          iconColor: "text-indigo-600"
        },
        { 
          icon: <BarChart3 size={28} />, 
          title: "Live Analytics", 
          desc: "Real-time monitoring across all distribution centers", 
          gradient: "from-emerald-500 to-teal-500",
          bg: "bg-gradient-to-br from-emerald-500 to-teal-500",
          iconBg: "bg-emerald-50",
          iconColor: "text-emerald-600"
        },
        { 
          icon: <Headphones size={28} />, 
          title: "AI Support", 
          desc: "24/7 intelligent assistance for all your queries", 
          gradient: "from-orange-500 to-red-500",
          bg: "bg-gradient-to-br from-orange-500 to-red-500",
          iconBg: "bg-orange-50",
          iconColor: "text-orange-600"
        },
        { 
          icon: <Calendar size={28} />, 
          title: "Slot Booking", 
          desc: "Pre-book time slots to avoid waiting in queues", 
          gradient: "from-blue-500 to-cyan-500",
          bg: "bg-gradient-to-br from-blue-500 to-cyan-500",
          iconBg: "bg-blue-50",
          iconColor: "text-blue-600"
        },
      ].map((feature, idx) => (
        <motion.div 
          key={idx}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5, scale: 1.03 }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
          className="group cursor-pointer"
        >
          <div className={`${feature.bg} p-0.5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full`}>
            <div className="bg-white p-4 sm:p-6 rounded-xl h-full flex flex-col items-center text-center group-hover:bg-gray-50/50 transition-colors duration-300">
              <div className={`${feature.iconBg} w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <div className={feature.iconColor}>
                  {feature.icon}
                </div>
              </div>
              <h4 className="font-bold text-lg sm:text-xl mb-3 text-gray-800">{feature.title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                {feature.desc}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</div>

      {/* 4. ENHANCED HOW IT WORKS SECTION */}
      <div className="py-16 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="lg:w-1/2"
            >
              <div className="relative">
                <img 
                  src="https://img.freepik.com/free-vector/family-shopping-supermarket_74855-5222.jpg?w=996" 
                  alt="Family Shopping" 
                  className="rounded-2xl shadow-xl w-full h-auto"
                />
                {/* Floating Badges */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-4 -left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-2 rounded-lg shadow-lg"
                >
                  <div className="flex items-center gap-1 text-sm font-bold">
                    <Zap size={14} />
                    Fast & Easy
                  </div>
                </motion.div>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                  className="absolute -bottom-4 -right-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-2 rounded-lg shadow-lg"
                >
                  <div className="flex items-center gap-1 text-sm font-bold">
                    <Users size={14} />
                    Family Friendly
                  </div>
                </motion.div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="lg:w-1/2"
            >
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-4 rounded-2xl mb-6 inline-block">
                <h2 className="text-2xl sm:text-3xl font-black">How It Works</h2>
              </div>
              <div className="space-y-4 sm:space-y-6">
                {[
                  { step: "1", title: "Register & Login", desc: "Sign up with your mobile number and get verified via OTP in seconds" },
                  { step: "2", title: "Get Your QR Code", desc: "Your dashboard generates a unique secure QR code automatically each month" },
                  { step: "3", title: "Visit Dealer & Collect", desc: "Show your QR code at the shop and collect your entitled ration instantly" },
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.2 }}
                    className="flex gap-4 group items-start"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {item.step}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-lg text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 text-sm sm:text-base">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 5. ENHANCED FOOTER */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-300 py-12 sm:py-16 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="sm:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-4"
              >
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-xl">
                  <Sparkles size={24} className="text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">RationX</h2>
              </motion.div>
              <p className="text-gray-400 text-sm sm:text-base max-w-md leading-relaxed">
                Empowering millions with a transparent, efficient, and digital public distribution system for a better tomorrow.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-lg">Quick Links</h4>
              <ul className="space-y-3 text-sm sm:text-base">
                {['Home', 'About Us', 'Contact', 'Login'].map((link, idx) => (
                  <motion.li 
                    key={idx}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link to={`/${link.toLowerCase().replace(' ', '-')}`} className="hover:text-white transition-colors duration-300 flex items-center gap-2">
                      <ArrowRight size={12} className="text-indigo-400" />
                      {link}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-lg">Contact Info</h4>
              <ul className="space-y-3 text-sm sm:text-base">
                <li className="flex items-center gap-3 hover:text-white transition-colors duration-300">
                  <Phone size={16} className="text-green-400" />
                  <span>1800-123-4567</span>
                </li>
                <li className="flex items-center gap-3 hover:text-white transition-colors duration-300">
                  <MessageSquare size={16} className="text-blue-400" />
                  <span>support@rationx.gov</span>
                </li>
                <li className="flex items-center gap-3 hover:text-white transition-colors duration-300">
                  <CheckCircle size={16} className="text-purple-400" />
                  <span>New Delhi, India</span>
                </li>
              </ul>
            </div>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="border-t border-gray-800 pt-6 text-center text-gray-500 text-sm"
          >
            <p>&copy; {new Date().getFullYear()} RationX Project. All rights reserved. | Making distribution fair and transparent</p>
          </motion.div>
        </div>
      </footer>
 <TranslateWidget />
    </div>
  );
};

export default Home;