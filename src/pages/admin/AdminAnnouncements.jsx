import React, { useState, useEffect, useMemo } from 'react';
import { 
  Megaphone, 
  Trash2, 
  Edit3, 
  Trophy, 
  Clock, 
  Ticket,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Eye,
  ShieldCheck,
  Zap,
  LayoutGrid,
  ListFilter,
  Plus
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

const AdminAnnouncements = () => {
  const { purchasedTickets, addResult } = useCart();
  const [activeTab, setActiveTab] = useState('dispatch'); 
  const [selectedSlot, setSelectedSlot] = useState({ draw: '01:00 PM', brand: 'DEAR' });
  
  const [winPositions, setWinPositions] = useState([
    { position: '1st Prize', amount: '50000', winners: 1, number: '' },
    { position: '2nd Prize', amount: '10000', winners: 5, number: '' },
    { position: '3rd Prize', amount: '1000', winners: 20, number: '' },
  ]);

  const draws = ['01:00 PM', '03:00 PM', '06:00 PM', '08:00 PM', '10:30 AM (JP)', '01:30 PM (JP)'];

  const currentSlotAnalysis = useMemo(() => {
    const filtered = purchasedTickets.filter(t => t.title.includes(selectedSlot.draw));
    const combinationMap = {};
    filtered.forEach(t => {
      combinationMap[t.num] = (combinationMap[t.num] || 0) + 1;
    });

    const topCombinations = Object.entries(combinationMap)
      .map(([num, count]) => ({
        num,
        count,
        risk: count > 50 ? 'High' : count > 20 ? 'Medium' : 'Low'
      }))
      .sort((a, b) => b.count - a.count);

    return {
      totalTickets: filtered.length,
      uniqueCombinations: topCombinations.length,
      topCombinations: topCombinations.slice(0, 10),
      rawTickets: filtered
    };
  }, [purchasedTickets, selectedSlot]);

  const handleAddPosition = () => {
    setWinPositions([...winPositions, { position: `Prize ${winPositions.length + 1}`, amount: '0', winners: 0, number: '' }]);
  };

  const handleUpdatePosition = (idx, field, val) => {
    const newPositions = [...winPositions];
    newPositions[idx][field] = val;
    setWinPositions(newPositions);
  };

  const handleDeclareResult = () => {
    if (winPositions.some(p => !p.number)) {
      return alert("Please enter winning numbers for all prize positions");
    }
    
    // Prepare result data for the global context
    const resultData = {
      draw: selectedSlot.draw,
      brand: selectedSlot.brand,
      winPositions: winPositions.map(p => ({
        position: p.position,
        number: p.number,
        amount: p.amount
      })),
      number: winPositions[0].number // Primary display number
    };
    
    addResult(resultData);
    
    // Reset winning numbers only, keep configuration
    setWinPositions(winPositions.map(p => ({ ...p, number: '' })));
    
    alert("Results Declared Successfully! Winners have been allocated prizes and wallets refreshed.");
    setActiveTab('analysis'); 
  };

  return (
    <div className="space-y-8 p-4 pb-24">
      {/* Header Tabs */}
      <div className="flex bg-white rounded-2xl p-2 shadow-lg border border-gray-100 mb-4">
        {[
          { id: 'dispatch', label: 'Result Dispatch', icon: Zap },
          { id: 'analysis', label: 'Slot Intelligence', icon: TrendingUp },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
              activeTab === tab.id ? 'bg-[#ff004d] text-white shadow-xl shadow-[#ff004d]/20' : 'text-gray-400 hover:bg-gray-50'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'dispatch' && (
        <div className="space-y-6">
          <div className="border-[1.5px] border-[#ff004d] rounded-[2.5rem] p-8 bg-white shadow-2xl relative overflow-hidden group">
            <div className="flex gap-4 mb-10 border-b border-gray-100 pb-6">
              <img src="https://img.icons8.com/color/64/000000/treasure-chest.png" alt="Chest" className="w-16 h-16 drop-shadow-xl" />
              <div className="flex-grow">
                <h2 className="text-2xl font-black text-gray-900 font-condensed uppercase tracking-tighter italic leading-none">Market Dispatcher</h2>
                <p className="text-[#ff004d] font-black text-[10px] uppercase tracking-widest leading-none mt-1">Official Prize Allocation</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Draw Event</label>
                  <select 
                    value={selectedSlot.draw}
                    onChange={(e) => setSelectedSlot({...selectedSlot, draw: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 h-14 font-bold text-gray-700 outline-none focus:border-[#ff004d]/30 text-xs"
                  >
                    {draws.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                  <select 
                    value={selectedSlot.brand}
                    onChange={(e) => setSelectedSlot({...selectedSlot, brand: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 h-14 font-bold text-gray-700 outline-none focus:border-[#ff004d]/30 text-xs"
                  >
                    <option value="DEAR">DEAR LOTTERY</option>
                    <option value="KERALA">KERALA STATE</option>
                    <option value="JACKPOT">DIAMOND JP</option>
                  </select>
                </div>
              </div>

              {/* Multi-Position Result Entry */}
              <div className="space-y-5">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-[#ff004d]">Winning Numbers & Prize Allocation</h3>
                  <button onClick={handleAddPosition} className="bg-gray-50 p-1.5 rounded-lg text-[#ff004d] hover:bg-red-50 transition-colors">
                    <Plus size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  {winPositions.map((pos, i) => (
                    <div key={i} className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100 space-y-4 shadow-sm group hover:border-[#ff004d]/20 transition-all">
                      <div className="flex justify-between items-center">
                         <div className="flex items-center gap-2">
                            <input 
                              type="text" 
                              value={pos.position} 
                              onChange={(e) => handleUpdatePosition(i, 'position', e.target.value)}
                              className="bg-transparent font-black text-[10px] uppercase tracking-widest text-gray-400 outline-none focus:text-[#ff004d]"
                            />
                         </div>
                         <button onClick={() => setWinPositions(winPositions.filter((_, idx) => idx !== i))} className="text-gray-200 hover:text-red-500 transition-colors">
                            <Trash2 size={14} />
                         </button>
                      </div>

                      <div className="flex gap-3">
                         <div className="flex-grow space-y-1.5">
                            <div className="relative">
                               <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 opacity-50" size={14} />
                               <input 
                                 type="text" 
                                 placeholder="WINNING NO." 
                                 className="w-full h-12 bg-white border border-gray-100 rounded-xl pl-10 pr-4 outline-none font-black text-gray-800 text-sm focus:border-amber-500/30 shadow-inner"
                                 value={pos.number}
                                 onChange={(e) => handleUpdatePosition(i, 'number', e.target.value)}
                               />
                            </div>
                         </div>
                         <div className="w-24 space-y-1.5">
                            <div className="relative">
                               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 font-bold text-[8px]">₹</span>
                               <input 
                                 type="number" 
                                 placeholder="AMT" 
                                 className="w-full h-12 bg-white border border-gray-100 rounded-xl pl-6 pr-3 outline-none font-black text-[#ff004d] text-sm shadow-inner"
                                 value={pos.amount}
                                 onChange={(e) => handleUpdatePosition(i, 'amount', e.target.value)}
                               />
                            </div>
                         </div>
                         <div className="w-16 space-y-1.5">
                            <input 
                              type="number" 
                              placeholder="WIN" 
                              className="w-full h-12 bg-white border border-gray-100 rounded-xl px-3 outline-none font-black text-gray-500 text-[10px] text-center shadow-inner"
                              value={pos.winners}
                              onChange={(e) => handleUpdatePosition(i, 'winners', e.target.value)}
                            />
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleDeclareResult}
                className="w-full h-16 bg-[#ff004d] text-white py-4 rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-xl shadow-[#ff004d]/20 active:scale-95 transition-all flex items-center justify-center gap-3 mt-4 border-b-4 border-black/20"
              >
                Sync & Declare Winners <Trophy size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analysis' && (
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl space-y-8">
            <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shadow-sm border border-amber-100">
                <TrendingUp size={28} />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-black text-gray-900 font-condensed uppercase tracking-tighter italic leading-none">{selectedSlot.draw} Analytics</h3>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">Intake distribution summary</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 relative overflow-hidden group">
                 <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Intake</p>
                 <p className="text-2xl font-black text-gray-900 italic tracking-tighter leading-none">{currentSlotAnalysis.totalTickets}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 relative overflow-hidden group">
                 <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Unique Codes</p>
                 <p className="text-2xl font-black text-gray-900 italic tracking-tighter leading-none">{currentSlotAnalysis.uniqueCombinations}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between ml-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#ff004d]">Most Purchased</h4>
              </div>

              <div className="space-y-2">
                {currentSlotAnalysis.topCombinations.length === 0 ? (
                  <p className="text-center py-10 text-[10px] font-black text-gray-300 uppercase italic">No activity for this slot</p>
                ) : (
                  currentSlotAnalysis.topCombinations.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center font-black text-xs italic border-b-2 border-red-600">
                             {item.num}
                          </div>
                          <div>
                             <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Buy Count</p>
                             <p className="text-sm font-black text-gray-800">{item.count} Tickets</p>
                          </div>
                       </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-50">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 ml-2">Recent Order Feed</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {currentSlotAnalysis.rawTickets.map((t, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-50">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white border border-gray-100 rounded-lg flex items-center justify-center shadow-sm"><Ticket size={14} className="text-gray-200" /></div>
                        <div>
                           <p className="text-[9px] font-black text-gray-800 leading-none italic">{t.purchaseId}</p>
                           <p className="text-[7px] font-bold text-gray-400 uppercase mt-1">{t.purchaseTime.split(',')[1]}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-[9px] font-black text-[#ff004d] leading-none mb-0.5">{t.num}</p>
                        <p className="text-[7px] font-bold text-gray-400 uppercase">Qty: {t.qty}</p>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncements;
