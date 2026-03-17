import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { ScrollText, Gavel, ShoppingCart } from 'lucide-react';

const JackpotPage = () => {
  const navigate = useNavigate();
  const [activeSlot, setActiveSlot] = useState('01.30 PM');

  const slots = [
    { time: '10.30 AM', status: 'closed' },
    { time: '11.30 AM', status: 'active' },
    { time: '12.30 PM', status: 'active' },
    { time: '01.30 PM', status: 'active' },
    { time: '03.30 PM', status: 'active' },
    { time: '05.30 PM', status: 'active' },
    { time: '06.30 PM', status: 'active' },
    { time: '07.30 PM', status: 'active' },
  ];

  const BettingSection = ({ title, winText, price, digits = 1, showBox = false }) => (
    <div className="border-[1.5px] border-red-500 rounded-2xl p-4 mb-6 bg-white shadow-xl relative overflow-hidden">
      <div className="flex gap-4 mb-5 border-b border-gray-100 pb-3">
        <img src="https://img.icons8.com/color/64/000000/treasure-chest.png" alt="Chest" className="w-14 h-14 drop-shadow-md" />
        <div className="flex-grow">
          <h3 className="text-gray-900 font-black text-lg leading-tight uppercase tracking-tight">
            {title} <span className="text-[#ff004d]">{winText}</span>
          </h3>
          <p className="text-[#ff004d] font-black text-xl">₹ {price}</p>
        </div>
        <button className="bg-gray-700 text-white text-[10px] px-3 py-1.5 rounded-lg h-fit font-black uppercase shadow-sm active:scale-95">Random</button>
      </div>

      <div className="space-y-5">
        {[1, 2, 3].map((row) => (
          <div key={row} className="flex items-center justify-between gap-2">
             <div className="flex gap-1.5 shrink-0">
                <div className="w-9 h-9 bg-[#ff004d] rounded-full flex items-center justify-center text-white font-black text-sm shadow-md">A</div>
                {digits >= 2 && <div className="w-9 h-9 bg-[#ff004d] rounded-full flex items-center justify-center text-white font-black text-sm shadow-md">B</div>}
                {digits >= 3 && <div className="w-9 h-9 bg-[#ff004d] rounded-full flex items-center justify-center text-white font-black text-sm shadow-md">C</div>}
             </div>
             
             <div className="flex gap-1 shrink-0">
                {Array(digits).fill(0).map((_, i) => (
                  <input key={i} type="text" className="w-9 h-9 border-[1.5px] border-gray-950 rounded-lg text-center text-xl font-black bg-white focus:border-[#ff004d] outline-none" placeholder="-" />
                ))}
             </div>

             <div className="flex items-center border-[1.5px] border-gray-700 rounded-lg overflow-hidden h-9 bg-gray-50">
                <button className="bg-gray-600 text-white px-2.5 font-black text-xl hover:bg-gray-700 active:bg-gray-800">-</button>
                <div className="w-9 text-center font-black text-lg text-gray-900">1</div>
                <button className="bg-gray-600 text-white px-2.5 font-black text-xl hover:bg-gray-700 active:bg-gray-800">+</button>
             </div>

             <div className="flex gap-1 shrink-0">
                {showBox && <button className="bg-[#ff004d] text-white px-3 py-2 rounded-lg font-black text-[11px] uppercase shadow-md active:scale-95">BOX</button>}
                <button className="bg-[#ff004d] text-white px-3 py-2 rounded-lg font-black text-[11px] uppercase shadow-md active:scale-95">ADD</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <PageWrapper title="DIAMOND JACKPOT LOTTERY" showNav={true}>
      <div className="bg-[#f9f9f9] min-h-screen">
        
        {/* Purchase Window Banner - Exact Image 2 */}
        <div className="bg-[#fce4ec] py-3 px-4 shadow-sm border-b border-white/50 text-center">
           <p className="text-white bg-[#ff1c74] inline-block px-5 py-2 rounded-full text-xs font-black tracking-wide uppercase drop-shadow-sm">
             Lot purchase time is open till 10:45 AM and Results...
           </p>
        </div>

        <div className="p-4">
          {/* Action Buttons - Top of Image 2 */}
          <div className="flex gap-4 mb-8">
             <button onClick={() => navigate('/rules')} className="flex-1 bg-[#ff004d] text-white py-3 rounded-xl flex items-center justify-center gap-2 font-black shadow-[0_8px_20px_rgba(255,0,77,0.25)] uppercase tracking-tight">
                <Gavel size={20} strokeWidth={3} /> Rules
             </button>
             <button onClick={() => navigate('/results')} className="flex-1 bg-[#ff004d] text-white py-3 rounded-xl flex items-center justify-center gap-2 font-black shadow-[0_8px_20px_rgba(255,0,77,0.25)] uppercase tracking-tight">
                <ScrollText size={20} strokeWidth={3} /> Results
             </button>
          </div>

          {/* Slots Grid - Exactly like Image 2 */}
          <div className="grid grid-cols-4 gap-3 mb-8">
            {slots.map((slot, idx) => (
              <div 
                key={idx}
                onClick={() => slot.status === 'active' && setActiveSlot(slot.time)}
                className={`border-[2px] rounded-2xl p-2.5 text-center transition-all cursor-pointer h-[70px] flex flex-col justify-center ${
                  slot.status === 'active' 
                    ? (activeSlot === slot.time ? 'border-[#ff004d] bg-[#fff0f5] shadow-lg ring-2 ring-[#ff004d]/10' : 'border-[#ff004d] bg-white shadow-sm hover:shadow-md') 
                    : 'border-gray-200 bg-gray-100 opacity-50 grayscale'
                }`}
              >
                <p className={`text-[12px] font-black leading-none mb-1 ${slot.status === 'active' ? 'text-red-500' : 'text-gray-500'}`}>{slot.time}</p>
                <p className={`text-[8px] font-black uppercase leading-tight ${slot.status === 'active' ? 'text-red-500' : 'text-gray-400'}`}>
                  {slot.status === 'active' ? 'Jackpot Lot' : 'Jackpot Lot closed'}
                </p>
              </div>
            ))}
          </div>

          {/* Betting Cards - Chest Icon Style */}
          <BettingSection title="Single Digit" winText="Win ₹ 100" price="11.00" digits={1} />
          <BettingSection title="Double Digits" winText="Win ₹ 1000" price="11.00" digits={2} />
          <BettingSection title="Three Digits" winText="Win ₹ 10,000" price="0.00" digits={3} showBox={true} />
          <BettingSection title="Three Digits" winText="Win ₹ 15,000" price="28.00" digits={3} showBox={true} />
          <BettingSection title="Three Digits" winText="Win ₹ 30,000" price="55.00" digits={3} showBox={true} />
        </div>

        {/* Static Pay Now Button at bottom of scroll (matches Image 2 and mobile standard) */}
        <div className="px-4 pb-10">
           <button 
             onClick={() => navigate('/cart')}
             className="w-full bg-[#ff004d] text-white py-4.5 rounded-2xl flex items-center justify-center gap-2 font-black text-2xl shadow-[0_12px_30px_rgba(255,0,77,0.4)] active:scale-95 transition-all uppercase tracking-widest font-condensed"
           >
             <ShoppingCart size={28} strokeWidth={3} /> Pay now
           </button>
        </div>

        <div className="h-20"></div>
      </div>
    </PageWrapper>
  );
};

export default JackpotPage;
