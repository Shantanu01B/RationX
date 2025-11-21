import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // Added .jsx extension
import { 
  Menu, X, Home, Calendar, ClipboardList, 
  LayoutDashboard, Settings, Users, Bell, 
  LogOut, UserCircle, Leaf, Info, Phone 
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white shadow-xl sticky top-0 z-50 backdrop-blur-sm bg-opacity-95 border-b border-indigo-600">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">

        {/* 1. LOGO */}
        <Link to="/" className="text-2xl font-extrabold tracking-tight flex items-center gap-3 hover:opacity-90 transition group">
          <div className="bg-white text-indigo-700 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg">
            <Leaf size={24} fill="currentColor" />
          </div>
          <span className="bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent">
            RationX
          </span>
        </Link>

        {/* 2. DESKTOP MENU */}
        <div className="hidden lg:flex items-center gap-6">
          
          {/* Public Links */}
          <Link to="/about" className="text-sm font-semibold hover:text-indigo-200 transition-all duration-300 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10">
            <Info size={18} /> About
          </Link>
          <Link to="/contact" className="text-sm font-semibold hover:text-indigo-200 transition-all duration-300 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10">
            <Phone size={18} /> Contact
          </Link>

          {user ? (
            <>
              {/* --- Role: USER --- */}
              {user.role === "user" && (
                <>
                  <Link to="/user/dashboard" className="flex items-center gap-2 text-sm font-semibold hover:text-indigo-200 transition-all duration-300 px-3 py-2 rounded-lg hover:bg-white/10">
                    <Home size={18} /> Dashboard
                  </Link>
                  <Link to="/user/book-slot" className="flex items-center gap-2 text-sm font-semibold hover:text-indigo-200 transition-all duration-300 px-3 py-2 rounded-lg hover:bg-white/10">
                    <Calendar size={18} /> Book Slot
                  </Link>
                  <Link to="/user/complaints" className="flex items-center gap-2 text-sm font-semibold hover:text-indigo-200 transition-all duration-300 px-3 py-2 rounded-lg hover:bg-white/10">
                    <ClipboardList size={18} /> Complaints
                  </Link>
                </>
              )}

              {/* --- Role: DEALER --- */}
              {user.role === "dealer" && (
                <Link to="/dealer/dashboard" className="flex items-center gap-2 text-sm font-semibold hover:text-indigo-200 transition-all duration-300 px-3 py-2 rounded-lg hover:bg-white/10">
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
              )}

              {/* --- Role: ADMIN --- */}
              {user.role === "admin" && (
                <>
                  <Link to="/admin/dashboard" className="flex items-center gap-2 text-sm font-semibold hover:text-indigo-200 transition-all duration-300 px-3 py-2 rounded-lg hover:bg-white/10">
                    <LayoutDashboard size={18} /> Dashboard
                  </Link>
                  <Link to="/admin/management" className="flex items-center gap-2 text-sm font-semibold hover:text-indigo-200 transition-all duration-300 px-3 py-2 rounded-lg hover:bg-white/10">
                    <Settings size={18} /> Manage
                  </Link>
                  <Link to="/admin/users" className="flex items-center gap-2 text-sm font-semibold hover:text-indigo-200 transition-all duration-300 px-3 py-2 rounded-lg hover:bg-white/10">
                    <Users size={18} /> Users
                  </Link>
                  <Link to="/admin/notifications" className="flex items-center gap-2 text-sm font-semibold hover:text-indigo-200 transition-all duration-300 px-3 py-2 rounded-lg hover:bg-white/10">
                    <Bell size={18} /> Alerts
                  </Link>
                </>
              )}

              {/* User Profile Pill */}
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm pl-4 pr-2 py-2 rounded-full ml-2 border border-white/20 shadow-lg">
                <div className="text-right leading-tight">
                  <p className="text-sm font-bold text-white">{user.name.split(' ')[0]}</p>
                  <p className="text-xs text-indigo-200 uppercase tracking-wide font-semibold bg-white/10 px-2 py-0.5 rounded-full">
                    {user.role}
                  </p>
                </div>
                <div className="bg-white/20 p-1.5 rounded-full">
                  <UserCircle size={28} className="text-white" />
                </div>
                <div className="h-6 w-px bg-white/30 mx-1"></div>
                <button 
                  onClick={handleLogout} 
                  className="text-red-300 hover:text-white hover:bg-red-500/30 p-2 rounded-full transition-all duration-300" 
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            /* Guest Links */
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/30">
              <Link to="/login" className="text-sm font-semibold hover:text-white transition-all duration-300 px-4 py-2 rounded-lg hover:bg-white/10">
                Login
              </Link>
              <Link to="/register" className="bg-white text-indigo-700 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-50 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 shadow-md">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* 3. MOBILE MENU TOGGLE */}
        <button 
          className="lg:hidden text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-300 focus:outline-none" 
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* 4. MOBILE DROPDOWN */}
      {isMenuOpen && (
        <div className="lg:hidden bg-gradient-to-b from-indigo-800 to-purple-800 border-t border-white/20 shadow-2xl absolute w-full left-0 animate-fade-in z-40 backdrop-blur-lg">
          <div className="flex flex-col p-6 space-y-2">
            
            <Link onClick={toggleMenu} to="/about" className="flex items-center gap-4 py-4 px-4 rounded-xl hover:bg-white/10 text-white transition-all duration-300">
              <Info size={22} /> About Us
            </Link>
            <Link onClick={toggleMenu} to="/contact" className="flex items-center gap-4 py-4 px-4 rounded-xl hover:bg-white/10 text-white transition-all duration-300">
              <Phone size={22} /> Contact Us
            </Link>
            <div className="h-px bg-white/20 my-2"></div>

            {user ? (
              <>
                {/* Mobile User Profile Header */}
                <div className="flex items-center gap-4 px-4 py-4 bg-white/10 rounded-2xl mb-2">
                  <div className="bg-white/20 p-2 rounded-full">
                    <UserCircle size={36} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-white">{user.name}</p>
                    <p className="text-sm text-indigo-200 uppercase font-semibold tracking-wider bg-white/10 px-3 py-1 rounded-full">
                      {user.role}
                    </p>
                  </div>
                </div>

                {user.role === 'user' && (
                  <>
                    <Link onClick={toggleMenu} to="/user/dashboard" className="flex items-center gap-4 py-4 px-4 hover:bg-white/10 rounded-xl transition-all duration-300"><Home size={22} /> Dashboard</Link>
                    <Link onClick={toggleMenu} to="/user/book-slot" className="flex items-center gap-4 py-4 px-4 hover:bg-white/10 rounded-xl transition-all duration-300"><Calendar size={22} /> Book Slot</Link>
                    <Link onClick={toggleMenu} to="/user/complaints" className="flex items-center gap-4 py-4 px-4 hover:bg-white/10 rounded-xl transition-all duration-300"><ClipboardList size={22} /> Complaints</Link>
                  </>
                )}
                
                {user.role === 'dealer' && (
                   <Link onClick={toggleMenu} to="/dealer/dashboard" className="flex items-center gap-4 py-4 px-4 hover:bg-white/10 rounded-xl transition-all duration-300"><LayoutDashboard size={22} /> Dashboard</Link>
                )}

                {user.role === 'admin' && (
                  <>
                    <Link onClick={toggleMenu} to="/admin/dashboard" className="flex items-center gap-4 py-4 px-4 hover:bg-white/10 rounded-xl transition-all duration-300"><LayoutDashboard size={22} /> Dashboard</Link>
                    <Link onClick={toggleMenu} to="/admin/management" className="flex items-center gap-4 py-4 px-4 hover:bg-white/10 rounded-xl transition-all duration-300"><Settings size={22} /> Manage</Link>
                    <Link onClick={toggleMenu} to="/admin/users" className="flex items-center gap-4 py-4 px-4 hover:bg-white/10 rounded-xl transition-all duration-300"><Users size={22} /> Users</Link>
                    <Link onClick={toggleMenu} to="/admin/notifications" className="flex items-center gap-4 py-4 px-4 hover:bg-white/10 rounded-xl transition-all duration-300"><Bell size={22} /> Alerts</Link>
                  </>
                )}

                <button 
                  onClick={handleLogout} 
                  className="bg-red-600/90 text-white py-4 rounded-xl mt-4 flex items-center justify-center gap-3 font-bold shadow-lg hover:bg-red-600 w-full transition-all duration-300"
                >
                  <LogOut size={22} /> Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Link onClick={toggleMenu} to="/login" className="bg-white/10 hover:bg-white/20 text-center py-4 rounded-xl font-bold transition-all duration-300 border border-white/20">
                  Login
                </Link>
                <Link onClick={toggleMenu} to="/register" className="bg-white text-indigo-700 hover:bg-gray-100 text-center py-4 rounded-xl font-bold transition-all duration-300 shadow-lg">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;