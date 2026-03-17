import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { Trash2, ShoppingCart, RotateCcw, Diamond } from 'lucide-react';

const SelectionPage = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const isKerala = gameId === '4';
  const digitCount = isKerala ? 4 : 3;
  
  const [selectedBoard, setSelectedBoard] = useState('ALL');
  const [number, setNumber] = useState(Array(digitCount).fill(''));
  const [quantity, setQuantity] = useState(1);
  const [entries, setEntries] = useState([]);

  const handleNumberChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newNumber = [...number];
      newNumber[index] = value;
      setNumber(newNumber);
      if (value && index < digitCount - 1) {
        const nextInput = document.getElementById(`digit-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const addEntry = () => {
    if (number.some(n => n === '')) return;
    const entry = {
      id: Date.now(),
      num: number.join(''),
      board: selectedBoard,
      qty: quantity,
      price: selectedBoard === 'ALL' ? (isKerala ? 40 : 30) : 10
    };
    setEntries([entry, ...entries]);
    setNumber(Array(digitCount).fill(''));
    document.getElementById('digit-0')?.focus();
  };

  const generateRandom = () => {
    const randomNum = Array(digitCount).fill(0).map(() => Math.floor(Math.random() * 10).toString());
    setNumber(randomNum);
  };

  return (
    <PageWrapper title="DIAMOND JACKPOT LOTTERY" showNav={true}>
      <div className="bg-[#f9f9f9] min-h-screen">
        
        {/* Info Banner */}
        <div className="bg-[#fce4ec] py-3 px-4 shadow-sm border-b border-white/50 text-center mb-4">
           <p className="text-white bg-[#ff1c74] inline-block px-5 py-2 rounded-full text-[10px] font-black tracking-wide uppercase">
             Lot purchase time is open till 10:45 AM and Results...
           </p>
        </div>

        <div className="p-4 space-y-6">
          {/* Main Selection Card - Premium Style */}
          <div className="border-[2px] border-[#ff004d] rounded-3xl p-6 bg-white shadow-2xl relative overflow-hidden backdrop-blur-sm">
            <div className="flex gap-4 mb-6 border-b border-gray-100 pb-4">
              <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                  <Diamond size={32} className="text-white fill-white" />
              </div>
              <div className="flex-grow">
                 <h3 className="font-black text-2xl text-gray-900 tracking-tighter uppercase leading-tight">LOTTERY <span className="text-[#ff004d]">SELECTION</span></h3>
                 <p className="text-[#ff004d] font-black text-xl">₹ {isKerala ? '40.00' : '30.00'} <span className="text-xs opacity-60">/ Unit</span></p>
              </div>
              <button onClick={generateRandom} className="bg-gray-800 text-white text-[10px] px-4 py-2 rounded-xl h-fit font-black uppercase flex items-center gap-1.5 shadow-md active:scale-90 transition-transform">
                 <RotateCcw size={14} /> Random
              </button>
            </div>

            {/* Board Grid - Correct Circle Selectors */}
            <div className="flex flex-wrap gap-3 mb-8 justify-center">
              {['A', 'B', 'C', ...(isKerala ? ['D'] : []), 'ALL'].map(board => (
                <button 
                  key={board}
                  onClick={() => setSelectedBoard(board)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg transition-all border-[3px] shadow-sm ${
                    selectedBoard === board 
                      ? 'bg-[#ff004d] border-[#ff004d] text-white scale-110 shadow-[0_4px_12px_rgba(255,0,77,0.4)]' 
                      : 'bg-white border-gray-100 text-[#ff004d] hover:border-[#ff004d]/30'
                  }`}
                >
                  {board}
                </button>
              ))}
            </div>

            {/* Large Professional Number Inputs */}
            <div className="flex gap-3 justify-center py-6 mb-4">
              {number.map((digit, i) => (
                <input 
                  key={i}
                  id={`digit-${i}`}
                  type="text"
                  maxLength="1"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleNumberChange(i, e.target.value)}
                  className="w-16 h-18 border-[2.5px] border-gray-950 rounded-2xl text-center text-5xl font-black focus:border-[#ff004d] focus:ring-4 focus:ring-[#ff004d]/10 outline-none shadow-xl bg-[#fdfdfd] text-gray-900"
                  placeholder="-"
                />
              ))}
            </div>

            {/* Quantity Control Panel */}
            <div className="flex items-center justify-between bg-gray-950 p-4 rounded-2xl shadow-inner mb-8">
               <span className="text-xs font-black text-white/60 uppercase tracking-[0.2em] ml-2">Quantity</span>
               <div className="flex items-center overflow-hidden h-12 bg-white rounded-xl shadow-lg border border-white/20">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-gray-100 text-gray-900 px-5 font-black text-3xl active:bg-gray-300 transition-colors"
                  >-</button>
                  <div className="w-14 text-center font-black text-2xl text-gray-900">{quantity}</div>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-gray-100 text-gray-900 px-5 font-black text-3xl active:bg-gray-300 transition-colors"
                  >+</button>
               </div>
            </div>

            <button 
              onClick={addEntry} 
              className="w-full bg-[#ff004d] text-white py-5 rounded-2xl font-black text-2xl font-condensed tracking-widest uppercase shadow-[0_12px_30px_rgba(255,0,77,0.5)] active:scale-95 transition-all border-b-4 border-black/20"
            >
              ADD TO ENTRY
            </button>
          </div>

          {/* List of Entries - Enhanced UI */}
          <AnimatePresence>
            {entries.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border-[2px] border-[#ff004d]/20 rounded-3xl p-6 shadow-2xl mb-[120px]"
              >
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3">
                   <h4 className="font-black text-2xl text-gray-900 uppercase tracking-tighter">Your <span className="text-[#ff004d]">List</span></h4>
                   <span className="bg-gray-100 px-3 py-1 rounded-full text-[10px] font-black text-gray-500">{entries.length} ITEMS</span>
                </div>
                
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {entries.map((entry) => (
                    <div key={entry.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-3xl border border-gray-100 shadow-sm transition-all hover:bg-white hover:shadow-md">
                       <div className="flex items-center gap-4">
                         <div className="bg-[#ff004d] text-white w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg ring-4 ring-[#ff004d]/10">
                           {entry.num}
                         </div>
                         <div>
                           <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Board: {entry.board}</p>
                           <p className="text-base font-black text-gray-800 tracking-tight">{entry.qty} Units <span className="opacity-30">|</span> ₹{entry.price * entry.qty}</p>
                         </div>
                       </div>
                       <button onClick={() => setEntries(entries.filter(e => e.id !== entry.id))} className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm">
                         <Trash2 size={20} />
                       </button>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-gray-950 rounded-3xl shadow-2xl">
                   <div className="flex justify-between items-center mb-6">
                      <span className="text-white/60 font-black uppercase text-[10px] tracking-widest">Total Payable</span>
                      <span className="text-3xl font-black text-[#ff004d] drop-shadow-[0_0_10px_rgba(255,0,77,0.3)]">₹ {entries.reduce((sum, e) => sum + (e.price * e.qty), 0).toFixed(2)}</span>
                   </div>
                   <button 
                    onClick={() => navigate('/cart')}
                    className="w-full py-5 bg-[#ff004d] text-white rounded-2xl font-black text-2xl font-condensed tracking-widest uppercase flex items-center justify-center gap-3 shadow-[0_15px_35px_rgba(255,0,77,0.5)] active:scale-95 transition-all"
                  >
                    FINISH & PAY <ShoppingCart size={32} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SelectionPage;
