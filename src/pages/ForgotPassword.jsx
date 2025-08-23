import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Mail } from 'lucide-react';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const [userIdentifier, setUserIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
      const [loading, setLoading] = useState(false);
     

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOtpByEmail = async (email, username) => {
    const otpCode = generateOTP();
    setGeneratedOtp(otpCode);

    try {
      const emailPayload = {
        recipient: email,
        subject: "Password Reset OTP",
        msgBody: `Hello ${username},\n\nYour OTP for password reset is: ${otpCode}\n\nThis OTP is valid for 10 minutes.`
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

  const handleIdentifierSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading when the request begins
    try {
      const response = await fetch('/user/verify-identifier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userIdentifier }),
      });
  
      if (response.ok) {
        const userData = await response.json();
        
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
        const errorText = await response.text();
        toast.error(errorText || 'User not found');
      }
    } catch (err) {
      console.error('Error during forgot password:', err);
      toast.error('An error occurred. Please try again later.');
    } finally {
      setLoading(false); // Set loading to false once the request is complete
    }
  };
  
  

  const handleOtpVerification = (e) => {
    e.preventDefault();

    if (otp === generatedOtp) {
      setOtpVerified(true);
      setShowOtpModal(false);
      toast.success('OTP verified successfully!');
    } else {
      toast.error('Invalid OTP. Please try again.');
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match. Please try again.');
      return;
    }

    try {
      const response = await fetch('/user/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: userEmail, 
          newPassword 
        }),
      });

      if (response.ok) {
        toast.success('Password reset successful!');
        // Optionally redirect to login page
      } else {
        const errorText = await response.text();
        toast.error(errorText || 'Failed to reset password');
      }
    } catch (err) {
      console.error('Error during password reset:', err);
      toast.error('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <KeyRound className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {!otpVerified ? (
            <form onSubmit={handleIdentifierSubmit}>
              <div>
                <label htmlFor="userIdentifier" className="block text-sm font-medium text-gray-700">
                  Username or Email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="userIdentifier"
                    name="userIdentifier"
                    type="text"
                    required
                    className="block w-full sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    value={userIdentifier}
                    onChange={(e) => setUserIdentifier(e.target.value)}
                  />
                </div>
              </div>
              <div>
              <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={loading}
                  >
                    {loading ? 'Checking...' : 'Reset Password'}
                  </button>
              </div>
            </form>
          ) : (
            <>
             
              {otpVerified && (
  <form onSubmit={handlePasswordReset} className="space-y-6">
    <h3 className="text-xl font-semibold text-gray-900">Reset Password</h3>
    <div>
      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
        New Password
      </label>
      <input
        id="newPassword"
        name="newPassword"
        type="password"
        className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
    </div>
    <div>
      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
        Confirm Password
      </label>
      <input
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
    </div>
    <button
      type="submit"
      className="w-full bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      Reset Password
    </button>
  </form>
)}

            </>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Remember your password?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to sign in
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
        autoClose={ 3000}
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

export default ForgotPassword;