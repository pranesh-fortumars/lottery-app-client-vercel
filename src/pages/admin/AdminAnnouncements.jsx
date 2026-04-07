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
  Plus,
  Layers,
  Search,
  Activity,
  Calendar,
  DollarSign,
  Gamepad2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Filter,
  History,
  Layout,
  Lock,
  BarChart3,
  PieChart,
  Shapes,
  Maximize2,
  List,
  Target
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

const AdminAnnouncements = () => {
  const { purchasedTickets, addResult, declaredResults } = useCart();
  const [activeTab, setActiveTab] = useState('dispatch'); 
  
  // Workflow Navigation State
  const [workflowStep, setWorkflowStep] = useState('root'); 
  const [marketSelection, setMarketSelection] = useState(null); 
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Monitor Detail State
  const [showDetailSlot, setShowDetailSlot] = useState(null);

  // Result History Date Filter
  const [historyDate, setHistoryDate] = useState(new Date().toISOString().split('T')[0]);

  // 4-Column Result Entry
  const [resultDigits, setResultDigits] = useState({ X: '', A: '', B: '', C: '' });

  // Prize Rewards Configuration
  const [prizeConfigs, setPrizeConfigs] = useState({
    '1D': { A: '100', B: '100', C: '100' },
    '2D': { AB: '500', BC: '500', AC: '500' },
    '3D': { ABC: '2000' },
    '4D': { XABC: '10000' }
  });

  const drawAssignments = {
    'DEAR': ['01:00 PM', '06:00 PM', '08:00 PM'],
    'KERALA': ['03:00 PM']
  };

  const isDrawFinished = (timeStr) => {
    if (!timeStr) return false;
    const now = new Date();
    const parts = timeStr.match(/(\d+)[.:](\d+)\s*(AM|PM)/);
    if (!parts) return true;
    let h = parseInt(parts[1]);
    if (parts[3] === 'PM' && h !== 12) h += 12;
    if (parts[3] === 'AM' && h === 12) h = 0;
    const d = new Date();
    d.setHours(h, parseInt(parts[2]), 0, 0);
    return (d - now) <= 0;
  };

  // --- 📊 DYNAMIC MARKET ANALYSIS ENGINE (Frequency Tracking) ---
  const dynamicAnalyticFeed = useMemo(() => {
    const feed = {};
    const slots = Object.values(drawAssignments).flat();
    
    slots.forEach(s => {
      const tickets = purchasedTickets.filter(t => t.title.includes(s));
      
      // Frequency Map for specific numbers
      const numFrequencies = {};
      tickets.forEach(t => {
        const key = `${t.type}_${t.pos}_${t.num}`;
        if (!numFrequencies[key]) {
           numFrequencies[key] = { num: t.num, type: t.type, pos: t.pos, qty: 0, totalVal: 0 };
        }
        numFrequencies[key].qty += t.qty;
        numFrequencies[key].totalVal += (t.qty * t.price);
      });

      const sortedNumbers = Object.values(numFrequencies).sort((a, b) => b.qty - a.qty);

      const breakdown = {
        '1D': tickets.filter(t => t.type === '1D').reduce((sum, t) => sum + t.qty, 0),
        '2D': tickets.filter(t => t.type.includes('2D')).reduce((sum, t) => sum + t.qty, 0),
        '3D': tickets.filter(t => t.type === '3D').reduce((sum, t) => sum + t.qty, 0),
        '4D': tickets.filter(t => t.type === '4D').reduce((sum, t) => sum + t.qty, 0),
        posA: tickets.filter(t => t.pos?.includes('A')).reduce((sum, t) => sum + t.qty, 0),
        posB: tickets.filter(t => t.pos?.includes('B')).reduce((sum, t) => sum + t.qty, 0),
        posC: tickets.filter(t => t.pos?.includes('C')).reduce((sum, t) => sum + t.qty, 0),
        totalQty: tickets.reduce((sum, t) => sum + t.qty, 0),
        totalValue: tickets.reduce((sum, t) => sum + (t.qty * t.price), 0),
        topNumbers: sortedNumbers,
        ready: isDrawFinished(s)
      };
      feed[s] = breakdown;
    });
    return feed;
  }, [purchasedTickets]);

  const filteredHistory = useMemo(() => {
    const d = new Date(historyDate).toLocaleDateString();
    return declaredResults.filter(r => r.date === d);
  }, [declaredResults, historyDate]);

  const handleDigitChange = (col, val) => { if (val.length <= 1) setResultDigits({ ...resultDigits, [col]: val }); };

  const handleDeclareResult = () => {
    const { X, A, B, C } = resultDigits;
    if (!X || !A || !B || !C) return alert("Please enter all 4 result digits.");
    const already = declaredResults.find(r => r.draw === selectedSlot && r.date === new Date().toLocaleDateString());
    if (already) return alert("Error: Results for this slot are already declared.");
    addResult({ draw: selectedSlot, brand: marketSelection === 'DEAR' ? 'DEARLOT' : 'KERELALOT', digits: resultDigits, prizes: prizeConfigs });
    alert(`RESULT ANNOUNCED: ${X}${A}${B}${C}`);
    setWorkflowStep('root');
    setResultDigits({ X: '', A: '', B: '', C: '' });
  };

  const exportToPDF = () => alert("Preparing PDF...");

  return (
    <div className="space-y-8 p-4 pb-24 h-full bg-[#f8fbff] overflow-y-auto scrollbar-hide">
      
      {/* Navigation */}
      <div className="flex bg-white rounded-2xl p-2 shadow-sm border border-gray-100 sticky top-0 z-[100]">
        {[
          { id: 'dispatch', label: 'Dispatch', icon: Zap },
          { id: 'analysis', label: 'Monitor', icon: TrendingUp },
          { id: 'history', label: 'History', icon: History }
        ].map(tab => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); setShowDetailSlot(null); }} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#ff0000] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'dispatch' && (
        <div className="space-y-6">
          {workflowStep === 'root' && (
            <div className="grid grid-cols-2 gap-4 animate-in zoom-in-95 h-[300px]">
               <button onClick={() => setWorkflowStep('market')} className="bg-white rounded-[2.5rem] shadow-2xl border-2 border-transparent hover:border-[#ff0000] flex flex-col items-center justify-center space-y-4 group">
                  <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-[#ff0000] group-hover:scale-110 shadow-lg"><Trophy size={32} /></div>
                  <p className="text-xl font-black font-condensed tracking-tighter uppercase italic">Result</p>
               </button>
               <button className="bg-white rounded-[2.5rem] shadow-2xl border-2 border-transparent opacity-30 cursor-not-allowed flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500"><Layout size={32} /></div>
                  <p className="text-xl font-black font-condensed tracking-tighter uppercase italic">Scheme</p>
               </button>
            </div>
          )}
          {workflowStep === 'market' && (
            <div className="animate-in slide-in-from-right-4 space-y-6 bg-white p-8 rounded-[2.5rem] shadow-2xl">
               <div className="flex justify-between items-center pb-6 border-b border-gray-50">
                  <h3 className="text-lg font-black font-condensed uppercase italic">Select Market</h3>
                  <button onClick={() => setWorkflowStep('root')} className="text-[10px] font-black uppercase text-gray-300">Back</button>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  {['DEAR', 'KERALA'].map(m => (
                    <button key={m} onClick={() => { setMarketSelection(m); setWorkflowStep('slot'); }} className="p-8 rounded-[1.5rem] bg-gray-50 border border-gray-100 hover:border-[#ff0000] transition-all text-center">
                       <p className="text-xl font-black font-condensed italic">{m}</p>
                    </button>
                  ))}
               </div>
            </div>
          )}
          {workflowStep === 'slot' && (
            <div className="animate-in slide-in-from-right-4 space-y-6 bg-white p-8 rounded-[2.5rem] shadow-2xl">
               <div className="flex justify-between items-center pb-6 border-b border-gray-50">
                  <h3 className="text-lg font-black font-condensed uppercase italic">{marketSelection} Slots</h3>
                  <button onClick={() => setWorkflowStep('market')} className="text-[10px] font-black uppercase text-gray-300">Back</button>
               </div>
               <div className="grid grid-cols-1 gap-3">
                  {drawAssignments[marketSelection].map(slot => {
                    const stats = dynamicAnalyticFeed[slot];
                    return (
                      <button key={slot} onClick={() => { setSelectedSlot(slot); setWorkflowStep('declare'); }} className={`p-5 rounded-2xl border flex justify-between items-center ${stats.ready ? 'bg-red-50 border-red-500 shadow-md' : 'bg-gray-50'}`}>
                         <div className="flex items-center gap-3">
                            {!stats.ready && <Lock size={14} className="text-gray-400" />}
                            <p className="text-lg font-black font-condensed italic">{slot}</p>
                         </div>
                         <div className="text-right">
                            <p className={`text-[8px] font-black uppercase px-2 py-1 rounded-md ${stats.ready ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-600'}`}>{stats.ready ? 'READY TO DECLARE' : 'INTAKE OPEN'}</p>
                            <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase">Tickets: {stats.totalQty}</p>
                         </div>
                      </button>
                    );
                  })}
               </div>
            </div>
          )}
          {workflowStep === 'declare' && (
            <div className="animate-in slide-in-from-bottom-6 duration-500 space-y-6">
               <div className="bg-gray-900 rounded-3xl p-6 text-white flex justify-between items-center border-l-[10px] border-[#ff0000]">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-red-500"><Zap size={24} /></div>
                     <div><p className="text-[9px] font-black uppercase opacity-60 tracking-[.2em]">{marketSelection}</p><h2 className="text-2xl font-black font-condensed italic">{selectedSlot}</h2></div>
                  </div>
                  <button onClick={() => setWorkflowStep('slot')} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"><Trash2 size={18} /></button>
               </div>
               <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 space-y-8">
                    <div className="grid grid-cols-4 gap-4">
                        {['X', 'A', 'B', 'C'].map(col => (
                        <div key={col} className="space-y-2 text-center">
                            <label className="text-[9px] font-black uppercase text-gray-400">{col === 'X' ? 'X / D' : col}</label>
                            <input type="number" value={resultDigits[col]} onChange={(e) => handleDigitChange(col, e.target.value)} className="w-full h-20 bg-gray-50 border-2 border-gray-100 rounded-2xl text-center text-4xl font-black focus:border-[#ff0000] outline-none" />
                        </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-4">
                            <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">1D Prizes</p>
                            {['A', 'B', 'C'].map(p => (
                            <div key={p} className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-black text-gray-400 italic">{p}</span>
                                <input type="number" value={prizeConfigs['1D'][p]} onChange={(e) => setPrizeConfigs({...prizeConfigs, '1D': {...prizeConfigs['1D'], [p]: e.target.value}})} className="w-20 bg-white border border-gray-200 rounded-lg py-1 px-2 text-xs font-black" />
                            </div>
                            ))}
                        </div>
                        <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-4">
                            <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">2D Prizes</p>
                            {['AB', 'BC', 'AC'].map(p => (
                            <div key={p} className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-black text-gray-400 italic">{p}</span>
                                <input type="number" value={prizeConfigs['2D'][p]} onChange={(e) => setPrizeConfigs({...prizeConfigs, '2D': {...prizeConfigs['2D'], [p]: e.target.value}})} className="w-20 bg-white border border-gray-200 rounded-lg py-1 px-2 text-xs font-black" />
                            </div>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                           <p className="text-[9px] font-black text-red-500 uppercase mb-3">3D Prize</p>
                           <input type="number" value={prizeConfigs['3D'].ABC} onChange={(e) => setPrizeConfigs({...prizeConfigs, '3D': {...prizeConfigs['3D'], ABC: e.target.value}})} className="w-full bg-white border border-gray-200 rounded-lg py-3 px-4 text-sm font-black" />
                        </div>
                        <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                           <p className="text-[9px] font-black text-red-500 uppercase mb-3">4D Prize</p>
                           <input type="number" value={prizeConfigs['4D'].XABC} onChange={(e) => setPrizeConfigs({...prizeConfigs, '4D': {...prizeConfigs['4D'], XABC: e.target.value}})} className="w-full bg-white border border-gray-200 rounded-lg py-3 px-4 text-sm font-black" />
                        </div>
                    </div>
                    <button onClick={handleDeclareResult} className="w-full bg-[#ff0000] text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all">DECLARE RESULT & PAYOUT</button>
               </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'analysis' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          {!showDetailSlot ? (
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-50 space-y-8">
              <div className="flex items-center gap-3">
                 <BarChart3 className="text-[#ff0000]" size={24} />
                 <h3 className="font-condensed font-black text-xl italic uppercase font-bold tracking-tighter">Live Market Monitor</h3>
              </div>

              {Object.keys(drawAssignments).map(mKey => (
                 <div key={mKey} className="space-y-4">
                    <div className="flex items-center gap-2">
                       <div className="h-4 w-1 bg-[#ff0000] rounded-full"></div>
                       <h4 className="text-[12px] font-black uppercase tracking-widest text-gray-900">{mKey} MARKET</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                       {drawAssignments[mKey].map(slot => {
                          const data = dynamicAnalyticFeed[slot];
                          return (
                             <div key={slot} onClick={() => setShowDetailSlot(slot)} className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100 flex flex-col gap-6 hover:border-red-500 transition-all cursor-pointer group">
                                <div className="flex justify-between items-center">
                                   <div className="flex items-center gap-3">
                                      <Clock size={16} className="text-[#ff0000]" />
                                      <p className="text-lg font-black font-condensed italic">{slot}</p>
                                   </div>
                                   <div className="flex items-center gap-3">
                                      <div className="text-right">
                                         <p className="text-[10px] font-black text-[#ff0000] uppercase tracking-tighter">Total Qty</p>
                                         <p className="text-xl font-black font-condensed italic">{data.totalQty}</p>
                                      </div>
                                      <ChevronRight size={20} className="text-gray-200 group-hover:text-red-500 transition-colors" />
                                   </div>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                   {['1D', '2D', '3D', '4D'].map(type => (
                                     <div key={type} className="bg-white p-3 rounded-2xl border border-gray-100 text-center">
                                        <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest mb-1">{type}</p>
                                        <p className="text-sm font-black italic">{data[type]}</p>
                                     </div>
                                   ))}
                                </div>
                             </div>
                          );
                       })}
                    </div>
                 </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4">
               <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white flex justify-between items-center shadow-2xl">
                  <div className="flex items-center gap-4">
                     <button onClick={() => setShowDetailSlot(null)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"><ChevronRight size={20} className="rotate-180" /></button>
                     <div>
                        <p className="text-[10px] font-black uppercase text-red-500 tracking-[.2em] mb-1">Detailed Intake</p>
                        <h4 className="text-2xl font-black font-condensed italic leading-none">{showDetailSlot}</h4>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-[9px] font-black uppercase opacity-60">Total Tickets</p>
                     <p className="text-2xl font-black font-condensed italic">₹ {dynamicAnalyticFeed[showDetailSlot].totalValue.toLocaleString()}</p>
                  </div>
               </div>

               <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-50 space-y-6">
                  <div className="flex items-center gap-3 border-b border-gray-100 pb-6">
                     <Target className="text-[#ff0000]" size={20} />
                     <h5 className="text-[11px] font-black uppercase tracking-widest italic">Number Frequency Matrix</h5>
                  </div>
                  
                  {dynamicAnalyticFeed[showDetailSlot].topNumbers.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                       {dynamicAnalyticFeed[showDetailSlot].topNumbers.map((item, idx) => (
                         <div key={idx} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-[#ff0000] transition-all">
                            <div className="flex items-center gap-6">
                               <div className="w-10 h-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center font-black text-xs text-[#ff0000] shadow-sm">{idx + 1}</div>
                               <div>
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">
                                     {item.type} | {item.pos}
                                  </p>
                                  <div className="flex gap-2">
                                     {String(item.num).split('').map((n, i) => (
                                       <span key={i} className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center font-black text-lg shadow-sm border-b-2 border-red-600">{n}</span>
                                     ))}
                                  </div>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-[9px] font-black uppercase text-red-500 mb-1">Purchased</p>
                               <div className="text-xl font-black font-condensed italic flex items-baseline gap-1">
                                  {item.qty} <span className="text-[9px] text-gray-400 NOT-italic font-bold uppercase">Tickets</span>
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 opacity-20 italic">No tickets purchased for this slot yet.</div>
                  )}
               </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="p-4 bg-white animate-in slide-in-from-bottom-4">
           <div className="flex items-center justify-between mb-8 border-b-2 border-red-100 pb-6 px-2">
              <div className="flex flex-col gap-1">
                 <label className="text-[8px] font-black uppercase tracking-widest text-[#ff0000]">Record Date</label>
                 <input type="date" value={historyDate} onChange={(e) => setHistoryDate(e.target.value)} className="bg-transparent border-none font-black text-xl outline-none cursor-pointer" />
              </div>
              <button onClick={exportToPDF} className="bg-[#ff0000] text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-red-100"><Download size={14} /> Download</button>
           </div>
           
           <div className="space-y-6">
              {filteredHistory.length > 0 ? filteredHistory.map((res, i) => (
                <div key={i} className="official-result-card relative transition-all hover:scale-[1.01] animate-in slide-in-from-left duration-500">
                  <table cellPadding="10">
                    <tbody>
                      <tr><td>Date</td><td>{res.date}</td></tr>
                      <tr><td>Time</td><td>{res.draw}</td></tr>
                      <tr><td>Lot Name</td><td>{res.brand}</td></tr>
                      <tr><td>Result Number</td><td><div className="flex items-center">{res.number.split('').map((digit, idx) => (<span key={idx} className="result-circle">{digit}</span>))}</div></td></tr>
                    </tbody>
                  </table>
                </div>
              )) : <div className="text-center py-20 opacity-30 font-serif-official italic text-xl">Records Empty for this date.</div>}
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncements;
