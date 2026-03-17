import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { ScrollText, Gavel, ShoppingCart } from 'lucide-react';
import BettingCard from '../components/BettingCard';
import { useCart } from '../context/CartContext';

const SelectionPage = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const { cart } = useCart();
  
  const isKerala = gameId === '4';
  const getGameName = () => isKerala ? 'Kerala Lottery' : 'Dear Lottery';

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
    <PageWrapper title="DIAMOND JACKPOT LOTTERY" showNav={true}>
      <div className="bg-[#f9f9f9] min-h-screen pb-24">
        <div className="bg-[#fce4ec] py-3 px-4 shadow-sm border-b border-white/50 text-center mb-4">
           <p className="text-white bg-[#ff1c74] inline-block px-5 py-2 rounded-full text-[10px] font-black tracking-wide uppercase">
             {isKerala ? 'Booking ends at 02:45 PM' : 'Booking ends 15 mins before draw'}
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

          <BettingCard title="Single Digit" winText="Win ₹ 100" price="11.00" digits={1} gameName={getGameName()} />
          <BettingCard title="Two Digits" winText="Win ₹ 1000" price="11.00" digits={2} gameName={getGameName()} />
          
          <BettingCard 
            title="Three Digits" 
            digits={3} 
            gameName={getGameName()} 
            priceOptions={abcTiers}
          />

          {isKerala && (
            <BettingCard 
              title="Four Digits" 
              digits={4} 
              gameName={getGameName()} 
              priceOptions={xabcTiers}
            />
          )}
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

export default SelectionPage;
