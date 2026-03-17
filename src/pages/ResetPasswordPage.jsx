import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans max-w-md mx-auto w-full">
      {/* BEGIN: MainHeader */}
      <header className="bg-[#e91e63] p-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          {/* Home Icon */}
          <svg className="h-8 w-8 text-white cursor-pointer" fill="currentColor" viewBox="0 0 24 24" onClick={() => navigate('/home')}>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
          </svg>
          <h1 className="text-white text-xl font-black uppercase tracking-wider font-condensed">DIAMOND RESET PASSWORD</h1>
        </div>
        {/* User Icon */}
        <div className="text-white cursor-pointer" onClick={() => navigate('/profile')}>
          <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
          </svg>
        </div>
      </header>
      {/* END: MainHeader */}

      {/* BEGIN: ResetPasswordForm */}
      <main className="flex-grow flex flex-col items-center px-4 py-8">
        {/* Mobile Number Input Group */}
        <div className="w-full max-w-md mb-4">
          <div className="flex border border-[#ced4da] rounded overflow-hidden h-12">
            <div className="bg-[#e9ecef] px-4 flex items-center justify-center border-r border-[#ced4da] text-gray-700 font-semibold">
              +91
            </div>
            <input 
              className="flex-grow px-3 py-2 border-none focus:ring-0 text-gray-600 placeholder:text-gray-400" 
              placeholder="Enter your mobile number" 
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
        </div>
        {/* Get OTP Button */}
        <button className="w-full max-w-md bg-[#ff0000] text-white py-3 font-black uppercase tracking-wider text-lg rounded mb-6 hover:bg-red-700 transition-colors font-condensed">
          GET OTP
        </button>
        {/* OTP Input Group */}
        <div className="w-full max-w-md mb-4">
          <div className="flex border border-[#ced4da] rounded overflow-hidden h-12">
            <div className="bg-[#e9ecef] px-4 flex items-center justify-center border-r border-[#ced4da]">
              {/* Padlock Icon */}
              <svg className="h-5 w-5 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
              </svg>
            </div>
            <input 
              className="flex-grow px-3 py-2 border-none focus:ring-0 text-gray-600 placeholder:text-gray-400" 
              placeholder="Enter OTP here" 
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
        </div>
        {/* Confirm OTP Button */}
        <button className="w-full max-w-md bg-[#ff0000] text-white py-3 font-black uppercase tracking-wider text-lg rounded hover:bg-red-700 transition-colors font-condensed">
          CONFIRM OTP
        </button>
      </main>
      {/* END: ResetPasswordForm */}

      {/* BEGIN: MainFooter */}
      <footer className="bg-[#e91e63] text-white w-full py-4 flex flex-col items-center">
        <div className="mb-4">
          <h2 className="font-black uppercase tracking-wider text-lg font-condensed">INDIA'S LARGEST PRIZES AGENCY</h2>
        </div>
        {/* Footer Navigation Icons */}
        <nav className="flex items-center justify-around w-full max-w-sm px-4">
          {/* Home Icon */}
          <a className="hover:opacity-80 cursor-pointer" onClick={() => navigate('/home')}>
            <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
            </svg>
          </a>
          {/* Gavel/Hammer Icon */}
          <a className="hover:opacity-80 cursor-pointer" onClick={() => navigate('/rules')}>
            <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 16.5c0 .38-.21.71-.53.88l-7.97 4.44c-.31.17-.69.17-1 0l-7.97-4.44C3.21 17.21 3 16.88 3 16.5v-9c0-.38.21-.71.53-.88l7.97-4.44c.31-.17.69-.17 1 0l7.97 4.44c.32.17.53.5.53.88v9z"></path>
              <path d="M12 22v-9" stroke="white" strokeWidth="2"></path>
            </svg>
          </a>
          {/* Result/Paper Icon */}
          <a className="hover:opacity-80 cursor-pointer" onClick={() => navigate('/results')}>
            <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"></path>
            </svg>
          </a>
          {/* Shopping Cart Icon */}
          <a className="hover:opacity-80 cursor-pointer" onClick={() => navigate('/cart')}>
            <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path>
            </svg>
          </a>
        </nav>
      </footer>
      {/* END: MainFooter */}
    </div>
  );
};

export default ResetPasswordPage;
