import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Timer countdown for resend OTP
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (timer > 0) return;

    setLoading(true);
    try {
      const res = await api.post('/auth/request-otp', { mobile });

      // Standard success
      toast.success(res.data.msg || "OTP Sent!", { autoClose: 3000 });

      // Show demo OTP if provided
      if (res.data.debugOtp) {
        toast.info(`DEMO OTP: ${res.data.debugOtp}`, { autoClose: 5000 });
      }

      setStep(2);
      setTimer(60); // 60s cooldown for resend
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Failed to send OTP", { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { mobile, otp });

      login(res.data.token, res.data.user);
      toast.success("Login Successful!", { autoClose: 3000 });

      const role = res.data.user.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'dealer') navigate('/dealer/dashboard');
      else navigate('/user/dashboard');

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Invalid OTP", { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  // Quick fill demo credentials
  const fillDemoCredentials = (demoMobile) => {
    setMobile(demoMobile);
    toast.info(`Demo mobile number filled: ${demoMobile}`, { autoClose: 2000 });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-6">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
            <span className="text-white font-bold text-lg">RX</span>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-1">
            RationX Login
          </h2>
          <p className="text-gray-500 text-xs">
            {step === 1 ? 'Enter your mobile number to continue' : 'Enter OTP to verify your account'}
          </p>
        </div>

        {/* Demo Credentials Section */}
        {step === 1 && (
          <div className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3">
            <p className="text-xs font-semibold text-gray-700 mb-2 text-center">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => fillDemoCredentials('2222222222')}
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs py-2 px-3 rounded-lg transition-all duration-200 font-medium border border-blue-300 hover:shadow-sm"
              >
                👤 User: 2222222222
              </button>
              <button
                onClick={() => fillDemoCredentials('5555555555')}
                className="bg-green-100 hover:bg-green-200 text-green-700 text-xs py-2 px-3 rounded-lg transition-all duration-200 font-medium border border-green-300 hover:shadow-sm"
              >
                🏪 Dealer: 5555555555
              </button>
            </div>
          </div>
        )}

        {step === 1 ? (
          <>
            {/* STEP 1 = REQUEST OTP */}
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 bg-gray-50 placeholder-gray-400 text-sm"
                  placeholder="Enter 10-digit mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                  maxLength={10}
                />
              </div>

              <button
                type="submit"
                disabled={loading || timer > 0}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white p-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Sending OTP...</span>
                  </div>
                ) : timer > 0 ? (
                  `Resend OTP in ${timer}s`
                ) : (
                  "Get OTP"
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-600">
                Don't have an account?{" "}
                <Link 
                  to="/register" 
                  className="text-primary font-semibold hover:text-secondary transition-colors duration-300"
                >
                  Register here
                </Link>
              </p>
            </div>
          </>
        ) : (
          <>
            {/* STEP 2 = VERIFY OTP */}
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-gray-700 text-sm mb-1">
                  OTP sent to <strong className="text-primary">+91 {mobile}</strong>
                </p>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-primary hover:text-secondary font-medium transition-colors duration-300 flex items-center justify-center space-x-1 mx-auto"
                >
                  <span>↶</span>
                  <span>Change Number</span>
                </button>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Enter OTP
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-300 bg-gray-50 placeholder-gray-400 text-center text-base font-semibold tracking-widest"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-secondary to-emerald-600 text-white p-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Verifying...</span>
                  </div>
                ) : (
                  "Login to Account"
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-600">
                Don't have an account?{" "}
                <Link 
                  to="/register" 
                  className="text-primary font-semibold hover:text-secondary transition-colors duration-300"
                >
                  Register here
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;