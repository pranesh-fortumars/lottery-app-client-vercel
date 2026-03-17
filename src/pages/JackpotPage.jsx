import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, User, Minus, Plus, ShoppingCart, Clock, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';

const CountdownTimer = ({ drawTime, onStatusChange }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const parts = drawTime.match(/(\d+):(\d+)\s*(AM|PM)/);
      if (!parts) return;
      
      let hours = parseInt(parts[1]);
      const minutes = parseInt(parts[2]);
      const ampm = parts[3];
      
      if (ampm === 'PM' && hours !== 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      
      const drawDate = new Date();
      drawDate.setHours(hours, minutes, 0, 0);

      const diff = drawDate - now;
      
      if (diff <= 10 * 60 * 1000) {
        setIsClosed(true);
        setTimeLeft('Closed');
        onStatusChange && onStatusChange(true);
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
      setIsClosed(false);
      onStatusChange && onStatusChange(false);
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [drawTime, onStatusChange]);

  return (
    <div style={{ fontSize: '0.65rem', fontWeight: 'bold' }}>
      {timeLeft}
    </div>
  );
};

const JackpotPage = () => {
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState('01:00 PM');
  const [slotStatus, setSlotStatus] = useState({});

  const timeSlots = [
    { time: '01:00 PM', label: 'Dear Lottery' },
    { time: '06:00 PM', label: 'Dear Lottery' },
    { time: '08:00 PM', label: 'Dear Lottery' }
  ];

  // Selection states
  const [singleDigits, setSingleDigits] = useState({ A: '', B: '', C: '', qtyA: 1, qtyB: 1, qtyC: 1 });
  
  const handleQtyChange = (board, delta) => {
    const key = `qty${board}`;
    setSingleDigits(prev => ({ ...prev, [key]: Math.max(1, prev[key] + delta) }));
  };

  const handleRandom = () => {
    setSingleDigits(prev => ({
      ...prev,
      A: Math.floor(Math.random() * 10).toString(),
      B: Math.floor(Math.random() * 10).toString(),
      C: Math.floor(Math.random() * 10).toString(),
    }));
  };

  return (
    <PageWrapper>
      <header className="main-header">
        <div className="flex items-center gap-2">
          <Home size={24} onClick={() => navigate('/home')} className="cursor-pointer" />
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '1.4rem', letterSpacing: '1px' }}>DIAMOND JACKPOT LOTTERY</h1>
        </div>
        <User size={24} />
      </header>

      <div className="info-bar">
        Draw before 10 minutes of draw/result.
      </div>

      {/* Rules/Results Buttons */}
      <div className="flex gap-4 p-4">
        <button 
          className="btn-primary-red flex items-center justify-center gap-2" 
          style={{ fontSize: '1rem', padding: '10px' }}
          onClick={() => navigate('/rules')}
        >
          <Clock size={20} /> Rules
        </button>
        <button 
          className="btn-primary-red flex items-center justify-center gap-2" 
          style={{ fontSize: '1rem', padding: '10px' }}
          onClick={() => navigate('/results')}
        >
          <Trophy size={20} /> Results
        </button>
      </div>

      {/* Slots Section */}
      <div className="flex justify-between px-4 mb-6">
        {timeSlots.map((slot, idx) => (
          <div 
            key={idx} 
            className={`slot-card cursor-pointer ${selectedSlot === slot.time ? 'bg-pink-100' : ''}`}
            onClick={() => !slotStatus[slot.time] && setSelectedSlot(slot.time)}
            style={{ 
              borderColor: slotStatus[slot.time] ? '#ccc' : (selectedSlot === slot.time ? '#ff2056' : '#ff0000'),
              opacity: slotStatus[slot.time] ? 0.6 : 1
            }}
          >
            <div className="slot-time">{slot.time}</div>
            <div className="slot-label">{slot.label}</div>
            <CountdownTimer 
              drawTime={slot.time} 
              onStatusChange={(closed) => setSlotStatus(prev => ({...prev, [slot.time]: closed}))} 
            />
          </div>
        ))}
      </div>

      {/* Game Cards */}
      <div className="px-4 flex flex-col gap-4 pb-24">
        {/* Single Digit */}
        <div className="jackpot-card">
          <div className="jackpot-card-header">
            <div className="flex gap-2 items-center">
              <div className="text-2xl">💰</div>
              <div>
                <div className="text-sm font-bold">Single Digit <span className="text-red-600">Win ₹100</span></div>
                <div className="text-xs text-red-600 font-bold">₹11.00</div>
              </div>
            </div>
            <button onClick={handleRandom} className="jackpot-btn-random">Random</button>
          </div>

          {['A', 'B', 'C'].map(board => (
            <div key={board} className="flex items-center justify-between mt-3">
              <div className="jackpot-board-circle">{board}</div>
              <input 
                type="text" 
                maxLength="1" 
                className="jackpot-input" 
                value={singleDigits[board]}
                onChange={(e) => setSingleDigits(prev => ({ ...prev, [board]: e.target.value.replace(/\D/g, '') }))}
              />
              <div className="jackpot-qty-control">
                <button onClick={() => handleQtyChange(board, -1)}><Minus size={14} /></button>
                <span>{singleDigits[`qty${board}`]}</span>
                <button onClick={() => handleQtyChange(board, 1)}><Plus size={14} /></button>
              </div>
              <button className="jackpot-btn-add">ADD</button>
            </div>
          ))}
        </div>

        {/* Double Digit */}
        <div className="jackpot-card">
          <div className="jackpot-card-header">
            <div className="flex gap-2 items-center">
              <div className="text-2xl">💰</div>
              <div>
                <div className="text-sm font-bold">Double Digits <span className="text-red-600">Win ₹1000</span></div>
                <div className="text-xs text-red-600 font-bold">₹11.00</div>
              </div>
            </div>
            <button className="jackpot-btn-random">Random</button>
          </div>

          {['AB', 'BC', 'AC'].map(board => (
            <div key={board} className="flex items-center justify-between mt-3">
              <div className="flex gap-1">
                <div className="jackpot-board-circle">{board[0]}</div>
                <div className="jackpot-board-circle">{board[1]}</div>
              </div>
              <div className="flex gap-1">
                <input type="text" maxLength="1" className="jackpot-input-small" />
                <input type="text" maxLength="1" className="jackpot-input-small" />
              </div>
              <div className="jackpot-qty-control">
                <button><Minus size={14} /></button>
                <span>1</span>
                <button><Plus size={14} /></button>
              </div>
              <button className="jackpot-btn-add">ADD</button>
            </div>
          ))}
        </div>

        {/* Three Digits */}
        {[6250, 15000, 17500, 30000, 35000].map((win, idx) => (
          <div key={idx} className="jackpot-card">
            <div className="jackpot-card-header">
              <div className="flex gap-2 items-center">
                <div className="text-2xl">💰</div>
                <div>
                  <div className="text-sm font-bold">Three Digits <span className="text-red-600">Win ₹{win.toLocaleString()}</span></div>
                  <div className="text-xs text-red-600 font-bold">₹{12 + idx * 10}.00</div>
                </div>
              </div>
              <button className="jackpot-btn-random">Random</button>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-1">
                <div className="jackpot-board-circle">A</div>
                <div className="jackpot-board-circle">B</div>
                <div className="jackpot-board-circle">C</div>
              </div>
              <div className="flex gap-1">
                <input type="text" maxLength="1" className="jackpot-input-small" />
                <input type="text" maxLength="1" className="jackpot-input-small" />
                <input type="text" maxLength="1" className="jackpot-input-small" />
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="jackpot-qty-control">
                <button><Minus size={14} /></button>
                <span>1</span>
                <button><Plus size={14} /></button>
              </div>
              <div className="flex gap-2">
                <button className="jackpot-btn-box">BOX</button>
                <button className="jackpot-btn-add">ADD</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pay Now Footer */}
      <div style={{ position: 'fixed', bottom: '15px', left: '15px', right: '15px', maxWidth: '450px', margin: '0 auto', zIndex: 100 }}>
        <button 
          onClick={() => navigate('/cart')}
          style={{ 
            width: '100%', 
            backgroundColor: '#ff0040', 
            color: 'white', 
            padding: '12px', 
            borderRadius: '10px', 
            border: 'none', 
            fontFamily: 'Inter', 
            fontWeight: '900',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 4px 15px rgba(255, 32, 86, 0.4)',
            textTransform: 'uppercase'
          }}
        >
          <ShoppingCart size={24} /> Pay now
        </button>
      </div>

    </PageWrapper>
  );
};

export default JackpotPage;
