import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';

const CountdownTimer = ({ drawTime }) => {
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });

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
      
      let diff = drawDate - now;
      if (diff < 0) {
        setTimeLeft({ h: '00', m: '00', s: '00' });
        return;
      }

      const h = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
      const m = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
      const s = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');

      setTimeLeft({ h, m, s });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [drawTime]);

  return (
    <div className="countdown-timer" style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
      <div style={{ backgroundColor: '#ffffff', color: '#000', padding: '5px 8px', borderRadius: '4px', fontWeight: '800', fontSize: '1.1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{timeLeft.h}</div>
      <div style={{ backgroundColor: '#ffffff', color: '#000', padding: '5px 8px', borderRadius: '4px', fontWeight: '800', fontSize: '1.1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{timeLeft.m}</div>
      <div style={{ backgroundColor: '#ffffff', color: '#000', padding: '5px 8px', borderRadius: '4px', fontWeight: '800', fontSize: '1.1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{timeLeft.s}</div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();

  const games = [
    { time: '01:00 PM', logo: 'DEAR', type: 'dear' },
    { time: '03:00 PM', logo: 'Kerala Lottery', type: 'kerala' },
    { time: '06:00 PM', logo: 'DEAR', type: 'dear' },
    { time: '08:00 PM', logo: 'DEAR', type: 'dear' }
  ];

  return (
    <div className="app-content" style={{ backgroundColor: '#ffffff' }}>
      
      {/* Hero Banner Area */}
      <div style={{ padding: '15px' }}>
        <img 
          src="/images/hero_banner.png" 
          alt="Hero Banner" 
          style={{ width: '100%', borderRadius: '25px', display: 'block', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
        />
      </div>

      {/* Red Promo Bar */}
      <div style={{ backgroundColor: '#ff0000', color: 'white', padding: '10px 15px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <Mail size={24} />
      </div>

      {/* 3 & 4 Digits Game Title */}
      <div style={{ padding: '20px 15px 15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '1.6rem', filter: 'drop-shadow(0 2px 4px rgba(255,0,0,0.3))' }}>💎</span>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ff0000', margin: 0 }}>3 & 4 Digits Game</h2>
      </div>

      {/* Games Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', padding: '0 15px 30px' }}>
        {games.map((game, idx) => (
          <div 
            key={idx} 
            className="game-card" 
            onClick={() => navigate(`/select/${idx + 1}`)}
            style={{ 
              background: 'linear-gradient(135deg, #001f3f 0%, #000c19 100%)',
              padding: '15px',
              borderRadius: '15px',
              position: 'relative',
              overflow: 'hidden',
              height: '140px'
            }}
          >
            {/* Geometric Gold Lines */}
            <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '100%', height: '120%', borderRight: '2px solid rgba(255,215,0,0.2)', borderTop: '2px solid rgba(255,215,0,0.2)', transform: 'skewX(-25deg)', pointerEvents: 'none' }}></div>
            
            <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 'bold', opacity: 0.9 }}>Next Lottery</div>
                <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 'bold', opacity: 0.9 }}>Booking Time</div>
                <CountdownTimer drawTime={game.time} />
              </div>
              
              <div style={{ textAlign: 'right' }}>
                {game.type === 'dear' ? (
                  <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ color: '#ffd700', fontWeight: '900', fontSize: '1.1rem', letterSpacing: '0.5px' }}>DEAR</span>
                    <span style={{ color: '#00ccff', fontSize: '0.55rem', fontWeight: '900' }}>LOTTERY</span>
                  </div>
                ) : (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '15px' }}>
                     <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#00ff00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#000', fontWeight: 'bold' }}>K</div>
                     <span style={{ color: '#00ff00', fontSize: '0.6rem', fontWeight: 'bold' }}>Kerala Lottery</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Jackpot Title */}
      <div style={{ padding: '0 15px 15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '1.6rem' }}>💎</span>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ff0000', margin: 0 }}>Jackpot</h2>
      </div>

      {/* Jackpot Banner */}
      <div style={{ padding: '0 15px 25px' }}>
        <img 
          src="/images/jackpot_banner.png" 
          alt="Jackpot Banner" 
          style={{ width: '100%', borderRadius: '15px', display: 'block', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
        />
      </div>

      {/* Jackpot Choice Buttons */}
      <div style={{ display: 'flex', gap: '15px', padding: '0 40px 60px' }}>
        <button 
          className="jackpot-btn" 
          onClick={() => navigate('/jackpot')}
          style={{ backgroundColor: '#ff0044', color: 'white', flex: 1, padding: '12px', borderRadius: '6px', border: 'none', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer' }}
        >
          Wins Wins
        </button>
        <button 
          className="jackpot-btn" 
          onClick={() => navigate('/jackpot')}
          style={{ backgroundColor: '#ff0044', color: 'white', flex: 1, padding: '12px', borderRadius: '6px', border: 'none', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer' }}
        >
          JackPot
        </button>
      </div>

      <div style={{ height: '40px' }} />
    </div>
  );
};

export default Dashboard;
