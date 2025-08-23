import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Briefcase, UserCircle2Icon } from 'lucide-react';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState("");
  const [roleOptions, setRoleOptions] = useState([]);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [signupPayload, setSignupPayload] = useState(null);
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");


  // Email validation regex
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  useEffect(() => {
    if (username.toLowerCase().includes('admin')) {
      setAccountType("OTHERS");
      setRoleOptions(["ADMIN"]);
    } else {
      setAccountType("");
      handleAccountTypeChange(accountType);
    }
  }, [username]);

  const handleAccountTypeChange = (type) => {
    setAccountType(type);
    switch (type) {
      case "PERSONAL":
        setRoleOptions(["STUDENT", "PARTICULAR"]);
        break;
      case "BUSINESS":
        setRoleOptions(["ACCOUNTANT","FINANCEANALYST"]);
        break;
      case "COMPANY":
        setRoleOptions([ "TREASURER","MANAGER"]);
        break;
      default:
        setRoleOptions([]);
    }
  };

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOtpByEmail = async (email, otpCode) => {
    try {
      const emailPayload = {
        recipient: email,
        subject: "Your Signup OTP",
        msgBody: `Hello ${username}, \n\nYour OTP for signup is: ${otpCode}\n\nThis OTP will expire in 10 minutes.`
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

    const formData = new FormData(e.target);
    const email = formData.get("email");

    // Validate email
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      setLoading(false);
      return;
    }

    const payload = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      userName: formData.get("userName"),
      password: formData.get("password"),
      userEmail: email,
      accountType: username.toLowerCase().includes('admin') ? "OTHERS" : accountType,
      role: username.toLowerCase().includes('admin') ? "ADMIN" : formData.get("role"),
    };

    // Generate and send OTP
    const otpCode = generateOTP();
    const otpSent = await sendOtpByEmail(email, otpCode);

    if (otpSent) {
      setUserEmail(email); // Set this where the email is processed, typically after OTP is sent.

      setGeneratedOtp(otpCode);
      setSignupPayload(payload);
      setShowOtpModal(true);
    } else {
      toast.error('Failed to send OTP. Please try again.');
    }

    setLoading(false);
  };

  const handleOtpVerification = async () => {
    if (otp === generatedOtp) {
      try {
        const response = await fetch('http://localhost:8080/user/saveUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signupPayload),
        });
  
        const result = await response.json();
  
        if (!response.ok) {
          toast.error(result.message || 'Signup failed!');
          return;
        }
  
        toast.success(result.message || 'Signup successful!');
        setShowOtpModal(false);
      } catch (err) {
        console.error('Error during signup:', err.message || err);
        toast.error('An error occurred. Please try again.');
      }
    } else {
      toast.error('Invalid OTP. Please try again.');
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <UserPlus className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <div className="mt-1">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <div className="mt-1">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User  className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="userName"
                  name="userName"
                  type="text"
                  required
                  className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
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
                  className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-indigo ```javascript
                  focus:border-indigo-500"
                />
              </div>
            </div>

            {!username.toLowerCase().includes('admin') && (
              <div>
                <label htmlFor="accountType" className="block text-sm font-medium text-gray-700">
                  Account Type
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="accountType"
                    name="accountType"
                    onChange={(e) => handleAccountTypeChange(e.target.value)}
                    required
                    className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select Account Type</option>
                    <option value="PERSONAL">Personal</option>
                    <option value="BUSINESS">Business</option>
                    <option value="COMPANY">Company</option>
                  </select>
                </div>
              </div>
            )}

            {!username.toLowerCase().includes('admin') && (
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <div className="mt-1">
                <UserCircle2Icon className="h-5 w-5 text-gray-400" />
                  <select
                    id="role"
                    name="role"
                    required
                    className="block w-full sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select Role</option>
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
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

export default Signup;