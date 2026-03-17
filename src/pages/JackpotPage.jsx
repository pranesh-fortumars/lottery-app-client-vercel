import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { ScrollText, Gavel, ShoppingCart } from 'lucide-react';
import BettingCard from '../components/BettingCard';
import { useCart } from '../context/CartContext';

const JackpotPage = () => {
  const navigate = useNavigate();
  const [activeSlot, setActiveSlot] = useState('11.30 AM');
  const { cart } = useCart();

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

  const abcTiers = [
    { price: "0.00", win: "₹ 10000, 1000" },
    { price: "12.00", win: "₹ 6250, 250, 25" },
    { price: "28.00", win: "₹ 15000, 500, 50" },
    { price: "30.00", win: "₹ 17500, 500, 50" },
    { price: "55.00", win: "₹ 30000, 1000, 100" },
    { price: "60.00", win: "₹ 35000, 1000, 100" },
  ];

  return (
    <PageWrapper title="DIAMOND JACKPOT LOTTERY" showNav={true}>
      <div className="bg-[#f9f9f9] min-h-screen pb-24">
        <div className="bg-[#fce4ec] py-3 px-4 shadow-sm border-b border-white/50 text-center mb-4">
           <p className="text-white bg-[#ff1c74] inline-block px-5 py-2 rounded-full text-[10px] font-black tracking-wide uppercase">
             Jackpot lot purchase open till 15 mins before draw
           </p>
        </div>

        <div className="p-4">
          <div className="flex gap-4 mb-8">
             <button onClick={() => navigate('/rules')} className="flex-1 bg-[#ff004d] text-white py-3 rounded-xl flex items-center justify-center gap-2 font-black shadow-[0_8px_20px_rgba(255,0,77,0.25)] uppercase tracking-tight">
                <Gavel size={20} /> Rules
             </button>
             <button onClick={() => navigate('/results')} className="flex-1 bg-[#ff004d] text-white py-3 rounded-xl flex items-center justify-center gap-2 font-black shadow-[0_8px_20px_rgba(255,0,77,0.25)] uppercase tracking-tight">
                <ScrollText size={20} /> Results
             </button>
          </div>

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
                  {slot.status === 'active' ? 'Active' : 'Closed'}
                </p>
              </div>
            ))}
          </div>

          <BettingCard title="Single Digit" winText="Win ₹ 100" price="11.00" digits={1} gameName="Jackpot" />
          <BettingCard title="Two Digits" winText="Win ₹ 1000" price="11.00" digits={2} gameName="Jackpot" />
          <BettingCard 
            title="Three Digits" 
            digits={3} 
            gameName="Jackpot" 
            priceOptions={abcTiers}
          />
        </div>

        <div className="fixed bottom-0 w-full max-w-[480px] p-4 bg-white/50 backdrop-blur-sm z-50">
           <button 
             onClick={() => navigate('/cart')}
             className="w-full bg-[#ff0055] text-white py-4 rounded-xl flex items-center justify-center gap-2 font-black text-xl shadow-[0_8px_30px_rgba(255,0,85,0.4)] relative"
           >
             <ShoppingCart size={24} /> Pay now
             {cart.length > 0 && (
               <span className="absolute -top-2 -right-2 bg-black text-white w-6 h-6 rounded-full text-[10px] flex items-center justify-center border-2 border-white">{cart.length}</span>
             )}
           </button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default JackpotPage;
