import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { ScrollText, Gavel, ShoppingCart, Lock } from 'lucide-react';
import BettingCard from '../components/BettingCard';
import { useCart } from '../context/CartContext';

const SelectionPage = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const { cart } = useCart();
  
  const isKerala = gameId === '4';
  const getGameName = () => isKerala ? 'Kerala Lottery' : 'Dear Lottery';
  
  const gameTimes = {
    '1': '01:00 PM',
    '2': '06:00 PM',
    '3': '08:00 PM',
    '4': '03:00 PM'
  };

  const isClosed = (drawTime) => {
    if (!drawTime) return false;
    const now = new Date();
    const parts = drawTime.match(/(\d+)[.:](\d+)\s*(AM|PM)/);
    if (!parts) return true;
    
    let hours = parseInt(parts[1]);
    const minutes = parseInt(parts[2]);
    const ampm = parts[3];
    
    if (ampm === 'PM' && hours !== 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    
    const drawDate = new Date();
    drawDate.setHours(hours, minutes, 0, 0);
    
    const diffInMinutes = (drawDate - now) / (1000 * 60);
    return diffInMinutes <= 15;
  };

  const closed = isClosed(gameTimes[gameId]);

  const abcTiers = [
    { price: "12.00", win: "₹ 6250, 250, 25" },
    { price: "28.00", win: "₹ 15000, 500, 50" },
    { price: "30.00", win: "₹ 17500, 500, 50" },
    { price: "55.00", win: "₹ 30000, 1000, 100" },
    { price: "60.00", win: "₹ 35000, 1000, 100" },
  ];

  if (isKerala) {
    abcTiers.push(
      { price: "33.00", win: "₹ 20000, 500, 50" },
      { price: "65.00", win: "₹ 40000, 1000, 100" }
    );
  }

  const xabcTiers = [
    { price: "20.00", win: "₹ 100000" },
    { price: "50.00", win: "₹ 250000, 5000, 500, 50" },
    { price: "100.00", win: "₹ 500000, 10000, 1000, 100" },
  ];

  return (
    <PageWrapper title={getGameName().toUpperCase()} showNav={true}>
      <div className="bg-[#f9f9f9] min-h-screen">
        <div className={`py-3 px-4 shadow-sm border-b border-white/50 text-center mb-4 ${closed ? 'bg-red-600' : 'bg-[#fce4ec]'}`}>
           <p className="text-white inline-block px-5 py-2 rounded-full text-[10px] font-black tracking-wide uppercase">
             {closed ? 'BOOKING CLOSED FOR THIS DRAW' : (isKerala ? 'Booking ends at 02:45 PM' : 'Booking ends 15 mins before draw')}
           </p>
        </div>

        <div className={`p-4 pb-28 ${closed ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex gap-4 mb-8">
             <button onClick={() => navigate('/rules')} className="flex-1 bg-[#ff004d] text-white py-3 rounded-xl flex items-center justify-center gap-2 font-black shadow-lg uppercase tracking-tight">
                <Gavel size={20} /> Rules
             </button>
             <button onClick={() => navigate('/results')} className="flex-1 bg-[#ff004d] text-white py-3 rounded-xl flex items-center justify-center gap-2 font-black shadow-lg uppercase tracking-tight">
                <ScrollText size={20} /> Results
             </button>
          </div>

          <BettingCard 
            title="Single Digit" 
            winText="₹ 100" 
            price="11.00" 
            gameName={getGameName()} 
            customRows={[
              { labels: ['A'], digits: 1 },
              { labels: ['B'], digits: 1 },
              { labels: ['C'], digits: 1 }
            ]}
          />

          <BettingCard 
            title="Double Digits" 
            winText="₹ 1000" 
            price="11.00" 
            gameName={getGameName()} 
            customRows={[
              { labels: ['A', 'B'], digits: 2 },
              { labels: ['B', 'C'], digits: 2 },
              { labels: ['A', 'C'], digits: 2 }
            ]}
          />
          
          <BettingCard 
            title="Three Digits" 
            digits={3} 
            gameName={getGameName()} 
            priceOptions={abcTiers}
          />

          {isKerala && (
            <BettingCard 
              title="4D XABC" 
              digits={4} 
              gameName={getGameName()} 
              priceOptions={xabcTiers}
            />
          )}
        </div>

        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-4 bg-transparent z-50">
           <button 
             onClick={() => navigate('/cart')}
             disabled={closed}
             className={`w-full text-white py-4 rounded-xl flex items-center justify-center gap-2 font-black text-xl shadow-xl relative ${closed ? 'bg-gray-400' : 'bg-[#ff0055]'}`}
           >
             <ShoppingCart size={24} /> {closed ? 'Closed' : 'Pay now'}
             {cart.length > 0 && !closed && (
                <span className="absolute -top-2 -right-2 bg-black text-white w-7 h-7 rounded-full text-[12px] flex items-center justify-center border-2 border-white font-black animate-bounce">{cart.length}</span>
             )}
           </button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SelectionPage;
