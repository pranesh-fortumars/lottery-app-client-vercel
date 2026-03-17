import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    referral: ''
  });

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto border-x border-gray-100 bg-white w-full">
      {/* BEGIN: MainHeader */}
      <header className="bg-[#ff1a66] text-white py-4 px-4 flex items-center justify-between sticky top-0 z-10 shadow-md">
        <div className="flex items-center gap-2">
          {/* Home Icon */}
          <svg className="h-8 w-8 cursor-pointer" fill="currentColor" viewBox="0 0 20 20" onClick={() => navigate('/home')}>
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
          </svg>
          <h1 className="text-xl font-black tracking-tight uppercase font-condensed">Diamond Agency Signup</h1>
        </div>
        {/* User Icon */}
        <svg className="h-8 w-8 cursor-pointer" fill="currentColor" viewBox="0 0 20 20" onClick={() => navigate('/profile')}>
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
        </svg>
      </header>
      {/* END: MainHeader */}

      {/* BEGIN: SignupForm */}
      <main className="flex-grow px-6 pt-8 pb-12">
        <form action="#" className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {/* Name Input */}
          <div className="flex border rounded overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.075)]">
            <div className="bg-[#e9ecef] px-4 flex items-center border-r border-gray-300">
              <svg className="h-5 w-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
              </svg>
            </div>
            <input 
              className="w-full border-none focus:ring-0 py-3 text-lg text-gray-700 placeholder-gray-500 bg-white" 
              placeholder="Enter your name" 
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          {/* Mobile Number Input */}
          <div className="flex border rounded overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.075)]">
            <div className="bg-[#e9ecef] px-3 flex items-center border-r border-gray-300 font-bold text-gray-700">
              +91
            </div>
            <input 
              className="w-full border-none focus:ring-0 py-3 text-lg text-gray-700 placeholder-gray-500 bg-white" 
              placeholder="Enter your mobile number" 
              type="tel"
              value={formData.mobile}
              onChange={(e) => setFormData({...formData, mobile: e.target.value})}
            />
          </div>
          {/* Referral Code Input */}
          <div className="flex border rounded overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.075)]">
            <div className="bg-[#e9ecef] px-4 flex items-center border-r border-gray-300">
              <svg className="h-5 w-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
              </svg>
            </div>
            <input 
              className="w-full border-none focus:ring-0 py-3 text-lg text-gray-700 placeholder-gray-500 bg-[#eef2f3]" 
              placeholder="Enter refferal code" 
              type="text"
              value={formData.referral}
              onChange={(e) => setFormData({...formData, referral: e.target.value})}
            />
          </div>
          {/* Large OTP Button */}
          <div className="pt-4">
            <button className="w-full bg-[#ff0000] text-white font-bold py-4 rounded-xl text-xl uppercase tracking-wider shadow-[0_2px_4px_rgba(0,0,0,0.2)] active:scale-[0.98] transition-transform font-condensed" type="button">
              Get OTP
            </button>
          </div>
          {/* Secondary Action Buttons */}
          <div className="flex gap-4 pt-2">
            <button 
              className="flex-1 bg-[#ff0000] text-white font-bold py-3 rounded-xl uppercase shadow-[0_2px_4px_rgba(0,0,0,0.2)] active:scale-[0.98] transition-transform font-condensed" 
              type="button"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button 
              className="flex-[2] bg-[#ff0000] text-white font-bold py-3 rounded-xl uppercase shadow-[0_2px_4px_rgba(0,0,0,0.2)] active:scale-[0.98] transition-transform font-condensed" 
              type="button"
              onClick={() => navigate('/reset-password')}
            >
              Reset Password
            </button>
          </div>
        </form>
      </main>
      {/* END: SignupForm */}

      {/* BEGIN: MainFooter */}
      <footer className="bg-[#ff1a66] text-white w-full">
        {/* Footer Tagline */}
        <div className="py-3 text-center border-b border-pink-400">
          <h2 className="text-xl font-bold uppercase tracking-tight font-condensed">India's Largest Prizes Agency</h2>
        </div>
        {/* Navigation Icons */}
        <nav className="flex justify-around py-4 px-6">
          {/* Home */}
          <a className="hover:opacity-80 cursor-pointer" onClick={() => navigate('/home')}>
            <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
            </svg>
          </a>
          {/* Hammer/Auction */}
          <a className="hover:opacity-80 cursor-pointer" onClick={() => navigate('/rules')}>
            <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3.47 18.23l7.07-7.07 2.35 2.35-7.07 7.07c-.4.4-1.04.4-1.44 0l-.91-.91a1.02 1.02 0 010-1.44zm11.45-12.79c.4-.4 1.04-.4 1.44 0l4.33 4.33c.4.4.4 1.04 0 1.44l-1.31 1.31-5.77-5.77 1.31-1.31z"></path>
            </svg>
          </a>
          {/* Results/Scroll */}
          <a className="hover:opacity-80 cursor-pointer" onClick={() => navigate('/results')}>
            <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21,11V10a2,2,0,0,0-2-2H17V3a1,1,0,0,0-1-1H4A2,2,0,0,0,2,4V21a1,1,0,0,0,1,1H19a2,2,0,0,0,2-2V13A2,2,0,0,1,21,11ZM4,4H15V8H5A1,1,0,0,0,4,9v2H4ZM19,20H4V13H19ZM19,11a1,1,0,0,0-1,1h0a1,1,0,0,0,1,1,1,1,0,0,1,1,1v4a1,1,0,0,1-1,1H5V11H19Z"></path>
            </svg>
          </a>
          {/* Cart */}
          <a className="hover:opacity-80 cursor-pointer" onClick={() => navigate('/cart')}>
            <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 100-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
            </svg>
          </a>
        </nav>
      </footer>
      {/* END: MainFooter */}
    </div>
  );
};

export default SignupPage;
