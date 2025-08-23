import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [loginPayload, setLoginPayload] = useState({
    userIdentifier: "",
    password: ""
  });
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginPayload(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const sendOtpByEmail = async (email, username) => {
    const otpCode = generateOTP();
    setGeneratedOtp(otpCode);

    try {
      const emailPayload = {
        recipient: email,
        subject: "Login OTP Verification",
        msgBody: `Hello ${username},\n\nYour OTP for login is: ${otpCode}\n\nThis OTP will expire in 10 minutes.`
      };

      const response = await fetch('http://localhost:8080/sendMail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailPayload),
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending OTP:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if user exists and get email
      const identifierResponse = await fetch('http://localhost:8080/user/verify-identifier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          userIdentifier: loginPayload.userIdentifier,
          password: loginPayload.password,
          isLogin: true
        }),
      });

      if (identifierResponse.ok) {
        const userData = await identifierResponse.json();
        
        // Send OTP to user's email
        const otpSent = await sendOtpByEmail(userData.email, userData.userName);
        
        if (otpSent) {
          setUserEmail(userData.email);
          setUserName(userData.userName);
          setShowOtpModal(true);
          toast.info('OTP sent to your email');
        } else {
          toast.error('Failed to send OTP');
        }
      } else {
        const errorText = await identifierResponse.text();
        toast.error(errorText || 'Invalid Credentials!');
      }
    } catch (err) {
      console.error('Error during login:', err);
      toast.error('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async () => {
    if (otp === generatedOtp) {
      try {
        // Final login verification
        const loginResponse = await fetch('http://localhost:8080/user/confirm-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userEmail,
            password: loginPayload.password
          }),
        });

        if (loginResponse.ok) {
            const userDetailsResponse = await fetch(`http://localhost:8080/user/getUserByEmail/${userEmail}`);
                if (userDetailsResponse.ok) {
                    const userData = await userDetailsResponse.json();
                    login(userData); 
                    
                    switch(userData.role) {
                        case 'ADMIN':
                            navigate('/admin-dashboard');
                            break;
                        case 'STUDENT':
                        case 'PARTICULAR':
                            navigate('/dashboard');
                            break;
                        case 'ACCOUNTANT':
                        case 'FINANCEANALYST':
                            navigate('/dashboard');
                            break;
                            case 'TREASURER':
                            case 'MANAGER':
                                navigate('/dashboard');
                                break;    
                        default:
                            navigate('');
                    }
                    toast.success('Login successful!');
                } else {
                    toast.error('Could not fetch user details');
                }
            } else {
              const errorText = await loginResponse.text();
              toast.error(errorText || 'Login failed');
            }
          } catch (err) {
            console.error('Error during final login:', err);
            toast.error('An error occurred. Please try again later.');
          }
        } else {
          toast.error('Invalid OTP. Please try again.');
        }
        setShowOtpModal(false);
      };

return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="flex justify-center">
              <LogIn className="h-12 w-12 text-indigo-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="userIdentifier" className="block text-sm font-medium text-gray-700">
                    Username or Email
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="userIdentifier"
                      name="userIdentifier"
                      type="text"
                      required
                      className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter your username or email"
                      value={loginPayload.userIdentifier}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter your password"
                      value={loginPayload.password}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={loading}
                  >
                    {loading ? 'Checking...' : 'Sign in'}
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    to="/signup"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {showOtpModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
      <h3 className="text-2xl font-semibold mb-4">Enter OTP</h3>
      <p className="text-gray-600 mb-6">An OTP has been sent to your email: {userEmail}</p>
      <input
        type="text"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        maxLength={6}
      />
      <div className="flex justify-between gap-4">
        <button
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          onClick={handleOtpVerification}
        >
          Verify OTP
        </button>
        <button
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:outline-none"
          onClick={() => setShowOtpModal(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

          <ToastContainer 
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                />
        </div>
      );
    };

export default Login;