import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <div className="bg-white min-h-screen flex flex-col max-w-md mx-auto shadow-lg overflow-hidden w-full">
      {/* BEGIN: MainHeader */}
      <header className="bg-[#f42464] p-3 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          {/* Home Icon */}
          <svg className="h-8 w-8 cursor-pointer" fill="currentColor" viewBox="0 0 24 24" onClick={() => navigate('/home')}>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
          </svg>
          <h1 className="text-xl font-condensed font-black italic tracking-tighter">DIAMOND LOGIN</h1>
        </div>
        {/* User Profile Icon */}
        <div onClick={() => navigate('/profile')} className="cursor-pointer">
          <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
          </svg>
        </div>
      </header>
      {/* END: MainHeader */}

      {/* BEGIN: LoginContainer */}
      <main className="flex-grow p-4 mt-4">
        <form className="space-y-4" onSubmit={handleLogin}>
          {/* Phone Number Input Group */}
          <div className="flex border border-[#cccccc] rounded overflow-hidden">
            <div className="bg-[#f2f2f2] px-4 py-3 border-r border-[#cccccc] text-gray-700 font-bold">
              +91
            </div>
            <input 
              className="flex-grow p-3 outline-none border-none focus:ring-0 text-sm font-serif" 
              placeholder="Enter your mobile number" 
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
          {/* Password Input Group */}
          <div className="flex border border-[#cccccc] rounded overflow-hidden">
            <div className="bg-[#f2f2f2] px-4 py-3 border-r border-[#cccccc] flex items-center justify-center">
              {/* Lock Icon */}
              <svg className="h-4 w-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"></path>
              </svg>
            </div>
            <input 
              className="flex-grow p-3 outline-none border-none focus:ring-0 text-sm font-serif" 
              placeholder="Enter your password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/* Action Buttons */}
          <div className="pt-4 space-y-4">
            {/* Main Submit Button */}
            <button className="w-full bg-[#ff0000] text-white py-3 rounded-lg font-condensed font-black text-lg uppercase tracking-wider shadow-sm hover:opacity-90 active:scale-95 transition-transform" type="submit">
              Confirm Login
            </button>
            {/* Secondary Buttons */}
            <div className="flex gap-3">
              <button 
                className="flex-1 bg-[#ff0000] text-white py-3 rounded-lg font-condensed font-black text-sm uppercase tracking-wider hover:opacity-90" 
                type="button"
                onClick={() => navigate('/signup')}
              >
                Signup
              </button>
              <button 
                className="flex-[2] bg-[#ff0000] text-white py-3 rounded-lg font-condensed font-black text-sm uppercase tracking-wider hover:opacity-90" 
                type="button"
                onClick={() => navigate('/reset-password')}
              >
                Reset Password
              </button>
            </div>
          </div>
        </form>
      </main>
      {/* END: LoginContainer */}

      {/* BEGIN: Footer */}
      <footer className="mt-auto">
        {/* Footer Slogan Bar */}
        <div className="bg-[#f42464] py-3 text-center">
          <h2 className="text-white text-lg font-condensed font-black tracking-normal">INDIA'S LARGEST PRIZES AGENCY</h2>
        </div>
        {/* Footer Navigation Icons */}
        <nav className="bg-[#f42464] pt-2 pb-6 px-10 flex justify-between items-center text-white border-t border-white/20">
          {/* Home Icon */}
          <a className="hover:scale-110 transition-transform cursor-pointer" onClick={() => navigate('/home')}>
            <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
            </svg>
          </a>
          {/* Hammer/Gavel Icon */}
          <a className="hover:scale-110 transition-transform cursor-pointer" onClick={() => navigate('/rules')}>
            <svg className="h-10 w-10" fill="currentColor" style={{ transform: 'rotate(45deg)' }} viewBox="0 0 24 24">
              <path d="M21.71 5.29l-3-3a1 1 0 0 0-1.42 0L13 6.59l3.41 3.41 4.3-4.3a1 1 0 0 0 0-1.41zM11.59 8l-3.41-3.41-4.3 4.3a1 1 0 0 0 0 1.41l3 3a1 1 0 0 0 1.42 0L11.59 8zM3.41 13.59l4 4 11.59-11.59-4-4L3.41 13.59z"></path>
              <path d="M1 21a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4.59l-4-4V21z"></path>
            </svg>
          </a>
          {/* Result/Scroll Icon */}
          <a className="hover:scale-110 transition-transform cursor-pointer" onClick={() => navigate('/results')}>
            <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H6V4h12v16zM8 15h8v2H8v-2zm0-4h8v2H8v-2zm0-4h8v2H8V7z"></path>
            </svg>
          </a>
          {/* Cart Icon */}
          <a className="hover:scale-110 transition-transform cursor-pointer" onClick={() => navigate('/cart')}>
            <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path>
            </svg>
          </a>
        </nav>
      </footer>
      {/* END: Footer */}
    </div>
  );
};

export default LoginPage;
